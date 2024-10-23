import {request} from "@/utils/request.ts";
import {DATA_API} from "@/apis/url/data.ts";

export const deleteData = async (belongId: number, name: string, time: number ,value: number) => {
  const api = DATA_API.deleteData;
  return request({
    api: api,
    params: {
      belongId,
      name,
      time,
      value
    }
  });
}

export const getDataMaxMinMiddle = async (belongId: number) => {
  const api = {...DATA_API.getDataMaxMinMiddle};
  api.url = api.url.replace(':belongId', belongId.toString());
  return await request({
    api: api,
  });
}

//const {belongId, name, startTime, endTime, minValue, maxValue} = context.request.body
export const searchForTargetData = async (belongId: number, name: string, startTime: number, endTime: number, minValue: number, maxValue: number) => {
  const api = DATA_API.getTargetData;
  return request({
    api: api,
    params: {
      belongId,
      name,
      startTime,
      endTime,
      minValue,
      maxValue
    }
  });
}