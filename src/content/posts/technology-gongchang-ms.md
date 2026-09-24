---
title: "设计模式之工厂模式"
pubDate: 2026-02-02
description: "工厂模式：把对象创建封装起来，让调用方不关心具体类型。"
category: technology
tags: ["设计模式", "前端"]
---

工厂模式用于把对象的创建和使用解耦。

## 简单工厂

```javascript
function createUser(type) {
  switch (type) {
    case 'admin': return new Admin();
    case 'guest': return new Guest();
    default: return new Normal();
  }
}
```

适合对象类型固定的场景。

## 工厂方法

把工厂本身抽象成接口：

```javascript
class DialogFactory {
  createButton() { /* 子类实现 */ }
  createInput() { /* 子类实现 */ }
}

class MaterialDialogFactory extends DialogFactory {
  createButton() { return new MaterialButton(); }
  createInput() { return new MaterialInput(); }
}
```

适合"一组相关对象的创建"。

## 抽象工厂

跟工厂方法类似，但创建的对象之间有约束关系。

## 什么时候用

- 创建逻辑可能变化（多种数据库 driver / 多种 UI 组件）
- 对象类型有继承关系
- 想把创建和使用分离

## 什么时候不用

- 对象类型就一两种，简单 `new` 更清楚
- 创建逻辑不复杂

## 现代 JS 替代

ES Module + 动态 import：

```javascript
async function createAdapter(name) {
  const module = await import(`./adapters/${name}.js`);
  return new module.default();
}
```

工厂模式 = 把创建逻辑放一处。**不为了用模式而用模式**。