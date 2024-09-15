/**
 * create by lby
 */

import TestConfig, {ITestConfig} from "../model/TestConfig";
import {ITestProcessNModel} from "../model/1TestProcessN";
import {ILongMessageType, LongMessage} from "../ztcp/type";
import {sendToLong} from "../ztcp/sender";

class TestConfigService {

  currentTestConfig: ITestConfig | null = null

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
      if (id === this.currentTestConfig?.id){
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

  async initTestConfig() {
    const targetData =  {
        "id": 2,
        "name": "车辆数据采集",
        "configs": [
          {
            "vehicle": {
              "id": 5,
              "createdAt": "2024-09-14T07:03:57.000Z",
              "protocols": [
                {
                  "core": {
                    "id": 1,
                    "userId": null,
                    "isDisabled": false,
                    "controllerName": "hx-04A-1",
                    "controllerAddress": "192.168.0.101"
                  },
                  "protocol": {
                    "id": 3,
                    "createdAt": "2024-09-14T06:42:58.000Z",
                    "updatedAt": "2024-09-14T06:42:58.000Z",
                    "baseConfig": {
                      "baudRate": "800"
                    },
                    "protocolName": "CAN-1",
                    "protocolType": "CAN",
                    "signalsParsingConfig": [
                      {
                        "frameId": "aa",
                        "signals": [
                          {
                            "id": "d5ddf1f7-fdaf-4513-8edd-8a993b2663ba",
                            "name": "速度",
                            "slope": "10",
                            "length": "aa",
                            "offset": "11",
                            "dimension": "km/h",
                            "startPoint": "00"
                          }
                        ],
                        "frameNumber": "aa"
                      },
                      {
                        "frameId": "2",
                        "signals": [
                          {
                            "id": "a96a74f2-eddb-41a7-b7a0-0cd8d08c9b59",
                            "name": "历程",
                            "slope": "45",
                            "length": "22",
                            "offset": "3+",
                            "dimension": "123",
                            "startPoint": "11"
                          }
                        ],
                        "frameNumber": "12"
                      }
                    ]
                  },
                  "collector": {
                    "id": 1,
                    "userId": null,
                    "isDisabled": false,
                    "collectorName": "zx-04A-1",
                    "collectorAddress": "1"
                  }
                },
                {
                  "core": {
                    "id": 1,
                    "userId": null,
                    "isDisabled": false,
                    "controllerName": "hx-04A-1",
                    "controllerAddress": "192.168.0.101"
                  },
                  "protocol": {
                    "id": 4,
                    "createdAt": "2024-09-14T06:43:26.000Z",
                    "updatedAt": "2024-09-14T06:43:26.000Z",
                    "baseConfig": {
                      "baudRate": "800"
                    },
                    "protocolName": "CAN-2",
                    "protocolType": "CAN",
                    "signalsParsingConfig": [
                      {
                        "frameId": "a4",
                        "signals": [
                          {
                            "id": "380ea76d-c04d-4f24-a9b9-99157d9d3b0a",
                            "name": "速度2",
                            "slope": "10",
                            "length": "aa",
                            "offset": "11",
                            "dimension": "km/h",
                            "startPoint": "00"
                          }
                        ],
                        "frameNumber": "a3"
                      },
                      {
                        "frameId": "24",
                        "signals": [
                          {
                            "id": "214d6c85-d8bb-4606-81f5-c5f6749b058b",
                            "name": "历程2",
                            "slope": "45",
                            "length": "22",
                            "offset": "3+",
                            "dimension": "123",
                            "startPoint": "11"
                          }
                        ],
                        "frameNumber": "124"
                      }
                    ]
                  },
                  "collector": {
                    "id": 2,
                    "userId": null,
                    "isDisabled": false,
                    "collectorName": "zx-96-1",
                    "collectorAddress": "2"
                  }
                }
              ],
              "updatedAt": "2024-09-14T07:03:57.000Z",
              "isDisabled": false,
              "vehicleName": "车辆123"
            },
            "projects": [
              {
                "name": "车辆1的项目1",
                "indicators": [
                  {
                    "name": "速度",
                    "signal": {
                      "id": "d5ddf1f7-fdaf-4513-8edd-8a993b2663ba",
                      "name": "速度",
                      "slope": "10",
                      "length": "aa",
                      "offset": "11",
                      "dimension": "km/h",
                      "startPoint": "00"
                    }
                  },
                  {
                    "name": "历程",
                    "signal": {
                      "id": "a96a74f2-eddb-41a7-b7a0-0cd8d08c9b59",
                      "name": "历程",
                      "slope": "45",
                      "length": "22",
                      "offset": "3+",
                      "dimension": "123",
                      "startPoint": "11"
                    }
                  },
                  {
                    "name": "速度1",
                    "signal": {
                      "id": "380ea76d-c04d-4f24-a9b9-99157d9d3b0a",
                      "name": "速度2",
                      "slope": "10",
                      "length": "aa",
                      "offset": "11",
                      "dimension": "km/h",
                      "startPoint": "00"
                    }
                  },
                  {
                    "name": "里程2",
                    "signal": {
                      "id": "214d6c85-d8bb-4606-81f5-c5f6749b058b",
                      "name": "历程2",
                      "slope": "45",
                      "length": "22",
                      "offset": "3+",
                      "dimension": "123",
                      "startPoint": "11"
                    }
                  }
                ]
              }
            ]
          }
        ],
        "template": {
          "name": "默认模板",
          "description": "默认描述",
          "itemsConfig": [
            {
              "x": 4,
              "y": 0,
              "type": "BOOLEAN",
              "title": "请编辑默认标题",
              "width": 100,
              "height": 100,
              "interval": 1000,
              "trueLabel": "是",
              "falseLabel": "否",
              "requestSignals": [],
              "requestSignalId": null
            },
            {
              "x": 8,
              "y": 0,
              "max": 100,
              "min": 0,
              "type": "NUMBER",
              "unit": "单位",
              "title": "请编辑默认标题",
              "width": 210,
              "height": 240,
              "interval": 1000,
              "requestSignals": [],
              "requestSignalId": null
            },
            {
              "x": 0,
              "y": 0,
              "type": "PURENUMBER",
              "title": "请编辑默认标题",
              "width": 100,
              "height": 100,
              "interval": 1000,
              "requestSignals": [],
              "requestSignalId": null
            },
            {
              "x": 15,
              "y": 0,
              "max": 100,
              "min": 0,
              "type": "NUMBER",
              "unit": "单位",
              "title": "请编辑默认标题",
              "width": 240,
              "height": 240,
              "interval": 1000,
              "requestSignals": [],
              "requestSignalId": null
            }
          ]
        },
        "createdAt": "2024-09-14T07:17:33.000Z",
        "updatedAt": "2024-09-14T07:20:17.000Z"
      }
    const testConfig = await TestConfig.findByPk(targetData.id);
    if (testConfig) {
      return testConfig;
    }
    // @ts-ignore
    TestConfig.create(targetData);
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
    this.currentTestConfig = testConfig
    const message: ILongMessageType = {
      type: LongMessage.STARTCOLLECT,
      body: testConfig
    }
    const result = sendToLong(message)
    if (result !== undefined) {
      this.currentTestConfig = null
    }
    return result === undefined ? true : result
  }

  /**
   * 停止当前下发
   */
  async stopCurrentTestConfig() {
    const message: ILongMessageType = {
      type: LongMessage.STOPCOLLECT,
      body: null
    }
    const result = sendToLong(message)
    if (result !== undefined) {
      return result
    }
    this.currentTestConfig = null
    return result
  }
}

export default new TestConfigService()




