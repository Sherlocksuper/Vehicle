import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Col} from "sequelize/types/utils";

export enum ProtocolType {
    FlexRay = 'FlexRay',
    CAN = 'CAN',
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
    macroticksPerCycle: number
    transmissionStartTime: number
    staticFramepayload: number
    staticSlotsCount: number
    dynamicSlotCount: number
    dynamicSlotLength: number
    setAsSyncNode: number
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
        signals: IProtocolSignal[]
    }[]
}
