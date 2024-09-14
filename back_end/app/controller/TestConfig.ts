import TestObjectNService from "../service/TestObjectNService";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import {IResBody} from "../types";
import {Context} from "koa";
import {ITestObjectNModel} from "../model/2TestObjectN.model";
import TestConfigService from "../service/TestConfig";
import {ITestConfig} from "../model/TestConfig";



class TestConfigController {

    /**
     * 创建测试配置
     * @param ctx
     * @returns
     */
    async createTestConfig(ctx: Context) {
        const param = ctx.request.body as ITestConfig;
        const res = await TestConfigService.createTestConfig(param);
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
        const res = await TestConfigService.deleteTestConfigById(Number(id));
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
        const res = await TestConfigService.getTestConfigById(Number(id));
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
        const res = await TestConfigService.getAllTestConfig();
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

    // /**
    //    * 下发测试流程，设置当前的测试流程为testPrdcessN
    //    */
    //   async downTestConfig(testConfig: ITestConfig) {
    //     this.currentTestConfig = testConfig
    //     return true
    //   }
    //
    //   /**
    //    * 停止当前下发
    //    */
    //   async stopCurrentTestProcessN() {
    //     this.currentTestConfig = null
    //     return true
    //   }
    //
    //
    //   async getCurrentTestConfig() {
    //     return this.currentTestConfig
    //   }

    // 下发测试配置
    async downTestConfig(ctx: Context) {
        // @ts-ignore
      const {id} = ctx.request.body;
        const res = await TestConfigService.downTestConfig(Number(id));
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

    // 停止当前下发
    async stopCurrentTestConfig(ctx: Context) {
        const res = await TestConfigService.stopCurrentTestConfig();
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

    // 获取当前下发的测试配置
    async getCurrentTestConfig(ctx: Context) {
        const res = await TestConfigService.getCurrentTestConfig();
       ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
    }
}

export default new TestConfigController()
