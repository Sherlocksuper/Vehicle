import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {ITemplate} from "@/apis/standard/template.ts";

export interface ITestConfig {
    id: number
    name: string
    configs: {
        vehicle: IVehicle,
        projects: {
            name: string,
            indicators: {
                name: string,
                signal: IProtocolSignal
            }[]
        }[]
    }[]
    dataWrap: {
        equipmentType: string,
        equipmentId: string,
        version: string,
    }
    template: ITemplate
}


//测试过程格式
export interface ITestProcess {
    testProcessId?: number
    testName: string
    testObjects: TestObjects[]
}


//测试对象格式
export interface TestObjects {
    objectId?: number
    objectName: string
    collectorSignals: CollectorSignal[]
}

export interface CollectorSignal {
    collectorSignalId?: number
    collectorSignalName: string
    controllerId: number
    collectorId: number
    signalId: number
}

