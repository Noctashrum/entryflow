# 投递复核工作流

## 收到的模块 Prompt

> 你负责把 EntryFlow 的「投递复核」作为真实功能接进公开网站，源码在当前工作区 entryflow。只改 src/main.js、src/workflow.js、必要的你独占新增 UI 文件、src/styles.css（当前无另一界面实现 agent）、README.md、你的测试和 docs/dev/agent-rag-workflow.md。与 evidence agent 对齐本地/远程合同。复核主页或核验阶段加入 3 个有具体用途的预设和自定义问题：截止与资格、仓库与 Prompt/演进证据、待补交付物；明确可看到查哪些资料、有哪些赛规原文/项目摘要线索、哪些需要人工确认，选中建议后一键加入清单并带引用、刷新恢复、Markdown 导出保留。静态演示必须通过纯浏览器本地路径，含人工确认；配置模型时可显式调用真 RAG，显示状态/错误和绑定出处，模型故障不影响本地。保留原正常流程与本地既有数据，变更后过期或更新不乱继承；避免 AI 判断自动变成已确认。清晰解释高级架构与具体用例；交互成熟、可访问、移动端可用。README 用产品复现角度，开发日志原样记你的本次 agent Prompt、实际迭代反馈与测试，绝不保存用户的原始需求文本或任何本机绝对路径。不要推送、不要 git 提交。尽快确认接线方案。

验收使用[开发总览](README.md)中记录的编排者产品 Prompt。

## 合同反馈

> 合同确定：import { REVIEW_PRESETS, runLocalReview } from './retrieval.js'。REVIEW_PRESETS 为含 {id,label,query} 的 4 项，固定 IDs `deadline-eligibility`、`repo-process`、`deliverables`、`custom`（自定义 query 由用户输入，其余用预设句；可以输入空 query）。runLocalReview({ruleText,projectSummary,preset,query}) 同步返回 {preset,query,ruleExcerpts,projectExcerpts,missing,suggestions}，其中 excerpt {id,source:'rule'|'project',line,column,text,score}，missing 为 string[]（无明确线索提示），suggestion {id,title,description,ruleRefs:string[],projectRefs:string[]} 引用对应 excerpt.id。无命中为空数组且有 missing。模型 POST ./api/ai/review {ruleText,projectSummary,preset,query} → {answer,citations:[{id,source,line,column,text}]}，需要传 preset；旧 body 不传 preset 仍是历史契约。GET status 保持。先按此接线。

实现把复核卡放在核验阶段首屏。用户选定场景后，结果区并列显示赛事规则来源、项目摘要片段及各自命中数。引用可定位到原文行和片段。模型请求区在本地结果之后，仅请求已配置的同源服务。

## 迭代反馈

> 请在 README 概括实际数据流（本地赛规/摘要→分块与检索→本地候选或可选模型→引用检查→人工采纳→清单），并给出官方样例三个预设各一个具体验收动作。模型输出与无配置的本地证据复核明确命名，真实模型验证情况据实记录。已有清单里重复点同一建议要可识别并保持幂等。

把人工选中的建议写成独立待办，保留问题和原文引用。以问题、建议、证据及来源模式标识重复项，已加入的选项显示状态。重生成清单时，仍属于当前资料版本的复核任务保留进度。发现摘要开头出现空行时只比较首尾修剪后的值会保留旧行号，改用未经修剪的摘要核对复核出处。资料改动后旧复核失效，重新采纳前以最新出处复核。

> 浏览器验收通过三种预设、仓库建议加入一次、刷新恢复及双引用。发现一个可复现文案问题：只从「待补交付物」切换到「自定义问题」，原始资料没变，但出现「资料已更新。请重新复核问题，取得当前版本的出处。」请最小改动区分资料变更与问题切换（后者可提示运行当前问题或省略），如合适补回归；只改你的文件与记录，不提交 Git。

将当前表单问题与最近一次复核问题比较。切换时只提示运行所选问题，切回已复核问题可继续查看原结果。开发初版缺少摘要绑定信息的快照以空态处理。

## 验证

- `node --test tests/workflow.test.js` 通过 9 项。新增断言覆盖重复采纳、旧浏览器状态兼容、两类原文引用和 Markdown 导出、模型结果人工采纳、资料变更后的引用失效、插入摘要空行后的行号校验、仅变更门槛状态时保留任务，以及分别识别问题切换与原始材料变化。
- 用官方赛规摘编运行本地模块。截止与资格返回 3 项建议且提示摘要缺少截止线索；仓库与开发证据返回 4 项建议并指出缺少 Git 演进记录；待补交付物返回 6 项建议。
- `npm run build` 通过。实际模型输出需服务端配置，当前自动化通过模拟模型验证。
