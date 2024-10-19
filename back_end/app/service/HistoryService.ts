import HistoryModel, {IRecordHistory} from "../model/History.model";
import * as fs from "fs";
import path from "node:path";


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

        const absolutePath = path.join(__dirname, '..', 'public', deleteFile!.path)
        const exist = fs.existsSync(absolutePath)
        if (exist){
            fs.unlinkSync(absolutePath)
        }

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
