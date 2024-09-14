import {Context} from "koa";
import TestTemplateService from "../../service/PreSet/TestTemplateService";
import {ITemplate} from "../../model/PreSet/TestTemplate.model";
import {FAIL_CODE, SUCCESS_CODE, WRITE_FAIL_MSG, WRITE_SUCCESS_MSG} from "../../constants";

class TestTemplateController {

    /**
     * @api {post} /createTestTemplate 创建TestTemplate
     * @apiName CreateTestTemplate
     * @apiParam {ITestTemplate} testTemplateData TestTemplate的数据
     */
    async createTestTemplate(ctx: Context) {
        const testTemplateData = ctx.request.body as ITemplate
        const res = await TestTemplateService.create(testTemplateData)

        res && (ctx.body = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: res
        })

        !res && (ctx.body = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }

    /**
     * @api {post} /createTestTemplate 创建TestTemplate
     * @apiName CreateTestTemplate
     * @apiParam {ITestTemplate} testTemplateData TestTemplate的数据
     */
    async getTestTemplateById(ctx: Context) {
        const {id} = ctx.params
        const res = await TestTemplateService.read(id)

        res && (ctx.body = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: res
        })

        !res && (ctx.body = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }


    /**
     * @api {put} /updateTestTemplate/:id 更新TestTemplate
     * @apiName UpdateTestTemplate
     * @apiParam {Number} id TestTemplate的id
     * @apiParam {Object} updateData 更新的数据
     */
    async updateTestTemplate(ctx: Context) {
        const {id} = ctx.params
        const updateData = ctx.request.body as ITemplate
        const res = await TestTemplateService.update(id, updateData)

        res && (ctx.body = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: res
        })

        !res && (ctx.body = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }

    /**
     * @api {delete} /deleteTestTemplate/:id 删除TestTemplate
     * @apiName DeleteTestTemplate
     * @apiParam {Number} id TestTemplate的id
     */
    async deleteTestTemplate(ctx: Context) {
        const {id} = ctx.params
        const res = await TestTemplateService.delete(id)

        res && (ctx.body = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: null
        })

        !res && (ctx.body = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }

    /**
     * @api {get} /getTestTemplateList 获取TestTemplate列表
     * @apiName GetTestTemplateList
     */
    async getTestTemplateList(ctx: Context) {
        const res = await TestTemplateService.getTestTemplateList()
        res && (ctx.body = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: res
        })

        !res && (ctx.body = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }
}

export default new TestTemplateController()
