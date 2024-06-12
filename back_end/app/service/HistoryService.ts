import {Context} from "koa";
import HistoryModel, {IRecordHistory} from "../model/History.model";


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
        const res = await HistoryModel.destroy({
            where: {
                id: recordId
            }
        })
        return res
    }
}
