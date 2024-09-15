import KoaRouter from 'koa-router'
// Import TestConfigController at the top of your file
import TestConfigController from '../controller/TestConfig';
import indexController from '../controller/indexController'
import UserController from '../controller/UserController'
import AuthMiddleware from '../middleware/AuthMiddleware'
import RequestBodyVerifyMiddleware from '../middleware/RequestBodyVerifyMiddleware'
import BaseInfoController from '../controller/BaseInfoController'
import VehicleController from "../controller/PreSet/VehicleController";
import ProjectController from "../controller/PreSet/ProjectController";
import TestTemplateController from "../controller/PreSet/TestTemplateController";
import TestObjectNController from "../controller/TestObjectNController";
import TestProcessNController from "../controller/TestProcessNController";
import HistoryController from "../controller/HistoryController";
import ProtocalController from "../controller/PreSet/ProtocalController";
import {Context} from "koa";
import {PassThrough} from "stream";

const router = new KoaRouter({
  prefix: ''
})
router.use(RequestBodyVerifyMiddleware)

// 用户权限相关接口
router.post('/login', UserController.login)
router.use(AuthMiddleware)
router.get('/', indexController.index)
router.get('/getUserList', UserController.getUserList)
router.post('/createUser', UserController.createUser)
router.post('/closeUser', UserController.closeUser)
router.post('/openUser', UserController.openUser)
router.post('/deleteUser', UserController.deleteUser)
router.post('/changePassword', UserController.changePassword)
router.post('/logout', UserController.logout)

/**
 * 测试流程相关接口
 */

/**
 * Controller、Collector、Signal相关接口
 */
router.post('/createController', BaseInfoController.createController)
router.get('/getControllerList', BaseInfoController.getActiveControllerList)
router.get('/getAllControllerList', BaseInfoController.getAllControllerList)
router.post('/updateController', BaseInfoController.updateController)

/**
 * 采集卡相关接口
 */
router.post('/createCollector', BaseInfoController.createCollector)
router.get('/getCollectorList', BaseInfoController.getActiveCollectorList)
router.get('/getAllCollectorList', BaseInfoController.getAllCollectorList)
router.post('/updateCollector', BaseInfoController.updateCollector)


/**
 * 信号相关接口
 */
router.post('/createSignal', BaseInfoController.createSignal)
router.get('/getSignalListByCollectorId', BaseInfoController.getSignalListByCollectorId)
router.get('/getTestDevicesInfo', BaseInfoController.getTestDevicesInfo)


/**
 * 车辆管理接口
 * created by lby on 6.2
 */
router.get('/getVehicleList', VehicleController.getVehicles)
router.post('/createVehicle', VehicleController.createVehicle)
router.get('/getVehicleById/:id', VehicleController.getVehicleById)
router.post('/updateVehicle/:id', VehicleController.updateVehicle)
router.post('/deleteVehicle/:id', VehicleController.deleteVehicle)

/**
 * 项目管理接口
 * created by lby on 6.2
 */
router.get('/getProjectList', ProjectController.getProjectList)
router.post('/createProject', ProjectController.createProject)
router.post('/updateProject/:id', ProjectController.updateProject)
router.get('/getProjectById/:id', ProjectController.getProjectById)
router.post('/deleteProject/:id', ProjectController.deleteProject)

/**
 * 测试模板管理接口 TestTemplate
 * created by lby on 6.2
 */
router.get('/getTestTemplateList', TestTemplateController.getTestTemplateList)
router.post('/createTestTemplate', TestTemplateController.createTestTemplate)
router.post('/updateTestTemplate/:id', TestTemplateController.updateTestTemplate)
router.get('/getTestTemplateById/:id', TestTemplateController.getTestTemplateById)
router.post('/deleteTestTemplate/:id', TestTemplateController.deleteTestTemplate)

/**
 * 测试对象管理接口 TestObject
 * created by lby on 6.2
 */
router.get('/getTestObjectNList', TestObjectNController.getAllTestObjectN)
router.post('/createTestObjectN', TestObjectNController.createTestObjectN)
router.post('/updateTestObjectN/:id', TestObjectNController.updateTestObjectNById)
router.get('/getTestObjectNById/:id', TestObjectNController.getTestObjectNById)
router.post('/deleteTestObjectN/:id', TestObjectNController.deleteTestObjectNById)


/**
 * 测试流程管理接口 TestProcessN
 * created by lby on 6.5
 */
router.get('/getTestProcessNList', TestProcessNController.getAllTestProcessNs)
router.post('/createTestProcessN', TestProcessNController.createTestProcessN)
router.get('/getTestProcessNById/:id', TestProcessNController.getTestProcessN)
router.post('/updateTestProcessN/:id', TestProcessNController.updateTestProcessN)
router.post('/deleteTestProcessN/:id', TestProcessNController.deleteTestProcessN)

/**
 * 下发测试流程、获取当前测试流程、停止当前测试流程
 */
router.post('/downTestProcessN', TestProcessNController.downTestProcessN)
router.get('/getCurrentTestProcessN', TestProcessNController.getCurrentTestProcessN)
router.get('/stopCurrentTestProcessN', TestProcessNController.stopCurrentTestProcessN)


/**
 * history
 */
router.get('/getHistory', HistoryController.getAllHistory)
router.post('/addHistory', HistoryController.addHistory)
router.post('/deleteHistory/:id', HistoryController.deleteHistory)

/**
 * Protocol 协议
 */
router.get('/getProtocolList', ProtocalController.getProtocolList)
router.post('/createProtocol', ProtocalController.createProtocol)
router.post('/updateProtocol/:id', ProtocalController.updateProtocol)
router.get('/getProtocolById/:id', ProtocalController.getProtocolById)
router.get('/deleteProtocol/:id', ProtocalController.deleteProtocol)


// Then add these routes in your router configuration
router.post('/createTestConfig', TestConfigController.createTestConfig);
router.get('/deleteTestConfig/:id', TestConfigController.deleteTestConfigById);
router.get('/getTestConfig/:id', TestConfigController.getTestConfigById);
router.get('/getAllTestConfig', TestConfigController.getAllTestConfig);

//
/**
 * 通过id更新测试配置
 * @param id
 * @param param
 */
// async updateTestConfigById

router.post('/updateTestConfig/:id', TestConfigController.updateTestConfigById);


// 下发测试配置、获取当前测试配置、停止当前测试配置
router.post('/downTestConfig', TestConfigController.downTestConfig);
router.get('/getCurrentTestConfig', TestConfigController.getCurrentTestConfig);
router.get('/stopCurrentTestConfig', TestConfigController.stopCurrentTestConfig);

export default router
