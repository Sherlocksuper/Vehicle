import HistoryModel, {IRecordHistory} from "../model/History.model";
import * as fs from "fs";


export default class HistoryService {
    async getHistory() {
        const res = await HistoryModel.findAll()
        return res
    }

    async addHistory(recordHistory: IRecordHistory) {
        const res = await HistoryModel.create(recordHistory)
        return res
    }

    async deleteHistory(recordId: number) {
        const deleteFile = await HistoryModel.findOne({
            where: {
                id: recordId
            }
        })

        // 删除deleteFile.path
        fs.unlinkSync(deleteFile!.path)

        const res = await HistoryModel.destroy({
            where: {
                id: recordId
            }
        })
        return res
    }

    async getHistoryFile(recordId: number) {
        const res = await HistoryModel.findOne({
            where: {
                id: recordId
            }
        })
        const targetFile = fs.readFileSync(res!.path)
        return targetFile
    }
}
