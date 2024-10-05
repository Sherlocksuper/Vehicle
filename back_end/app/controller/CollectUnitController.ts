import CollectUnitService from "../service/CollectUnitService";
import {FAIL_CODE, SEARCH_SUCCESS_MSG, SUCCESS_CODE, WRITE_FAIL_MSG, WRITE_SUCCESS_MSG} from "../constants";
import {IResBody} from "../types";
import {Context} from "koa";
import {ICollectUnitModel} from "../model/CollectUnit.model";

const collectUnitService = new CollectUnitService()
class CollectUnitController {
  async addCollectUnit(context: Context) {
    const collectUnit = context.request.body as ICollectUnitModel
    const res = await collectUnitService.addCollectUnit(collectUnit)
    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: WRITE_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: FAIL_CODE,
      msg: WRITE_FAIL_MSG,
      data: null
    })
  }

  async deleteCollectUnit(context: Context) {
    const id = context.params.id
    const res = await collectUnitService.deleteCollectUnit(id)
    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: WRITE_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: FAIL_CODE,
      msg: WRITE_FAIL_MSG,
      data: null
    })
  }

  async updateCollectUnit(context: Context) {
    const collectUnit = context.request.body as ICollectUnitModel
    const res = await collectUnitService.updateCollectUnit(collectUnit)
    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: WRITE_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: FAIL_CODE,
      msg: WRITE_FAIL_MSG,
      data: null
    })
  }

  async getCollectUnits(context: Context) {
    const res = await collectUnitService.getCollectUnits()
    res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: res
    })
    !res && ((context.body as IResBody) = {
      code: SUCCESS_CODE,
      msg: SEARCH_SUCCESS_MSG,
      data: null
    })
  }
}

export default new CollectUnitController()
