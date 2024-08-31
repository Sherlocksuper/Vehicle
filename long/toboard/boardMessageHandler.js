/**
 * 本文件用来处理上位机发送给龙芯开发板的消息
 * 分为start_collect开始采集和stop_collect停止采集
 */


// 处理上位机传来的消息
function handleReceiveBoardMessage(socket, message) {

}


// 处理未知类型的消息
function handleUnknownMessage(socket, message) {
  console.log('处理未知消息类型，消息内容:', message);
  // 可以选择发送错误消息或其他响应
  socket.write('未知消息类型\n');
}


export {handleReceiveBoardMessage};
