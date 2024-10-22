import {AutoIncrement, Column, CreatedAt, DataType, Model, PrimaryKey, UpdatedAt} from "sequelize-typescript";
import {ITestConfig} from "./TestConfig";

export interface IRecordHistory {
    id?: number
    fatherConfigName: string
    vehicleName: string
    path: string
    size?: string
    createdAt?: Date
    updatedAt?: Date
    testConfig: ITestConfig
}

export default class HistoryModel extends Model<IRecordHistory> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    vehicleName!: string;

    @Column(DataType.STRING)
    fatherConfigName!: string;

    @Column(DataType.JSON)
    testConfig?: ITestConfig;

    @Column(DataType.STRING)
    path!: string;

    @Column(DataType.STRING)
    size!: string;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;
}
