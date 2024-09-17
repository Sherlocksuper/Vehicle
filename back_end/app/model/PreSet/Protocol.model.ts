import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Col} from "sequelize/types/utils";

// Flexray01,CAN02,MIC03,1552B04,串口：422为05，232为06，模拟量07，数字量08

export enum ProtocolType {
    FlexRay = 'FlexRay',
    CAN = 'CAN',
    MIC = 'MIC',
    B1552B = '1552B',
    Serial = "Serial",
    A422 = '422',
    A232 = '232',
    Analog = "Analog",
    Digital = "Digital"
}


export interface IProtocolSignal {
    id: string
    name: string
    dimension: string
    startPoint: string
    length: string
    slope: string
    offset: string
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

//模拟量
export interface IAnalogBaseConfig {
    dataUpdateRate: number
    voltageRange: number
}

//数字量
export interface IDigitalBaseConfig {
    dataUpdateRate: number
    voltageRange: number
}


/**
 * Protocol 协议
 * 只存储协议类型、协议名称
 * 其中协议结果是在前端拼接好的
 */
export interface IProtocolModel {
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

@Table({
    tableName: 'protocols',
})

export default class Protocol extends Model<IProtocolModel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    protocolName!: string;

    @Column(DataType.STRING)
    protocolType!: ProtocolType;

    @Column(DataType.JSON)
    baseConfig!: ICanBaseConfig | IFlexRayBaseConfig;

    @Column(DataType.JSON)
    signalsParsingConfig!: {
        frameNumber: string,
        frameId: string,
        cycleNumber?:number
        signals: IProtocolSignal[]
    }[]
}
