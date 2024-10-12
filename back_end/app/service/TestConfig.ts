/**
 * create by lby
 */

import TestConfig, {CurrentTestConfig, ITestConfig} from "../model/TestConfig";
import {getBusCategory, getCollectItemFromId, getCollectType, getConfigBoardMessage} from "../../utils/BoardUtil/encoding";
import {connectWithMultipleBoards, disconnectWithBoard, sendMultipleMessagesBoard} from "../ztcp/toBoard";
import {IReceiveData} from "../../utils/BoardUtil/decoding";
import HistoryService from "./HistoryService";
import * as fs from "fs";
import * as XLSX from "xlsx";
import {transferFileSize} from "../../utils/File";
import path from "node:path";
import {ProtocolType} from "../model/PreSet/Protocol.model";
import {getSignalMapKey} from "../../utils/BoardUtil/encoding/spConfig";
import {startMockBoardMessage, stopMockBoardMessage} from "../ztcp/toFront";


const historyService = new HistoryService()

class TestConfigService {

  currentTestConfig: ITestConfig | null = null
  currentTestConfigReceiveData: IReceiveData[] = []
  currentTestConfigHistoryData: {
    time: number
    data: {
      [key: number]: number
    }
  }[] = []

  resultMessages: Buffer[] = []
  signalsMappingRelation: Map<string, string[]> = new Map()
  signalsIdNameMap: Map<string, string[]> = new Map()
  banMessage: Buffer[] = []

  // 因为digital解析方式比较特殊，所以需要单独处理
  digitalKeyList: string[] = []

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
      return testConfig?.dataValues!
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

  // 获取信号id信号名的映射表
  async setTestConfigSignalMapping(testConfig: ITestConfig) {
    testConfig.configs.forEach(config => {
      config.vehicle.protocols.forEach(protocol => {
        protocol.protocol.signalsParsingConfig.forEach(spConfig => {

          const targetId = protocol.collector.collectorAddress!
          const collectType = getCollectType(protocol)
          const collectCategory = getBusCategory(protocol)


          const key = getSignalMapKey(targetId, collectType, collectCategory, Number(spConfig.frameId))
          spConfig.signals.forEach(signal => {
            if (this.signalsIdNameMap.has(key)) {
              this.signalsIdNameMap.get(key)!.push(signal.name)
            } else {
              this.signalsIdNameMap.set(key, [signal.name])
            }
          })
        })
      })
    })
  }

  async getHostPortList(testConfig: ITestConfig) {
    const result: Array<{ host: string, port: number }> = []

    testConfig.configs.forEach(config => {
      config.vehicle.protocols.forEach(protocol => {
        result.push({
          host: protocol.core.controllerAddress!,
          port: 66
        })
      })
    })
    return result
  }

  async getSpecialDigitalKeyList(testConfig: ITestConfig) {
    const result: string[] = []

    testConfig.configs.forEach(config => {
      config.vehicle.protocols.forEach(protocol => {
        protocol.protocol.signalsParsingConfig.forEach(spConfig => {
          spConfig.signals.forEach(signal => {
            const key = getSignalMapKey(protocol.collector.collectorAddress!, getCollectType(protocol), getBusCategory(protocol), Number(spConfig.frameId))
            if (protocol.protocol.protocolType === ProtocolType.Digital) {
              result.push(key)
            }
          })
        })
      })
    })
    this.digitalKeyList = result
  }

  /**
   * 下发测试流程，设置当前的测试流程为testPrdcessN
   */
  async downTestConfig(testConfigId: number) {
    if (this.currentTestConfig) return false
    const testConfig = await this.getTestConfigById(testConfigId);
    console.log("下发的消息", testConfig)
    console.log("對應車輛",JSON.stringify(testConfig?.configs[0].vehicle))
    if (!testConfig) return false

    const res = getConfigBoardMessage(testConfig!)
    const hostPortList = await this.getHostPortList(testConfig)

    // TODO 连接下位机并且发送消息,调试的时候没有下位机所以注释掉，使用startMock
    // try {
    //   await connectWithMultipleBoards(hostPortList, 0)
    // } catch (e) {
    //   return false
    // }
    //
    // // 发送所有消息给板子
    // try {
    //   await sendMultipleMessagesBoard(res.resultMessages, 1000)
    // } catch (e) {
    //   return false
    // }

    // 解析下发的配置，获取需要下发的信息、信号的映射
    this.resultMessages = res.resultMessages
    this.signalsMappingRelation = res.signalsMap
    this.banMessage = res.banMessages
    this.currentTestConfig = testConfig
    await this.storeCurrentConfigToSql(testConfig!)
    await this.setTestConfigSignalMapping(testConfig!)
    await this.getSpecialDigitalKeyList(testConfig!)

    startMockBoardMessage(this.signalsMappingRelation)
    return true
  }

  /**
   * 停止当前下发
   */
  async stopCurrentTestConfig() {
    stopMockBoardMessage()
    // await sendMultipleMessagesBoard(this.banMessage, 200)
    await this.clearCurrent()
    return true
  }

  pushReceiveData(data: IReceiveData[]) {
    this.currentTestConfigReceiveData.push(...data)
  }

  async clearCurrent() {
    this.currentTestConfig = null
    this.signalsMappingRelation.clear()
    this.currentTestConfigReceiveData = []
    this.resultMessages = []
    this.banMessage = []
    disconnectWithBoard()
    await this.deleteCurrentConfigFromSql()
    this.signalsIdNameMap.clear()
    this.digitalKeyList = []
  }

  async storeCurrentConfigToSql(config: ITestConfig) {
    await this.deleteCurrentConfigFromSql()
    console.log(config)
    await CurrentTestConfig.create(config)
  }

  async getCurrentConfigFromSql() {
    // 使用findOne方法获取第一条记录
    const config = await CurrentTestConfig.findOne({
      order: [
        ['id', 'ASC'] // 按照id升序排序
      ]
    });
    return config;
  }

  async deleteCurrentConfigFromSql() {
    try {
      await CurrentTestConfig.destroy({
        where: {}, // 不传入任何条件，将删除所有记录
        truncate: true // 这将重置自增ID
      });
      console.log('Table CurrentTestConfig has been cleared.');
    } catch (error) {
      console.error('Failed to clear the table CurrentTestConfig:', error);
    }
  }

  // 尝试恢复之前下发配置
  async tryRecoverConfig() {
    const config = await this.getCurrentConfigFromSql()
    if (config) {
      console.log("之前的数据为", config)
      await this.downTestConfig(config.id)
    }
  }

  async downHistoryDataAsJson() {
    const currentTestConfigId = this.currentTestConfig?.id!
    //获取当前测试配置的历史数据
    const testConfig = await this.getTestConfigById(currentTestConfigId)

    const historyName = (testConfig?.name ?? "默认名称") + new Date().getHours() + new Date().getMinutes()

    const history = {
      // 月、日、时、分
      historyName: historyName,
      configName: this.currentTestConfig?.name ?? "默认名称",
      startTime: this.currentTestConfigHistoryData[0].time,
      endTime: this.currentTestConfigHistoryData[this.currentTestConfigHistoryData.length - 1].time,
      template: testConfig?.template,
      historyData: this.currentTestConfigHistoryData
    }

    let dir = '../public/uploads/' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    dir = path.resolve(__dirname, dir)

    // 年-月-日
    const targetPath = dir + '/' + historyName + '.json'
    // 确保文件夹存在
    try {
      fs.mkdirSync(dir, {recursive: true});

      // 创建一个文件
      fs.writeFileSync(targetPath, JSON.stringify(history, null, 2));

      const fileSize = fs.statSync(targetPath)

      await historyService.addHistory({
        fatherConfigName: this.currentTestConfig?.name ?? "默认名称",
        size: transferFileSize(fileSize.size),
        path: targetPath
      })

      // await this.downReceiveDataToXlsx(this.currentTestConfig?.name ?? "默认名称")

    } catch (error) {
      console.error('Failed to write file:', error);
      return false
    }
    return true
  }

  async downReceiveDataToXlsx(configName: string) {
    const data: {
      timeStamp: number,
      collectType: ProtocolType,
      frameId: number,
      signalName: string,
      value: number
    }[] = []
    // TODO 因为没有收到真实的消息，所以这里是错误的
    this.currentTestConfigReceiveData.forEach(item => {
      item.signals.forEach((signal, index) => {
        const key = getSignalMapKey(item.moduleId, item.collectType, item.busType, item.frameId)
        data.push({
          timeStamp: item.timestamp,
          collectType: getCollectItemFromId(signal.signalId)!,
          frameId: item.frameId,
          signalName: this.signalsIdNameMap.get(key)![index],
          value: signal.value,
        })
      })
    })


    const name = configName + new Date().getHours() + new Date().getMinutes()
    let dir = '../public/uploads/' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    dir = path.resolve(__dirname, dir)
    const targetPath = dir + '/' + name + '_' + 'output' + '.xlsx'

    // 创建一个新的工作簿
    const wb = XLSX.utils.book_new();

    // 将数据转换为工作表
    const ws = XLSX.utils.json_to_sheet(data);

    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // 将工作簿写入文件
    fs.mkdirSync(dir, {recursive: true});

    XLSX.writeFile(wb, targetPath);

    const fileSize = fs.statSync(targetPath)
    await historyService.addHistory({
      fatherConfigName: this.currentTestConfig?.name ?? "默认名称",
      size: transferFileSize(fileSize.size),
      path: targetPath
    })
    return true
  }
}

export default new TestConfigService()




