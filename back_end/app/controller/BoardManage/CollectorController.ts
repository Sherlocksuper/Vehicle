import {Context} from "koa";
import {ICollectorModel} from "../../model/BoardManage/Collector.model";
import CollectorService from "../../service/BoardManage/CollectorService";
import {IResBody} from "../../types";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../../constants";
import {getUserIdFromCtx} from "../../../utils/getUserInfoFromCtx";

class CollectorController {


    //创建采集板卡
    async createCollector(ctx: Context) {
        try {
            const collector = ctx.request.body as ICollectorModel
            const result = await CollectorService.createCollector(collector)
            if (result) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: '创建采集板卡成功',
                    data: result
                }
            } else {
                throw new Error('创建采集板卡失败')
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }

    // 获取采集卡列表
    async getActiveCollectorList(ctx: Context) {
        try {
            let list = undefined
            list = await CollectorService.getActiveCollectors(getUserIdFromCtx(ctx))
            if (!list.length) {
                list = await CollectorService.getActiveCollectors()
            }
            if (list !== undefined) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: SEARCH_SUCCESS_MSG,
                    data: list
                }
            } else {
                throw new Error(SEARCH_FAIL_MSG)
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }

    // 获取所有采集卡列表
    async getAllCollectorList(ctx: Context) {
        try {
            let list = undefined
            list = await CollectorService.getAllCollectors(getUserIdFromCtx(ctx))
            if (!list.length) {
                list = await CollectorService.getAllCollectors()
            }
            if (list !== undefined) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: SEARCH_SUCCESS_MSG,
                    data: list
                }
            } else {
                throw new Error(SEARCH_FAIL_MSG)
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }

    // 更新采集卡
    async updateCollector(ctx: Context) {
        try {
            const collector = ctx.request.body as ICollectorModel
            const result = await CollectorService.updateCollector(collector)
            if (result) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: '更新采集板卡成功',
                    data: result
                }
            } else {
                throw new Error('更新采集板卡失败')
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }

    async deleteCollector(ctx: Context) {
        try {
            const id = ctx.request.body.id
            const result = await CollectorService.deleteCollector(id)
            if (result) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: '删除采集板卡成功',
                    data: null
                }
            } else {
                throw new Error('删除采集板卡失败')
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }
}

export default new CollectorController()
