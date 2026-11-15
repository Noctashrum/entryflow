import assert from 'node:assert/strict';
import test from 'node:test';
import { demoDraft } from '../src/demo.js';
import { REVIEW_PRESETS, runLocalReview } from '../src/retrieval.js';

const demoInput = { ruleText: demoDraft.rule, projectSummary: demoDraft.summary };

function checkSources(review, { ruleText, projectSummary }) {
  const inputs = { rule: ruleText.split(/\r\n|\r|\n/u), project: projectSummary.split(/\r\n|\r|\n/u) };
  for (const excerpt of [...review.ruleExcerpts, ...review.projectExcerpts]) {
    const original = inputs[excerpt.source][excerpt.line - 1];
    const start = excerpt.column - 1;
    assert.equal(excerpt.text, original.slice(start, start + excerpt.text.length));
  }
  for (const suggestion of review.suggestions) {
    assert.ok(suggestion.ruleRefs.length);
    assert.ok(suggestion.ruleRefs.every((id) => review.ruleExcerpts.some((entry) => entry.id === id)));
    assert.ok(suggestion.projectRefs.every((id) => review.projectExcerpts.some((entry) => entry.id === id)));
  }
}

test('deadline and eligibility draws from regulations and reports the missing submission plan separately', () => {
  assert.equal(REVIEW_PRESETS.length, 4);
  const review = runLocalReview({ ...demoInput, preset: 'deadline-eligibility' });
  assert.deepEqual(review.suggestions.map(({ id }) => id), ['deadline', 'eligibility', 'team']);
  assert.deepEqual(review.suggestions[0].ruleRefs, ['rule-6-1']);
  assert.deepEqual(review.suggestions[0].projectRefs, []);
  assert.match(review.missing.join(' '), /交件时间/u);
  assert.match(review.projectExcerpts[0].text, /全日制本科生/u);
  checkSources(review, demoInput);
});

test('repo and process catches missing commit evidence without mistaking GitHub for Git history', () => {
  const review = runLocalReview({ ...demoInput, preset: 'repo-process' });
  assert.deepEqual(review.suggestions.map(({ id }) => id), ['repository', 'git-history', 'prompt-history', 'reproduction']);
  const repository = review.suggestions.find(({ id }) => id === 'repository');
  const repositoryNote = review.projectExcerpts.find(({ id }) => repository.projectRefs.includes(id));
  assert.match(repositoryNote.text, /仓库目前为私有/u);
  assert.deepEqual(review.suggestions.find(({ id }) => id === 'git-history').projectRefs, []);
  assert.match(review.missing.join(' '), /真实 Git 演进记录/u);
  checkSources(review, demoInput);
});

test('deliverables suggests all six sample tasks and preserves unfinished status in the cited text', () => {
  const review = runLocalReview({ ...demoInput, preset: 'deliverables' });
  assert.deepEqual(review.suggestions.map(({ id }) => id), [
    'repository', 'git-history', 'prompt-history', 'readme', 'demo-video', 'technical-doc',
  ]);
  assert.match(review.missing.join(' '), /Git 提交历史/u);
  const video = review.suggestions.find(({ id }) => id === 'demo-video');
  assert.match(review.projectExcerpts.find(({ id }) => video.projectRefs.includes(id)).text, /尚未完成/u);
  checkSources(review, demoInput);
});

test('custom queries expand familiar terms without treating unrelated project text as a rule', () => {
  const review = runLocalReview({ ...demoInput, query: '最后一天是什么时候？' });
  assert.equal(review.ruleExcerpts[0].line, 6);
  assert.equal(review.projectExcerpts.length, 0);
  checkSources(review, demoInput);
  const noRule = runLocalReview({ ruleText: '仅限全日制学生。', projectSummary: '已做好展馆地图。', query: '展馆地图' });
  assert.equal(noRule.ruleExcerpts.length, 0);
  assert.equal(noRule.projectExcerpts.length, 1);
  assert.equal(noRule.suggestions.length, 0);
  assert.match(noRule.missing[0], /赛规/u);
});

test('windowed evidence retains the position of a phrase late in a long line', () => {
  const input = {
    ruleText: `第一行。\r\n\r\n${'甲'.repeat(1170)}需提交可复现记录和复核通行码${'乙'.repeat(47)}`,
    projectSummary: '',
  };
  const review = runLocalReview({ ...input, query: '通行码' });
  assert.equal(review.ruleExcerpts[0].line, 3);
  assert.match(review.ruleExcerpts[0].text, /复核通行码/u);
  assert.ok(review.ruleExcerpts[0].text.length <= 520);
  assert.ok(review.ruleExcerpts[0].column > 1);
  checkSources(review, input);
});
