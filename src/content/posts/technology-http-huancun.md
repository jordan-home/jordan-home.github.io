---
title: "HTTP 缓存机制详解"
pubDate: 2026-02-14
description: "强缓存 / 协商缓存 / Cache-Control / ETag / Last-Modified — 让 Web 真正快的缓存机制。"
category: technology
tags: ["HTTP", "性能优化"]
---

HTTP 缓存是 Web 性能优化的第一性原理。

## 缓存的两类

### 强缓存

浏览器**不发送请求**到服务器，直接用本地缓存。

由 `Cache-Control` 头控制：
- `max-age=3600` — 缓存 1 小时
- `no-cache` — 不直接用，强制协商
- `no-store` — 完全不缓存
- `private` / `public` — 谁可以缓存

### 协商缓存

浏览器还是要发请求，但带条件：
- `If-None-Match: <etag>` — 服务器比较 ETag，匹配就 304
- `If-Modified-Since: <date>` — 服务器比较时间

服务器返回 304 Not Modified 表示缓存还能用。

## ETag vs Last-Modified

| | ETag | Last-Modified |
|---|---|---|
| 精度 | 高（hash） | 秒级 |
| 性能 | 略慢（要计算 hash） | 快（只读文件时间）|
| 多服务器同步 | 容易（自定义 hash） | 难（文件时间不一致）|

**优先用 ETag**。

## 实战配置（Nginx）

```nginx
location /static/ {
  expires 30d;
  add_header Cache-Control "public, immutable";
}

location /api/ {
  add_header Cache-Control "no-store";
}
```

## SPA 静态资源的特殊处理

HTML 文件应该 `no-cache`（总是问服务器确认）。
HTML 文件则要 `immutable` + hash（永远缓存 + 文件名带 hash 保证更新）。

```nginx
location ~* \.(js|css|png|webp|woff2)$ {
  expires 365d;
  add_header Cache-Control "public, immutable";
}
```

设置得当，单页面应用加载时间能从 2s 降到 200ms。