---
title: JS中的类型以及内建函数
date: 2021-5-7
sidebar: auto
categories:
  - IT
tags:
  - 读书笔记
  - JS
---

::: tip 书籍简介

书名：《你不知掉的JavaScript（中卷）》～`类型` 、 `值`和`原生函数`

作者：[美] Kyle Simpson

分类：IT

:::

<!-- more -->

## 类型

类型指的是值的类型，变量没有类型

### 基础类型

* null: 基本类型中唯一的假值

* undefined: 已声明但是没有赋值。和未声明变量还是有区别的，当使用未声明变量时会报错，`typeof X`和`window.X`例外。
  ```js
  let undefined = 12
  function kk() { var undefined = 100; console.log(undefined)}
  kk() // 100
  undefined // undefined
  void 表达式 // 没有返回值，所以返回undefined
  ```

* string

* symbol

* number

  js中最大的值：Number.MAX_VALUE < Infinity

  ```js
  2e3 // 2 * 10^3 = 2000

  var a = 4.1
  a.toFixed(0) // 4
  a.toFixed(3) // 4.100
  4.toFixed(1) // Uncaught SyntaxError: Invalid or unexpected token
  4..toFixed(1) // (4).toFixed(1) 0.4.toFixed(1) 正常
  NaN !== NaN // true
  Number.isNaN('xx')
  Objece.is(a,b) //是否绝对相等，适用于特殊的相等比较，一般优先 == ===
  ```

  * 浮点数

    0.1 + 0.2 !== 0.3

    解决办法 `(x1 + x2) - x3 < Number.EPSILON`

  * 整数

    最大安全整数 **Number.MIN_SAFE_INTEGER**

    判断是不是安全整数 Number.isSafeInteger(nn)

    判断是整数：Number.isInteger(nn)

* boolean

### 引用类型

* object

#### object的一些子类型

* map等

* function
  ```js
  typeof function a(p1, p2) {...} === 'function' // true
  a.length // 2
  ```

* 数组
  ```js
  typeof [1,2] === 'object' // true
  // 复制数组
  Array.from([...])
  [...].slice()
  ```

> ⚠️  typeof
>
> typeof   操作符可以用来判断值的类型,但是在判断null时，由于历史原因, typeof null === 'object'

## 内建函数

内建函数，别名原生函数

常见包括：
```js
// String()
// Number()
// Boolean()
// Array()
new Array(1,2,3)
new Array(10)
// Object()
// Function()
// RegExp()
// Date()
// Error()
// Symbol()——ES6 中新加入的！
```

可以把内建函数当作构建函数使用，构建出来的是封装了基本类型值的对象。
```js
let a = new String('dd')
typeof a // object
```

### 内部属性[[class]]

```js
// Object.prototype.call(targetObj)
Object.prototype.toString.call(false) // "[object Boolean]"
```

### 封装和拆封

一般来说，js会自动在需要的时候对基本类型值进行封装，无需手动。
```js
let a = '123'
a.length // 自动封装一个对象后获取属性值
```
可以通过OO.valueOf()获取封装对象拆封后的值。在需要用到封装对象中的基本类型值的地方会发生隐式拆封。
