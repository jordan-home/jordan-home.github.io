---
title: Vue3 响应式原理深度解析
date: 2026-02-06
tags:
  - Vue
  - 响应式
  - 前端
categories:
  - IT
---
## 前言

Vue3 使用 Proxy 重写了响应式系统，相比 Vue2 的 Object.defineProperty，Proxy 提供了更强大和灵活的能力。

## Vue2 响应式的问题

1. **无法监听新增/删除属性**
2. **数组下标修改无法响应**
3. **需要递归遍历所有属性**

```javascript
// Vue2 的问题
const obj = {};
Vue.set(obj, 'newProp', 'value'); // 需要使用 set

arr[0] = 'new'; // 无响应
arr.length = 0; // 无响应
```

## Vue3 响应式系统

### 核心 API

```javascript
import { 
  reactive,    // 响应式对象
  ref,        // 响应式值
  computed,   // 计算属性
  watch,      // 监听器
  effect      // 副作用
} from 'vue';
```

### reactive

```javascript
// 创建响应式对象
const state = reactive({
  name: 'Jordan',
  age: 25,
  skills: ['JavaScript', 'Vue']
});

// 修改会自动触发更新
state.name = 'Tom'; // 视图自动更新
```

### ref

```javascript
import { ref } from 'vue';

// 基本类型使用 ref
const count = ref(0);

// 访问值需要 .value
count.value++;
console.log(count.value);

// 模板中自动解包
// <div>{{ count }}</div>
```

### computed

```javascript
const firstName = ref('Jordan');
const lastName = ref('Wang');

// 计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});

// 依赖变化时自动更新
firstName.value = 'Tom';
console.log(fullName.value); // 'Tom Wang'
```

## 响应式原理

### Proxy 基础

```javascript
const target = {
  name: 'Jordan'
};

const handler = {
  get(target, key, receiver) {
    console.log(`Getting ${key}`);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log(`Setting ${key} to ${value}`);
    return Reflect.set(target, key, value, receiver);
  }
};

const proxy = new Proxy(target, handler);
proxy.name; // 触发 get
proxy.name = 'Tom'; // 触发 set
```

### 简易版响应式实现

```javascript
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      // 收集依赖
      track(target, key);
      // 如果是对象，递归代理
      return typeof result === 'object' 
        ? reactive(result) 
        : result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      // 触发更新
      trigger(target, key);
      return result;
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      trigger(target, key);
      return result;
    }
  };
  
  return new Proxy(target, handler);
}

// 依赖存储
const targetMap = new WeakMap();

function track(target, key) {
  // 收集当前正在执行的 effect
}

function trigger(target, key) {
  // 触发所有关联的 effect
}
```

### 完整的响应式系统

```javascript
let activeEffect = null;

class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
  }
  
  run() {
    activeEffect = this;
    return this.fn();
  }
}

function effect(fn) {
  const effect = new ReactiveEffect(fn);
  effect.run();
}

const targetMap = new WeakMap();

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap = new Map();
      targetMap.set(target, depsMap);
    }
    
    let deps = depsMap.get(key);
    if (!deps) {
      deps = new Set();
      depsMap.set(key, deps);
    }
    
    deps.add(activeEffect);
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  const effects = depsMap.get(key);
  if (effects) {
    effects.forEach(effect => effect.run());
  }
}

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return true;
    }
  };
  
  return new Proxy(target, handler);
}

// 使用
const state = reactive({
  count: 0
});

effect(() => {
  console.log('Count is:', state.count);
});

state.count++; // 自动打印 'Count is: 1'
```

## ref vs reactive

```javascript
import { ref, reactive, isRef, toRefs } from 'vue';

// ref：适合基本类型
const count = ref(0);
const obj = ref({ name: 'Jordan' });
obj.value.name = 'Tom'; // 需要 .value

// reactive：适合对象
const state = reactive({
  name: 'Jordan',
  age: 25
});
state.name = 'Tom'; // 直接修改

// ref 内部实现
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value');
      return value;
    },
    set value(newValue) {
      value = newValue;
      trigger(refObject, 'value');
    }
  };
  return refObject;
}

// 转换
const state = reactive({ a: 1, b: 2 });
const { a, b } = toRefs(state); // a 和 b 变成 ref
```

## watch 和 watchEffect

### watch

```javascript
import { ref, watch } from 'vue';

const count = ref(0);

// 监听 ref
watch(count, (newVal, oldVal) => {
  console.log(`Count changed: ${oldVal} → ${newVal}`);
});

// 监听多个
const name = ref('Jordan');
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('Changed!');
});

// 监听对象
const state = reactive({ a: 1, b: 2 });
watch(
  () => state.a,
  (newVal) => console.log('a changed:', newVal),
  { deep: true }
);
```

### watchEffect

```javascript
import { ref, watchEffect } from 'vue';

const count = ref(0);
const name = ref('Jordan');

watchEffect(() => {
  // 自动收集依赖
  console.log(`Count: ${count.value}, Name: ${name.value}`);
});

count.value++; // 自动触发
```

### 区别

| 特性 | watch | watchEffect |
|------|-------|------------|
| 依赖 | 手动指定 | 自动收集 |
| 触发 | 依赖变化 | 立即执行 |
| 旧值 | 可以访问 | 无法访问 |

## 深层响应式

```javascript
const state = reactive({});

// 新增属性 - 响应式
state.newProp = 'value';

// 删除属性 - 响应式
delete state.prop;

// 数组操作 - 响应式
const arr = reactive([]);
arr.push(1);
arr[0] = 'new'; // Vue3 支持！
```

## 性能优化

### shallowRef 和 shallowReactive

```javascript
import { shallowRef, shallowReactive } from 'vue';

// shallowRef：只追踪 .value 变化
const count = shallowRef({ n: 0 });
count.value.n = 100; // 不触发更新！
count.value = { n: 100 }; // 触发更新

// shallowReactive：只做浅层响应
const state = shallowReactive({
  name: 'Jordan',
  deep: { a: 1 }
});
state.name = 'Tom'; // 触发
state.deep.a = 100; // 不触发！
```

### trigger 和 stop

```javascript
import { triggerRef, stop } from 'vue';

const count = shallowRef(0);

effect(() => {
  console.log(count.value);
});

// 手动触发
triggerRef(count);

// 停止响应
stop(effect);
```

## 常见问题

### 1. 响应式丢失

```javascript
// 问题：解构后失去响应
const { name } = reactive({ name: 'Jordan' });
name = 'Tom'; // 失去响应！

// 解决：使用 toRefs
const { name } = toRefs(reactive({ name: 'Jordan' }));
name.value = 'Tom'; // 保持响应
```

### 2. 循环引用

```javascript
// 问题：循环引用的对象
const obj = reactive({
  self: obj // 报错！
});

// 解决：使用原始值
const obj = reactive({});
obj.self = obj;
```

### 3. 模板中的响应式

```javascript
// 模板中不需要 .value
<template>
  <div>{{ count }}</div>
  <div>{{ obj.name }}</div>
</template>

<script>
const count = ref(0);
const obj = reactive({ name: 'Jordan' });
</script>
```

## 总结

- **Vue3 使用 Proxy**：更强大的拦截能力
- **reactive**：适合对象
- **ref**：适合基本类型，内部也是用 reactive 实现
- **computed**：基于 effect 的计算属性
- **watch/watchEffect**：监听响应式数据变化
- **性能优化**：shallowRef、shallowReactive
