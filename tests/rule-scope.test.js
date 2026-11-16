import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeRules } from '../src/evidence.js';
import { runLocalReview } from '../src/retrieval.js';
import { indexRuleLines } from '../src/rule-scope.js';

const body = [
  '2.作品提交要求：',
  '2.1代码仓库与演进记录',
  ' 提交 GitHub 或 Gitee 仓库链接，公开或向评审开放。',
  '保留完整的 Git 提交日志，能够看到逐步演进。',
  'AI 对话历史导出的 Prompt 历史快照：',
  'AI 工具需导出对话。工具不支持导出时可截图或录屏。',
  '•须包含至少3个核心功能的完整Prompt链(包含初始问题、AI的修改建议、问题修订过程)。',
  '2.2复现性声明与重现指南(README.md)',
  '写清依赖和环境变量，保证十分钟可复现。',
  '2.3演示视频与技术文档',
  '演示视频须采用 1080p MP4，限 5–8 分钟并说明 AI 协同。',
  '提交不超过 30 页的技术文档 PDF。',
  '3.奖项设置：',
  '省赛（复赛）',
  '评委须提交评分报告与评审截图。',
  '晋级规则',
  '晋级通知指定邮箱须提交获奖证明与汇报 PPT。',
  '4.评审标准：',
  '评审组织须提交项目报告。',
];
const ruleText = [
  '参赛者须具备正式全日制学籍。',
  '',
  '省赛安排',
  '1.时间安排：',
  '•报名截止：即日起–2026年11月18日',
  '•作品提交截止时间：2026年11月18日',
  ...body,
  '',
  '国赛安排',
  '1.时间安排：',
  '•报名时间：2026年12月10日–2026年12月21日',
  '•作品提交截止时间：2026年12月27日',
  ...body.map((line) => line === '省赛（复赛）' ? '国赛（决赛）' : line),
].join('\n');

test('scoped deadline questions bind to the phase heading and prefer submission over registration', () => {
  const lines = ruleText.split('\n');
  for (const [label, scope, date, opposite] of [
    ['省赛', 'provincial', '11月18日', '12月27日'],
    ['国赛', 'national', '12月27日', '11月18日'],
  ]) {
    const review = runLocalReview({ ruleText, query: `${label}作品什么时候截止？` });
    assert.deepEqual(review.resolvedScopes, [scope]);
    assert.match(review.ruleExcerpts[0].text, new RegExp(date, 'u'));
    assert.equal(review.ruleExcerpts[0].stage, scope);
    assert.equal(review.ruleExcerpts[0].section, '时间安排');
    assert.equal(review.ruleExcerpts[0].stageHeading.text, `${label}安排`);
    assert.ok(review.ruleExcerpts.every(({ text }) => !text.includes(opposite) && text.includes('作品提交')));
    for (const { line, text, stageHeading } of review.ruleExcerpts) {
      assert.equal(lines[line - 1], text);
      assert.equal(lines[stageHeading.line - 1], stageHeading.text);
    }
  }
  const registration = runLocalReview({ ruleText, query: '国赛报名的最后一天是哪天？' });
  assert.match(registration.ruleExcerpts[0].text, /12月21日/u);
  assert.ok(registration.ruleExcerpts.every(({ text }) => !text.includes('12月27日')));
});

test('both stages can be checked side by side, while absent and conflicting scope never substitutes another deadline', () => {
  const combined = runLocalReview({ ruleText, query: '国赛和省赛作品提交各在何时截止？' });
  assert.deepEqual(combined.resolvedScopes, ['provincial', 'national']);
  assert.deepEqual(combined.ruleExcerpts.map(({ stage }) => stage), combined.resolvedScopes);
  assert.deepEqual(combined.suggestions.map(({ id }) => id), ['custom-review@provincial', 'custom-review@national']);
  const missing = runLocalReview({ ruleText: '省赛安排\n作品提交截止时间：11月18日', query: '国赛作品截止时间？' });
  assert.equal(missing.ruleExcerpts.length, 0);
  assert.match(missing.missing.join(' '), /未定位到明确适用于国赛/u);
  const conflict = runLocalReview({ ruleText, scope: 'provincial', query: '国赛作品截止时间？' });
  assert.equal(conflict.ruleExcerpts.length, 0);
  assert.match(conflict.missing[0], /不一致/u);
});

test('unscoped and general evidence remains usable, while mixed phase dates are not offered for one phase', () => {
  const neutral = runLocalReview({ ruleText: '作品提交截止时间：6月8日。', query: '作品截止时间' });
  assert.equal(neutral.ruleExcerpts[0].stage, 'general');
  const scoped = runLocalReview({ ruleText, scope: 'national', query: '参赛学籍要求' });
  assert.match(scoped.ruleExcerpts[0].text, /全日制学籍/u);
  const mixed = runLocalReview({
    ruleText: '省赛和国赛作品提交时间分别为11月18日和12月27日。',
    query: '省赛作品提交截止',
  });
  assert.equal(mixed.ruleExcerpts.length, 0);
  const comparison = runLocalReview({
    ruleText: '省赛和国赛作品提交时间分别为11月18日和12月27日。',
    query: '省赛国赛作品提交时间分别是何时？',
  });
  assert.equal(comparison.ruleExcerpts[0].stage, 'mixed');
  assert.equal(comparison.suggestions[0].id, 'custom-review@mixed');
});

test('submission chapters retain substantive references and exclude awards, judging and advancement', () => {
  const expected = ['repository', 'git-history', 'prompt-history', 'readme', 'demo-video', 'technical-doc'];
  const all = analyzeRules(ruleText);
  assert.equal(all.materials.length, 12);
  assert.equal(new Set(all.materials.map(({ id }) => id)).size, 12);
  for (const stage of ['provincial', 'national']) {
    const { materials } = analyzeRules(ruleText, '', { scope: stage });
    assert.deepEqual(materials.map(({ typeId }) => typeId), expected);
    assert.ok(materials.every((item) => item.stage === stage && item.stageHeading && item.references.length));
    assert.match(materials.find(({ typeId }) => typeId === 'readme').quote, /十分钟/u);
    const prompt = materials.find(({ typeId }) => typeId === 'prompt-history');
    assert.ok(prompt.references.some(({ text }) => /须包含至少3个/u.test(text)));
    assert.ok(prompt.references.some(({ text }) => /截图或录屏/u.test(text)));
    assert.ok(materials.every(({ quote }) => !/评委|晋级通知|评审组织/u.test(quote)));
    const review = runLocalReview({ ruleText, preset: 'deliverables', scope: stage });
    assert.equal(review.suggestions.length, 6);
    assert.ok(review.ruleExcerpts.every((entry) => entry.stage === stage));
    const promptSuggestion = review.suggestions.find(({ id }) => id.startsWith('prompt-history'));
    assert.equal(promptSuggestion.ruleRefs.length, 3);
  }
});

test('markdown siblings reset the stage and keep one-based offsets from the original input', () => {
  const source = '  **省赛安排**\n    1.时间安排：\n\t作品提交截止：11月18日\n## 国赛安排\n### 1.时间安排\n  作品提交截止：12月27日\n## 通用规则\n  须保证作品原创。';
  const lines = source.split('\n');
  const records = indexRuleLines(source);
  assert.equal(records.find(({ line }) => line === 3).stage, 'provincial');
  assert.equal(records.find(({ line }) => line === 6).stage, 'national');
  assert.equal(records.at(-1).stage, 'general');
  for (const { line, column, text, stageHeading } of records) {
    assert.equal(lines[line - 1].slice(column - 1, column - 1 + text.length), text);
    if (stageHeading) assert.equal(lines[stageHeading.line - 1].slice(stageHeading.column - 1), stageHeading.text);
  }
});

test('inline stage in a submission section applies to its clauses until a general section begins', () => {
  const source = '省赛作品提交要求\n演示视频须为 MP4。\n国赛作品提交要求\n演示视频须提供可播放链接。\n通用规则\n作品必须原创。';
  const { materials, gates } = analyzeRules(source, '', { scope: 'national' });
  assert.equal(materials.length, 1);
  assert.equal(materials[0].stageHeading.line, 3);
  assert.match(materials[0].quote, /可播放链接/u);
  assert.equal(gates.find(({ title }) => title === '原创与权属').stage, 'general');
});
