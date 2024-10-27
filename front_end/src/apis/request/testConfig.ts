/**
 * 获取项目列表
 */
import {request} from "@/utils/request.ts";
import {TEST_CONFIG_API} from "@/apis/url/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const getTestConfigs = async () => {
  const api = TEST_CONFIG_API.getTestConfigList;
  return request({
    api: api
  });
}

/**
 * 创建项目
 * @param iConfig
 */
export const createTestConfig = async (iConfig: ITestConfig) => {
  const api = TEST_CONFIG_API.createTestConfig;
  return request({
    api: api,
    params: iConfig
  });

}


/**
 * 获取项目详情
 * @param id
 */
export const getTestConfigById = async (id: number) => {
  const api = {...TEST_CONFIG_API.getTestConfigById};
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
    params: {id: id}
  });
}

/**
 * 删除项目
 * @param id
 */
export const deleteTestConfig = async (id: number) => {
  const api = {...TEST_CONFIG_API.deleteTestConfig};
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
  });
}

// //router.post('/downTestConfig', TestConfigController.downTestConfig);
export const downTestConfig = async (iConfigId: number) => {
  const api = TEST_CONFIG_API.downTestConfig;
  return request({
    api: api,
    params: {id: iConfigId}
  });
}


// // router.get('/getCurrentTestConfig', TestConfigController.getCurrentTestConfig);
export const getCurrentTestConfig = async () => {
  const api = TEST_CONFIG_API.getCurrentTestConfig;
  return request({
    api: api
  });
}

// // // 停止当前测试配置
// // router.get('/stopCurrentTestConfig', TestConfigController.stopCurrentTest);
export const stopCurrentTestConfig = async () => {
  const api = TEST_CONFIG_API.stopCurrentTestConfig;
  return request({
    api: api
  });
}

export const updateTestConfigById = async (id: number, iConfig: ITestConfig) => {
  const api = {...TEST_CONFIG_API.updateTestConfigById};
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
    params: iConfig
  });
}


export const downHistoryDataAsJson = async () => {
  const api = TEST_CONFIG_API.downHistoryDataAsJson;
  return request({
    api: api
  });
}

//router.get('/startTcpConnect', TestConfigController.startTcpConnect);
// router.get('/stopTcpConnect', TestConfigController.stopTcpConnect);
export const startTcpConnect = async () => {
  const api = TEST_CONFIG_API.startTcpConnect;
  return request({
    api: api
  });
}

export const stopTcpConnect = async () => {
  const api = TEST_CONFIG_API.stopTcpConnect;
  return request({
    api: api
  });
}

export const getTcpConnectStatus = async () => {
  const api = TEST_CONFIG_API.getTcpConnectStatus;
  return request({
    api: api
  });
}

//router.get('/getBoardStatus', TestConfigController.getBoardStatus);
export const getBoardStatus = async () => {
  const api = TEST_CONFIG_API.getBoardStatus;
  return request({
    api: api
  });
}
