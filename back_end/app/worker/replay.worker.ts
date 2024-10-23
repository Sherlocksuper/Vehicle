import {parentPort} from "worker_threads";
import dataService from "../service/DataService";

// 通过监听message事件，接收主线程传递过来的搜索条件
parentPort!.on('message', async (data: {
  belongId: number,
  page: number,
  pageSize: number
}) => {
  const res = await dataService.getDataWithScope(data.belongId, data.page, data.pageSize)
  parentPort!.postMessage(res)
})
