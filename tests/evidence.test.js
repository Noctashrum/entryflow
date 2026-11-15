import assert from 'node:assert/strict';
import test from 'node:test';
import { demoDraft } from '../src/demo.js';
import { analyzeRules, readRuleFile, retrieveEvidence } from '../src/evidence.js';

test('official demo lines recover each gate and checklist item, with relevant project clues only', () => {
  const { gates, materials } = analyzeRules(demoDraft.rule, demoDraft.summary);
  const source = demoDraft.rule.split('\n');
  assert.deepEqual(gates.map(({ line }) => line), [2, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(materials.map(({ id, line }) => [id, line]), [
    ['repository', 7],
    ['git-history', 8],
    ['prompt-history', 9],
    ['readme', 10],
    ['demo-video', 11],
    ['technical-doc', 12],
  ]);
  for (const item of [...gates, ...materials]) {
    assert.ok(source[item.line - 1].includes(item.quote));
  }
  assert.match(gates[0].evidence, /全日制本科生/u);
  assert.equal(gates.find(({ line }) => line === 6).evidence, '');
  assert.equal(gates.find(({ line }) => line === 4).evidence, '');
});

test('Markdown material headings preserve original line numbers and skip optional items', () => {
  const rules = '\n## 省赛提交材料\r\n\r\n- 电子签章手册\r\n- 视频（可选）\r\n- 请提交 README，也可提交项目报告。\r\n## 评审标准\r\n- 交互体验';
  const { gates, materials } = analyzeRules(rules);
  assert.deepEqual(gates, []);
  assert.deepEqual(materials.map(({ title, line }) => [title, line]), [
    ['电子签章手册', 4],
    ['README 复现指南', 6],
  ]);
  assert.equal(materials[0].quote, '- 电子签章手册');
});

test('ranking returns verbatim nonempty source lines and omits irrelevant results', () => {
  const rules = '评审方式为线上答辩。\n\n仓库必须对外公开，允许评委复现。\n每队 2–4 人。';
  const [excerpt] = retrieveEvidence(rules, '仓库是否必须公开？', 1);
  assert.equal(excerpt.line, 3);
  assert.equal(excerpt.text, '仓库必须对外公开，允许评委复现。');
  assert.ok(excerpt.score > 0);
  assert.deepEqual(retrieveEvidence(rules, '停车场'), []);
  assert.deepEqual(retrieveEvidence(rules, '公开', 0), []);
});

test('text import preserves raw line numbering and supports encoding and format errors', async () => {
  const content = '\r\n报名截止 12 月 1 日。\r\n';
  assert.equal(await readRuleFile(new File([content], '规则.MD')), content);
  const utf16 = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(content, 'utf16le')]);
  assert.equal(await readRuleFile(new File([utf16], '规则.txt')), content);
  await assert.rejects(readRuleFile(new File(['x'], '扫描件.png')), /转写/u);
  await assert.rejects(readRuleFile(new File(['   '], 'empty.csv')), /没有读到/u);
});
