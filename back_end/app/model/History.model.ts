import {AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, UpdatedAt} from "sequelize-typescript";

export interface IRecordHistory {
    id?: number
    fatherConfigName: string
    path: string
    createdAt?: Date
    updatedAt?: Date
}

export default class HistoryModel extends Model<IRecordHistory> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    fatherConfigName!: string;

    @Column(DataType.STRING)
    path!: string;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;
}