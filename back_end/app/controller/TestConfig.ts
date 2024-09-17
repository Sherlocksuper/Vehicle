import TestObjectNService from "../service/TestObjectNService";
import {FAIL_CODE, SEARCH_FAIL_MSG, SEARCH_SUCCESS_MSG, SUCCESS_CODE} from "../constants";
import {IResBody} from "../types";
import {Context} from "koa";
import {ITestObjectNModel} from "../model/2TestObjectN.model";
import TestConfigService from "../service/TestConfig";
import {ITestConfig} from "../model/TestConfig";


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

  async startConnection(ctx: Context) {

    const res = ctx.res;
    ctx.res.setHeader('Content-Type', 'text/event-stream');
    ctx.res.setHeader('Cache-Control', 'no-cache');
    ctx.res.setHeader('Connection', 'keep-alive');
    ctx.res.setHeader('Access-Control-Allow-Origin', '*');

    // @ts-ignore
    res.end = undefined

    let startTime = Date.now();

    const sendEvent = () => {
      if (Date.now() - startTime >= 10000) {
        res.write('event: close\ndata: {}\n\n');//发送一个特殊事件通知客户端关闭
        return;
      }

      const data = {message: 'Hello World', timestamp: new Date()};
      res.write(`data:${JSON.stringify(data)}\n\n`);

      setTimeout(sendEvent, 2000);
    };

    sendEvent();
  }
}

export default new TestConfigController()
