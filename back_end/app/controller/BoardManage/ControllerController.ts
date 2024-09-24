import {Context} from "koa";
import {IControllerModel} from "../../model/BoardManage/Controller.model";
import ControllerService from "../../service/BoardManage/ControllerService";
import {IResBody} from "../../types";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../../constants";
import {getUserIdFromCtx} from "../../../utils/getUserInfoFromCtx";

class ControllerController {

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

    async updateController(ctx: Context) {
        try {
            const controller = ctx.request.body as IControllerModel
            console.log(controller)
            const result = await ControllerService.updateController(controller)
            if (result) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: '更新核心板卡成功',
                    data: null
                }
            } else {
                throw new Error('更新核心板卡失败')
            }
        } catch (error) {
            (ctx.body as IResBody) = {
                code: FAIL_CODE,
                msg: (error as Error).toString(),
                data: null

            }
        }
    }

    async deleteController(ctx: Context) {
        try {
            const controller = ctx.request.body as IControllerModel
            const result = await ControllerService.deleteController(controller.id!)
            if (result) {
                (ctx.body as IResBody) = {
                    code: SUCCESS_CODE,
                    msg: '删除核心板卡成功',
                    data: null
                }
            } else {
                throw new Error('删除核心板卡失败')
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

export default new ControllerController
