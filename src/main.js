import './styles.css';
import { icon, keepFocusedControlInView, renderShell } from './layout.js';
import { analyzeRules, readRuleFile, retrieveEvidence } from './evidence.js';
import { demoDraft } from './demo.js';
import {
  DRAFT_FIELDS,
  GATE_STATUS,
  TASK_STATUS,
  addGate,
  addTask,
  applyAnalysis,
  exportChecklist,
  generateChecklist,
  hasCurrentAnalysis,
  hasCurrentChecklist,
  initialState,
  summarize,
} from './workflow.js';

const storageKey = 'entryflow-workspace-v1';
const maxRuleLength = 150000;
const stages = {
  intake: {
    title: '竞赛投递工作台',
    description: '录入赛规和项目摘要，开始准备这次投递。',
  },
  review: {
    title: '核验门槛',
    description: '对照赛规出处与项目信息，逐条确认参赛要求。',
  },
  checklist: {
    title: '投递清单',
    description: '跟进材料、负责人和待处理要求，随时导出当前进度。',
  },
};

const app = document.querySelector('#app');
app.innerHTML = renderShell();
const content = app.querySelector('#stage-content');
const aside = app.querySelector('#stage-aside');
keepFocusedControlInView(content);
const live = document.createElement('div');
live.className = 'visually-hidden';
live.setAttribute('role', 'status');
app.append(live);

let storageAvailable = true;
let state = loadState();
let evidenceQuery = '';
let importNotice = '';
let importPending = false;
let importToken = 0;
let aiAvailable = false;
let aiResult = null;

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored?.version === 1 && Object.hasOwn(stages, stored.stage) &&
        DRAFT_FIELDS.every(field => typeof stored.draft?.[field] === 'string')) {
      return stored;
    }
  } catch {
    storageAvailable = false;
  }
  return initialState();
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  updateSaveStatus();
}

function updateSaveStatus() {
  const label = app.querySelector('#save-status');
  const message = storageAvailable ? '自动保存到本设备' : '本设备暂无法保存';
  if (label.textContent !== message) label.textContent = message;
  label.dataset.status = storageAvailable ? '' : 'error';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function httpUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
  } catch {
    return '';
  }
  return '';
}

function badge(label, tone = 'neutral') {
  return `<span class="badge badge-${tone}">${escapeHtml(label)}</span>`;
}

function button(label, action, { symbol, style = 'secondary', disabled = false } = {}) {
  return `<button class="button button-${style}" type="button" data-action="${action}" ${disabled ? 'disabled' : ''}>
    ${symbol ? icon(symbol, 16) : ''}${label}
  </button>`;
}

function options(labels, current) {
  return Object.entries(labels)
    .map(([value, label]) => `<option value="${value}" ${current === value ? 'selected' : ''}>${label}</option>`)
    .join('');
}

function panel(title, description, body, actions = '') {
  return `<section class="panel">
    <header class="panel-header"><h2>${title}</h2>${description ? `<p>${description}</p>` : ''}</header>
    <div class="panel-body">${body}</div>
    ${actions ? `<div class="panel-actions">${actions}</div>` : ''}
  </section>`;
}

function emptyState(title, description, actions = '') {
  return `<div class="empty-state">
    ${icon('layers', 24)}
    <h3>${title}</h3>
    <p>${description}</p>
    ${actions}
  </div>`;
}

function notice(message) {
  live.textContent = message;
}

function updateStageNavigation() {
  const metrics = summarize(state);
  const completedStages = {
    intake: hasCurrentAnalysis(state),
    review: metrics.gateTotal > 0 && metrics.passed === metrics.gateTotal,
    checklist: metrics.taskTotal > 0 && metrics.completed === metrics.taskTotal &&
      metrics.gateTotal > 0 && metrics.passed === metrics.gateTotal,
  };
  for (const control of app.querySelectorAll('button[data-stage]')) {
    const stage = control.dataset.stage;
    control.classList.toggle('is-active', stage === state.stage);
    control.classList.toggle('is-done', completedStages[stage]);
    if (stage === state.stage) control.setAttribute('aria-current', 'step');
    else control.removeAttribute('aria-current');
  }
}

function renderStage({ focus = false } = {}) {
  const { title, description } = stages[state.stage];
  const heading = app.querySelector('#stage-title');
  heading.textContent = title;
  heading.tabIndex = -1;
  app.querySelector('#stage-description').textContent = description;
  updateSaveStatus();
  updateStageNavigation();
  const columns = content.parentElement;
  const checklistStage = state.stage === 'checklist';
  columns.classList.toggle('is-checklist', checklistStage);
  if (checklistStage && columns.firstElementChild !== aside) content.before(aside);
  if (!checklistStage && columns.firstElementChild !== content) aside.before(content);

  if (state.stage === 'intake') {
    content.innerHTML = renderIntake();
    content.querySelector('#rule').value = state.draft.rule;
    content.querySelector('#summary').value = state.draft.summary;
    updateIntakeAside();
  } else if (state.stage === 'review') {
    content.innerHTML = renderReview();
    aside.innerHTML = renderReviewAside();
    updateEvidenceResults();
  } else {
    content.innerHTML = renderChecklist();
    updateChecklistAside();
  }

  if (focus) heading.focus();
}

function openStage(stage, { focus = true } = {}) {
  state.stage = stage;
  save();
  renderStage({ focus });
}

function sampleTag() {
  if (!state.sample) return '';
  const originalSample = DRAFT_FIELDS.every(field => state.draft[field] === demoDraft[field]);
  return badge(originalSample ? '官方赛规摘编 · 虚构项目' : '示例资料已修改');
}

function renderIntake() {
  const { draft, fileName } = state;
  const competitionPanel = panel('赛规资料', '填写赛事信息，粘贴或导入赛规原文。', `
    <div class="form-grid">
      <div class="field">
        <label for="competition">赛事名称 <span class="field-required" aria-hidden="true">*</span></label>
        <input id="competition" name="competition" data-draft required maxlength="180" value="${escapeHtml(draft.competition)}"
          placeholder="例如：第九届传智杯 · AI创新应用挑战赛">
      </div>
      <div class="field">
        <label for="source">赛规来源链接 <span class="muted">选填</span></label>
        <input id="source" name="source" type="url" data-draft maxlength="2048" value="${escapeHtml(draft.source)}"
          placeholder="https://">
      </div>
      <div class="field span-full">
        <div class="field-label-row">
          <label for="rule">赛规文本 <span class="field-required" aria-hidden="true">*</span></label>
          ${button('导入文件', 'import-rules', { symbol: 'upload' })}
        </div>
        <input type="file" id="rule-file" class="visually-hidden" tabindex="-1"
          accept=".txt,.md,.csv,.json,.pdf,text/plain,application/pdf" aria-label="导入赛规文件">
        <textarea id="rule" name="rule" data-draft required rows="6" maxlength="${maxRuleLength}" aria-describedby="rule-hint"
          placeholder="粘贴资格限制、关键日期、作品要求和需提交的材料…"></textarea>
        <p id="rule-hint" class="field-hint">支持 TXT、Markdown、CSV、JSON 及带文字层的 PDF。截图和扫描件请先转写。</p>
        <div class="field-meta" id="rule-file-status" aria-live="polite">
          ${importNotice ? `<span>${escapeHtml(importNotice)}</span>` : ''}
          ${fileName ? `<span>${icon('file', 14)}${escapeHtml(fileName)}</span>` : ''}
          ${state.sample ? `<span id="sample-source-tag">${sampleTag()}</span>` : ''}
        </div>
      </div>
    </div>`);

  const projectPanel = panel('项目资料', '写入与参赛条件和投递材料相关的事实。', `
    <div class="form-grid">
      <div class="field span-full">
        <label for="project">项目名称 <span class="field-required" aria-hidden="true">*</span></label>
        <input id="project" name="project" data-draft required maxlength="180" value="${escapeHtml(draft.project)}"
          placeholder="填写你的作品名称">
      </div>
      <div class="field span-full">
        <label for="summary">项目摘要 <span class="field-required" aria-hidden="true">*</span></label>
        <textarea id="summary" name="summary" data-draft required rows="4" maxlength="12000"
          placeholder="写下目标用户、主要功能、参赛者资格、开发方式和材料进度…"></textarea>
      </div>
    </div>`);

  return `<form id="intake-form" class="panel-stack">${competitionPanel}${projectPanel}
    <div class="stage-action-bar">
      <button type="submit" class="button button-primary" ${importPending ? 'disabled' : ''} id="analyze-button">
        提取门槛与材料 ${icon('arrow-right', 16)}
      </button>
      ${button('清空资料', 'clear-workspace', { style: 'quiet' })}
    </div>
  </form>`;
}

function updateIntakeAside() {
  const { draft, sample } = state;
  const rows = [
    ['赛规文本', Boolean(draft.rule.trim())],
    ['项目摘要', Boolean(draft.summary.trim())],
    ['来源链接', Boolean(httpUrl(draft.source.trim()))],
  ];
  aside.innerHTML = panel('资料概览', '', `
    <ul class="compact-list">
      ${rows.map(([label, ready]) => `<li><span>${label}</span>${badge(ready ? '已录入' : '待录入', ready ? 'success' : 'neutral')}</li>`).join('')}
    </ul>
    ${state.analysis && !hasCurrentAnalysis(state) ? '<p class="alert">资料已更新。重新提取后，请核验新的门槛。</p>' : ''}
    ${sample ? '<p class="field-hint">内置示例使用主办方规则摘编和虚构项目。投递请核对当前资料。</p>' : ''}
    ${httpUrl(draft.source.trim()) ? `<a class="inline-link" href="${escapeHtml(httpUrl(draft.source.trim()))}" target="_blank" rel="noopener noreferrer">${icon('link', 15)} 打开赛规来源</a>` : ''}
  `) + panel('提取方式', '', `
    <p class="field-hint">系统按录入文本提取候选门槛与材料，并保留出处供你核对。</p>
    <p class="field-hint">将资格、提交要求和截止日期分行录入，更容易定位引用。</p>
  `);
}

function sourceLine(item) {
  if (!item.line) {
    const label = item.manual || item.kind === 'manual' || item.kind === 'gate' ? '手动补录' : '赛规摘录';
    return `<span class="muted">${label}</span>`;
  }
  return `<button type="button" class="inline-link" data-action="show-line" data-line="${Number(item.line)}">
    ${icon('link', 14)} 赛规第 ${Number(item.line)} 行
  </button>`;
}

function gateTone(status) {
  return status === 'pass' ? 'success' : status === 'fail' ? 'danger' : 'warning';
}

function renderGate(gate, index) {
  return `<article class="review-item" data-gate-index="${index}">
    <div class="review-item-heading">
      <h3>${escapeHtml(gate.title)}</h3>
      <span data-gate-badge>${badge(GATE_STATUS[gate.status], gateTone(gate.status))}</span>
    </div>
    <div class="evidence-quote">
      ${sourceLine(gate)}
      ${gate.quote ? `<blockquote>${escapeHtml(gate.quote)}</blockquote>` : '<p class="field-hint">尚未补录出处。</p>'}
    </div>
    <div class="project-evidence">
      <strong>项目摘要线索</strong>
      <p>${gate.evidence ? escapeHtml(gate.evidence) : '暂无匹配片段，请结合项目材料核对。'}</p>
      ${gate.suggestion ? `<p class="field-hint">${escapeHtml(gate.suggestion)}</p>` : ''}
    </div>
    <div class="form-grid">
      <div class="field">
        <label for="gate-status-${index}">核验结果</label>
        <select id="gate-status-${index}" data-gate-status>${options(GATE_STATUS, gate.status)}</select>
      </div>
      <div class="field">
        <label for="gate-note-${index}">核验备注</label>
        <input id="gate-note-${index}" data-gate-note maxlength="600" value="${escapeHtml(gate.note)}" placeholder="记录凭据、出处或待确认事项">
      </div>
    </div>
  </article>`;
}

function renderReview() {
  if (!hasCurrentAnalysis(state)) {
    const copy = state.analysis
      ? '资料有改动。返回录入页重新提取后，即可核验当前资料。'
      : '录入赛规和项目摘要并提取内容后，候选门槛会出现在这里。';
    return panel('门槛核验', '', emptyState('等待提取赛规', copy,
      button('返回录入资料', 'open-intake', { style: 'primary' })));
  }

  const gates = state.analysis.gates;
  return `<div class="panel-stack">
    ${panel('候选门槛', '引用来自当前录入文本。请按实际凭据确认核验结果。',
      gates.length
        ? `<div class="review-list">${gates.map(renderGate).join('')}</div>`
        : emptyState('未识别到明确门槛', '你可以核对原文并手动补录。'))}
    ${panel('补录门槛', '', `
      <form id="gate-form" class="panel-stack">
        <div class="form-grid">
          <div class="field">
            <label for="manual-gate-title">门槛名称</label>
            <input id="manual-gate-title" name="title" maxlength="180" required placeholder="例如：作品授权声明">
          </div>
          <div class="field">
            <label for="manual-gate-source">出处或原文 <span class="muted">选填</span></label>
            <input id="manual-gate-source" name="source" maxlength="1000" placeholder="写入条款或来源">
          </div>
        </div>
        <div><button type="submit" class="button button-secondary">加入核验</button></div>
      </form>
    `)}
    <div class="stage-action-bar">
      ${button('生成投递清单', 'generate-checklist', { symbol: 'arrow-right', style: 'primary' })}
    </div>
  </div>`;
}

function gateMetrics() {
  const counts = summarize(state);
  return `<ul class="compact-list">
    <li><span>符合</span>${badge(counts.passed, 'success')}</li>
    <li><span>待确认</span>${badge(counts.pending, 'warning')}</li>
    <li><span>不符合</span>${badge(counts.blocked, 'danger')}</li>
    <li><span>识别到的材料</span>${badge(hasCurrentAnalysis(state) ? state.analysis.materials.length : 0)}</li>
  </ul>`;
}

function renderReviewAside() {
  if (!hasCurrentAnalysis(state)) return '';
  return panel('核验概览', '', `<div id="gate-metrics">${gateMetrics()}</div>`) +
    panel('检索赛规证据', '本地原文检索', `
      <form id="evidence-form" class="evidence-form">
        <div class="field">
          <label for="evidence-query">关键词</label>
          <input id="evidence-query" name="query" maxlength="120" value="${escapeHtml(evidenceQuery)}" placeholder="例如：提交材料">
        </div>
        <button type="submit" class="button button-secondary">${icon('search', 15)} 检索</button>
      </form>
      <div id="evidence-results" aria-live="polite"></div>
    `) + `<div id="ai-review-panel" aria-live="polite">${renderAiReview()}</div>`;
}

function updateEvidenceResults() {
  const region = aside.querySelector('#evidence-results');
  if (!region || !hasCurrentAnalysis(state)) return;
  const results = evidenceQuery
    ? retrieveEvidence(state.draft.rule, evidenceQuery, 5)
    : state.analysis.excerpts.slice(0, 3);
  region.innerHTML = results.length
    ? `<ol class="evidence-results">
      ${results.map(item => `<li>${sourceLine(item)}<p>${escapeHtml(item.text)}</p></li>`).join('')}
    </ol>`
    : `<p class="field-hint">${evidenceQuery ? '暂无匹配。可尝试更短的关键词或原文用词。' : '输入关键词以查找相关原文。'}</p>`;
}

function renderAiReview() {
  if (!aiAvailable) {
    return panel('AI 复核建议', '', '<p class="field-hint">当前使用本地检索。配置模型服务后可按需复核。</p>');
  }

  const result = aiResult?.fingerprint === state.analysis?.fingerprint ? aiResult : null;
  return panel('AI 复核建议', '参考建议由配置的模型生成，请对照引用人工核验。', `
    <p class="field-hint">发起后，项目摘要、关键词和命中的赛规片段将发送给已配置的模型。</p>
    ${button(result?.pending ? '正在复核…' : '复核当前关键词', 'ai-review', { symbol: 'sparkles', disabled: result?.pending })}
    ${result?.error ? `<p class="alert alert-error">${escapeHtml(result.error)}</p>` : ''}
    ${result?.answer ? `<div class="ai-answer">
      <p class="field-hint">复核关键词：${escapeHtml(result.query)}</p>
      <p>${escapeHtml(result.answer)}</p>
      <ol class="evidence-results">${result.citations.map(item => `<li>${sourceLine(item)}<p>${escapeHtml(item.text)}</p></li>`).join('')}</ol>
    </div>` : ''}
  `);
}

function updateAiPanel() {
  const region = aside.querySelector('#ai-review-panel');
  if (region && hasCurrentAnalysis(state)) region.innerHTML = renderAiReview();
}

function aiEndpoint(path) {
  return new URL(`api/ai/${path}`, document.baseURI);
}

async function checkAiAvailability() {
  try {
    const response = await fetch(aiEndpoint('status'), { headers: { Accept: 'application/json' } });
    if (!response.ok) return;
    aiAvailable = (await response.json()).available === true;
    if (aiAvailable) updateAiPanel();
  } catch {
    // Local evidence search is available even when the API cannot be reached.
  }
}

async function requestAiReview() {
  if (!aiAvailable || !hasCurrentAnalysis(state)) return;
  const queryInput = aside.querySelector('#evidence-query');
  const query = queryInput?.value.trim();
  if (!query) {
    queryInput?.setCustomValidity('输入关键词后再发起复核。');
    queryInput?.reportValidity();
    return;
  }

  evidenceQuery = query;
  updateEvidenceResults();
  const result = { fingerprint: state.analysis.fingerprint, query, pending: true, error: '', answer: '', citations: [] };
  aiResult = result;
  updateAiPanel();

  try {
    const response = await fetch(aiEndpoint('review'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ruleText: state.draft.rule,
        projectSummary: state.draft.summary,
        query,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : '模型服务暂无法复核。');
    if (typeof data.answer !== 'string' || !Array.isArray(data.citations)) {
      throw new Error('模型服务返回的数据不完整。');
    }
    result.answer = data.answer;
    result.citations = data.citations;
  } catch (error) {
    result.error = error instanceof SyntaxError ? '模型服务暂无法复核，请稍后重试。' : error.message;
  } finally {
    result.pending = false;
    if (aiResult === result) updateAiPanel();
  }
}

function renderTask(task, index) {
  const kindLabel = { material: '投递材料', gate: '门槛待办', manual: '自定义' }[task.kind];
  return `<article class="task-item" data-task-index="${index}">
    <div class="task-item-heading">
      <div>
        ${badge(kindLabel, task.kind === 'gate' ? 'warning' : 'neutral')}
        <h3>${escapeHtml(task.title)}</h3>
      </div>
      <div class="field">
        <label class="visually-hidden" for="task-status-${index}">任务状态：${escapeHtml(task.title)}</label>
        <select id="task-status-${index}" data-task-status>${options(TASK_STATUS, task.status)}</select>
      </div>
    </div>
    ${task.quote ? `<div class="evidence-quote">${sourceLine(task)}<blockquote>${escapeHtml(task.quote)}</blockquote></div>` : ''}
    <div class="form-grid">
      <div class="field">
        <label for="task-owner-${index}">负责人</label>
        <input id="task-owner-${index}" data-task-owner maxlength="120" value="${escapeHtml(task.owner)}" placeholder="填写负责人">
      </div>
      <div class="field">
        <label for="task-note-${index}">进度备注</label>
        <input id="task-note-${index}" data-task-note maxlength="600" value="${escapeHtml(task.note)}" placeholder="记录当前进展">
      </div>
    </div>
  </article>`;
}

function renderChecklist() {
  if (!hasCurrentAnalysis(state)) {
    const title = state.checklist ? '资料已变更' : '等待核验门槛';
    const message = state.checklist
      ? '返回录入页重新提取并核验。同一赛事和项目中，来源不变的材料任务会带回原有进度。'
      : '完成当前赛规的内容提取与核验后，即可生成投递清单。';
    return panel('投递任务', '', emptyState(title, message,
      button('返回录入资料', 'open-intake', { style: 'primary' })));
  }
  if (!hasCurrentChecklist(state)) {
    const message = state.checklist
      ? '核验结果或资料已更新。重新生成后，同一赛事和项目下的相同材料与手动任务会保留原有进度。'
      : '核验赛规后，可将投递材料及尚未解决的门槛转成任务。';
    return panel('投递任务', '', emptyState(state.checklist ? '清单等待更新' : '等待生成清单', message,
      button('返回门槛核验', 'open-review', { style: 'primary' })));
  }

  const tasks = state.checklist.items;
  return `<div class="panel-stack">
    ${panel('投递任务', '对照赛规出处维护负责人和准备进度。',
      tasks.length
        ? `<div class="task-list">${tasks.map(renderTask).join('')}</div>`
        : emptyState('暂无投递任务', '当前材料提取为空，可按规则补充任务。'))}
    ${panel('新增任务', '', `
      <form id="task-form" class="evidence-form">
        <div class="field">
          <label for="manual-task-title">任务名称</label>
          <input id="manual-task-title" name="title" maxlength="180" required placeholder="例如：检查材料命名">
        </div>
        <button type="submit" class="button button-secondary">加入清单</button>
      </form>
    `)}
  </div>`;
}

function updateChecklistAside() {
  if (!hasCurrentChecklist(state)) {
    aside.innerHTML = '';
    return;
  }
  const { gateTotal, pending, blocked, taskTotal, completed } = summarize(state);
  const percent = taskTotal ? Math.round((completed / taskTotal) * 100) : 0;
  const reviewCopy = !gateTotal
    ? '未识别到明确门槛。请结合原文核对。'
    : pending || blocked
      ? `还有 ${pending} 项待确认、${blocked} 项不符合。请回到核验页更新结论。`
      : '当前门槛均已人工确认为符合。';
  aside.innerHTML = panel('投递进度', '', `
    <div class="task-progress">
      <div class="progress-numbers"><strong>${completed} / ${taskTotal}</strong><span>${percent}%</span></div>
      <div class="progress-track" role="progressbar" aria-label="投递任务完成度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <p class="field-hint">已完成的任务 / 全部任务</p>
    </div>
    <p class="field-hint">${reviewCopy}</p>`,
    button('导出 Markdown', 'export-markdown', { symbol: 'download' }));
}

function focusRuleLine(line) {
  openStage('intake', { focus: false });
  const field = content.querySelector('#rule');
  const lines = field.value.split('\n');
  if (!Number.isInteger(line) || line < 1 || line > lines.length) return;
  const start = lines.slice(0, line - 1).reduce((offset, text) => offset + text.length + 1, 0);
  field.focus();
  field.setSelectionRange(start, start + lines[line - 1].length);
  field.scrollTop = Math.max(0, (line - 2) * (parseFloat(getComputedStyle(field).lineHeight) || 20));
}

function resetWorkspace(sample) {
  if (DRAFT_FIELDS.some(field => state.draft[field].trim()) &&
      !window.confirm(sample ? '载入演示将替换当前工作台资料。继续吗？' : '清空当前资料、核验和投递清单？')) {
    return;
  }
  ++importToken;
  importPending = false;
  importNotice = '';
  evidenceQuery = '';
  aiResult = null;
  state = initialState();
  if (sample) {
    state.draft = { ...demoDraft };
    state.sample = true;
  }
  openStage('intake');
  notice(sample ? '演示资料已载入' : '工作台资料已清空');
}

async function readImportedFile(file) {
  if (!file) return;
  const token = ++importToken;
  importPending = true;
  importNotice = '正在读取赛规…';
  const button = content.querySelector('#analyze-button');
  if (button) button.disabled = true;
  const status = content.querySelector('#rule-file-status');
  if (status) status.textContent = importNotice;

  try {
    const text = await readRuleFile(file);
    if (token !== importToken) return;
    if (!text.trim()) throw new Error('文件中没有可录入的文字。');
    if (text.length > maxRuleLength) throw new Error('文件文字超过 15 万字，请选取与投递相关的条款。');
    state.draft.rule = text.replace(/\r\n?/g, '\n');
    state.fileName = file.name;
    importNotice = '赛规文件已导入';
    save();
  } catch (error) {
    if (token === importToken) importNotice = error.message;
  } finally {
    if (token === importToken) {
      importPending = false;
      if (state.stage === 'intake') {
        renderStage();
        content.querySelector('[data-action="import-rules"]')?.focus();
      }
      notice(importNotice);
    }
  }
}

function downloadMarkdown() {
  const markdown = exportChecklist(state);
  if (!markdown) return;
  const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'EntryFlow-投递清单.md';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  notice('已导出投递清单');
}

app.addEventListener('click', event => {
  const control = event.target.closest('button');
  if (!control) return;
  if (Object.hasOwn(stages, control.dataset.stage)) {
    openStage(control.dataset.stage);
    return;
  }

  switch (control.dataset.action) {
    case 'load-sample': resetWorkspace(true); break;
    case 'clear-workspace': resetWorkspace(false); break;
    case 'open-intake': openStage('intake'); break;
    case 'open-review': openStage('review'); break;
    case 'import-rules': content.querySelector('#rule-file').click(); break;
    case 'show-line': focusRuleLine(Number(control.dataset.line)); break;
    case 'export-markdown': downloadMarkdown(); break;
    case 'ai-review': void requestAiReview(); break;
    case 'generate-checklist':
      generateChecklist(state);
      openStage('checklist');
      notice('投递清单已生成');
      break;
  }
});

app.addEventListener('input', event => {
  const field = event.target;
  if (field.matches('[data-draft]')) {
    if (field.name === 'rule' && importPending) {
      ++importToken;
      importPending = false;
      importNotice = '已保留当前手动编辑的赛规';
      content.querySelector('#rule-file-status').textContent = importNotice;
      content.querySelector('#analyze-button').disabled = false;
    }
    state.draft[field.name] = field.value;
    const sampleSource = content.querySelector('#sample-source-tag');
    if (sampleSource && state.sample) sampleSource.innerHTML = sampleTag();
    field.setCustomValidity('');
    save();
    updateStageNavigation();
    updateIntakeAside();
  } else if (field.matches('[data-gate-note]') && hasCurrentAnalysis(state)) {
    const gate = state.analysis.gates[Number(field.closest('[data-gate-index]').dataset.gateIndex)];
    gate.note = field.value;
    save();
  } else if (field.matches('[data-task-owner], [data-task-note]') && hasCurrentChecklist(state)) {
    const task = state.checklist.items[Number(field.closest('[data-task-index]').dataset.taskIndex)];
    if (field.matches('[data-task-owner]')) task.owner = field.value;
    else task.note = field.value;
    save();
  } else if (field.id === 'evidence-query') {
    field.setCustomValidity('');
  }
});

app.addEventListener('change', event => {
  const field = event.target;
  if (field.id === 'rule-file') {
    void readImportedFile(field.files[0]);
    field.value = '';
  } else if (field.matches('[data-gate-status]') && hasCurrentAnalysis(state)) {
    const row = field.closest('[data-gate-index]');
    const gate = state.analysis.gates[Number(row.dataset.gateIndex)];
    gate.status = field.value;
    row.querySelector('[data-gate-badge]').innerHTML = badge(GATE_STATUS[gate.status], gateTone(gate.status));
    aside.querySelector('#gate-metrics').innerHTML = gateMetrics();
    save();
    updateStageNavigation();
  } else if (field.matches('[data-task-status]') && hasCurrentChecklist(state)) {
    const task = state.checklist.items[Number(field.closest('[data-task-index]').dataset.taskIndex)];
    task.status = field.value;
    save();
    updateStageNavigation();
    updateChecklistAside();
  }
});

function handleIntake(form, values) {
  if (importPending) return;
  for (const field of form.querySelectorAll('[required]')) {
    if (!field.value.trim()) {
      field.setCustomValidity('请填写这项资料。');
      field.reportValidity();
      return;
    }
  }
  const source = form.elements.source;
  if (source.value.trim() && !httpUrl(source.value.trim())) {
    source.setCustomValidity('请填写以 https:// 或 http:// 开头的链接。');
    source.reportValidity();
    return;
  }

  state.draft = Object.fromEntries(DRAFT_FIELDS.map(field => [field, String(values.get(field) ?? '')]));
  applyAnalysis(state, analyzeRules(state.draft.rule, state.draft.summary));
  evidenceQuery = '';
  openStage('review');
  notice('门槛与材料已提取');
}

app.addEventListener('submit', event => {
  const form = event.target;
  event.preventDefault();
  const values = new FormData(form);

  switch (form.id) {
    case 'intake-form':
      handleIntake(form, values);
      break;
    case 'evidence-form':
      evidenceQuery = String(values.get('query') ?? '').trim();
      updateEvidenceResults();
      break;
    case 'gate-form':
      if (!String(values.get('title')).trim()) return;
      addGate(state, String(values.get('title')), String(values.get('source')));
      save();
      renderStage();
      content.querySelector('#manual-gate-title').focus();
      notice('门槛已添加');
      break;
    case 'task-form':
      if (!String(values.get('title')).trim()) return;
      addTask(state, String(values.get('title')));
      save();
      renderStage();
      content.querySelector('#manual-task-title').focus();
      notice('任务已添加');
      break;
  }
});

renderStage();
void checkAiAvailability();
