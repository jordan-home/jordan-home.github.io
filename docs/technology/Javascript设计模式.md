---
title: Javascript中常见的设计模式
date: 2020-06-10
categories:
  - IT
tags:
  - JS
  - 设计模式
---

## 什么是设计模式

- 设计模式是**前人总结出的，用于解决开发中某类问题的方法**；

- 我们在过去的开发中已经接触过很多的设计模式，只不过当时可能不清楚这就是一种设计模式；
- 设计模式之间并不是互相独立的，往往一个功能需要多个设计模式的配合来实现；
- 每个设计模式所解决的问题肯定是不同的，根据这些模式的功能我们可以将他们分成几大类：创建型设计模式、结构型设计模式、行为型设计模式。当然在JavaScript里面还可以有其他的一些特殊的设计模式。

## 创建型设计模式

创建型设计模式 -- “创建”说明该类别里面的设计模式就是用来创建对象的，也就是在不同的场景下我们应该选用什么样的方式来创建对象。

#### 1. 单例模式

单例模式（Singleton）：确保某一个类只有一个实例。

JavaScript创建实例对象的方法有很多，所以很多写法我们都可以认为是单例模式：

- 场景1

```javascript
/*
    我们以完成一个右下角弹窗的情景来理解
    封装一个弹窗功能，先不管样式等，页面中可以多次调用该弹窗
    弹窗出现的这个div是不必要每次调用都新建一个的，所有的弹窗使用统一的div就可以了，这就是很典型的单例
*/
let Popup = document.createElement("div");
Popup.show = function (arg) {
    this.innerText = arg;
    document.body.appendChild(this)
};
Popup.show("张三");//测试使用1
Popup.show("李四");//测试使用2
```

```js
/*
    上面做法在没有调用时就已经初始化DOM节点了，
    很显然，当我们使用时再初始化这样更好
    改良一下：
*/
let Popup = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = document.createElement("div");
        }
        instance.show = function (arg) {
            this.innerText = arg;
            document.body.appendChild(this);
        };
        return instance;
    };
})();
Popup().show("张三");//测试使用1
Popup().show("李四");//测试使用2
console.log(Popup() === Popup());//测试单例

```

```js
/*
    抽象化一下，写成类的形式：
*/
let Popup = (function () {
    let instance = null;
    class Pop{
        constructor(){
            if( instance ){
                return instance;
            }
            instance = this;
            this.ele = document.createElement("div");
            this.show = function (arg) {
                this.ele.innerText = arg;
                document.body.appendChild(this.ele);
            };
        }
    }
    return Pop;
})();
let a = new Popup();
a.show("张三");//测试使用1
let b = new Popup();
b.show("李四");//测试使用2
console.log(a === b);//测试单例
```

```js
//核心实现代码
let Single = (function(){
    let instance = null;
    class S{
        constructor(){
            if(instance){
                return instance;
            }
            instance = this;
            //code……
        }
    }
})();
//实例化测试
console.log( new Single() === new Single() );
```

- 场景2

js里面我们可以直接定义一个对象字面量，很显然定义的对象那肯定就只有一个，所以这样的形式我们也可以理解为单例：

```js
let Single = {
    //code        
};
```

我们可以将需要用到的属性或方法全部设置到该对象里面：

```js
let a = 10;
let b = 20;
let c = true;
let d = function(){};

//全局变量宝贵的狠，特别是多人协作开发的时候，为了避免和别人命名冲突，可以换个方式定义:
```

```js
//你自己的变量全部放入一个对象里面，这样可以避免很多问题
let Afeifei = {
    a : 10,
    b : 20,
    c : true,
    d(){
        //code
    }
}
```

```js
//有些时候我们可能希望不是全部的变量都暴露出来可以访问，而是只有内部能访问，那么可以这么写
let Afeifei = (function(){
    let NUM = 10;//这个NUM外界就不能直接访问
    return {
        addNum(){
            return ++NUM;
        }
    }
})();
console.log( Afeifei.NUM ); //undefined
console.log( Afeifei.addNum() ); // 11
```



**总结：**当需求实例唯一、命名空间时，就可以使用单例模式。结合闭包特性，用途广泛。

#### 2. 工厂模式

工厂模式（Factory）：定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类。这里将 *简单工厂模式* 和 *工厂方法模式* 一起讲。

还有一种工厂模式叫做 *抽象工厂模式* 。

- 场景1

```js
//牛排店
class Steak{
    constructor(){
        this.price = 30;
        this.time = 20;
    }
}

//烧烤店
class Grill{
    constructor(){
        this.price = 20;
        this.time = 15;
    }
}

//面条店
class Noodles{
    constructor(){
        this.price = 15;
        this.time = 10;
    }
}

let a = new Steak(); //来份牛排
let b = new Grill(); //来份烧烤
let c = new Noodles(); //来份面条

//三个类结构相似，写和调用都有点繁琐重复：
```

```js
//牛排
class Steak{
    constructor(){
        this.price = 30;
        this.time = 20;
    }
}

//烧烤
class Grill{
    constructor(){
        this.price = 20;
        this.time = 15;
    }
}

//面条
class Noodles{
    constructor(){
        this.price = 15;
        this.time = 10;
    }
}

//把三个类统一到一个类Shop里面
class Shop{
    constructor(name){
        let o = null
        switch(name){
            case "Steak":
                o = new Steak();
                break;
            case "Grill":
                o = new Grill();
                break;
            case "Noodles":
                o = new Noodles();
                break;
        }
        return o;
    }
}

//统一方法调用
let a = new Shop("Steak"); //老板来份牛排
let b = new Shop("Grill");//老板来份烧烤
let c = new Shop("Noodles");//老板来份面条
```

```js
//接口统一了但是还是不方便，首先有四个变量的出现，其次假设要新增菜谱呢？需要新添加一个类，还需要修改Shop的判断，改进一下：
//总店面
class Shop{
    constructor(name){
        return this[name].call({});
    }
    Steak(){//牛排
        this.price = 30;
        this.time = 20;
        return this;
    }
    Grill(){//烧烤
        this.price = 20;
        this.time = 15;
        return this;
    }
    Noodles(){//面条
        this.price = 15;
        this.time = 10;
        return this;
    }
}

//统一方法调用
let a = new Shop("Steak"); //老板来份牛排
let b = new Shop("Grill");//老板来份烧烤
let c = new Shop("Noodles");//老板来份面条

//这样的话，新增菜谱也就只需要在Shop里面新加入一个方法就可以了
//当然，不是说非得把东西全塞到原型里面才叫工厂模式，这个例子只是统一接口的一种方法，我们遇到的其他统一接口的方式也可以看成工厂模式。
```

**总结：**工厂模式就是使 同一类别 的 类 综合起来，以使接口统一方便调用，同时在修改以及扩展时更加方便。

#### 3. 建造者模式

建造者模式（Builder）：将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

看名称我们首先想到的就是造房子。建造者模式就像是施工队，包工头和客户沟通了解了客户的建房需求后，在自己团队内部分发任务，将复杂的建房过程分解成若干小组，各小组分工合作最终得到需求的房子。

- 场景1

```js
//建造房子场景
//建造者 - 施工队
let Builder = function(){
    //成员01 -- 决定厅室
    function Rooms(member){
        if( member <= 0 ){
            throw new Error("入住人数错误！");
        }
        this.rooms = member>=3?3:2;
    }

    //成员02 -- 决定面积
    function FloorSpace(budget){
        if( (typeof budget !== "number") || Number.isNaN(budget) || (budget < 60) ){
            throw new Error("预算过低或错误！");
        }
        this.budget = budget/2;
    }

    //成员03 -- 整体风格
    function Style(style){
        this.style = style || "常规风格";
    }

    return class {
        //住几人，预算多少(万)，风格
        constructor(member, budget, style) {
            Rooms.call(this,member);
            FloorSpace.call(this,budget);
            Style.call(this,style);
        }
    };
}();

//包工头获取客户需求，然后建造房子
let house1 = new Builder(1,100,"小清新");//客户1的需求
let house2 = new Builder(4,200,"欧美");//客户2的需求
```

建造者模式的定义--将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。通过上面的例子我们对该解释也就有了一定的理解。其实类似于ajax的实现，发送请求返回数据 与 成功的处理函数这种也是分离状态，我们调用封装好的ajax传入不同的各类参数也可以看成建造者模式。

**总结：**当我们构造的对象，内部结构较复杂时，使用建造者模式将内部各模块分开创建就非常合适。

#### 4. 原型模式

原型模式（Prototype）：用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。

这个概念在JavaScript中和我们讲过的原型继承是同一个意思。

- 场景

```js
//父类
class Parent{
    constructor(x){
        this.x = x;
    }
    showX(){
        alert( this.x );
    }
}

//子类1继承
class ChildA extends Parent{
    constructor(x,y){
        super();
        this.y = y;
    }
    showY(){
        alert( this.y );
    }
}
//子类2继承
class ChildB extends Parent{
    constructor(x,z){
        super();
        this.z = z;
    }
    showZ(){
        alert( this.z );
    }
}
```

**总结：**多个类使用到了相同的属性或方法，那我们就可以通过原型继承的方式来创造出类或者实例对象。



## 结构性设计模式

结构性设计模式 -- 关注于如何将类或对象组合成更大的结构，以便在使用时更简化。

#### 1. 外观模式

外观模式（Facede）：为一组复杂的子接口提供一个更高级的统一接口，以便更方便的去实现子接口的功能。

JavaScript最常见的外观模式就是对各种API的统一的兼容处理：

- 场景1

```js
//以添加事件为例：使用事件添加方式 addEventListener，但是IE不兼容，需要使用attachEvent，从而添加一个click的事件写法如下：
function click(){
    //code……
}

if( document.addEventListener ){
    oDiv.addEventListener("click" , click, false);
}else if(document.attachEvent){
    oDiv.attachEvent("onclick" , click);
}else{
    oDiv.onclick = click;
}
//显然每个事件都要写这些会很麻烦，所以会封装一下：
```

```js
function addEvent(dom , eName , fn){
    if( document.addEventListener ){
        dom.addaddEventListener(eName,fn,false);
    }else if( document.attachEvent ){
        dom.attachEvent("on"+eName,fn);
    }else{
        dom["on"+eName] = fn;
    }
}
//使用
addEvent(oDiv , "click" ,click);
function click(){
    //code……
}
//其它事件的添加也不同写很多：
addEvent(oDiv,"mouseenter",enter);
function enter(){
    //code……
}
```

- 场景2

```js
//javascrip的兼容部分比较多，需要的话可以将众多兼容操作综合起来，这样通过外观模式就能封装成一个小型的库：
var F = {
    getDOM : function(selector){
        return document.querySelector(selector);
    },
    on: function(selector,eName,fn){
        var dom = this.getDOM(selector);
        if( document.addEventListener ){
            dom.addEventListener(eName,fn,false);
        }else if( document.attachEvent ){
            dom.attachEvent("on"+eName,fn);
        }else{
            dom["on"+eName] = fn;
        }
    },
    getStyle : function(selector,attr){
        var dom = this.getDOM(selector);
        if( window.getComputedStyle ){
            return getComputedStyle(dom)[attr];
        }else{
            return dom.currentStyle[attr];
        }
    }
    //code……
}

//使用
F.on("#wrap","click" , function(){
    //code……
})
```
**总结：**对外提供统一的接口，内部实现各种不同的差异处理。或是将各类子操作综合在一起，对外提供统一的使用接口。这就是外观模式。

#### 2. 适配器模式

适配器模式（Adapter）：将一个类的接口转换成另外一个接口，以满足用户需求，解决接口不一样而产生的兼容问题。

适配的概念通俗的说，比如iphone耳机接口不合适，通过转化器来接耳机，这个转化器，就是一个适配器。

- 场景1

```js
//某个项目中我们使用ajax请求，获取到了数据data，data是一个数组格式。之后后端更新了数据结构，将返回的数据换成了键值对形式，此时修改原来的代码成本较大，所以我们可以加一段适配代码：
$.ajax({
    //url type dataType……
    success : function (msg) {
        //以前的msg是数组格式： ["张三" , "18" , "未婚"]
        //后端数据格式更新为 {name:"张三",age:"18",marry:"未婚}
        //done函数代码已成一个完整的逻辑，修改接口参数类型的话比较麻烦
        //所以我们添加适配器：
        msg = [msg.name,msg.age,msg.marry];

        //调用done
        done(msg);
    }
});

function done(msg) {
    for (let i = 0, length = msg.length; i < length; i++) {
        //dosomething……
    }
}
```

- 场景2

```js
function fn(name,age,marry,sex,index){
    //dosomething……
}
fn("张三",18,"未婚","男",1);
//参数很多，传参时必须要保证顺序一致，还不能设置默认值，很麻烦，修改成：
```

```js
function fn(options){
    let {name,age,marry,sex,index=1}=options;
    //dosomething……
}
//使用时，只需键值对应，无关乎顺序，并且可以在解构阶段给默认值
fn({
    name:"乌拉",
    sex : "女",
    age : 18,
    marry : "未婚"
});

//这种写法我们很早就已经使用过，这其实也是一种参数适配器。
```



这些例子的代码都比较简单，实际过程中可能需要的适配器代码会更复杂，但是原理是一样的。

**总结：**由于各种原因（结构升级，优化代码等），导致接口和之前的不一样，而重构整个代码是很麻烦的，所以我们使用适配器代码将接口转换一下以保证能正确的使用，这就是适配器模式的作用。

#### 3. 代理模式

代理模式（Proxy）：为对象提供一个代理，用来控制对这个对象的访问。

代理模式就是通过代理访问对象而不是直接访问对象。

- 场景

```js
//通过代理过滤不必要或者不允许的访问
const WULA = {
    name : "乌拉",
    age : 18,
    sex : "女"
};

let Fn = function(info){
    let handler = info.index===222?{
        get(target,key){
            return target[key];
        },
        set(target,key,value){
            return target[key] = value;
        }
    }:{
        get(target,key){
            if( key === "age" ){
                return "error 人家不告诉你嘛~";
            }
            return target[key];
        },
        set(target,key,value){
            console.warn("不允许修改属性！");
            return false;
        }
    };
    const Wula = new Proxy(WULA,handler);

    //code……
    console.log(Wula.age);
    console.log(Wula.name);
    Wula.age = 80;
    console.log(Wula.age);
};

//Fn通过参数信息，限制Fn内部能对WULA进行的操作
//Fn({index:222});
Fn({index:7});
```

**总结：**通过对访问的代理，我们可以用于 *远程代理、安全代理等*。

#### 4. 装饰者模式

装饰者模式（Decorator）：在不改变原对象的基础上，对其进行包装拓展，以满足更复杂的需求。

听起来和继承有点像，但是更灵活一些：

```js
//Teacher类
class Teacher{
    constructor(name,sex){
        this.name = name;
        this.sex = sex;
    }
    showName(){
        alert(this.name);
    }
}

//实例 、 使用……
let tom = new Teacher("Tom","男");//实例1
let kate = new Teacher("Kate","女");//实例2
//code…… 

//现在需要对 tom实例（或者个别实例） 进行age、marry等属性的扩展
//很显然此时不能直接扩展到Teacher，不然会影响其他实例
//如果继承，那么需要重新实例化出新的，不必要且浪费
//我们目前只需要在已有的实例上稍作装饰就能满足需求
function Decorator(obj,age,marry){
    obj.age = age;
    obj.marry = marry;
    return obj;
}
Decorator(tom,18,"未婚");
//code……
```

**总结：**装饰者模式就是一种更灵活的继承方案，对对象进行所需要的扩展而不用重新继承构造出新的实例。

#### 5. 桥接模式

桥接模式（Bridge）：将抽象部分与它的实现部分分离，使它们都可以独立的变化。

- 场景

用桥接模式联结多个类：

```js
//基本类
class A{
    //code……
}
class B{
    //code……
}
class C{
    //code……
}
class D{
    //code……
}

//桥接类
class Bridge1{
    constructor(){
        this.w = new A();
        this.x = new B();
    }
    //code……
}
class Bridge2{
    constructor(){
        this.w = new A();
        this.x = new B();
        this.y = new C();
    }
    //code……
}
class Bridge3{
    constructor(){
        this.x = new B();
        this.z = new D();
    }
    //code……
}
```

**总结：**什么时候用到桥接？某些逻辑要扩展导致实现结构复杂时，可以单独抽象出来，再利用桥接使用，而抽象部分和实现部分又可以单独进行扩展。

#### 6. 组合模式

组合模式（Composite）：又称部分-整体模式，将对象组合成树形结构以表示“部分-整体”的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。

就是说不管你是操作单个东西，还是操作多个东西操作方式都是一样的。例如生活中我们通过购物车付款，不管是一个商品还是多个商品都是一次性付款；清理文件，不管是删除单个文件还是一个包含多个文件的文件夹都是一样的操作。

- 场景

一DOM树是典型的树形结构，所以我们在统一DOM节点操作方式的时候，就是一个非常典型的组合模式案例，比如说JQ：

```js
//用jq不管是操作一个节点还是多个节点，写法都是一样的
//这就是一个典型的组合模式的实现
$("#box").css("color" , 'red');
$(".box").css("color" , "red");

//我们来用原生js简单的模拟一下
function $(selector){
    let ele = document.querySelectorAll(selector);
    let eleArr = [];
    if( ele instanceof NodeList){
        eleArr = [...ele];
    }else if( ele instanceof Node){
        eleArr = [ele];
    }
    return {
        css : function(attr,value){
            eleArr.forEach(function (e,i) {
                e.style[attr] = value;
            });
        }
    }
}
```

**总结：**想构建整体-部分的结构时使用，忽略单个对象和多个对象的使用区别，统一调用接口。

#### 7. 享元模式

享元模式（Flyweight ）：通过共享大量细粒度的对象，避免拥有相同内容造成额外的开销。

- 场景

```js
//最最最最最常见的享元模式01
//提出相同事件函数，只需要定义一个函数就能满足所有人的需求
a.onclick = function(){alert(this.name)};
b.onclick = function(){alert(this.name)};
c.onclick = function(){alert(this.name)};

//提出后
let clickEvent = function(){alert(this.name)};
a.onclick = b.onclick = c.onclick = clickEvent;
```

**总结：**享元模式就是相同的部分提出来或者采用其他形式优化掉，一般需要配合单例模式来实现。



## 行为型设计模式

行为型设计模式 -- 不单单只涉及到类和对象，更关注于类或对象之间的通信交流。

#### 1. 观察者模式

观察者模式（Observer）：又叫发布-订阅模式，定义了一种一对多的关系，让多个观察者对象同时监听某一个对象，当该对象发生改变时，多个观察者对象也做出相应的改变。
典型的例子就是vue响应式的实现。

组成该模式的有两个关键部分：多个订阅者 和 消息发布者。

- 场景

```js
//事件绑定的机制，其实就是一种观察者模式
//事件触发的时候（发布消息）就执行对应的 事件函数（订阅者）
//代码省略
```

#### 2. 状态模式

状态模式（State Pattern）：当对象内部状态发生改变时，它的行为也对应的发生改变，使之看起来像是改变了这个对象。

当需求有多种状态，并在某些条件下会从一种状态变成另一种状态时，使用状态模式就很合适。

- 场景 -- 开关灯状态的切换

```js
//普通写法
//这是一个只有两个状态的模型，多个状态写法也是一样的
let oBtn = document.getElementById("btn");
let state = "off";
let switchFn = function(){
    if( state === "off" ){
        console.log("之前是off状态，现在变成on状态");
        state = "on";
    }else if( state === "on" ){
        console.log("之前是on状态，现在变成off状态");
        state = "off";
    }
};
oBtn.onclick = switchFn;
```

假设某个状态对应的代码需要修改，或者需要添加新的状态，我就得修改整个*switchFn*，状态与状态模块之间不够独立。可以将代码进一步修改：

```js
let Switch = {
    //状态机
    FSM : {
        on : {
            to : "off",
            action : function(){
                console.log("从on变到off");
            }
        },
        off : {
            to : "on",
            action : function(){
                console.log("从off变到on");
            }
        }
    },

    //当前状态
    currentState : "off",

    //初始化事件
    init(){
        let oBtn = document.getElementById("btn");
        oBtn.onclick = this.transition.bind(this);
    },

    //状态切换
    transition(){
        let s = this.FSM[this.currentState];
        this.currentState = s.to;
        s.action();
    }
};
```

这是一个有限状态机的js库，可以让我们非常方便的创建状态模式。

**总结：**哪些情况适用状态模式：

 	1. 对象的行为取决于它的状态，对应的操作会改变它的状态。

​	 2. 大量的判断操作，这些分支语句可以视作对象的状态。

#### 3. 策略模式

策略模式（Strategy）：策略模式定义了一系列的算法，并将每一个算法封装起来，而且使他们可以相互替换，且具有一定的独立性，不会随客户端变化而变化。

*一系列的算法，可以相互替换*，也就是说为了同一个目的，可能采取的算法不一样，彼此独立。

- 场景

```js
//玩家类
class Player{
    constructor(){
        this.totalCost = 0;
        this.level = "C";
    }
    consum(price){
        this.totalCost += price;
        let result = Strategy.calc(this.level , price);
        this.getLevel();
        return result;
    }
    getLevel(){
        let totalCost = this.totalCost;
        if( totalCost >= 50000 ){
            this.level = "S";
        }else if( totalCost >= 30000 ){
            this.level = "A";
        }else if( totalCost >= 20000 ){
            this.level = "B";
        }else{
            this.level = "C";
        }
    }
};

//计价策略类
let Strategy = (function(){
    //策略
    let s = {
        S(price){
            return price*0.85;
        },
        A(price){
            return price*0.9;
        },
        B(price){
            return price*0.95;
        },
        C(price){
            return price;
        }
    };
    return {
        //添加新策略的接口
        addsty(name , fn){
            s[name] = fn;
        },
        //计算策略对应最终价格的接口
        calc(sty,price){
            if( s[sty] ){
                return s[sty](price);
            }else{
                throw new Error("对应的优惠策略不存在！");
            }
        }
    };
})();


//测试：
let afei = new Player();
console.log(afei.consum(20));
console.log(afei.consum(10000));
console.log(afei.consum(50000));
console.log(afei.consum(200));
```

#### 4. 命令模式

命令模式（Command）：将请求与实现解耦并封装成独立对象，从而使不同的请求对客户端的实现参数化。

- 场景
```js
let CanvasCmd = (function(){
    let canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d");
    let cmdList = {
        beginPath(){
            console.log(1);
            ctx.beginPath();
        },
        close(){
            ctx.closePath();
        },
        strokeStyle(color){
            ctx.strokeStyle = color;
        },
        moveTo(x,y){
            console.log(x,y);
            ctx.moveTo(x,y);
        },
        lineTo(x,y){
            console.log(x,y);
            ctx.lineTo(x,y);
        },
        stroke(){
            console.log(1);
            ctx.stroke();
        },
        fillStyle(color){
            ctx.fillStyle = color;
        },
        fillRect(x,y,width,height){
            ctx.fillRect(x,y,width,height);
        },
        strokeRect(x,y,width,height){
            ctx.strokeRect(x,y,width,height);
        },
        arc(x,y,r,begin,end,dir){
            ctx.arc(x,y,r,begin,end,dir);
        }
    };
    return {
        execute(data){
            data.forEach(item=>{
                let {command,param} = item;
                cmdList[command] && cmdList[command](...param);
            });
        },
        addCmd(key,value){
            cmdList[key] = value;
        },
        removeCmd(key){
            Reflect.deleteProperty(cmdList,key);
        }
    };
})();

//命令测试
CanvasCmd.execute([
    {command:"beginPath",param:[]},
    {command:"strokeStyle",param:["red"]},
    {command:"moveTo",param:[10,10]},
    {command:"lineTo",param:[100,100]},
    {command:"stroke",param:[]}
]);
```

#### 5. 职责链模式

职责链模式（Chain of responsibility）：是使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递请求，直到有一个对象处理它为止。

我们接触过作用域链、原型链，回想一下概念，都是沿着链找直到找到为止。职责链也就是要构建这样一个结构，一层一层的传递请求直到处理了为止。

- 场景

情景：要提交一个申购申请，小于10000，部门负责人处理；大于10000小于50000，院负责人处理；大于50000小于100000群负责人处理；大于100000，董事长处理。

我们先按找平常的写法实现：

```js
function request(value){
    if( value <= 10000 ){
        console.log("移交部门负责人处理。");
        //some code……
    }
    else if( value <= 50000 ){
        console.log("移交院负责人处理。");
        //some code……
    }
    else if( value <= 100000 ){
        console.log("移交群负责人处理。");
        //some code……
    }
    else if( value > 100000 ){
        console.log("移交董事长处理。");
        //some code……
    }
}

request(20000);
```

需求虽然可以解决，但是if else的结构看起来未免也太麻烦 []()，我们使用职责链模式来改写一下代码：

```js
//将每个分支结构分离：
function director01(value){
    if( value <= 10000 ){
        console.log("移交部门负责人处理。");
        //some code……
    }else{
        //移交给下一个处理人
        director02(value);
    }
}
function director02(value){
    if( value <= 50000 ){
        console.log("移交院负责人处理。");
        //some code……
    }else{
        //移交给下一个处理人
        director03(value);
    }
}
function director03(value){
    if( value <= 100000 ){
        console.log("移交群负责人处理。");
        //some code……
    }else{
        //移交给下一个处理人
        director04(value);
    }
}
function director04(value){
    if( value > 100000 ){
        console.log("移交董事长处理。");
        //some code……
    }
}

//只需要从第一个处理人开始
director01(20000);
```

现在这样的结构就把每个分支分开了，耦合程度比上面的写法要好。但是每个处理人内部都必须强关联下一个处理人，不然就没法链式调用，层层之间的耦合还是很高，假设要添加一个处理人，那要改的地方就有上下两处了。将代码继续修改一下：

```js
//构建一个通用的职责链类：
class Chain{
    constructor(){
        this.successor = [];
        this.length = 0;
    }
    setSuccessor(...rest){
        this.successor = rest;
        this.length = rest.length;
    }
    request(...rest){

        (function getResult(index){
            if( index >= this.length ){
                return "无法处理。";
            }
            let result = this.successor[index](...rest);
            if( result === "next" ){
                index ++;
                getResult.call(this,index);
            }else{
                return result;
            }
        }).call(this,0);
    }
};

//将每个分支结构分离：
function director01(value){
    if( value <= 10000 ){
        console.log("移交部门负责人处理。");
        //some code……
    }else{
        //无须再强关联下一个处理函数
        return "next";
    }
}
function director02(value){
    if( value <= 50000 ){
        console.log("移交院负责人处理。");
        //some code……
    }else{
        //无须再强关联下一个处理函数
        return "next";
    }
}
function director03(value){
    if( value <= 100000 ){
        console.log("移交群负责人处理。");
        //some code……
    }else{
        //无须再强关联下一个处理函数
        return "next";
    }
}
function director04(value){
    if( value > 100000 ){
        console.log("移交董事长处理。");
        //some code……
    }
}

//实现链
let request = new Chain();
//设置处理队列
request.setSuccessor(
    director01,
    director02,
    director03,
    director04
);
//调用
request.request(20000);
request.request(80000);
request.request(800000);
```

#### 6. 中介者模式

中介者模式（Mediator）：通过中介者对象封装一系列对象之间的交互，使对象之间不再相互引用，降低他们之间的耦合。

就像房屋中介一样，有很多人需要买房租房，有很多人需要卖房或者出租。这时候就需要房屋中介。中介者模式就是解决多个对象之间相互交互的问题，只需要访问同一个中介，就可以解决所有的问题，把多对多复杂的问题变成一对多相对简单的问题。

```js
var playerDirector= ( function(){
    var players = {}, // 保存所有玩家
        operations = {}; // 中介者可以执行的操作
    /****************新增一个玩家***************************/
    operations.addPlayer = function( player ){
        var teamColor = player.teamColor; // 玩家的队伍颜色
        players[ teamColor ] = players[ teamColor ] || []; // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍
        players[ teamColor ].push( player ); // 添加玩家进队伍
    };
    /****************移除一个玩家***************************/
    operations.removePlayer = function( player ){
        var teamColor = player.teamColor, // 玩家的队伍颜色
        teamPlayers = players[ teamColor ] || []; // 该队伍所有成员
        for ( var i = teamPlayers.length - 1; i >= 0; i-- ){ // 遍历删除
            if ( teamPlayers[ i ] === player ){
                teamPlayers.splice( i, 1 );
            }
        }
    };
    /****************玩家换队***************************/
    operations.changeTeam = function( player, newTeamColor ){ // 玩家换队
        operations.removePlayer( player ); // 从原队伍中删除
        player.teamColor = newTeamColor; // 改变队伍颜色
        operations.addPlayer( player ); // 增加到新队伍中
    };

    operations.playerDead = function( player ){ // 玩家死亡
        var teamColor = player.teamColor,
        teamPlayers = players[ teamColor ]; // 玩家所在队伍
        var all_dead = true;
        for ( var i = 0, player; player = teamPlayers[ i++ ]; ){
            if ( player.state !== 'dead' ){
                all_dead = false;
                break;
            }
        }
        if ( all_dead === true ){ // 全部死亡
            for ( var i = 0, player; player = teamPlayers[ i++ ]; ){
                player.lose(); // 本队所有玩家lose
            }
            for ( var color in players ){
                if ( color !== teamColor ){
                    var teamPlayers = players[ color ]; // 其他队伍的玩家
                    for ( var i = 0, player; player = teamPlayers[ i++ ]; ){
                        player.win(); // 其他队伍所有玩家win
                    }
                }
            }
        }
    };
    var reciveMessage = function(){
        var message = Array.prototype.shift.call( arguments ); // arguments 的第一个参数为消息名称
        operations[ message ].apply( this, arguments );
    };

    return {
        reciveMessage: reciveMessage
    }
})();
```

#### 7. 迭代器模式

迭代器模式（Iterator）：在不暴露对象内部结构的同时，可以顺序地访问集合对象内部的各个元素。

常见的例子比如forEach，every，map等等。在ES6里面很多功能都是基于迭代器来实现的。

- 内部迭代器

迭代的过程在方法内部完成，也就是说我们不需要管迭代的进度，也没法管，比如forEach：

```js
[...document.getElementsByTagName("p")].forEach(item=>{
    item.onclick = function(){alert("TEST")};
});
```

因为forEach不兼容低版本IE，我们可以自己来简单实现：

```js
Array.prototype.forEach = function(callBack){
    for(var i=0;item=this[i++];){
        callBack(item,i,this);
    }
};
```

- 外部迭代器

需要我们操作，才会进行下一次的迭代，ES6里面原生就已经实现了这个功能，通过.next() 操控迭代器对象：

```js
let arr = [1,2,3];
let arrIterator = arr[Symbol.iterator]();

console.log( arrIterator.next() ); //{value:1,done:false}
console.log( arrIterator.next() ); //{value:2,done:false}
console.log( arrIterator.next() ); //{value:3,done:false}
console.log( arrIterator.next() ); //{value:undefined,done:true}
```

实现一个外部迭代器：

```js
var Iterator = function(arr){
    var index = 0,
        length = arr.length;
    return {
        next : function(){
            return {
                value : arr[index++],
                done : index >= length
            };
        }
    }
}
```

ES6定义了Object.keys等相关的方法，让我们能方便的遍历对象的属性或者值。ES6定义的Generator函数和async函数，让我们可以手动的控制函数执行的流程

#### 8. 访问者模式

访问者模式（Visitor）：在不改变对象的前提下，定义作用于对象的新操作。

- 场景1

```js
let afei = {
    addAttr(){
        this.goudan = "狗蛋";
        this.dachui = "大锤";
    }
};
afei.addAttr();
//对象afei，拥有addAttr方法，作用是给对象添加两个属性

//现在我们需要给对象wula，也添加这个两个属性，但是不希望乌拉拥有addAttr的方法
let wula = {};
afei.addAttr.call(wula);
//很简单的我们通过call就可以解决
//所以说JavaScript里面实现访问者模式是非常简单的，借助于call/apply就可以实现
```

- 场景2

JavaScript里面很多原生的API都是采用的访问者模式，比如数组相关的操作

```js
//数组有push方法，现在我们希望普通的对象 x 也有push方法能添加数字属性和length

let Visitor = {
    push(obj , value){
        return Array.prototype.push.call(obj,value);
    }
}
let x = {};
Visitor.push(x,5);
console.log(x);
```

#### 9. 解释器模式

解释器模式（Interpreter）：定义一种文法的表示，并定义一种解释器，通过这个解释器来解析对应文法的内容。

- 场景  --  jQ提供的选择器

我们知道原生js获取DOM元素的方式是有限的，而jq给我们提供了更为复杂的选择方式，比如：`$("#wrap p:odd")`，这个参数规则就是jQ定义的一套选择元素的*文法*，而最终解析这个字符串，使之能获取对应DOM元素的代码就是*解释器*。
