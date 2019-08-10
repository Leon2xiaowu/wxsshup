const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server;

// 创建 websocket 服务器 监听在 3000 端口
const wssListener = new WebSocketServer({port: 3000})
let listener = null

// 服务器被客户端连接
wssListener.on('connection', (ws,req) => {
  // 通过 ws 对象，就可以获取到客户端发送过来的信息和主动推送信息给客户端
  const url = req.url

  if (url === '/listener') {
    listener = ws
    // ws.send('连接UI调试系统：successful')
  } else if (url === '/updater') {
    ws.send('可通过输入内容来动态更新样式表')
    sendMsgToClient(ws)
  }
})

function sendMsgToClient(ws) {
  ws && ws.on('message', (msg) => {
    console.log('获得Updater传来的数据',msg);
    listener && listener.send(msg)
  })
}

console.log(`[Listener SERVER] ws://localhost:3000/updater`)


// wssListener.on('close', () => {
//   console.log(`[Listener SERVER] disconnection()`)
// })


