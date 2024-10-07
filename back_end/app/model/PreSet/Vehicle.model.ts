import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";
import {IProtocolModel} from "./Protocol.model";
import {IControllerModel} from "../BoardManage/Controller.model";
import {ICollectorModel} from "../BoardManage/Collector.model";
import {ICollectUnitModel} from "../CollectUnit.model";

/**
 * 车辆管理
 */

export interface IVehicleModel {
    id?: number
    vehicleName: string
    isDisabled: boolean
    equipmentType: string
    protocols: {
        protocol: IProtocolModel,
        core: IControllerModel,
        collector: ICollectorModel,
    }[]
    collectUnits: ICollectUnitModel[]
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

    @Column(DataType.STRING)
    equipmentType!: string;

    @Column(DataType.JSON)
    protocols!: {
        protocol: IProtocolModel,
        core: IControllerModel,
        collector: ICollectorModel,
    }[];

    @Column(DataType.JSON)
    collectUnits!: ICollectUnitModel[];
}
