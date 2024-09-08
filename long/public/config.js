export const longServerPort = 9001
export const comBackPort = 2889

export const comFrontPort = 2999

export const boardPort = 2866

//目标ip和端口号
export const TARGETIP = "192.168.1.66"
export const TARGETPORT = 2866


// 配置/模块类别
export const CAN = "CAN"
export const FLEXRAY = "Flexray"
export const MIC = "MIC"
export const _1552B = "1552B"
export const ANALOGDATA = "模拟量"
export const NUMBERDATA = "数字量"


// 根据目标type设置目标id和采集项
// type 是上面的几个枚举值
export function getTargetId(type) {
  //目标ID，Flexray、CAN、MIC、1552B、串口为02，模拟量、数字量为03
  switch (type) {
    case CAN:
    case FLEXRAY:
    case MIC:
    case _1552B:
      return 0x02
    case ANALOGDATA:
    case NUMBERDATA:
      return 0x03
    default:
      return 0x02
  }
}


// type 是上面的几个枚举值
export function getCollectItem(type) {
  //采集项，Flexray01,CAN02,MIC03,1552B04,串口：422为05，232为06，模拟量07，数字量08
  switch (type) {
    case FLEXRAY:
      return 0x01
    case CAN:
      return 0x02
    case MIC:
      return 0x03
    case _1552B:
      return 0x04
    case "422":
      return 0x05
    case "232":
      return 0x06
    case ANALOGDATA:
      return 0x07
    case NUMBERDATA:
      return 0x08
    default:
      return 0x01
  }
}
