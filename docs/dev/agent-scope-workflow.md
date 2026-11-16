# 跨赛段核验工作流

## 收到的模块 Prompt

> 这是 EntryFlow Vibe Coding 的阶段范围迭代，你负责界面、既有工作流与演示。只改 src/main.js、src/workflow.js、src/styles.css、必要时 src/demo.js、README.md、你的测试和 docs/dev/agent-scope-workflow.md。和 evidence agent 尽快对齐 scope API。核验阶段增加清楚的赛段选择/显示（省赛、国赛、全部或自动视你的设计与引擎合同），用于实际核验与清单，不止是视觉筛选；引文展示所在阶段并可跳回原文；自定义问题明确阶段时据问题，缺证据不混用另一阶段。阶段/资料变化安全失效，不乱继承他赛段核验状态或任务。给评委一个可复现演示入口/README路径，用官方赛规摘编保留同页两阶段截止和提交/评审/奖项边界，原样保留旧的可用示例场景、避免提示错误日期。测试新旧存储、切阶段与引用、材料去误项。先交初版供浏览器录制。所有产品代码由你写，不提交、不推送。公开日志记录实际本条 Prompt、跨 agent 对齐、真实反馈与测试，勿放用户原始 Prompt、本机标识或旧提交 SHA。

## 跨模块对齐

> 作用域合同：`runLocalReview({ruleText,projectSummary,preset,query,scope='all'})` 与 POST `/api/ai/review` 可加 `scope:'all'|'provincial'|'national'`；`all` 时自定义问题会自动识别明确阶段，包含两阶段则分别检索，单阶段选择与明确问题冲突时返回缺失提示。返回 `scope` 为所选值，`resolvedScopes` 为有效显式范围数组，`ruleExcerpts` 可带 `stage:'provincial'|'national'|'general'|'mixed'`、`section` 文本、`stageHeading:{line,column,text}` 出处，保留现有字段和引用 ID。建议 UI 如需按阶段展示可按 stage 分组或显示标签；无阶段数据仍按当前检索。`analyzeRules(ruleText,projectSummary,{scope})` 第三参可选；主流程现有调用无需改。

> 确认 `analyzeRules` 的 gates/materials/excerpts 均可带 `stage`/`section`/`stageHeading`，字段缺省视 `general`。`mixed` 为同一条款提到双阶段且不能可靠切开的句子，全部阶段可显示，明确单阶段时排除。`resolvedScopes` 仅显式阶段，双阶段 `['provincial','national']`、通用 `[]`。`materials` 会增可选 `references:[{text,line,column,stage,section,stageHeading}]` 与 `typeId`，主 `quote` 为具体正文，供你选择是否展示/导出多个细节；当前 `id/title/quote/line` 保留。项目摘要片段不会推断阶段。赛规摘编可用独立标题 `## 省赛安排`/`## 国赛安排`，以及 `### 1.时间安排`、`### 2.作品提交要求`（两个阶段重复同一标题样式）。真实纯文本也支持无 Markdown 的同名层级。

## 官方摘编与迭代反馈

> 官网正文已核验：省赛报名与作品截止都是 2026-11-18；国赛报名 2026-12-10 至 12-21，国赛作品截止 2026-12-27。两阶段提交要求核心一致：公开 GitHub/Gitee 或给评审访问，细粒度 Git 提交，AI 对话快照含至少 3 条完整功能迭代，README 十分钟复现，5–8 分钟 1080p MP4 含至少 2 分钟 AI 协作，PDF 技术文档≤30页。可在省赛与国赛各配 `时间安排 / 作品提交要求 / 奖项设置 / 评审标准` 四段短标题。奖项示例写「省赛一、二、三等奖可晋级国赛」，评审用「过程可复现性占 25%」。其余请保留原示例摘要，避免引入当作真实报名的数据；演示入口明确是官方人工摘编与虚构项目。

> 国赛可只加「国赛设一、二、三等奖及优秀奖」作奖项块负例。官网正文与汇总表的个别比例写法有差异，示例不必引用比例。保留旧示例、另加赛段示例的设计符合录制需求。

新增独立的「载入赛段示例」，保留原示例的文本和行号。赛段选择设在核验页开头，同一值传给条款提取、浏览器复核和可选模型。阶段变更会切换独立的工作区快照。比较资料指纹和摘要原文后才恢复绑定引用，未标记赛段的旧版数据按全部阶段加载。

## 验证

- `node --test tests/workflow.test.js` 12 项通过，新增覆盖旧版工作区恢复、省赛和国赛的核验状态与清单独立保存、跨赛段出处导出、奖项与评审排除、资料修改后旧引用失效。
- 使用同一份赛规摘编运行本地复核。问国赛作品截止时只命中国赛第 26 行。双赛段问题分别命中省赛第 10 行和国赛第 26 行。在省赛范围询问国赛时，返回范围冲突提示且无引用。单赛段提取分别得到 6 项材料。
- 执行 `npm run build`，生产构建通过。
