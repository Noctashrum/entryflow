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
  `}var s={provincial:/省赛|省级(?:选拔赛|预赛|决赛|赛)/iu,national:/国赛|全国(?:总决赛|决赛|赛)|国家级赛/iu},c={provincial:`省赛`,national:`国赛`};function l(e){return Object.keys(s).filter(t=>s[t].test(e))}function u(e){return typeof e==`string`&&(e===`all`||Object.hasOwn(s,e))}var d=/^(?:省赛|国赛|省级(?:选拔赛|预赛|决赛|赛)|全国(?:总决赛|决赛|赛)|国家级赛)(?:[（(][^）)]{1,16}[）)])?\s*(?:阶段|安排|流程|通知|规则|说明)?$/iu,f=/^(?:本届|本赛道|赛事|竞赛|参赛|省赛|国赛)?\s*(?:(?:(?:作品|项目|报名|投递)?(?:提交|交付)(?:所需|的)?(?:材料|文件|内容|物|要求|规范|清单|说明|须知|要点)?|作品材料|报名材料|材料(?:清单|要求)|所需材料|需要提交的材料)(?:与说明)?|(?:required )?(?:submission )?materials|deliverables)$/iu,p=/^(?:省赛|国赛|竞赛)?\s*(?:奖项(?:设置|等级|规则|说明|与奖励)?|奖励办法|颁奖安排|评审(?:组织|标准|规则|细则|办法|流程|制度|机制|结果|方式|要求|维度|指标)|评分(?:标准|细则|规则|办法|流程)|晋级(?:规则|条件|安排|流程|要求|办法|名额|条件及流程)|组织(?:实施|机构|方式)|颁发证书)(?:与说明)?$/u,m=/^(?:省赛|国赛|竞赛)?\s*(?:赛道(?:介绍|说明|主题|背景)|竞赛主题|赛制(?:说明|安排)|(?:比赛|竞赛|时间|赛程|流程)(?:安排|说明|计划)|(?:报名|注册)(?:流程|方式|对象|条件|指南|渠道|信息)|参赛(?:对象|资格|组别|条件|说明|须知|分组|流程|要求)|组队(?:限制|要求)|原创(?:要求|说明)|开发(?:要求|规范)|通用(?:规则|条款|说明|要求)|联系方式|其他(?:要求|说明)?|注意事项|咨询方式|常见问题)$/u,h=/^(?:(?:代码|源码|项目|公开)?仓库(?:与(?:演进|开发|提交)记录)?|(?:AI\s*)?对话历史(?:导出的)?\s*(?:Prompt\s*历史快照)?|(?:Prompt|提示词)(?:历史快照|迭代记录|迭代链|记录)|(?:可)?复现性声明(?:与(?:重现|复现)指南)?(?:[（(]README(?:\.md)?[）)])?|演示视频(?:与技术文档)?|技术文档(?:与演示视频)?|README(?:\.md)?(?:复现指南)?)$/iu;function g(e){let t=e.replace(/^#{1,6}\s*/u,``).replaceAll(`**`,``).replace(/^[•*+-]\s*/u,``).trim(),n=e.match(/^(#{1,6})\s*/u)?.[1].length,r=t.match(/^(\d+(?:\.\d+)+|\d+\s*[.、）)]|[一二三四五六七八九十]+[、．.]|[（(][一二三四五六七八九十]+[）)])\s*/u),i=r?.[1],a=i?i.match(/\d+/gu)?.length??(i.startsWith(`（`)?2:1):0;r&&(t=t.slice(r[0].length).trim());let o=t.search(/[：:]/u);return{label:(o<0?t:t.slice(0,o)).trim(),depth:n??a,hasBody:o>=0&&!!t.slice(o+1).trim(),numbered:!!i,markdown:!!n}}function ee(e,t){let n=g(e),{label:r,depth:i,hasBody:a,numbered:o,markdown:s}=n;return d.test(r)&&!a?{...n,kind:`phase`}:f.test(r)&&!(a&&/(?:提交|交付)$/u.test(r)&&/\d{1,4}[年月/-]/u.test(e))?{...n,kind:`submission`}:p.test(r)?{...n,kind:`excluded`}:m.test(r)?{...n,kind:`other`}:t===`submission`&&(h.test(r)||o&&i>1&&!a&&r.length<=48&&!/[，,。！？；]/u.test(r))?{...n,kind:`subsection`}:s&&!a?{...n,kind:`other`}:null}function _(e){let t=l(e);if(!t.length)return null;if(t.length>1)return/均(?:需|应|可|须|必须|适用|为)|一律|统一(?:执行|适用)|两个阶段(?:的)?(?:要求相同|均)/u.test(e)?`general`:`mixed`;let n=t[0],{label:r}=g(e.replace(/^[【［\[]\s*/u,``)),i=r.match(s[n]),a=i?r.slice(i.index+i[0].length):``;return i?.index===0||/^\s*(?:阶段|的)?\s*(?:作品|报名|提交|交件|投递|材料|截止|评审|要求|环节)/u.test(a)?n:null}function v(e,t,n){return{line:e,column:t,text:n}}function te(e){let t=[],n=null,r=null,i=null;for(let[a,o]of e.split(/\r\n|\n|\r/u).entries()){let e=o.trim();if(!e)continue;let s=a+1,c=o.indexOf(e)+1,u=ee(e,r?.kind),d=v(s,c,e);if(u?.kind===`phase`){let[e]=l(u.label),t=r?.kind===`excluded`&&!u.markdown&&!/安排|阶段|规则|通知|流程/u.test(u.label);e&&!t&&(n={stage:e,reference:d,depth:u.markdown?u.depth:0},r=null,i=null)}else if(u?.kind===`subsection`)i={...u,reference:d};else if(u){let e=_(u.label);(!e&&n?.depth&&u.markdown&&u.depth<=n.depth||/^通用/u.test(u.label))&&(n=null),r={...u,reference:d,stage:e},i=null}let f=_(e)??r?.stage??n?.stage??`general`,p=f===n?.stage?n.reference:f===r?.stage?r.reference:null,m=i?.label??r?.label;t.push({line:s,column:c,text:e,stage:f,...p&&{stageHeading:p},...m&&{section:m},...i&&{subsection:i.label},isHeading:!(!u||u.hasBody),sectionKind:r?.kind??``})}return t}function ne(e,t){let n=_(t)??e.stage;return{stage:n,...e.section&&{section:e.section},...e.stageHeading&&n===e.stage&&{stageHeading:e.stageHeading}}}function re(e,t){return t===`all`||e===`general`||e===t}var ie=`modulepreload`,ae=function(e,t){return new URL(e,t).href},oe={},se=function(e){return e.pathname.endsWith(`.css`)},ce=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},le=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=ae(t,n);let r=s(t),i=se(r);return ce(oe,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:ie,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{let i=a=>{t.removeEventListener(`load`,i),t.removeEventListener(`error`,i),a.type===`error`?n(Error(`Unable to preload CSS for ${r}`)):e(a)};t.addEventListener(`load`,i),t.addEventListener(`error`,i)})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},ue=[{id:`eligibility`,title:`参赛资格`,clue:`在校 学生 学籍 本科 专科 研究生 高校 院校 身份 专业`,projectMatches:/学籍|在校(?:学生|生)|在读|全日制|本科生|专科生|研究生|enrolled|full.time/iu,matches:/参赛对象|参赛资格|报名资格|正式学籍|正式全日制学籍|仅限.{0,20}(?:学生|高校|院校|职业|年龄)|(?:在校|全日制|本专科|本科|高职|研究生).{0,16}(?:学生|学籍|在校生|参赛|均可|报名)|(?:学生|学籍|院校).{0,20}(?:方可参赛|方可报名|均可参赛)|eligib(?:ility|le)|enrolled students/iu,suggestion:`核对成员身份、学籍及所属组别，并保留证明材料。`},{id:`team`,title:`组队要求`,clue:`队员 成员 组队 人数 指导老师 指导教师 独立参赛`,projectMatches:/单人|独立(?:参赛|完成|开发)|个人(?:赛|为单位|参赛)|[0-9一二三四五六七八九十两]+\s*(?:名|人|位).{0,12}(?:学生|队员|成员)|(?:队员|成员|团队|队伍).{0,14}(?:[0-9一二三四五六七八九十两]+\s*(?:名|人|位)|指导)|guid(?:ance|ing) teacher|team.{0,16}\d+/iu,matches:/组队要求|团队人数|队伍人数|个人赛|个人(?:为)?单位|单人参赛|指导(?:老师|教师)|每(?:支队伍|队伍|队|组|个团队).{0,18}(?:[0-9一二三四五六七八九十两]+\s*(?:人|名|位)|成员|队员)|(?:团队|队伍|组队|队员|成员).{0,20}[0-9一二三四五六七八九十两]+\s*(?:人|名|位)|(?:仅限|允许|可)(?:单人|个人|跨校|跨专业).{0,12}(?:参赛|组队)|(?:team|group).{0,20}(?:members?|participants?)/iu,suggestion:`确认个人参赛或团队人数、组队范围和指导教师安排。`},{id:`division`,title:`参赛组别`,clue:`组别 研究生组 本科组 高职组 专科组 学校`,projectMatches:/组别|研究生组|本科组|高职组|专科组|[ABC]\s*组|全日制|院校类型|division/iu,matches:/参赛组别|组别划分|按.{0,15}(?:学校|学籍|学历|院校).{0,10}分组|研究生组|本科组|高职组|(?:\b[ABC]\s*组.{0,25}){2}|competition division/iu,suggestion:`根据学籍和院校类型确认所属组别。`},{id:`originality`,title:`原创与权属`,clue:`原创 著作权 知识产权 开源 授权 许可 抄袭 数据`,projectMatches:/原创|原创性|首创|著作权|知识产权|开源|非原创|授权|许可|自主(?:实现|设计|开发)|open.source|licen[sc]e|copyright/iu,matches:/原创|知识产权|著作权|版权|权属|抄袭|剽窃|重复(?:参赛|获奖)|previously (?:submitted|awarded)|plagiarism|copyright|intellectual property|original work/iu,suggestion:`确认作品、数据和素材的来源，以及对应的许可或授权。`},{id:`development`,title:`开发方式`,clue:`Vibe Coding AI编程 提示词 prompt 生成 大模型 编程工具 手写`,projectMatches:/vibe[\s-]*coding|\bAI\b|大模型|编程工具|提示词|\bprompt\b|手(?:动编写|写).{0,8}(?:程序|代码)/iu,matches:/vibe[\s-]*coding|氛围编程|自然语言编程|(?:必须|须|不得|禁止|需|要求).{0,26}(?:AI.{0,7}编程|人工智能.{0,7}编程|编程工具|大模型|手写.{0,4}代码|手动.{0,4}编码|手动编写.{0,4}代码)|(?:AI|大模型).{0,20}(?:生成代码|辅助开发|驱动开发|编写代码)|(?:AI[- ]assisted|AI[- ]generated) (?:development|coding|code)/iu,suggestion:`核对允许的开发方式和工具，检查过程记录能否对应实现。`},{id:`deadline`,title:`报名与投递时间`,clue:`报名 截止 时间 逾期 北京时间 时区`,projectMatches:/截止|逾期|时区|北京时间|\d{4}[-/.年]\s*\d{1,2}[-/.月]|\d{1,2}\s*月\s*\d{1,2}\s*(?:日|号)|\d{1,2}:\d{2}|(?:已|尚未|尚待).{0,5}(?:完成报名|赛事投递)|deadline|submi\w* (?:before|by)/iu,matches:/截止|(?:报名|提交|上传|投递)(?:时间|日期|期限)|(?:逾期|超过时限).{0,15}(?:不予|无效|不得)|deadline|due (?:by|on)|submi[ts].{0,10}(?:before|by)/iu,suggestion:`核对日期、时区、平台状态以及报名与作品提交的各自截止时间。`},{id:`publication`,title:`仓库公开要求`,clue:`仓库 公开 开源 GitHub Gitee 仓库链接`,projectMatches:/仓库|\b(?:GitHub|Gitee|GitLab)\b|repositor(?:y|ies)/iu,matches:/(?:公开|公共|开源).{0,28}仓库|仓库.{0,14}(?:公开|公共|可访问|开源|开放评审权限)|public (?:code )?repositor(?:y|ies)/iu,suggestion:`用未登录窗口确认仓库和所需证据可访问。`}],de=[{id:`repository`,title:`代码仓库链接`,matches:/(?:GitHub|Gitee|GitLab).{0,15}(?:仓库|地址|链接)|(?:代码|源码|项目|公开|开源).{0,5}仓库|仓库(?:地址|链接)|(?:repository|repo) (?:URL|link)/iu},{id:`source-code`,title:`项目源代码`,matches:/源代码|项目代码|源码(?:包)?|代码压缩包|source code/iu},{id:`project-doc`,title:`项目说明文档`,matches:/作品说明(?:书|文档)?|项目说明(?:书|文档)?|项目文档|使用手册|project documentation/iu},{id:`readme`,title:`README 复现指南`,matches:/\bREADME\b|(?:快速|项目|操作|安装)复现(?:指南|说明)/iu},{id:`technical-doc`,title:`技术文档`,matches:/技术(?:说明|文档)|technical documentation/iu},{id:`report`,title:`作品报告`,matches:/项目报告|技术报告|作品报告|设计报告|调研报告|项目计划书|实施方案|项目方案|论文|\breport\b/iu},{id:`slides`,title:`展示幻灯片`,matches:/(?:答辩|演示|汇报|展示)(?:材料|文稿|课件|幻灯片)|\bPPTX?\b|幻灯片|slides/iu},{id:`demo-video`,title:`演示视频`,matches:/(?:演示|展示|讲解|介绍|录屏)(?:视频|录像)|视频(?:时长|文件|演示|链接)|视频|(?:demo|presentation) video/iu},{id:`live-demo`,title:`在线演示链接`,matches:/(?:线上|在线|公开|部署|体验|访问|演示)(?:地址|链接|网址)|可访问的(?:网站|网页)|live demo|deployed (?:URL|link)/iu},{id:`screenshots`,title:`作品截图`,matches:/截图(?:材料)?|界面图|screenshots?/iu},{id:`git-history`,title:`Git 提交历史`,matches:/\bgit\b.{0,18}(?:历史|提交|commit)|(?:细粒度|历史)提交(?:历史|记录)/iu},{id:`prompt-history`,title:`Prompt 迭代记录`,matches:/提示词|\bPrompt\b.{0,8}(?:迭代|记录|链路|日志|历史|history|logs?)|交互(?:记录|截图)|对话(?:过程|记录|日志|截图)/iu},{id:`process`,title:`开发过程记录`,matches:/开发(?:过程|日志|记录)|创作过程|生成(?:过程|记录)|Vibe\s*Coding.{0,8}(?:过程|记录)/iu},{id:`application`,title:`报名与提交表单`,matches:/报名表|报名信息|作品信息表|参赛登记表|申报(?:书|表)|提交表单|application form/iu},{id:`declaration`,title:`原创声明或承诺书`,matches:/原创(?:声明|承诺书)|诚信承诺书|授权书|承诺书|declaration of originality/iu},{id:`identity-proof`,title:`资格证明材料`,matches:/学籍证明|学生证|在读证明|身份(?:证件|证明)|资格证明/iu},{id:`package`,title:`作品运行包`,matches:/可执行(?:程序|文件)|安装包|运行包|发布包|项目压缩包|作品压缩包|executable(?: file)?/iu}],fe=/提交(?:物|材料|文件|要求|内容)|交付(?:物|材料|文件|清单|要求)|作品(?:材料|文件|提交要求)|材料清单|需(?:要|另)?(?:提供|提交|上传|附)|(?:必须|应当|须|统一|请)(?:同时|一并|附带)?(?:提交|提供|上传|附上)|(?:提交|上传|提供|附上|附带|包含|包括)[：:\s]|\b(?:submit|deliverables?|must include|required files)\b/iu,pe=/^(?:提交|提供|上传|附上|附带|交付)/u,me=/必须|不得|禁止|不能|只能|仅限|仅可|须|应当|需|限于|要求|方可|must|only|required|shall|prohibited/iu,he=/可选|选填|非必(?:需|须|填)|不强制|(?:^|[（(，,；;：:])\s*(?:建议|鼓励)(?:[：:\s]|提交|上传|提供|附)|(?:可|可以|允许)(?:同时|自愿|额外)?(?:提交|上传|附上)|举例|例如|仅供参考|optional|encouraged|may (?:submit|include)/iu,ge=/^(?:[-*+•]|[（(]?[0-9一二三四五六七八九十]+[.、)）])\s*/u,_e=/必须|须|应|至少|至多|不超过|保留|完整|包含|上限|\d\s*(?:条|页|分钟)|must|required/iu,ve=new Set(`是否.哪些.什么.怎样.如何.可以.需要.必须.有关.关于.要求.参赛.作品.项目.材料.确认.赛规.一个.对于.相关.具备.the.for.and.with.how.what.when.of.to.must.should.need`.split(`.`)),ye=globalThis.Intl?.Segmenter?new Intl.Segmenter(`zh-CN`,{granularity:`word`}):null;function be(e){return e.normalize(`NFKC`).toLowerCase().replace(/\s+/gu,` `).trim()}function xe(e){return e.split(/\r\n?|\n/u).map((e,t)=>({line:t+1,text:e.trim()})).filter(({text:e})=>e)}function Se(e){return e.split(/(?<=[。！？；])|(?<=[，,])(?=\s*(?:也|另)?(?:建议|鼓励|可选|(?:可|可以|允许)(?:同时|自愿|额外)?(?:提交|上传|附上)))/u).map(e=>e.trim()).filter(Boolean)}function Ce(e){return ye?[...ye.segment(e)].filter(e=>e.isWordLike).map(e=>e.segment):(e.match(/[a-z0-9]+|\p{Script=Han}+/gu)??[]).flatMap(e=>/^\p{Script=Han}{3}/u.test(e)?Array.from({length:e.length-1},(t,n)=>e.slice(n,n+2)):[e])}function we(e,t,n){let r=be(t);if(!r)return[];let i=[...new Set(Ce(r))].filter(e=>(e.length>1||/^\d$/u.test(e))&&!ve.has(e)).slice(0,32),a=e.map(e=>({...e,normalized:be(e.text)})),o=i.map(e=>{let t=a.filter(({normalized:t})=>t.includes(e)).length;return[e,Math.log(1+(a.length-t+.5)/(t+.5))]});return a.map(({normalized:e,...t})=>{let n=e.includes(r)?3:0,i=o.reduce((t,[n,r])=>e.includes(n)?t+r:t,0);return{...t,score:n+i}}).filter(({score:e})=>e>0).sort((e,t)=>t.score-e.score||e.line-t.line).slice(0,n).map(({score:e,...t})=>({...t,score:Number(e.toFixed(3))}))}function Te(e,t){let n=2166136261;for(let e of be(t).replace(/^[#*\-•\d.、()（）\s]+/u,``))n=Math.imul(n^e.codePointAt(0),16777619);return`${e}-${(n>>>0).toString(36)}`}function Ee(e){return e.replace(/^(?:#{1,6}\s*|[-*+•]\s+|[（(]?[0-9一二三四五六七八九十]+[.、）)]\s*)+/u,``).replaceAll(`**`,``).trim()}function De(e,t){let n=de.filter(({matches:t})=>t.test(e));if(!t.subsection)return n;let r=de.filter(({matches:e})=>e.test(t.subsection));return r.length===1&&([`prompt-history`,`readme`].includes(r[0].id)||!n.length&&_e.test(e))?r:n}function Oe(e,t,n,r){let{text:i,line:a,column:o,...s}=t;for(let{id:c,title:l}of e){let e=r&&s.stage!==`general`?`${c}@${s.stage}`:c,u=n.get(e);u?(u.references.some(e=>e.line===a&&e.column===o)||u.references.push(t),!_e.test(u.quote)&&_e.test(i)&&Object.assign(u,{quote:i,line:a,column:o,...s})):n.set(e,{id:e,typeId:c,title:l,quote:i,line:a,column:o,...s,references:[t]})}}function ke(e,t=``,{scope:n=`all`}={}){let r=te(e),i=r.some(({sectionKind:e})=>e===`submission`),a=[`provincial`,`national`].every(e=>r.some(t=>t.stage===e)),o=xe(t).flatMap(({line:e,text:t})=>Se(t).map(t=>({line:e,text:t}))),s=new Map,c=new Map,l=[];for(let e of r){if(e.isHeading||e.sectionKind===`excluded`)continue;let{line:t,text:r}=e,u=e.sectionKind===`submission`,d=0;for(let f of Se(r)){let p=r.indexOf(f,d);d=p+f.length;let m=e.column+p,h=ne(e,f);if(!re(h.stage,n))continue;let g={text:f,line:t,column:m,...h};l.push(g);let ee=pe.test(Ee(f))||fe.test(f),_=he.test(Ee(f)),v=De(f,e);if(!_&&(u||!i)){let e=me.test(f)&&v.some(({id:e})=>e!==`process`);if(v.length&&(u||ee||e))Oe(v,g,c,a);else if(u&&ge.test(f)&&!v.length&&f.length<=45){let e=Ee(f).replace(/[：:。；;]$/u,``);Oe([{id:Te(`material`,f),title:e}],g,c,a)}}if(!_)for(let e of ue){if(!e.matches.test(f)||e.id===`development`&&!me.test(f)&&ee)continue;let n=Te(a&&h.stage!==`general`?`${e.id}@${h.stage}`:e.id,f);if(s.has(n))continue;let r=o.filter(({text:t})=>e.projectMatches.test(t)),[i]=we(r,e.clue,1);s.set(n,{id:n,title:e.title,quote:f,line:t,column:m,...h,suggestion:e.suggestion,evidence:i?.text??r[0]?.text??``})}}}let u=we(l,`参赛资格 报名 组队 人数 截止 原创 开发 提示词 交付 提交 视频 仓库`,5);return{gates:[...s.values()],materials:[...c.values()],excerpts:u}}function Ae(e){if(e[0]===255&&e[1]===254)return new TextDecoder(`utf-16le`).decode(e);if(e[0]===254&&e[1]===255)return new TextDecoder(`utf-16be`).decode(e);try{return new TextDecoder(`utf-8`,{fatal:!0}).decode(e)}catch{return new TextDecoder(`gb18030`,{fatal:!0}).decode(e)}}async function je(e){let[{getDocument:t,GlobalWorkerOptions:n},{default:r}]=await Promise.all([le(()=>import(`./pdf-CF1upwsF.js`),[],import.meta.url),le(()=>import(`./pdf.worker.min-CSU2zTEh.js`),[],import.meta.url)]);n.workerSrc=r;let i=t({data:e,isEvalSupported:!1,useWasm:!1}),a=[];try{let e=await i.promise;for(let t=1;t<=e.numPages;t+=1){let n=await e.getPage(t),{items:r}=await n.getTextContent(),i=``;for(let e of r)typeof e.str==`string`&&(i+=e.str,e.hasEOL&&(i+=`
`));i.trim()&&a.push(i.trimEnd()),n.cleanup()}}finally{await i.destroy()}return a.join(`

`)}async function Me(e){if(!e||typeof e.arrayBuffer!=`function`)throw Error(`请选择赛规文件。`);let t=e.name?.toLowerCase().match(/\.([a-z0-9]+)$/u)?.[1];if(![`txt`,`md`,`csv`,`json`,`pdf`].includes(t))throw Error(`请选择 TXT、MD、CSV、JSON 或 PDF。图片可转写后粘贴原文。`);if(e.size>20971520)throw Error(`赛规文件超过 20 MB。请保存为文字文件或粘贴相关条款。`);let n;try{let r=new Uint8Array(await e.arrayBuffer());n=t===`pdf`?await je(r):Ae(r)}catch{throw Error(t===`pdf`?`PDF 读取失败。请解锁文件、复制文字或粘贴赛规原文。`:`文本读取失败。请保存为 UTF-8 编码或粘贴赛规原文。`)}if(!n.trim()||n.includes(`\0`))throw Error(t===`pdf`?`PDF 没有可提取的文字。请转写扫描件后粘贴原文。`:`没有读到赛规文字。请检查文件内容或编码。`);return n}var Ne=[{id:`deadline-eligibility`,label:`截止与资格`,query:`报名和作品提交何时截止，需要核对哪些参赛资格？`},{id:`repo-process`,label:`仓库与开发证据`,query:`提交仓库需要哪些公开权限、Git 提交历史和 Prompt 迭代证据？`},{id:`deliverables`,label:`待补交付物`,query:`赛规要求提交哪些材料，项目摘要还有哪些准备情况需要确认？`},{id:`custom`,label:`自定义问题`,query:``}],Pe={"deadline-eligibility":[{id:`deadline`,label:`报名与交件时间`,rule:/截止|提交.{0,8}(?:时间|日期|期限)|报名时间|不予受理|逾期|deadline|due date/iu,project:/截止|前完成(?:报名|提交)|已报名|尚未报名|计划.{0,16}(?:交件|投递|报名)|已(?:交件|投递)|\d{1,2}\s*月\s*\d{1,2}\s*日|\d{4}-\d{1,2}-\d{1,2}|deadline/iu,keywords:`截止 报名时间 提交日期 交件 逾期 时区`,action:`向赛事平台核对报名与交件的截止时间、时区及入口，并记录团队的执行日期。`},{id:`eligibility`,label:`身份与组别`,rule:/正式学籍|全日制|在校生|在校学生|参赛(?:资格|对象|组别)|报名资格|研究生组|本科组|高职组|[ABC]\s*组|eligib(?:ility|le)/iu,project:/全日制|学籍|在读|在校(?:生|学生)|组别|本科生|专科生|研究生|[ABC]\s*组|enrolled/iu,keywords:`全日制 学籍 在校 参赛资格 组别 研究生 本科 高职`,action:`核对正式学籍和对应组别，记录适用条款及可提供的资格证明。`},{id:`team`,label:`个人或组队要求`,rule:/个人(?:赛|参赛|为单位)|单人参赛|团队人数|队伍人数|组队|每(?:队|组|支队伍).{0,14}(?:[0-9一二三四两]+\s*(?:人|名)|队员|成员)|team.{0,18}members?/iu,project:/个人(?:赛|参赛|为单位)|独立(?:参赛|完成|开发)|单人|团队.{0,12}[0-9一二三四两]+\s*(?:人|名|位)|[0-9一二三四两]+\s*(?:名|人|位).{0,8}(?:队员|成员)/iu,keywords:`个人参赛 独立开发 组队 成员 队员 人数`,action:`确认这次是个人还是团队投递，并校对报名名单与组队限制。`}],"repo-process":[{id:`repository`,label:`仓库与评审权限`,rule:/仓库|\bGitHub\b|\bGitee\b|repositor(?:y|ies)/iu,project:/仓库|\bGitHub\b|\bGitee\b|repositor(?:y|ies)/iu,keywords:`仓库 GitHub Gitee 公开 评审权限 开放访问`,action:`对照赛规核对仓库公开权限或评审访问授权，用未登录窗口或评审账号打开链接并记录结果。`},{id:`git-history`,label:`真实 Git 演进记录`,rule:/\bgit\b.{0,18}(?:历史|提交|commit)|细粒度.{0,10}提交|commit history/iu,project:/\bgit\b.{0,18}(?:历史|提交|commit)|(?:历史|版本|细粒度).{0,8}提交|commit history/iu,keywords:`Git 历史 提交记录 演进 细粒度 commit`,action:`复查真实提交历史，找出能对应核心功能演进的提交链接或记录。`},{id:`prompt-history`,label:`Prompt 迭代证据`,rule:/\bprompt\b|提示词|迭代链|AI 对话|对话(?:过程|记录|历史)/iu,project:/\bprompt\b|提示词|迭代链|AI 对话|对话(?:过程|记录|历史)/iu,keywords:`Prompt 提示词 AI对话 迭代链 开发过程`,action:`把原始提示、模型产出与后续修订对齐到核心功能，核对迭代链是否齐全。`},{id:`reproduction`,materialId:`readme`,label:`复现指南`,rule:/\bREADME\b|复现(?:指南|步骤|说明)|环境(?:变量模板|配置与依赖)/iu,project:/\bREADME\b|复现(?:指南|步骤|说明)|环境(?:变量模板|配置与依赖)/iu,keywords:`README 十分钟 复现指南 快速启动 环境配置 依赖`,action:`用干净环境按 README 安装依赖、配置变量并运行项目，记录复现耗时和运行结果。`}]},Fe={repository:`仓库 源代码 GitHub Gitee`,"source-code":`源代码 项目代码 源码`,"project-doc":`项目说明文档 作品说明 项目文档 使用手册`,readme:`README 复现指南`,"technical-doc":`技术文档 技术说明 PDF技术文档`,report:`作品报告 项目报告 技术报告 调研报告 论文`,slides:`PPT PPTX 幻灯片 答辩展示`,"demo-video":`演示视频 视频 录屏 MP4`,"live-demo":`在线演示 部署链接 线上演示 演示网址`,screenshots:`截图 界面图`,"git-history":`Git历史 Git提交 提交历史 提交记录`,"prompt-history":`Prompt 对话 提示词 迭代链`,process:`开发过程 开发记录 开发日志`,application:`报名表 参赛登记表 提交表单`,declaration:`原创声明 授权书 承诺书`,"identity-proof":`资格证明 学籍证明 在读证明 学生证`,package:`运行包 安装包 压缩包`},Ie={...Object.fromEntries(Pe[`repo-process`].map(({id:e,materialId:t,action:n})=>[t??e,n])),"demo-video":`对照原文核对时长、视频规格及是否需要展示协同过程，保存最终文件或评审链接。`,"technical-doc":`对照原文检查文档要求的格式、页数和章节，保存最终文件。`},Le=[[`截止`,`最后期限`,`最晚`,`最后一天`,`deadline`],[`资格`,`学籍`,`在校`,`全日制`,`eligible`],[`仓库`,`github`,`gitee`,`repository`,`repo`],[`提示词`,`prompt`,`迭代链`,`对话记录`],[`视频`,`录屏`,`mp4`,`video`],[`说明书`,`技术文档`,`技术报告`,`documentation`]],Re=new Set(`是否.如何.怎么.什么.多少.什么时候.时候.哪些.哪种.能否.可以.需要.请问.项目.赛规.作品.材料.符合.要求.提交.必须.当前.完成.团队.and.can.does.for.how.must.need.the.what.when.with.should`.split(`.`)),ze=Intl.Segmenter?new Intl.Segmenter(`zh-CN`,{granularity:`word`}):null,Be=520,Ve=/截止|截至|最后(?:一天|期限)|最晚|日期|时间|何时|什么时候|几点|哪天|deadline/iu,He=/\d{1,4}\s*[-./年]\s*\d{1,2}|\d{1,2}\s*月\s*\d{1,2}\s*(?:日|号)|[0-9一二三四五六七八九十]+(?:个)?(?:天|日|周|小时)内|截止.{0,24}(?:待定|另行|公告|通知|公布)/u,Ue=/交件|投递|作品.{0,8}(?:提交|截止)|提交.{0,8}(?:作品|截止|时间|日期)|交稿|上传作品/u,We=/报名|注册/u;function Ge(e){return e.normalize(`NFKC`).toLowerCase().replace(/\s+/gu,` `).trim()}function Ke(e,t){return(e===`rule`?te(t).filter(({isHeading:e})=>!e):t.split(/\r\n|\n|\r/u).map((e,t)=>({text:e,line:t+1,column:1}))).flatMap(t=>[...t.text.matchAll(/[^。！？；]+[。！？；]*/gu)].flatMap(n=>{let r=n[0].trim();if(!r)return[];let i=n.index+n[0].indexOf(r),a=e===`rule`?ne(t,r):{},o=[];for(let n=0;n<r.length;n+=450){let s=r.slice(n,n+Be),c=t.line,l=t.column+i+n;if(o.push({id:`${e}-${c}-${l}`,source:e,line:c,column:l,text:s,...a,normalized:Ge(s)}),n+Be>=r.length)break}return o}))}function qe(e){return(ze?[...ze.segment(e)].filter(e=>e.isWordLike).map(e=>e.segment):e.match(/[a-z0-9]+|\p{Script=Han}+/gu)??[]).filter(e=>(e.length>1||/^\d$/u.test(e))&&!Re.has(e))}function Je(e){let t=Ge(e),n=new Map(qe(t).map(e=>[e,1]));for(let e of t.match(/[\p{Script=Han}]{2,}|[a-z][a-z0-9#+.-]*/gu)??[])if(!Re.has(e)&&(e.length<=10&&n.set(e,1.8),/^\p{Script=Han}{3}/u.test(e)))for(let t=0;t<e.length-1;t+=1){let r=e.slice(t,t+2);!Re.has(r)&&!n.has(r)&&n.set(r,.34)}for(let e of Le)if(e.some(e=>t.includes(e)))for(let t of e)n.has(t)||n.set(t,.7);return[...n].sort((e,t)=>t[1]-e[1]).slice(0,40)}function Ye(e){if(!/^[a-z][a-z0-9#.+-]*$/u.test(e))return t=>t.includes(e);let t=e.replace(/[.*+?^$(){}|[\]\\]/gu,`\\$&`),n=RegExp(`(?:^|[^a-z0-9])${t}(?=$|[^a-z0-9])`,`u`);return e=>n.test(e)}function y(e,t,n){let r=Ge(t),i=Ye(r),a=Je(r).map(([t,n])=>{let r=Ye(t),i=e.reduce((e,t)=>e+Number(r(t.normalized)),0);return[r,n,Math.log1p((e.length-i+.5)/(i+.5))]});return e.flatMap(({normalized:e,...t})=>{let n=a.filter(([t])=>t(e)),o=!!(r&&i(e)),s=n.some(([,e])=>e>=.7);if(!o&&!s&&n.length<2)return[];let c=n.reduce((e,[,t,n])=>e+t*n,0),l=(o?4:0)+c/(1+Math.max(0,e.length-120)/600);return l<=0?[]:[{...t,score:Number(l.toFixed(3))}]}).sort((e,t)=>t.score-e.score||e.line-t.line||e.column-t.column).slice(0,n)}function Xe({normalized:e,...t}){return{...t,score:1}}function Ze({preset:e,query:t,scope:n,resolvedScopes:r,ruleExcerpts:i,projectExcerpts:a,missing:o,suggestions:s}){let c=e=>[...new Map(e.map(e=>[e.id,e])).values()];return{preset:e,query:t,scope:n,resolvedScopes:r,ruleExcerpts:c(i),projectExcerpts:c(a),missing:o,suggestions:s}}function Qe(e,t,n){for(let r of Pe[e.preset]){let i=t.filter(({text:t,stage:n})=>r.rule.test(t)&&(r.id!==`deadline`||!e.resolvedScopes.length||He.test(t)&&(e.resolvedScopes.includes(n)||l(t).length===2))),a=n.filter(({text:e})=>r.project.test(e)),o=y(i,r.keywords,2),s=y(a,r.keywords,2);!o.length&&i.length&&o.push(Xe(i[0])),!s.length&&a.length&&s.push(Xe(a[0])),e.ruleExcerpts.push(...o),e.projectExcerpts.push(...s),o.length?(s.length||e.missing.push(`项目摘要暂无「${r.label}」的明确线索。`),e.suggestions.push({id:r.id,title:`核对${r.label}`,description:r.action,ruleRefs:o.map(({id:e})=>e),projectRefs:s.map(({id:e})=>e)})):e.missing.push(`赛规中未定位到「${r.label}」条款。`)}}function $e(e,t,n,r){let{materials:i}=ke(t,``,{scope:e.scope});if(!i.length){e.missing.push(`赛规中未定位到明确的交付物条款。可改用自定义问题查找原文。`);return}let a=[],o=Map.groupBy?Map.groupBy(n,({line:e})=>e):n.reduce((e,t)=>{let n=e.get(t.line)??[];return n.push(t),e.set(t.line,n)},new Map);for(let t of i){let n=t.references.flatMap(e=>{let t=o.get(e.line)??[],n=t.find(({text:t,column:n})=>n<=e.column&&e.column<n+t.length&&t.includes(e.text))??t.find(({text:t,column:n})=>e.column<=n&&n<e.column+e.text.length&&e.text.includes(t));return n?[Xe(n)]:[]});if(!n.length)continue;let i=Fe[t.typeId]??t.title,s=i.split(` `).map(e=>Ye(Ge(e))),c=y(r.filter(({normalized:e})=>s.some(t=>t(e))),i,1),l=Ie[t.typeId]??`对照赛规核实准备情况，记录交付链接或文件。`;c.length||a.push(t.title),e.ruleExcerpts.push(...n),e.projectExcerpts.push(...c),e.suggestions.push({id:t.id,title:`核对${t.title}`,description:l,ruleRefs:[...new Set(n.map(({id:e})=>e))],projectRefs:c.map(({id:e})=>e)})}a.length&&e.missing.push(`项目摘要暂无明确线索：${a.join(`、`)}。`)}function et(e,t,n){let r=e.filter(e=>re(e.stage,t));if(!Ve.test(n))return r;let i=Ue.test(n),a=We.test(n);return r.filter(({stage:e,text:n})=>He.test(n)&&(e===t||l(n).length===2)&&(!i||a||Ue.test(n))&&(!a||i||We.test(n)))}function tt(e,t,n){if(!e.query){e.missing.push(`输入问题后，可在赛规和项目摘要中检索相关原文。`);return}let r=y(n,e.query,3);e.projectExcerpts.push(...r);for(let n of e.resolvedScopes.length?e.resolvedScopes:[`all`]){let i=y(n===`all`?t:et(t,n,e.query),e.query,e.resolvedScopes.length>1?3:5),a=c[n];i.length?(e.ruleExcerpts.push(...i),e.suggestions.push({id:n===`all`?`custom-review`:`custom-review@${n}`,title:`核对${a??``}：${e.query.slice(0,42)}`,description:`对照命中条款和摘要片段，写下待确认事项及需要补充的材料。`,ruleRefs:i.slice(0,3).map(({id:e})=>e),projectRefs:r.slice(0,2).map(({id:e})=>e)})):e.missing.push(a?`赛规中未定位到明确适用于${a}的条款。请核对该阶段的官方通知。`:`赛规中未找到与该问题匹配的条款，建议换用赛规里的关键词。`)}if(e.resolvedScopes.length>1){let n=y(t.filter(({stage:e})=>e===`mixed`),e.query,2);e.ruleExcerpts.push(...n),n.length&&e.suggestions.push({id:`custom-review@mixed`,title:`对照同条原文中的两个阶段`,description:`按原文逐项对应省赛和国赛的条件，记录各自适用范围。`,ruleRefs:n.map(({id:e})=>e),projectRefs:[]})}r.length||e.missing.push(`项目摘要中暂无与该问题匹配的明确线索。`)}function nt({ruleText:e=``,projectSummary:t=``,preset:n=`custom`,query:r=``,scope:i=`all`}={}){let a=Ne.find(({id:e})=>e===n)??Ne.at(-1),o=u(i)?i:`all`,s=a.id===`custom`?r.trim():a.query,c=a.id===`custom`?l(s):[],d={preset:a.id,query:s,scope:o,resolvedScopes:o===`all`?c:[o],ruleExcerpts:[],projectExcerpts:[],missing:[],suggestions:[]};if(o!==`all`&&c.some(e=>e!==o))return d.missing.push(`所选阶段与问题中提到的阶段不一致。请调整所选阶段或问题内容。`),Ze(d);let f=Ke(`rule`,e).filter(({stage:e})=>re(e,o)),p=Ke(`project`,t);return Pe[d.preset]?Qe(d,f,p):d.preset===`deliverables`?$e(d,e,f,p):tt(d,f,p),Ze(d)}var rt=`具有正式全日制学籍的研究生、本科及高职高专学生可以参赛，以个人为单位参赛。
报名时按学籍和学校类型选择研究生组、A 组、B 组或 C 组。
参赛作品须为原创，严禁直接包装已有开源项目。
开发过程必须使用 AI 辅助编程工具，且能够复现。`,it=`提交公开 GitHub 或 Gitee 代码仓库，也可对评审开放访问。
Git 历史须细粒度提交，禁止一次提交包含全部功能。
提交 AI 对话 Prompt 历史，须涵盖至少三个核心功能的完整迭代链。
提供 README 十分钟复现指南，含环境配置、依赖和环境变量模板。
提交 5–8 分钟的 1080p MP4 演示视频，至少 2 分钟展示 AI 协同复现。
提交不超过 30 页的技术文档 PDF，阐述意图控制、系统架构与可复现性。`,at=`省赛报名及提交均截止 2026-11-18，缴费后登录个人中心查看作品提交入口。`,ot={competition:`第九届传智杯 · AI创新应用挑战赛`,source:`https://www.boxuegu.com/matchTrack/detail/?id=10039`,project:`实验室预约小助手（虚构示例）`,rule:`第九届传智杯 · AI创新应用挑战赛（根据官方页面人工摘编）
${rt}
${at}
${it}`,summary:`本例为虚构学生项目，帮助同学查询实验室空闲时段并提交预约。设定为一名全日制本科生独立开发，具体报名组别有待核对。使用 AI 辅助编程工具生成预约流程，保留了部分 Prompt 对话。仓库目前为私有，README 已起草，演示视频和技术文档尚未完成。`},st={...ot,rule:`第九届传智杯 · AI创新应用挑战赛（赛段示例，根据官方页面人工摘编）
## 通用参赛要求
${rt}

## 省赛安排
### 时间安排
${at}
### 作品提交要求
${it}
### 奖项设置
获得省赛一、二、三等奖的参赛者可晋级国赛。
### 评审标准
评审中，过程可复现性占 25%。

## 国赛安排
### 时间安排
国赛报名时间为 2026-12-10 至 2026-12-21。
国赛作品提交截止 2026-12-27。
### 作品提交要求
${it}
### 奖项设置
国赛设一、二、三等奖及优秀奖。
### 评审标准
评审中，过程可复现性占 25%。`},b=[`competition`,`source`,`rule`,`project`,`summary`],x={pending:`待确认`,pass:`符合`,fail:`不符合`},ct={pending:`待开始`,active:`进行中`,done:`已完成`},S={all:`全部阶段`,provincial:`省赛`,national:`国赛`},lt={provincial:`省赛`,national:`国赛`,general:`通用`,mixed:`跨赛段`};function ut(){return{version:1,stage:`intake`,scope:`all`,draft:Object.fromEntries(b.map(e=>[e,``])),fileName:``,sample:!1,analysis:null,checklist:null,submissionReview:null}}function C(e){return Object.hasOwn(S,e.scope)?e.scope:`all`}function dt(e,t){let n=C(e);if(n===t||!Object.hasOwn(S,t))return!1;let r=e.scopeWorkspaces??={};r[n]={analysis:e.analysis,checklist:e.checklist,submissionReview:e.submissionReview};let i=r[t];return e.scope=t,e.analysis=i?.analysis??null,e.checklist=i?.checklist??null,e.submissionReview=i?.submissionReview??null,delete r[t],!0}function ft(e,t){let n=C(t);return n!==`all`&&e.push(n),JSON.stringify(e)}function pt(e){return ft(b.map(t=>t===`rule`?e.draft[t]:e.draft[t].trim()),e)}function mt(e){let{competition:t,source:n,project:r}=e.draft;return ft([t.trim(),n.trim(),r.trim()],e)}function w(e){return e.analysis?.fingerprint===pt(e)}function ht(e){return JSON.stringify([e.analysis.fingerprint,e.analysis.gates.map(e=>[e.key,e.status])])}function T(e){return w(e)&&e.checklist?.signature===ht(e)&&(!e.checklist.items.some(e=>e.kind===`review`)||E(e,e.checklist))}function E(e,t){return!!(t&&e.analysis&&t.fingerprint===e.analysis.fingerprint&&t.sourceSummary===e.draft.summary)}function D(e){return w(e)&&E(e,e.submissionReview)?e.submissionReview:null}function gt(e,t){let n=e.submissionReview;return typeof n?.sourceSummary==`string`?D(e)?t&&(n.result.preset!==t.preset||t.preset===`custom`&&n.result.query!==t.query.trim())?`question-changed`:`ready`:`stale`:`empty`}function _t(e,t){return w(e)?(e.submissionReview={fingerprint:e.analysis.fingerprint,sourceSummary:e.draft.summary,result:t,model:null},e.submissionReview):null}function vt(e){let t=D(e);if(!t)return[];let{result:n,model:r}=t,i=new Map([...n.ruleExcerpts,...n.projectExcerpts].map(e=>[e.id,e])),a=n.suggestions.map(e=>({id:e.id,title:e.title,description:e.description,mode:`local`,citations:[...e.ruleRefs,...e.projectRefs].map(e=>i.get(e)).filter(Boolean)}));return r?.citations.length&&a.push({id:`model-review`,title:`跟进模型复核 · ${n.query}`.slice(0,180),description:r.answer,mode:`model`,citations:r.citations}),a.map(e=>({...e,key:JSON.stringify([n.preset,n.query,e.mode,e.id,e.title,e.description,e.citations.map(({source:e,line:t,column:n,text:r})=>[e,t,n,r])])}))}function yt(e,t){let n=D(e);if(!n)return 0;let r=new Set(t),i=vt(e).filter(e=>r.has(e.key));if(!i.length)return 0;T(e)||Ct(e);let a=new Set(e.checklist.items.map(e=>e.key)),o=[];for(let e of i){let t=`review:${e.key}`;a.has(t)||(a.add(t),o.push({key:t,title:e.title,kind:`review`,question:n.result.query,reviewMode:e.mode,description:e.description,citations:e.citations,quote:``,line:null,owner:``,note:``,status:`pending`}))}return e.checklist.items.unshift(...o),o.length}function bt(e){return JSON.stringify(e.stage&&e.stage!==`general`?[e.title,e.quote,e.stage]:[e.title,e.quote])}function xt(e,t){let n=e.analysis,r=pt(e),i=mt(e),a=n?.workspace===i,o=n?.fingerprint===r,s=new Map(o?n.gates.map(e=>[e.key,e]):[]),c=new Map;for(let e of t.gates){let t=bt(e);if(c.has(t))continue;let n=s.get(t);c.set(t,{...e,key:t,status:n?.status??`pending`,note:n?.note??``,manual:!1})}let l=a?n.gates.filter(e=>e.manual):[];e.analysis={fingerprint:r,workspace:i,gates:[...c.values(),...l.map(e=>o?e:{...e,status:`pending`,note:``})],materials:t.materials,excerpts:t.excerpts}}function St(e,t,n){w(e)&&t.trim()&&e.analysis.gates.push({key:`manual:${crypto.randomUUID()}`,title:t.trim(),quote:n.trim(),line:null,suggestion:``,evidence:``,status:`pending`,note:``,manual:!0,stage:C(e)===`all`?`general`:C(e)})}function Ct(e){if(!w(e))return;let t=e.checklist,n=mt(e),r=t?.workspace===n,i=new Map(r?t.items.map(e=>[e.key,e]):[]),a=new Map,o=(e,t,n,r)=>{let o=i.get(e),{quote:s,line:c,column:l,stage:u,section:d,references:f}=r;a.set(e,{key:e,title:t,kind:n,quote:s,line:c,column:l,stage:u,section:d,references:f,owner:o?.owner??``,note:o?.note??``,status:o?.status??`pending`})};for(let t of e.analysis.materials)o(`material:${bt(t)}`,t.title,`material`,t);for(let n of e.analysis.gates){if(n.status===`pass`)continue;let r=n.status===`fail`?`处理阻塞`:`确认门槛`,a=`gate:${n.status}:${n.key}`;t?.fingerprint!==e.analysis.fingerprint&&i.delete(a),o(a,`${r} · ${n.title}`,`gate`,n)}let s=r?t.items.filter(e=>e.kind===`manual`):[],c=r&&E(e,t)?t.items.filter(e=>e.kind===`review`):[];e.checklist={workspace:n,fingerprint:e.analysis.fingerprint,sourceSummary:e.draft.summary,signature:ht(e),items:[...c,...a.values(),...s]}}function wt(e,t){T(e)&&t.trim()&&e.checklist.items.push({key:`manual:${crypto.randomUUID()}`,title:t.trim(),kind:`manual`,quote:``,line:null,owner:``,note:``,status:`pending`})}function Tt(e){let t=w(e)?e.analysis.gates:[],n=T(e)?e.checklist.items:[];return{gateTotal:t.length,passed:t.filter(e=>e.status===`pass`).length,blocked:t.filter(e=>e.status===`fail`).length,pending:t.filter(e=>e.status===`pending`).length,taskTotal:n.length,completed:n.filter(e=>e.status===`done`).length}}function O(e){return String(e??``).replace(/([\\`*_{}.\[\]()#+!|<>-])/g,`\\$1`).replace(/\r?\n/g,` `)}function Et(e){return e.line?Dt(e):e.manual||e.kind===`gate`||e.kind===`manual`?`手动补录`:`赛规摘录`}function Dt(e){return`${e.source===`project`?`项目摘要`:`赛规`}第 ${e.line} 行`}function k(e){let t=lt[e.stage];return t?`（${t}${e.section?` · ${O(e.section)}`:``}）`:``}function Ot(e){if(!T(e))return``;let{draft:t,analysis:n,checklist:r}=e,i=[`# ${O(t.competition)} 投递清单`,``,`- 项目：${O(t.project)}`,`- 核验赛段：${S[C(e)]}`];t.source&&i.push(`- 赛规来源：${O(t.source)}`),e.sample&&i.push(`- 工作台曾载入演示样例，请按当前资料核对内容。`),i.push(``,`## 门槛核验`,``),n.gates.length||i.push(`暂无可辨识或手动录入的门槛。`);for(let e of n.gates)i.push(`- **${O(e.title)}** · ${x[e.status]}`),e.quote&&i.push(`  - ${Et(e)}${k(e)}：${O(e.quote)}`),e.note&&i.push(`  - 核验备注：${O(e.note)}`);i.push(``,`## 投递任务`,``),r.items.length||i.push(`暂无任务。`);for(let e of r.items){let t=e.status===`done`?`x`:` `;i.push(`- [${t}] ${O(e.title)} · ${ct[e.status]}`),e.owner&&i.push(`  - 负责人：${O(e.owner)}`),e.note&&i.push(`  - 备注：${O(e.note)}`),e.quote&&i.push(`  - ${Et(e)}${k(e)}：${O(e.quote)}`);for(let t of e.references??[])(t.line!==e.line||t.text!==e.quote)&&i.push(`  - ${Et(t)}${k(t)}：${O(t.text)}`);if(e.kind===`review`){i.push(`  - 复核来源：${e.reviewMode===`model`?`模型复核`:`本地证据复核`}`),i.push(`  - 复核问题：${O(e.question)}`),e.description&&i.push(`  - 复核建议：${O(e.description)}`);for(let t of e.citations)i.push(`  - ${Dt(t)}${k(t)}：${O(t.text)}`)}}return`${i.join(`
`)}\n`}var kt=`entryflow-workspace-v1`,At=15e4,jt={intake:{title:`竞赛投递工作台`,description:`录入赛规和项目摘要，开始准备这次投递。`},review:{title:`核验门槛`,description:`对照赛规出处与项目信息，逐条确认参赛要求。`},checklist:{title:`投递清单`,description:`跟进材料、负责人和待处理要求，随时导出当前进度。`}},A=document.querySelector(`#app`);A.innerHTML=o();var j=A.querySelector(`#stage-content`),M=A.querySelector(`#stage-aside`);r(j);var Mt=document.createElement(`div`);Mt.className=`visually-hidden`,Mt.setAttribute(`role`,`status`),A.append(Mt);var N=!0,P=Pt(),F=``,I=``,L=!1,R=0,Nt=!1,z=null;function Pt(){try{let e=JSON.parse(localStorage.getItem(kt));if(e?.version===1&&Object.hasOwn(jt,e.stage)&&b.every(t=>typeof e.draft?.[t]==`string`))return e}catch{N=!1}return ut()}function B(){try{localStorage.setItem(kt,JSON.stringify(P)),N=!0}catch{N=!1}Ft()}function Ft(){let e=A.querySelector(`#save-status`),t=N?`自动保存到本设备`:`本设备暂无法保存`;e.textContent!==t&&(e.textContent=t),e.dataset.status=N?``:`error`}function V(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function H(e){try{let t=new URL(e);if(t.protocol===`http:`||t.protocol===`https:`)return t.href}catch{return``}return``}function U(e,t=`neutral`){return`<span class="badge badge-${t}">${V(e)}</span>`}function W(e,t,{symbol:r,style:i=`secondary`,disabled:a=!1}={}){return`<button class="button button-${i}" type="button" data-action="${t}" ${a?`disabled`:``}>
    ${r?n(r,16):``}${e}
  </button>`}function It(e,t){return Object.entries(e).map(([e,n])=>`<option value="${e}" ${t===e?`selected`:``}>${n}</option>`).join(``)}function G(e,t,n,r=``){return`<section class="panel">
    <header class="panel-header"><h2>${e}</h2>${t?`<p>${t}</p>`:``}</header>
    <div class="panel-body">${n}</div>
    ${r?`<div class="panel-actions">${r}</div>`:``}
  </section>`}function K(e,t,r=``){return`<div class="empty-state">
    ${n(`layers`,24)}
    <h3>${e}</h3>
    <p>${t}</p>
    ${r}
  </div>`}function q(e){Mt.textContent=e}function J(){let e=Tt(P),t={intake:w(P),review:e.gateTotal>0&&e.passed===e.gateTotal,checklist:e.taskTotal>0&&e.completed===e.taskTotal&&e.gateTotal>0&&e.passed===e.gateTotal};for(let e of A.querySelectorAll(`button[data-stage]`)){let n=e.dataset.stage;e.classList.toggle(`is-active`,n===P.stage),e.classList.toggle(`is-done`,t[n]),n===P.stage?e.setAttribute(`aria-current`,`step`):e.removeAttribute(`aria-current`)}}function Y({focus:e=!1}={}){let{title:t,description:n}=jt[P.stage],r=A.querySelector(`#stage-title`);r.textContent=t,r.tabIndex=-1,A.querySelector(`#stage-description`).textContent=n,Ft(),J();let i=j.parentElement,a=P.stage===`checklist`;i.classList.toggle(`is-checklist`,a),a&&i.firstElementChild!==M&&j.before(M),!a&&i.firstElementChild!==j&&M.before(j),P.stage===`intake`?(j.innerHTML=Rt(),j.querySelector(`#rule`).value=P.draft.rule,j.querySelector(`#summary`).value=P.draft.summary,zt()):P.stage===`review`?(j.innerHTML=Ht(),M.innerHTML=Wt(),Gt()):(j.innerHTML=tn(),nn()),e&&r.focus()}function X(e,{focus:t=!0}={}){P.stage=e,B(),Y({focus:t})}function Lt(){if(!P.sample)return``;let e=P.sampleKind===`stages`?st:ot;return U(b.every(t=>P.draft[t]===e[t])?`官方赛规摘编 · 虚构项目`:`示例资料已修改`)}function Rt(){let{draft:e,fileName:t}=P;return`<form id="intake-form" class="panel-stack">${G(`赛规资料`,`填写赛事信息，粘贴或导入赛规原文。`,`
    <div class="form-grid">
      <div class="field">
        <label for="competition">赛事名称 <span class="field-required" aria-hidden="true">*</span></label>
        <input id="competition" name="competition" data-draft required maxlength="180" value="${V(e.competition)}"
          placeholder="例如：第九届传智杯 · AI创新应用挑战赛">
      </div>
      <div class="field">
        <label for="source">赛规来源链接 <span class="muted">选填</span></label>
        <input id="source" name="source" type="url" data-draft maxlength="2048" value="${V(e.source)}"
          placeholder="https://">
      </div>
      <div class="field span-full">
        <div class="field-label-row">
          <label for="rule">赛规文本 <span class="field-required" aria-hidden="true">*</span></label>
          ${W(`导入文件`,`import-rules`,{symbol:`upload`})}
        </div>
        <input type="file" id="rule-file" class="visually-hidden" tabindex="-1"
          accept=".txt,.md,.csv,.json,.pdf,text/plain,application/pdf" aria-label="导入赛规文件">
        <textarea id="rule" name="rule" data-draft required rows="6" maxlength="${At}" aria-describedby="rule-hint"
          placeholder="粘贴资格限制、关键日期、作品要求和需提交的材料…"></textarea>
        <p id="rule-hint" class="field-hint">支持 TXT、Markdown、CSV、JSON 及带文字层的 PDF。截图和扫描件请先转写。</p>
        <div class="field-meta" id="rule-file-status" aria-live="polite">
          ${I?`<span>${V(I)}</span>`:``}
          ${t?`<span>${n(`file`,14)}${V(t)}</span>`:``}
          ${P.sample?`<span id="sample-source-tag">${Lt()}</span>`:``}
        </div>
      </div>
    </div>`)}${G(`项目资料`,`写入与参赛条件和投递材料相关的事实。`,`
    <div class="form-grid">
      <div class="field span-full">
        <label for="project">项目名称 <span class="field-required" aria-hidden="true">*</span></label>
        <input id="project" name="project" data-draft required maxlength="180" value="${V(e.project)}"
          placeholder="填写你的作品名称">
      </div>
      <div class="field span-full">
        <label for="summary">项目摘要 <span class="field-required" aria-hidden="true">*</span></label>
        <textarea id="summary" name="summary" data-draft required rows="4" maxlength="12000"
          placeholder="写下目标用户、主要功能、参赛者资格、开发方式和材料进度…"></textarea>
      </div>
    </div>`)}
    <div class="stage-action-bar">
      <button type="submit" class="button button-primary" ${L?`disabled`:``} id="analyze-button">
        提取门槛与材料 ${n(`arrow-right`,16)}
      </button>
      ${W(`清空资料`,`clear-workspace`,{style:`quiet`})}
    </div>
  </form>`}function zt(){let{draft:e,sample:t}=P;M.innerHTML=G(`资料概览`,``,`
    <ul class="compact-list">
      ${[[`赛规文本`,!!e.rule.trim()],[`项目摘要`,!!e.summary.trim()],[`来源链接`,!!H(e.source.trim())]].map(([e,t])=>`<li><span>${e}</span>${U(t?`已录入`:`待录入`,t?`success`:`neutral`)}</li>`).join(``)}
    </ul>
    ${P.analysis&&!w(P)?`<p class="alert">资料已更新。重新提取后，请核验新的门槛。</p>`:``}
    ${t?`<p class="field-hint">内置示例使用主办方规则摘编和虚构项目。投递请核对当前资料。</p>`:``}
    ${H(e.source.trim())?`<a class="inline-link" href="${V(H(e.source.trim()))}" target="_blank" rel="noopener noreferrer">${n(`link`,15)} 打开赛规来源</a>`:``}
  `)+G(`提取方式`,``,`
    <p class="field-hint">系统按录入文本提取候选门槛与材料，并保留出处供你核对。</p>
    <p class="field-hint">将资格、提交要求和截止日期分行录入，更容易定位引用。</p>
  `)+G(`赛段示例`,``,`
    <p class="field-hint">同一份赛规摘编包含省赛、国赛和通用条款，便于对比各赛段的截止与投递要求。</p>
  `,W(`载入赛段示例`,`load-stage-sample`,{symbol:`sample`}))}function Z(e){let t=e.source===`project`||!e.stage?``:lt[e.stage],r=t?U(t,e.stage===`general`?`neutral`:`success`):``;return e.line?`<span class="citation-location"><button type="button" class="inline-link" data-action="show-line" data-line="${Number(e.line)}"
    data-document="${e.source===`project`?`project`:`rule`}"
    data-column="${Number(e.column)||1}" data-excerpt-length="${(e.text??e.quote)?.length||0}">
    ${n(`link`,14)} ${V(Dt(e))}
  </button>${r}${e.section?`<span class="citation-section">${V(e.section)}</span>`:``}</span>`:`<span class="citation-location"><span class="muted">${e.manual||e.kind===`manual`||e.kind===`gate`?`手动补录`:`赛规摘录`}</span>${r}</span>`}function Bt(e){return e===`pass`?`success`:e===`fail`?`danger`:`warning`}function Vt(e,t){return`<article class="review-item" data-gate-index="${t}">
    <div class="review-item-heading">
      <h3>${V(e.title)}</h3>
      <span data-gate-badge>${U(x[e.status],Bt(e.status))}</span>
    </div>
    <div class="evidence-quote">
      ${Z(e)}
      ${e.quote?`<blockquote>${V(e.quote)}</blockquote>`:`<p class="field-hint">尚未补录出处。</p>`}
    </div>
    <div class="project-evidence">
      <strong>项目摘要线索</strong>
      <p>${e.evidence?V(e.evidence):`暂无匹配片段，请结合项目材料核对。`}</p>
      ${e.suggestion?`<p class="field-hint">${V(e.suggestion)}</p>`:``}
    </div>
    <div class="form-grid">
      <div class="field">
        <label for="gate-status-${t}">核验结果</label>
        <select id="gate-status-${t}" data-gate-status>${It(x,e.status)}</select>
      </div>
      <div class="field">
        <label for="gate-note-${t}">核验备注</label>
        <input id="gate-note-${t}" data-gate-note maxlength="600" value="${V(e.note)}" placeholder="记录凭据、出处或待确认事项">
      </div>
    </div>
  </article>`}function Ht(){if(!w(P))return G(`门槛核验`,``,K(`等待提取赛规`,P.analysis?`资料有改动。返回录入页重新提取后，即可核验当前资料。`:`录入赛规和项目摘要并提取内容后，候选门槛会出现在这里。`,W(`返回录入资料`,`open-intake`,{style:`primary`})));let e=P.analysis.gates;return`<div class="panel-stack">
    ${G(`核验赛段`,``,`<div class="scope-control">
      <div class="field">
        <label for="competition-scope">当前赛规范围</label>
        <select id="competition-scope" aria-describedby="competition-scope-hint">${It(S,C(P))}</select>
      </div>
      <p id="competition-scope-hint" class="field-hint">所选范围用于门槛、复核和清单，各赛段分别保存。明确通用的条款适用于所有范围。</p>
    </div>`)}
    ${qt()}
    ${G(`候选门槛`,`引用来自当前录入文本。请按实际凭据确认核验结果。`,e.length?`<div class="review-list">${e.map(Vt).join(``)}</div>`:K(`未识别到明确门槛`,`你可以核对原文并手动补录。`))}
    ${G(`补录门槛`,``,`
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
      ${W(`生成投递清单`,`generate-checklist`,{symbol:`arrow-right`,style:`primary`})}
    </div>
  </div>`}function Ut(){let e=Tt(P);return`<ul class="compact-list">
    <li><span>符合</span>${U(e.passed,`success`)}</li>
    <li><span>待确认</span>${U(e.pending,`warning`)}</li>
    <li><span>不符合</span>${U(e.blocked,`danger`)}</li>
    <li><span>识别到的材料</span>${U(w(P)?P.analysis.materials.length:0)}</li>
  </ul>`}function Wt(){return w(P)?G(`核验概览`,``,`<div id="gate-metrics">${Ut()}</div>`)+G(`检索赛规证据`,`本地原文检索`,`
      <form id="evidence-form" class="evidence-form">
        <div class="field">
          <label for="evidence-query">关键词</label>
          <input id="evidence-query" name="query" maxlength="120" value="${V(F)}" placeholder="例如：提交材料">
        </div>
        <button type="submit" class="button button-secondary">${n(`search`,15)} 检索</button>
      </form>
      <div id="evidence-results" aria-live="polite"></div>
    `):``}function Gt(){let e=M.querySelector(`#evidence-results`);if(!e||!w(P))return;let t=F?nt({ruleText:P.draft.rule,projectSummary:``,preset:`custom`,query:F,scope:C(P)}).ruleExcerpts.slice(0,5):P.analysis.excerpts.slice(0,3);e.innerHTML=t.length?`<ol class="evidence-results">
      ${t.map(e=>`<li>${Z(e)}<p>${V(e.text)}</p></li>`).join(``)}
    </ol>`:`<p class="field-hint">${F?`暂无匹配。可尝试更短的关键词或原文用词。`:`输入关键词以查找相关原文。`}</p>`}var Kt={"deadline-eligibility":`查看时间和参赛条件`,"repo-process":`核查源码、Git 和 AI 协作记录`,deliverables:`核对视频、文档及待补材料`,custom:`提出与本次投递相关的问题`};function qt(){let e=D(P),t=e?.result.preset??Ne[0].id;return G(`投递复核`,`用赛规原文和项目摘要复核一个问题，将待办建议加入清单。`,`
    <form id="submission-review-form" class="submission-review-form">
      <fieldset class="review-presets">
        <legend>选择复核问题</legend>
        <div class="review-preset-grid">
          ${Ne.map(e=>`<label class="review-preset">
            <input type="radio" name="preset" value="${e.id}" ${e.id===t?`checked`:``}>
            <span><strong>${V(e.label)}</strong><small>${Kt[e.id]}</small></span>
          </label>`).join(``)}
        </div>
      </fieldset>
      <div class="field" id="custom-review-field" ${t===`custom`?``:`hidden`}>
        <label for="submission-question">你的复核问题</label>
        <input id="submission-question" name="query" maxlength="180" ${t===`custom`?`required`:`disabled`}
          value="${t===`custom`?V(e?.result.query):``}"
          placeholder="例如：需要准备哪些软件录屏或说明文件？">
      </div>
      <div class="submission-review-actions">
        <button type="submit" class="button button-primary">${n(`search`,16)} 复核资料</button>
        <p class="field-hint">赛规和摘要的本地检索在当前浏览器完成。</p>
      </div>
    </form>
    <div id="submission-review-result">${Yt()}</div>
  `)}function Q(e,t=`未找到明确片段。`){return e.length?`<ol class="evidence-results review-citations">
    ${e.map(e=>`<li>${Z(e)}<p>${V(e.text)}</p></li>`).join(``)}
  </ol>`:`<p class="field-hint">${t}</p>`}function Jt(e){let t=z?.review===e?z:null,{model:r}=e;return`<section class="model-review" aria-labelledby="model-review-title">
    <h4 id="model-review-title">${n(`sparkles`,16)} 模型复核 <span class="muted">可选</span></h4>
    ${Nt?`<p class="field-hint">发起后，问题和命中的赛规与项目摘要片段会发送给已配置的模型。</p>
      ${W(t?.pending?`正在请求模型…`:r?`重新请求模型`:`请求模型复核`,`ai-review`,{symbol:`sparkles`,disabled:t?.pending})}`:`<p class="field-hint">当前使用浏览器证据复核。配置服务端模型后可追加模型建议。</p>`}
    ${t?.error?`<p class="alert alert-error" role="status">${V(t.error)}</p>`:``}
    ${r?`<div class="ai-answer">
      <p>${V(r.answer)}</p>
      ${Q(r.citations)}
    </div>`:``}
  </section>`}function Yt(e=new Set,t){let r=gt(P,t);if(r===`stale`)return`<p class="alert">资料已更新。请重新复核问题，取得当前版本的出处。</p>`;if(r===`question-changed`)return`<p class="field-hint" role="status">点击「复核资料」查看所选问题的结果。</p>`;if(r===`empty`)return``;let i=D(P),{result:a}=i,o=a.resolvedScopes??[],s=o.length?o.map(e=>S[e]).join(`、`):S[C(P)],c=E(P,P.checklist)?P.checklist.items:[],l=new Set(c.map(e=>e.key)),u=vt(P),d=u.some(t=>e.has(t.key)&&!l.has(`review:${t.key}`)),f=H(P.draft.source.trim());return`<section class="submission-review-result" aria-labelledby="submission-result-title">
    <header class="submission-result-heading">
      <div>
        <h3 id="submission-result-title" tabindex="-1">复核结果</h3>
        <p>${V(a.query)}</p>
      </div>
      <div class="review-result-tags">${U(s)}${U(`本地证据`,`success`)}</div>
    </header>
    <div class="review-source-grid">
      <section>
        <h4>赛规原文 <span>${a.ruleExcerpts.length}</span></h4>
        <p class="field-hint">${V(P.fileName||P.draft.competition)}${f?` · <a class="inline-link" href="${V(f)}" target="_blank" rel="noopener noreferrer">原始链接</a>`:``}</p>
        ${Q(a.ruleExcerpts)}
      </section>
      <section>
        <h4>项目摘要线索 <span>${a.projectExcerpts.length}</span></h4>
        <p class="field-hint">${V(P.draft.project)}</p>
        ${Q(a.projectExcerpts)}
      </section>
    </div>
    ${a.missing.length?`<section class="review-missing">
      <h4>${n(`triangle-alert`,17)} 缺少明确证据</h4>
      <ul>${a.missing.map(e=>`<li>${V(e)}</li>`).join(``)}</ul>
    </section>`:``}
    ${Jt(i)}
    <form id="review-task-form">
      <fieldset class="review-suggestion-list">
        <legend>待人工确认的建议</legend>
        <p class="field-hint">核对引用后勾选要跟进的事项。加入后作为待办，由你记录进展。</p>
        ${u.length?u.map(t=>{let n=l.has(`review:${t.key}`);return`<div class="review-suggestion">
            <label>
              <input type="checkbox" name="review-task" value="${V(t.key)}"
                ${n?`disabled`:e.has(t.key)?`checked`:``}>
              <span>${V(t.title)}</span>
            </label>
            ${n?U(`已加入`,`success`):``}
            <p>${V(t.description)}</p>
            ${t.citations.length?`<div class="review-suggestion-sources">${t.citations.map(Z).join(``)}</div>`:``}
          </div>`}).join(``):`<p class="field-hint">当前问题没有可加入的建议。可以补充材料后再复核。</p>`}
      </fieldset>
      ${u.length?`<div class="submission-review-actions">
        <button type="submit" class="button button-primary" id="add-review-tasks" ${d?``:`disabled`}>
          ${n(`list`,16)} 将所选建议加入清单
        </button>
        ${u.some(e=>l.has(`review:${e.key}`))?W(`查看投递清单`,`open-checklist`,{symbol:`arrow-right`,style:`quiet`}):``}
      </div>`:``}
    </form>
  </section>`}function Xt(){return[...j.querySelectorAll(`#review-task-form input:checked:not(:disabled)`)].map(e=>e.value)}function $({keepSelection:e=!0,focus:t=!1}={}){let n=j.querySelector(`#submission-review-result`);if(!n)return;let r=e?new Set(Xt()):new Set,i=j.querySelector(`#submission-review-form`);n.innerHTML=Yt(r,{preset:i.elements.preset.value,query:i.elements.query.value}),t&&n.querySelector(`#submission-result-title`)?.focus()}function Zt(e){return new URL(`api/ai/${e}`,document.baseURI)}async function Qt(){try{let e=await fetch(Zt(`status`),{headers:{Accept:`application/json`}});if(!e.ok)return;Nt=(await e.json()).available===!0,Nt&&$()}catch{}}async function $t(){let e=D(P);if(!Nt||!e||z?.review===e&&z.pending)return;let{preset:t,query:n}=e.result,r={review:e,pending:!0,error:``};z=r,$(),q(`正在请求模型复核`);try{let r=await fetch(Zt(`review`),{method:`POST`,headers:{"Content-Type":`application/json`,Accept:`application/json`},body:JSON.stringify({ruleText:P.draft.rule,projectSummary:P.draft.summary,scope:C(P),preset:t,query:n})}),i=await r.json();if(!r.ok)throw Error(typeof i.error==`string`?i.error:`模型服务暂无法复核。`);if(typeof i.answer!=`string`||!Array.isArray(i.citations)||!i.citations.length)throw Error(`模型服务返回的数据不完整。`);D(P)===e&&(e.model={answer:i.answer,citations:i.citations},B(),q(`模型复核建议已返回`))}catch(e){r.error=e instanceof SyntaxError||e instanceof TypeError?`模型服务暂无法复核。仍可使用本地结果。`:e.message}finally{r.pending=!1,z===r&&D(P)===e&&$()}}function en(e,t){let n={material:`投递材料`,gate:`门槛待办`,manual:`自定义`,review:`复核待办`}[e.kind];return`<article class="task-item" data-task-index="${t}">
    <div class="task-item-heading">
      <div>
        ${U(n,e.kind===`gate`?`warning`:`neutral`)}
        <h3>${V(e.title)}</h3>
      </div>
      <div class="field">
        <label class="visually-hidden" for="task-status-${t}">任务状态：${V(e.title)}</label>
        <select id="task-status-${t}" data-task-status>${It(ct,e.status)}</select>
      </div>
    </div>
    ${e.quote?`<div class="evidence-quote">${Z(e)}<blockquote>${V(e.quote)}</blockquote></div>`:``}
    ${e.references?.some(t=>t.line!==e.line||t.text!==e.quote)?`<details class="review-task-evidence">
        <summary>其他赛规出处</summary>
        ${Q(e.references.filter(t=>t.line!==e.line||t.text!==e.quote))}
      </details>`:``}
    ${e.kind===`review`?`<details class="review-task-evidence">
      <summary>复核问题及引用（${e.citations.length}）</summary>
      <p><strong>${V(e.question)}</strong> · ${e.reviewMode===`model`?`模型复核`:`本地证据复核`}</p>
      <p>${V(e.description)}</p>
      ${Q(e.citations,`此任务用于补充原文或项目凭据。`)}
    </details>`:``}
    <div class="form-grid">
      <div class="field">
        <label for="task-owner-${t}">负责人</label>
        <input id="task-owner-${t}" data-task-owner maxlength="120" value="${V(e.owner)}" placeholder="填写负责人">
      </div>
      <div class="field">
        <label for="task-note-${t}">进度备注</label>
        <input id="task-note-${t}" data-task-note maxlength="600" value="${V(e.note)}" placeholder="记录当前进展">
      </div>
    </div>
  </article>`}function tn(){if(!w(P))return G(`投递任务`,``,K(P.checklist?`资料已变更`:`等待核验门槛`,P.checklist?`返回录入页重新提取并核验。来源不变的材料任务可保留进度，复核任务请对照新版出处重新加入。`:`完成当前赛规的内容提取与核验后，即可生成投递清单。`,W(`返回录入资料`,`open-intake`,{style:`primary`})));if(!T(P)){let e=P.checklist?`核验结果或资料已更新。重新生成会保留同一赛事和项目下的相同材料和手动任务。录入资料变更后，请重新复核原有建议。`:`核验赛规后，可将投递材料及尚未解决的门槛转成任务。`;return G(`投递任务`,``,K(P.checklist?`清单等待更新`:`等待生成清单`,e,W(`返回门槛核验`,`open-review`,{style:`primary`})))}let e=P.checklist.items;return`<div class="panel-stack">
    ${G(`投递任务`,`当前核验赛段为${S[C(P)]}。对照赛规出处维护负责人和准备进度。`,e.length?`<div class="task-list">${e.map(en).join(``)}</div>`:K(`暂无投递任务`,`当前材料提取为空，可按规则补充任务。`))}
    ${G(`新增任务`,``,`
      <form id="task-form" class="evidence-form">
        <div class="field">
          <label for="manual-task-title">任务名称</label>
          <input id="manual-task-title" name="title" maxlength="180" required placeholder="例如：检查材料命名">
        </div>
        <button type="submit" class="button button-secondary">加入清单</button>
      </form>
    `)}
  </div>`}function nn(){if(!T(P)){M.innerHTML=``;return}let{gateTotal:e,pending:t,blocked:n,taskTotal:r,completed:i}=Tt(P),a=r?Math.round(i/r*100):0;M.innerHTML=G(`投递进度`,``,`
    <div class="task-progress">
      <div class="progress-numbers"><strong>${i} / ${r}</strong><span>${a}%</span></div>
      <div class="progress-track" role="progressbar" aria-label="投递任务完成度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${a}">
        <div class="progress-fill" style="width: ${a}%"></div>
      </div>
      <p class="field-hint">已完成的任务 / 全部任务</p>
    </div>
    <p class="field-hint">${e?t||n?`还有 ${t} 项待确认、${n} 项不符合。请回到核验页更新结论。`:`当前门槛均已人工确认为符合。`:`未识别到明确门槛。请结合原文核对。`}</p>`,W(`导出 Markdown`,`export-markdown`,{symbol:`download`}))}function rn(e,t,n,r){X(`intake`,{focus:!1});let i=j.querySelector(t===`project`?`#summary`:`#rule`),a=i.value.split(`
`);if(!Number.isInteger(e)||e<1||e>a.length)return;let o=a.slice(0,e-1).reduce((e,t)=>e+t.length+1,0),s=a[e-1].length,c=Math.max(0,Math.min(n-1,s)),l=r?Math.min(c+r,s):s;i.focus(),i.setSelectionRange(o+c,o+l),i.scrollTop=Math.max(0,(e-2)*(parseFloat(getComputedStyle(i).lineHeight)||20))}function an(e){(!b.some(e=>P.draft[e].trim())||window.confirm(e?`载入演示将替换当前工作台资料。继续吗？`:`清空当前资料、核验和投递清单？`))&&(++R,L=!1,I=``,F=``,z=null,P=ut(),e&&(P.draft={...e===`stages`?st:ot},P.sample=!0,P.sampleKind=e),X(`intake`),q(e?`演示资料已载入`:`工作台资料已清空`))}async function on(e){if(!e)return;let t=++R;L=!0,I=`正在读取赛规…`;let n=j.querySelector(`#analyze-button`);n&&(n.disabled=!0);let r=j.querySelector(`#rule-file-status`);r&&(r.textContent=I);try{let n=await Me(e);if(t!==R)return;if(!n.trim())throw Error(`文件中没有可录入的文字。`);if(n.length>At)throw Error(`文件文字超过 15 万字，请选取与投递相关的条款。`);P.draft.rule=n.replace(/\r\n?/g,`
`),P.fileName=e.name,I=`赛规文件已导入`,B()}catch(e){t===R&&(I=e.message)}finally{t===R&&(L=!1,P.stage===`intake`&&(Y(),j.querySelector(`[data-action="import-rules"]`)?.focus()),q(I))}}function sn(){let e=Ot(P);if(!e)return;let t=URL.createObjectURL(new Blob([e],{type:`text/markdown;charset=utf-8`})),n=document.createElement(`a`);n.href=t,n.download=`EntryFlow-投递清单.md`,document.body.append(n),n.click(),n.remove(),window.setTimeout(()=>URL.revokeObjectURL(t),1e3),q(`已导出投递清单`)}A.addEventListener(`click`,e=>{let t=e.target.closest(`button`);if(t){if(Object.hasOwn(jt,t.dataset.stage))X(t.dataset.stage);else switch(t.dataset.action){case`load-sample`:an(`standard`);break;case`load-stage-sample`:an(`stages`);break;case`clear-workspace`:an();break;case`open-intake`:X(`intake`);break;case`open-review`:X(`review`);break;case`open-checklist`:X(`checklist`);break;case`import-rules`:j.querySelector(`#rule-file`).click();break;case`show-line`:rn(Number(t.dataset.line),t.dataset.document,Number(t.dataset.column),Number(t.dataset.excerptLength));break;case`export-markdown`:sn();break;case`ai-review`:$t();break;case`generate-checklist`:Ct(P),X(`checklist`),q(`投递清单已生成`)}}}),A.addEventListener(`input`,e=>{let t=e.target;if(t.matches(`[data-draft]`)){t.name===`rule`&&L&&(++R,L=!1,I=`已保留当前手动编辑的赛规`,j.querySelector(`#rule-file-status`).textContent=I,j.querySelector(`#analyze-button`).disabled=!1),P.draft[t.name]=t.value;let e=j.querySelector(`#sample-source-tag`);e&&P.sample&&(e.innerHTML=Lt()),t.setCustomValidity(``),B(),J(),zt()}else if(t.matches(`[data-gate-note]`)&&w(P)){let e=P.analysis.gates[Number(t.closest(`[data-gate-index]`).dataset.gateIndex)];e.note=t.value,B()}else if(t.matches(`[data-task-owner], [data-task-note]`)&&T(P)){let e=P.checklist.items[Number(t.closest(`[data-task-index]`).dataset.taskIndex)];t.matches(`[data-task-owner]`)?e.owner=t.value:e.note=t.value,B()}else t.id===`submission-question`&&(t.setCustomValidity(``),$({keepSelection:!1}))}),A.addEventListener(`change`,e=>{let t=e.target;if(t.id===`rule-file`)on(t.files[0]),t.value=``;else if(t.id===`competition-scope`){if(!dt(P,t.value))return;w(P)||ln(),F=``,B(),Y(),j.querySelector(`#competition-scope`)?.focus(),q(`已切换至${S[C(P)]}核验`)}else if(t.name===`preset`&&t.form?.id===`submission-review-form`){let e=t.value===`custom`,n=j.querySelector(`#submission-question`);j.querySelector(`#custom-review-field`).hidden=!e,n.disabled=!e,n.required=e,n.setCustomValidity(``),$({keepSelection:!1})}else if(t.name===`review-task`&&t.form?.id===`review-task-form`)j.querySelector(`#add-review-tasks`).disabled=Xt().length===0;else if(t.matches(`[data-gate-status]`)&&w(P)){let e=t.closest(`[data-gate-index]`),n=P.analysis.gates[Number(e.dataset.gateIndex)];n.status=t.value,e.querySelector(`[data-gate-badge]`).innerHTML=U(x[n.status],Bt(n.status)),M.querySelector(`#gate-metrics`).innerHTML=Ut(),B(),J()}else if(t.matches(`[data-task-status]`)&&T(P)){let e=P.checklist.items[Number(t.closest(`[data-task-index]`).dataset.taskIndex)];e.status=t.value,B(),J(),nn()}});function cn(e,t){if(L)return;for(let t of e.querySelectorAll(`[required]`))if(!t.value.trim()){t.setCustomValidity(`请填写这项资料。`),t.reportValidity();return}let n=e.elements.source;n.value.trim()&&!H(n.value.trim())?(n.setCustomValidity(`请填写以 https:// 或 http:// 开头的链接。`),n.reportValidity()):(P.draft=Object.fromEntries(b.map(e=>[e,String(t.get(e)??``)])),ln(),F=``,X(`review`),q(`门槛与材料已提取`))}function ln(){xt(P,ke(P.draft.rule,P.draft.summary,{scope:C(P)}))}A.addEventListener(`submit`,e=>{let t=e.target;e.preventDefault();let n=new FormData(t);switch(t.id){case`intake-form`:cn(t,n);break;case`evidence-form`:F=String(n.get(`query`)??``).trim(),Gt();break;case`submission-review-form`:{if(!w(P))return;let e=String(n.get(`preset`)),r=String(n.get(`query`)??``).trim();if(e===`custom`&&!r){t.elements.query.setCustomValidity(`请输入一个复核问题。`),t.elements.query.reportValidity();return}_t(P,nt({ruleText:P.draft.rule,projectSummary:P.draft.summary,scope:C(P),preset:e,query:r})),B(),$({keepSelection:!1,focus:!0}),q(`已复核当前赛规和项目摘要`);break}case`review-task-form`:{let e=yt(P,n.getAll(`review-task`));if(!e)return;B(),J(),$({keepSelection:!1}),j.querySelector(`[data-action="open-checklist"]`)?.focus(),q(`已将 ${e} 项复核建议加入投递清单`);break}case`gate-form`:if(!String(n.get(`title`)).trim())return;St(P,String(n.get(`title`)),String(n.get(`source`))),B(),Y(),j.querySelector(`#manual-gate-title`).focus(),q(`门槛已添加`);break;case`task-form`:if(!String(n.get(`title`)).trim())return;wt(P,String(n.get(`title`))),B(),Y(),j.querySelector(`#manual-task-title`).focus(),q(`任务已添加`)}}),Y(),Qt();