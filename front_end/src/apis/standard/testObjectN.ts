/**
 * 新的测试对象接口
 * 为了区分，后面加了N
 */
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {IProject} from "@/apis/standard/project.ts";

export interface ITestObjectN {
    id: number
    title: string
    vehicle: IVehicle
    project: IProject
    template: ITemplate
}