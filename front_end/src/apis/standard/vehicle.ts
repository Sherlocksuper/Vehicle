/**
 * 车辆信息
 */
import {IProtocol} from "@/apis/request/protocol.ts";
import {ICollectorsConfigItem, IControllersConfigItem} from "@/views/demo/Topology/PhyTopology.tsx";

export interface IVehicle {
    id?: number
    vehicleName: string
    isDisabled: boolean
    protocols: {
        protocol: IProtocol
        core: IControllersConfigItem,
        collector: ICollectorsConfigItem,
    }[]
}
