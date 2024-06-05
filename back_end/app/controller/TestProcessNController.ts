import {Context} from "koa";
import TestProcessNService from "../service/TestProcessNService";
import {ITestProcessNModel} from "../model/1TestProcessN";
import {IResBody} from "../types";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE, WRITE_SUCCESS_MSG} from "../constants";

class TestProcessNController {
    /**
     * 新建测试流程
     */
    async createTestProcessN(ctx: Context) {
        const data = ctx.request.body as ITestProcessNModel
        const res = await TestProcessNService.createTestProcessN(data.userId, data)

        if (res) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: res
            }
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: null
            }
        }
    }

    /**
     * 获取所有测试流程列表
     */
    async getAllTestProcessNs(ctx: Context) {
        const res = await TestProcessNService.getTestProcessNList()

        if (res) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: res
            }
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: SEARCH_FAIL_MSG,
                data: null
            }
        }
    }

    /**
     * 获取一个测试流程
     */
    async getTestProcessN(ctx: Context) {
        const {id} = ctx.params
        const res = await TestProcessNService.readTestProcessN(Number(id))

        if (res) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: res
            }
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: SEARCH_FAIL_MSG,
                data: null
            }
        }
    }

    /**
     * 更新一个测试流程
     */
    async updateTestProcessN(ctx: Context) {
        const {id} = ctx.params
        const data = ctx.request.body as ITestProcessNModel
        const res = await TestProcessNService.updateTestProcessN(Number(id), data)

        if (res) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: res
            }
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: SEARCH_FAIL_MSG,
                data: null
            }
        }
    }

    /**
     * 删除一个测试流程
     */
    async deleteTestProcessN(ctx: Context) {
        const {id} = ctx.params
        const res = await TestProcessNService.deleteTestProcessN(Number(id))

        if (res) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: null
            }
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: SEARCH_FAIL_MSG,
                data: null
            }
        }
    }
}

export default new TestProcessNController()