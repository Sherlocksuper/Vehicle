import {Context} from "koa";
import TestProcessNService from "../service/TestProcessNService";
import TestProcessN, {ITestProcessNModel} from "../model/1TestProcessN";
import {IResBody} from "../types";
import {
    FAIL_CODE,
    SEARCH_FAIL_MSG,
    SEARCH_SUCCESS_MSG,
    SUCCESS_CODE,
    WRITE_FAIL_MSG,
    WRITE_SUCCESS_MSG
} from "../constants";
import testProcessNService from "../service/TestProcessNService";
import {ifError} from "assert";

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

    /**
     * 下发测试流程
     */
    async downTestProcessN(ctx: Context) {
        const processN = ctx.request.body as ITestProcessNModel
        const res = await TestProcessNService.downTestProcessN(processN)


        if (res === true) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: res
            }
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: SEARCH_FAIL_MSG,
                data: res
            }
        }
    }

    /**
     * 获取当前测试流程
     */
    async getCurrentTestProcessN(ctx: Context) {
        const currentProcessN = testProcessNService.currentTestProcessN
        if (currentProcessN) {
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: currentProcessN
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
     * 停止测试流程
     */
    async stopCurrentTestProcessN(ctx: Context) {
        const res = await testProcessNService.stopCurrentTestProcessN();
        if (res === undefined){
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: WRITE_SUCCESS_MSG,
                data: "success"
            }
        } else {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: WRITE_FAIL_MSG,
                data: res
            }
        }
    }
}

export default new TestProcessNController()
