import {Context} from "koa";
import {IResBody} from "../../types";
import {SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE, WRITE_SUCCESS_MSG} from "../../constants";
import Protocol, {IProtocolModel} from "../../model/PreSet/Protocol.model";
import ProtocolService from "../../service/PreSet/ProtocolService";

class ProtocolController {
    //获取所有Protocol
    async getProtocolList(ctx: Context) {
        const res = await ProtocolService.getProtocolList();
        (ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        }
    }

    //根据Id获取protocol
    async getProtocolById(ctx: Context) {
        const {id} = ctx.params;
        const res = await ProtocolService.getProtocolById(Number(id));

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    //创建protocol
    async createProtocol(ctx: Context) {
        const protocol = ctx.request.body as IProtocolModel;
        const res = await ProtocolService.createProtocol(protocol);

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: null
        })
    }

    //更新protocol
    async updateProtocol(ctx: Context) {
        const {id} = ctx.params;
        const newProtocol = ctx.request.body as IProtocolModel;
        const res = await ProtocolService.updateProtocol(Number(id), newProtocol);


        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    //删除protocol
    async deleteProtocol(ctx: Context) {
        const {id} = ctx.params;
        const res = await ProtocolService.deleteProtocol(Number(id));

        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }
}

export default new ProtocolController()
