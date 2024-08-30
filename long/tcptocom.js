// 用来向上位机发送数据
const net = require('net')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data.toString())
  })
  socket.write('hello')
})
