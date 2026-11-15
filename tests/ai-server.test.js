import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createEntryFlowServer } from '../server/index.js';

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
