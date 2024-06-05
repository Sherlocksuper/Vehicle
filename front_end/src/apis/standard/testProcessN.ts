import {ITestObjectN} from "@/apis/standard/testObjectN.ts";

export interface ITestProcessN {
    id?: number
    userId: number
    testName: string
    testObjects: ITestObjectN[]
    createAt?: Date
    updateAt?: Date
}
