# Jordan の Words — 个人站点

> 江上 · 寄 · 远山
> Jordan の个人站点 — 记录技术、文学、哲学、AI 与生活的痕迹

**线上**：https://jordan-home.github.io
**仓库**：git@github.com:jordan-home/jordan-home.github.io.git
**部署分支**：远端 `dev`

---

## 一、项目信息

### 这是什么

一个个人博客 + 作品集。基于 **Astro 5** 静态站点，杂志感 + 国风水墨插画 + 温度感的视觉风格。

### 内容

- **文字**：36 篇博客，按 5 个分类（技术 / 心理 / 健康 / 生活 / 作品）
- **作品**：3 个工程类项目（SweetNovel / PetMona / UUSKINS）
- **联系**：邮箱 / GitHub / 微信

### 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | Astro 5 |
| 内容 | Content Collections（posts + projects）+ MDX |
| 样式 | 纯 CSS（vanilla，CSS variables）|
| SEO | @astrojs/sitemap + 自定义 lastmod 脚本 + canonical + JSON-LD |
| 图 | WebP（cwebp 压缩），Google Fonts CDN |
| 部署 | GitHub Pages（远端 dev 分支） |

---

## 二、目录结构

```
jordan-home.github.io/
├── astro.config.mjs           # Astro 配置（sitemap / MDX / shiki）
├── package.json                # 依赖 + npm scripts
├── tsconfig.json               # TS 严格模式
├── deploy.sh                   # 一键部署脚本（build + push dev）
├── public/                     # 静态资源（构建时原样复制）
│   ├── favicon.png             # 站点图标
│   ├── illustrations/          # 手绘插画（WebP 压缩后）
│   │   ├── hero-shanhui.webp      # 首页山水 hero
│   │   ├── cover-*.webp           # 博客分类通用封面
│   │   ├── projects/*.webp        # 作品专属封面
│   │   ├── about-portrait.webp    # 关于页人物
│   │   ├── 404-lost-cat.webp      # 404 插画
│   │   ├── seal-red.webp          # 朱砂印章 logo
│   │   ├── projects-desk.webp     # 作品页装饰
│   │   └── divider-*.svg          # 分隔符
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots
├── src/
│   ├── content.config.ts       # posts + projects schema
│   ├── env.d.ts                # Astro 类型引用
│   ├── styles/
│   │   └── global.css          # 设计 token + prose + 全局样式
│   ├── layouts/
│   │   └── BaseLayout.astro    # 全站布局 + canonical + JSON-LD
│   ├── components/
│   │   └── Hero.astro          # 首页 hero
│   ├── pages/
│   │   ├── index.astro          # 首页
│   │   ├── about.astro          # 关于
│   │   ├── contact.astro        # 联系
│   │   ├── 404.astro            # 404
│   │   ├── posts/
│   │   │   ├── index.astro      # 文章列表（按分类）
│   │   │   └── [...slug].astro  # 文章详情
│   │   └── projects/
│   │       ├── index.astro      # 作品列表（分工程/案头两区）
│   │       └── [...slug].astro  # 作品详情
│   └── content/
│       ├── posts/              # 36 篇博客 markdown
│       │   ├── technology-*.md # 26 篇技术
│       │   ├── note-*.md       # 6 篇心理
│       │   ├── health-*.md     # 2 篇健康
│       │   ├── lifes-*.md      # 1 篇生活
│       │   └── projects-*.md   # 1 篇作品工具
│       └── projects/           # 3 个作品 markdown
│           ├── sweet-novel.md
│           ├── petmona.md
│           └── uuskins.md
├── scripts/
│   ├── optimize-images.py      # 图片 → WebP 压缩
│   └── add-sitemap-lastmod.mjs # 给 sitemap-0.xml 追加 lastmod
└── README.md                  # ← 你正在看
```

---

## 三、常用命令

```bash
# 开发
npm run dev          # 启动本地 dev server（默认 http://localhost:4321）

# 构建
npm run build        # astro build + 自动追加 sitemap lastmod

# 预览（构建后的本地预览）
npm run preview      # 启动 preview server（默认 http://localhost:4321）

# 部署
npm run deploy       # = bash deploy.sh：构建 + 推送到远端 dev 分支

# 图片优化（新增图片后跑一遍）
python3 scripts/optimize-images.py

# 类型检查
npx tsc --noEmit    # 严格模式 TS 检查
```

---

## 四、部署流程

### 默认部署链路

```
本地 main  →  npm run build  →  dist/  →  git push -f dev  →  GitHub Pages
                                       (origin: git@github.com:jordan-home/jordan-home.github.io.git)
```

### 关键点

1. **部署到 dev 分支**（不是 master）：`GitHub Pages` 设置里 Source = `Deploy from a branch` → Branch = `dev`
2. **本地 master 分支是源码**，永远不要直接 push dist 到 master
3. **`deploy.sh` 包含完整的 npm install + build + push 流程**

### 部署后多久生效

GitHub Pages 缓存 1-3 分钟。**强制刷新**：浏览器 Cmd/Ctrl + Shift + R。

### 检查部署是否成功

```bash
# 看 dev 分支最新 commit
git ls-remote origin dev

# 看线上页面（注意 raw.githubusercontent.com 不支持目录 URL）
curl -s https://raw.githubusercontent.com/jordan-home/jordan-home.github.io/dev/index.html | grep -o "<title>[^<]*</title>"

# 看 sitemap
curl -s https://jordan-home.github.io/sitemap-0.xml | head -3
```

### 部署失败排查

| 现象 | 原因 | 修复 |
|---|---|---|
| 线上还是旧版 | Pages Source 配错了 | Settings → Pages → Source → `dev` 分支 |
| 部署脚本 push 失败 | SSH key 未配置 | `ssh -T git@github.com` 验证 |
| deploy.sh 卡住 | `npm install` 慢 | 用 `npm install --prefer-offline` 或检查 node_modules |
| build 报 schema 错误 | markdown frontmatter 不匹配 | 对照 `src/content.config.ts` 修字段 |

---

## 五、维护手册

### 新增一篇博客

1. 在 `src/content/posts/` 下创建 markdown，文件名格式 `{category}-{slug}.md`
   - `category` 必须是 `technology` / `note` / `health` / `lifes` / `projects` / `literature` / `philosophy` / `misc` 之一
2. 添加 frontmatter：

   ```yaml
   ---
   title: "标题"
   pubDate: 2026-04-20
   description: "一句话描述（会显示在卡片和 SEO meta）"
   category: technology
   tags: ["AI", "效率"]          # 可选
   cover: "/illustrations/xxx.webp"  # 可选，单独指定封面
   featured: false             # 可选，是否置顶
   ---
   
   正文 markdown。
   ```

3. 如果文章用代码块，确保 shiki 高亮正常（默认 github-light 主题）
4. `npm run dev` 验证
5. `npm run deploy` 上线

### 新增 / 修改一个作品

#### 工程类（推荐）

1. 用 `generate_image` 生成专属封面图（黑灰主调的产品感图，1024×1024）
2. 存到 `public/illustrations/projects/{slug}.webp`
3. 转 webp：`python3 scripts/optimize-images.py`
4. 编辑 `src/content/projects/{slug}.md`：

   ```yaml
   ---
   title: "项目名"
   summary: "一句话简介"
   year: "2025 – 至今"             # 自由格式
   role: "联合创始 · 全栈工程"
   stack:
     - "Next.js"
     - "TypeScript"
   demo: "https://example.com"     # 必填，外站 URL
   cover: "/illustrations/projects/xxx.webp"
   featured: true
   order: 1
   pubDate: 2025-03-01
   category: "engineering"         # engineering / studio
   highlights:                    # 3-5 条项目亮点
     - "3.5M+ 皮肤 SKU 实时库存"
     - "10 分钟 Steam 自动交付"
   ---
   
   正文 markdown：项目背景 / 我的角色 / 我做的事 / 数据成果
   ```

5. `npm run dev` 验证 → 部署

#### 案头类（小工具）

跟工程类一样，但 `category: "studio"`，通常不需要 highlights / role / year。

### 修改 / 删除

- **修改**：编辑对应 markdown + 替换 cover 图
- **删除**：直接删 markdown 文件；图如果不再用，删图也清理

### 添加新插画

1. 生成 PNG（建议 1024×1024）
2. 存到 `public/illustrations/{name}.png`
3. 转 webp：`python3 scripts/optimize-images.py`（自动跳过 webp）
4. 在 markdown 里用 `/illustrations/{name}.webp` 引用

### 修改设计 token（配色 / 间距 / 字体）

所有 token 在 `src/styles/global.css` 的 `:root` 块：

- **颜色**：`--paper` `--ink` `--cinnabar` `--bamboo` `--gold` `--line`
- **字体**：`--font-serif-cn` `--font-serif-en` `--font-deco` `--font-mono`
- **字号**：`--fs-xs` 到 `--fs-4xl`
- **间距**：`--sp-1` 到 `--sp-9`

修改后立即生效（CSS 变量）。

### 修改导航 / 站点信息

- **导航项**：编辑 `src/layouts/BaseLayout.astro` 里的 `navItems` 数组
- **站点 logo / 印章**：替换 `public/illustrations/seal-red.webp`
- **联系信息**：编辑 `src/pages/contact.astro` 里的 `channels` 数组

### 切换主题（暗色 / 亮色）

- 默认跟随系统 `prefers-color-scheme`
- 用户点导航栏右侧的 ☾ / ☼ 按钮切换（localStorage 持久化）
- 暗色 token 在 `src/styles/global.css` 的 `:root[data-theme="dark"]` 块

---

## 六、SEO 最佳实践（已实施）

| 维度 | 实施 |
|---|---|
| canonical | 每个页面自动生成（BaseLayout 模板）|
| hreflang | 不需要（单语言站点）|
| sitemap | `@astrojs/sitemap` 自动生成 + `scripts/add-sitemap-lastmod.mjs` 追加 lastmod |
| JSON-LD | Person schema（作者信息），全站生效 |
| meta description | 每页都有（BaseLayout 默认）|
| OG image | hero 图作为默认 |
| robots.txt | `public/robots.txt`，allow all + sitemap 引用 |
| PWA manifest | `public/manifest.json`，theme_color + icons |

QA 检查清单（每季度跑一次）：
- [ ] `curl https://jordan-home.github.io/sitemap-0.xml | grep lastmod | wc -l` 应该是当前页数
- [ ] DevTools 检查 `<head>` 有 canonical / og:* / json-ld
- [ ] Lighthouse 性能分 > 90

---

## 七、性能

- **首屏 JS bundle**：~24KB（Astro 静态生成，几乎零 JS）
- **总插画大小**：1.0MB（WebP 压缩后）
- **dist 总大小**：1.8MB（含 HTML）
- **首屏 LCP**：< 1s（webp + lazy load）

---

## 八、设计系统

### 配色

| Token | Hex | 用途 |
|---|---|---|
| `--paper` | `#F5EFE0` | 宣纸米黄（主背景）|
| `--paper-deep` | `#EAE0CB` | 米黄加深（hover / 分隔）|
| `--paper-warm` | `#F8F2E4` | 温暖米黄（卡片背景）|
| `--ink` | `#2A2622` | 主文 |
| `--ink-soft` | `#4A4540` | 次要文 |
| `--ink-fade` | `#6E6A63` | 提示文（AA 4.69:1）|
| `--cinnabar` | `#B5453A` | 朱砂红（强调）|
| `--cinnabar-deep` | `#8E332B` | 朱砂深红（hover）|
| `--bamboo` | `#5A7A65` | 竹青 |
| `--gold` | `#B8956A` | 墨金 |
| `--line` | `#D9CDB0` | 米色线 |

### 字体

- **中文衬线**：Noto Serif SC（思源宋体）
- **英文衬线**：Cormorant Garamond
- **题花书法**：Ma Shan Zheng（马善政）
- **等宽**：JetBrains Mono

---

## 九、备份与历史

- **VuePress 时代备份**：`.backup-vuepress/`（gitignored）
  - 包含原 VuePress 1.x 的完整源码和博客
- **图片资源**：`public/illustrations/` 全量备份在 git LFS（如启用）或直接 commit

---

## 十、license

MIT — 个人项目，欢迎参考借鉴。

---

**最后更新**：2026-09-24
**维护者**：Jordan（jordan-home）