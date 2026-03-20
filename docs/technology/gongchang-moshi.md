---
title: 设计模式之工厂模式
date: 2026-02-02
tags:
  - 设计模式
  - 前端
categories:
  - IT
---

## 前言

工厂模式（Factory Pattern）是一种创建型设计模式，提供创建对象的接口而不指定具体类。

## 什么是工厂模式

工厂模式的核心思想：**将对象的创建逻辑封装起来，调用者不需要关心对象是如何创建的。**

## 简单工厂模式

### 实现

```javascript
class Car {
  constructor(options) {
    this.doors = options.doors || 4;
    this.state = options.state || 'brand new';
    this.color = options.color || 'silver';
  }
}

class Truck {
  constructor(options) {
    this.state = options.state || 'used';
    this.color = options.color || 'blue';
    this.wheelSize = options.wheelSize || 'large';
  }
}

// 简单工厂
class VehicleFactory {
  static createVehicle(options) {
    if (options.vehicleType === 'car') {
      return new Car(options);
    } else if (options.vehicleType === 'truck') {
      return new Truck(options);
    }
    throw new Error('Unknown vehicle type');
  }
}

// 使用
const car = VehicleFactory.createVehicle({
  vehicleType: 'car',
  color: 'red',
  doors: 2
});

const truck = VehicleFactory.createVehicle({
  vehicleType: 'truck',
  wheelSize: 'small'
});
```

### 缺点

违反开闭原则：新增类型需要修改工厂代码。

## 工厂方法模式

### 实现

```javascript
// 抽象工厂
class VehicleFactory {
  createVehicle() {
    throw new Error('Method createVehicle must be implemented');
  }
}

// 具体工厂
class CarFactory extends VehicleFactory {
  createVehicle(options) {
    return new Car(options);
  }
}

class TruckFactory extends VehicleFactory {
  createVehicle(options) {
    return new Truck(options);
  }
}

// 使用
const carFactory = new CarFactory();
const car = carFactory.createVehicle({ color: 'red' });

const truckFactory = new TruckFactory();
const truck = truckFactory.createVehicle({ color: 'blue' });
```

### 优点

- 符合开闭原则
- 每个工厂负责一种产品

## 抽象工厂模式

### 实现

```javascript
// 抽象产品
class Car {}
class Truck {}

// 具体产品
class SportsCar extends Car {
  drive() { return 'Driving sports car fast!'; }
}

class FamilyCar extends Car {
  drive() { return 'Driving family car safely!'; }
}

class PickupTruck extends Truck {
  drive() { return 'Driving pickup truck!'; }
}

class HeavyTruck extends Truck {
  drive() { return 'Driving heavy truck!'; }
}

// 抽象工厂
class VehicleFactory {
  createSportsCar() { throw new Error('Not implemented'); }
  createFamilyCar() { throw new Error('Not implemented'); }
  createPickupTruck() { throw new Error('Not implemented'); }
  createHeavyTruck() { throw new Error('Not implemented'); }
}

// 具体工厂
class AmericanVehicleFactory extends VehicleFactory {
  createSportsCar() { return new SportsCar(); }
  createFamilyCar() { return new FamilyCar(); }
  createPickupTruck() { return new PickupTruck(); }
  createHeavyTruck() { return new HeavyTruck(); }
}

class EuropeanVehicleFactory extends VehicleFactory {
  createSportsCar() { return new SportsCar(); }
  createFamilyCar() { return new FamilyCar(); }
  createPickupTruck() { return new PickupTruck(); }
  createHeavyTruck() { return new HeavyTruck(); }
}

// 使用
function createVehicleFactory(type) {
  const factories = {
    american: AmericanVehicleFactory,
    european: EuropeanVehicleFactory
  };
  return new factories[type]();
}

const factory = createVehicleFactory('american');
const sportsCar = factory.createSportsCar();
```

## 前端实际应用

### 1. UI 组件工厂

```javascript
class Button {
  render() { return '<button>Click</button>'; }
}

class Input {
  render() { return '<input type="text">'; }
}

class Select {
  render() { return '<select></select>'; }
}

class UIComponentFactory {
  static create(type) {
    const components = {
      button: Button,
      input: Input,
      select: Select
    };
    
    if (!components[type]) {
      throw new Error(`Unknown component: ${type}`);
    }
    
    return new components[type]();
  }
}

// 使用
const button = UIComponentFactory.create('button');
const input = UIComponentFactory.create('input');
```

### 2. API 请求工厂

```javascript
class HttpClient {
  request(config) {
    return fetch(config.url, config).then(res => res.json());
  }
}

class AxiosClient {
  request(config) {
    return axios(config);
  }
}

class FetchClient {
  request(config) {
    return fetch(config.url, config).then(res => res.json());
  }
}

class ApiClientFactory {
  static create(type = 'fetch') {
    const clients = {
      http: HttpClient,
      axios: AxiosClient,
      fetch: FetchClient
    };
    
    return new clients[type]();
  }
}

// 使用
const api = ApiClientFactory.create('axios');
api.request({ url: '/api/users' });
```

### 3. 表单验证器工厂

```javascript
class Validator {
  validate(value) {
    throw new Error('Must implement validate method');
  }
}

class RequiredValidator extends Validator {
  validate(value) {
    return value !== undefined && value !== null && value !== '';
  }
}

class EmailValidator extends Validator {
  validate(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}

class MinLengthValidator extends Validator {
  constructor(min) {
    super();
    this.min = min;
  }
  
  validate(value) {
    return value && value.length >= this.min;
  }
}

class ValidatorFactory {
  static create(type, ...args) {
    const validators = {
      required: RequiredValidator,
      email: EmailValidator,
      minLength: MinLengthValidator
    };
    
    const ValidatorClass = validators[type];
    return new ValidatorClass(...args);
  }
}

// 使用
const validators = [
  ValidatorFactory.create('required'),
  ValidatorFactory.create('email'),
  ValidatorFactory.create('minLength', 6)
];

function validate(value) {
  return validators.every(v => v.validate(value));
}
```

### 4. 消息通知工厂

```javascript
class Toast {
  show(message) {
    console.log(`Toast: ${message}`);
  }
}

class Modal {
  show(message) {
    console.log(`Modal: ${message}`);
  }
}

class Alert {
  show(message) {
    alert(message);
  }
}

class NotificationFactory {
  static create(type = 'toast') {
    const notifications = {
      toast: Toast,
      modal: Modal,
      alert: Alert
    };
    
    return new notifications[type]();
  }
}
```

## 工厂模式 vs 构造函数

| 特性 | 工厂模式 | 构造函数 |
|------|---------|---------|
| 返回值 | 返回新对象 | 返回新对象 |
| 继承 | 可以返回任何类型 | 必须返回实例 |
| 创建逻辑 | 封装在函数内 | 在构造函数内 |
| this 绑定 | 无需处理 | 需要处理 |

## 总结

- **简单工厂**：集中创建，但违反开闭原则
- **工厂方法**：符合开闭原则，每种产品一个工厂
- **抽象工厂**：创建一系列相关对象

适用场景：
- 对象创建逻辑复杂
- 需要根据条件创建不同类型对象
- 需要解耦对象创建和使用
