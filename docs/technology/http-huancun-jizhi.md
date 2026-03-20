---
title: HTTP 缓存机制详解
date: 2026-02-14
tags:
  - HTTP
  - 性能优化
  - 前端
categories:
  - IT
---

## 前言

HTTP 缓存是前端性能优化的重要手段，合理使用缓存可以大幅提升用户体验和减少服务器负载。

## 缓存类型

### 1. 浏览器缓存

- **强缓存**：不发送请求，直接使用缓存
- **协商缓存**：需要发送请求，由服务器决定是否使用缓存

### 2. 代理缓存

- CDN、负载均衡器等中间代理的缓存

## 强缓存

### Cache-Control

```http
Cache-Control: max-age=3600
```

常用指令：

| 指令 | 说明 |
|------|------|
| max-age=seconds | 缓存有效期（秒） |
| no-cache | 需协商缓存 |
| no-store | 不缓存 |
| private | 仅浏览器缓存 |
| public | 可被代理缓存 |

```http
# 缓存1小时
Cache-Control: max-age=3600

# 不缓存
Cache-Control: no-store

# 每次都要验证
Cache-Control: no-cache

# 私有缓存，仅浏览器
Cache-Control: private, max-age=3600

# 公共缓存，可被CDN
Cache-Control: public, max-age=3600
```

### Expires

```http
Expires: Wed, 21 Oct 2026 07:28:00 GMT
```

**注意**：Cache-Control 优先级高于 Expires

## 协商缓存

### Last-Modified / If-Modified-Since

```http
# 响应头
Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT

# 请求头
If-Modified-Since: Wed, 21 Oct 2026 07:28:00 GMT
```

服务器判断：

- **未修改**：返回 304 Not Modified
- **已修改**：返回 200 + 新内容

### ETag / If-None-Match

```http
# 响应头
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 请求头
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

ETag 优先级高于 Last-Modified

### 流程图

```
浏览器请求 → 服务器检查 ETag/Last-Modified
                ↓
        内容未修改 → 304 Not Modified（使用缓存）
                ↓
        内容已修改 → 200 OK + 新内容
```

## 前端实践

### 1. HTML 缓存策略

```html
<!-- 不缓存 HTML -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### 2. 静态资源缓存

```javascript
// Webpack 配置 filename hash
// bundle.js → bundle.abc123.js

// Nginx 配置
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 30d;
  add_header Cache-Control "public, max-age=2592000";
}
```

### 3. Vue/React 路由懒加载

```javascript
// Vue
const Home = () => import(/* webpackChunkName: "home" */ './Home.vue');

// React
const Home = React.lazy(() => import('./Home'));
```

### 4. Service Worker 缓存

```javascript
// sw.js
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = ['/', '/index.html', '/styles/main.css'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

## 缓存策略

### 1. 频繁变更的资源

```http
Cache-Control: no-cache
```

### 2. 长期不变的资源

```http
Cache-Control: public, max-age=31536000, immutable
```

### 3. 用户私有数据

```http
Cache-Control: private, no-cache
```

### 4. API 请求

```http
Cache-Control: no-cache, no-store
```

## 实际案例

### 图片缓存

```javascript
// 图片使用 hash 命名
// logo.png → logo.a1b2c3d4.png

// HTML
<img src="/images/logo.a1b2c3d4.png" alt="Logo">
```

### API 缓存示例

```javascript
// 使用 localStorage 缓存 API 响应
const cacheAPI = async (key, fetchFn, expireTime = 5 * 60 * 1000) => {
  const cached = localStorage.getItem(key);
  const now = Date.now();
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < expireTime) {
      return data;
    }
  }
  
  const data = await fetchFn();
  localStorage.setItem(key, JSON.stringify({ data, timestamp: now }));
  return data;
};

// 使用
const users = await cacheAPI('users', () => fetch('/api/users').then(r => r.json()));
```

## Chrome 调试

### 1. 查看缓存状态

1. 打开开发者工具 → Network
2. 查看 Size 列
3. **from disk cache**：强缓存
4. **200 (from memory cache)**：内存缓存

### 2. 查看响应头

1. 点击请求 → Headers
2. 查看 Response Headers 中的 Cache-Control、ETag、Last-Modified

### 3. 禁用缓存

1. 开发者工具 → Network → Disable cache
2. 勾选后刷新页面

## 常见问题

### 1. 缓存失效问题

```javascript
// 问题：更新了 JS 文件，但用户还是用旧版本

// 解决：使用 hash
// bundle.js → bundle.abc123.js
```

### 2. 缓存穿透

```javascript
// 问题：频繁请求不存在的资源

// 解决：设置较短的缓存时间
```

### 3. 缓存一致性

```javascript
// 问题：服务器更新了，但用户看到旧数据

// 解决：使用版本号/ETag
const url = `/api/data?v=${version}`;
```

## 最佳实践

1. **HTML**：不缓存或短期缓存
2. **静态资源**：长期缓存 + hash 命名
3. **API**：根据业务选择合适的缓存策略
4. **图片**：长期缓存
5. **用户数据**：不缓存或私有缓存

## 总结

- **强缓存**：Cache-Control、Expires
- **协商缓存**：ETag、Last-Modified
- **前端优化**：hash 命名、Service Worker
- **调试**：Chrome DevTools Network 面板
- **策略**：根据资源类型选择合适的缓存策略
