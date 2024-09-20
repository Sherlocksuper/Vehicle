/**
 * create by lby
 */

import TestConfig, {ITestConfig} from "../model/TestConfig";
import {ITestProcessNModel} from "../model/1TestProcessN";
import {ILongMessageType, LongMessage} from "../ztcp/type";
import {sendToLong} from "../ztcp/sender";
import {getConfigBoardMessage} from "../../utils/BoardUtil/encoding";
import {startMockBoardMessage, stopMockBoardMessage} from "../ztcp/ws";

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
    const targetData =  {
      "id": 1,
      "name": "testConfig1",
      "configs": [
        {
          "vehicle": {
            "id": 8,
            "createdAt": "2024-09-19T13:53:14.000Z",
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
                  "id": 6,
                  "createdAt": "2024-09-16T00:36:34.000Z",
                  "updatedAt": "2024-09-19T10:59:16.000Z",
                  "baseConfig": {
                    "baudRate": "800"
                  },
                  "protocolName": "CAN-1",
                  "protocolType": "CAN",
                  "signalsParsingConfig": [
                    {
                      "frameId": "1",
                      "signals": [
                        {
                          "id": "63c7df50-3598-4645-bc55-221c1f73ac87",
                          "name": "速度",
                          "slope": "3",
                          "length": "2",
                          "offset": "4",
                          "dimension": "km/h",
                          "startPoint": "1"
                        },
                        {
                          "id": "db06679c-e84e-43b1-888f-1d07fd64e878",
                          "name": "里程",
                          "slope": "7",
                          "length": "6",
                          "offset": "8",
                          "dimension": "km",
                          "startPoint": "5"
                        },
                        {
                          "id": "f2ad17c7-e374-43bf-a7c7-6038baac3837",
                          "name": "电压",
                          "slope": "11",
                          "length": "10",
                          "offset": "12",
                          "dimension": "V",
                          "startPoint": "9"
                        }
                      ],
                      "frameNumber": "1"
                    },
                    {
                      "frameId": "2",
                      "signals": [
                        {
                          "id": "eabe53ec-d764-48d2-99dc-e97e1d7da858",
                          "name": "速度-2",
                          "slope": "15",
                          "length": "14",
                          "offset": "16",
                          "dimension": "km/h",
                          "startPoint": "13"
                        },
                        {
                          "id": "b213b031-c45a-4ce9-a99e-5c822aea418d",
                          "name": "里程-2",
                          "slope": "19",
                          "length": "18",
                          "offset": "20",
                          "dimension": "km.h",
                          "startPoint": "17"
                        }
                      ],
                      "frameNumber": "2"
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
                  "id": 7,
                  "createdAt": "2024-09-16T00:38:54.000Z",
                  "updatedAt": "2024-09-19T10:59:16.000Z",
                  "baseConfig": {
                    "setAsSyncNode": "8",
                    "dynamicSlotCount": "6",
                    "staticSlotsCount": "5",
                    "dynamicSlotLength": "7",
                    "macroticksPerCycle": "2",
                    "microticksPerCycle": "1",
                    "staticFramepayload": "4",
                    "transmissionStartTime": "3"
                  },
                  "protocolName": "Flexray-1",
                  "protocolType": "FlexRay",
                  "signalsParsingConfig": [
                    {
                      "frameId": "0",
                      "signals": [
                        {
                          "id": "1d413c9c-f14f-473b-bb97-6ac6fb450e2c",
                          "name": "速度",
                          "slope": "3",
                          "length": "2",
                          "offset": "4",
                          "dimension": "km/h",
                          "startPoint": "1"
                        },
                        {
                          "id": "5c362f0a-45d5-476a-b632-14e0e8f89c72",
                          "name": "里程",
                          "slope": "7",
                          "length": "6",
                          "offset": "8",
                          "dimension": "km",
                          "startPoint": "5"
                        },
                        {
                          "id": "82091432-d1c3-4f36-81af-7fb07c3d81ee",
                          "name": "电压",
                          "slope": "11",
                          "length": "10",
                          "offset": "12",
                          "dimension": "V",
                          "startPoint": "9"
                        }
                      ],
                      "cycleNumber": "0",
                      "frameNumber": "0"
                    },
                    {
                      "frameId": "1",
                      "signals": [
                        {
                          "id": "9e1089aa-2c24-4cf6-b306-53c5c542e3ec",
                          "name": "速度-2",
                          "slope": "15",
                          "length": "14",
                          "offset": "16",
                          "dimension": "km/h",
                          "startPoint": "13"
                        },
                        {
                          "id": "8d67e3b8-22f6-41ca-ad15-f257185991e7",
                          "name": "里程-2",
                          "slope": "19",
                          "length": "18",
                          "offset": "20",
                          "dimension": "km",
                          "startPoint": "17"
                        }
                      ],
                      "cycleNumber": "1",
                      "frameNumber": "1"
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
                  "id": 11,
                  "createdAt": "2024-09-19T13:50:40.000Z",
                  "updatedAt": "2024-09-19T13:50:40.000Z",
                  "baseConfig": {
                    "btc": "2",
                    "nctc": "1",
                    "nrtc": "3",
                    "modadd": "4",
                    "dataUpdateRate": "5"
                  },
                  "protocolName": "MIC-1",
                  "protocolType": "MIC",
                  "signalsParsingConfig": [
                    {
                      "devid": "8",
                      "modadd": "7",
                      "signals": [
                        {
                          "id": "148cf292-9cd0-446e-b25e-666680912310",
                          "name": "速度",
                          "dimension": "km/h"
                        }
                      ],
                      "frameNumber": "6"
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
                  "id": 12,
                  "createdAt": "2024-09-19T13:51:24.000Z",
                  "updatedAt": "2024-09-19T13:51:24.000Z",
                  "baseConfig": {
                    "listenAddress": "0"
                  },
                  "protocolName": "B1552B-1",
                  "protocolType": "B1552B",
                  "signalsParsingConfig": [
                    {
                      "signals": [
                        {
                          "id": "dde2d89b-3021-4e88-aafd-642026e9c63f",
                          "name": "B1552B-1里程",
                          "dimension": "km"
                        }
                      ],
                      "rtAddress": "2",
                      "frameNumber": "1",
                      "childAddress": "3"
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
                  "id": 13,
                  "createdAt": "2024-09-19T13:52:03.000Z",
                  "updatedAt": "2024-09-19T13:52:03.000Z",
                  "baseConfig": {
                    "check": "2",
                    "stopBit": "1",
                    "baudRate": "800",
                    "checkType": "3"
                  },
                  "protocolName": "Serial422-1",
                  "protocolType": "Serial422",
                  "signalsParsingConfig": [
                    {
                      "signals": [
                        {
                          "id": "15bfb988-efdb-4d52-8965-a652eef95f4d",
                          "name": "Serial422-1电压",
                          "slope": "02",
                          "length": "01",
                          "offset": "03",
                          "dimension": "km",
                          "startPoint": "00"
                        }
                      ],
                      "rtAddress": "2",
                      "frameNumber": "1",
                      "childAddress": "3"
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
                  "id": 14,
                  "createdAt": "2024-09-19T13:52:35.000Z",
                  "updatedAt": "2024-09-19T13:52:35.000Z",
                  "baseConfig": {
                    "voltageRange": "2",
                    "dataUpdateRate": "1"
                  },
                  "protocolName": "Analog-1",
                  "protocolType": "Analog",
                  "signalsParsingConfig": [
                    {
                      "signals": [
                        {
                          "id": "49540541-1a22-4c25-aa6c-0edad471b21e",
                          "name": "Analog-1油量",
                          "slope": "02",
                          "length": "01",
                          "offset": "03",
                          "dimension": "L",
                          "startPoint": "00"
                        }
                      ],
                      "rtAddress": "2",
                      "frameNumber": "1",
                      "childAddress": "3"
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
              }
            ],
            "updatedAt": "2024-09-19T13:53:14.000Z",
            "isDisabled": false,
            "vehicleName": "车辆fortest"
          },
          "projects": [
            {
              "name": "projectName",
              "indicators": [
                {
                  "name": "indicator",
                  "signal": {
                    "id": "63c7df50-3598-4645-bc55-221c1f73ac87",
                    "name": "速度",
                    "slope": "3",
                    "length": "2",
                    "offset": "4",
                    "dimension": "km/h",
                    "startPoint": "1"
                  }
                }
              ]
            }
          ]
        }
      ],
      "template": null,
      "createdAt": "2024-09-19T13:53:42.000Z",
      "updatedAt": "2024-09-19T13:53:42.000Z"
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

    // 解析所有的message
    const res = getConfigBoardMessage(testConfig!)
    console.log(res.resultMessages)
    // signalMap是用来解析下位机传上来的数据，通过模块id、帧号id来解析，如果信号id、帧id相同，那么按照顺序映射
    console.log(res.signalsMap)
    startMockBoardMessage(res.signalsMap)

    const message: ILongMessageType = {
      type: LongMessage.STARTCOLLECT,
      body: res.resultMessages
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
    this.currentTestConfig = null
    stopMockBoardMessage()
    return true
  }
}

export default new TestConfigService()




