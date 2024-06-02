import TestObjectNService from "../service/TestObjectNService";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import {IResBody} from "../types";
import {Context} from "koa";
import {ITestObjectNModel} from "../model/2TestObjectN.model";


const testObjectNService = new TestObjectNService();

class TestObjectNController {

    /**
     * 创建测试对象
     * @param ctx
     * @returns
     */
    async createTestObjectN(ctx: Context) {
        const param = ctx.request.body as ITestObjectNModel;
        const res = await testObjectNService.createTestObjectN(param);
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
     * 通过id删除测试对象
     */
    async deleteTestObjectNById(ctx: Context) {
        const {id} = ctx.params;
        const res = await testObjectNService.deleteTestObjectNById(Number(id));
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
     * 通过id更新测试对象
     */
    async updateTestObjectNById(ctx: Context) {
        const {id} = ctx.params;
        const param = ctx.request.body as ITestObjectNModel;
        const res = await testObjectNService.updateTestObjectNById(Number(id), param);
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
     * 通过id查询测试对象
     */
    async getTestObjectNById(ctx: Context) {
        const {id} = ctx.params;
        const res = await testObjectNService.getTestObjectNById(Number(id));
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
    async getAllTestObjectN(ctx: Context) {
        const res = await testObjectNService.getAllTestObjectN();
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

export default new TestObjectNController()