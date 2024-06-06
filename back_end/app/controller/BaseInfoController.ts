import {Context} from "koa";
import ControllerService from "../service/ControllerService";
import {IResBody} from "../types";
import {FAIL_CODE, QUERY_INCOMPLETENESS, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import CollectorService from "../service/CollectorService";
import SignalService from "../service/SignalService";
import {getUserIdFromCtx} from "../../utils/getUserInfoFromCtx";
import {IControllerModel} from "../model/Controller.model";
import {ICollectorModel} from "../model/Collector.model";

class BaseInfoController {

    //创建核心板卡
    async createController(ctx: Context) {
        try {
            const controller = ctx.request.body as IControllerModel
            const result = await ControllerService.createController(controller)
            if (result) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: '创建核心板卡成功',
                    data: null
                }
            } else {
                throw new Error('创建核心板卡失败')
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null
            }
        }
    }

    // 获取核心卡列表
    async getActiveControllerList(ctx: Context) {
        try {
            let list = undefined
            list = await ControllerService.getActiveControllers(getUserIdFromCtx(ctx))
            if (!list.length) {
                list = await ControllerService.getActiveControllers()
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

    // 获取所有核心卡列表
    async getAllControllerList(ctx: Context) {
        try {
            let list = undefined
            list = await ControllerService.getAllControllers(getUserIdFromCtx(ctx))
            if (!list.length) {
                list = await ControllerService.getAllControllers()
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

    // 获取测试设备信息
    async getTestDevicesInfo(ctx: Context) {
        try {
            const userId = getUserIdFromCtx(ctx)
            const controllersConfig = await ControllerService.getAllControllers(userId)
            const collectorsConfig = await CollectorService.getAllCollectors(userId)
            const signalsConfig = await SignalService.getsignalsConfig(userId);
            (ctx.body as IResBody) = {
                code: SUCCESS_CODE,
                msg: SEARCH_SUCCESS_MSG,
                data: {
                    controllersConfig: controllersConfig.length === 0 ? await ControllerService.getAllControllers() : controllersConfig,
                    collectorsConfig: collectorsConfig.length === 0 ? await CollectorService.getAllCollectors() : collectorsConfig,
                    signalsConfig: signalsConfig.length === 0 ? await SignalService.getsignalsConfig() : signalsConfig
                }
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

export default new BaseInfoController