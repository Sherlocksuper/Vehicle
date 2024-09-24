import {ContentType, Method} from "@/apis/standard/all.ts";
import {UrlMap} from "@/apis/url/myUrl.ts";

export const CollectorMap: UrlMap = {

    createCollector: {
        url: '/createCollector',
        method: Method.POST,
        format: ContentType.JSON
    },
    getCollectorList: {
        url: '/getCollectorList',
        method: Method.GET
    },
    getAllCollectorList: {
        url: '/getAllCollectorList',
        method: Method.GET
    },
    updateCollector: {
        url: '/updateCollector',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteCollector: {
        url: '/deleteCollector',
        method: Method.POST,
        format: ContentType.JSON
    }
}
