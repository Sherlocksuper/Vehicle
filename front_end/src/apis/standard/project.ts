/**
 * project信息，
 * project举例：室外项目、室内项目、车载项目等
 * project包含测试指标、controller、collector、single等信息
 * 指标举例:速度、里程
 */
import {IcollectorsConfigItem, IcontrollersConfigItem, IsignalsConfigItem} from "@/views/demo/topology/PhyTopology.tsx";

export interface IProject {
    id?: number
    projectName: string

    controller: IcontrollersConfigItem
    collector: IcollectorsConfigItem
    single: IsignalsConfigItem
}