---
title: "WebSocket 实时通信详解"
pubDate: 2026-03-01
description: "WebSocket 协议、握手、心跳、重连、Node.js + ws 实现。"
category: technology
tags: ["WebSocket", "实时通信"]
---

WebSocket 是浏览器和服务器全双工通信的标准协议。

## 为什么不用 HTTP 轮询

HTTP 是请求-响应模式，要做"服务端推消息"必须轮询：
- 短轮询：定时发请求，浪费
- 长轮询：服务器挂住连接，更浪费

WebSocket 一次握手，永久双向通信。

## 握手过程

客户端 HTTP Upgrade 请求：

```
GET /ws HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13
```

服务器响应 101 Switching Protocols。

之后就是双向二进制帧交换。

## Node.js 实现（ws 库）

```javascript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    console.log('Received:', data.toString());
    ws.send(`Echo: ${data}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Welcome!');
});

// 广播
function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(message);
  });
}
```

## 关键实践

### 1. 心跳

定期 ping/pong 检测死连接：

```javascript
setInterval(() => {
  wss.clients.forEach(ws => {
    if (Date.now() - ws.lastPong > 30000) {
      ws.terminate();
      return;
    }
    ws.ping();
  });
}, 10000);
```

### 2. 重连

浏览器端断网要自动重连，**带 jitter**（避免雪崩）：

```javascript
function connect() {
  ws = new WebSocket(url);
  ws.onclose = () => setTimeout(connect, 1000 + Math.random() * 2000);
  ws.onerror = () => {};
}
```

### 3. 鉴权

WebSocket 协议没有"Authorization 头"概念。常见做法：
- 握手时带 token（URL 参数 / Sec-WebSocket-Protocol）
- 第一条消息是认证消息

### 4. 二进制

WebSocket 也支持二进制帧。比 JSON 文本小 30%+：

```javascript
ws.binaryType = 'arraybuffer';
ws.onmessage = (e) => {
  if (e.data instanceof ArrayBuffer) {
    const view = new DataView(e.data);
    // ...
  }
};
```

## 适用场景

- 聊天
- 实时数据（股价 / 比分 / 协作文档）
- 游戏
- 通知推送

WebSocket 是实时 Web 的核心。