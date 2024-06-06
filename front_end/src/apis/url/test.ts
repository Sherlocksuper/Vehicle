//POST: /createTestProcess
import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";
import {ControllerMap} from "@/apis/url/board-signal/controller.ts";
import {CollectorMap} from "@/apis/url/board-signal/collector.ts";
import {SignalMap} from "@/apis/url/board-signal/signal.ts";

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
    createController: ControllerMap.createController,
    getControllerList: ControllerMap.getControllerList,
    getAllControllerList: ControllerMap.getAllControllerList,

    createCollector: CollectorMap.createCollector,
    getCollectorList: CollectorMap.getCollectorList,
    getAllCollectorList: CollectorMap.getAllCollectorList,

    getSignalListByCollectorId: SignalMap.getSignalListByCollectorId,
    createSignal: SignalMap.createSignal
}