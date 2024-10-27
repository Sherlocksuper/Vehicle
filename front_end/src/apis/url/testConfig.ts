// Then add these routes in your router configuration
import {ContentType, Method} from "@/apis/standard/all.ts";


export const TEST_CONFIG_API = {
// router.get('/getAllTestConfig', TestConfigController.getAllTestConfig);
  getTestConfigList: {
    url: '/getAllTestConfig',
    method: Method.GET,
    format: ContentType.JSON
  },
// router.post('/createTestConfig', TestConfigController.createTestConfig);
  createTestConfig: {
    url: '/createTestConfig',
    method: Method.POST,
    format: ContentType.JSON
  },
// router.get('/getTestConfig/:id', TestConfigController.getTestConfigById);
  getTestConfigById: {
    url: '/getTestConfig/:id',
    method: Method.GET,
    format: ContentType.JSON
  },
// router.delete('/deleteTestConfig/:id', TestConfigController.deleteTestConfigById);
  deleteTestConfig: {
    url: '/deleteTestConfig/:id',
    method: Method.GET,
    format: ContentType.JSON
  },
  //router.post('/downTestConfig', TestConfigController.downTestConfig);
  downTestConfig: {
    url: '/downTestConfig',
    method: Method.POST,
    format: ContentType.JSON
  },
  // router.get('/getCurrentTestConfig', TestConfigController.getCurrentTestConfig);
  getCurrentTestConfig: {
    url: '/getCurrentTestConfig',
    method: Method.GET,
    format: ContentType.JSON
  },
  // // 停止当前测试配置
  // router.get('/stopCurrentTestConfig', TestConfigController.stopCurrentTest);
  stopCurrentTestConfig: {
    url: '/stopCurrentTestConfig',
    method: Method.GET,
    format: ContentType.JSON
  },
  ////
  // /**
  //  * 通过id更新测试配置
  //  * @param id
  //  * @param param
  //  */
  // // async updateTestConfigById
  //
  // router.post('/updateTestConfig/:id', TestConfigController.updateTestConfigById);
  updateTestConfigById: {
    url: '/updateTestConfig/:id',
    method: Method.POST,
    format: ContentType.JSON
  },
  //建立eventsource连接
  // router.get('/startConnection', TestConfigController.startConnection);
  startConnection :{
    // url: 'startConnection',
    // url: 'api/startConnection',
    url: '/startConnection',
    method: Method.GET,
  },
  //router.get('/downHistoryDataAsJson', TestConfigController.downHistoryDataAsJson);
  downHistoryDataAsJson: {
    url: '/downHistoryDataAsJson',
    method: Method.GET,
  },
  //router.get('/startTcpConnect', TestConfigController.startTcpConnect);
  // router.get('/stopTcpConnect', TestConfigController.stopTcpConnect);
  startTcpConnect: {
    url: '/startTcpConnect',
    method: Method.GET,
    timeOut: 3000,
  },
  stopTcpConnect: {
    url: '/stopTcpConnect',
    method: Method.GET,
  },

  // router.get('/getTcpConnectStatus', TestConfigController.getTcpConnectStatus);
  getTcpConnectStatus: {
    url: '/getTcpConnectStatus',
    method: Method.GET,
  },
  //router.get('/getBoardStatus', TestConfigController.getBoardStatus);
  getBoardStatus: {
    url: '/getBoardStatus',
    method: Method.GET,
  },
}
