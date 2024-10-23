import DataService from "../service/DataService";
import {
  DELETE_SUCCESS_MSG,
  FAIL_CODE, SEARCH_FAIL_MSG,
  SEARCH_SUCCESS_MSG,
  SUCCESS_CODE, UPDATE_FAIL_MSG, UPDATE_SUCCESS_MSG,
} from "../constants";
import {Context} from "koa";
import {IResBody} from "../types";
import dataService from "../service/DataService";

class DataController {
  async getTargetData(context: Context) {
    const {belongId, name, startTime, endTime, minValue, maxValue} = context.request.body
    const res = await dataService.getTargetData(belongId, name, startTime, endTime, minValue, maxValue)

    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }

  async getDataMaxMinMiddle(context: Context) {
    const belongId = context.params.belongId
    const res = await dataService.getDataMaxMinMiddle(belongId)

    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: FAIL_CODE,
      msg: SEARCH_FAIL_MSG,
      data: null
    })
  }

  async updateData(context: Context) {
    const {configName, name, time, value} = context.request.body
    const res = await dataService.updateData(configName, name, time, value)

    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: UPDATE_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: FAIL_CODE,
      msg: UPDATE_FAIL_MSG,
      data: null
    })
  }

  async deleteData(context: Context) {
    const {belongId, name, time, value} = context.request.body
    const res = await dataService.deleteData(belongId, name, time, value)

    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: DELETE_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: FAIL_CODE,
      msg: "删除失败",
      data: null
    })
  }

  async startDataReplay(context: Context) {
    const belongId = context.params.belongId;

    Promise.resolve(belongId).then((belongId) => {
      dataService.startDataReplay(belongId);
    });

    ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: "开始成功",
      data: null
    })
  }
}

export default new DataController()
