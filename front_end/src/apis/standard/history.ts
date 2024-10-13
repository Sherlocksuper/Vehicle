import {ITemplate} from "@/apis/standard/template.ts";
import {ITestConfig} from "@/apis/standard/test.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

/**
 * 两个属性，一个是模板，一个是历史记录
 * @param template
 * @param history
 * 历史记录是一个json数据，
 * 数据记录规范：
 *  history -> 根据模板id记录对应的模板的数据 -> 每个模板的数据是一个数组 -> 数组中的每个元素是一个json数据
 *  -> json数据中包含时间和数据，即RandomData
 */
export interface IHistory {
    historyName: string
    configName: string
    startTime: number
    endTime: number
    template: ITemplate
    testConfig: ITestConfig
    historyData: {
        time: number
        data: {
            [key: number]: number
        }
    }[]
    dataParseResult?: IProtocolSignal[]
}

/**
 * 每个模板对应的历史数据
 */
export interface ITemplateData {
    templateItemId: string
    data: IHistoryItemData[]
}

/**
 * xAxis是时间，data是一个对象，
 * key是信号id，value是信号值
 * key是ISignalItem.signal的id
 */
export interface IHistoryItemData {
    xAxis: number
    data: {
        [key: number]: number
    }
}
