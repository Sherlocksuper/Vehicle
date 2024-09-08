import {MyUrl} from "@/apis/url/myUrl.ts";
import {request} from "@/utils/request.ts";
import {ICollectorsConfigItem} from "@/views/demo/Topology/PhyTopology.tsx";


export const createCollector = async (collector: ICollectorsConfigItem) => {
    const api = MyUrl.TEST.createCollector
    return request({
        api: api,
        params: collector,
    });
}

export const getActiveCollectorList = async () => {
    const api = MyUrl.TEST.getCollectorList
    return request({
        api: api,
    });
}

export const getAllCollectorList = async () => {
    const api = MyUrl.TEST.getAllCollectorList
    return request({
        api: api,
    });
}

export const updateCollector = async (collector: ICollectorsConfigItem) => {
    const api = MyUrl.TEST.updateCollector
    return request({
        api: api,
        params: collector,
    });
}
