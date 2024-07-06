import {
    AutoIncrement,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";
import {ICollectorModel} from "../BoardManage/Collector.model";
import {IControllerModel} from "../BoardManage/Controller.model";
import {ISignalModel} from "../BoardManage/Signal.model";

/**
 * Project测试项目
 * 举例：室外项目、越野项目
 * 每个项目 包含 指标、采集板卡
 */
export interface IProjectModel {
    id?: number
    projectName: string
    projectConfig: {
        controller: IControllerModel
        collector: ICollectorModel
        signal: ISignalModel
    }[]
}

@Table({
    tableName: 'projects',
})

/**
 * Project可以作为一个独立的元素，也可以属于一个TestObject
 * Project示例：室外项目、越野项目
 * 每个Project包含一个指标、Controller、一个Collector、一个Signal
 */
export default class Project extends Model<IProjectModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    projectName!: string;

    @Column(DataType.JSON)
    projectConfig!: {
        controller: IControllerModel
        collector: ICollectorModel
        signal: ISignalModel
    }[]
}
