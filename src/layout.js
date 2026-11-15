const iconPaths = {
  logo: '<path d="M3 18h5l5-10h8M16 3l5 5-5 5M3 12h3M3 7h5" />',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h5"/>',
  shield: '<path d="M12 22s7-3.5 7-10V5l-7-3-7 3v7c0 6.5 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/>',
  list: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2m6 2V2M8.5 10l1 1 2-2m2 1h2.5m-7.5 5 1 1 2-2m2 1h2.5"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  'arrow-right': '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  link: '<path d="m10 13 4-4m-5.5 6.5-2 2a3.5 3.5 0 1 1-5-5l3.5-3.5a3.5 3.5 0 0 1 5 0m3-1.5 2-2a3.5 3.5 0 1 1 5 5l-3.5 3.5a3.5 3.5 0 0 1-5 0" transform="translate(1 1)"/>',
  sparkles: '<path d="M12 2v6m-3-3h6M5 9v8m-4-4h8m8-3 1.5 4.5L23 16l-4.5 1.5L17 22l-1.5-4.5L11 16l4.5-1.5Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  'triangle-alert': '<path d="M11 3.5a1.2 1.2 0 0 1 2 0l8.5 15a1.2 1.2 0 0 1-1 1.8h-17a1.2 1.2 0 0 1-1-1.8Z"/><path d="M12 9v4m0 3h.01"/>',
  download: '<path d="M12 4v12m-5-5 5 5 5-5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  circles: '<circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  edit: '<path d="m14 5 5 5m-2-7a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3L9 19l-5 1 1-5Z"/>',
  sample: '<path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h4"/>',
  device: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
};

const stages = [
  { id: 'intake', label: '录入资料', description: '赛规原文与项目摘要', iconName: 'file' },
  { id: 'review', label: '核验门槛', description: '对照条款，逐项确认', iconName: 'shield' },
  { id: 'checklist', label: '投递清单', description: '准备材料，跟踪进度', iconName: 'list' },
];

export function icon(name, size = 20) {
  const paths = iconPaths[name] ?? '';
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
}

export function keepFocusedControlInView(stageContent) {
  stageContent.addEventListener('focusin', ({ target }) => {
    const actionBar = stageContent.querySelector('.stage-action-bar');
    if (!actionBar || actionBar.contains(target) || !target.matches('button, input, textarea, select, a[href]')) return;

    requestAnimationFrame(() => {
      if (target !== document.activeElement || !actionBar.isConnected) return;
      const control = target.getBoundingClientRect();
      const bar = actionBar.getBoundingClientRect();
      if (control.bottom > bar.top && control.top < bar.bottom) {
        window.scrollBy(0, control.bottom - bar.top + 8);
      }
    });
  });
}

function sideNavigation() {
  return stages.map(({ id, label, iconName }, index) => `
    <button type="button" class="sidebar-link${index === 0 ? ' is-active' : ''}" data-stage="${id}"${index === 0 ? ' aria-current="step"' : ''}>
      ${icon(iconName, 18)}
      <span>${label}</span>
      <span class="sidebar-chevron">${icon('chevron-right', 15)}</span>
    </button>
  `).join('');
}

function stageNavigation() {
  return stages.map(({ id, label, description }, index) => `
    <button type="button" class="step-link${index === 0 ? ' is-active' : ''}" data-stage="${id}"${index === 0 ? ' aria-current="step"' : ''}>
      <span class="step-marker" aria-hidden="true">
        <span class="step-number">${index + 1}</span>
        <span class="step-check">${icon('check', 18)}</span>
      </span>
      <span class="step-label"><strong>${label}</strong><small>${description}</small></span>
      <span class="step-arrow">${icon('chevron-right', 16)}</span>
    </button>
  `).join('');
}

export function renderShell() {
  return `
    <a class="skip-link" href="#stage-content">跳到当前阶段</a>
    <div class="app-shell">
      <aside class="sidebar" aria-label="工作区侧栏">
        <div class="brand" aria-label="竞途有序 EntryFlow">
          <span class="brand-mark">${icon('logo', 25)}</span>
          <span class="brand-text"><strong>竞途有序</strong><small>EntryFlow</small></span>
        </div>
        <div class="sidebar-menu">
          <p class="sidebar-label">工作流程</p>
          <nav class="sidebar-nav" aria-label="工作流程">${sideNavigation()}</nav>
        </div>
        <div class="sidebar-footer">
          ${icon('device', 19)}
          <span>本地工作区<small>当前浏览器存储</small></span>
        </div>
      </aside>
      <div class="workspace-shell">
        <header class="topbar">
          <div class="topbar-inner">
            <p class="breadcrumbs"><span>工作区</span>${icon('chevron-right', 13)}<strong>投递工作台</strong></p>
            <div class="topbar-actions">
              <span class="save-status" id="save-status" aria-live="polite">本地保存</span>
              <button class="button button-secondary sample-button" type="button" data-action="load-sample">${icon('sample', 17)}<span>载入示例</span></button>
            </div>
          </div>
        </header>
        <main class="workspace" id="workspace">
          <header class="workspace-heading">
            <h1 id="stage-title">竞赛投递工作台</h1>
            <p id="stage-description">汇总赛规与项目材料，把每一项投递要求落到行动。</p>
          </header>
          <nav class="stage-nav" aria-label="投递阶段">${stageNavigation()}</nav>
          <div class="workspace-columns">
            <section id="stage-content" class="stage-content" aria-labelledby="stage-title" tabindex="-1"></section>
            <aside id="stage-aside" class="stage-aside" aria-label="当前阶段辅助信息"></aside>
          </div>
        </main>
      </div>
    </div>
  `;
}
