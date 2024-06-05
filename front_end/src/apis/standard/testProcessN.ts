import {ITestObjectN} from "@/apis/standard/testObjectN.ts";
import {ITemplate} from "@/apis/standard/template.ts";

export interface ITestProcessN {
    id?: number
    userId: number
    testName: string
    testObjectNs: ITestObjectN[]
    template: ITemplate
    createAt?: Date
    updateAt?: Date
}
