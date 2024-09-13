/**
 * create by lby
 */

import TestConfig, {ITestConfig} from "../model/TestConfig";

export default class TestConfigService {
    /**
     * 创建测试配置
     * @param param
     */
    async createTestConfig(param: ITestConfig): Promise<ITestConfig | null> {
        try {
            return await TestConfig.create(param)
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 通过id删除测试配置
     * @param id
     */
    async deleteTestConfigById(id: number): Promise<boolean> {
        try {
            await TestConfig.destroy({
                where: {
                    id: id
                }
            })
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    /**
     * 通过id更新测试配置
     * @param id
     * @param param
     */
    async updateTestConfigById(id: number, param: ITestConfig): Promise<boolean> {
        try {
            await TestConfig.update(param, {
                where: {id}
            })
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }

    /**
     * 通过id查询测试配置
     * @param id
     */
    async getTestConfigById(id: number): Promise<TestConfig | null> {
        try {
            const testConfig = await TestConfig.findByPk(id)
            return testConfig
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 查询所有测试配置
     */
    async getAllTestConfig(): Promise<TestConfig[] | null> {
        try {
            const testConfig = await TestConfig.findAll()
            return testConfig
        } catch (error) {
            console.log(error);
            return null
        }
    }
}



