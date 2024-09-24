import path from "node:path";
import { excelReader } from "../../../utils/excelReader";
import { CONTROLLER_WORKSHEET, DEVICE_CONFIG_FILE_NAME } from "../../constants";
import Controller, { IControllerModel } from "../../model/BoardManage/Controller.model";
import { sequelize } from "../../db";

class ControllerService {
    async initControllers(config?: { userId: number, data: IControllerModel[] }): Promise<boolean> {
        try {
            const transaction = await sequelize.transaction()
            let data = null
            if (!config)
                data = (await excelReader({
                    path: path.join(__dirname, `../../assets/${DEVICE_CONFIG_FILE_NAME}`),
                    workSheetName: CONTROLLER_WORKSHEET,
                    keys: ['controllerName', 'controllerAddress']
                })) as IControllerModel[]
            else {

                const { userId, data: srcData } = config
                // 删除所有用户id所对应的测试流程
                // 删除所有userId对应的配置
                await Controller.destroy({
                    where: { userId }
                })
                data = srcData
            }
            data = data.map(i => ({ ...i, userId: config?.userId }))
            Controller.bulkCreate(data)
            await transaction.commit()
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async getActiveControllers(userId?: number) {
        const data = await Controller.findAll({
            where: userId ? { userId, isDisabled: false } : { userId: null, isDisabled: false }
        })
        return data
    }

    async getAllControllers(userId?: number) {
        const data = await Controller.findAll({
            where: userId ? { userId } : { userId: null }
        })
        return data
    }

    async createController(data: IControllerModel) {
        return await Controller.create(data)
    }

    async updateController(data: IControllerModel) {
        return await Controller.update(data, {
            where: { id: data.id }
        })
    }

    async deleteController(id: number) {
        return await Controller.destroy({
            where: { id }
        })
    }
}
export default new ControllerService
