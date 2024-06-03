//import {UrlMap} from "@/apis/url/myUrl.ts";
// import {ContentType, Method} from "@/apis/standard/all.ts";
//
// export const VEHICLE_API: UrlMap = {
//     getVehicleList: {
//         url: '/getVehicleList',
//         method: Method.GET,
//         format: ContentType.JSON
//     },
//     createVehicle: {
//         url: '/createVehicle',
//         method: Method.POST,
//         format: ContentType.JSON
//     },
//     getVehicleById: {
//         url: '/getVehicleById/:id',
//         method: Method.GET,
//         format: ContentType.JSON
//     },
//     updateVehicle: {
//         url: '/updateVehicle/:id',
//         method: Method.POST,
//         format: ContentType.JSON
//     },
//     deleteVehicle: {
//         url: '/deleteVehicle/:id',
//         method: Method.POST,
//         format: ContentType.JSON
//     }
// }

//增删改查
//获取车辆列表
import {request} from "@/utils/request.ts";
import {VEHICLE_API} from "@/apis/url/vehicle.ts";
import {IVehicle} from "@/apis/standard/vehicle.ts";

/**
 * 获取车辆列表
 */
export const getVehicles = async () => {
    const api = VEHICLE_API.getVehicleList;
    return request({
        api: api
    });
}

/**
 * 创建车辆
 * @param iVehicle
 */
export const createVehicle = async (iVehicle: IVehicle) => {
    const api = VEHICLE_API.createVehicle;
    return request({
        api: api,
        params: iVehicle
    });
}

/**
 * 根据Id获取车辆
 * @param id
 */
export const getVehicleById = async (id: number) => {
    const api = VEHICLE_API.getVehicleById;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
    });
}

/**
 * 更新车辆
 * @param id
 * @param iVehicle
 */
export const updateVehicle = async (id: number, iVehicle: IVehicle) => {
    const api = VEHICLE_API.updateVehicle;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
        params: iVehicle
    });
}

/**
 * 删除车辆
 * @param id
 */
export const deleteVehicle = async (id: number) => {
    const api = VEHICLE_API.deleteVehicle;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api
    });
}