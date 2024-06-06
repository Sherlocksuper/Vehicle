import {IControllersConfigItem} from "@/views/demo/Topology/PhyTopology.tsx";
import {MyUrl} from "@/apis/url/myUrl.ts";
import {request} from "@/utils/request.ts";


export const createController = async (controller: IControllersConfigItem) => {
    const api = MyUrl.TEST.createController
    return request({
        api: api,
        params: controller,
    });
}

export const getActiveControllerList = async () => {
    const api = MyUrl.TEST.getControllerList
    return request({
        api: api,
    });
}

export const getAllControllerList = async () => {
    const api = MyUrl.TEST.getAllControllerList
    return request({
        api: api,
    });
}
