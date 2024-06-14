import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import User from '../User.model';

export interface IControllerModel {
    id?: number
    controllerName: string
    controllerAddress: string
    userId: number | null
    isDisabled: boolean
}

@Table({
    tableName: 'controllers',
    timestamps: false
})

/**
 * 核心控制板卡
 */
export default class Controller extends Model<IControllerModel> {
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    isDisabled!: boolean

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    controllerName!: string;

    @Column(DataType.STRING)
    controllerAddress!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    userId!: number

    @BelongsTo(() => User)
    user!: User
}