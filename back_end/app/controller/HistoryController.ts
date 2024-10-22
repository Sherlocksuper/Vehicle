import {Context} from "koa";
import {IResBody} from "../types";
import {
    FAIL_CODE, SEARCH_FAIL_MSG,
    SEARCH_SUCCESS_MSG,
    SUCCESS_CODE,
    WRITE_FAIL_MSG,
    WRITE_SUCCESS_MSG
} from "../constants";
import FileService from "../service/FileService";
import {IRecordHistory} from "../model/History.model";
import {transferFileSize} from "../../utils/File";
import historyService from "../service/HistoryService";
import testConfigService from "../service/TestConfig";

const fileService = new FileService()

export class HistoryController {
    /**
     * 获取所有历史记录
     * @param context
     */
    async getAllHistory(context: Context) {
        const res = await historyService.getHistory()

        res && ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: null
        })
    }

    /**
     * 格式：fromData
     * file: File
     * fatherConfigName: string
     * 添加历史记录，并保存文件
     * @param context
     */
    async addHistory(context: Context) {
        // // @ts-ignore
        // const fatherConfigName = context.request.body['fatherConfigName']
        // const file = context.request.files!.file as any
        // const filePath = file['filepath']
        // const fileName = file['originalFilename']
        //
        //
        // const storePath = await fileService.storeFile(filePath, fileName)
        // if (storePath.length === 0) {
        //     ((context.body as IResBody) = {
        //         code: FAIL_CODE,
        //         msg: WRITE_FAIL_MSG,
        //         data: null
        //     })
        //     return
        // }
        //
        // const record: IRecordHistory = {
        //     fatherConfigName: fatherConfigName,
        //     vehicleName: fileName,
        //     size: transferFileSize(file.size),
        //     path: storePath,
        // }
        //
        // const res = await historyService.addHistory(record)

        ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: ""
        })
        // !res && ((context.body as IResBody) = {
        //     code: FAIL_CODE,
        //     msg: WRITE_FAIL_MSG,
        //     data: null
        // })
    }

    async getHistoryById(context: Context) {
        const historyId = context.params.id as number
        const res = await historyService.getHistoryById(historyId)
        res && ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((context.body as IResBody) = {
            code: FAIL_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }

    async deleteHistory(context: Context) {
        const recordId = context.params.id as number

        // 如果当前有下发配置
        if (testConfigService.currentTestConfig !== null) {
              ((context.body as IResBody) = {
                code: FAIL_CODE,
                msg: "当前有配置正在下发，不可删除",
                data: null
            })
            return
        }

        const res = await historyService.deleteHistory(recordId)
        res && ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: res
        })
        !res && ((context.body as IResBody) = {
            code: FAIL_CODE,
            msg: "删除失败，请重试",
            data: null
        })
    }

    // 返回给前端对应路径的文件
    async getHistoryFile(context: Context) {
        const recordId = context.params.id as number
        const res = await historyService.getHistoryFile(recordId)
        res && ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: SEARCH_SUCCESS_MSG,
            data: res
        })
        !res && ((context.body as IResBody) = {
            code: FAIL_CODE,
            msg: SEARCH_FAIL_MSG,
            data: null
        })
    }
}

export default new HistoryController()
