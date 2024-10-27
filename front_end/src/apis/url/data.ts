import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const DATA_API:UrlMap = {
    getTargetData: {
        url: '/getData',
        method: Method.POST,
        format: ContentType.JSON
    },
    getDataMaxMinMiddle: {
        url: '/getDataMaxMinMiddle/:belongId',
        method: Method.GET
    },
    updateData: {
        url: '/updateData',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteData: {
        url: '/deleteData',
        method: Method.POST,
        format: ContentType.JSON
    },
    //router.post('/fgetSampleData', DataController.fgetSampledData);
    fgetSampledData: {
        url: '/fgetSampleData',
        method: Method.POST,
        format: ContentType.JSON
    }
}
