import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createEntryFlowServer } from '../server/index.js';
import { runLocalReview } from '../src/retrieval.js';

async function start(server, context) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  context.after(() => new Promise((accept, reject) => {
    server.close((error) => error ? reject(error) : accept());
  }));
  return `http://127.0.0.1:${server.address().port}`;
}

function post(url, inputs) {
  return fetch(`${url}/api/ai/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  });
}

test('server delivers static build and worker JS with AI disabled by default', async (context) => {
  const directory = await mkdtemp(join(tmpdir(), 'entryflow-static-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'assets'));
  await writeFile(join(directory, 'index.html'), '<h1>EntryFlow</h1>');
  await writeFile(join(directory, 'assets', 'pdf.worker.mjs'), 'export {};');
  const origin = await start(createEntryFlowServer({ env: {}, distDirectory: directory }), context);
  const page = await fetch(origin);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /EntryFlow/u);
  const worker = await fetch(`${origin}/assets/pdf.worker.mjs`, { method: 'HEAD' });
  assert.match(worker.headers.get('content-type'), /javascript/u);
  assert.equal((await fetch(`${origin}/.env`)).status, 404);
  assert.equal((await fetch(`${origin}/%2e%2e%2fpackage.json`)).status, 404);
  assert.deepEqual(await (await fetch(`${origin}/api/ai/status`)).json(), { available: false });
  assert.equal((await post(origin, {})).status, 503);
});

test('RAG sends only matching excerpts and validates every returned citation using the original', async (context) => {
  const captured = [];
  let citations = [2];
  const upstream = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    captured.push({
      url: request.url,
      auth: request.headers.authorization,
      body: JSON.parse(Buffer.concat(chunks).toString('utf8')),
    });
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({ answer: '公开仓库需要供评审访问。', citations }) } }],
    }));
  });
  const upstreamOrigin = await start(upstream, context);
  const origin = await start(createEntryFlowServer({ env: {
    ENTRYFLOW_AI_BASE_URL: `${upstreamOrigin}/v1/`,
    ENTRYFLOW_AI_API_KEY: 'mock-test-key',
    ENTRYFLOW_AI_MODEL: 'mock-model',
  } }), context);
  assert.deepEqual(await (await fetch(`${origin}/api/ai/status`)).json(), { available: true });

  const inputs = {
    ruleText: '作品应遵守版权要求。\n公开仓库需要供评审访问。\n每队应由三人组成。',
    projectSummary: '当前仓库尚未公开。',
    query: '公开仓库',
  };
  const response = await post(origin, inputs);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    answer: '公开仓库需要供评审访问。',
    citations: [{ line: 2, text: '公开仓库需要供评审访问。' }],
  });
  assert.equal(captured[0].url, '/v1/chat/completions');
  assert.equal(captured[0].auth, 'Bearer mock-test-key');
  assert.equal(captured[0].body.model, 'mock-model');
  const payload = JSON.parse(captured[0].body.messages[1].content);
  assert.deepEqual(payload, {
    query: inputs.query,
    projectSummary: inputs.projectSummary,
    excerpts: [{ line: 2, text: '公开仓库需要供评审访问。' }],
  });

  citations = [2, 99];
  assert.equal((await post(origin, inputs)).status, 502);
  citations = [];
  assert.equal((await post(origin, inputs)).status, 502);
  assert.equal((await post(origin, { ...inputs, query: '停车场' })).status, 422);
  assert.equal((await post(origin, { ...inputs, query: '仓'.repeat(301) })).status, 413);
  assert.equal(captured.length, 3);
});

test('structured review reuses local evidence, withholds unrelated source text and rejects guessed IDs', async (context) => {
  const captured = [];
  let mode = 'valid';
  const upstream = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const payload = JSON.parse(data.messages[1].content);
    captured.push(payload);
    const rule = payload.evidence.find(({ source }) => source === 'rule');
    const project = payload.evidence.find(({ source }) => source === 'project');
    const citations = mode === 'valid' ? [rule.id, project.id] : [project.id];
    if (mode === 'unknown') citations.push('rule-999-1');
    response.setHeader('Content-Type', 'application/json');
    if (mode === 'oversized') return response.end(' '.repeat(129 * 1024));
    response.end(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({ answer: '核对评审是否能访问仓库。', citations }) } }],
    }));
  });
  const upstreamOrigin = await start(upstream, context);
  const origin = await start(createEntryFlowServer({ env: {
    ENTRYFLOW_AI_BASE_URL: `${upstreamOrigin}/v1`,
    ENTRYFLOW_AI_API_KEY: 'mock-test-key',
    ENTRYFLOW_AI_MODEL: 'mock-model',
  } }), context);
  const inputs = {
    preset: 'repo-process',
    ruleText: '作品公开仓库需要供评审访问。\n团队人数最多三人。\nGit 历史须细粒度提交。',
    projectSummary: '当前仓库尚未公开。内部会议记录不属于本次复核。',
  };
  const local = runLocalReview(inputs);
  const response = await post(origin, inputs);
  assert.equal(response.status, 200);
  const result = await response.json();
  const sameEvidence = [...local.ruleExcerpts, ...local.projectExcerpts].map(({ score: _, ...excerpt }) => excerpt);
  assert.deepEqual(captured[0], { query: local.query, evidence: sameEvidence });
  assert.ok(!JSON.stringify(captured[0]).includes('内部会议记录'));
  assert.ok(!JSON.stringify(captured[0]).includes('团队人数'));
  assert.deepEqual(result, { answer: '核对评审是否能访问仓库。', citations: [sameEvidence[0], sameEvidence[2]] });
  assert.equal(result.citations[0].line, result.citations[1].line);
  assert.notEqual(result.citations[0].id, result.citations[1].id);

  for (const failure of ['project-only', 'unknown', 'oversized']) {
    mode = failure;
    assert.equal((await post(origin, inputs)).status, 502);
  }
  assert.equal((await post(origin, { ...inputs, preset: 'bogus' })).status, 400);
  assert.equal((await post(origin, { ...inputs, preset: 'custom', query: '' })).status, 400);
  assert.equal((await post(origin, { ...inputs, ruleText: '必须具有正式学籍。' })).status, 422);
  assert.equal(captured.length, 4);
});

test('both model protocols constrain explicitly scoped deadlines before validating citations', async (context) => {
  const captured = [];
  let replyCode = 'actual';
  const upstream = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const { messages } = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    const input = JSON.parse(messages[1].content);
    captured.push(input);
    const actual = input.evidence?.find(({ source }) => source === 'rule')?.id ?? input.excerpts[0].line;
    const wrong = input.evidence ? 'rule-3-1' : 3;
    const content = JSON.stringify({ answer: '核对该阶段公告的交件日期。', citations: [replyCode === 'actual' ? actual : wrong] });
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ choices: [{ message: { content } }] }));
  });
  const upstreamOrigin = await start(upstream, context);
  const origin = await start(createEntryFlowServer({ env: {
    ENTRYFLOW_AI_BASE_URL: `${upstreamOrigin}/v1`,
    ENTRYFLOW_AI_API_KEY: 'mock-test-key',
    ENTRYFLOW_AI_MODEL: 'mock-model',
  } }), context);
  const source = {
    ruleText: '省赛安排\n1.时间安排：\n作品提交截止时间：2026年11月18日\n国赛安排\n1.时间安排：\n作品提交截止时间：2026年12月27日',
    query: '国赛作品提交截止是哪天？',
  };
  const explicit = await post(origin, { ...source, preset: 'custom', scope: 'national' });
  assert.equal(explicit.status, 200);
  const [{ stage, stageHeading, line, text }] = (await explicit.json()).citations;
  assert.deepEqual({ stage, line, text }, { stage: 'national', line: 6, text: '作品提交截止时间：2026年12月27日' });
  assert.equal(stageHeading.line, 4);
  assert.equal(captured[0].evidence.length, 1);
  assert.match(captured[0].evidence[0].text, /12月27日/u);
  assert.ok(!JSON.stringify(captured[0]).includes('11月18日'));

  const legacy = await post(origin, source);
  assert.equal(legacy.status, 200);
  assert.deepEqual((await legacy.json()).citations, [{ line: 6, text: '作品提交截止时间：2026年12月27日' }]);
  assert.ok(!JSON.stringify(captured[1]).includes('11月18日'));
  replyCode = 'wrong';
  assert.equal((await post(origin, { ...source, preset: 'custom' })).status, 502);
  assert.equal((await post(origin, source)).status, 502);
  assert.equal((await post(origin, { ...source, preset: 'custom', scope: 'provincial' })).status, 422);
  assert.equal((await post(origin, { ...source, preset: 'custom', scope: 'bogus' })).status, 400);
  assert.equal(captured.length, 4);
});
