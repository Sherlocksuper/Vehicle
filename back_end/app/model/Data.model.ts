import {Column, CreatedAt, DataType, Model, Table, UpdatedAt} from "sequelize-typescript";

export interface IData {
  id?: number
  // 所属历史记录的id
  belongId: number
  // 在图表中的id, 用来指明数据流向
  signalId: string
  configName: string
  name: string
  time: number
  dimension: string
  value: number
  createdAt?: Date
  updatedAt?: Date
}

@Table({
  tableName: 'data'
})
export default class DataModel extends Model<IData> {

  @Column(DataType.INTEGER)
  belongId!: number;

  @Column(DataType.STRING)
  signalId!: string;

  @Column(DataType.STRING)
  configName!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.BIGINT)
  time!: number;

  @Column(DataType.STRING)
  dimension!: string;

  @Column(DataType.FLOAT)
  value!: number;
}
