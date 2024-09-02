// 当前采集配置
export let currentCollectConfig = null

// 存储两个客户端的套接字
// 上位机
export let clientComputer = null;

// 下位机
export let clientBoard = null;

export function setCurrentCollectConfig(config){
  currentCollectConfig = config
}

export function setClientComputer(socket) {
  clientComputer = socket;
}

export function setClientBoard(socket) {
  clientBoard = socket;
}
