import assert from 'node:assert/strict';
import test from 'node:test';
import { demoDraft } from '../src/demo.js';
import { analyzeRules } from '../src/evidence.js';
import { runLocalReview } from '../src/retrieval.js';
import {
  addGate, addSubmissionReviewTasks, addTask, applyAnalysis, currentSubmissionReview, exportChecklist,
  generateChecklist, hasCurrentAnalysis, hasCurrentChecklist, initialState, saveSubmissionReview,
  submissionReviewOptions, submissionReviewStatus, summarize,
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

function reviewRepository(state) {
  return saveSubmissionReview(state, runLocalReview({
    ruleText: state.draft.rule,
    projectSummary: state.draft.summary,
    preset: 'repo-process',
  }));
}

test('locally reviewed suggestions join the checklist once with both sources and no gate decision', () => {
  const state = demoWorkspace();
  delete state.submissionReview; // Workspaces saved before the review feature have no result.
  const review = reviewRepository(state);
  assert.ok(review.result.missing.some(text => text.includes('Git')));
  const suggestion = submissionReviewOptions(state).find(item =>
    item.citations.some(item => item.source === 'project') && item.citations.some(item => item.source === 'rule'));
  assert.ok(suggestion);
  assert.equal(addSubmissionReviewTasks(state, [suggestion.key, suggestion.key]), 1);
  assert.equal(addSubmissionReviewTasks(state, [suggestion.key]), 0);
  assert.ok(state.analysis.gates.every(gate => gate.status === 'pending'));
  const task = state.checklist.items.find(item => item.kind === 'review');
  assert.equal(task.status, 'pending');
  const restored = JSON.parse(JSON.stringify(state));
  assert.deepEqual(restored.checklist.items.find(item => item.kind === 'review'), task);
  assert.equal(currentSubmissionReview(restored).result.preset, 'repo-process');
  assert.equal(addSubmissionReviewTasks(restored, [suggestion.key]), 0);
  const markdown = exportChecklist(restored);
  assert.match(markdown, /项目摘要第 [0-9]+ 行/);
  assert.match(markdown, /赛规第 [0-9]+ 行/);
  assert.match(markdown, /本地证据复核/);
});

test('saved model suggestions require manual adoption and keep the verified references', () => {
  const state = demoWorkspace();
  const review = reviewRepository(state);
  const citations = [review.result.ruleExcerpts[0], review.result.projectExcerpts[0]];
  review.model = { answer: '检查仓库的评审权限。', citations };
  assert.equal(state.checklist, null);
  const modelSuggestion = submissionReviewOptions(state).find(item => item.mode === 'model');
  assert.equal(addSubmissionReviewTasks(state, [modelSuggestion.key]), 1);
  const task = state.checklist.items.find(item => item.kind === 'review');
  assert.equal(task.reviewMode, 'model');
  assert.deepEqual(task.citations, citations);
  assert.match(exportChecklist(state), /模型复核/);
});

test('gate-only regeneration keeps adopted work while changed evidence requires a fresh review', () => {
  const state = demoWorkspace();
  reviewRepository(state);
  const suggestion = submissionReviewOptions(state)[0];
  addSubmissionReviewTasks(state, [suggestion.key]);
  const task = state.checklist.items.find(item => item.kind === 'review');
  task.status = 'done';
  state.analysis.gates[0].status = 'pass';
  generateChecklist(state);
  assert.equal(state.checklist.items.find(item => item.kind === 'review').status, 'done');

  state.draft.summary += ' 新版本已经开放仓库访问。';
  assert.equal(currentSubmissionReview(state), null);
  assert.equal(addSubmissionReviewTasks(state, [suggestion.key]), 0);
  reanalyze(state);
  generateChecklist(state);
  assert.equal(exportChecklist(state).includes('本地证据复核'), false);
  assert.equal(addSubmissionReviewTasks(state, [suggestion.key]), 0);
  reviewRepository(state);
  const fresh = submissionReviewOptions(state)[0];
  assert.equal(addSubmissionReviewTasks(state, [fresh.key]), 1);
  assert.equal(state.checklist.items.find(item => item.kind === 'review').status, 'pending');
});

test('new blank summary lines invalidate positional review citations without losing regular progress', () => {
  const state = demoWorkspace();
  reviewRepository(state);
  const suggestion = submissionReviewOptions(state)[0];
  addSubmissionReviewTasks(state, [suggestion.key]);
  const material = state.checklist.items.find(item => item.kind === 'material');
  material.status = 'done';

  state.draft.summary = `\n${state.draft.summary}`;
  assert.equal(hasCurrentAnalysis(state), true);
  assert.equal(currentSubmissionReview(state), null);
  assert.equal(hasCurrentChecklist(state), false);
  assert.equal(exportChecklist(state), '');
  generateChecklist(state);
  assert.ok(!state.checklist.items.some(item => item.kind === 'review'));
  assert.equal(state.checklist.items.find(item => item.key === material.key).status, 'done');
  const newReview = reviewRepository(state);
  assert.equal(newReview.result.projectExcerpts[0].line, 2);
});

test('changing the selected question is distinct from changing source materials', () => {
  const state = demoWorkspace();
  reviewRepository(state);
  assert.equal(submissionReviewStatus(state, { preset: 'repo-process', query: '' }), 'ready');
  assert.equal(submissionReviewStatus(state, { preset: 'custom', query: '视频时长？' }), 'question-changed');
  assert.equal(submissionReviewStatus(state, { preset: 'deliverables', query: '' }), 'question-changed');
  assert.equal(submissionReviewStatus(state, { preset: 'repo-process', query: '' }), 'ready');

  saveSubmissionReview(state, runLocalReview({
    ruleText: state.draft.rule,
    projectSummary: state.draft.summary,
    preset: 'custom',
    query: '视频时长？',
  }));
  assert.equal(submissionReviewStatus(state, { preset: 'custom', query: '视频时长？' }), 'ready');
  assert.equal(submissionReviewStatus(state, { preset: 'custom', query: '技术文档几页？' }), 'question-changed');
  state.draft.summary += ' 项目摘要补充说明。';
  assert.equal(submissionReviewStatus(state, { preset: 'custom', query: '视频时长？' }), 'stale');
  delete state.submissionReview.sourceSummary;
  assert.equal(submissionReviewStatus(state, { preset: 'custom', query: '视频时长？' }), 'empty');
});
