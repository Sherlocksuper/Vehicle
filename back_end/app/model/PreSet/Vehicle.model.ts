import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {IProtocolModel} from "./Protocol.model";

/**
 * 车辆管理
 */

export interface IVehicleModel {
    id?: number
    vehicleName: string
    isDisabled: boolean
    protocols: IProtocolModel[]
}

@Table({
    tableName: 'vehicles'
})

export default class Vehicle extends Model<IVehicleModel> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    vehicleName!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    isDisabled!: boolean;

    @Column(DataType.JSON)
    protocols!: IProtocolModel[];
}
