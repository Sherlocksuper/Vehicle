import {request} from "@/utils/request.ts";
import {PROTOCOL_API} from "@/apis/url/protocol.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";


export enum ProtocolType {
    FlexRay = 'FlexRay',
    CAN = 'CAN',
    Serial = "Serial",
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
    staticSlotsCount: number
    dynamicSlotCount: number
    dynamicSlotLength: number
    setAsSyncNode: number
}


export interface IProtocol {
    id?: number
    protocolName: string
    protocolType: ProtocolType
    baseConfig: ICanBaseConfig | IFlexRayBaseConfig
    signalsParsingConfig: {
        frameNumber: string,
        frameId: string,
        cycleNumber?:number
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
export const updateProtocol = async (id: number, iProtocol: IProtocol) => {
    const api = {...PROTOCOL_API.updateProtocol};
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
