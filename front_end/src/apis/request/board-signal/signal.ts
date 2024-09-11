import {ISignal} from "@/views/demo/Topology/PhyTopology.tsx";
import {TEST} from "@/apis/url/test.ts";
import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";

export const createSignal = (signal: ISignal) => {
    const api = TEST.createSignal
    return request({
        api: api,
        params: signal,
    });
}

export const getSignalListByCollectorId = async (collectorId: number) => {
    const api = MyUrl.TEST.getSignalListByCollectorId
    return request({
        api: api,
        params: {
            collectorId: collectorId
        }
    });
}
