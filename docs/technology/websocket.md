---
title: WebSocket 实时通信详解
date: 2026-03-01
tags:
  - WebSocket
  - 实时通信
categories:
  - IT
---

## 前言

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，适用于实时聊天、游戏、股票行情等场景。

## 什么是 WebSocket

### HTTP vs WebSocket

| 特性 | HTTP | WebSocket |
|------|------|----------|
| 通信方式 | 请求-响应 | 全双工 |
| 连接 | 短连接 | 长连接 |
| 推送 | 轮询 | 服务器主动推送 |
| 头部开销 | 较大 | 较小 |

### 工作原理

```
握手（HTTP） → WebSocket 连接 → 全双工通信
```

```http
# 请求
GET /ws HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

# 响应
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
```

## 基础 API

### 客户端

```javascript
const ws = new WebSocket('wss://example.com/ws');

ws.onopen = () => {
  console.log('连接建立');
  ws.send('Hello Server!');
};

ws.onmessage = (event) => {
  console.log('收到消息:', event.data);
};

ws.onerror = (error) => {
  console.error('错误:', error);
};

ws.onclose = () => {
  console.log('连接关闭');
};

// 发送消息
ws.send(JSON.stringify({ type: 'message', content: 'Hello' }));

// 关闭连接
ws.close();
```

### 服务端（Node.js）

```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('客户端连接');
  
  ws.on('message', (message) => {
    console.log('收到:', message.toString());
    ws.send('收到: ' + message);
  });
  
  ws.on('close', () => {
    console.log('客户端断开');
  });
});
```

## 实战应用

### 1. 聊天室

```javascript
// 客户端
class ChatRoom {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.setupHandlers();
  }
  
  setupHandlers() {
    this.ws.onopen = () => console.log('Connected');
    
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.displayMessage(msg);
    };
  }
  
  sendMessage(text, username) {
    this.ws.send(JSON.stringify({
      type: 'chat',
      username,
      text,
      timestamp: Date.now()
    }));
  }
  
  displayMessage(msg) {
    console.log(`[${msg.username}]: ${msg.text}`);
  }
}

// 服务端
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    // 广播给所有客户端
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });
});
```

### 2. 心跳检测

```javascript
// 客户端
class Heartbeat {
  constructor(url, interval = 30000) {
    this.ws = new WebSocket(url);
    this.interval = interval;
    this.setupHeartbeat();
  }
  
  setupHeartbeat() {
    this.ws.onopen = () => this.startHeartbeat();
    this.ws.onclose = () => this.stopHeartbeat();
  }
  
  startHeartbeat() {
    this.timer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.interval);
  }
  
  stopHeartbeat() {
    if (this.timer) clearInterval(this.timer);
  }
}

// 服务端
wss.on('connection', (ws) => {
  ws.isAlive = true;
  
  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

// 定期检查
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
```

### 3. 断线重连

```javascript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.reconnectInterval = options.reconnectInterval || 1000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectAttempts = 0;
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectAttempts = 0;
      this.onopen?.();
    };
    
    this.ws.onclose = () => {
      this.reconnect();
    };
    
    this.ws.onmessage = (e) => this.onmessage?.(e);
    this.ws.onerror = (e) => this.onerror?.(e);
  }
  
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms...`);
    setTimeout(() => this.connect(), delay);
  }
  
  send(data) {
    this.ws?.send(data);
  }
}
```

## 安全

### WSS（WebSocket Secure）

```javascript
// 使用 wss 而不是 ws
const ws = new WebSocket('wss://secure.example.com/ws');
```

### 认证

```javascript
// 方式1：URL 参数
const ws = new WebSocket('wss://example.com/ws?token=xxx');

// 方式2：首次握手时传递
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'auth', token: 'xxx' }));
};
```

## 性能优化

### 1. 消息分片

```javascript
// 大消息分片发送
function sendLargeData(ws, data) {
  const chunkSize = 1024;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    ws.send(chunk);
  }
}
```

### 2. 二进制数据

```javascript
// 使用 ArrayBuffer
const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);
view.setFloat64(0, 3.14);
ws.send(buffer);

// 使用 Blob
const blob = new Blob([jsonData], { type: 'application/json' });
ws.send(blob);
```

## 总结

- **全双工**：服务器可以主动推送
- **长连接**：减少握手开销
- **API**：WebSocket 原生支持
- **应用**：聊天、游戏、实时协作
- **安全**：使用 WSS，注意认证
- **稳定**：心跳检测、断线重连
