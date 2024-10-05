import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {ICollectorModel} from "./BoardManage/Collector.model";
import {IControllerModel} from "./BoardManage/Controller.model";

export interface ICollectUnitModel {
  id?: number
  collectUnitName: string
  core: IControllerModel
  collectors: ICollectorModel[]
}

@Table({
  tableName: 'collect_units',
})

export default class CollectUnit extends Model<ICollectUnitModel> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  collectUnitName!: string;

  @Column(DataType.JSON)
  core!: IControllerModel;

  @Column(DataType.JSON)
  collectors!: ICollectorModel[];
}
