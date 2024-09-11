/**
 * 车辆信息
 */
import {IProtocol} from "@/apis/request/protocol.ts";
import {ICollector, IController} from "@/views/demo/Topology/PhyTopology.tsx";

export interface IVehicle {
    id?: number
    vehicleName: string
    isDisabled: boolean
    protocols: {
        protocol: IProtocol
        core: IController,
        collector: ICollector,
    }[]
}
