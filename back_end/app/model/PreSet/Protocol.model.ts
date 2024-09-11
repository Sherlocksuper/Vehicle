import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {Col} from "sequelize/types/utils";

export enum ProtocolType {
    FlexRay = 'FlexRay',
    CAN = 'CAN',
    MIC = 'MIC',
    B1552B = '1552B',
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
    signals: {
        // 信号名称
        name: string
        // 量纲
        dimension: string
        // 信号，在前端拼接好的
        // 信号1起点	信号1长度[7:2]   斜率乘或除[1]   偏移正或负[0]	信号1斜率	信号1偏移
        result: string
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
    signals!: {
        name: string
        dimension: string
        result: string
    }[]
}
