---
title: 前端性能优化实战指南
date: 2026-03-16
description: 全方位前端性能优化方案：资源压缩、懒加载、代码分割、CDN、浏览器渲染优化，提升首屏加载速度 50% 以上。
meta:
  - name: og:title
    content: 前端性能优化实战指南
  - name: og:description
    content: 全方位前端性能优化方案：资源压缩、懒加载、代码分割、CDN、浏览器渲染优化，提升首屏加载速度 50% 以上。
  - name: og:image
    content: https://jordan-home.github.io/head.jpeg
  - name: twitter:title
    content: 前端性能优化实战指南
  - name: twitter:description
    content: 全方位前端性能优化方案：资源压缩、懒加载、代码分割、CDN、浏览器渲染优化，提升首屏加载速度 50% 以上。
  - name: twitter:image
    content: https://jordan-home.github.io/head.jpeg
tags:
  - 性能优化
  - 前端
categories:
  - 技术笔记
---

## 前言

前端性能优化是提升用户体验的关键。本文从多个维度介绍性能优化的实战技巧。

## 加载优化

### 1. 代码分割

```javascript
// Vue 路由懒加载
const Home = () => import(/* webpackChunkName: "home" */ './Home.vue');
const About = () => import(/* webpackChunkName: "about" */ './About.vue');

// React 懒加载
const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));

// Webpack 配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};
```

### 2. 资源压缩

```javascript
// HTML 压缩
<script src="app.min.js"></script>

// Gzip 配置 (Nginx)
gzip on;
gzip_types text/plain application/javascript text/css application/json;
gzip_min_length 1024;
```

### 3. 预加载

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 预连接第三方域名 -->
<link rel="preconnect" href="https://api.example.com">
```

### 4. 按需加载

```javascript
// 按需加载组件
import { Button, Dialog, Dropdown } from 'element-ui';

// Tree Shaking
import { format } from 'date-fns';
```

## 渲染优化

### 1. 减少重排重绘

```javascript
// ❌ 触发重排
el.style.width = '100px';
el.style.height = '100px';
el.style.margin = '10px';

// ✅ 使用 transform
el.style.transform = 'translateX(100px) scale(1.1)';

// ✅ 批量修改
el.classList.add('active');
```

### 2. 虚拟列表

```javascript
// react-window 实现
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);

<List
  height={500}
  itemCount={10000}
  itemSize={50}
  width={300}
>
  {Row}
</List>
```

### 3. 组件懒加载

```javascript
// React
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}

// Vue
const HeavyComponent = () => import('./HeavyComponent');
```

## 网络优化

### 1. CDN

```javascript
// 使用 CDN
<script src="https://cdn.example.com/vue@3.0.0/vue.global.prod.js"></script>

// 图片 CDN
<img src="https://cdn.example.com/image.jpg?w=300&h=200&fit=cover">
```

### 2. 图片优化

```html
<!-- 响应式图片 -->
<img srcset="img-320.jpg 320w, img-640.jpg 640w, img-1024.jpg 1024w"
     sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, 1024px"
     src="img-640.jpg" alt="Image">

<!-- 懒加载 -->
<img loading="lazy" src="image.jpg" alt="">

<!-- WebP -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="">
</picture>
```

### 3. HTTP/2

```nginx
# Nginx 配置 HTTP/2
listen 443 ssl http2;
```

### 4. 缓存策略

```javascript
// Service Worker 缓存
const CACHE_NAME = 'v1';
const urlsToCache = ['/'];

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

## 代码优化

### 1. 防抖节流

```javascript
// 防抖
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用
window.addEventListener('resize', debounce(() => {
  console.log('Resize');
}, 300));

window.addEventListener('scroll', throttle(() => {
  console.log('Scroll');
}, 100));
```

### 2. 条件判断优化

```javascript
// ❌ 多重判断
if (type === 'a') return 'A';
if (type === 'b') return 'B';
if (type === 'c') return 'C';

// ✅ 对象映射
const typeMap = { a: 'A', b: 'B', c: 'C' };
return typeMap[type];
```

### 3. 循环优化

```javascript
// ❌ 每次迭代计算长度
for (let i = 0; i < arr.length; i++) { }

// ✅ 缓存长度
for (let i = 0, len = arr.length; i < len; i++) { }

// ✅ forEach vs for 循环
// forEach 创建额外函数开销
for (const item of arr) { }
```

## 内存优化

### 1. 避免内存泄漏

```javascript
// ❌ 全局变量
window.data = hugeData;

// ✅ 及时清理
componentWillUnmount() {
  this.timer && clearTimeout(this.timer);
  this.eventBus.off('event', this.handler);
}

// ❌ 闭包泄漏
function leak() {
  const hugeData = new Array(1000000);
  return function() {
    console.log(hugeData);
  };
}
```

### 2. 大数据处理

```javascript
// 分片处理
function processLargeArray(arr, chunkSize = 1000) {
  let index = 0;
  
  function process() {
    const chunk = arr.slice(index, index + chunkSize);
    index += chunkSize;
    
    if (index < arr.length) {
      requestAnimationFrame(process);
    }
  }
  
  process();
}
```

## 监控工具

### 1. Performance API

```javascript
// 记录性能
performance.mark('start');

// 业务代码
doSomething();

performance.mark('end');
performance.measure('doSomething', 'start', 'end');

// 获取结果
const measures = performance.getEntriesByType('measure');
console.log(measures);
```

### 2. Lighthouse

```bash
# Chrome DevTools > Lighthouse > Analyze page load
```

### 3. Web Vitals

```javascript
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

## 总结

- **加载**：代码分割、资源压缩、预加载
- **渲染**：减少重排、虚拟列表、懒加载
- **网络**：CDN、HTTP/2、缓存策略
- **代码**：防抖节流、条件映射、循环优化
- **内存**：避免泄漏、大数据分片
- **监控**：Performance API、Lighthouse
