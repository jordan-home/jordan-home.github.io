---
title: TS小点
date: 2021-5-28
sidebar: auto
categories:
  - IT
tags:
  - TS
---

## 类型定义
1. `null` 、`undefined`是任意类型的子类型
2. `any` 需要谨慎使用，防止TS变成`AnyScript`,代替`any`,我们可以使用`unknown`。`unknown`相对于`any`的区别是，在未赋值的情况下，不可以被实例化、getter操作、以及作为函数使用
3. `never`是任何类型的子类型，在此前提下，任何类型都不是它的子类型。表示永不存在值的类型。
4. 比数组更严格的声明：元组 `let arr: [number, string] = ['1', 1]`
5. 枚举类型，注意命名方式：
```typescript
enum Human {
  Man = 'man',
  Woman = 'woman',
}
```
6. interface 声明对象类型：对象的某属性只读
```typescript
interface Animal {}
interface Job {
  ...
}
interface Human extends Animal {
  name: string
  job?: Job
  readonly dna: string
  cry: () => string
}
```

## 类Class
`abstract`抽象类: 可以被继承，无法实例化
`public`属性（默认属性)
`private`属性: 只能在类的内部使用
`protected`属性: 仅类和子类的内部访问

```typescript
abstract class Human {
  abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
class Man extends Human {
  makeSound() {
    console.log('miao miao')
  },
  walk() {
    console.log('walk)
  },
  public cry() {
    console.log('cry)
  },
  private ask() {
    console.log('ask...')
  }
  protected run() {
    console.log('启动...')
  }
}

const Tom = new Man()
```

🌟类也可以作为接口来使用🌟

```typescript
export default class Props {
  public animation: string = 'easeInOutQuad'
  public isAuto: boolean = true
  public autoPlayInterval: number = 4500
  public afterChange: () => {}
}

function createPerson(data: Props) {} // 作为接口
public static defaultProps = new Props() // 也可以用来设置初始值
```

## 函数的重载

看代码：

```typescript
interface Person {
  name: string
  job?: Job
  age?: number
}
function makePerson(name: string): Person
function makePerson(name: string, job: Job): Person
function makePerson(name: string, age: number, job: Job): Person
function makePerson(a: string, b?: Job | number, c?: Job) {
  ...
}

makePerson(x1)
makePerson(x1, x2)
makePerson(x1, x2, x3)
```

## 泛型

### 基础概念

```typescript
function returnItemOne<T>(para: T): T {
    return para
}
// such as: boolean => boolean

function returnItemMore<T, U>(para: [T, U]): [U, T] {
    return para
}
// such as: ([string, number]) => [number, string]
```

`<X>`用于捕获参数的类型。

上述代码分别表示参数与返回值类型一致，以及参数和返回值类型的对应关系。

### 泛型变量

```typescript
function getArrayLength<T>(arg: Array<T>) {
  console.log((arg as Array<any>).length) // ok
  return arg
}
```

### 泛型接口

```typescript
interface ReturnItemFn<T> {
    (para: T): T
}
const returnItem: ReturnItemFn<string> = param => param
```

### 泛型类

```typescript
class List<T> {
  private data: T[] = []
  public add(item: T) {
    this.data.push(item)
  }
}
```

### 泛型约束和类型索引

上述都没有对T进行约束，如果想要对T进行约束，比如只能接收 string或number

则：

```typescript
type A = string | number
class List<T extends A> { ... }
...
```

```typescript
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key] // ok
}
```

## 断言

正常非必要情况下不推荐使用

```typescript
interface Person {
  name: string
  age: number
}

const p1 = {}
p1.name = 'HA' // error

const p2 = {} as Person
p2.name = 'HJ' // right

const p3 = 'KK' as Person //error

const p4 = 'LL' as any as Person // right

```

## 类型守卫

`instanceof`   `in`  字面量

```typescript
class A {}
class B {
  kind: 'bar'; // 字面量类型
}
class C {
  name = 'xiaomuzhu';
	age = 20;
  kind: 'foo'; // 字面量类型
}
function Call(p1: A | B, p2: B | C) {
  ...
  if (p1 instanceof A) {...}
  if (age in p2) {...}
  if (p2.kind === 'bar') {...}
  if (p1 instanceof B) {...}
  ...
}
```

## interface 和 type 区别

interface 只能用于定义对象类型，而 type 的声明方式除了对象之外还可以定义交叉、联合、原始类型等，类型声明的方式适用范围显然更加广泛。

但是interface也有其特定的用处：

- interface 方式可以实现接口的 extends 和 implements
- interface 可以实现接口合并声明

## 明确赋值断言

上代码：

```typescript
let x: number
setValue()
console.log(x + x) // error
console.log(x! + x!) // right
function setValue() {
  x = 260
}
```

`!`表示该属性or变量已经明确赋值，所以不检查是否已经赋值

## is 关键字

```typescript
function isNumber(x: any): x is number {
  return typeof x === 'number'
}

if (isNumber(X)) {
  // 此时可以使用基于X是number前提下的方法，
  // 如果没有 `x is number`, 使用基于X是number前提下的方法，ts会报错，
}

```

## React 中使用 TS

1. 对于无状态组件（也叫做傻瓜组件、渲染组件），定义Props时，如果可以内嵌`children`，我们需要在props中另外定义:`children: ReactNode`。此时可以使用`type SFC<P>`,它本身已经包含了`children`定义

   ```tsx
   const Item: React.SFC<MyProp> = prop => {
     return (...)
   }
   ```