---
title: "设计模式之观察者模式"
pubDate: 2026-02-22
description: "观察者模式：对象间一对多依赖，当一个对象改变状态时，所有依赖者收到通知。"
category: technology
tags: ["设计模式"]
---

观察者模式是前端最常用的模式之一（DOM 事件、Vue 响应式、Redux store）。

## 经典实现

```javascript
class Subject {
  constructor() { this.observers = []; }
  subscribe(observer) { this.observers.push(observer); }
  unsubscribe(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  notify(data) {
    this.observers.forEach(o => o.update(data));
  }
}

class Observer {
  update(data) { console.log('Received:', data); }
}
```

## 实际应用

- **DOM 事件**：`element.addEventListener('click', handler)`
- **Vue 响应式**：组件订阅 store 变化
- **WebSocket**：客户端订阅服务端消息
- **Redux store**：组件订阅 state 变化

## 现代 JS 替代

### 1. EventTarget（浏览器原生）

```javascript
const target = new EventTarget();
target.addEventListener('message', (e) => console.log(e.detail));
target.dispatchEvent(new CustomEvent('message', { detail: data }));
```

### 2. RxJS

流式 + 操作符，比手写观察者强 100 倍：

```javascript
import { Subject } from 'rxjs';
const subject = new Subject();
subject.subscribe(v => console.log(v));
subject.next(42);
```

## 注意事项

- **内存泄漏**：组件卸载时记得取消订阅
- **循环依赖**：A 监听 B 变化，B 监听 C 变化，C 监听 A → 死循环
- **同步 vs 异步通知**：异步更安全（不会阻塞发布者）

观察者模式 = 解耦发布者和订阅者。**前端几乎所有框架都在用它**。