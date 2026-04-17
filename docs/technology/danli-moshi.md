---
title: 设计模式之单例模式
date: 2026-01-15
tags:
  - 设计模式
  - 前端
categories:
  - 技术笔记
  - IT
---
## 前言

单例模式（Singleton Pattern）是最简单的创建型设计模式，确保一个类只有一个实例，并提供一个全局访问点。

## 什么是单例模式

单例模式的核心特征：
1. 只有一个实例
2. 自行创建这个实例
3. 向整个系统提供这个实例

## JavaScript 实现

### 1. 对象字面量（最简单）

```javascript
const singleton = {
  prop: 'value',
  method() {
    return 'hello';
  }
};
```

### 2. 模块模式

```javascript
const Singleton = (function() {
  let instance;
  
  function init() {
    return {
      prop: 'value',
      method() {
        return 'singleton method';
      }
    };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
})();

const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
```

### 3. Class 实现（ES6）

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    this.data = [];
  }
  
  add(item) {
    this.data.push(item);
  }
  
  getData() {
    return this.data;
  }
}

const s1 = new Singleton();
const s2 = new Singleton();
console.log(s1 === s2); // true
```

### 4. 代理模式实现单例

```javascript
class Singleton {
  constructor() {
    this.data = [];
  }
  
  add(item) {
    this.data.push(item);
  }
}

const ProxySingleton = (function() {
  let instance;
  
  return function() {
    if (!instance) {
      instance = new Singleton();
    }
    return instance;
  };
})();
```

## TypeScript 实现

```typescript
class Singleton {
  private static instance: Singleton;
  private constructor() {}
  
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
```

## 前端实际应用场景

### 1. Vuex/Redux Store

```javascript
// Vuex 本质上是一个单例
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});
```

### 2. 模态框管理

```javascript
class ModalManager {
  constructor() {
    if (ModalManager.instance) {
      return ModalManager.instance;
    }
    ModalManager.instance = this;
    this.activeModal = null;
  }
  
  open(modal) {
    if (this.activeModal) {
      this.close();
    }
    this.activeModal = modal;
    modal.show();
  }
  
  close() {
    if (this.activeModal) {
      this.activeModal.hide();
      this.activeModal = null;
    }
  }
}
```

### 3. 本地缓存管理

```javascript
class CacheManager {
  constructor() {
    if (CacheManager.instance) {
      return CacheManager.instance;
    }
    CacheManager.instance = this;
    this.cache = new Map();
    this.expireTime = 1000 * 60 * 5; // 5分钟
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      expire: Date.now() + this.expireTime
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expire) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
}
```

### 4. 日志管理器

```javascript
class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    Logger.instance = this;
    this.logs = [];
  }
  
  log(message, level = 'info') {
    const entry = {
      message,
      level,
      timestamp: new Date().toISOString()
    };
    this.logs.push(entry);
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
  
  error(message) {
    this.log(message, 'error');
  }
  
  getLogs() {
    return this.logs;
  }
}
```

## 单例模式的优缺点

### 优点

1. **节约资源**：只创建一个实例，减少内存开销
2. **全局访问**：提供统一的访问点
3. **懒加载**：可以延迟创建实例

### 缺点

1. **违反单一职责**：既负责创建又负责业务
2. **全局状态**：可能导致意外的依赖关系
3. **测试困难**：单例状态难以重置

## 单例 vs 静态类

| 特性 | 单例模式 | 静态类 |
|------|---------|--------|
| 实例化 | 延迟 | 立即 |
| 继承 | 可继承 | 不可继承 |
| 接口 | 可实现 | 不可实现 |
| 状态 | 可有实例状态 | 只能是静态方法 |
| 线程安全 | 需要考虑 | 天然安全 |

## 线程安全实现（双重检查锁定）

```javascript
class ThreadSafeSingleton {
  constructor() {
    if (ThreadSafeSingleton.instance) {
      return ThreadSafeSingleton.instance;
    }
    
    // 双重检查锁定
    if (!ThreadSafeSingleton.lock) {
      ThreadSafeSingleton.instance = this;
    }
    
    this.data = [];
  }
  
  static getInstance() {
    if (!ThreadSafeSingleton.instance) {
      synchronized(this) {
        if (!ThreadSafeSingleton.instance) {
          ThreadSafeSingleton.instance = new ThreadSafeSingleton();
        }
      }
    }
    return ThreadSafeSingleton.instance;
  }
}
```

## 总结

单例模式是前端开发中非常实用的设计模式，适用于：
- 全局状态管理
- 资源缓存
- 工具类
- 业务逻辑中需要唯一实例的场景

使用时注意避免滥用导致的全局污染问题。
