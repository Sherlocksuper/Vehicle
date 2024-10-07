/**
 * 车辆信息
 */
import {IProtocol} from "@/apis/request/protocol.ts";
import {ICollector, IController} from "@/views/demo/Topology/PhyTopology.tsx";
import {ICollectUnit} from "@/apis/standard/collectUnit.ts";

export interface IVehicle {
    id?: number
    vehicleName: string
    isDisabled: boolean
    equipmentType: string
    protocols: {
        protocol: IProtocol
        core: IController,
        collector: ICollector,
    }[]
    collectUnits: ICollectUnit[]
}
