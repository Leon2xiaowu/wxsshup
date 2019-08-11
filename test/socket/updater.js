const WebSocket = require('ws')
let wss = new WebSocket('ws://localhost:3000/updater');

// 打开WebSocket连接后立刻发送一条消息:
wss.on('open', function () {
  wss.send(JSON.stringify({
    'container':'background-color: red;'
  }))
})

// 响应收到的消息:
// wss.on('message', function (message) {
//   console.log('收到信息',message);
// })

