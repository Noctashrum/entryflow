const phasePatterns = {
  provincial: /省赛|省级(?:选拔赛|预赛|决赛|赛)/iu,
  national: /国赛|全国(?:总决赛|决赛|赛)|国家级赛/iu,
};

export const RULE_SCOPE_LABELS = {
  provincial: '省赛',
  national: '国赛',
};

export function mentionedStages(text) {
  return Object.keys(phasePatterns).filter((stage) => phasePatterns[stage].test(text));
}

export function validRuleScope(scope) {
  return typeof scope === 'string' && (scope === 'all' || Object.hasOwn(phasePatterns, scope));
}

const stageTitle = /^(?:省赛|国赛|省级(?:选拔赛|预赛|决赛|赛)|全国(?:总决赛|决赛|赛)|国家级赛)(?:[（(][^）)]{1,16}[）)])?\s*(?:阶段|安排|流程|通知|规则|说明)?$/iu;
const submissionTitle = /^(?:本届|本赛道|赛事|竞赛|参赛|省赛|国赛)?\s*(?:(?:(?:作品|项目|报名|投递)?(?:提交|交付)(?:所需|的)?(?:材料|文件|内容|物|要求|规范|清单|说明|须知|要点)?|作品材料|报名材料|材料(?:清单|要求)|所需材料|需要提交的材料)(?:与说明)?|(?:required )?(?:submission )?materials|deliverables)$/iu;
const excludedTitle = /^(?:省赛|国赛|竞赛)?\s*(?:奖项(?:设置|等级|规则|说明|与奖励)?|奖励办法|颁奖安排|评审(?:组织|标准|规则|细则|办法|流程|制度|机制|结果|方式|要求|维度|指标)|评分(?:标准|细则|规则|办法|流程)|晋级(?:规则|条件|安排|流程|要求|办法|名额|条件及流程)|组织(?:实施|机构|方式)|颁发证书)(?:与说明)?$/u;
const otherTitle = /^(?:省赛|国赛|竞赛)?\s*(?:赛道(?:介绍|说明|主题|背景)|竞赛主题|赛制(?:说明|安排)|(?:比赛|竞赛|时间|赛程|流程)(?:安排|说明|计划)|(?:报名|注册)(?:流程|方式|对象|条件|指南|渠道|信息)|参赛(?:对象|资格|组别|条件|说明|须知|分组|流程|要求)|组队(?:限制|要求)|原创(?:要求|说明)|开发(?:要求|规范)|通用(?:规则|条款|说明|要求)|联系方式|其他(?:要求|说明)?|注意事项|咨询方式|常见问题)$/u;
const descriptiveTitle = /^(?:(?:代码|源码|项目|公开)?仓库(?:与(?:演进|开发|提交)记录)?|(?:AI\s*)?对话历史(?:导出的)?\s*(?:Prompt\s*历史快照)?|(?:Prompt|提示词)(?:历史快照|迭代记录|迭代链|记录)|(?:可)?复现性声明(?:与(?:重现|复现)指南)?(?:[（(]README(?:\.md)?[）)])?|演示视频(?:与技术文档)?|技术文档(?:与演示视频)?|README(?:\.md)?(?:复现指南)?)$/iu;

function headingCandidate(text) {
  let title = text.replace(/^#{1,6}\s*/u, '').replaceAll('**', '').replace(/^[•*+-]\s*/u, '').trim();
  const markdown = text.match(/^(#{1,6})\s*/u)?.[1].length;
  const numbering = title.match(/^(\d+(?:\.\d+)+|\d+\s*[.、）)]|[一二三四五六七八九十]+[、．.]|[（(][一二三四五六七八九十]+[）)])\s*/u);
  const variant = numbering?.[1];
  const numericDepth = variant ? (variant.match(/\d+/gu)?.length ?? (variant.startsWith('（') ? 2 : 1)) : 0;
  if (numbering) title = title.slice(numbering[0].length).trim();
  const colon = title.search(/[：:]/u);
  const label = (colon < 0 ? title : title.slice(0, colon)).trim();
  return {
    label,
    depth: markdown ?? numericDepth,
    hasBody: colon >= 0 && Boolean(title.slice(colon + 1).trim()),
    numbered: Boolean(variant),
    markdown: Boolean(markdown),
  };
}

function heading(text, activeKind) {
  const value = headingCandidate(text);
  const { label, depth, hasBody, numbered, markdown } = value;
  if (stageTitle.test(label) && !hasBody) return { ...value, kind: 'phase' };
  if (submissionTitle.test(label) && !(hasBody && /(?:提交|交付)$/u.test(label) && /\d{1,4}[年月/-]/u.test(text))) {
    return { ...value, kind: 'submission' };
  }
  if (excludedTitle.test(label)) return { ...value, kind: 'excluded' };
  if (otherTitle.test(label)) return { ...value, kind: 'other' };
  if (activeKind === 'submission' && (descriptiveTitle.test(label)
    || (numbered && depth > 1 && !hasBody && label.length <= 48 && !/[，,。！？；]/u.test(label)))) {
    return { ...value, kind: 'subsection' };
  }
  if (markdown && !hasBody) return { ...value, kind: 'other' };
  return null;
}

function explicitStage(text) {
  const stages = mentionedStages(text);
  if (!stages.length) return null;
  if (stages.length > 1) {
    if (/均(?:需|应|可|须|必须|适用|为)|一律|统一(?:执行|适用)|两个阶段(?:的)?(?:要求相同|均)/u.test(text)) return 'general';
    return 'mixed';
  }
  const stage = stages[0];
  const { label } = headingCandidate(text.replace(/^[【［\[]\s*/u, ''));
  const match = label.match(phasePatterns[stage]);
  const after = match ? label.slice(match.index + match[0].length) : '';
  if (match?.index === 0
    || /^\s*(?:阶段|的)?\s*(?:作品|报名|提交|交件|投递|材料|截止|评审|要求|环节)/u.test(after)) {
    return stage;
  }
  return null;
}

function headingReference(line, column, text) {
  return { line, column, text };
}

export function indexRuleLines(ruleText) {
  const records = [];
  let phase = null;
  let section = null;
  let subsection = null;
  for (const [index, raw] of ruleText.split(/\r\n|\n|\r/u).entries()) {
    const text = raw.trim();
    if (!text) continue;
    const line = index + 1;
    const column = raw.indexOf(text) + 1;
    const title = heading(text, section?.kind);
    const reference = headingReference(line, column, text);
    if (title?.kind === 'phase') {
      const [stage] = mentionedStages(title.label);
      const nestedAwardLabel = section?.kind === 'excluded' && !title.markdown && !/安排|阶段|规则|通知|流程/u.test(title.label);
      if (stage && !nestedAwardLabel) {
        phase = { stage, reference, depth: title.markdown ? title.depth : 0 };
        section = null;
        subsection = null;
      }
    } else if (title?.kind === 'subsection') {
      subsection = { ...title, reference };
    } else if (title) {
      const ownStage = explicitStage(title.label);
      if ((!ownStage && phase?.depth && title.markdown && title.depth <= phase.depth) || /^通用/u.test(title.label)) {
        phase = null;
      }
      section = { ...title, reference, stage: ownStage };
      subsection = null;
    }

    const stage = explicitStage(text) ?? section?.stage ?? phase?.stage ?? 'general';
    const stageHeading = stage === phase?.stage ? phase.reference
      : stage === section?.stage ? section.reference : null;
    const sectionLabel = subsection?.label ?? section?.label;
    records.push({
      line,
      column,
      text,
      stage,
      ...(stageHeading && { stageHeading }),
      ...(sectionLabel && { section: sectionLabel }),
      ...(subsection && { subsection: subsection.label }),
      isHeading: Boolean(title && !title.hasBody),
      sectionKind: section?.kind ?? '',
    });
  }
  return records;
}

export function clauseScope(record, text) {
  const stage = explicitStage(text) ?? record.stage;
  return {
    stage,
    ...(record.section && { section: record.section }),
    ...(record.stageHeading && stage === record.stage && { stageHeading: record.stageHeading }),
  };
}

export function allowsStage(stage, scope) {
  return scope === 'all' || stage === 'general' || stage === scope;
}
