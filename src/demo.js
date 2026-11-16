const commonRules = `具有正式全日制学籍的研究生、本科及高职高专学生可以参赛，以个人为单位参赛。
报名时按学籍和学校类型选择研究生组、A 组、B 组或 C 组。
参赛作品须为原创，严禁直接包装已有开源项目。
开发过程必须使用 AI 辅助编程工具，且能够复现。`;

const submissionRules = `提交公开 GitHub 或 Gitee 代码仓库，也可对评审开放访问。
Git 历史须细粒度提交，禁止一次提交包含全部功能。
提交 AI 对话 Prompt 历史，须涵盖至少三个核心功能的完整迭代链。
提供 README 十分钟复现指南，含环境配置、依赖和环境变量模板。
提交 5–8 分钟的 1080p MP4 演示视频，至少 2 分钟展示 AI 协同复现。
提交不超过 30 页的技术文档 PDF，阐述意图控制、系统架构与可复现性。`;

const provincialDeadline = '省赛报名及提交均截止 2026-11-18，缴费后登录个人中心查看作品提交入口。';

export const demoDraft = {
  competition: '第九届传智杯 · AI创新应用挑战赛',
  source: 'https://www.boxuegu.com/matchTrack/detail/?id=10039',
  project: '实验室预约小助手（虚构示例）',
  rule: `第九届传智杯 · AI创新应用挑战赛（根据官方页面人工摘编）
${commonRules}
${provincialDeadline}
${submissionRules}`,
  summary: `本例为虚构学生项目，帮助同学查询实验室空闲时段并提交预约。设定为一名全日制本科生独立开发，具体报名组别有待核对。使用 AI 辅助编程工具生成预约流程，保留了部分 Prompt 对话。仓库目前为私有，README 已起草，演示视频和技术文档尚未完成。`,
};

export const stageDemoDraft = {
  ...demoDraft,
  rule: `第九届传智杯 · AI创新应用挑战赛（赛段示例，根据官方页面人工摘编）
## 通用参赛要求
${commonRules}

## 省赛安排
### 时间安排
${provincialDeadline}
### 作品提交要求
${submissionRules}
### 奖项设置
获得省赛一、二、三等奖的参赛者可晋级国赛。
### 评审标准
评审中，过程可复现性占 25%。

## 国赛安排
### 时间安排
国赛报名时间为 2026-12-10 至 2026-12-21。
国赛作品提交截止 2026-12-27。
### 作品提交要求
${submissionRules}
### 奖项设置
国赛设一、二、三等奖及优秀奖。
### 评审标准
评审中，过程可复现性占 25%。`,
};
