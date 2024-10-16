import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Col} from "sequelize/types/utils";
export interface IProtocolSignal {
    id: string
    name: string
    belongVehicle: string
    dimension: string
    startPoint: string
    length: string
    slope: string
    offset: string
}

export enum ProtocolType {
    FlexRay = 'FlexRay',
    CAN = 'CAN',
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
    listenAddress: number
    modadd: number
    dataUpdateRate: number
}


/// -------- 信号解析配置 --------


export interface IProtocolModel {
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
        cycleNumber?: number
        modadd?: number
        devId?: number
        rtAddress?: number
        childAddress?: number[]
        signals: IProtocolSignal[]
    }[]
}
