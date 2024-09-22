/**
 * create by lby
 */

import TestConfig, {ITestConfig} from "../model/TestConfig";
import {getConfigBoardMessage} from "../../utils/BoardUtil/encoding";
import {startMockBoardMessage, stopMockBoardMessage} from "../ztcp/toFront";
import {connectWithBoard, disconnectWithBoard, sendMultipleMessagesBoard} from "../ztcp/toBoard";
import {IReceiveData} from "../../utils/BoardUtil/decoding";

class TestConfigService {

  currentTestConfig: ITestConfig | null = null
  currentTestConfigReceiveData: IReceiveData[] = []

  resultMessages: Buffer[] = []
  signalsMappingRelation: Map<string, string[]> = new Map()
  banMessage: Buffer[] = []

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
      if (id === this.currentTestConfig?.id) {
        this.currentTestConfig = param
      }
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
  async getTestConfigById(id: number): Promise<ITestConfig | null> {
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

  async initTestConfig() {
    return null;
  }

  async getCurrentTestConfig() {
    return this.currentTestConfig
  }


  /**
   * 下发测试流程，设置当前的测试流程为testPrdcessN
   */
  async downTestConfig(testConfigId: number) {
    const testConfig = await this.getTestConfigById(testConfigId);
    if (this.currentTestConfig) return false

    // 解析下发的配置，获取需要下发的信息、信号的映射
    const res = getConfigBoardMessage(testConfig!)
    console.log("下发的消息", res)
    this.resultMessages = res.resultMessages
    this.signalsMappingRelation = res.signalsMap
    this.banMessage = res.banMessages
    this.currentTestConfig = testConfig

    // TODO
    // 连接板子
    try {
      await connectWithBoard(66, '192.168.1.66')
    } catch (e) {
      this.clearCurrent()
      return false
    }

    // 发送所有消息给板子
    try {
      await sendMultipleMessagesBoard(res.resultMessages, 1000)
    } catch (e) {
      this.clearCurrent()
      return false
    }

    // 开始模拟板子消息
    // TODO  正常这一步要删掉
    // startMockBoardMessage(res.signalsMap)

    return true
  }

  /**
   * 停止当前下发
   */
  async stopCurrentTestConfig() {
    await sendMultipleMessagesBoard(this.banMessage, 200)

    // TODO,正常要删掉
    // stopMockBoardMessage()
    this.clearCurrent()
    return true
  }

  pushReceiveData(data: IReceiveData) {
    this.currentTestConfigReceiveData.push(data)
  }

  clearCurrent() {
    this.currentTestConfig = null
    this.signalsMappingRelation.clear()
    this.currentTestConfigReceiveData = []
    this.resultMessages = []
    this.banMessage = []
    disconnectWithBoard()
  }

  downReceiveDataToXlsx() {
  }
}

export default new TestConfigService()




