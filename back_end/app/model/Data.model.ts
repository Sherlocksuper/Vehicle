import {Column, CreatedAt, DataType, Model, Table, UpdatedAt} from "sequelize-typescript";

export interface IData {
  // 所属历史记录的id
  belongId: number
  configName: string
  name: string
  time: number
  dimension: string
  value: number
}

@Table({
  tableName: 'data'
})
export default class DataModel extends Model<IData> {
@Column(DataType.INTEGER)
  belongId!: number;

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
