# 工作流与集成开发记录

## 收到的初始提示词

> 你是 EntryFlow 工作流及集成实现 agent。只写 <PROJECT_ROOT> 的 src/main.js、src/demo.js、可选你自己的 src/workflow.js、README.md、docs/dev/agent-workflow.md、可选 workflow 专属测试。尽快与 interface agent 对齐其可选 src/layout.js DOM 合约和样式，main 导入 styles.css 与 { analyzeRules, retrieveEvidence } from './evidence.js'。analyzeRules(ruleText,projectSummary) 同步返回 {gates,materials,excerpts}，gate {id,title,quote,line,suggestion,evidence}，material {id,title,quote,line}；retrieveEvidence(ruleText,query,limit) 返回 [{line,text,score}]。目标实现完整闭环：录入赛事名/规则来源链接/赛规文本和项目名/摘要，支持粘贴与内容导入；审核门槛（待确认/符合/不符合，显示原文行号、项目证据，允许补录门槛、来源以及保存核验备注）；依据材料与未解决门槛生成清单（可编辑任务进度、负责人/备注，进度实时更新，必要时可新增项，能 Markdown 导出，刷新恢复）。用户编辑输入变化后提醒重新分析，不允许静默继承旧结论，在确认或可安全合并时尽量保留有效进度。无条件照实报告不能识别之处，不自动判符合；来源检索可自定义查询，明确标记本地原文证据检索。样例用明确标记的赛规和项目数据，等待根 agent 的官方赛道证据更新，先用虚构规则，避免捏造当前比赛规则。文本和项目数据浏览器本地保存；默认不依赖付费 API，任何增强由 evidence agent 告知你接口。README 写启动、技术实现、样例操作与实际边界。收到的实际完整提示及后续提示、实际命令和开发结果落盘 docs/dev/agent-workflow.md。不要推送、不要发布。请尽快开始并向我报告接口进展；根 agent 负责统筹与验证、不直接写产品代码。

## 收到的迭代提示词

### 迭代 1 · 根据官方证据调整默认演示

> 已用主办方官网页面公开数据接口核验 id=10039，样例请切换成「第九届传智杯 · AI创新应用挑战赛（官方赛规摘编）」并明确是根据官方页面人工摘编示例，规则引文来自录入内容，保留原始链接 https://www.boxuegu.com/matchTrack/detail/?id=10039 。每项单独一行：正式全日制学籍的研究生、本科及高职高专学生，以个人为单位参赛；按学籍和学校类型选择研究生/A/B/C组；原创、严禁直接包装已有开源项目；使用 AI 辅助编程工具并能复现开发过程；省赛报名及提交均截止 2026-11-18，缴费后登录个人中心查看作品提交入口；公开 GitHub/Gitee 仓库或开放评审访问；细粒度 Git 提交历史，禁止一次提交包含全部功能；AI 对话 Prompt 历史须含至少三个核心功能完整迭代链；README 十分钟复现指南含环境配置、依赖、环境变量模板；5–8 分钟 MP4 1080p，至少 2 分钟 AI 协同复现；技术文档 PDF ≤30页，阐述意图控制、架构与可复现性。项目示例用虚构学生项目或 EntryFlow 描述，切勿写真实报名资格已确认。规则不强制技术栈。请补录这条提示。后续如做可选 RAG 另通知。

### 迭代 2 · 接入可选模型复核

> 证据 agent 在基础交付后会做可选的同源 RAG 后端 GET ./api/ai/status 与 POST ./api/ai/review，请他提供精确 JSON 合约。请准备核验页证据侧栏同组中可选「AI 复核建议」的入口，只有 status 明确服务可用时允许请求；主动触发前告知将发送摘要和匹配条款给已配置模型，用户显式点击发起即可。显示等待/失败以及可核对的原文引用，无自动通过或覆盖。静态未配置只显示精简提示并保持本地检索体验。新增 README 按需启动与 `.env.example` 的运行说明，等后端 agent 告知。请补录此提示。避免让该项阻塞初始闭环提交。

证据 agent 补充的接口：

> 根 agent 增派可选 RAG。我会在 server/ 实现 API。GET ./api/ai/status → {available:boolean}，POST ./api/ai/review JSON {ruleText,projectSummary,query} → {answer:string,citations:[{line:number,text:string}]}，非 2xx {error:string}。URL 建议 new URL('api/ai/status', document.baseURI)（静态目录默认 404，要安静降级），POST 同理。结果勿写入核验状态，正文按纯文本渲染；用现有检索输入 query。仅 Node 本地服务+模型环境变量后才显示可用。

界面 agent 提出的交互修改：

> 已读当前 markup，正在补齐右侧资料概览、核验和清单卡样式。请让提取主操作明显可达：建议从 `项目资料` 的 panel 内移出 submit/清空，放到 `#intake-form` 最后一个子元素 `<div class="stage-action-bar">...</div>`，由我实现 sticky bottom。生成清单若仍留在候选门槛超长列表底部，建议给这一处 `.panel-actions` 增加 `.review-actions` 我做同样处理，或者把生成按钮放在核验概览的快捷操作中（任选）。保存状态可给 `#save-status` 的 `data-status` 设置 `error`（存储异常）或空值，以切换状态点。

### 迭代 3 · 移动端和过期状态

> 移动端 QA 发现完整样例的「投递进度／导出 Markdown」在约 4761px，要划过全部 12 个任务才可查看。已发 interface，请配合只在清单阶段调整 DOM 源顺序/区域 class 与其 CSS 统一。另我改动项目摘要后点击「投递清单」，只显示普通空态「完成当前赛规的内容提取与核验后，即可生成投递清单」，请在原来有清单的场景明确说明「资料已变更，需重新提取／已有任务将在重新生成时按对应来源合并」，并确认具体保留逻辑、用相应回归测试。记录 Prompt。

界面 agent 补充的移动键盘验证：

> 键盘专项在 390px 实测 `#gate-note-0` 通过 Tab 获得焦点，但元素底部 y=808、sticky 生成清单栏顶部 y=770，浏览器认为备注在视口内而未滚动。我将在 `src/layout.js` 新增 `keepFocusedControlInView(stageContent)` 只处理该视觉冲突；请把它从 `./layout.js` import 后在 `const content` 初始化后调用一次。无业务行为变化，我会重跑脚本验证。

提交协调：

> 可以按你所说准备模块提交，但共享 index 请互斥，先不要自行 commit，我会集中暂存和提交以保留完整历史。请尽快通知我初版可暂存的文件、后续迭代与测试可暂存时间。我刚在浏览器确认官方样例已能打开核验页。

## 实施和验证

| 功能 | 第一版与调整 | 验证 |
| --- | --- | --- |
| 录入资料 | 用动态内容区接上赛规粘贴、文件导入、摘要录入和本地保存。把虚构比赛演示换成官方赛规摘编和虚构项目摘要，编辑后显示演示资料已修改。导入过程中手动编辑赛规会保留手动内容。 | `node --check src/main.js`、`node --check src/demo.js` 通过。样例实测识别 7 项门槛、6 项材料。 |
| 门槛核验 | 候选门槛初始为待确认。录入内容变化后重置已确认结论，资料行号按新版重新定位。支持手动补录、原文检索和按需发起模型复核。模型返回的引用显示在证据区。 | 工作流回归覆盖原文引用、默认待确认、改动前导空行后刷新行号、摘要更新后重新核验。生产构建通过，模型服务另见证据模块记录。 |
| 清单跟踪 | 把未解决门槛与材料转成可编辑任务，支持 Markdown 导出。移动端把进度和导出提前到任务前。同一赛事、项目与来源范围内，原文引用不变的材料任务及手动任务可保留进度。资料变化时重置门槛任务进度并显示清单过期原因。 | `node --test tests/workflow.test.js` 4 项通过，覆盖过期拦截、进度合并、跨项目隔离和序列化恢复。 |

执行过 `npm run build` 验证生产入口与按需分包的 PDF 资源。提交由主 agent 在共享仓库顺序处理。

主 agent 浏览器复验确认，改动项目摘要后清单显示资料已变更及进度合并说明，重新提取后门槛恢复待确认，重新生成后匹配到的 README 任务保持已完成。390px 视口下投递进度位于任务之前，页面无横向溢出。
