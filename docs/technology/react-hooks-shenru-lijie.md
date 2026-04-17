---
title: React Hooks深入理解
date: 2026-01-05
tags:
  - React
  - Hooks
  - 前端
categories:
  - IT
---
## 前言

React Hooks 是 React 16.8 引入的特性，它让我们可以在函数组件中使用 state 和其他 React 特性。本文将深入解析 Hooks 的工作原理和最佳实践。

## useState 的工作原理

`useState` 是最基础的 Hook，用于在函数组件中管理状态。

```javascript
const [count, setCount] = useState(0);
```

### 闭包陷阱

一个常见的误区是闭包陷阱：

```javascript
// 错误的写法
useEffect(() => {
  setInterval(() => {
    console.log(count); // 永远打印初始值 0
  }, 1000);
}, []);

// 正确的写法
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1); // 使用函数式更新
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

### 惰性初始化

当初始值计算成本较高时，使用函数形式：

```javascript
// 每次渲染都会执行
const [data] = useState(expensiveCompute());

// 只在首次渲染时执行
const [data] = useState(() => expensiveCompute());
```

## useEffect 的执行时机

### 清理函数

```javascript
useEffect(() => {
  const subscription = props.source.subscribe();
  
  // 清理函数：在组件卸载或下次 effect 执行前调用
  return () => {
    subscription.unsubscribe();
  };
}, [props.source]);
```

### 依赖数组策略

| 依赖项 | 效果 |
|--------|------|
| `[]` | 仅首次渲染后执行 |
| `[dep]` | dep 变化时执行 |
| 无 | 每次渲染都执行 |

## 自定义 Hook

自定义 Hook 是一个函数，其名称以 "use" 开头：

```javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

## useCallback 与 useMemo

### useCallback

用于缓存函数引用，避免不必要的子组件渲染：

```javascript
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []); // 空依赖意味着函数永远不会变
```

### useMemo

用于缓存计算结果：

```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

## Hooks 规则

1. **只在顶层调用 Hook**：不要在循环、条件或嵌套函数中调用 Hook
2. **只在 React 函数中调用 Hook**：不能在普通函数中调用
3. **使用 ESLint 插件**：安装 `eslint-plugin-react-hooks` 自动强制这些规则

## 性能优化实践

### 1. 避免不必要的渲染

```javascript
// 父组件
const Parent = () => {
  const [count, setCount] = useState(0);
  
  // 使用 useCallback 缓存函数
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <Child onClick={handleClick} />;
};

// 子组件使用 React.memo
const Child = React.memo(({ onClick }) => {
  return <button onClick={onClick}>Click</button>;
});
```

### 2. 合理拆分状态

```javascript
// 不好的写法
const [form, setForm] = useState({ name: '', email: '' });

// 好的写法
const [name, setName] = useState('');
const [email, setEmail] = useState('');
```

## 常见问题

### Q: 为什么 useEffect 会执行两次？

在 React 18 的 Strict Mode 下，组件会挂载、卸载、再挂载，用于检测副作用的清理问题。这是开发模式的正常行为。

### Q: 如何监听多个状态变化？

```javascript
useEffect(() => {
  // 同时监听 a 和 b 的变化
}, [a, b]);
```

## useRef 的使用

`useRef` 用于存储不需要触发重新渲染的可变值：

```javascript
function Timer() {
  const count = useRef(0);
  const timer = useRef(null);
  
  const start = () => {
    timer.current = setInterval(() => {
      count.current++;
      console.log(count.current);
    }, 1000);
  };
  
  const stop = () => {
    clearInterval(timer.current);
  };
  
  return (
    <div>
      <p>{count.current}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### useRef vs useState

| 场景 | useState | useRef |
|------|---------|--------|
| 需要渲染 | ✅ | ❌ |
| 存储可变值 | ✅ | ✅ |
| 保持引用 | ❌ | ✅ |

## React 18 新 Hooks

### useId

生成唯一的 ID，避免 SSR/CSR 不匹配：

```javascript
const id = useId();

return (
  <label htmlFor={id}>
    <input id={id} type="checkbox" />
  </label>
);
```

### useTransition

标记非紧急更新：

```javascript
function SearchResults() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  
  function handleChange(e) {
    startTransition(() => {
      setQuery(e.target.value);
    });
  }
  
  return (
    <div>
      <input onChange={handleChange} />
      {isPending && <Spinner />}
      <Results query={query} />
    </div>
  );
}
```

### useDeferredValue

延迟更新非关键内容：

```javascript
function App({ query }) {
  const deferredQuery = useDeferredValue(query);
  
  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      <ExpensiveList query={deferredQuery} />
    </div>
  );
}
```

### useSyncExternalStore

订阅外部数据源：

```javascript
import { useSyncExternalStore } from 'react';

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}

const isOnline = useOnlineStatus();
```

### useInsertionEffect

CSS-in-JS 注入样式：

```javascript
useInsertionEffect(() => {
  // 在 DOM 更新前注入样式
  const style = document.createElement('style');
  style.textContent = `.${className} { color: red }`;
  document.head.appendChild(style);
  
  return () => {
    document.head.removeChild(style);
  };
}, [className]);
```

## 常见问题

### Q: 自定义 Hook 如何返回多个值？

```javascript
function usePagination(data, pageSize) {
  const [page, setPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = data.slice((page - 1) * pageSize, page * pageSize);
  
  return { currentData, page, setPage, totalPages };
}
```

### Q: 如何在 useEffect 中使用 async 函数？

```javascript
// ❌ 错误
useEffect(async () => {
  const data = await fetchData();
  setData(data);
}, []);

// ✅ 正确
useEffect(() => {
  async function fetchData() {
    const data = await fetchData();
    setData(data);
  }
  fetchData();
}, []);
```

### Q: useMemo 何时使用？

```javascript
// 应该使用
const expensive = useMemo(() => compute(a, b), [a, b]);

// 不需要使用
const [count, setCount] = useState(0);
const doubled = useMemo(() => count * 2, [count]); // 简单计算不需要
```

## 总结

- `useState`：管理简单状态，注意惰性初始化和函数式更新
- `useEffect`：处理副作用，注意清理函数和依赖数组
- `useCallback/useMemo`：性能优化工具
- `useRef`：存储不需要渲染的可变值
- 自定义 Hook：复用状态逻辑
- **React 18 新 hooks**：useId、useTransition、useDeferredValue 等
- 遵循 Hooks 规则，避免常见陷阱
