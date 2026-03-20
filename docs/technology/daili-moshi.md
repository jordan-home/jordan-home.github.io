---
title: 设计模式之代理模式
date: 2026-03-12
tags:
  - 设计模式
categories:
  - IT
---

## 前言

代理模式（Proxy Pattern）为其他对象提供一种代理以控制对这个对象的访问。

## 概念

```
Client → Proxy → RealSubject
```

代理对象在客户端和真实对象之间起到中介作用。

## JavaScript 实现

### 1. 基础代理

```javascript
class RealSubject {
  request() {
    return 'RealSubject: 处理请求';
  }
}

class Proxy {
  constructor() {
    this.realSubject = new RealSubject();
  }
  
  request() {
    // 可以在调用前后添加额外逻辑
    console.log('Proxy: 调用前处理');
    const result = this.realSubject.request();
    console.log('Proxy: 调用后处理');
    return result;
  }
}

// 使用
const proxy = new Proxy();
proxy.request();
```

### 2. ES6 Proxy

```javascript
const target = {
  name: 'Jordan',
  age: 25
};

const handler = {
  get(target, property) {
    console.log(`访问 ${property}`);
    return target[property];
  },
  
  set(target, property, value) {
    console.log(`设置 ${property} = ${value}`);
    target[property] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);
proxy.name;      // 触发 get
proxy.age = 30;  // 触发 set
```

## 实际应用

### 1. 保护代理（权限控制）

```javascript
class User {
  constructor(role) {
    this.role = role;
  }
  
  request(method) {
    return `执行 ${method}`;
  }
}

class ProtectedResource {
  constructor(user) {
    this.user = user;
  }
  
  request(method) {
    if (this.user.role !== 'admin') {
      return '权限不足';
    }
    return new User(this.user.role).request(method);
  }
}

const admin = new User('admin');
const guest = new User('guest');

console.log(new ProtectedResource(admin).request('delete')); // 执行 delete
console.log(new ProtectedResource(guest).request('delete')); // 权限不足
```

### 2. 虚拟代理（懒加载）

```javascript
class HeavyImage {
  constructor(url) {
    this.url = url;
    console.log(`加载图片: ${url}`);
  }
  
  display() {
    console.log('显示图片');
  }
}

class ImageProxy {
  constructor(url) {
    this.url = url;
    this.image = null;
  }
  
  display() {
    if (!this.image) {
      this.image = new HeavyImage(this.url);
    }
    this.image.display();
  }
}

// 使用 - 真正显示时才加载
const img = new ImageProxy('big-photo.jpg');
img.display(); // 第一次调用才加载
img.display(); // 第二次直接使用缓存
```

### 3. 缓存代理

```javascript
class Calculate {
  factorial(n) {
    console.log(`计算 ${n} 的阶乘`);
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}

class CacheProxy {
  constructor() {
    this.calculate = new Calculate();
    this.cache = {};
  }
  
  factorial(n) {
    if (this.cache[n] !== undefined) {
      console.log(`使用缓存: ${n}! = ${this.cache[n]}`);
      return this.cache[n];
    }
    
    const result = this.calculate.factorial(n);
    this.cache[n] = result;
    return result;
  }
}

// 使用
const proxy = new CacheProxy();
proxy.factorial(5);  // 真实计算
proxy.factorial(5);  // 使用缓存
```

### 4. 日志代理

```javascript
class LogProxy {
  constructor(target) {
    this.target = target;
  }
  
  get(property) {
    console.log(`读取 ${property}: ${this.target[property]}`);
    return this.target[property];
  }
  
  set(property, value) {
    console.log(`设置 ${property}: ${value} → ${this.target[property]}`);
    this.target[property] = value;
    return true;
  }
  
  callMethod(method, ...args) {
    console.log(`调用方法 ${method}(${args})`);
    const result = this.target[method](...args);
    console.log(`方法返回: ${result}`);
    return result;
  }
}
```

### 5. 数据验证

```javascript
class Validator {
  validate(target) {
    const errors = [];
    
    for (const [prop, rules] of Object.entries(rules)) {
      const value = target[prop];
      
      if (rules.required && !value) {
        errors.push(`${prop} is required`);
      }
      
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${prop} must be ${rules.type}`);
      }
      
      if (rules.min && value < rules.min) {
        errors.push(`${prop} must be at least ${rules.min}`);
      }
    }
    
    return errors;
  }
}

const user = { name: 'Jordan', age: 17 };
const rules = {
  name: { required: true, type: 'string' },
  age: { required: true, type: 'number', min: 18 }
};

console.log(new Validator().validate(user)); // ['age must be at least 18']
```

## Vue3 中的代理

### 1. Reactive

```javascript
import { reactive } from 'vue';

const state = reactive({
  count: 0
});

// 内部使用 Proxy 实现响应式
```

### 2. 自定义 Ref

```javascript
import { ref, customRef } from 'vue';

function useStorage(key, initialValue) {
  return customRef((track, trigger) => ({
    get() {
      track();
      return localStorage.getItem(key) || initialValue;
    },
    set(value) {
      localStorage.setItem(key, value);
      trigger();
    }
  }));
}

const name = useStorage('name', 'Jordan');
```

## 总结

- **保护代理**：权限控制
- **虚拟代理**：懒加载
- **缓存代理**：结果缓存
- **日志代理**：操作日志
- **ES6 Proxy**：更简洁的实现方式

适用场景：
- 访问控制
- 懒加载
- 缓存
- 日志记录
- 数据验证
