import TestObjectNService from "../service/TestObjectNService";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import {IResBody} from "../types";
import {Context} from "koa";
import {ITestObjectNModel} from "../model/2TestObjectN.model";
import TestConfigService from "../service/TestConfig";
import {ITestConfig} from "../model/TestConfig";
import {getTcpClient} from "../ztcp/toBoard";


class TestConfigController {

  /**
   * 创建测试配置
   * @param ctx
   * @returns
   */
  async createTestConfig(ctx: Context) {
    const param = ctx.request.body as ITestConfig;
    const res = await TestConfigService.createTestConfig(param);
    res && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: res
    })
    !res && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }

  /**
   * 通过id删除测试配置
   */
  async deleteTestConfigById(ctx: Context) {
    const {id} = ctx.params;
    const res = await TestConfigService.deleteTestConfigById(Number(id));
    res && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: null
    })
    !res && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }

  /**
   * 通过id查询测试对象
   */
  async getTestConfigById(ctx: Context) {
    const {id} = ctx.params;
    const res = await TestConfigService.getTestConfigById(Number(id));
    res && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: res
    })
    !res && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }

  /**
   * 查询所有测试对象
   */
  async getAllTestConfig(ctx: Context) {
    const res = await TestConfigService.getAllTestConfig();
    res && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: res
    })
    !res && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }

  // 下发测试配置
  async downTestConfig(ctx: Context) {
    // @ts-ignore
    const {id} = ctx.request.body;
    const res = await TestConfigService.downTestConfig(Number(id));
    // 如果没有返回值，说明下发成功
    !res && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: null
    })
    res && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: res,
      data: null
    })
  }

  // 停止当前下发
  async stopCurrentTestConfig(ctx: Context) {
    const res = await TestConfigService.stopCurrentTestConfig();
    res && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: null
    })
    !res && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }

  // 获取当前下发的测试配置
  async getCurrentTestConfig(ctx: Context) {
    const res = await TestConfigService.getCurrentTestConfig();
    ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: res
    })
  }

  async updateTestConfigById(ctx: Context) {
    const {id} = ctx.params;
    const param = ctx.request.body as ITestConfig;
    const res = await TestConfigService.updateTestConfigById(Number(id), param);
    res && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: null
    })
    !res && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }


  // async downHistoryDataAsJson() {
  async downHistoryDataAsJson(ctx: Context) {
    ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: null
    })
  }

  // 断开tcp连接
  async stopTcpConnect(ctx: Context) {
    await TestConfigService.stopCurrentTcp();
    ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: "停止接收成功",
      data: null
    })
  }

  // 建立tcp连接
  async startTcpConnect(ctx: Context) {
    const result = await TestConfigService.startCurrentTcp();
    result && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: "开始接收成功",
      data: null
    })
    !result && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: "开始接收失败，请重新下发尝试",
      data: null
    })
  }

  async getTcpConnectStatus(ctx: Context) {
    const isEnabling = TestConfigService.isEnabling

    isEnabling && ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: "正在连接",
      data: isEnabling
    })

    !isEnabling && ((ctx.body as IResBody) = {
      code: FAIL_CODE,
      msg: "未连接",
      data: isEnabling
    })
  }

  getBoardStatus(ctx: Context) {
    ((ctx.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: "获取板卡状态成功",
      data: TestConfigService.getBoardStatus()
    })
  }
}

export default new TestConfigController()
