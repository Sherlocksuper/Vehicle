import path from "node:path";
import {excelReader} from "../../../utils/excelReader";
import {COLLECTOR_WORKSHEET, DEVICE_CONFIG_FILE_NAME} from "../../constants";
import Collector, {ICollectorModel} from "../../model/BoardManage/Collector.model";
import {sequelize} from "../../db";

class CollectorService {
    async initCollectors(config?: { userId: number, data: ICollectorModel[] }): Promise<boolean> {
        try {
            const transaction = await sequelize.transaction()
            let data = null
            if (!config)
                data = (await excelReader({
                    path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                    workSheetName: COLLECTOR_WORKSHEET,
                    keys: ['collectorName', 'collectorAddress']
                })) as ICollectorModel[]
            else {
                const {userId, data: srcData} = config!
                // 删除所有userId对应的配置
                Collector.destroy({
                    where: {userId}
                })
                data = srcData
            }
            console.log(data)
            data = data.map(i => ({...i, userId: config?.userId}))
            await Collector.bulkCreate(data)
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    async getActiveCollectors(userId?: number) {
        const data = await Collector.findAll({
            where: userId ? {userId: userId, isDisabled: false} : {userId: null, isDisabled: false}
        })
        return data
    }

    async getAllCollectors(userId?: number) {
        const data = await Collector.findAll({
            where: userId ? {userId} : {userId: null}
        })
        return data
    }

    async createCollector(data: ICollectorModel) {
        return await Collector.create(data)
    }

    async updateCollector(data: ICollectorModel) {
        return await Collector.update(data, {
            where: {id: data.id}
        })
    }

    async deleteCollector(id: number) {
        return await Collector.destroy({
            where: {id}
        })
    }
}

export default new CollectorService
