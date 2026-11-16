import { allowsStage, clauseScope, indexRuleLines } from './rule-scope.js';

const gateTypes = [
  {
    id: 'eligibility',
    title: '参赛资格',
    clue: '在校 学生 学籍 本科 专科 研究生 高校 院校 身份 专业',
    projectMatches: /学籍|在校(?:学生|生)|在读|全日制|本科生|专科生|研究生|enrolled|full.time/iu,
    matches: /参赛对象|参赛资格|报名资格|正式学籍|正式全日制学籍|仅限.{0,20}(?:学生|高校|院校|职业|年龄)|(?:在校|全日制|本专科|本科|高职|研究生).{0,16}(?:学生|学籍|在校生|参赛|均可|报名)|(?:学生|学籍|院校).{0,20}(?:方可参赛|方可报名|均可参赛)|eligib(?:ility|le)|enrolled students/iu,
    suggestion: '核对成员身份、学籍及所属组别，并保留证明材料。',
  },
  {
    id: 'team',
    title: '组队要求',
    clue: '队员 成员 组队 人数 指导老师 指导教师 独立参赛',
    projectMatches: /单人|独立(?:参赛|完成|开发)|个人(?:赛|为单位|参赛)|[0-9一二三四五六七八九十两]+\s*(?:名|人|位).{0,12}(?:学生|队员|成员)|(?:队员|成员|团队|队伍).{0,14}(?:[0-9一二三四五六七八九十两]+\s*(?:名|人|位)|指导)|guid(?:ance|ing) teacher|team.{0,16}\d+/iu,
    matches: /组队要求|团队人数|队伍人数|个人赛|个人(?:为)?单位|单人参赛|指导(?:老师|教师)|每(?:支队伍|队伍|队|组|个团队).{0,18}(?:[0-9一二三四五六七八九十两]+\s*(?:人|名|位)|成员|队员)|(?:团队|队伍|组队|队员|成员).{0,20}[0-9一二三四五六七八九十两]+\s*(?:人|名|位)|(?:仅限|允许|可)(?:单人|个人|跨校|跨专业).{0,12}(?:参赛|组队)|(?:team|group).{0,20}(?:members?|participants?)/iu,
    suggestion: '确认个人参赛或团队人数、组队范围和指导教师安排。',
  },
  {
    id: 'division',
    title: '参赛组别',
    clue: '组别 研究生组 本科组 高职组 专科组 学校',
    projectMatches: /组别|研究生组|本科组|高职组|专科组|[ABC]\s*组|全日制|院校类型|division/iu,
    matches: /参赛组别|组别划分|按.{0,15}(?:学校|学籍|学历|院校).{0,10}分组|研究生组|本科组|高职组|(?:\b[ABC]\s*组.{0,25}){2}|competition division/iu,
    suggestion: '根据学籍和院校类型确认所属组别。',
  },
  {
    id: 'originality',
    title: '原创与权属',
    clue: '原创 著作权 知识产权 开源 授权 许可 抄袭 数据',
    projectMatches: /原创|原创性|首创|著作权|知识产权|开源|非原创|授权|许可|自主(?:实现|设计|开发)|open.source|licen[sc]e|copyright/iu,
    matches: /原创|知识产权|著作权|版权|权属|抄袭|剽窃|重复(?:参赛|获奖)|previously (?:submitted|awarded)|plagiarism|copyright|intellectual property|original work/iu,
    suggestion: '确认作品、数据和素材的来源，以及对应的许可或授权。',
  },
  {
    id: 'development',
    title: '开发方式',
    clue: 'Vibe Coding AI编程 提示词 prompt 生成 大模型 编程工具 手写',
    projectMatches: /vibe[\s-]*coding|\bAI\b|大模型|编程工具|提示词|\bprompt\b|手(?:动编写|写).{0,8}(?:程序|代码)/iu,
    matches: /vibe[\s-]*coding|氛围编程|自然语言编程|(?:必须|须|不得|禁止|需|要求).{0,26}(?:AI.{0,7}编程|人工智能.{0,7}编程|编程工具|大模型|手写.{0,4}代码|手动.{0,4}编码|手动编写.{0,4}代码)|(?:AI|大模型).{0,20}(?:生成代码|辅助开发|驱动开发|编写代码)|(?:AI[- ]assisted|AI[- ]generated) (?:development|coding|code)/iu,
    suggestion: '核对允许的开发方式和工具，检查过程记录能否对应实现。',
  },
  {
    id: 'deadline',
    title: '报名与投递时间',
    clue: '报名 截止 时间 逾期 北京时间 时区',
    projectMatches: /截止|逾期|时区|北京时间|\d{4}[-/.年]\s*\d{1,2}[-/.月]|\d{1,2}\s*月\s*\d{1,2}\s*(?:日|号)|\d{1,2}:\d{2}|(?:已|尚未|尚待).{0,5}(?:完成报名|赛事投递)|deadline|submi\w* (?:before|by)/iu,
    matches: /截止|(?:报名|提交|上传|投递)(?:时间|日期|期限)|(?:逾期|超过时限).{0,15}(?:不予|无效|不得)|deadline|due (?:by|on)|submi[ts].{0,10}(?:before|by)/iu,
    suggestion: '核对日期、时区、平台状态以及报名与作品提交的各自截止时间。',
  },
  {
    id: 'publication',
    title: '仓库公开要求',
    clue: '仓库 公开 开源 GitHub Gitee 仓库链接',
    projectMatches: /仓库|\b(?:GitHub|Gitee|GitLab)\b|repositor(?:y|ies)/iu,
    matches: /(?:公开|公共|开源).{0,28}仓库|仓库.{0,14}(?:公开|公共|可访问|开源|开放评审权限)|public (?:code )?repositor(?:y|ies)/iu,
    suggestion: '用未登录窗口确认仓库和所需证据可访问。',
  },
];

const materialTypes = [
  { id: 'repository', title: '代码仓库链接', matches: /(?:GitHub|Gitee|GitLab).{0,15}(?:仓库|地址|链接)|(?:代码|源码|项目|公开|开源).{0,5}仓库|仓库(?:地址|链接)|(?:repository|repo) (?:URL|link)/iu },
  { id: 'source-code', title: '项目源代码', matches: /源代码|项目代码|源码(?:包)?|代码压缩包|source code/iu },
  { id: 'project-doc', title: '项目说明文档', matches: /作品说明(?:书|文档)?|项目说明(?:书|文档)?|项目文档|使用手册|project documentation/iu },
  { id: 'readme', title: 'README 复现指南', matches: /\bREADME\b|(?:快速|项目|操作|安装)复现(?:指南|说明)/iu },
  { id: 'technical-doc', title: '技术文档', matches: /技术(?:说明|文档)|technical documentation/iu },
  { id: 'report', title: '作品报告', matches: /项目报告|技术报告|作品报告|设计报告|调研报告|项目计划书|实施方案|项目方案|论文|\breport\b/iu },
  { id: 'slides', title: '展示幻灯片', matches: /(?:答辩|演示|汇报|展示)(?:材料|文稿|课件|幻灯片)|\bPPTX?\b|幻灯片|slides/iu },
  { id: 'demo-video', title: '演示视频', matches: /(?:演示|展示|讲解|介绍|录屏)(?:视频|录像)|视频(?:时长|文件|演示|链接)|视频|(?:demo|presentation) video/iu },
  { id: 'live-demo', title: '在线演示链接', matches: /(?:线上|在线|公开|部署|体验|访问|演示)(?:地址|链接|网址)|可访问的(?:网站|网页)|live demo|deployed (?:URL|link)/iu },
  { id: 'screenshots', title: '作品截图', matches: /截图(?:材料)?|界面图|screenshots?/iu },
  { id: 'git-history', title: 'Git 提交历史', matches: /\bgit\b.{0,18}(?:历史|提交|commit)|(?:细粒度|历史)提交(?:历史|记录)/iu },
  { id: 'prompt-history', title: 'Prompt 迭代记录', matches: /提示词|\bPrompt\b.{0,8}(?:迭代|记录|链路|日志|历史|history|logs?)|交互(?:记录|截图)|对话(?:过程|记录|日志|截图)/iu },
  { id: 'process', title: '开发过程记录', matches: /开发(?:过程|日志|记录)|创作过程|生成(?:过程|记录)|Vibe\s*Coding.{0,8}(?:过程|记录)/iu },
  { id: 'application', title: '报名与提交表单', matches: /报名表|报名信息|作品信息表|参赛登记表|申报(?:书|表)|提交表单|application form/iu },
  { id: 'declaration', title: '原创声明或承诺书', matches: /原创(?:声明|承诺书)|诚信承诺书|授权书|承诺书|declaration of originality/iu },
  { id: 'identity-proof', title: '资格证明材料', matches: /学籍证明|学生证|在读证明|身份(?:证件|证明)|资格证明/iu },
  { id: 'package', title: '作品运行包', matches: /可执行(?:程序|文件)|安装包|运行包|发布包|项目压缩包|作品压缩包|executable(?: file)?/iu },
];

const submissionContext = /提交(?:物|材料|文件|要求|内容)|交付(?:物|材料|文件|清单|要求)|作品(?:材料|文件|提交要求)|材料清单|需(?:要|另)?(?:提供|提交|上传|附)|(?:必须|应当|须|统一|请)(?:同时|一并|附带)?(?:提交|提供|上传|附上)|(?:提交|上传|提供|附上|附带|包含|包括)[：:\s]|\b(?:submit|deliverables?|must include|required files)\b/iu;
const startsWithSubmission = /^(?:提交|提供|上传|附上|附带|交付)/u;
const explicitRequirement = /必须|不得|禁止|不能|只能|仅限|仅可|须|应当|需|限于|要求|方可|must|only|required|shall|prohibited/iu;
const optionalContext = /可选|选填|非必(?:需|须|填)|不强制|(?:^|[（(，,；;：:])\s*(?:建议|鼓励)(?:[：:\s]|提交|上传|提供|附)|(?:可|可以|允许)(?:同时|自愿|额外)?(?:提交|上传|附上)|举例|例如|仅供参考|optional|encouraged|may (?:submit|include)/iu;
const listItem = /^(?:[-*+•]|[（(]?[0-9一二三四五六七八九十]+[.、)）])\s*/u;
const concreteDetail = /必须|须|应|至少|至多|不超过|保留|完整|包含|上限|\d\s*(?:条|页|分钟)|must|required/iu;
const ignoredWords = new Set([
  '是否', '哪些', '什么', '怎样', '如何', '可以', '需要', '必须', '有关', '关于', '要求',
  '参赛', '作品', '项目', '材料', '确认', '赛规', '一个', '对于', '相关', '具备',
  'the', 'for', 'and', 'with', 'how', 'what', 'when', 'of', 'to', 'must', 'should', 'need',
]);
const segmenter = globalThis.Intl?.Segmenter
  ? new Intl.Segmenter('zh-CN', { granularity: 'word' })
  : null;

function normalize(value) {
  return value.normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
}

function sourceLines(text) {
  return text.split(/\r\n?|\n/u)
    .map((value, index) => ({ line: index + 1, text: value.trim() }))
    .filter(({ text: value }) => value);
}

function clauses(text) {
  return text.split(/(?<=[。！？；])|(?<=[，,])(?=\s*(?:也|另)?(?:建议|鼓励|可选|(?:可|可以|允许)(?:同时|自愿|额外)?(?:提交|上传|附上)))/u)
    .map((value) => value.trim()).filter(Boolean);
}

function queryTokens(text) {
  if (segmenter) {
    return [...segmenter.segment(text)].filter((item) => item.isWordLike).map((item) => item.segment);
  }

  const tokens = text.match(/[a-z0-9]+|\p{Script=Han}+/gu) ?? [];
  return tokens.flatMap((token) => {
    if (!/^\p{Script=Han}{3}/u.test(token)) return [token];
    return Array.from({ length: token.length - 1 }, (_, index) => token.slice(index, index + 2));
  });
}

function rankFragments(lines, query, limit) {
  const search = normalize(query);
  if (!search) return [];

  const words = [...new Set(queryTokens(search))]
    .filter((word) => (word.length > 1 || /^\d$/u.test(word)) && !ignoredWords.has(word))
    .slice(0, 32);
  const corpus = lines.map((entry) => ({ ...entry, normalized: normalize(entry.text) }));
  const weights = words.map((word) => {
    const matches = corpus.filter(({ normalized }) => normalized.includes(word)).length;
    return [word, Math.log(1 + (corpus.length - matches + 0.5) / (matches + 0.5))];
  });

  return corpus.map(({ normalized, ...entry }) => {
    const phraseScore = normalized.includes(search) ? 3 : 0;
    const termScore = weights.reduce((score, [word, weight]) => (
      normalized.includes(word) ? score + weight : score
    ), 0);
    return { ...entry, score: phraseScore + termScore };
  })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.line - right.line)
    .slice(0, limit)
    .map(({ score, ...entry }) => ({ ...entry, score: Number(score.toFixed(3)) }));
}

export function retrieveEvidence(ruleText, query, limit = 5) {
  const resultCount = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 5;
  return rankFragments(sourceLines(ruleText), query, resultCount);
}

function stableId(prefix, quote) {
  let hash = 2166136261;
  for (const character of normalize(quote).replace(/^[#*\-•\d.、()（）\s]+/u, '')) {
    hash = Math.imul(hash ^ character.codePointAt(0), 16777619);
  }
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

function headingLabel(value) {
  return value.replace(/^(?:#{1,6}\s*|[-*+•]\s+|[（(]?[0-9一二三四五六七八九十]+[.、）)]\s*)+/u, '')
    .replaceAll('**', '').trim();
}

function materialMatches(quote, record) {
  const matches = materialTypes.filter(({ matches: matcher }) => matcher.test(quote));
  if (!record.subsection) return matches;
  const nearestTypes = materialTypes.filter(({ matches: matcher }) => matcher.test(record.subsection));
  if (nearestTypes.length !== 1) return matches;
  // In a Prompt or README subsection, references to formats or files describe that deliverable.
  if (['prompt-history', 'readme'].includes(nearestTypes[0].id)) return nearestTypes;
  return !matches.length && concreteDetail.test(quote) ? nearestTypes : matches;
}

function extractMaterialTask(types, reference, materials, multiStage) {
  const { text: quote, line, column, ...context } = reference;
  for (const { id: typeId, title } of types) {
    const id = multiStage && context.stage !== 'general' ? `${typeId}@${context.stage}` : typeId;
    const existing = materials.get(id);
    if (!existing) {
      materials.set(id, { id, typeId, title, quote, line, column, ...context, references: [reference] });
      continue;
    }
    if (!existing.references.some((entry) => entry.line === line && entry.column === column)) {
      existing.references.push(reference);
    }
    if (!concreteDetail.test(existing.quote) && concreteDetail.test(quote)) {
      Object.assign(existing, { quote, line, column, ...context });
    }
  }
}

export function analyzeRules(ruleText, projectSummary = '', { scope = 'all' } = {}) {
  const rules = indexRuleLines(ruleText);
  const structured = rules.some(({ sectionKind }) => sectionKind === 'submission');
  const multiStage = ['provincial', 'national'].every((stage) => rules.some((record) => record.stage === stage));
  const project = sourceLines(projectSummary).flatMap(({ line, text }) =>
    clauses(text).map((part) => ({ line, text: part })),
  );
  const gates = new Map();
  const materials = new Map();
  const ruleExcerpts = [];

  for (const record of rules) {
    if (record.isHeading || record.sectionKind === 'excluded') continue;
    const { line, text } = record;
    const inMaterials = record.sectionKind === 'submission';
    let offset = 0;

    for (const quote of clauses(text)) {
      const start = text.indexOf(quote, offset);
      offset = start + quote.length;
      const column = record.column + start;
      const context = clauseScope(record, quote);
      if (!allowsStage(context.stage, scope)) continue;
      const reference = { text: quote, line, column, ...context };
      ruleExcerpts.push(reference);
      const submittedHere = startsWithSubmission.test(headingLabel(quote)) || submissionContext.test(quote);
      const isOptional = optionalContext.test(headingLabel(quote));
      const knownMaterials = materialMatches(quote, record);
      if (!isOptional && (inMaterials || !structured)) {
        const standaloneMaterial = explicitRequirement.test(quote) && knownMaterials.some(({ id }) => id !== 'process');
        if (knownMaterials.length && (inMaterials || submittedHere || standaloneMaterial)) {
          extractMaterialTask(knownMaterials, reference, materials, multiStage);
        } else if (inMaterials && listItem.test(quote) && !knownMaterials.length && quote.length <= 45) {
          const title = headingLabel(quote).replace(/[：:。；;]$/u, '');
          extractMaterialTask([{ id: stableId('material', quote), title }], reference, materials, multiStage);
        }
      }

      if (isOptional) continue;
      for (const type of gateTypes) {
        if (!type.matches.test(quote)) continue;
        if (type.id === 'development' && !explicitRequirement.test(quote) && submittedHere) continue;
        const id = stableId(multiStage && context.stage !== 'general' ? `${type.id}@${context.stage}` : type.id, quote);
        if (gates.has(id)) continue;
        const relevant = project.filter(({ text: snippet }) => type.projectMatches.test(snippet));
        const [match] = rankFragments(relevant, type.clue, 1);
        gates.set(id, {
          id,
          title: type.title,
          quote,
          line,
          column,
          ...context,
          suggestion: type.suggestion,
          evidence: match?.text ?? relevant[0]?.text ?? '',
        });
      }
    }
  }

  const excerpts = rankFragments(
    ruleExcerpts,
    '参赛资格 报名 组队 人数 截止 原创 开发 提示词 交付 提交 视频 仓库',
    5,
  );
  return { gates: [...gates.values()], materials: [...materials.values()], excerpts };
}

function decodeText(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder('utf-16le').decode(bytes);
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder('utf-16be').decode(bytes);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('gb18030', { fatal: true }).decode(bytes);
  }
}

async function readPdf(bytes) {
  const [{ getDocument, GlobalWorkerOptions }, { default: workerUrl }] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  GlobalWorkerOptions.workerSrc = workerUrl;
  const loading = getDocument({ data: bytes, isEvalSupported: false, useWasm: false });
  const pages = [];

  try {
    const document = await loading.promise;
    for (let number = 1; number <= document.numPages; number += 1) {
      const page = await document.getPage(number);
      const { items } = await page.getTextContent();
      let text = '';
      for (const item of items) {
        if (typeof item.str !== 'string') continue;
        text += item.str;
        if (item.hasEOL) text += '\n';
      }
      if (text.trim()) pages.push(text.trimEnd());
      page.cleanup();
    }
  } finally {
    await loading.destroy();
  }

  return pages.join('\n\n');
}

export async function readRuleFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('请选择赛规文件。');
  const extension = file.name?.toLowerCase().match(/\.([a-z0-9]+)$/u)?.[1];
  if (!['txt', 'md', 'csv', 'json', 'pdf'].includes(extension)) {
    throw new Error('请选择 TXT、MD、CSV、JSON 或 PDF。图片可转写后粘贴原文。');
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('赛规文件超过 20 MB。请保存为文字文件或粘贴相关条款。');
  }

  let content;
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    content = extension === 'pdf' ? await readPdf(bytes) : decodeText(bytes);
  } catch {
    if (extension === 'pdf') throw new Error('PDF 读取失败。请解锁文件、复制文字或粘贴赛规原文。');
    throw new Error('文本读取失败。请保存为 UTF-8 编码或粘贴赛规原文。');
  }
  if (!content.trim() || content.includes('\u0000')) {
    if (extension === 'pdf') throw new Error('PDF 没有可提取的文字。请转写扫描件后粘贴原文。');
    throw new Error('没有读到赛规文字。请检查文件内容或编码。');
  }
  return content;
}
