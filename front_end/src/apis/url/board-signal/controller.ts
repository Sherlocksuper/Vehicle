import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const ControllerMap: UrlMap = {
    createController: {
        url: '/createController',
        method: Method.POST,
        format: ContentType.JSON
    },
    getControllerList: {
        url: '/getControllerList',
        method: Method.GET
    },
    getAllControllerList: {
        url: '/getAllControllerList',
        method: Method.GET
    },
    updateController: {
        url: '/updateController',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteController: {
        url: '/deleteController',
        method: Method.POST,
        format: ContentType.JSON
    }
}
