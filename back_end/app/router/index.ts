import KoaRouter from 'koa-router'
import indexController from '../controller/indexController'
import UserController from '../controller/UserController'
import AuthMiddleware from '../middleware/AuthMiddleware'
import RequestBodyVerifyMiddleware from '../middleware/RequestBodyVerifyMiddleware'
import TestProcessController from '../controller/TestProcessController'
import BaseInfoController from '../controller/BaseInfoController'
import AssetsController from '../controller/AssetsController'
import VehicleController from "../controller/VehicleController";
import ProjectController from "../controller/ProjectController";
import TestTemplateController from "../controller/TestTemplateController";
import TestObjectNController from "../controller/TestObjectNController";
import TestProcessNController from "../controller/TestProcessNController";

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

// 测试流程相关接口
router.post('/createTestProcess', TestProcessController.createTestProcess)
router.get('/getTestProcessDetails', TestProcessController.getTestProcessDetails)
router.post('/editTestProcess', TestProcessController.editTestProcess)
router.get('/getTestProcessList', TestProcessController.getTestProcessList)
router.post('/deleteTestProcess', TestProcessController.deleteTestProcess)
router.get('/getTestProcessConfig', TestProcessController.getTestProcessConfig)
router.post('/syncPreTestConfig', TestProcessController.syncPreTestConfig)
router.post('/sendTestConfig', TestProcessController.sendTestConfig)
router.get('/getSendedTestConfig', TestProcessController.getSendedTestConfig)
router.get('/getUserTestDashbordConfig', TestProcessController.getUserTestDashbordConfig)
router.post('/copyTestProcess', TestProcessController.copyTestProcess)

/**
 * Controller、Collector、Signal相关接口
 */
router.post('/createController', BaseInfoController.createController)
router.get('/getControllerList', BaseInfoController.getActiveControllerList)
router.get('/getAllControllerList', BaseInfoController.getAllControllerList)

/**
 * 采集卡相关接口
 */
router.post('/createCollector', BaseInfoController.createCollector)
router.get('/getCollectorList', BaseInfoController.getActiveCollectorList)
router.get('/getAllCollectorList', BaseInfoController.getAllCollectorList)


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


// 资源下载接口
router.get('/downloadPreTestConfigFile', AssetsController.downloadPreTestConfigFile)
router.get('/downloadPreTestConfigFileTemp', AssetsController.downloadPreTestConfigFileTemp)
router.get('/downloadTestProcessConfigFileById', AssetsController.downloadTestProcessConfigFileById)
router.get('/downloadUserSendedTestProcessConfig', AssetsController.downloadUserSendedTestProcessConfig)

export default router