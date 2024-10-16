import {request} from "@/utils/request.ts";
import {PROTOCOL_API} from "@/apis/url/protocol.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";


export enum ProtocolType {
  FlexRay = 'FlexRay',
  CAN = 'CAN',
  // TTCAN = 'TTCAN',
  MIC = 'MIC',
  B1552B = 'B1552B',
  Serial422 = "Serial422",
  Serial232 = "Serial232",
  Analog = "Analog",
  Digital = "Digital"
}

export interface ICanBaseConfig {
  baudRate: number
}

export interface IFlexRayBaseConfig {
  microticksPerCycle: number
  macroticksPerCycle: number
  transmissionStartTime: number
  staticFramepayload: number
  staticSlotLength: number
  staticSlotsCount: number
  dynamicSlotCount: number
  dynamicSlotLength: number
  setAsSyncNode: number
}

export interface ISerialBaseConfig {
  // 波特率、停止位、是否校验、校验类型
  baudRate: number
  stopBits: number
  check: number
  checkType: number
}

// 模拟量和数字量
export interface IAIOBaseConfig {
  dataUpdateRate: number
  voltageRange: number
}

export interface IMICBaseConfig {
  nctc: number
  btc: number
  nrtc: number
  modadd: number
  dataUpdateRate: number
}

export interface IB1552BBaseConfig{
  modadd: number
  dataUpdateRate: number
  listenAddress: number
}


/// -------- 信号解析配置 --------


export interface IProtocol {
  id?: number
  protocolName: string
  protocolType: ProtocolType
  baseConfig: ICanBaseConfig | IFlexRayBaseConfig  | IAIOBaseConfig | IMICBaseConfig | IB1552BBaseConfig | ISerialBaseConfig
  signalsParsingConfig: {
    frameNumber: string,
    frameId: string,
    cycleNumber?: number
    modadd?: number
    devId?: number[]
    rtAddress?: number
    childAddress?: number[]
    signals: IProtocolSignal[]
  }[]
}


export const getProtocols = async () => {
  const api = PROTOCOL_API.getProtocolList;
  return request({
    api: api
  });
}

/**
 * 创建项目
 * @param iProtocol
 */
export const createProtocol = async (iProtocol: IProtocol) => {
  const api = PROTOCOL_API.createProtocol;
  return request({
    api: api,
    params: iProtocol
  });

}

/**
 * 更新项目
 * @param id
 * @param iProtocol
 */
export const updateProtocol = async (iProtocol: IProtocol) => {
  const api = {...PROTOCOL_API.updateProtocol};
  const id = iProtocol.id!;
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
    params: iProtocol
  });
}

/**
 * 获取项目详情
 * @param id
 */
export const getProtocolById = async (id: number) => {
  const api = {...PROTOCOL_API.getProtocolById};
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
    params: {id: id}
  });
}

/**
 * 删除项目
 * @param id
 */
export const deleteProtocolApi = async (id: number) => {
  const api = {...PROTOCOL_API.deleteProtocol};
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
    params: {id: id}
  });
}
