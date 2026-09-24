---
title: "设计模式之代理模式"
pubDate: 2026-03-12
description: "代理模式：为对象提供替身，控制对原对象的访问（懒加载、缓存、权限、防火墙）。"
category: technology
tags: ["设计模式"]
---

代理模式给一个对象一个替身，用这个替身控制对原对象的访问。

## 类型

### 1. 虚拟代理（懒加载）

图片懒加载：先显示模糊小图，加载完再换大图。

### 2. 缓存代理

计算结果缓存起来，下次直接返回。

### 3. 保护代理

鉴权后才允许访问。

### 4. 远程代理

RPC：本地调用，实际请求远程服务。

## 经典实现

```javascript
class Image {
  constructor(url) {
    this.url = url;
    this.load();
  }
  load() { /* 加载 */ }
  display() { /* 显示 */ }
}

class ProxyImage {
  constructor(url) {
    this.url = url;
    this.image = null;
  }
  display() {
    if (!this.image) this.image = new Image(this.url);
    this.image.display();
  }
}
```

## ES6 Proxy（语言级支持）

```javascript
const user = { name: 'Jordan', age: 30 };

const proxy = new Proxy(user, {
  get(target, key) {
    console.log(`Read ${key}`);
    return target[key];
  },
  set(target, key, value) {
    if (key === 'age' && value < 0) throw new Error('Invalid age');
    target[key] = value;
    return true;
  },
});
```

## 实战应用

### Vue 3 响应式

```javascript
const state = reactive({ count: 0 });
// reactive 内部就是 Proxy
state.count++;  // 触发依赖更新
```

### 数据校验

```javascript
const validator = new Proxy(form, {
  set(target, key, value) {
    if (!validate(key, value)) throw new Error(`Invalid ${key}`);
    target[key] = value;
    return true;
  },
});
```

### 调试日志

```javascript
const logged = new Proxy(obj, {
  get(target, key) {
    console.log(`Get ${key}`);
    return target[key];
  },
});
```

## 经典框架里的代理

- Vue 3：响应式基于 Proxy
- Mobx：observable 基于 Proxy
- Vue Router：路由懒加载
- Express middleware：函数代理链

Proxy 让代理模式在 JS 里变得极其强大。