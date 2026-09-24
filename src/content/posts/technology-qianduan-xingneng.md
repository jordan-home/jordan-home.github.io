---
title: "前端性能优化实战指南"
pubDate: 2026-03-16
description: "从 Core Web Vitals 到具体优化手段：LCP / INP / CLS、懒加载、代码分割、缓存策略。"
category: technology
tags: ["性能优化", "前端"]
---

前端性能优化的核心是 Core Web Vitals：LCP / INP / CLS。

## 三大指标

### LCP（Largest Contentful Paint）

**最大内容绘制**时间。理想 < 2.5s。

优化：
- 图片懒加载 + WebP
- 关键 CSS 内联
- 用 CDN
- 字体 font-display: swap

### INP（Interaction to Next Paint）

**交互到下次绘制**时间。理想 < 200ms。

优化：
- 减少 JS 主线程阻塞
- 用 web worker 处理重计算
- 避免强制同步布局
- 用 transition 替代 setTimeout 动画

### CLS（Cumulative Layout Shift）

**累计布局偏移**。理想 < 0.1。

优化：
- 图片 / 视频 / iframe 给宽高
- 字体加载完前预留空间
- 避免在已渲染内容上方插入 DOM

## 加载优化

### 1. 资源压缩

- 文本：gzip / brotli（CDN 自动）
- 图片：WebP（比 PNG 小 70%）
- JS / CSS：terser / esbuild（Astro 默认）

### 2. 代码分割

```javascript
const Heavy = lazy(() => import('./Heavy'));
```

按需加载，不在首屏的代码都不该阻塞首屏。

### 3. 预加载 / 预连接

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preload" href="/critical.css" as="style" />
<link rel="prefetch" href="/next-page.html" />
```

### 4. 缓存

- 静态资源：Cache-Control: public, max-age=31536000, immutable
- HTML：no-cache（每次跟服务器确认）

## 运行时优化

### 1. 避免 reflow / repaint

```javascript
// ❌ 触发多次 reflow
el.style.width = '100px';
el.style.height = '100px';
el.style.margin = '10px';

// ✅ 批量修改
el.style.cssText = 'width:100px;height:100px;margin:10px';

// ✅ 用 transform
el.style.transform = 'translateX(100px)';
```

### 2. 防抖 / 节流

滚动 / resize / 输入事件用 debounce / throttle。

### 3. 虚拟列表

长列表用虚拟滚动，只渲染可见区域。

## 工具

- Chrome DevTools → Performance
- Lighthouse
- WebPageTest
- `performance.now()` 代码片段

性能优化是**先测量、再优化**。