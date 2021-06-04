---
title: GraphQL初探
date: 2021-03-10
categories:
  - IT
tags:
  - GraphQL
  - API
  - HTTP
---

## 1 互联网永恒的主题

加载数据，越快越好。精准快速的从服务端获取数据

## 2 简单的定义

1. 一种API查询语言，基于HTTP协议。也叫做声明式数据获取语言。

开发者根据需求列举出请求的字段，而无需关注如何获取这些数据。

使用GraphQL,只要一次请求就可以获取所需的所有数据。

2. 客户端与服务器之间通信的规范

向GraphQL服务端请求数据时，自动通过类型检测系统（服务器在GraphQL Schema中定义的数据类型）进行验证。

3. GraphQL仅仅是一个规范，不关心使用的react,vue乃至浏览器。

## 3 GraphQL设计原则

* 分层

  查询的字段层次分明，类似于树形结构（对象类型）。查询字段的结果与返回的数据结构一致

* 以产品为中心

  客户端所需的数据，以及客户端支持的语言和运行时

* 强类型

  在服务端由GraphQL类型检测系统提供支持，每个数据都在模版中有对应的类型，并均会验证

* 客户端指定查询

* 类型自查

## 4 简单的了解一下REST

表述性状态传递（REST, Representational State Transfer): 面向资源，借助GET POST PUT DELETE等操作服务端数据。不同的路由产生不同的响应，没有强制规定数据响应的格式。

## 5 从REST到GraphQL

1. 过量获取，获取了大量不需要的数据。
2. 获取不足。新增了一项功能，需要其他的数据，此时就借口无法满足，不得不调用其他接口请求数据。
3. 管理REST接口。缺乏灵活性，需求发生变化，不得不修改接口或者创建新的接口，这也意味着前后端需要再一次沟通。

值得注意的是，许多公司同时使用GraphQL和REST。设置GraphQL接口从RESTful API获取数据是使用GraphQL的有效办法，GitHub发现“能够精准定义你想要的数据（且只有你想要的数据）”

## 6 GraphQL客户端库

作用：处理诸如网络请求、数据缓存以及数据注入页面等任务。

常见的客户端库： 

1. Relay(https://relay.dev/)

   搭配React和React Native使用，帮助React组件从GraphQL服务端获取数据

2. Apollo(https://www.apollographql.com/)

3. ...

## 7 GraphQL查询语言

SQL中可以运行的命令增(INSERT)删(DELETE)改(UPDATE)查(SELECT),对应到GraphQL就是查询(Query)和变更(Mutation),此外，GraphQL还新增了一个订阅功能。

操作信息一般放在POST请求体中。

如：

```
data: '{"query": "{allFlowers { name }}"}'
```



### 1 查询

```json
query {
  allStudents {
  	name
  	age
	}
	teachers: allTeachers {
    name
    gender
  }
	teacherCount(gender: MALE)
}
```

以上为一个查询操作,此处为具名的，比如`allStudents`

响应如下：

```json
{
  'data': {
    'allStudents': [
      {
        'name': 'Tom',
        'age': 21,
      },
      {
        'name': 'Sun',
        'age': 18,
      }
    ],
    teachers: [
      {
        'name': 'Kate',
        'gender': "FEMALE",
      },
      {
        'name': 'Marry',
        'gender': "FEMALE",
      },
      {
        'name': 'Mark',
        'gender': "Male",
      },
    ],
    'teacherCount': 1,
  }
}
```

#### 片段

GraphQL查询文档还可以定义片段，片段（fragment)指可以在多个操作中重复使用的代码。

举例如下：

```json
fragment liftInfo on Lift {
  name
  status
  height
}
query {
  Lift(id: 'test') {
    ...liftInfo
    others {
      history
      name
    }
  }
}
```

等价于

```json
query {
  Lift {
  	name
  	status
  	height
  	others {
   		history
   		name
  	}
 	}
}
```

使用有点类似ES6的扩展运算符,需要注意的是该查询是不具名的

#### 联合类型

一般来说，查询返回的是单一类型的对象列表。但是当我们需要返回的列表项不止一种类型，比如同时请求教师和学生信息时，此时可以创建联合类型（union type), 它可以把多个不同类型的对象关联起来。

举例如下：

```json
query schedule {
  studentAndTeacher {
  	...on Student {
  		name
  		age
		}
		...on Teacher {
      name
      subject
    }
	}
}
```

响应如下：

```json
{
  'data': [
    {'name': 'Kate', age: 31},
    {'name': 'Ben', age: 29},
    {'name': 'Kun', subject: 'English'},
    {'name': 'Ben', subject: 'Art'},
    {'name': 'Sun', age: 29},
  ]
}
```

#### 接口

处理单个字段返回的多个对象类型时使用接口（interface)

举例如下

```json
query schedule {
  student {
  	name
  	age
  	...on Boy {
  		sports
		}
	}
}
```

该查询操作主要查询所有的学生（name、a ge),如果是男生类型，还要另外返回喜欢的运动（sports)信息

### 2 变更

当需要变更数据时，就要用到变更操作(mutation)，写法和查询操作类似。

```json
mutation updateStudentInfo {
  deleteAllStudent
  addStudent(name, age, gender) {
    id
    name
  }
	updateStudent(id: '01ax', name: 'Sun') {
    name
    age
  }
}
```

上述操作的作用分别是删除、新增、更新。

### 3 订阅

订阅功能顾名思义，就是监听GraphQL API以进行实时的数据更改。举个例子，比如实时点赞作为一个由订阅支持的用例，且客户端订阅了该点赞事件，则每当发生点赞操作时，客户端可以在不刷新页面的情况下获得当前点赞信息。

代码示例如下：

```json
subscription {
  thumbsUp {
  	count
	}
}

mutation articleOperation {
  giveThumbsUp(id: 'x-x-12') {
    count
  }
}
```

当操作giveThumbsUp时，此时thumbsUp触发，实时拿到最新count信息



## 8 GraphQL API工具

针对GraphQL API的GraphQL查询字段测试工具。常见如下：

GraphiQL

GraphQL Playground

## 9 设计schema

在设计GraphQL API之前，我们需要先对数据类型进行设计并确定下来。这种类型的集合就是schema。

schema优先，可以使团队拥有一致的数据类型。后段可以清晰的了解需要存储和交付的数据，前端可以更方便的构建页面。简而言之，在确定了schema之后，前后端可以并行开始工作。

为了方便的定义类型，GraphQL附带了一种语言——模版定义语言（SDL).

GraphQL schema文档是定义可用类型的文本文档，客户端和服务端通过它来验证GraphQL请求。

代码如下：

文档.   xxxx.graphql

```json
"""
注释
"""
type User {
  """
  用户的名字
  """
  name: String
  photos: [Photo!]!
}
```

### 类型 type

```json
type Photo {
  id: ID!
  url: String!
  description: String
  name: String!
}
```

感叹号！表示非空，上面自定义了一个GraphQL对象类型——Photo类型

### 标量类型

GraphQL内置了一些标量类型类型，包括： Int, Float, String, Boolean, ID。标量类型不是对象类型，所以它没有字段，可以理解为没有属性。ID是表现为值唯一的字符串。

我们也可以自定义一些标量类型，或者引入第三方库。

```
scalar DateTime
type Son {
	birthday: DateTime!
}
```

枚举类型（enum)也属于标量类型

```
enum PhotoCategory {
	HUMAN
	ANIMAL
}
type Photo {
	id: ID!
	category: PhotoCategory!
}
```

### 连接和列表

连接数据和查询多种类型相关数据的能力是GraphQL的一个重要特征。借助这个特征，可以把多个对象关联起来。

#### 连接

1. 一对一连接

   ```
   type User {
    id: ID!
    name: String
   }
   type Photo {
     id: ID!
     name: String
     postedBy: User!
   }
   ```

   此时`User`和`Photo`就通过`postedBy`连接起来

2. 一对多连接

   ```
   type User {
   	id: ID!
   	name: String
   	photos: [Photo!]!
   }
   ```

   一个人可以发多张图片，也就是一对多

3. 多对多连接

   多对多的场景举例：10个人，10张图片，每个人可以喜欢多张图片。

   ```
   type User {
   	likePhotos: [Photo!]!
   }
   type Photo {
   	beLikedUser: [User!]!	
   }
   ```

#### 列表

在列表中返回的数据不一定需要相同的类型。之前在第7节中有说到联合类型与接口，结合起来看：

1. 联合类型

   ```
   union Item = Student | Teacher
   type Student {}
   type Teacher {}
   type Query {
   	item: [Item!]!
   }

   query schedule {
    item {
    	...on Student {}
    	...on Teacher {}
    }
   }
   ```


2. 接口类型

```
interface Male { name: String! }
type Father implements Male {
	name: String!
	work: String!
}
type Son implements Male { name: String! }
type Query { item: [Male!]!}
quey schedule {
	item {
		name
		...on Father {
			work: String
		}
	}
}
```

### 参数

定义

```
type Query {
	People(id: ID!, city: City): People!
}
```

用户发送

```
query {
 People(id: '123456x') {
 		name
 		gender
 }
}
```

上述表示查询一个身份证（id) 为123456x的人的姓名和性别。也可以加上City条件。city和id即是参数，id必传。

1. 筛选

   参数可以非必传，此时非必传的参数可以对结果进行筛选。

   ```
   query {
   	Flower(color: 'red') {}
   }
   ```

   查询所有为红色的花朵

   ```
   quey {
   	Flower(color: 'red', months: 1)
   }
   ```

   可以用来查询红色且花龄1个月的花

2. 变更

   变更的类型也要定义在schema中。

   ```
   type Mutation {
   	updateInfo(
   		id: ID!
   		name: String
   	): Info!
   }
   schema {
   	query: Query
   	mutation: Mutation
   }
   ```

   用户发送以下变更

   ```
   mutation {
    updateInfo(id: 'xc120ii', name: 'Tom') {
    		id
    		name
    		age
    		gender
    }
   }
   ```

### 输入类型

当查询和变更中用的参数较多时，我们可以定义输入类型。定义输入类型和查询操作

```
input ClothesInput {
	brand: String
	owner: Person!
	color: String
	season: String
}
type Query {
	findClothes(input: ClothesInput!): Clothes
}
```

定义操作：

```js
let myQuery = "query findClothes($input: ClothesInput!) {
	findClothes(input: $input) {
		brand
		owner
		color
		price
	}
}"
```

输入参数

```js
let myInput = "{
	'input': {
		'owner': 'Mary',
		'color': 'red',
	}
}"
```

发送请求

```js
gRequest(url, myQuery, myInput).then(function (data) {});
```

### 返回类型

返回类型就是进行查询操作或变更操作后响应参数的类型，如上，Clothes就是查询操作findClothes的返回类型

### 订阅类型

定义和使用的方法和其他对象类型没有区别。

```
type Subscription {}
schema {
	query: Query
	subscription: Subscription
}
```