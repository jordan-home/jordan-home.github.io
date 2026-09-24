---
title: "React Hooks 深入理解"
pubDate: 2026-01-05
description: "useState / useEffect / useMemo / useCallback / useRef 的实现原理和正确用法。"
category: technology
tags: ["React", "Hooks"]
---

React Hooks 是 16.8 引入的特性。这篇文章梳理核心 Hook 的内部原理和常见坑。

## useState

组件的状态在每次 render 之间持久化。底层用链表存储 fiber 节点的 memoizedState。

## useEffect

副作用 hook。在 commit 后异步执行。返回的清理函数在下次执行前 / 组件卸载时调用。

## useMemo / useCallback

返回 memoize 后的值 / 函数。仅当依赖变化才重新计算。

## useRef

返回一个稳定的引用对象 `{ current }`，跨 render 保持不变。

## 闭包陷阱

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);  // 永远是 0
    }, 1000);
    return () => clearInterval(id);
  }, []);  // 空依赖，count 被闭包捕获
}
```

解决方法：把 count 加进依赖，或者用 useRef。

## 规则

- 只在最顶层调用
- 只在 React 函数中调用
- 自定义 Hook 必须以 use 开头

Hooks 不是魔法，理解原理才能用对。