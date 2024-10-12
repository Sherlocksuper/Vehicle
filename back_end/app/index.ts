import Koa, {Context} from 'koa';
// @ts-ignore
import WebSocket from 'ws';
import router from './router';
import {Server} from 'http';
import DB from '../app/db';
import fileServer from 'koa-static';
import path from 'node:path';
import bodyparser from 'koa-body';
import * as http from 'http';
import {addWebSocket, removeWebSocket, sendMessageToFront} from "./ztcp/toFront";

const app = new Koa();
const staticPath = './public';

// 静态文件服务
app.use(fileServer(path.join(__dirname, staticPath)));
console.log(path.join(__dirname, staticPath));
app.use(bodyparser({
  multipart: true,
}));
app.use(router.routes());

const server = http.createServer(app.callback());
const wss = new WebSocket.Server({noServer: true});

wss.on('connection', (ws: WebSocket) => {
  console.log('客户端已连接');
  addWebSocket(ws)
  ws.on('message', (message: Buffer) => {
    ws.send(`你发送的消息: ${message}`);
  });

  ws.on('close', () => {
    removeWebSocket(ws)
  });

  ws.on('error', (err: Error) => {
    removeWebSocket(ws)
    console.error('WebSocket 错误:', err);
  });

  ws.send('欢迎连接到 WebSocket 服务');
});
// 将 WebSocket 服务器与 HTTP 服务器集成
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;
  console.log('Received upgrade request for:', pathname);

  if (pathname === '/ws') {
    // @ts-ignore
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
      console.log('WebSocket upgrade completed, client connected');
    });
  } else {
    socket.destroy(); // 如果不是 WebSocket 请求，则销毁连接
  }
});

const run = async (port: string): Promise<Server> => {
  await DB.connectDB();
  await DB.initDB();
  return server.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
  });
};

export default run;
