/**
 * 获取项目列表
 */
import {request} from "@/utils/request.ts";
import {TEST_CONFIG_API} from "@/apis/url/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";

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
        params: {id: id}
    });
}
