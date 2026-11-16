import { analyzeRules } from './evidence.js';
import { allowsStage, clauseScope, indexRuleLines, mentionedStages, RULE_SCOPE_LABELS, validRuleScope } from './rule-scope.js';

export const REVIEW_PRESETS = [
  { id: 'deadline-eligibility', label: '截止与资格', query: '报名和作品提交何时截止，需要核对哪些参赛资格？' },
  { id: 'repo-process', label: '仓库与开发证据', query: '提交仓库需要哪些公开权限、Git 提交历史和 Prompt 迭代证据？' },
  { id: 'deliverables', label: '待补交付物', query: '赛规要求提交哪些材料，项目摘要还有哪些准备情况需要确认？' },
  { id: 'custom', label: '自定义问题', query: '' },
];

const topics = {
  'deadline-eligibility': [
    {
      id: 'deadline',
      label: '报名与交件时间',
      rule: /截止|提交.{0,8}(?:时间|日期|期限)|报名时间|不予受理|逾期|deadline|due date/iu,
      project: /截止|前完成(?:报名|提交)|已报名|尚未报名|计划.{0,16}(?:交件|投递|报名)|已(?:交件|投递)|\d{1,2}\s*月\s*\d{1,2}\s*日|\d{4}-\d{1,2}-\d{1,2}|deadline/iu,
      keywords: '截止 报名时间 提交日期 交件 逾期 时区',
      action: '向赛事平台核对报名与交件的截止时间、时区及入口，并记录团队的执行日期。',
    },
    {
      id: 'eligibility',
      label: '身份与组别',
      rule: /正式学籍|全日制|在校生|在校学生|参赛(?:资格|对象|组别)|报名资格|研究生组|本科组|高职组|[ABC]\s*组|eligib(?:ility|le)/iu,
      project: /全日制|学籍|在读|在校(?:生|学生)|组别|本科生|专科生|研究生|[ABC]\s*组|enrolled/iu,
      keywords: '全日制 学籍 在校 参赛资格 组别 研究生 本科 高职',
      action: '核对正式学籍和对应组别，记录适用条款及可提供的资格证明。',
    },
    {
      id: 'team',
      label: '个人或组队要求',
      rule: /个人(?:赛|参赛|为单位)|单人参赛|团队人数|队伍人数|组队|每(?:队|组|支队伍).{0,14}(?:[0-9一二三四两]+\s*(?:人|名)|队员|成员)|team.{0,18}members?/iu,
      project: /个人(?:赛|参赛|为单位)|独立(?:参赛|完成|开发)|单人|团队.{0,12}[0-9一二三四两]+\s*(?:人|名|位)|[0-9一二三四两]+\s*(?:名|人|位).{0,8}(?:队员|成员)/iu,
      keywords: '个人参赛 独立开发 组队 成员 队员 人数',
      action: '确认这次是个人还是团队投递，并校对报名名单与组队限制。',
    },
  ],
  'repo-process': [
    {
      id: 'repository',
      label: '仓库与评审权限',
      rule: /仓库|\bGitHub\b|\bGitee\b|repositor(?:y|ies)/iu,
      project: /仓库|\bGitHub\b|\bGitee\b|repositor(?:y|ies)/iu,
      keywords: '仓库 GitHub Gitee 公开 评审权限 开放访问',
      action: '对照赛规核对仓库公开权限或评审访问授权，用未登录窗口或评审账号打开链接并记录结果。',
    },
    {
      id: 'git-history',
      label: '真实 Git 演进记录',
      rule: /\bgit\b.{0,18}(?:历史|提交|commit)|细粒度.{0,10}提交|commit history/iu,
      project: /\bgit\b.{0,18}(?:历史|提交|commit)|(?:历史|版本|细粒度).{0,8}提交|commit history/iu,
      keywords: 'Git 历史 提交记录 演进 细粒度 commit',
      action: '复查真实提交历史，找出能对应核心功能演进的提交链接或记录。',
    },
    {
      id: 'prompt-history',
      label: 'Prompt 迭代证据',
      rule: /\bprompt\b|提示词|迭代链|AI 对话|对话(?:过程|记录|历史)/iu,
      project: /\bprompt\b|提示词|迭代链|AI 对话|对话(?:过程|记录|历史)/iu,
      keywords: 'Prompt 提示词 AI对话 迭代链 开发过程',
      action: '把原始提示、模型产出与后续修订对齐到核心功能，核对迭代链是否齐全。',
    },
    {
      id: 'reproduction',
      materialId: 'readme',
      label: '复现指南',
      rule: /\bREADME\b|复现(?:指南|步骤|说明)|环境(?:变量模板|配置与依赖)/iu,
      project: /\bREADME\b|复现(?:指南|步骤|说明)|环境(?:变量模板|配置与依赖)/iu,
      keywords: 'README 十分钟 复现指南 快速启动 环境配置 依赖',
      action: '用干净环境按 README 安装依赖、配置变量并运行项目，记录复现耗时和运行结果。',
    },
  ],
};

const materialKeywords = {
  repository: '仓库 源代码 GitHub Gitee',
  'source-code': '源代码 项目代码 源码',
  'project-doc': '项目说明文档 作品说明 项目文档 使用手册',
  readme: 'README 复现指南',
  'technical-doc': '技术文档 技术说明 PDF技术文档',
  report: '作品报告 项目报告 技术报告 调研报告 论文',
  slides: 'PPT PPTX 幻灯片 答辩展示',
  'demo-video': '演示视频 视频 录屏 MP4',
  'live-demo': '在线演示 部署链接 线上演示 演示网址',
  screenshots: '截图 界面图',
  'git-history': 'Git历史 Git提交 提交历史 提交记录',
  'prompt-history': 'Prompt 对话 提示词 迭代链',
  process: '开发过程 开发记录 开发日志',
  application: '报名表 参赛登记表 提交表单',
  declaration: '原创声明 授权书 承诺书',
  'identity-proof': '资格证明 学籍证明 在读证明 学生证',
  package: '运行包 安装包 压缩包',
};
const materialActions = {
  ...Object.fromEntries(topics['repo-process'].map(({ id, materialId, action }) => [materialId ?? id, action])),
  'demo-video': '对照原文核对时长、视频规格及是否需要展示协同过程，保存最终文件或评审链接。',
  'technical-doc': '对照原文检查文档要求的格式、页数和章节，保存最终文件。',
};

const aliases = [
  ['截止', '最后期限', '最晚', '最后一天', 'deadline'],
  ['资格', '学籍', '在校', '全日制', 'eligible'],
  ['仓库', 'github', 'gitee', 'repository', 'repo'],
  ['提示词', 'prompt', '迭代链', '对话记录'],
  ['视频', '录屏', 'mp4', 'video'],
  ['说明书', '技术文档', '技术报告', 'documentation'],
];
const ignoredTerms = new Set([
  '是否', '如何', '怎么', '什么', '多少', '什么时候', '时候', '哪些', '哪种', '能否', '可以', '需要',
  '请问', '项目', '赛规', '作品', '材料', '符合', '要求', '提交', '必须', '当前', '完成', '团队',
  'and', 'can', 'does', 'for', 'how', 'must', 'need', 'the', 'what', 'when', 'with', 'should',
]);
const segmenter = Intl.Segmenter ? new Intl.Segmenter('zh-CN', { granularity: 'word' }) : null;
const segmentLength = 520;
const segmentOverlap = 70;
const deadlineQuery = /截止|截至|最后(?:一天|期限)|最晚|日期|时间|何时|什么时候|几点|哪天|deadline/iu;
const dateEvidence = /\d{1,4}\s*[-./年]\s*\d{1,2}|\d{1,2}\s*月\s*\d{1,2}\s*(?:日|号)|[0-9一二三四五六七八九十]+(?:个)?(?:天|日|周|小时)内|截止.{0,24}(?:待定|另行|公告|通知|公布)/u;
const submissionTiming = /交件|投递|作品.{0,8}(?:提交|截止)|提交.{0,8}(?:作品|截止|时间|日期)|交稿|上传作品/u;
const registrationTiming = /报名|注册/u;

function normalize(value) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
}

function indexSource(source, value) {
  const lines = source === 'rule'
    ? indexRuleLines(value).filter(({ isHeading }) => !isHeading)
    : value.split(/\r\n|\n|\r/u).map((text, lineIndex) => ({ text, line: lineIndex + 1, column: 1 }));
  return lines.flatMap((row) => (
    [...row.text.matchAll(/[^。！？；]+[。！？；]*/gu)].flatMap((match) => {
      const text = match[0].trim();
      if (!text) return [];
      const offset = match.index + match[0].indexOf(text);
      const context = source === 'rule' ? clauseScope(row, text) : {};
      const windows = [];
      for (let start = 0; start < text.length; start += segmentLength - segmentOverlap) {
        const fragment = text.slice(start, start + segmentLength);
        const number = row.line;
        const column = row.column + offset + start;
        windows.push({
          id: `${source}-${number}-${column}`,
          source,
          line: number,
          column,
          text: fragment,
          ...context,
          normalized: normalize(fragment),
        });
        if (start + segmentLength >= text.length) break;
      }
      return windows;
    })
  ));
}

function tokens(value) {
  const words = segmenter
    ? [...segmenter.segment(value)].filter((segment) => segment.isWordLike).map((segment) => segment.segment)
    : value.match(/[a-z0-9]+|\p{Script=Han}+/gu) ?? [];
  return words.filter((word) => (word.length > 1 || /^\d$/u.test(word)) && !ignoredTerms.has(word));
}

function features(query) {
  const normalized = normalize(query);
  const words = new Map(tokens(normalized).map((word) => [word, 1]));

  for (const phrase of normalized.match(/[\p{Script=Han}]{2,}|[a-z][a-z0-9#+.-]*/gu) ?? []) {
    if (ignoredTerms.has(phrase)) continue;
    if (phrase.length <= 10) words.set(phrase, 1.8);
    if (!/^\p{Script=Han}{3}/u.test(phrase)) continue;
    for (let i = 0; i < phrase.length - 1; i += 1) {
      const pair = phrase.slice(i, i + 2);
      if (!ignoredTerms.has(pair) && !words.has(pair)) words.set(pair, 0.34);
    }
  }

  for (const group of aliases) {
    if (!group.some((term) => normalized.includes(term))) continue;
    for (const term of group) if (!words.has(term)) words.set(term, 0.7);
  }

  return [...words].sort((left, right) => right[1] - left[1]).slice(0, 40);
}

function termMatcher(term) {
  if (!/^[a-z][a-z0-9#.+-]*$/u.test(term)) return (value) => value.includes(term);
  const escaped = term.replace(/[.*+?^$(){}|[\]\\]/gu, '\\$&');
  const pattern = new RegExp(`(?:^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, 'u');
  return (value) => pattern.test(value);
}

function rank(index, query, limit) {
  const search = normalize(query);
  const exactMatch = termMatcher(search);
  const weights = features(search).map(([term, weight]) => {
    const match = termMatcher(term);
    const frequency = index.reduce((count, row) => count + Number(match(row.normalized)), 0);
    return [match, weight, Math.log1p((index.length - frequency + 0.5) / (frequency + 0.5))];
  });
  return index.flatMap(({ normalized, ...excerpt }) => {
    const matched = weights.filter(([match]) => match(normalized));
    const exact = Boolean(search && exactMatch(normalized));
    const hasReliableTerm = matched.some(([, weight]) => weight >= 0.7);
    if (!exact && !hasReliableTerm && matched.length < 2) return [];
    const termsScore = matched.reduce((sum, [, weight, rarity]) => sum + weight * rarity, 0);
    const score = (exact ? 4 : 0) + termsScore / (1 + Math.max(0, normalized.length - 120) / 600);
    if (score <= 0) return [];
    return [{ ...excerpt, score: Number(score.toFixed(3)) }];
  })
    .sort((left, right) => right.score - left.score || left.line - right.line || left.column - right.column)
    .slice(0, limit);
}

function directExcerpt({ normalized: _, ...excerpt }) {
  return { ...excerpt, score: 1 };
}

function collect({ preset, query, scope, resolvedScopes, ruleExcerpts, projectExcerpts, missing, suggestions }) {
  const unique = (entries) => [...new Map(entries.map((entry) => [entry.id, entry])).values()];
  return {
    preset,
    query,
    scope,
    resolvedScopes,
    ruleExcerpts: unique(ruleExcerpts),
    projectExcerpts: unique(projectExcerpts),
    missing,
    suggestions,
  };
}

function reviewTopics(result, rules, project) {
  for (const topic of topics[result.preset]) {
    const ruleMatches = rules.filter(({ text, stage }) => topic.rule.test(text)
      && (topic.id !== 'deadline' || !result.resolvedScopes.length
        || (dateEvidence.test(text) && (result.resolvedScopes.includes(stage) || mentionedStages(text).length === 2))));
    const projectMatches = project.filter(({ text }) => topic.project.test(text));
    const ruleRefs = rank(ruleMatches, topic.keywords, 2);
    const projectRefs = rank(projectMatches, topic.keywords, 2);
    if (!ruleRefs.length && ruleMatches.length) ruleRefs.push(directExcerpt(ruleMatches[0]));
    if (!projectRefs.length && projectMatches.length) projectRefs.push(directExcerpt(projectMatches[0]));
    result.ruleExcerpts.push(...ruleRefs);
    result.projectExcerpts.push(...projectRefs);

    if (!ruleRefs.length) {
      result.missing.push(`赛规中未定位到「${topic.label}」条款。`);
      continue;
    }
    if (!projectRefs.length) result.missing.push(`项目摘要暂无「${topic.label}」的明确线索。`);
    result.suggestions.push({
      id: topic.id,
      title: `核对${topic.label}`,
      description: topic.action,
      ruleRefs: ruleRefs.map(({ id }) => id),
      projectRefs: projectRefs.map(({ id }) => id),
    });
  }
}

function reviewDeliverables(result, ruleText, rules, project) {
  const { materials } = analyzeRules(ruleText, '', { scope: result.scope });
  if (!materials.length) {
    result.missing.push('赛规中未定位到明确的交付物条款。可改用自定义问题查找原文。');
    return;
  }

  const missingTitles = [];
  const byLine = Map.groupBy ? Map.groupBy(rules, ({ line }) => line) : rules.reduce((groups, excerpt) => {
    const entries = groups.get(excerpt.line) ?? [];
    entries.push(excerpt);
    return groups.set(excerpt.line, entries);
  }, new Map());

  for (const material of materials) {
    const sources = material.references.flatMap((reference) => {
      const candidates = byLine.get(reference.line) ?? [];
      const closest = candidates.find(({ text, column }) => column <= reference.column
        && reference.column < column + text.length && text.includes(reference.text))
        ?? candidates.find(({ text, column }) => reference.column <= column
          && column < reference.column + reference.text.length && reference.text.includes(text));
      return closest ? [directExcerpt(closest)] : [];
    });
    if (!sources.length) continue;
    const labels = materialKeywords[material.typeId] ?? material.title;
    const matchesMaterial = labels.split(' ').map((label) => termMatcher(normalize(label)));
    const relevant = project.filter(({ normalized }) => matchesMaterial.some((match) => match(normalized)));
    const projectRefs = rank(relevant, labels, 1);
    const description = materialActions[material.typeId] ?? '对照赛规核实准备情况，记录交付链接或文件。';

    if (!projectRefs.length) missingTitles.push(material.title);
    result.ruleExcerpts.push(...sources);
    result.projectExcerpts.push(...projectRefs);
    result.suggestions.push({
      id: material.id,
      title: `核对${material.title}`,
      description,
      ruleRefs: [...new Set(sources.map(({ id }) => id))],
      projectRefs: projectRefs.map(({ id }) => id),
    });
  }
  if (missingTitles.length) result.missing.push(`项目摘要暂无明确线索：${missingTitles.join('、')}。`);
}

function scopedCustomRules(rules, stage, query) {
  const matching = rules.filter((entry) => allowsStage(entry.stage, stage));
  if (!deadlineQuery.test(query)) return matching;
  const needsSubmission = submissionTiming.test(query);
  const needsRegistration = registrationTiming.test(query);
  return matching.filter(({ stage: entryStage, text }) => dateEvidence.test(text)
    && (entryStage === stage || mentionedStages(text).length === 2)
    && (!needsSubmission || needsRegistration || submissionTiming.test(text))
    && (!needsRegistration || needsSubmission || registrationTiming.test(text)));
}

function reviewCustom(result, rules, project) {
  if (!result.query) {
    result.missing.push('输入问题后，可在赛规和项目摘要中检索相关原文。');
    return;
  }
  const projectRefs = rank(project, result.query, 3);
  result.projectExcerpts.push(...projectRefs);
  for (const scope of result.resolvedScopes.length ? result.resolvedScopes : ['all']) {
    const candidates = scope === 'all' ? rules : scopedCustomRules(rules, scope, result.query);
    const ruleRefs = rank(candidates, result.query, result.resolvedScopes.length > 1 ? 3 : 5);
    const label = RULE_SCOPE_LABELS[scope];
    if (!ruleRefs.length) {
      result.missing.push(label
        ? `赛规中未定位到明确适用于${label}的条款。请核对该阶段的官方通知。`
        : '赛规中未找到与该问题匹配的条款，建议换用赛规里的关键词。');
      continue;
    }
    result.ruleExcerpts.push(...ruleRefs);
    result.suggestions.push({
      id: scope === 'all' ? 'custom-review' : `custom-review@${scope}`,
      title: `核对${label ?? ''}：${result.query.slice(0, 42)}`,
      description: '对照命中条款和摘要片段，写下待确认事项及需要补充的材料。',
      ruleRefs: ruleRefs.slice(0, 3).map(({ id }) => id),
      projectRefs: projectRefs.slice(0, 2).map(({ id }) => id),
    });
  }
  if (result.resolvedScopes.length > 1) {
    const mixed = rank(rules.filter(({ stage }) => stage === 'mixed'), result.query, 2);
    result.ruleExcerpts.push(...mixed);
    if (mixed.length) {
      result.suggestions.push({
        id: 'custom-review@mixed',
        title: '对照同条原文中的两个阶段',
        description: '按原文逐项对应省赛和国赛的条件，记录各自适用范围。',
        ruleRefs: mixed.map(({ id }) => id),
        projectRefs: [],
      });
    }
  }
  if (!projectRefs.length) result.missing.push('项目摘要中暂无与该问题匹配的明确线索。');
}

export function runLocalReview({ ruleText = '', projectSummary = '', preset = 'custom', query = '', scope = 'all' } = {}) {
  const selection = REVIEW_PRESETS.find(({ id }) => id === preset) ?? REVIEW_PRESETS.at(-1);
  const requestedScope = validRuleScope(scope) ? scope : 'all';
  const question = selection.id === 'custom' ? query.trim() : selection.query;
  const stagesInQuestion = selection.id === 'custom' ? mentionedStages(question) : [];
  const result = {
    preset: selection.id,
    query: question,
    scope: requestedScope,
    resolvedScopes: requestedScope === 'all' ? stagesInQuestion : [requestedScope],
    ruleExcerpts: [],
    projectExcerpts: [],
    missing: [],
    suggestions: [],
  };
  if (requestedScope !== 'all' && stagesInQuestion.some((stage) => stage !== requestedScope)) {
    result.missing.push('所选阶段与问题中提到的阶段不一致。请调整所选阶段或问题内容。');
    return collect(result);
  }
  const rules = indexSource('rule', ruleText).filter(({ stage }) => allowsStage(stage, requestedScope));
  const project = indexSource('project', projectSummary);

  if (topics[result.preset]) reviewTopics(result, rules, project);
  else if (result.preset === 'deliverables') reviewDeliverables(result, ruleText, rules, project);
  else reviewCustom(result, rules, project);

  return collect(result);
}
