import TestObjectNService from "../service/TestObjectNService";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import {IResBody} from "../types";
import {Context} from "koa";
import {ITestObjectNModel} from "../model/2TestObjectN.model";
import TestConfigService from "../service/TestConfig";
import {ITestConfig} from "../model/TestConfig";


const testConfigService = new TestConfigService();

class TestConfigController {

    /**
     * 创建测试配置
     * @param ctx
     * @returns
     */
    async createTestConfig(ctx: Context) {
        const param = ctx.request.body as ITestConfig;
        const res = await testConfigService.createTestConfig(param);
        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: FAIL_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    /**
     * 通过id删除测试配置
     */
    async deleteTestConfigById(ctx: Context) {
        const {id} = ctx.params;
        const res = await testConfigService.deleteTestConfigById(Number(id));
        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: null
        })
        !res && ((ctx.body as IResBody) = {
            code: FAIL_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    /**
     * 通过id查询测试对象
     */
    async getTestConfigById(ctx: Context) {
        const {id} = ctx.params;
        const res = await testConfigService.getTestConfigById(Number(id));
        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: FAIL_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    /**
     * 查询所有测试对象
     */
    async getAllTestConfig(ctx: Context) {
        const res = await testConfigService.getAllTestConfig();
        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: FAIL_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }
}

export default new TestConfigController()
