---
title: TypeScript高级类型
date: 2026-01-08
tags:
  - TypeScript
  - 前端
categories:
  - IT
---

## 前言

TypeScript 的高级类型系统是其核心优势之一。本文将介绍条件类型、映射类型、工具类型等高级特性。

## 条件类型

条件类型根据类型关系选择类型：

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
```

### 分布式条件类型

当条件类型的检查类型是联合类型时，会发生分布式处理：

```typescript
type ToArray<T> = T extends any ? T[] : never;

type StrOrNumArr = ToArray<string | number>;
// 等同于: string[] | number[]
```

## 映射类型

映射类型通过遍历已有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }
```

### 带修饰符的映射

```typescript
// 移除 readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// 移除 ?
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

## 常用工具类型

### Partial 和 Required

```typescript
interface Config {
  host?: string;
  port?: number;
}

// 所有属性变为可选
type PartialConfig = Partial<Config>;

// 所有属性变为必需
type RequiredConfig = Required<Config>;
```

### Pick 和 Omit

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// 选择特定属性
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

// 排除特定属性
type UserWithoutPassword = Omit<User, 'password'>;
// { id: number; name: string; email: string; }
```

### Record

```typescript
type Role = 'admin' | 'user' | 'guest';

const permissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};
```

### Extract 和 Exclude

```typescript
type T = Extract<'a' | 'b' | 'c', 'a' | 'f'>;  // 'a'
type U = Exclude<'a' | 'b' | 'c', 'a'>;          // 'b' | 'c'
```

## 模板字面量类型

TypeScript 4.1+ 支持模板字面量类型：

```typescript
type EventName = 'click' | 'focus' | 'blur';
type Handler = `on${Capitalize<EventName>}`;
// type Handler = "onClick" | "onFocus" | "onBlur"

type Path = '/users' | '/posts';
type APIEndpoint = `https://api.example.com${Path}`;
// "https://api.example.com/users" | "https://api.example.com/posts"
```

## 协变与逆变

### 协变

返回值类型协变：

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

// 函数参数逆变
type AnimalFn = (animal: Animal) => Animal;
type DogFn = (dog: Dog) => Dog;

// AnimalFn 不能赋值给 DogFn（不安全）
// DogFn 可以赋值给 AnimalFn（安全）
```

### 解决类型问题

```typescript
class Animal {}
class Dog extends Animal { bark() {} }

interface Cache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
}

// 协变：输出可以是 T 的子类
interface CovariantCache<T> {
  get(key: string): T;
}

// 逆变：输入必须是 T 的父类
interface ContravariantCache<T> {
  set(key: string, value: T): void;
}
```

## 类型守卫

### typeof

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value;
}
```

### instanceof

```typescript
if (error instanceof Error) {
  console.log(error.message);
}
```

### 自定义类型守卫

```typescript
interface Fish { swim(): void }
interface Bird { fly(): void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
}
```

## 总结

- **条件类型**：根据类型关系动态选择类型
- **映射类型**：通过遍历键创建新类型
- **工具类型**：Partial、Pick、Omit、Record 等
- **模板字面量类型**：构建精确的字符串类型
- **类型守卫**：在运行时精确判断类型

## infer 关键字

`infer` 用于在条件类型中提取类型：

```typescript
// 提取数组元素类型
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type Str = ArrayElement<string[]>;  // string
type Num = ArrayElement<number[]>;  // number

// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => number;
type R = ReturnType<Fn>;  // number

// 提取函数参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type Params = Parameters<(a: string, b: number) => void>;
// [string, number]
```

## satisfies 操作符

`satisfies` 验证类型但不改变类型：

```typescript
const config = {
  port: 3000,
  host: 'localhost'
} satisfies Record<string, string | number>;

// config 类型保持 { port: number; host: string }
// 但会验证是否符合 Record<string, string | number>

// 对比
const config1 = { port: 3000 } as Record<string, number>;
// 类型被断言为 Record<string, number>

const config2 = { port: 3000 } satisfies Record<string, number>;
// 类型保持 { port: number }
```

## 实用类型技巧

### Deep Partial（深层可选）

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface User {
  name: string;
  address: {
    city: string;
    street: string;
  };
}

type PartialUser = DeepPartial<User>;
// { name?: string; address?: { city?: string; street?: string } }
```

### Deep Readonly（深层只读）

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type FrozenUser = DeepReadonly<User>;
// { readonly name: string; readonly address: readonly { ... } }
```

### Nullable（可空）

```typescript
type Nullable<T> = T | null;

type MaybeString = Nullable<string>;  // string | null
```

### Widen（类型宽化）

```typescript
const obj = {
  x: 0,  // 类型为 number
} as const;
// as const 让类型更具体

type ObjType = typeof obj;
// { readonly x: 0 } 而不是 { x: number }
```

## 总结

- **条件类型**：根据类型关系动态选择类型
- **映射类型**：通过遍历键创建新类型
- **工具类型**：Partial、Pick、Omit、Record 等
- **模板字面量类型**：构建精确的字符串类型
- **类型守卫**：在运行时精确判断类型
- **infer**：提取类型
- **satisfies**：验证类型
