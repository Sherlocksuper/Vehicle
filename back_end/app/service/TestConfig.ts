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
    const targetData = {
      "id": 1,
      "name": "测试配置1",
      "configs": [
        {
          "vehicle": {
            "id": 1,
            "vehicleName": "车辆1",
            "isDisabled": false,
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
                  "id": 1,
                  "createdAt": "2024-09-13T14:04:24.000Z",
                  "updatedAt": "2024-09-13T14:04:24.000Z",
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
                          "name": "aa",
                          "slope": "aa",
                          "length": "aa",
                          "offset": "aa",
                          "dimension": "aa",
                          "startPoint": "aa"
                        }
                      ],
                      "frameNumber": "aa"
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
            "createdAt": "2024-09-13T14:07:11.000Z",
            "updatedAt": "2024-09-13T14:07:11.000Z"
          },
          "projects": [
            {
              "name": "project1",
              "indicators": [
                {
                  "name": "速度",
                  "signal": {
                    "name": "aa",
                    "slope": "aa",
                    "length": "aa",
                    "offset": "aa",
                    "dimension": "aa",
                    "startPoint": "aa"
                  }
                }
              ]
            }
          ]
        }
      ],
      "updatedAt": "2024-09-13T14:09:36.283Z",
      "createdAt": "2024-09-13T14:09:36.283Z"
    }
    const testConfig = await TestConfig.findByPk(targetData.id);
    if (testConfig) {
      return testConfig;
    }
    // @ts-ignore
    TestConfig.create(targetData);
    return null;
  }

  // 下发

  /**
   * 下发测试流程，设置当前的测试流程为testPrdcessN
   */
  async downTestConfig(testConfigId: number) {
    const testConfig = await this.getTestConfigById(testConfigId);
    if (!testConfig) {
      return false
    }
    return true
  }

  /**
   * 停止当前下发
   */
  async stopCurrentTestConfig() {
    this.currentTestConfig = null
    return true
  }


  async getCurrentTestConfig() {
    return this.currentTestConfig
  }
}

export default new TestConfigService()




