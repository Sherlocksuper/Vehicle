import {ICollector, IController} from "@/views/demo/Topology/PhyTopology.tsx";

export interface ICollectUnit {
  id?: number
  collectUnitName: string
  core:IController
  collectors: ICollector[]
}
