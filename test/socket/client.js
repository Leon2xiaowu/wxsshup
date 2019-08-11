const WebSocket = require('ws')
let href = 'ws://localhost:3000/listener'

let ws = new WebSocket(href);

// 打开WebSocket连接后立刻发送一条消息:
ws.on('open', function () {
    // console.log(`[CLIENT] open()`);
    // ws.send('Hello!');
})

// 响应收到的消息:
ws.on('message', function (message) {
  console.log('收到信息',message);

})

