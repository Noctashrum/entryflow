import assert from 'node:assert/strict';
import test from 'node:test';
import { demoDraft } from '../src/demo.js';
import { analyzeRules } from '../src/evidence.js';
import {
  addGate, addTask, applyAnalysis, exportChecklist, generateChecklist,
  hasCurrentAnalysis, hasCurrentChecklist, initialState, summarize,
} from '../src/workflow.js';

function demoWorkspace() {
  const state = initialState();
  state.draft = { ...demoDraft };
  state.sample = true;
  reanalyze(state);
  return state;
}

function reanalyze(state) {
  applyAnalysis(state, analyzeRules(state.draft.rule, state.draft.summary));
}

test('official excerpts yield inspectable, unconfirmed gates and material tasks', () => {
  const state = demoWorkspace();
  assert.equal(hasCurrentAnalysis(state), true);
  assert.ok(state.analysis.gates.length >= 6);
  assert.ok(state.analysis.materials.some(material => material.title.includes('演示视频')));
  assert.ok(state.analysis.gates.every(gate => gate.status === 'pending'));
  const gate = state.analysis.gates[0];
  assert.ok(state.draft.rule.split('\n')[gate.line - 1].includes(gate.quote));
  gate.status = 'fail';
  generateChecklist(state);
  assert.equal(hasCurrentChecklist(state), true);
  assert.ok(state.checklist.items.some(item => item.title.startsWith('处理阻塞')));
  assert.ok(state.checklist.items.some(item => item.title.startsWith('确认门槛')));
});

test('revision invalidates review, updates line numbers and keeps unchanged material progress', () => {
  const state = demoWorkspace();
  state.analysis.gates[0].status = 'pass';
  const originalLine = state.analysis.gates[0].line;
  generateChecklist(state);
  const material = state.checklist.items.find(item => item.kind === 'material');
  material.status = 'done';
  material.owner = '示例负责人';

  state.draft.rule = `\n${state.draft.rule}`;
  assert.equal(hasCurrentAnalysis(state), false);
  assert.equal(hasCurrentChecklist(state), false);
  assert.equal(exportChecklist(state), '');

  reanalyze(state);
  assert.equal(state.analysis.gates[0].status, 'pending');
  assert.equal(state.analysis.gates[0].line, originalLine + 1);
  generateChecklist(state);
  const matchingTask = state.checklist.items.find(item => item.key === material.key);
  assert.equal(matchingTask.line, material.line + 1);
  assert.equal(matchingTask.status, 'done');
  assert.equal(matchingTask.owner, '示例负责人');
});

test('changing a project resets gate-dependent work and does not transfer different workspaces', () => {
  const state = demoWorkspace();
  addGate(state, '确认自定义限制', '补充通知');
  generateChecklist(state);
  addTask(state, '核对材料命名');
  const gateTask = state.checklist.items.find(item => item.kind === 'gate');
  gateTask.status = 'done';

  state.draft.summary += ' 虚构项目现已完成版本更新。';
  reanalyze(state);
  generateChecklist(state);
  assert.ok(state.analysis.gates.some(gate => gate.title === '确认自定义限制'));
  assert.equal(state.checklist.items.find(item => item.key === gateTask.key).status, 'pending');
  assert.ok(state.checklist.items.some(item => item.title === '核对材料命名'));

  state.draft.project = '另一个参赛项目';
  reanalyze(state);
  generateChecklist(state);
  assert.ok(!state.analysis.gates.some(gate => gate.manual));
  assert.ok(!state.checklist.items.some(item => item.kind === 'manual'));
});

test('gate edits stale the checklist, while JSON persistence retains current progress and export', () => {
  const state = demoWorkspace();
  generateChecklist(state);
  state.analysis.gates[0].status = 'pass';
  assert.equal(hasCurrentChecklist(state), false);
  generateChecklist(state);
  const first = state.checklist.items[0];
  first.status = 'done';
  first.owner = '示例作者';
  first.note = '已有草稿';
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(summarize(restored).completed, 1);
  assert.match(exportChecklist(restored), /\[x\]/);
  assert.match(exportChecklist(restored), /示例作者/);
  assert.match(exportChecklist(restored), /已有草稿/);
});
