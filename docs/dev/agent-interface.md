# 界面开发记录

执行者 `/root/interface`。时间为北京时间。

## 首轮提示词

> 你是 EntryFlow 界面模块实现 agent。只写 <PROJECT_ROOT> 的 index.html、src/styles.css、package.json、package-lock.json（如安装）、.gitignore。架构为 Vite + vanilla JS，`<script type="module" src="/src/main.js">`，main.js 由其他 agent 实现并 import 样式。index.html 提供 `<div id="app"></div>`；请尽快把可实现的主界面 HTML 模板类名和接口交给 workflow agent（可将你负责的视觉模板独立为 src/layout.js，只由你编辑，导出 renderShell()，把 DOM 合约及时发给 workflow agent）。项目中文名「竞途有序-面向参赛团队的赛规核验与投递管理工作台」，英文 EntryFlow。做美观高质量的中文工作台，浅暖灰白、深海军蓝侧栏、蓝绿色强调色，突出主任务，真实产品排版，桌面+移动。三个业务阶段「录入资料」「核验门槛」「投递清单」，支持样例入口、来源证据、看板进度和空态、实际交互由 workflow agent 接线。避免无意义装饰文案、虚假指标和按钮、外部依赖与无关图片。允许用于功能表达的简单图标。默认字体 Inter 搭配系统中文。Vite 配置要确保任意 GitHub Pages 子目录使用资源路径（build 使用 --base=./），scripts 至少 dev/build/preview。和 workflow agent 主动对齐动态区域、表单与状态类，越早越好。请在 docs/dev/agent-interface.md 记录实际收到的完整 prompt、设计/修改、执行命令、结果和迭代，并把后续提示补录。可创建目录，但别改别的 agent 的文件。任务授权来自用户，根 agent 负责统筹、不编写产品代码。不要推送、不要发布。完成请告知。

## 首轮执行

2026-11-16 01:57 前完成布局、设计样式及构建入口。

- `src/layout.js` 暴露 `renderShell()` 和 `icon(name, size)`，固定导航 `data-stage`、顶部示例 `data-action`、状态 `#save-status`、标题 `#stage-title` 和两列 `#stage-content`、`#stage-aside`。业务模块负责动态区域和所有真实状态。
- `src/styles.css` 使用自适应的舞台宽度、深蓝导航、浅色背景和墨绿色行动按钮。小屏隐藏重复的侧栏导航，保留三个步骤和各阶段的原有操作。表单、状态、空态、进度、焦点及减少动效均沿用同一套样式。
- 证据 agent 请求加入 PDF.js。用 `npm view vite version engines --json` 和 `npm view pdfjs-dist@5 version --json` 查询后，将 Vite 8.3.8 和 pdfjs-dist 5.7.284 写入清单。页面功能图标随代码一起交付，界面无远程字体和图像请求。
- `npm install --no-audit --no-fund` 完成，共安装 18 个包并生成锁文件。`node --check src/layout.js` 通过。构建使用 `vite build --base=./`，便于静态资源部署在仓库子路径。

## 第二轮提示词

> 官方规则和应用边界已核验，请在界面走完整体验后做一次独立视觉迭代，优先排查移动端步骤条和按钮、核验卡正文与行号、长 URL/英文单词溢出、清单滚动与键盘焦点。主操作须能在内容区明显找到。首屏无需展示提交要求以免干扰录入。请把这一轮 prompt、具体发现和改动时点写入你的模块开发记录；涉及其他 agent 的 markup 先协调。若基础页面和样式可提交时请立即通知我，便于留下真实的先后两次 Git 提交。

## 第三轮提示词

> 浏览器实测移动宽 390px 时主体无横向溢出，但官方样例清单长度使「投递进度／导出 Markdown」侧栏在约 4761px，必须划过全部 12 个任务才可查看核心进度。请与 workflow 协作仅在清单阶段的窄屏把「投递进度」和导出置于任务之前（保持桌面双栏），尽量用 DOM 源顺序/适当 Tab 顺序使键盘与视觉一致，兼顾窄屏主要任务空间。请把现场数据、Prompt、迭代结果补录开发记录。

## 迭代与浏览器验收

- 2026-11-16 01:57 左右，根 agent 保存初版界面提交「feat: lay out the EntryFlow workspace and responsive navigation」。随后增加核验卡、来源行号、文件提示、证据搜索、AI 建议、任务状态与进度条样式。两列面板允许长 URL 和英文单词自动换行。
- 协作调整了录入和核验 DOM。把「提取门槛与材料」「生成投递清单」置于所属内容区的底部操作栏。Sticky 操作栏在桌面和窄屏的首屏都可达，可以滚过表单正常阅读内容。
- 02:03 左右完成清单重排。390px 宽界面中，「投递进度」从原浏览器测得的约 4761px 提前到约 309px，任务列表从约 549px 开始。清单的 DOM 中进度区排在任务列表之前，键盘顺序与手机排版一致。1440px 测试中进度区恢复到右列，和任务列表顶部对齐，滚动时保持可见。
- 用本地 Vite 地址 `http://127.0.0.1:4173/` 与独立 Chromium 进程走样例。320px、390px、768px 和 1440px 均无页面横向溢出（用文档 `scrollWidth` 和扣除滚动条后的 `clientWidth` 对比）。注入超长英文 URL 的核验引文也无横向溢出；点击赛规第 2 行后，录入区聚焦赛规文本并选中该行的 37 个字符；用 Tab 到清单最后一项的进度备注时，页面随焦点滚动，显示了清晰描边。
- 02:04 左右补了键盘专项，通过 Tab 发现 390px 窄屏下第一个门槛备注已经获得焦点，但输入框底部在 808px，覆盖栏顶部在 770px，浏览器原生聚焦未自动避开底部操作栏。新增 `keepFocusedControlInView()` 处理控件与操作栏相交，保持顶部导航切换时把焦点交给阶段标题，同时保留实际交互控件的键盘焦点提示。
- 02:05 完成复测。窄屏 Tab 聚焦该备注时自动滚动 46px，输入框底部在 762px，操作栏顶部仍为 770px，留有约 8px 间隔。重走示例闭环，浏览器未出现运行时异常。`npm run build` 成功，`git diff --check` 通过。
