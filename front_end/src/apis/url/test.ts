//POST: /createTestProcess
import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const TEST: UrlMap = {
    createTestProcess: {
        url: '/createTestProcess',
        method: Method.POST,
        format: ContentType.JSON
    },
    getTestProcessDetails: {
        url: '/getTestProcessDetails',
        method: Method.GET
    },
    editTestProcess: {
        url: '/editTestProcess',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteTestProcess: {
        url: '/deleteTestProcess',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    getTestProcessList: {
        url: '/getTestProcessList',
        method: Method.GET
    },
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
    getSignalListByCollectorId: {
        url: '/getSignalListByCollectorId',
        method: Method.GET
    },
}