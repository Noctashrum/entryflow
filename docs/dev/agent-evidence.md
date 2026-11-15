# 赛规证据模块开发记录

## 初始提示词

> 你是 EntryFlow 的赛规证据模块实现 agent。只写 <PROJECT_ROOT>/src/evidence.js 和 docs/dev/agent-evidence.md，需要回归验证可加 tests/evidence.test.js。Vite + vanilla JS 浏览器优先。实现真实本地材料证据检索和赛规解析：export analyzeRules(ruleText, projectSummary) 同步返回 { gates, materials, excerpts }，gate { id,title,quote,line,suggestion,evidence }，material { id,title,quote,line }，excerpt {line,text,score}，字段都为字符串/数字或数组等可序列化值，evidence 用字符串缺省空。中文、分行/句、团队、资格/人数、原创、开发工具、提交时间、交付物等规则能识别，返回真实截取片段和对应行号，不在缺失时猜测、不给自动通过且交给用户确认。再 export retrieveEvidence(ruleText, query, limit=5) 返回 [{line,text,score}] 用可解释的中文词/字串检索和匹配排序（无联网）。挑战功能可编辑查询，并把结果清晰标为本地原文检索。优先多做一个真实可选高级功能：优先支持浏览器 TXT/MD/CSV/JSON，以及图片或 PDF 由用户粘贴转写原文即可；如果时间和依赖可控，独立增加一个按需加载 PDF 文字层或 OpenAI 兼容的可选证据约束生成模块（不得存密钥，不假称使用模型），先完成稳定闭环，并与 workflow agent 同步能交付的接口。默认样例会由根 agent 核验赛道后交给 workflow，勿把官方规则硬编码到引擎。请在 docs/dev/agent-evidence.md 原样保存实际收到的完整 prompt 和后续提示，记录决策、命令、实际结果和迭代。不要推送、不要发布。完成请告知。

## 赛道摘编纳入回归

> 赛道已通过主办方公开页面数据核验，省赛投递材料示例将包含公开 GitHub/Gitee、细粒度 Git 提交历史、三条完整 Prompt 迭代链、README 10 分钟复现指南、5–8 分钟 MP4 1080p 含至少 2 分钟协同复现、PDF ≤30 页技术文档；门槛含正式全日制学籍、个人单位、研究生/A/B/C 组别、原创、完全借助 AI 辅助编程工具、报名与交件同一天。添加真实摘编格式回归，确保 Markdown 格式和规则行号一致。请补录该提示。

## 可选 RAG 服务迭代

> 在证据解析和 PDF 导入交付后，请追加一项真实可选的 RAG 服务，代码继续由你写。仅改 server/、.env.example（不要提交真实配置）和你的日志/tests；与 workflow 同步接口，使静态版本默认仍可完整使用。建议 Node 内置 HTTP 同源应用服务 `node --env-file-if-exists=.env server/index.js`，同时服务 Vite dist 与 /api/ai/status、/api/ai/review；服务端按用户查询从 ruleText 检索（复用 retrieveEvidence），仅把少量带行号规则片段、项目摘要和查询交给环境变量配置的 OpenAI-compatible Chat Completions 服务。用严格 JSON 响应协议，仅接受出处行号集合中命中的引用；引用在 UI 由原文映射，未引用或错误引用降级失败，不写入状态。不能自动核验通过。无密钥 status 返回不可用，UI 可提示本地后端可选，无须联网/密钥即能走闭环。限制文本输入/体积/模型超时，API 密钥服务端；上游地址由服务端环境变量控制，请勿泄露上游错误详情或支持按请求选任意目标。不需要持久化服务端数据。加 mock upstream 回归和静态文件服务验证、记录实际测试，不称在线真实模型已验证。若觉得时间不够立即报我。请把此迭代 prompt 原文写入日志。

## 初版核验反馈

> 根 agent 对当前初版用 `node --input-type=module` 调用 analyzeRules(demoDraft.rule, demoDraft.summary) 发现具体回归：只抽到例中 4 个门槛和 3 个材料，漏报第3行参赛组别，第7行公开代码仓库、第8行细粒度 Git 历史、第12行 PDF 技术文档；第2行资格误匹配摘要第一句 '本例为虚构学生项目，帮助同学查询实验室空闲时段并提交预约。'，真实相关摘要是第二句且宜标为可能相关，第6行日期也误用第一句。请纳入你正在做的增强与实际回归测试，列出每个材料而非合并到相邻条款，要求低置信度不显示证据。请补录该复现与修复结果。

## 主仓库交接提示

> 浏览器已确认官方样例 7 项门槛和 6 条材料。现在可以把基础证据模块作为单独提交吗？请尽快告诉我对应当前已稳定文件，后端服务在另一提交。请不要操作 Git 共享索引。

> 已用项目浏览器实际选择你的临时 PDF，赛规字段写入两行 `Submit a public GitHub repository.` 与 `Submit a demo video.`，界面显示「赛规文件已导入」。请把这个根 agent 端到端结论补录，告诉我可暂存最终日志。

## 实现记录 · 2026-11-16

1. 和界面、工作流 agent 对齐 `analyzeRules`、`retrieveEvidence` 和异步 `readRuleFile` 的接口。界面 agent 统一维护依赖清单，证据模块在浏览器按需加载 PDF.js 及同源 worker。文本以 UTF-8 优先，兼容带 BOM 的 UTF-16 和 GB18030。读取 PDF 文字层，扫描页通过转写后粘贴。原文上的空行计入行号。
2. 规则分类保留用户提供的原句，使用规则类型和原句生成稳定标识。检索采用中文分词、精确片段匹配与逆文档频率权重，查询无命中时返回空数组。模型研判复用相同检索。规则抽取使用适用于多个赛事的分类词表，人工决定每项门槛状态。[PDF.js API](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-PDFPageProxy.html) · [Vite 资源导入](https://vite.dev/guide/assets)
3. 按初版核验反馈增加个人赛和组别识别，将代码仓库、细粒度 Git 历史、Prompt 记录、README、演示视频和技术文档拆为六项。对项目摘要先按门槛类型筛选再排序，资格线索改为含明确学籍描述的句子，缺乏日期与原创线索时保留空白。Markdown 材料块支持自定义清单项和可选条款，保持文件原行号。
4. 为本地 Node 服务添加 `GET /api/ai/status` 和 `POST /api/ai/review`，联调契约交给工作流 agent。启用时最多转发五条命中原文、项目摘要和查询。启用条件为服务端有效基础地址、模型和 API Key。API 使用兼容 Chat Completions 的消息结构，验证模型返回的 JSON 和所有引用编号，原文来自服务端对应条目。模型失败时保留本地检索与人工核验。静态构建不依赖该服务。

## 验证

- 使用 `node --input-type=module` 调用真实摘编样例，初版问题可复现。增强后提取 7 个门槛及第 7–12 行的 6 项材料。第 2 行资格返回摘要中含「全日制本科生」的句子，第 4 行原创与第 6 行日期无强相关线索，证据字段为空。
- `node --check src/evidence.js` 与 `node --check server/index.js` 通过。
- `node --test tests/evidence.test.js tests/ai-server.test.js` 通过，共 6 项。覆盖官方摘编、Markdown 与可选条款、检索及文本导入、静态资源 MIME、同源接口禁用与使用模拟上游的有效和无效引用。测试确认模拟上游只收到匹配片段、查询和项目摘要，错误行号或空引用导致 502，检索无命中导致 422，过长查询导致 413。在线模型调用未验证。
- 根 agent 在项目浏览器中实际上传了临时 PDF 文字夹具，赛规字段读取出 `Submit a public GitHub repository.` 和 `Submit a demo video.` 两行，页面提示「赛规文件已导入」。
- 用 Node 创建真实项目构建目录的本地 HTTP 服务，首页及首页 JS 响应均为 200，JS 使用 `text/javascript`，无模型配置时状态接口返回 `{"available":false}`。
