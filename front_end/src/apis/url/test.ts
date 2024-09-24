//POST: /createTestProcess
import {UrlMap} from "@/apis/url/myUrl.ts";
import {ControllerMap} from "@/apis/url/board-signal/controller.ts";
import {CollectorMap} from "@/apis/url/board-signal/collector.ts";
import {SignalMap} from "@/apis/url/board-signal/signal.ts";

export const TEST: UrlMap = {
    createController: ControllerMap.createController,
    getControllerList: ControllerMap.getControllerList,
    getAllControllerList: ControllerMap.getAllControllerList,
    updateController: ControllerMap.updateController,
    deleteController: ControllerMap.deleteController,

    createCollector: CollectorMap.createCollector,
    getCollectorList: CollectorMap.getCollectorList,
    getAllCollectorList: CollectorMap.getAllCollectorList,
    updateCollector: CollectorMap.updateCollector,
    deleteCollector: CollectorMap.deleteCollector,

    getSignalListByCollectorId: SignalMap.getSignalListByCollectorId,
    createSignal: SignalMap.createSignal
}
