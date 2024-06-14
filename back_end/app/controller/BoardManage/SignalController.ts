import {ISignalModel} from "../../model/BoardManage/Signal.model";
import {Context} from "koa";
import {FAIL_CODE, QUERY_INCOMPLETENESS, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../../constants";
import SignalService from "../../service/BoardManage/SignalService";
import {IResBody} from "../../types";

class SignalController {
    async createSignal(ct:Context) {
        try {
            const signal = ct.request.body as ISignalModel
            const result = await SignalService.createSignal(signal)
            if (result) {
                (ct.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: '创建信号成功',
                    data: null
                }
            } else {
                throw new Error('创建信号失败')
            }
        } catch (error) {
            (ct.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }

    // 根据采集卡id获取采集信号列表
    async getSignalListByCollectorId(ctx: Context) {
        try {
            const {collectorId} = ctx.request.query
            if (collectorId === undefined)
                throw new Error(QUERY_INCOMPLETENESS)
            const list = await SignalService.getSignalListByCollectorId(Number(collectorId))
            if (!list) throw new Error(SEARCH_FAIL_MSG);
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: list
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

export default new SignalController()