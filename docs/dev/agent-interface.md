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
