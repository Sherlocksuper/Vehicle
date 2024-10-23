import {Sequelize} from 'sequelize-typescript'
import DB_CONFIG from '../config/db_config'
import User from '../model/User.model'
import UserService from '../service/UserService'
import TokenBlackListItem from '../model/TokenBlackListItem.model'
import Controller from '../model/BoardManage/Controller.model'
import Collector from '../model/BoardManage/Collector.model'
import Signal from '../model/BoardManage/Signal.model'
import Vehicle from "../model/PreSet/Vehicle.model";
import Project from "../model/PreSet/3Project.model";
import TestObjectN from "../model/2TestObjectN.model";
import TestTemplate from "../model/PreSet/TestTemplate.model";
import HistoryModel from "../model/History.model";
import Protocol from "../model/PreSet/Protocol.model";
import TestConfig, {CurrentTestConfig} from "../model/TestConfig";
import TestConfigService from "../service/TestConfig";
import CollectUnit from "../model/CollectUnit.model";
import DataModel from "../model/Data.model";

const {DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT} = DB_CONFIG

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    port: DB_PORT,
    logging: false,
    models: [User, TokenBlackListItem, Controller, Collector, Signal, HistoryModel, Protocol, TestConfig, CurrentTestConfig, DataModel]
});

const DB_OPT = {
    async connectDB() {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    },
    async initDB() {
        try {
            // TODO 更新数据库
            // await sequelize.sync({force: true})
            // await sequelize.sync()
            // // 初始化核心板卡
            // await ControllerService.initControllers()
            // // 初始化采集板卡
            // await CollectorService.initCollectors()
            // // 初始化采集信号
            // await SignalService.initSignals()
            // // 初始化超级用户表
            await UserService.initRootUser()
            // // 初始化测试项目
            // // await ProjectService.initProject(10)
            // // 初始化Protocol协议
            // await ProtocolService.initProtocol()
            // // 初始化车辆
            // await VehicleService.initVehicleData()
            // // 初始化测试配置
            // await TestConfigService.initTestConfig()

            TestConfigService.tryRecoverConfig()
            console.log('The database table has been initialized.');
        } catch (error) {
            console.error('Description Database table initialization failed:', error);
        }
    },
    async closeConnection() {
        await sequelize.close()
    }
}
export default DB_OPT
