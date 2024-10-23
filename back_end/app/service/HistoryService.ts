import HistoryModel, {IRecordHistory} from "../model/History.model";
import * as fs from "fs";
import dataService from "./DataService";

class HistoryService {
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
        await dataService.deleteDataByBelongId(recordId)
        return res
    }

    async getHistoryById(recordId: number) {
        const res = await HistoryModel.findOne({
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

    async updateHistoryName(recordId: number, configName: string ) {
        const res = await HistoryModel.update({
            fatherConfigName: configName
        }, {
            where: {
                id: recordId
            }
        })
        return res
    }

    async updateHistoryPath(recordId: number, path: string) {
        const res = await HistoryModel.update({
            path: path
        }, {
            where: {
                id: recordId
            },
        })
        return res
    }
}

export default  new HistoryService()
