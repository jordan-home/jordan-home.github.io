---
title: "浏览器渲染原理详解"
pubDate: 2026-01-18
description: "从输入 URL 到看到页面，浏览器做了什么：DNS / TCP / HTTP / 解析 / 渲染树 / 布局 / 绘制 / 合成。"
category: technology
tags: ["浏览器", "性能优化"]
---

了解浏览器渲染原理，才能写出真正快的页面。

## 关键渲染路径（Critical Rendering Path）

```
HTML → DOM Tree
CSS  → CSSOM Tree
DOM + CSSOM → Render Tree
Render Tree → Layout (reflow) → Paint → Composite → Display
```

每一步都可能成为性能瓶颈。

## 各步骤详解

### 1. 解析 HTML → DOM

字节流 → 字符 → token → node → DOM

### 2. 解析 CSS → CSSOM

跟 HTML 类似，但 CSS 的 `<link>` 会**阻塞渲染**（默认），所以要尽早加载。

### 3. Render Tree

DOM 节点 + 可见的样式 = Render Tree。`display: none` 的节点不在 Render Tree 里。

### 4. Layout（回流 / reflow）

计算每个节点的位置和大小。**这一步是性能最贵的之一**。

修改 DOM、样式、视口大小都会触发 reflow。

### 5. Paint（重绘）

把 Render Tree 的节点绘制成像素。

### 6. Composite（合成）

把多个层合并输出到屏幕。

## 优化建议

- **减少 reflow**：批量修改 DOM、用 transform 替代 top/left
- **避免强制同步布局**：不要在已修改 DOM 后立刻读布局
- **用 CSS transform / opacity 做动画**：走合成层，不触发 reflow / repaint
- **避免 layout thrashing**：读写分离

## 工具

- Chrome DevTools → Performance 面板
- Lighthouse 跑一遍

理解渲染原理，性能优化才有方向。