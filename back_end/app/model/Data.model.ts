import {Column, CreatedAt, DataType, Model, Table, UpdatedAt} from "sequelize-typescript";

export interface IData {
  belongId: number
  configName: string
  name: string
  time: number
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

  @Column(DataType.FLOAT)
  value!: number;
}
