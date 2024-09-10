import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

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
    result: string
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

    @Column(DataType.STRING)
    result!: string;
}
