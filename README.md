# Jordan e Blog

> study programs and record life

这是一个基于 VuePress 构建的个人博客项目，主要用于记录技术学习和生活随笔，支持本地预览、静态构建和脚本化部署。

## 技术栈

- 博客框架: [VuePress](https://vuepress.vuejs.org/zh/)
- 主题: [vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)
- 主题作者: [reco_luan](https://github.com/recoluan)
- 主要内容目录: `docs/`

## 你可以用它做什么

- 写技术文章和生活记录
- 使用标签和分类整理文章
- 本地实时预览博客效果
- 构建静态站点用于上线
- 通过脚本快速部署到线上

## 环境要求

- Node.js 14+ (建议使用 LTS 版本)
- npm 6+
- Git

## 安装依赖

在项目根目录执行:

```bash
npm install
```

## 常用命令

```bash
# 本地开发（热更新）
npm run dev

# 生产构建
npm run build

# 部署（执行 deploy.sh）
npm run deploy
```

## 目录说明

- `docs/`: 博客文章与页面内容
- `docs/.vuepress/`: VuePress 配置、主题扩展、插件与静态资源
- `deploy.sh`: 部署脚本
- `package.json`: 项目脚本与依赖配置

## 新增文章

推荐在 `docs/technology/` 或 `docs/lifes/` 下新增 Markdown 文件，例如:

```bash
docs/technology/my-new-post.md
```

文章头部建议使用以下 Frontmatter:

```yaml
---
title: xxxxxxxxxxxxx
date: xxxx-xx-xx
sidebar: auto
tags:
  - xxx
categories:
  - xxx
---
```

## 本地写作流程

1. 运行 `npm run dev`
2. 新建或编辑 `docs/` 下文章
3. 浏览器查看实时效果
4. 确认内容后提交代码并部署

## 部署说明

项目已提供 `deploy.sh` 脚本，可通过 `npm run deploy` 执行部署流程。  
如需调整部署目标（例如 GitHub Pages 分支或自定义域名），请修改 `deploy.sh` 中对应逻辑。

## 备注

- 如遇主题相关问题，请确认 `vuepress-theme-reco` 依赖已正确安装
- 项目中包含自定义插件与静态资源，修改前建议先本地验证

## 从 0 到发布第一篇文章（Checklist）

```text
[ ] 1. 安装依赖: npm install
[ ] 2. 启动本地: npm run dev
[ ] 3. 新建文章: docs/technology/xxx.md（补全 frontmatter）
[ ] 4. 本地检查: 标题、分类、标签、排版和链接是否正常
[ ] 5. 提交并部署: git commit && npm run deploy
```