import {Context} from "koa";
import ControllerService from "../service/BoardManage/ControllerService";
import {IResBody} from "../types";
import {FAIL_CODE, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import CollectorService from "../service/BoardManage/CollectorService";
import SignalService from "../service/BoardManage/SignalService";
import {getUserIdFromCtx} from "../../utils/getUserInfoFromCtx";
import Controller from "./BoardManage/ControllerController";
import Collector from "./BoardManage/CollectorController";
import SignalController from "./BoardManage/SignalController";


class BaseInfoController {
    /**
     * 核心卡创建、获取
     * 获取包括所有核心卡和可用核心卡
     */
    createController = Controller.createController
    getActiveControllerList = Controller.getActiveControllerList
    getAllControllerList = Controller.getAllControllerList
    updateController = Controller.updateController
    deleteController = Controller.deleteController

    /**
     * 采集卡创建、获取
     * 获取包括所有采集卡和可用采集卡
     * @param ctx
     */
    createCollector = Collector.createCollector
    getActiveCollectorList = Collector.getActiveCollectorList
    getAllCollectorList = Collector.getAllCollectorList
    updateCollector = Collector.updateCollector
    deleteCollector = Collector.deleteCollector


    /**
     * 信号创建、获取
     */
    createSignal = SignalController.createSignal
    getSignalListByCollectorId = SignalController.getSignalListByCollectorId


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
