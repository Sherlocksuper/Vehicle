import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

export interface IVehicleModel {
    id?: number
    vehicleName: string
    isDisabled: boolean
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
}