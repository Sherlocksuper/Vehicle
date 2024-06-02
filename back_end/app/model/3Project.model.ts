import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    HasMany,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import TestObject from "./2TestObject.model";
import CollectorSignal from "./4CollectorSignal.model";
import {ICollectorModel} from "./Collector.model";
import {IControllerModel} from "./Controller.model";
import {ISignalModel} from "./Signal.model";

/**
 * Project测试项目
 * 举例：室外项目、越野项目
 * 每个项目 包含 指标、采集板卡
 */
export interface IProjectModel {
    id?: number
    projectName: string
    testObjectId?: number  // 这里将testObjectId设为可选

    controller: IControllerModel
    collector: ICollectorModel
    single: ISignalModel
}

@Table({
    tableName: 'projects',
    timestamps: false
})

//Project可以作为一个独立的元素，也可以属于一个TestObject
export default class Project extends Model<IProjectModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    projectName!: string;
}