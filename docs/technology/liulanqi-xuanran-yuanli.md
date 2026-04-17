---
title: 浏览器渲染原理详解
date: 2026-01-18
tags:
  - 浏览器
  - 性能优化
  - 前端
categories:
  - 技术笔记
---

## 前言

理解浏览器的渲染原理是前端性能优化的基础。本文详细介绍浏览器从接收 HTML 到最终渲染页面的完整过程。

## 渲染流程概述

```
HTML → Parsing → DOM Tree
                 ↓
CSS → Parsing → CSSOM Tree
                 ↓
        DOM + CSSOM → Render Tree → Layout → Paint → Composite
```

## 1. 解析（Parsing）

### HTML 解析

浏览器接收到 HTML 文档后，解析器开始工作：

1. **词法分析**：将 HTML 转换为 Token
2. **语法分析**：将 Token 构建为 DOM 节点
3. **构建 DOM 树**：将节点组合成 DOM 树

```javascript
// 简化版解析过程
function parse(html) {
  const tokens = tokenize(html);  // 词法分析
  const nodes = buildTree(tokens); // 语法分析
  return nodes;
}
```

### CSS 解析

类似 HTML，CSS 解析器将 CSS 转换为 CSSOM（CSS Object Model）：

```css
/* 浏览器解析为 CSSOM */
.style = {
  color: 'red',
  fontSize: '16px'
}
```

### 解析优化

- **CSS 应放在 `<head>`**：避免 FOUC（Flash of Unstyled Content）
- **JS 应放在底部**：避免阻塞 HTML 解析
- **减少 DOM 层级**：加快解析速度

## 2. 构建渲染树（Render Tree）

DOM 树和 CSSOM 树结合生成渲染树：

```
DOM Tree + CSSOM Tree = Render Tree
```

渲染树只包含可见节点：
- `<head>` 不包含
- `display: none` 不包含
- `visibility: hidden` 包含（但不可见）

## 3. 布局（Layout）

也称为 Reflow，计算每个节点的位置和大小：

```javascript
// 触发 Layout 的操作
element.style.width = '100px';  // 读取布局属性
element.offsetWidth;
element.clientHeight;
element.getComputedStyle();
```

### 触发重排的操作

```javascript
// 添加/删除 DOM
document.body.appendChild(el);

// 改变尺寸
el.style.width = '100px';

// 改变位置
el.style.margin = '10px';

// 读取布局属性
const width = el.offsetWidth;
```

### 优化策略

1. **使用 transform** 代替 top/left/width/height
2. **批量修改 DOM**：使用 DocumentFragment
3. **缓存布局属性**

```javascript
// 不好：每次都触发重排
for (let i = 0; i < 100; i++) {
  el.style.top = i + 'px';
}

// 好：使用 transform
for (let i = 0; i < 100; i++) {
  el.style.transform = `translateY(${i}px)`;
}
```

## 4. 绘制（Paint）

将渲染树转换为屏幕像素：

```javascript
// 触发 Paint 的操作
el.style.color = 'red';
el.style.background = 'blue';
```

### 分层（Layers）

浏览器将页面分为多个图层：

1. **根图层**
2. **position: absolute/fixed**
3. **z-index 层级**
4. **transform**
5. **opacity < 1**
6. **video、canvas、iframe**

```css
/* 提升为合成层 */
.element {
  will-change: transform;
  transform: translateZ(0);
}
```

## 5. 合成（Composite）

将各图层合成为最终图像：

```
Layer 1
Layer 2  →  Final Image
Layer 3
```

### 触发合成的属性

```css
/* 这些属性只触发合成，不触发布局和绘制 */
.element {
  transform: translateX(100px);
  transform: scale(1.5);
  opacity: 0.5;
  filter: blur(5px);
}
```

## 渲染性能优化

### 1. 减少重排重绘

```javascript
// 使用 CSS 类批量修改
element.classList.add('active');

// 使用 transform 和 opacity
element.style.transform = 'translateX(100px)';
element.style.opacity = '0.5';
```

### 2. 使用 will-change

```css
/* 提前告知浏览器优化 */
.animated-element {
  will-change: transform, opacity;
}
```

### 3. 避免强制同步布局

```javascript
// 不好：强制同步布局
div.style.width = '100px';
console.log(div.offsetWidth); // 触发重排

// 好：先读取，后写入
console.log(div.offsetWidth); // 读取
div.style.width = '100px';    // 写入（在下一帧）
```

### 4. 使用虚拟滚动

```javascript
// 大列表只渲染可见区域
const virtualList = new VirtualList({
  itemHeight: 50,
  containerHeight: 500,
  renderCount: 10
});
```

## 关键渲染路径

### 关键资源

1. **关键 CSS**：首屏渲染所需 CSS
2. **关键 JS**：首屏渲染所需 JS
3. **字体**：影响首次文本显示

### 优化策略

```html
<!-- 内联关键 CSS -->
<style>
  .header { ... }
  .hero { ... }
</style>

<!-- 延迟非关键 CSS -->
<link rel="preload" href="styles.css" as="style" 
      onload="this.onload=null;this.rel='stylesheet'">

<!-- 异步加载 JS -->
<script async src="app.js"></script>
```

## 浏览器事件循环与渲染

```javascript
// requestAnimationFrame 在下一帧前执行
requestAnimationFrame(() => {
  // 更新 DOM 样式
});

// setTimeout 在空闲时间执行
setTimeout(() => {
  // 耗时操作
}, 0);

// requestIdleCallback 在浏览器空闲时执行
requestIdleCallback(() => {
  // 非紧急任务
});
```

## Chrome 开发者工具

### Performance 面板

1. **Recording**：录制页面性能
2. **FPS**：帧率监控
3. **Layers**：图层分析
4. **Paint profiler**：绘制分析

### 优化建议

1. 减少 Main 线程工作量
2. 减少布局抖动
3. 优化绘制区域
4. 使用 transform 和 opacity

## 总结

浏览器渲染过程：
1. **解析**：HTML → DOM，CSS → CSSOM
2. **渲染树**：DOM + CSSOM → Render Tree
3. **布局**：计算位置和大小
4. **绘制**：绘制像素
5. **合成**：图层合并

性能优化核心：
- 减少重排重绘
- 使用 transform/opacity
- 利用合成层
- 优化关键渲染路径
