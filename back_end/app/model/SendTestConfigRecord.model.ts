import {AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from 'sequelize-typescript'
import {ITestProcessConfig} from '../../utils/turnTestProcessConfigIntoExcel'
import {IControllerModel} from "./Controller.model";
import {ICollectorModel} from "./Collector.model";
import {ISignalModel} from "./Signal.model";

export enum DragItemType {
    BOOLEAN = 'BOOLEAN',
    LINE = 'LINE',
    NUMBER = 'NUMBER'
}

export interface IDragItem {
    id: string
    type: DragItemType,
    itemConfig: {
        requestSignalId: number | null
        requestSignals: ISignalItem[]
        x: number
        y: number
        width: number
        height: number
        title: string
        interval: number
        trueLabel?: string
        falseLabel?: string
        unit?: string
        during?: number
        min?: number
        max?: number
        label?: string
    }
}


export interface ISignalItem {
    vehicleName: string
    projectName: string
    controller: IControllerModel
    collector: ICollectorModel
    signal: ISignalModel
}

interface ISendTestConfigRecordModel {
    id?: number
    userId: number
    testProcessConfig: ITestProcessConfig
    timestamp: number
    dashbordConfig: IDragItem[]
}

@Table({
    tableName: 'send_test_config_records',
    timestamps: false
})
export default class SendTestConfigRecord extends Model<ISendTestConfigRecordModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.BIGINT)
    timestamp!: string;

    @AllowNull(false)
    @Column(DataType.JSON)
    testProcessConfig!: ITestProcessConfig;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    userId!: number;

    @AllowNull(false)
    @Column(DataType.JSON)
    dashbordConfig!: IDragItem[];

}