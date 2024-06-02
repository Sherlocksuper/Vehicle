/**
 * create by lby
 */

import TestObjectN, {ITestObjectNModel} from "../model/2TestObjectN.model";

export default class TestObjectNService {
    /**
     * 创建测试对象
     * @param param
     */
    async createTestObjectN(param: ITestObjectNModel): Promise<TestObjectN | null> {
        try {
            const testObjectN = await TestObjectN.create(param)
            return testObjectN
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 通过id删除测试对象
     * @param id
     */
    async deleteTestObjectNById(id: number): Promise<boolean> {
        try {
            await TestObjectN.destroy({
                where: {id}
            })
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    /**
     * 通过id更新测试对象
     * @param id
     * @param param
     */
    async updateTestObjectNById(id: number, param: ITestObjectNModel): Promise<boolean> {
        try {
            await TestObjectN.update(param, {
                where: {id}
            })
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    /**
     * 通过id查询测试对象
     * @param id
     */
    async getTestObjectNById(id: number): Promise<TestObjectN | null> {
        try {
            const testObjectN = await TestObjectN.findByPk(id)
            return testObjectN
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 查询所有测试对象
     */
    async getAllTestObjectN(): Promise<TestObjectN[] | null> {
        try {
            const testObjectN = await TestObjectN.findAll()
            return testObjectN
        } catch (error) {
            console.log(error);
            return null
        }
    }
}
