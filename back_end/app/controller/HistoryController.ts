import HistoryService from "../service/HistoryService";
import {Context} from "koa";
import {IResBody} from "../types";
import {
    FAIL_CODE,
    SEARCH_SUCCESS_MSG,
    SUCCESS_CODE,
    WRITE_FAIL_MSG,
    WRITE_SUCCESS_MSG
} from "../constants";
import FileService from "../service/FileService";
import {IRecordHistory} from "../model/History.model";
import {transferFileSize} from "../../utils/File";

const historyService = new HistoryService()
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
        // @ts-ignore
        const fatherConfigName = context.request.body['fatherConfigName']
        const file = context.request.files!.file as any
        const filePath = file['filepath']
        const fileName = file['originalFilename']


        const storePath = await fileService.storeFile(filePath, fileName)
        if (storePath.length === 0) {
            ((context.body as IResBody) = {
                code: FAIL_CODE,
                msg: WRITE_FAIL_MSG,
                data: null
            })
            return
        }

        const record: IRecordHistory = {
            fatherConfigName: fatherConfigName,
            size: transferFileSize(file.size),
            path: storePath,
        }

        const res = await historyService.addHistory(record)

        res && ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: storePath
        })
        !res && ((context.body as IResBody) = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }

    async deleteHistory(context: Context) {
        const recordId = context.params.id as number
        const res = await historyService.deleteHistory(recordId)
        res && ((context.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: res
        })
        !res && ((context.body as IResBody) = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }
}

export default new HistoryController()
