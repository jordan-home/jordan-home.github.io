---
title: 设计模式之观察者模式
date: 2026-02-22
tags:
  - 设计模式
categories:
  - IT
---

## 前言

观察者模式（Observer Pattern）是一种行为型设计模式，定义了对象间的一对多依赖关系。

## 概念

当一个对象状态改变时，所有依赖它的对象都会收到通知并自动更新。

```
Subject(Subject) ←──── Observer(观察者)
     ↓                     
  状态改变                  
     ↓                     
  notify() → observer1.update()
             observer2.update()
```

## JavaScript 实现

### 1. 基础实现

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  removeObserver(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  
  update(data) {
    console.log(`${this.name} 收到更新:`, data);
  }
}

// 使用
const subject = new Subject();
const obs1 = new Observer('Observer1');
const obs2 = new Observer('Observer2');

subject.addObserver(obs1);
subject.addObserver(obs2);
subject.notify({ message: 'Hello!' });
```

### 2. 完整实现

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
  
  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(cb => cb(...args));
  }
  
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// 使用
const emitter = new EventEmitter();

emitter.on('message', (data) => {
  console.log('Handler 1:', data);
});

emitter.on('message', (data) => {
  console.log('Handler 2:', data);
});

emitter.emit('message', { text: 'Hello' });
```

## 前端应用

### 1. 事件总线

```javascript
// eventBus.js
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export const eventBus = new EventBus();
```

### 2. Vue 响应式

```javascript
// Vue2 观察者模式
new Vue({
  data: {
    message: 'Hello'
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    }
  },
  watch: {
    message(newVal) {
      console.log('message 变化了:', newVal);
    }
  }
});
```

### 3. 状态管理

```javascript
// 简化版 Redux
class Store {
  constructor(reducer) {
    this.state = reducer(undefined, { type: '@@INIT' });
    this.listeners = [];
    this.reducer = reducer;
  }
  
  getState() {
    return this.state;
  }
  
  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener(this.state));
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// 使用
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    default: return state;
  }
};

const store = new Store(counter);
store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'INCREMENT' });
```

### 4. DOM 事件

```javascript
// 原生 DOM 事件就是观察者模式
element.addEventListener('click', handler1);
element.addEventListener('click', handler2);
element.dispatchEvent(new Event('click'));
```

## 发布-订阅模式

```javascript
class PubSub {
  constructor() {
    this.topics = {};
  }
  
  subscribe(topic, callback) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }
    this.topics[topic].push(callback);
  }
  
  publish(topic, data) {
    if (this.topics[topic]) {
      this.topics[topic].forEach(cb => cb(data));
    }
  }
  
  unsubscribe(topic, callback) {
    if (this.topics[topic]) {
      this.topics[topic] = this.topics[topic].filter(cb => cb !== callback);
    }
  }
}

// 使用
const pubsub = new PubSub();

pubsub.subscribe('user:login', (user) => {
  console.log('用户登录:', user.name);
});

pubsub.publish('user:login', { name: 'Jordan', id: 1 });
```

## 观察者 vs 发布-订阅

| 特性 | 观察者模式 | 发布-订阅模式 |
|------|-----------|--------------|
| 耦合度 | 较高 | 较低 |
| 通信 | 直接通信 | 通过中间件 |
| 依赖 | Subject 知道 Observer | 发布者/订阅者不直接联系 |

## 总结

- **核心**：一对多依赖，状态变化自动通知
- **实现**：addObserver/removeObserver/notify
- **应用**：事件总线、状态管理、响应式系统
- **变体**：发布-订阅模式更解耦
