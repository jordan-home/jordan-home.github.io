---
title: PWA概览
date: 2021-04-16
categories:
  - IT
tags:
  - PWA
---

## 背景

### PWA 是什么

PWA全称Progressive Web App（渐进式WebApp），是通过现代API来构建和增强的，这些API提供了与原生App相似的能力、可靠性、可安装性，而且具备一套代码即可触达任何人、任何地方、任何设备。通过使用 `service worker` 和 `app manifest`，可以让你的WebApp具备可靠性和可安装性。如果浏览器不支持这些功能，网站的核心功能也不受影响。

三大特性说明：

- 功能性：丰富的功能
- 可靠性: 速度快，对网络的依赖低
- 可安装性：可以在独立的窗口打开

相对于原生App,体积更小; 可随时更新，无需用户下载安装;

### PWA vs 小程序

可以看作远古版的小程序。对比小程序，没有流行的原因：

1. **技术**层面，PWA劣势明显（厂商的斗争，如ios）
2. **流量**层面
3. **商业化**问题

## 相关的几个技术

主要包括 `Manifest 配置`、 `Service Worker`、  `离线存储` 、`后台同步` 和 `推送通知`。下面选择介绍的是`Service Worker 和 离线存储。

###  Manifest 配置文件

```json
{
  "name": "PWA Manifest Demo", // 应用名称，使用场景：启动页，安装提示
  "short_name": "Manifest Demo", // 应用短名称，使用场景：主屏幕
  "start_url": "./index.html", // 启动网址
  "theme_color": "#4374A5", // 
  "background_color": "#4374A5", // 首次启动时的填充色，避免白屏
  "display": "standalone", // 启动模式
  "orientation": "natural", //方向
  "icons": [{
    "src": "images/xxx.png",
    "sizes": "192x192",
    "type": "image/png"
  }] // 应用图标
}
```

配置项说明： 详见[完整 Web 应用清单](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)

通过该机制，Web 应用可以抹平与原生应用在启动方式、应用表现形式等方面大部分的差异

### Service Worker 

目的：弥补Web 应用在离线处理上的缺陷，降低对网络的依赖程度

#### 对比Web Worker

Web Worker: 现代浏览器提供的一个 JavaScript 多线程解决方案,将复杂、耗时的运算交给 `Web Worker` 执行以达到释放主线程的目的

Service Worker: 基于Web Worker，通过请求代理、本地缓存、后台同步等机制来提供离线处理能力

差异分析：

##### 相同点

- 都独立于主线程，以单独线程的形式运行。
- 都不能直接访问并操作 `DOM`、`window` 对象。
- 都是通过 `postMessage` 接口与主线程进行交互。

##### 区别

- `Service Worker` 内部大部分为基于 `Promise` 的异步操作。
- `Service Worker` 必须运行在 HTTPS 环境下以避免中间人攻击。
- `Service Worker` 的生命周期完全独立于网页，且可在不用时被中止、在下次有需要时重启。

#### 生命周期

![img](https://pic4.zhimg.com/80/v2-6aaaec843f5e8894d2aa3fc26eeab147_1440w.png)

1. 注册

   ```js
   if ('serviceWorker' in navigator) {
     window.addEventListener('load', function() {
       navigator.serviceWorker.register('./sw.js', { scope: './' }).then(function(registration) {
         // do domething...
       }).catch(function(err) {
         // do domething...
       });
     });
   }
   ```

   * 注册成功仅仅表明指定脚本已成功解析，并不意味着 `Service Worker` 已经安装或处于激活状态
   * `scope` 参数指定了 `Service Worker` 可接收 `fetch` 事件的作用域，`scope` 的值为 `/mobile`，那么 `Service Worker` 便只能接收 `path` 以 `/mobile` 开头的 `fetch` 事件，默认值为 `sw.js` 所在路径

2. 安装

   注册完成后，浏览器尝试进行安装。触发安装的两个条件：

   1. `Service Worker`没有安装
   2. `Service Worker`安装了，但是获取的sw.js与本地有差异

   ```js
   self.addEventListener('install', function(event) {
     event.waitUntil(
       caches.open('sw-cache').then(function(cache) {
         return cache.addAll([
           '/',
           '/xxx.xx',
         ]);
       })
     );
   });
   ```

   上述代码，监听`install`事件。一般在该过程，会对静态资源进行存储，直到都存储完成后，才安装结束，可以进入下一个生命周期。

3. 等待

   安装成功后，如果此时存在另一个版本的SW,且正在被使用，就会进入等待状态；只有使用旧版本SW的所有页面都销毁之后，才能进入下一状态，激活当前的SW。

   也可以强制跳过等待，使所有页面都及时更新。

   ```js
   self.addEventListener('install', function(event) {
     self.skipWaiting();
     //……
   });
   ```

4. 激活

   ```js
   self.addEventListener('activate', function(event) {
     event.waitUntil(
       self.clients.claim()
       caches.keys().then(function(cacheNames) {
         return Promise.all(
           cacheNames.filter(function(cacheName) {
             return cacheName != 'sw-cache';
           }).map(function(cacheName) {
             return caches.delete(cacheName);
           })
         );
       })
     );
   });
   ```

   常通过订阅该事件对缓存进行处理

   当 `Service Worker` 被首次注册时，已打开的页面只有在刷新后才会接受 `Service Worker` 的控制

   可在 调用 `self.clients.claim` 方法来实现在激活后尽快掌握这些页面的控制权

5. 已激活

   该状态下可以监听fetch、push、sync等事件，实现离线处理

6. 注销

   ```js
   const serviceWorker = navigator.serviceWorker;
   if (typeof serviceWorker.getRegistrations === 'function') {
     serviceWorker.getRegistrations().then(function(registrations) {
       registrations.forEach(function(registration) {
         registration.unregister();
       });
     });
   } else if (typeof serviceWorker.getRegistration === 'function') {
     serviceWorker.getRegistration().then(function(registration) {
       registration.unregister();
     })
   }
   ```

   注销的时候，不会自动清理本地缓存。需要另外处理。

7. 废弃

   安装失败、激活失败、注销成功、或被新版本的SW替换都会进入废弃状态。

#### 状态监听

```js
navigator.serviceWorker.register('./sw.js').then(function(registration) {
  const newWorker = registration.installing; // installing waiting active
  newWorker.addEventListener('statechange', function() {
    // 或者 updatefound
    console.log(newWorker.state);
  });
});
```

#### 几个常用事件

1. install
2. activate
3. fetch： 接收 `Service Worker` 作用域下的 `fetch` 事件
4. sync：后台同步事件，由 `BackgroundSync API` 发出
5. message：实现与主进程的交互
6. push：响应来自系统的推送消息
7. notificationclick：推送通知点击事件，一般用来处理通知与用户的交互

### 离线存储

#### 存储方案对比

* Cookie、LocalStorage和SessionStorage

  均无法在 `Service Worker` 环境下访问；

  且 `Service Worker` 的离线存储要求能够存储大量、具有不同格式的数据

* Web Sql（已被W3C废弃，浏览器支持度不高） 和 IndexedDB

  可以看作数据库在客户端的实现

  * 存储数据格式丰富
  * 存储体积大
  * 生命周期永久
  * 仅在客户端
  * 可以在`Web Worker` 及 `Service Worker` 环境下访问

  存储方案要求：1. `Service Worker` 环境下访问；2. 数据格式丰富且存储空间足够。

  综合起来比较，选择了IndexedDB。

#### IndexedDB

```js
const openRequest = window.indexedDB.open('TodoList', 1); // 打开数据库TodoList版本号1
openRequest.onupgradeneeded = function(event) {
  // 如果打开失败
  const db = event.target.result;
  // todos 可以看作表名或存储空间名
  // 表的key是id,自增
  const todosStore = db.createObjectStore('todos', { keyPath: 'id', autoIncrement : true });
  todosStore.createIndex('status', 'status');
};
openRequest.onsuccess = function(event) {
  const db = event.target.result;
  // ……
};

```

[IndexedDB 使用文档 ](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)

#### CacheStorage

[获取`CacheStorage`的`Cache API`](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage#methods): `open`,`keys`,`has`,,`match`，`matchAll`

[进行操作的`Cache API`](https://developer.mozilla.org/en-US/docs/Web/API/Cache#methods)：`add`, `addAll`, `put`, `delete`等 

#### 选择

- 对于网址可寻址的（比如脚本、样式、图片、HTML 等）资源使用 `CacheStorage`
- 其他资源则使用 `IndexedDB`

## 框架

构建PWA的流程有很多相似的地方，可以将预缓存处理、请求策略、缓存置换等逻辑进行进一步抽象。

Google 官方推出的 `PWA` 应用框架 [Workbox](https://github.com/GoogleChrome/workbox)

