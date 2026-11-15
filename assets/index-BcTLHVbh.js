(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={logo:`<path d="M3 18h5l5-10h8M16 3l5 5-5 5M3 12h3M3 7h5" />`,file:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h5"/>`,shield:`<path d="M12 22s7-3.5 7-10V5l-7-3-7 3v7c0 6.5 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/>`,list:`<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2m6 2V2M8.5 10l1 1 2-2m2 1h2.5m-7.5 5 1 1 2-2m2 1h2.5"/>`,upload:`<path d="M12 16V4m-5 5 5-5 5 5M5 15v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/>`,check:`<path d="m5 12 4 4L19 6"/>`,"arrow-right":`<path d="M4 12h15m-6-6 6 6-6 6"/>`,search:`<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>`,link:`<path d="m10 13 4-4m-5.5 6.5-2 2a3.5 3.5 0 1 1-5-5l3.5-3.5a3.5 3.5 0 0 1 5 0m3-1.5 2-2a3.5 3.5 0 1 1 5 5l-3.5 3.5a3.5 3.5 0 0 1-5 0" transform="translate(1 1)"/>`,sparkles:`<path d="M12 2v6m-3-3h6M5 9v8m-4-4h8m8-3 1.5 4.5L23 16l-4.5 1.5L17 22l-1.5-4.5L11 16l4.5-1.5Z"/>`,clock:`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,"triangle-alert":`<path d="M11 3.5a1.2 1.2 0 0 1 2 0l8.5 15a1.2 1.2 0 0 1-1 1.8h-17a1.2 1.2 0 0 1-1-1.8Z"/><path d="M12 9v4m0 3h.01"/>`,download:`<path d="M12 4v12m-5-5 5 5 5-5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"/>`,layers:`<path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>`,circles:`<circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/>`,"chevron-right":`<path d="m9 6 6 6-6 6"/>`,edit:`<path d="m14 5 5 5m-2-7a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3L9 19l-5 1 1-5Z"/>`,sample:`<path d="M5 4h14v16H5zM8 8h8m-8 4h8m-8 4h4"/>`,device:`<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>`},t=[{id:`intake`,label:`录入资料`,description:`赛规原文与项目摘要`,iconName:`file`},{id:`review`,label:`核验门槛`,description:`对照条款，逐项确认`,iconName:`shield`},{id:`checklist`,label:`投递清单`,description:`准备材料，跟踪进度`,iconName:`list`}];function n(t,n=20){return`<svg class="icon" width="${n}" height="${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${e[t]??``}</svg>`}function r(e){e.addEventListener(`focusin`,({target:t})=>{let n=e.querySelector(`.stage-action-bar`);n&&!n.contains(t)&&t.matches(`button, input, textarea, select, a[href]`)&&requestAnimationFrame(()=>{if(t!==document.activeElement||!n.isConnected)return;let e=t.getBoundingClientRect(),r=n.getBoundingClientRect();e.bottom>r.top&&e.top<r.bottom&&window.scrollBy(0,e.bottom-r.top+8)})})}function i(){return t.map(({id:e,label:t,iconName:r},i)=>`
    <button type="button" class="sidebar-link${i===0?` is-active`:``}" data-stage="${e}"${i===0?` aria-current="step"`:``}>
      ${n(r,18)}
      <span>${t}</span>
      <span class="sidebar-chevron">${n(`chevron-right`,15)}</span>
    </button>
  `).join(``)}function a(){return t.map(({id:e,label:t,description:r},i)=>`
    <button type="button" class="step-link${i===0?` is-active`:``}" data-stage="${e}"${i===0?` aria-current="step"`:``}>
      <span class="step-marker" aria-hidden="true">
        <span class="step-number">${i+1}</span>
        <span class="step-check">${n(`check`,18)}</span>
      </span>
      <span class="step-label"><strong>${t}</strong><small>${r}</small></span>
      <span class="step-arrow">${n(`chevron-right`,16)}</span>
    </button>
  `).join(``)}function o(){return`
    <a class="skip-link" href="#stage-content">跳到当前阶段</a>
    <div class="app-shell">
      <aside class="sidebar" aria-label="工作区侧栏">
        <div class="brand" aria-label="竞途有序 EntryFlow">
          <span class="brand-mark">${n(`logo`,25)}</span>
          <span class="brand-text"><strong>竞途有序</strong><small>EntryFlow</small></span>
        </div>
        <div class="sidebar-menu">
          <p class="sidebar-label">工作流程</p>
          <nav class="sidebar-nav" aria-label="工作流程">${i()}</nav>
        </div>
        <div class="sidebar-footer">
          ${n(`device`,19)}
          <span>本地工作区<small>当前浏览器存储</small></span>
        </div>
      </aside>
      <div class="workspace-shell">
        <header class="topbar">
          <div class="topbar-inner">
            <p class="breadcrumbs"><span>工作区</span>${n(`chevron-right`,13)}<strong>投递工作台</strong></p>
            <div class="topbar-actions">
              <span class="save-status" id="save-status" aria-live="polite">本地保存</span>
              <button class="button button-secondary sample-button" type="button" data-action="load-sample">${n(`sample`,17)}<span>载入示例</span></button>
            </div>
          </div>
        </header>
        <main class="workspace" id="workspace">
          <header class="workspace-heading">
            <h1 id="stage-title">竞赛投递工作台</h1>
            <p id="stage-description">汇总赛规与项目材料，把每一项投递要求落到行动。</p>
          </header>
          <nav class="stage-nav" aria-label="投递阶段">${a()}</nav>
          <div class="workspace-columns">
            <section id="stage-content" class="stage-content" aria-labelledby="stage-title" tabindex="-1"></section>
            <aside id="stage-aside" class="stage-aside" aria-label="当前阶段辅助信息"></aside>
          </div>
        </main>
      </div>
    </div>
  `}var s=`modulepreload`,c=function(e,t){return new URL(e,t).href},l={},ee=function(e){return e.pathname.endsWith(`.css`)},te=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},u=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=c(t,n);let r=u(t),i=ee(r);return te(l,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:s,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{let i=a=>{t.removeEventListener(`load`,i),t.removeEventListener(`error`,i),a.type===`error`?n(Error(`Unable to preload CSS for ${r}`)):e(a)};t.addEventListener(`load`,i),t.addEventListener(`error`,i)})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},ne=[{id:`eligibility`,title:`参赛资格`,clue:`在校 学生 学籍 本科 专科 研究生 高校 院校 身份 专业`,projectMatches:/学籍|在校(?:学生|生)|在读|全日制|本科生|专科生|研究生|enrolled|full.time/iu,matches:/参赛对象|参赛资格|报名资格|正式学籍|正式全日制学籍|仅限.{0,20}(?:学生|高校|院校|职业|年龄)|(?:在校|全日制|本专科|本科|高职|研究生).{0,16}(?:学生|学籍|在校生|参赛|均可|报名)|(?:学生|学籍|院校).{0,20}(?:方可参赛|方可报名|均可参赛)|eligib(?:ility|le)|enrolled students/iu,suggestion:`核对成员身份、学籍及所属组别，并保留证明材料。`},{id:`team`,title:`组队要求`,clue:`队员 成员 组队 人数 指导老师 指导教师 独立参赛`,projectMatches:/单人|独立(?:参赛|完成|开发)|个人(?:赛|为单位|参赛)|[0-9一二三四五六七八九十两]+\s*(?:名|人|位).{0,12}(?:学生|队员|成员)|(?:队员|成员|团队|队伍).{0,14}(?:[0-9一二三四五六七八九十两]+\s*(?:名|人|位)|指导)|guid(?:ance|ing) teacher|team.{0,16}\d+/iu,matches:/组队要求|团队人数|队伍人数|个人赛|个人(?:为)?单位|单人参赛|指导(?:老师|教师)|每(?:支队伍|队伍|队|组|个团队).{0,18}(?:[0-9一二三四五六七八九十两]+\s*(?:人|名|位)|成员|队员)|(?:团队|队伍|组队|队员|成员).{0,20}[0-9一二三四五六七八九十两]+\s*(?:人|名|位)|(?:仅限|允许|可)(?:单人|个人|跨校|跨专业).{0,12}(?:参赛|组队)|(?:team|group).{0,20}(?:members?|participants?)/iu,suggestion:`确认个人参赛或团队人数、组队范围和指导教师安排。`},{id:`division`,title:`参赛组别`,clue:`组别 研究生组 本科组 高职组 专科组 学校`,projectMatches:/组别|研究生组|本科组|高职组|专科组|[ABC]\s*组|全日制|院校类型|division/iu,matches:/参赛组别|组别划分|按.{0,15}(?:学校|学籍|学历|院校).{0,10}分组|研究生组|本科组|高职组|(?:\b[ABC]\s*组.{0,25}){2}|competition division/iu,suggestion:`根据学籍和院校类型确认所属组别。`},{id:`originality`,title:`原创与权属`,clue:`原创 著作权 知识产权 开源 授权 许可 抄袭 数据`,projectMatches:/原创|原创性|首创|著作权|知识产权|开源|非原创|授权|许可|自主(?:实现|设计|开发)|open.source|licen[sc]e|copyright/iu,matches:/原创|知识产权|著作权|版权|权属|抄袭|剽窃|重复(?:参赛|获奖)|previously (?:submitted|awarded)|plagiarism|copyright|intellectual property|original work/iu,suggestion:`确认作品、数据和素材的来源，以及对应的许可或授权。`},{id:`development`,title:`开发方式`,clue:`Vibe Coding AI编程 提示词 prompt 生成 大模型 编程工具 手写`,projectMatches:/vibe[\s-]*coding|\bAI\b|大模型|编程工具|提示词|\bprompt\b|手(?:动编写|写).{0,8}(?:程序|代码)/iu,matches:/vibe[\s-]*coding|氛围编程|自然语言编程|(?:必须|须|不得|禁止|需|要求).{0,26}(?:AI.{0,7}编程|人工智能.{0,7}编程|编程工具|大模型|手写.{0,4}代码|手动.{0,4}编码|手动编写.{0,4}代码)|(?:AI|大模型).{0,20}(?:生成代码|辅助开发|驱动开发|编写代码)|(?:AI[- ]assisted|AI[- ]generated) (?:development|coding|code)/iu,suggestion:`核对允许的开发方式和工具，检查过程记录能否对应实现。`},{id:`deadline`,title:`报名与投递时间`,clue:`报名 截止 时间 逾期 北京时间 时区`,projectMatches:/截止|逾期|时区|北京时间|\d{4}[-/.年]\s*\d{1,2}[-/.月]|\d{1,2}\s*月\s*\d{1,2}\s*(?:日|号)|\d{1,2}:\d{2}|(?:已|尚未|尚待).{0,5}(?:完成报名|赛事投递)|deadline|submi\w* (?:before|by)/iu,matches:/截止|(?:报名|提交|上传|投递)(?:时间|日期|期限)|(?:逾期|超过时限).{0,15}(?:不予|无效|不得)|deadline|due (?:by|on)|submi[ts].{0,10}(?:before|by)/iu,suggestion:`核对日期、时区、平台状态以及报名与作品提交的各自截止时间。`},{id:`publication`,title:`仓库公开要求`,clue:`仓库 公开 开源 GitHub Gitee 仓库链接`,projectMatches:/仓库|\b(?:GitHub|Gitee|GitLab)\b|repositor(?:y|ies)/iu,matches:/(?:公开|公共|开源).{0,28}仓库|仓库.{0,14}(?:公开|公共|可访问|开源|开放评审权限)|public (?:code )?repositor(?:y|ies)/iu,suggestion:`用未登录窗口确认仓库和所需证据可访问。`}],re=[{id:`repository`,title:`代码仓库链接`,matches:/(?:GitHub|Gitee|GitLab).{0,15}(?:仓库|地址|链接)|(?:代码|源码|项目|公开|开源).{0,5}仓库|仓库(?:地址|链接)|(?:repository|repo) (?:URL|link)/iu},{id:`source-code`,title:`项目源代码`,matches:/源代码|项目代码|源码(?:包)?|代码压缩包|source code/iu},{id:`project-doc`,title:`项目说明文档`,matches:/作品说明(?:书|文档)?|项目说明(?:书|文档)?|项目文档|使用手册|project documentation/iu},{id:`readme`,title:`README 复现指南`,matches:/\bREADME\b|(?:快速|项目|操作|安装)复现(?:指南|说明)/iu},{id:`technical-doc`,title:`技术文档`,matches:/技术(?:说明|文档)|technical documentation/iu},{id:`report`,title:`作品报告`,matches:/项目报告|技术报告|作品报告|设计报告|调研报告|项目计划书|实施方案|项目方案|论文|\breport\b/iu},{id:`slides`,title:`展示幻灯片`,matches:/(?:答辩|演示|汇报|展示)(?:材料|文稿|课件|幻灯片)|\bPPTX?\b|幻灯片|slides/iu},{id:`demo-video`,title:`演示视频`,matches:/(?:演示|展示|讲解|介绍|录屏)(?:视频|录像)|视频(?:时长|文件|演示|链接)|视频|(?:demo|presentation) video/iu},{id:`live-demo`,title:`在线演示链接`,matches:/(?:线上|在线|公开|部署|体验|访问|演示)(?:地址|链接|网址)|可访问的(?:网站|网页)|live demo|deployed (?:URL|link)/iu},{id:`screenshots`,title:`作品截图`,matches:/截图(?:材料)?|界面图|screenshots?/iu},{id:`git-history`,title:`Git 提交历史`,matches:/\bgit\b.{0,18}(?:历史|提交|commit)|(?:细粒度|历史)提交(?:历史|记录)/iu},{id:`prompt-history`,title:`Prompt 迭代记录`,matches:/提示词|\bPrompt\b.{0,8}(?:迭代|记录|链路|日志|历史|history|logs?)|交互(?:记录|截图)|对话(?:过程|记录|日志|截图)/iu},{id:`process`,title:`开发过程记录`,matches:/开发(?:过程|日志|记录)|创作过程|生成(?:过程|记录)|Vibe\s*Coding.{0,8}(?:过程|记录)/iu},{id:`application`,title:`报名与提交表单`,matches:/报名表|报名信息|作品信息表|参赛登记表|申报(?:书|表)|提交表单|application form/iu},{id:`declaration`,title:`原创声明或承诺书`,matches:/原创(?:声明|承诺书)|诚信承诺书|授权书|承诺书|declaration of originality/iu},{id:`identity-proof`,title:`资格证明材料`,matches:/学籍证明|学生证|在读证明|身份(?:证件|证明)|资格证明/iu},{id:`package`,title:`作品运行包`,matches:/可执行(?:程序|文件)|安装包|运行包|发布包|项目压缩包|作品压缩包|executable(?: file)?/iu}],ie=/提交(?:物|材料|文件|要求|内容)|交付(?:物|材料|文件|清单|要求)|作品(?:材料|文件|提交要求)|材料清单|需(?:要|另)?(?:提供|提交|上传|附)|(?:必须|应当|须|统一|请)(?:同时|一并|附带)?(?:提交|提供|上传|附上)|(?:提交|上传|提供|附上|附带|包含|包括)[：:\s]|\b(?:submit|deliverables?|must include|required files)\b/iu,ae=/^(?:提交|提供|上传|附上|附带|交付)/u,oe=/必须|不得|禁止|不能|只能|仅限|仅可|须|应当|需|限于|要求|方可|must|only|required|shall|prohibited/iu,se=/可选|选填|非必(?:需|须|填)|不强制|(?:建议|鼓励)(?:[：:、，,\s]|提交|上传|提供|附)|(?:可|可以|允许)(?:同时|自愿|额外)?(?:提交|上传|附上)|举例|例如|仅供参考|optional|encouraged|may (?:submit|include)/iu,ce=/^(?:(?:省赛|国赛|校赛|决赛|初赛)\s*)?(?:(?:参赛|作品|报名|项目|必交|所需|申报|投递)(?:作品)?)?(?:提交(?:的)?(?:材料|文件|内容|要求|物)|交付(?:物|材料|文件|要求|清单)|材料(?:清单|要求)|作品材料|报名材料|需(?:要)?(?:提交|提供|上传)(?:的)?(?:材料|文件|内容)?|(?:required )?(?:submission )?materials|deliverables)[：:。]?$/iu,le=/^(?:参赛(?:对象|条件|资格|人群|流程)|赛道(?:介绍|说明)|组队(?:限制|要求)|原创(?:要求|说明)|开发(?:要求|规范)|比赛(?:流程|时间|赛程)|(?:评分|评审)(?:规则|标准|要求)|联系方式|报名(?:时间|办法|方式)|其他(?:要求|说明)?|注意事项)[：:。]?$/u,ue=new Set(`是否.哪些.什么.怎样.如何.可以.需要.必须.有关.关于.要求.参赛.作品.项目.材料.确认.赛规.一个.对于.相关.具备.the.for.and.with.how.what.when.of.to.must.should.need`.split(`.`)),d=globalThis.Intl?.Segmenter?new Intl.Segmenter(`zh-CN`,{granularity:`word`}):null;function f(e){return e.normalize(`NFKC`).toLowerCase().replace(/\s+/gu,` `).trim()}function p(e){return e.split(/\r\n?|\n/u).map((e,t)=>({line:t+1,text:e.trim()})).filter(({text:e})=>e)}function m(e){return e.split(/(?<=[。！？；])|(?<=[，,])(?=\s*(?:也|另)?(?:建议|鼓励|可选|(?:可|可以|允许)(?:同时|自愿|额外)?(?:提交|上传|附上)))/u).map(e=>e.trim()).filter(Boolean)}function de(e){return d?[...d.segment(e)].filter(e=>e.isWordLike).map(e=>e.segment):(e.match(/[a-z0-9]+|\p{Script=Han}+/gu)??[]).flatMap(e=>/^\p{Script=Han}{3}/u.test(e)?Array.from({length:e.length-1},(t,n)=>e.slice(n,n+2)):[e])}function h(e,t,n){let r=f(t);if(!r)return[];let i=[...new Set(de(r))].filter(e=>(e.length>1||/^\d$/u.test(e))&&!ue.has(e)).slice(0,32),a=e.map(e=>({...e,normalized:f(e.text)})),o=i.map(e=>{let t=a.filter(({normalized:t})=>t.includes(e)).length;return[e,Math.log(1+(a.length-t+.5)/(t+.5))]});return a.map(({line:e,text:t,normalized:n})=>({line:e,text:t,score:(n.includes(r)?3:0)+o.reduce((e,[t,r])=>n.includes(t)?e+r:e,0)})).filter(({score:e})=>e>0).sort((e,t)=>t.score-e.score||e.line-t.line).slice(0,n).map(({line:e,text:t,score:n})=>({line:e,text:t,score:Number(n.toFixed(3))}))}function fe(e,t,n=5){let r=Number.isFinite(n)?Math.max(0,Math.floor(n)):5;return h(p(e),t,r)}function pe(e,t){let n=2166136261;for(let e of f(t).replace(/^[#*\-•\d.、()（）\s]+/u,``))n=Math.imul(n^e.codePointAt(0),16777619);return`${e}-${(n>>>0).toString(36)}`}function g(e){return e.replace(/^(?:#{1,6}\s*|[-*+•]\s+|[（(]?[0-9一二三四五六七八九十]+[.、）)]\s*)+/u,``).replaceAll(`**`,``).trim()}function me(e,t,n){let r=re.filter(({matches:t})=>t.test(e)),i=r.length?r:[{id:pe(`material`,e),title:g(e).replace(/[：:。；;]$/u,``)}];for(let{id:r,title:a}of i)n.has(r)||n.set(r,{id:r,title:a,quote:e,line:t})}function he(e,t=``){let n=p(e),r=p(t).flatMap(({line:e,text:t})=>m(t).map(t=>({line:e,text:t}))),i=new Map,a=new Map,o=!1;for(let{line:e,text:t}of n){let n=g(t);if(ce.test(n))o=!0;else if(le.test(n))o=!1;else{/^#{1,6}\s/u.test(t)&&(o=!1),/^(?:提交材料|作品材料|交付物|材料清单|submission materials)\s*[:：]/iu.test(n)&&(o=!0);for(let n of m(t)){let t=ae.test(g(n))||ie.test(n),s=se.test(n),c=re.filter(({matches:e})=>e.test(n)),l=oe.test(n)&&c.some(({id:e})=>e!==`process`),ee=o&&(c.length>0||/^(?:[-*+•]|[（(]?[0-9一二三四五六七八九十]+[.、)）])\s*/u.test(n));if(!s&&(t&&c.length>0||l||ee)&&me(n,e,a),!s)for(let a of ne){if(!a.matches.test(n)||a.id===`development`&&!oe.test(n)&&t)continue;let o=pe(a.id,n);if(i.has(o))continue;let s=r.filter(({text:e})=>a.projectMatches.test(e)),[c]=h(s,a.clue,1);i.set(o,{id:o,title:a.title,quote:n,line:e,suggestion:a.suggestion,evidence:c?.text??s[0]?.text??``})}}}}let s=fe(e,`参赛资格 报名 组队 人数 截止 原创 开发 提示词 交付 提交 视频 仓库`,5);return{gates:[...i.values()],materials:[...a.values()],excerpts:s}}function ge(e){if(e[0]===255&&e[1]===254)return new TextDecoder(`utf-16le`).decode(e);if(e[0]===254&&e[1]===255)return new TextDecoder(`utf-16be`).decode(e);try{return new TextDecoder(`utf-8`,{fatal:!0}).decode(e)}catch{return new TextDecoder(`gb18030`,{fatal:!0}).decode(e)}}async function _e(e){let[{getDocument:t,GlobalWorkerOptions:n},{default:r}]=await Promise.all([u(()=>import(`./pdf-CF1upwsF.js`),[],import.meta.url),u(()=>import(`./pdf.worker.min-CSU2zTEh.js`),[],import.meta.url)]);n.workerSrc=r;let i=t({data:e,isEvalSupported:!1,useWasm:!1}),a=[];try{let e=await i.promise;for(let t=1;t<=e.numPages;t+=1){let n=await e.getPage(t),{items:r}=await n.getTextContent(),i=``;for(let e of r)typeof e.str==`string`&&(i+=e.str,e.hasEOL&&(i+=`
`));i.trim()&&a.push(i.trimEnd()),n.cleanup()}}finally{await i.destroy()}return a.join(`

`)}async function ve(e){if(!e||typeof e.arrayBuffer!=`function`)throw Error(`请选择赛规文件。`);let t=e.name?.toLowerCase().match(/\.([a-z0-9]+)$/u)?.[1];if(![`txt`,`md`,`csv`,`json`,`pdf`].includes(t))throw Error(`请选择 TXT、MD、CSV、JSON 或 PDF。图片可转写后粘贴原文。`);if(e.size>20971520)throw Error(`赛规文件超过 20 MB。请保存为文字文件或粘贴相关条款。`);let n;try{let r=new Uint8Array(await e.arrayBuffer());n=t===`pdf`?await _e(r):ge(r)}catch{throw Error(t===`pdf`?`PDF 读取失败。请解锁文件、复制文字或粘贴赛规原文。`:`文本读取失败。请保存为 UTF-8 编码或粘贴赛规原文。`)}if(!n.trim()||n.includes(`\0`))throw Error(t===`pdf`?`PDF 没有可提取的文字。请转写扫描件后粘贴原文。`:`没有读到赛规文字。请检查文件内容或编码。`);return n}var _={competition:`第九届传智杯 · AI创新应用挑战赛`,source:`https://www.boxuegu.com/matchTrack/detail/?id=10039`,project:`实验室预约小助手（虚构示例）`,rule:`第九届传智杯 · AI创新应用挑战赛（根据官方页面人工摘编）
具有正式全日制学籍的研究生、本科及高职高专学生可以参赛，以个人为单位参赛。
报名时按学籍和学校类型选择研究生组、A 组、B 组或 C 组。
参赛作品须为原创，严禁直接包装已有开源项目。
开发过程必须使用 AI 辅助编程工具，且能够复现。
省赛报名及提交均截止 2026-11-18，缴费后登录个人中心查看作品提交入口。
提交公开 GitHub 或 Gitee 代码仓库，也可对评审开放访问。
Git 历史须细粒度提交，禁止一次提交包含全部功能。
提交 AI 对话 Prompt 历史，须涵盖至少三个核心功能的完整迭代链。
提供 README 十分钟复现指南，含环境配置、依赖和环境变量模板。
提交 5–8 分钟的 1080p MP4 演示视频，至少 2 分钟展示 AI 协同复现。
提交不超过 30 页的技术文档 PDF，阐述意图控制、系统架构与可复现性。`,summary:`本例为虚构学生项目，帮助同学查询实验室空闲时段并提交预约。设定为一名全日制本科生独立开发，具体报名组别有待核对。使用 AI 辅助编程工具生成预约流程，保留了部分 Prompt 对话。仓库目前为私有，README 已起草，演示视频和技术文档尚未完成。`},v=[`competition`,`source`,`rule`,`project`,`summary`],y={pending:`待确认`,pass:`符合`,fail:`不符合`},ye={pending:`待开始`,active:`进行中`,done:`已完成`};function be(){return{version:1,stage:`intake`,draft:Object.fromEntries(v.map(e=>[e,``])),fileName:``,sample:!1,analysis:null,checklist:null}}function xe(e){return JSON.stringify(v.map(t=>t===`rule`?e[t]:e[t].trim()))}function Se(e){return JSON.stringify([e.competition.trim(),e.source.trim(),e.project.trim()])}function b(e){return e.analysis?.fingerprint===xe(e.draft)}function Ce(e){return JSON.stringify([e.analysis.fingerprint,e.analysis.gates.map(e=>[e.key,e.status])])}function x(e){return b(e)&&e.checklist?.signature===Ce(e)}function S(e){return JSON.stringify([e.title,e.quote])}function we(e,t){let n=e.analysis,r=xe(e.draft),i=Se(e.draft),a=n?.workspace===i,o=n?.fingerprint===r,s=new Map(o?n.gates.map(e=>[e.key,e]):[]),c=new Map;for(let e of t.gates){let t=S(e);if(c.has(t))continue;let n=s.get(t);c.set(t,{...e,key:t,status:n?.status??`pending`,note:n?.note??``,manual:!1})}let l=a?n.gates.filter(e=>e.manual):[];e.analysis={fingerprint:r,workspace:i,gates:[...c.values(),...l.map(e=>o?e:{...e,status:`pending`,note:``})],materials:t.materials,excerpts:t.excerpts}}function Te(e,t,n){b(e)&&t.trim()&&e.analysis.gates.push({key:`manual:${crypto.randomUUID()}`,title:t.trim(),quote:n.trim(),line:null,suggestion:``,evidence:``,status:`pending`,note:``,manual:!0})}function Ee(e){if(!b(e))return;let t=e.checklist,n=Se(e.draft),r=t?.workspace===n,i=new Map(r?t.items.map(e=>[e.key,e]):[]),a=new Map,o=(e,t,n,r,o)=>{let s=i.get(e);a.set(e,{key:e,title:t,kind:n,quote:r,line:o,owner:s?.owner??``,note:s?.note??``,status:s?.status??`pending`})};for(let t of e.analysis.materials)o(`material:${S(t)}`,t.title,`material`,t.quote,t.line);for(let n of e.analysis.gates){if(n.status===`pass`)continue;let r=n.status===`fail`?`处理阻塞`:`确认门槛`,a=`gate:${n.status}:${n.key}`;t?.fingerprint!==e.analysis.fingerprint&&i.delete(a),o(a,`${r} · ${n.title}`,`gate`,n.quote,n.line)}let s=r?t.items.filter(e=>e.kind===`manual`):[];e.checklist={workspace:n,fingerprint:e.analysis.fingerprint,signature:Ce(e),items:[...a.values(),...s]}}function De(e,t){x(e)&&t.trim()&&e.checklist.items.push({key:`manual:${crypto.randomUUID()}`,title:t.trim(),kind:`manual`,quote:``,line:null,owner:``,note:``,status:`pending`})}function C(e){let t=b(e)?e.analysis.gates:[],n=x(e)?e.checklist.items:[];return{gateTotal:t.length,passed:t.filter(e=>e.status===`pass`).length,blocked:t.filter(e=>e.status===`fail`).length,pending:t.filter(e=>e.status===`pending`).length,taskTotal:n.length,completed:n.filter(e=>e.status===`done`).length}}function w(e){return String(e??``).replace(/([\\`*_{}.\[\]()#+!|<>-])/g,`\\$1`).replace(/\r?\n/g,` `)}function Oe(e){return e.line?`赛规第 ${e.line} 行`:e.manual||e.kind===`gate`||e.kind===`manual`?`手动补录`:`赛规摘录`}function ke(e){if(!x(e))return``;let{draft:t,analysis:n,checklist:r}=e,i=[`# ${w(t.competition)} 投递清单`,``,`- 项目：${w(t.project)}`];t.source&&i.push(`- 赛规来源：${w(t.source)}`),e.sample&&i.push(`- 工作台曾载入演示样例，请按当前资料核对内容。`),i.push(``,`## 门槛核验`,``),n.gates.length||i.push(`暂无可辨识或手动录入的门槛。`);for(let e of n.gates)i.push(`- **${w(e.title)}** · ${y[e.status]}`),e.quote&&i.push(`  - ${Oe(e)}：${w(e.quote)}`),e.note&&i.push(`  - 核验备注：${w(e.note)}`);i.push(``,`## 投递任务`,``),r.items.length||i.push(`暂无任务。`);for(let e of r.items){let t=e.status===`done`?`x`:` `;i.push(`- [${t}] ${w(e.title)} · ${ye[e.status]}`),e.owner&&i.push(`  - 负责人：${w(e.owner)}`),e.note&&i.push(`  - 备注：${w(e.note)}`),e.quote&&i.push(`  - ${Oe(e)}：${w(e.quote)}`)}return`${i.join(`
`)}\n`}var Ae=`entryflow-workspace-v1`,je=15e4,T={intake:{title:`竞赛投递工作台`,description:`录入赛规和项目摘要，开始准备这次投递。`},review:{title:`核验门槛`,description:`对照赛规出处与项目信息，逐条确认参赛要求。`},checklist:{title:`投递清单`,description:`跟进材料、负责人和待处理要求，随时导出当前进度。`}},E=document.querySelector(`#app`);E.innerHTML=o();var D=E.querySelector(`#stage-content`),O=E.querySelector(`#stage-aside`);r(D);var k=document.createElement(`div`);k.className=`visually-hidden`,k.setAttribute(`role`,`status`),E.append(k);var A=!0,j=Me(),M=``,N=``,P=!1,F=0,I=!1,L=null;function Me(){try{let e=JSON.parse(localStorage.getItem(Ae));if(e?.version===1&&Object.hasOwn(T,e.stage)&&v.every(t=>typeof e.draft?.[t]==`string`))return e}catch{A=!1}return be()}function R(){try{localStorage.setItem(Ae,JSON.stringify(j)),A=!0}catch{A=!1}z()}function z(){let e=E.querySelector(`#save-status`),t=A?`自动保存到本设备`:`本设备暂无法保存`;e.textContent!==t&&(e.textContent=t),e.dataset.status=A?``:`error`}function B(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function V(e){try{let t=new URL(e);if(t.protocol===`http:`||t.protocol===`https:`)return t.href}catch{return``}return``}function H(e,t=`neutral`){return`<span class="badge badge-${t}">${B(e)}</span>`}function U(e,t,{symbol:r,style:i=`secondary`,disabled:a=!1}={}){return`<button class="button button-${i}" type="button" data-action="${t}" ${a?`disabled`:``}>
    ${r?n(r,16):``}${e}
  </button>`}function Ne(e,t){return Object.entries(e).map(([e,n])=>`<option value="${e}" ${t===e?`selected`:``}>${n}</option>`).join(``)}function W(e,t,n,r=``){return`<section class="panel">
    <header class="panel-header"><h2>${e}</h2>${t?`<p>${t}</p>`:``}</header>
    <div class="panel-body">${n}</div>
    ${r?`<div class="panel-actions">${r}</div>`:``}
  </section>`}function G(e,t,r=``){return`<div class="empty-state">
    ${n(`layers`,24)}
    <h3>${e}</h3>
    <p>${t}</p>
    ${r}
  </div>`}function K(e){k.textContent=e}function q(){let e=C(j),t={intake:b(j),review:e.gateTotal>0&&e.passed===e.gateTotal,checklist:e.taskTotal>0&&e.completed===e.taskTotal&&e.gateTotal>0&&e.passed===e.gateTotal};for(let e of E.querySelectorAll(`button[data-stage]`)){let n=e.dataset.stage;e.classList.toggle(`is-active`,n===j.stage),e.classList.toggle(`is-done`,t[n]),n===j.stage?e.setAttribute(`aria-current`,`step`):e.removeAttribute(`aria-current`)}}function J({focus:e=!1}={}){let{title:t,description:n}=T[j.stage],r=E.querySelector(`#stage-title`);r.textContent=t,r.tabIndex=-1,E.querySelector(`#stage-description`).textContent=n,z(),q();let i=D.parentElement,a=j.stage===`checklist`;i.classList.toggle(`is-checklist`,a),a&&i.firstElementChild!==O&&D.before(O),!a&&i.firstElementChild!==D&&O.before(D),j.stage===`intake`?(D.innerHTML=Fe(),D.querySelector(`#rule`).value=j.draft.rule,D.querySelector(`#summary`).value=j.draft.summary,X()):j.stage===`review`?(D.innerHTML=Re(),O.innerHTML=Be(),Q()):(D.innerHTML=Ke(),qe()),e&&r.focus()}function Y(e,{focus:t=!0}={}){j.stage=e,R(),J({focus:t})}function Pe(){return j.sample?H(v.every(e=>j.draft[e]===_[e])?`官方赛规摘编 · 虚构项目`:`示例资料已修改`):``}function Fe(){let{draft:e,fileName:t}=j;return`<form id="intake-form" class="panel-stack">${W(`赛规资料`,`填写赛事信息，粘贴或导入赛规原文。`,`
    <div class="form-grid">
      <div class="field">
        <label for="competition">赛事名称 <span class="field-required" aria-hidden="true">*</span></label>
        <input id="competition" name="competition" data-draft required maxlength="180" value="${B(e.competition)}"
          placeholder="例如：第九届传智杯 · AI创新应用挑战赛">
      </div>
      <div class="field">
        <label for="source">赛规来源链接 <span class="muted">选填</span></label>
        <input id="source" name="source" type="url" data-draft maxlength="2048" value="${B(e.source)}"
          placeholder="https://">
      </div>
      <div class="field span-full">
        <div class="field-label-row">
          <label for="rule">赛规文本 <span class="field-required" aria-hidden="true">*</span></label>
          ${U(`导入文件`,`import-rules`,{symbol:`upload`})}
        </div>
        <input type="file" id="rule-file" class="visually-hidden" tabindex="-1"
          accept=".txt,.md,.csv,.json,.pdf,text/plain,application/pdf" aria-label="导入赛规文件">
        <textarea id="rule" name="rule" data-draft required rows="6" maxlength="${je}" aria-describedby="rule-hint"
          placeholder="粘贴资格限制、关键日期、作品要求和需提交的材料…"></textarea>
        <p id="rule-hint" class="field-hint">支持 TXT、Markdown、CSV、JSON 及带文字层的 PDF。截图和扫描件请先转写。</p>
        <div class="field-meta" id="rule-file-status" aria-live="polite">
          ${N?`<span>${B(N)}</span>`:``}
          ${t?`<span>${n(`file`,14)}${B(t)}</span>`:``}
          ${j.sample?`<span id="sample-source-tag">${Pe()}</span>`:``}
        </div>
      </div>
    </div>`)}${W(`项目资料`,`写入与参赛条件和投递材料相关的事实。`,`
    <div class="form-grid">
      <div class="field span-full">
        <label for="project">项目名称 <span class="field-required" aria-hidden="true">*</span></label>
        <input id="project" name="project" data-draft required maxlength="180" value="${B(e.project)}"
          placeholder="填写你的作品名称">
      </div>
      <div class="field span-full">
        <label for="summary">项目摘要 <span class="field-required" aria-hidden="true">*</span></label>
        <textarea id="summary" name="summary" data-draft required rows="4" maxlength="12000"
          placeholder="写下目标用户、主要功能、参赛者资格、开发方式和材料进度…"></textarea>
      </div>
    </div>`)}
    <div class="stage-action-bar">
      <button type="submit" class="button button-primary" ${P?`disabled`:``} id="analyze-button">
        提取门槛与材料 ${n(`arrow-right`,16)}
      </button>
      ${U(`清空资料`,`clear-workspace`,{style:`quiet`})}
    </div>
  </form>`}function X(){let{draft:e,sample:t}=j;O.innerHTML=W(`资料概览`,``,`
    <ul class="compact-list">
      ${[[`赛规文本`,!!e.rule.trim()],[`项目摘要`,!!e.summary.trim()],[`来源链接`,!!V(e.source.trim())]].map(([e,t])=>`<li><span>${e}</span>${H(t?`已录入`:`待录入`,t?`success`:`neutral`)}</li>`).join(``)}
    </ul>
    ${j.analysis&&!b(j)?`<p class="alert">资料已更新。重新提取后，请核验新的门槛。</p>`:``}
    ${t?`<p class="field-hint">内置示例使用主办方规则摘编和虚构项目。投递请核对当前资料。</p>`:``}
    ${V(e.source.trim())?`<a class="inline-link" href="${B(V(e.source.trim()))}" target="_blank" rel="noopener noreferrer">${n(`link`,15)} 打开赛规来源</a>`:``}
  `)+W(`提取方式`,``,`
    <p class="field-hint">系统按录入文本提取候选门槛与材料，并保留出处供你核对。</p>
    <p class="field-hint">将资格、提交要求和截止日期分行录入，更容易定位引用。</p>
  `)}function Z(e){return e.line?`<button type="button" class="inline-link" data-action="show-line" data-line="${Number(e.line)}">
    ${n(`link`,14)} 赛规第 ${Number(e.line)} 行
  </button>`:`<span class="muted">${e.manual||e.kind===`manual`||e.kind===`gate`?`手动补录`:`赛规摘录`}</span>`}function Ie(e){return e===`pass`?`success`:e===`fail`?`danger`:`warning`}function Le(e,t){return`<article class="review-item" data-gate-index="${t}">
    <div class="review-item-heading">
      <h3>${B(e.title)}</h3>
      <span data-gate-badge>${H(y[e.status],Ie(e.status))}</span>
    </div>
    <div class="evidence-quote">
      ${Z(e)}
      ${e.quote?`<blockquote>${B(e.quote)}</blockquote>`:`<p class="field-hint">尚未补录出处。</p>`}
    </div>
    <div class="project-evidence">
      <strong>项目摘要线索</strong>
      <p>${e.evidence?B(e.evidence):`暂无匹配片段，请结合项目材料核对。`}</p>
      ${e.suggestion?`<p class="field-hint">${B(e.suggestion)}</p>`:``}
    </div>
    <div class="form-grid">
      <div class="field">
        <label for="gate-status-${t}">核验结果</label>
        <select id="gate-status-${t}" data-gate-status>${Ne(y,e.status)}</select>
      </div>
      <div class="field">
        <label for="gate-note-${t}">核验备注</label>
        <input id="gate-note-${t}" data-gate-note maxlength="600" value="${B(e.note)}" placeholder="记录凭据、出处或待确认事项">
      </div>
    </div>
  </article>`}function Re(){if(!b(j))return W(`门槛核验`,``,G(`等待提取赛规`,j.analysis?`资料有改动。返回录入页重新提取后，即可核验当前资料。`:`录入赛规和项目摘要并提取内容后，候选门槛会出现在这里。`,U(`返回录入资料`,`open-intake`,{style:`primary`})));let e=j.analysis.gates;return`<div class="panel-stack">
    ${W(`候选门槛`,`引用来自当前录入文本。请按实际凭据确认核验结果。`,e.length?`<div class="review-list">${e.map(Le).join(``)}</div>`:G(`未识别到明确门槛`,`你可以核对原文并手动补录。`))}
    ${W(`补录门槛`,``,`
      <form id="gate-form" class="panel-stack">
        <div class="form-grid">
          <div class="field">
            <label for="manual-gate-title">门槛名称</label>
            <input id="manual-gate-title" name="title" maxlength="180" required placeholder="例如：作品授权声明">
          </div>
          <div class="field">
            <label for="manual-gate-source">出处或原文 <span class="muted">选填</span></label>
            <input id="manual-gate-source" name="source" maxlength="1000" placeholder="写入条款或来源">
          </div>
        </div>
        <div><button type="submit" class="button button-secondary">加入核验</button></div>
      </form>
    `)}
    <div class="stage-action-bar">
      ${U(`生成投递清单`,`generate-checklist`,{symbol:`arrow-right`,style:`primary`})}
    </div>
  </div>`}function ze(){let e=C(j);return`<ul class="compact-list">
    <li><span>符合</span>${H(e.passed,`success`)}</li>
    <li><span>待确认</span>${H(e.pending,`warning`)}</li>
    <li><span>不符合</span>${H(e.blocked,`danger`)}</li>
    <li><span>识别到的材料</span>${H(b(j)?j.analysis.materials.length:0)}</li>
  </ul>`}function Be(){return b(j)?W(`核验概览`,``,`<div id="gate-metrics">${ze()}</div>`)+W(`检索赛规证据`,`本地原文检索`,`
      <form id="evidence-form" class="evidence-form">
        <div class="field">
          <label for="evidence-query">关键词</label>
          <input id="evidence-query" name="query" maxlength="120" value="${B(M)}" placeholder="例如：提交材料">
        </div>
        <button type="submit" class="button button-secondary">${n(`search`,15)} 检索</button>
      </form>
      <div id="evidence-results" aria-live="polite"></div>
    `)+`<div id="ai-review-panel" aria-live="polite">${Ve()}</div>`:``}function Q(){let e=O.querySelector(`#evidence-results`);if(!e||!b(j))return;let t=M?fe(j.draft.rule,M,5):j.analysis.excerpts.slice(0,3);e.innerHTML=t.length?`<ol class="evidence-results">
      ${t.map(e=>`<li>${Z(e)}<p>${B(e.text)}</p></li>`).join(``)}
    </ol>`:`<p class="field-hint">${M?`暂无匹配。可尝试更短的关键词或原文用词。`:`输入关键词以查找相关原文。`}</p>`}function Ve(){if(!I)return W(`AI 复核建议`,``,`<p class="field-hint">当前使用本地检索。配置模型服务后可按需复核。</p>`);let e=L?.fingerprint===j.analysis?.fingerprint?L:null;return W(`AI 复核建议`,`参考建议由配置的模型生成，请对照引用人工核验。`,`
    <p class="field-hint">发起后，项目摘要、关键词和命中的赛规片段将发送给已配置的模型。</p>
    ${U(e?.pending?`正在复核…`:`复核当前关键词`,`ai-review`,{symbol:`sparkles`,disabled:e?.pending})}
    ${e?.error?`<p class="alert alert-error">${B(e.error)}</p>`:``}
    ${e?.answer?`<div class="ai-answer">
      <p class="field-hint">复核关键词：${B(e.query)}</p>
      <p>${B(e.answer)}</p>
      <ol class="evidence-results">${e.citations.map(e=>`<li>${Z(e)}<p>${B(e.text)}</p></li>`).join(``)}</ol>
    </div>`:``}
  `)}function $(){let e=O.querySelector(`#ai-review-panel`);e&&b(j)&&(e.innerHTML=Ve())}function He(e){return new URL(`api/ai/${e}`,document.baseURI)}async function Ue(){try{let e=await fetch(He(`status`),{headers:{Accept:`application/json`}});if(!e.ok)return;I=(await e.json()).available===!0,I&&$()}catch{}}async function We(){if(!I||!b(j))return;let e=O.querySelector(`#evidence-query`),t=e?.value.trim();if(!t){e?.setCustomValidity(`输入关键词后再发起复核。`),e?.reportValidity();return}M=t,Q();let n={fingerprint:j.analysis.fingerprint,query:t,pending:!0,error:``,answer:``,citations:[]};L=n,$();try{let e=await fetch(He(`review`),{method:`POST`,headers:{"Content-Type":`application/json`,Accept:`application/json`},body:JSON.stringify({ruleText:j.draft.rule,projectSummary:j.draft.summary,query:t})}),r=await e.json();if(!e.ok)throw Error(typeof r.error==`string`?r.error:`模型服务暂无法复核。`);if(typeof r.answer!=`string`||!Array.isArray(r.citations))throw Error(`模型服务返回的数据不完整。`);n.answer=r.answer,n.citations=r.citations}catch(e){n.error=e instanceof SyntaxError?`模型服务暂无法复核，请稍后重试。`:e.message}finally{n.pending=!1,L===n&&$()}}function Ge(e,t){let n={material:`投递材料`,gate:`门槛待办`,manual:`自定义`}[e.kind];return`<article class="task-item" data-task-index="${t}">
    <div class="task-item-heading">
      <div>
        ${H(n,e.kind===`gate`?`warning`:`neutral`)}
        <h3>${B(e.title)}</h3>
      </div>
      <div class="field">
        <label class="visually-hidden" for="task-status-${t}">任务状态：${B(e.title)}</label>
        <select id="task-status-${t}" data-task-status>${Ne(ye,e.status)}</select>
      </div>
    </div>
    ${e.quote?`<div class="evidence-quote">${Z(e)}<blockquote>${B(e.quote)}</blockquote></div>`:``}
    <div class="form-grid">
      <div class="field">
        <label for="task-owner-${t}">负责人</label>
        <input id="task-owner-${t}" data-task-owner maxlength="120" value="${B(e.owner)}" placeholder="填写负责人">
      </div>
      <div class="field">
        <label for="task-note-${t}">进度备注</label>
        <input id="task-note-${t}" data-task-note maxlength="600" value="${B(e.note)}" placeholder="记录当前进展">
      </div>
    </div>
  </article>`}function Ke(){if(!b(j))return W(`投递任务`,``,G(j.checklist?`资料已变更`:`等待核验门槛`,j.checklist?`返回录入页重新提取并核验。同一赛事和项目中，来源不变的材料任务会带回原有进度。`:`完成当前赛规的内容提取与核验后，即可生成投递清单。`,U(`返回录入资料`,`open-intake`,{style:`primary`})));if(!x(j)){let e=j.checklist?`核验结果或资料已更新。重新生成后，同一赛事和项目下的相同材料与手动任务会保留原有进度。`:`核验赛规后，可将投递材料及尚未解决的门槛转成任务。`;return W(`投递任务`,``,G(j.checklist?`清单等待更新`:`等待生成清单`,e,U(`返回门槛核验`,`open-review`,{style:`primary`})))}let e=j.checklist.items;return`<div class="panel-stack">
    ${W(`投递任务`,`对照赛规出处维护负责人和准备进度。`,e.length?`<div class="task-list">${e.map(Ge).join(``)}</div>`:G(`暂无投递任务`,`当前材料提取为空，可按规则补充任务。`))}
    ${W(`新增任务`,``,`
      <form id="task-form" class="evidence-form">
        <div class="field">
          <label for="manual-task-title">任务名称</label>
          <input id="manual-task-title" name="title" maxlength="180" required placeholder="例如：检查材料命名">
        </div>
        <button type="submit" class="button button-secondary">加入清单</button>
      </form>
    `)}
  </div>`}function qe(){if(!x(j)){O.innerHTML=``;return}let{gateTotal:e,pending:t,blocked:n,taskTotal:r,completed:i}=C(j),a=r?Math.round(i/r*100):0;O.innerHTML=W(`投递进度`,``,`
    <div class="task-progress">
      <div class="progress-numbers"><strong>${i} / ${r}</strong><span>${a}%</span></div>
      <div class="progress-track" role="progressbar" aria-label="投递任务完成度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${a}">
        <div class="progress-fill" style="width: ${a}%"></div>
      </div>
      <p class="field-hint">已完成的任务 / 全部任务</p>
    </div>
    <p class="field-hint">${e?t||n?`还有 ${t} 项待确认、${n} 项不符合。请回到核验页更新结论。`:`当前门槛均已人工确认为符合。`:`未识别到明确门槛。请结合原文核对。`}</p>`,U(`导出 Markdown`,`export-markdown`,{symbol:`download`}))}function Je(e){Y(`intake`,{focus:!1});let t=D.querySelector(`#rule`),n=t.value.split(`
`);if(!Number.isInteger(e)||e<1||e>n.length)return;let r=n.slice(0,e-1).reduce((e,t)=>e+t.length+1,0);t.focus(),t.setSelectionRange(r,r+n[e-1].length),t.scrollTop=Math.max(0,(e-2)*(parseFloat(getComputedStyle(t).lineHeight)||20))}function Ye(e){(!v.some(e=>j.draft[e].trim())||window.confirm(e?`载入演示将替换当前工作台资料。继续吗？`:`清空当前资料、核验和投递清单？`))&&(++F,P=!1,N=``,M=``,L=null,j=be(),e&&(j.draft={..._},j.sample=!0),Y(`intake`),K(e?`演示资料已载入`:`工作台资料已清空`))}async function Xe(e){if(!e)return;let t=++F;P=!0,N=`正在读取赛规…`;let n=D.querySelector(`#analyze-button`);n&&(n.disabled=!0);let r=D.querySelector(`#rule-file-status`);r&&(r.textContent=N);try{let n=await ve(e);if(t!==F)return;if(!n.trim())throw Error(`文件中没有可录入的文字。`);if(n.length>je)throw Error(`文件文字超过 15 万字，请选取与投递相关的条款。`);j.draft.rule=n.replace(/\r\n?/g,`
`),j.fileName=e.name,N=`赛规文件已导入`,R()}catch(e){t===F&&(N=e.message)}finally{t===F&&(P=!1,j.stage===`intake`&&(J(),D.querySelector(`[data-action="import-rules"]`)?.focus()),K(N))}}function Ze(){let e=ke(j);if(!e)return;let t=URL.createObjectURL(new Blob([e],{type:`text/markdown;charset=utf-8`})),n=document.createElement(`a`);n.href=t,n.download=`EntryFlow-投递清单.md`,document.body.append(n),n.click(),n.remove(),window.setTimeout(()=>URL.revokeObjectURL(t),1e3),K(`已导出投递清单`)}E.addEventListener(`click`,e=>{let t=e.target.closest(`button`);if(t){if(Object.hasOwn(T,t.dataset.stage))Y(t.dataset.stage);else switch(t.dataset.action){case`load-sample`:Ye(!0);break;case`clear-workspace`:Ye(!1);break;case`open-intake`:Y(`intake`);break;case`open-review`:Y(`review`);break;case`import-rules`:D.querySelector(`#rule-file`).click();break;case`show-line`:Je(Number(t.dataset.line));break;case`export-markdown`:Ze();break;case`ai-review`:We();break;case`generate-checklist`:Ee(j),Y(`checklist`),K(`投递清单已生成`)}}}),E.addEventListener(`input`,e=>{let t=e.target;if(t.matches(`[data-draft]`)){t.name===`rule`&&P&&(++F,P=!1,N=`已保留当前手动编辑的赛规`,D.querySelector(`#rule-file-status`).textContent=N,D.querySelector(`#analyze-button`).disabled=!1),j.draft[t.name]=t.value;let e=D.querySelector(`#sample-source-tag`);e&&j.sample&&(e.innerHTML=Pe()),t.setCustomValidity(``),R(),q(),X()}else if(t.matches(`[data-gate-note]`)&&b(j)){let e=j.analysis.gates[Number(t.closest(`[data-gate-index]`).dataset.gateIndex)];e.note=t.value,R()}else if(t.matches(`[data-task-owner], [data-task-note]`)&&x(j)){let e=j.checklist.items[Number(t.closest(`[data-task-index]`).dataset.taskIndex)];t.matches(`[data-task-owner]`)?e.owner=t.value:e.note=t.value,R()}else t.id===`evidence-query`&&t.setCustomValidity(``)}),E.addEventListener(`change`,e=>{let t=e.target;if(t.id===`rule-file`)Xe(t.files[0]),t.value=``;else if(t.matches(`[data-gate-status]`)&&b(j)){let e=t.closest(`[data-gate-index]`),n=j.analysis.gates[Number(e.dataset.gateIndex)];n.status=t.value,e.querySelector(`[data-gate-badge]`).innerHTML=H(y[n.status],Ie(n.status)),O.querySelector(`#gate-metrics`).innerHTML=ze(),R(),q()}else if(t.matches(`[data-task-status]`)&&x(j)){let e=j.checklist.items[Number(t.closest(`[data-task-index]`).dataset.taskIndex)];e.status=t.value,R(),q(),qe()}});function Qe(e,t){if(P)return;for(let t of e.querySelectorAll(`[required]`))if(!t.value.trim()){t.setCustomValidity(`请填写这项资料。`),t.reportValidity();return}let n=e.elements.source;n.value.trim()&&!V(n.value.trim())?(n.setCustomValidity(`请填写以 https:// 或 http:// 开头的链接。`),n.reportValidity()):(j.draft=Object.fromEntries(v.map(e=>[e,String(t.get(e)??``)])),we(j,he(j.draft.rule,j.draft.summary)),M=``,Y(`review`),K(`门槛与材料已提取`))}E.addEventListener(`submit`,e=>{let t=e.target;e.preventDefault();let n=new FormData(t);switch(t.id){case`intake-form`:Qe(t,n);break;case`evidence-form`:M=String(n.get(`query`)??``).trim(),Q();break;case`gate-form`:if(!String(n.get(`title`)).trim())return;Te(j,String(n.get(`title`)),String(n.get(`source`))),R(),J(),D.querySelector(`#manual-gate-title`).focus(),K(`门槛已添加`);break;case`task-form`:if(!String(n.get(`title`)).trim())return;De(j,String(n.get(`title`))),R(),J(),D.querySelector(`#manual-task-title`).focus(),K(`任务已添加`)}}),J(),Ue();