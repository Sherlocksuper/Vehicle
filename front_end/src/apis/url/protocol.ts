import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const PROTOCOL_API: UrlMap = {
    getProtocolList: {
        url: '/getProtocolList',
        method: Method.GET,
        format: ContentType.JSON
    },
    createProtocol: {
        url: '/createProtocol',
        method: Method.POST,
        format: ContentType.JSON
    },
    updateProtocol: {
        url: '/updateProtocol/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
    getProtocolById: {
        url: '/getProtocolById/:id',
        method: Method.GET,
        format: ContentType.JSON
    },
    deleteProtocol: {
        url: '/deleteProtocol/:id',
        method: Method.GET,
        format: ContentType.JSON
    }
}
