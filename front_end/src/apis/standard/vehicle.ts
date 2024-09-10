/**
 * 车辆信息
 */
import {IProtocol} from "@/apis/request/protocol.ts";

export interface IVehicle {
    id?: number
    vehicleName: string
    isDisabled: boolean
    protocols: IProtocol[]
}
