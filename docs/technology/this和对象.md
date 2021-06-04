---
title: this和对象
date: 2021-4-21
sidebar: auto
categories:
  - IT
tags:
  - 读书笔记
  - JS
---

::: tip 书籍简介

书名：《你不知掉的JavaScript（上卷）》～`关于this` 和 `对象`

作者：[美] Kyle Simpson

分类：IT

:::

<!-- more -->

## 关于this

`this`具有隐式传递上下文对象引用的作用，因此可以将API设计的更加简洁，方便复用。

`this`既不指向所在函数自身，也不指向所在函数的词法作用域。

`this`运行时进行绑定，它的上下文取决于所属函数调用的位置（可以根据调用栈进行确定）。

### 绑定规则

优先级由低到高

#### 🌟默认绑定

独立函数调用

```js
function foo() { console.log(this.a) }
var a = 2
foo() // 2
```

函数直接使用，哪里调用this就指向哪。

#### 🌟🌟隐式绑定

另一条需要考虑的规则是调用位置是否有上下文对象，或者说是否被某个对象拥有或者包含。

```js
function foo() {...}
var obj = {a: 21, foo: foo }
obj.foo() // 21
```

需要注意的是，对象属性引用链中仅最顶层或者说最后一层会影响调用位置。

```js
obj1.obj2.obj3.foo() // 此时用的是obj3里面的this
```

另外，一些情况下，会发生隐式丢失，如：

```js
function foo() {...}
var obj = { a: 2, foo: foo }
var bar = obj.foo
var a = 1
bar() // 1
```

不过这并不是bug，也是符合JS语法规律的。bar此时指向的其实是foo,可以等价看作`foo()`

#### 🌟🌟🌟显示绑定

手动指定`this`,立即执行。

* foo.call(obj, ...arguments)
* foo.apply(obj, arguments)

```js
function foo() { ... }
var obj = { a: 2 }
foo.call(obj) // 2
```

显示绑定也可能绑定丢失，可以用显示绑定的一个变种来解决，这个变种称作`硬绑定`

```js
function foo() { ... }
var obj = { a:2 }
var bar = function() { return foo.call(obj) }
var a = 23
bar() // 2
setTimeout(bar, 100) //2
bar.call(window) //还是2
```

#### 🌟🌟🌟🌟new绑定

构造函数：使用`new` 操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特殊的函数类型，它们只是被`new` 操作符调用的普通函数而已。

使用`new`调用函数时，发生以下操作：

1. 创建（或者说构造）一个全新的对象。

2. 这个新对象会被执行[[原型]]连接。

3. 这个新对象会绑定到函数调用的`this` 。

4. 如果函数没有返回其他对象，那么`new` 表达式中的函数调用会自动返回这个新对象。

### 绑定例外

通常情况下,`this`的绑定行为是基于绑定规则的，但凡事都有例外。

#### 被忽略的this

当把`null`,`undefined`作为绑定对象传入`call` `apply` `bind`时，传入的值会被忽略，实际应用默认绑定规则；需要注意的是，如果传入的是string，number等类型的标量值，会先把它们封装成String,Number等。

##### 拓展

不关心this，但是在`call`,`apply`,`bind`	中需要一个展位，此时可以用`null`

* 使用apply展开数组，并当作参数传入一个函数。
* bind对参数进行柯里化（预设参数）

```js
function foo (a,b) { ... }
foo.apply(null, [2,3])
// 柯里化
var bar = foo.bind(null, 2)
bar(3)
```

使用null也会产生一些副作用，因为它会使用默认绑定规则，可能会对被绑定的作用域进行修改等。此水，我们可以创建一个DMZ对象——空的非委托的对象。

```js
function foo(a,b) {...}
var ø = Object.create(null)
foo.apply(ø,[2,3])
// 柯里化
var bar = foo.bind(ø, 2)
bar(3)
```

#### 间接引用

```js
var o = { a: 2, foo: foo }
var p = { a: 4 }
o.foo() // 2
(p.foo = o.foo)() // 4
```

#### 软绑定

硬绑定：把`this` 强制绑定到指定的对象（除了使用`new` 时），防止函数调用应用默认绑定规则。

软绑定：给默认绑定指定一个全局对象和`undefined` 以外的值。首先检查调用时的`this` ，如果`this` 绑定到全局对象或者`undefined` ，那就把指定的默认对象`obj` 绑定到`this` ，否则不会修改`this` 。

### 对比箭头函数

箭头函数不使用`this` 的四种标准规则，而是根据外层（函数或者全局）作用域来决定`this`

箭头函数的绑定无法被修改。（`new` 也不行！）

## 对象

### 创建的两种方式

```js
var obj1 = { key: value }
var obj2 = new Object()
obj2.key = value
```

### 对象子类型

也叫做复杂基本类型。

* String
* Number
* Boolean
* Object
* Function
* Array
* Date
* RegExp
* Error

注意：`null` 和`undefined` 没有对应的构造形式，它们只有文字形式。相反，`Date` 只有构造，没有文字形式

### 内容

存储在对象容器内部的是这些属性的名称，它们就像指针（从技术角度来说就是引用）一样，指向这些值真正的存储位置。

访问对象属性有两种方式： 属性访问（.a) ；键访问(['a'])。它们的区别是：`.` 操作符要求属性名满足标识符的命名规范，而`[".."]` 语法可以接受任意UTF-8/Unicode字符串作为属性名。属性名永远都是字符串。

#### 属性描述符

```js
var myObject = {
    a:2
};

Object.getOwnPropertyDescriptor( myObject, "a" );
// {
//    value: 2,
//    writable: true,
//    enumerable: true,
//    configurable: true
// }

```

* value
* writable: 可修改
* enumerable：可枚举
* configurable：可配置

```js
var myObject = {};
// defineProperty可以修改和创建属性
Object.defineProperty( myObject, "a", {
    value: 2,
    writable: true,
    configurable: true,
    enumerable: true
} );

myObject.a; // 2
```

把`configurable` 修改成`false` 是单向操作，无法撤销！例外的是，即便属性是`configurable:false` ， 我们还是可以把`writable` 的状态由`true` 改为`false` ，但是无法由`false` 改为`true` 。

#### 不变性

保证对象被创建且不可变。

##### 对象常量

writable:false configurable:false

##### 禁止扩展

禁止一个对象添加新属性并且保留已有属性

```js
Object.preventExtensions(obj)
```

##### 密封

不仅不能添加新属性，也不能重新配置或者删除任何现有属性（虽然可以修改属性的值）

```js
Object.seal(ob j)
```

##### 冻结

对象只读

```js
Object.freeze(obj)
```

#### [[Get]]

属性访问。

#### [[Put]]

给对象的属性赋值会触发。正对属性是否存在，处理方式不同。

如果对象存在该属性，则：

1. 属性是否是访问描述符（参见3.3.9节）？如果是并且存在setter就调用setter。

2. 属性的数据描述符中`writable` 是否是`false` ？如果是，在非严格模式下静默失败，在严格模式下抛出`TypeError` 异常。

3. 如果都不是，将该值设置为属性的值。

#### Getter和Setter

当你给一个属性定义getter、setter或者两者都有时，这个属性会被定义为“访问描述符”（和“数据描述符”相对）。对于访问描述符来说，JavaScript会忽略它们的`value` 和`writable` 特性，取而代之的是关心`set` 和`get` （还有`configurable` 和`enumerable` ）特性。

```js
var myObject = {
    // 给 a 定义一个getter
    get a() {
        return 2;
    }
};
Object.defineProperty(myObject, 'b', {
  get: function() { return this.a*2 }
})
```

#### 存在性

in: 检查属性是否在对象及其`[[Prototype]]` 原型链中

hasOwnProperty: 只会检查属性是否在`myObject` 对象中,不检查原型链

### 遍历

for..in;

`Object.keys(..)` 会返回一个数组，包含所有可枚举属性;

`Object.keys(..)` 和`Object.getOwnPropertyNames(..)` 都只会查找对象直接包含的属性。

`forEach(..)` 会遍历数组中的所有值并忽略回调函数的返回值。

`every(..)` 会一直运行直到回调函数返回`false` （或者“假”值）

`some(..)` 会一直运行直到回调函数返回`true` （或者“真”值）。

`for..of` 循环首先会向被访问对象请求一个迭代器对象，然后通过调用迭代器对象的`next()` 方法来遍历所有返回值。

```js
for (var k in myObject) {
    console.log( k, myObject[k] );
}
```
