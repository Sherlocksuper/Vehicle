import {UrlMap} from "@/apis/url/myUrl.ts";
import {Method} from "@/apis/standard/all.ts";

export const SignalMap: UrlMap = {
    getSignalListByCollectorId: {
        url: '/getSignalListByCollectorId',
        method: Method.GET
    },
    createSignal: {
        url: '/createSignal',
        method: Method.POST
    }
}