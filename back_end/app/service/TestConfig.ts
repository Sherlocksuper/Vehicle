/**
 * create by lby
 */

import TestConfig, {CurrentTestConfig, ITestConfig} from "../model/TestConfig";
import {getBusCategory, getCollectType, getConfigBoardMessage} from "../../utils/BoardUtil/encoding";
import {connectWithMultipleBoards, disconnectWithBoard, sendMultipleMessagesBoard} from "../ztcp/toBoard";
import * as fs from "fs";
import {transferFileSize} from "../../utils/File";
import path from "node:path";
import {ProtocolType} from "../model/PreSet/Protocol.model";
import {getSignalMapKey} from "../../utils/BoardUtil/encoding/spConfig";
import {startMockBoardMessage, stopMockBoardMessage} from "../ztcp/toFront";
import {IData} from "../model/Data.model";
import DataService from "./DataService";
import historyService from "./HistoryService";

export const CURRENT_DATA_LIMIT = 100

export const CURRENT_HISTORY_SIGN = "(正在下发...)"
// 时间戳的base值 17
// 用basetime，为了缩小时间戳的长度，节省存储控件
export const BASE_TIME = 1_729_597_005_000

class TestConfigService {
  currentTestConfig: ITestConfig | null = null
  currentTestConfigHistoryData: {
    time: number
    data: {
      [key: number]: number
    }
  }[] = []

  resultMessages: Buffer[] = []
  // 由采集项id、帧id等组成的key值和signal的id(之前是uuid现在是序号数组)对应的map
  signalsMappingRelation: Map<string, string[]> = new Map()
  // 信号的id和他的名称对应的数组
  signalsIdNameMap: Map<string, string> = new Map()
  // 当前所属历史的id
  currentHistoryId: number = 0
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

  async getCurrentTestConfig() {
    return this.currentTestConfig
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

    const map = new Map()
    result.forEach(item => {
      if (!map.has(item.host)) {
        map.set(item.host, true)
      }
    })

    return Array.from(map.keys()).map((item) => {
      return {
        host: item,
        port: 66
      }
    })
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

  // 下发测试流程，设置当前的测试流程为testPrdcessN
  async downTestConfig(testConfigId: number) {
    if (this.currentTestConfig) return "当前已经有测试配置在下发中"
    const testConfig = await this.getTestConfigById(testConfigId);
    if (!testConfig) return "获取对应配置失败"

    const res = getConfigBoardMessage(testConfig!)
    const hostPortList = await this.getHostPortList(testConfig)

    // 解析下发的配置，获取需要下发的信息、信号的映射
    this.resultMessages = res.resultMessages
    console.log(this.resultMessages)
    this.signalsMappingRelation = res.signalsMap
    this.banMessage = res.banMessages
    this.currentTestConfig = testConfig
    this.setSignalsIdNameMap(testConfig)
    await this.getSpecialDigitalKeyList(testConfig!)
    // 创建一条新的记录
    await this.createNewRecord(testConfig!)

    // TODO 连接下位机并且发送消息,调试的时候没有下位机所以注释掉，使用startMock
    // 下发逻辑放到后面，因为要等到所有的数据都准备好了才能下发,并且如果失败、停止下发的时候比较Ok
    try {
      await connectWithMultipleBoards(hostPortList, 0)
    } catch (e) {
      return "连接下位机失败"
    }

    // 发送所有消息给板子
    try {
      await sendMultipleMessagesBoard(res.resultMessages, 1000)
    } catch (e) {
      return "向下位机发送消息失败"
    }
    await this.storeCurrentConfigToSql(testConfig!)

    // TODO 模拟数据
    // startMockBoardMessage(this.signalsMappingRelation)
    return undefined
  }

  // 在数据库新建一条记录
  async createNewRecord(testConfig: ITestConfig) {
    const result = await historyService.addHistory({
      testConfig: testConfig,
      path: "",
      vehicleName: testConfig.configs[0].vehicle.vehicleName,
      fatherConfigName: testConfig.name + CURRENT_HISTORY_SIGN,
      size: "0",
    })
    this.currentHistoryId = result.id
  }

  setSignalsIdNameMap(testConfig: ITestConfig) {
    testConfig.configs.forEach(config => {
      config.projects.forEach(project => {
        project.indicators.forEach(indicator => {
          this.signalsIdNameMap.set(indicator.signal.id, `${indicator.name}(${indicator.signal.name})`)
        })
      })
    })
  }

  /**
   * 停止当前下发
   */
  async stopCurrentTestConfig() {
    // stopMockBoardMessage()
    await sendMultipleMessagesBoard(this.banMessage, 200)
    await historyService.updateHistoryName(this.currentHistoryId, this.currentTestConfig?.name!)
    await this.clearCurrent()
    return true
  }

  async pushDataToCurrentHistory(data: {
    time: number
    data: {
      [key: number]: number
    }
  }) {
    // 如果当前的currentTestConfigHistory超过了十万条，那么存储到数据库
    if (this.currentTestConfigHistoryData.length > CURRENT_DATA_LIMIT) {
      console.log("存储到数据库")
      this.saveCurrentDataToSql(this.currentTestConfigHistoryData)
      this.clearOnlyData()
    }
    this.currentTestConfigHistoryData.push(data)
  }

  clearOnlyData() {
    this.currentTestConfigHistoryData = []
  }

  async clearCurrent() {
    this.currentTestConfig = null
    this.signalsMappingRelation.clear()
    this.clearOnlyData()
    this.resultMessages = []
    this.banMessage = []
    this.digitalKeyList = []
    this.currentHistoryId = 0
    // 清空状态
    await this.deleteCurrentConfigFromSql()
    disconnectWithBoard()
  }

  async storeCurrentConfigToSql(config: ITestConfig) {
    await this.deleteCurrentConfigFromSql()
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
      testConfig: testConfig,
      historyData: this.currentTestConfigHistoryData
    }

    const currentDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
    // 存储到的目录文件夹
    let dir = '../public/uploads/' + currentDate
    dir = path.resolve(__dirname, dir)
    // 文件路径
    const targetPath = path.resolve(__dirname, `../public/uploads/${currentDate}/${historyName}.json`)
    // 静态资源路径
    const staticPath = `/uploads/${currentDate}/${historyName}.json`
    // 确保文件夹存在
    try {
      fs.mkdirSync(dir, {recursive: true});

      // 创建一个文件
      fs.writeFileSync(targetPath, JSON.stringify(history, null, 2));

      const fileSize = fs.statSync(targetPath)

      console.log("车辆名称", this.currentTestConfig?.configs[0].vehicle.vehicleName)

      // @ts-ignore
      // await historyService.addHistory({
      //   testConfig: {},
      //   fatherConfigName: this.currentTestConfig?.name ?? "默认名称",
      //   size: transferFileSize(fileSize.size),
      //   vehicleName: this.currentTestConfig?.configs[0].vehicle.vehicleName!,
      //   path: staticPath
      // })

      // await this.downReceiveDataToXlsx(this.currentTestConfig?.name ?? "默认名称")

    } catch (error) {
      console.error('Failed to write file:', error);
      return false
    }
    return true
  }

  async saveCurrentDataToSql(currentData: {
    time: number
    data: {
      [key: number]: number
    }
  }[]) {
    // 存储到数据库
    const data: IData[] = []
    currentData.forEach(item => {
      for (let key in item.data) {
        data.push({
          belongId: this.currentHistoryId,
          configName: this.currentTestConfig?.name!,
          name: this.signalsIdNameMap.get(key)!,
          time: item.time,
          value: item.data[key]
        })
      }
    })
    await DataService.addData(data)
  }
}

export default new TestConfigService()




