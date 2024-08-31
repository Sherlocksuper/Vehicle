import TestProcessN, {ITestProcessNModel} from "../model/1TestProcessN";
import {sendToLong} from "../ztcp/sender";
import {ILongMessageType, LongMessage} from "../ztcp/type";

class TestProcessNService {
    /**
     * testProcessN,存到内存里
     * 保存当前正在测试的流程
     */
    currentTestProcessN: ITestProcessNModel | null = null


    /**
     * 创建一个新的TestProcess
     * @param userId
     * @param data
     */
    async createTestProcessN(userId: number, data: ITestProcessNModel): Promise<TestProcessN | null> {
        try {
            const testProcess = await TestProcessN.create({...data, userId})
            return testProcess
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 读取一个TestProcess
     * @param id
     */
    async readTestProcessN(id: number): Promise<TestProcessN | null> {
        try {
            const testProcess = await TestProcessN.findByPk(id)
            return testProcess
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 更新一个TestProcess
     * @param id
     * @param data
     */
    async updateTestProcessN(id: number, data: ITestProcessNModel): Promise<TestProcessN | null> {
        try {
            const testProcess = await TestProcessN.findByPk(id)
            if (testProcess) {
                await testProcess.update(data)
                return testProcess
            }
            return null
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 删除一个TestProcess
     * @param id
     */
    async deleteTestProcessN(id: number): Promise<boolean> {
        try {
            const testProcess = await TestProcessN.findByPk(id)
            if (testProcess) {
                await testProcess.destroy()
                return true
            }
            return false
        } catch (error) {
            console.log(error);
            return false
        }
    }

    /**
     * 获取用户的所有TestProcess
     * @param userId
     */
    async getTestProcessNList(userId?: number): Promise<TestProcessN[] | null> {
        try {
            if (!userId) return await TestProcessN.findAll(
                {include: [{all: true}]}
            )
            const testProcessList = await TestProcessN.findAll({where: {userId}})
            return testProcessList
        } catch (error) {
            console.log(error);
            return null
        }
    }

    /**
     * 下发测试流程，设置当前的测试流程为testPrdcessN
     */
    async downTestProcessN(testProcessN: ITestProcessNModel) {
        if (this.currentTestProcessN) return false
        this.currentTestProcessN = testProcessN
        const message: ILongMessageType = {
            type: LongMessage.STARTCOLLECT,
            body: testProcessN
        }
        sendToLong(message)
        return true
    }

    /**
     * 停止当前下发
     */
    async stopCurrentTestProcessN() {
        this.currentTestProcessN = null
        return "success"
    }
}

export default new TestProcessNService()
