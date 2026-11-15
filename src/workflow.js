export const DRAFT_FIELDS = ['competition', 'source', 'rule', 'project', 'summary'];

export const GATE_STATUS = {
  pending: '待确认',
  pass: '符合',
  fail: '不符合',
};

export const TASK_STATUS = {
  pending: '待开始',
  active: '进行中',
  done: '已完成',
};

export function initialState() {
  return {
    version: 1,
    stage: 'intake',
    draft: Object.fromEntries(DRAFT_FIELDS.map(field => [field, ''])),
    fileName: '',
    sample: false,
    analysis: null,
    checklist: null,
    submissionReview: null,
  };
}

function draftFingerprint(draft) {
  return JSON.stringify(DRAFT_FIELDS.map(field => field === 'rule' ? draft[field] : draft[field].trim()));
}

function workspaceKey(draft) {
  return JSON.stringify([draft.competition.trim(), draft.source.trim(), draft.project.trim()]);
}

export function hasCurrentAnalysis(state) {
  return state.analysis?.fingerprint === draftFingerprint(state.draft);
}

function reviewSignature(state) {
  return JSON.stringify([
    state.analysis.fingerprint,
    state.analysis.gates.map(gate => [gate.key, gate.status]),
  ]);
}

export function hasCurrentChecklist(state) {
  return hasCurrentAnalysis(state) && state.checklist?.signature === reviewSignature(state)
    && (!state.checklist.items.some(item => item.kind === 'review') || reviewSourcesMatch(state, state.checklist));
}

export function reviewSourcesMatch(state, snapshot) {
  return Boolean(snapshot && state.analysis && snapshot.fingerprint === state.analysis.fingerprint
    && snapshot.sourceSummary === state.draft.summary);
}

export function currentSubmissionReview(state) {
  return hasCurrentAnalysis(state) && reviewSourcesMatch(state, state.submissionReview)
    ? state.submissionReview
    : null;
}

export function submissionReviewStatus(state, question) {
  const snapshot = state.submissionReview;
  if (typeof snapshot?.sourceSummary !== 'string') return 'empty';
  if (!currentSubmissionReview(state)) return 'stale';
  if (question && (snapshot.result.preset !== question.preset ||
      (question.preset === 'custom' && snapshot.result.query !== question.query.trim()))) {
    return 'question-changed';
  }
  return 'ready';
}

export function saveSubmissionReview(state, result) {
  if (!hasCurrentAnalysis(state)) return null;
  state.submissionReview = {
    fingerprint: state.analysis.fingerprint,
    sourceSummary: state.draft.summary,
    result,
    model: null,
  };
  return state.submissionReview;
}

export function submissionReviewOptions(state) {
  const review = currentSubmissionReview(state);
  if (!review) return [];

  const { result, model } = review;
  const sources = new Map([...result.ruleExcerpts, ...result.projectExcerpts].map(source => [source.id, source]));
  const options = result.suggestions.map(suggestion => ({
    id: suggestion.id,
    title: suggestion.title,
    description: suggestion.description,
    mode: 'local',
    citations: [...suggestion.ruleRefs, ...suggestion.projectRefs]
      .map(id => sources.get(id)).filter(Boolean),
  }));
  if (model?.citations.length) {
    options.push({
      id: 'model-review',
      title: `跟进模型复核 · ${result.query}`.slice(0, 180),
      description: model.answer,
      mode: 'model',
      citations: model.citations,
    });
  }
  return options.map(option => ({
    ...option,
    key: JSON.stringify([result.preset, result.query, option.mode, option.id, option.title,
      option.description, option.citations.map(({ source, line, column, text }) => [source, line, column, text])]),
  }));
}

export function addSubmissionReviewTasks(state, selectedKeys) {
  const review = currentSubmissionReview(state);
  if (!review) return 0;
  const selected = new Set(selectedKeys);
  const options = submissionReviewOptions(state).filter(option => selected.has(option.key));
  if (!options.length) return 0;

  if (!hasCurrentChecklist(state)) generateChecklist(state);
  const existing = new Set(state.checklist.items.map(item => item.key));
  const added = [];
  for (const option of options) {
    const key = `review:${option.key}`;
    if (existing.has(key)) continue;
    existing.add(key);
    added.push({
      key,
      title: option.title,
      kind: 'review',
      question: review.result.query,
      reviewMode: option.mode,
      description: option.description,
      citations: option.citations,
      quote: '',
      line: null,
      owner: '',
      note: '',
      status: 'pending',
    });
  }
  state.checklist.items.unshift(...added);
  return added.length;
}

function requirementKey(item) {
  return JSON.stringify([item.title, item.quote]);
}

export function applyAnalysis(state, result) {
  const previous = state.analysis;
  const fingerprint = draftFingerprint(state.draft);
  const workspace = workspaceKey(state.draft);
  const sameWorkspace = previous?.workspace === workspace;
  const sameInputs = previous?.fingerprint === fingerprint;
  const earlier = new Map(sameInputs ? previous.gates.map(gate => [gate.key, gate]) : []);
  const extracted = new Map();

  for (const item of result.gates) {
    const key = requirementKey(item);
    if (extracted.has(key)) continue;
    const existing = earlier.get(key);
    extracted.set(key, {
      ...item,
      key,
      status: existing?.status ?? 'pending',
      note: existing?.note ?? '',
      manual: false,
    });
  }

  const manualGates = sameWorkspace ? previous.gates.filter(gate => gate.manual) : [];
  state.analysis = {
    fingerprint,
    workspace,
    gates: [
      ...extracted.values(),
      ...manualGates.map(gate => sameInputs ? gate : { ...gate, status: 'pending', note: '' }),
    ],
    materials: result.materials,
    excerpts: result.excerpts,
  };
}

export function addGate(state, title, quote) {
  if (!hasCurrentAnalysis(state) || !title.trim()) return;
  state.analysis.gates.push({
    key: `manual:${crypto.randomUUID()}`,
    title: title.trim(),
    quote: quote.trim(),
    line: null,
    suggestion: '',
    evidence: '',
    status: 'pending',
    note: '',
    manual: true,
  });
}

export function generateChecklist(state) {
  if (!hasCurrentAnalysis(state)) return;
  const previous = state.checklist;
  const workspace = workspaceKey(state.draft);
  const sameWorkspace = previous?.workspace === workspace;
  const earlier = new Map(sameWorkspace ? previous.items.map(item => [item.key, item]) : []);
  const items = new Map();

  const insert = (key, title, kind, quote, line) => {
    const existing = earlier.get(key);
    items.set(key, {
      key,
      title,
      kind,
      quote,
      line,
      owner: existing?.owner ?? '',
      note: existing?.note ?? '',
      status: existing?.status ?? 'pending',
    });
  };

  for (const material of state.analysis.materials) {
    insert(`material:${requirementKey(material)}`, material.title, 'material', material.quote, material.line);
  }

  for (const gate of state.analysis.gates) {
    if (gate.status === 'pass') continue;
    const instruction = gate.status === 'fail' ? '处理阻塞' : '确认门槛';
    const key = `gate:${gate.status}:${gate.key}`;
    if (previous?.fingerprint !== state.analysis.fingerprint) earlier.delete(key);
    insert(key, `${instruction} · ${gate.title}`, 'gate', gate.quote, gate.line);
  }

  const manual = sameWorkspace ? previous.items.filter(item => item.kind === 'manual') : [];
  const reviewItems = sameWorkspace && reviewSourcesMatch(state, previous)
    ? previous.items.filter(item => item.kind === 'review')
    : [];
  state.checklist = {
    workspace,
    fingerprint: state.analysis.fingerprint,
    sourceSummary: state.draft.summary,
    signature: reviewSignature(state),
    items: [...reviewItems, ...items.values(), ...manual],
  };
}

export function addTask(state, title) {
  if (!hasCurrentChecklist(state) || !title.trim()) return;
  state.checklist.items.push({
    key: `manual:${crypto.randomUUID()}`,
    title: title.trim(),
    kind: 'manual',
    quote: '',
    line: null,
    owner: '',
    note: '',
    status: 'pending',
  });
}

export function summarize(state) {
  const gates = hasCurrentAnalysis(state) ? state.analysis.gates : [];
  const tasks = hasCurrentChecklist(state) ? state.checklist.items : [];
  return {
    gateTotal: gates.length,
    passed: gates.filter(gate => gate.status === 'pass').length,
    blocked: gates.filter(gate => gate.status === 'fail').length,
    pending: gates.filter(gate => gate.status === 'pending').length,
    taskTotal: tasks.length,
    completed: tasks.filter(task => task.status === 'done').length,
  };
}

function markdown(value) {
  return String(value ?? '')
    .replace(/([\\`*_{}.\[\]()#+!|<>-])/g, '\\$1')
    .replace(/\r?\n/g, ' ');
}

function sourceReference(item) {
  if (item.line) return `赛规第 ${item.line} 行`;
  return item.manual || item.kind === 'gate' || item.kind === 'manual' ? '手动补录' : '赛规摘录';
}

export function reviewCitationLabel(item) {
  const document = item.source === 'project' ? '项目摘要' : '赛规';
  return `${document}第 ${item.line} 行`;
}

export function exportChecklist(state) {
  if (!hasCurrentChecklist(state)) return '';
  const { draft, analysis, checklist } = state;
  const lines = [
    `# ${markdown(draft.competition)} 投递清单`,
    '',
    `- 项目：${markdown(draft.project)}`,
  ];
  if (draft.source) lines.push(`- 赛规来源：${markdown(draft.source)}`);
  if (state.sample) lines.push('- 工作台曾载入演示样例，请按当前资料核对内容。');
  lines.push('', '## 门槛核验', '');
  if (!analysis.gates.length) lines.push('暂无可辨识或手动录入的门槛。');
  for (const gate of analysis.gates) {
    lines.push(`- **${markdown(gate.title)}** · ${GATE_STATUS[gate.status]}`);
    if (gate.quote) lines.push(`  - ${sourceReference(gate)}：${markdown(gate.quote)}`);
    if (gate.note) lines.push(`  - 核验备注：${markdown(gate.note)}`);
  }
  lines.push('', '## 投递任务', '');
  if (!checklist.items.length) lines.push('暂无任务。');
  for (const item of checklist.items) {
    const mark = item.status === 'done' ? 'x' : ' ';
    lines.push(`- [${mark}] ${markdown(item.title)} · ${TASK_STATUS[item.status]}`);
    if (item.owner) lines.push(`  - 负责人：${markdown(item.owner)}`);
    if (item.note) lines.push(`  - 备注：${markdown(item.note)}`);
    if (item.quote) lines.push(`  - ${sourceReference(item)}：${markdown(item.quote)}`);
    if (item.kind === 'review') {
      lines.push(`  - 复核来源：${item.reviewMode === 'model' ? '模型复核' : '本地证据复核'}`);
      lines.push(`  - 复核问题：${markdown(item.question)}`);
      if (item.description) lines.push(`  - 复核建议：${markdown(item.description)}`);
      for (const citation of item.citations) {
        lines.push(`  - ${reviewCitationLabel(citation)}：${markdown(citation.text)}`);
      }
    }
  }
  return `${lines.join('\n')}\n`;
}
