///**
//  * 车辆管理接口
//  * created by lby on 6.2
//  */
// router.get('/getVehicleList', VehicleController.getVehicles)
// router.post('/createVehicle', VehicleController.createVehicle)
// router.get('/getVehicleById/:id', VehicleController.getVehicleById)
// router.post('/updateVehicle/:id', VehicleController.updateVehicle)
// router.post('/deleteVehicle/:id', VehicleController.deleteVehicle)


import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const VEHICLE_API: UrlMap = {
    getVehicleList: {
        url: '/getVehicleList',
        method: Method.GET,
        format: ContentType.JSON
    },
    createVehicle: {
        url: '/createVehicle',
        method: Method.POST,
        format: ContentType.JSON
    },
    getVehicleById: {
        url: '/getVehicleById/:id',
        method: Method.GET,
        format: ContentType.JSON
    },
    updateVehicle: {
        url: '/updateVehicle/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteVehicle: {
        url: '/deleteVehicle/:id',
        method: Method.POST,
        format: ContentType.JSON
    }
}