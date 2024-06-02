import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import Vehicle, {IVehicleModel} from "./Vehicle.model";
import {IProjectModel} from "./3Project.model";
import {ITestTemplate} from "./TestTemplate.model";

export interface ITestObjectNModel {
    id: number
    title: string
    vehicle: IVehicleModel
    project: IProjectModel
    template: ITestTemplate
}

/**
 * 新采集对象，包含
 * 1.采集对象，即车辆Vehicle.model
 * 2.采集项目，即Project
 * 3.采集模板，即TestModel
 */
@Table({
    tableName: 'testObj'
})
export default class TestObjectN extends Model<ITestObjectNModel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Column(DataType.STRING)
    title!: string

    @Column(DataType.JSON)
    vehicle!: IVehicleModel


    @Column(DataType.JSON)
    project!: IProjectModel

    @Column(DataType.JSON)
    template!: ITestTemplate
}