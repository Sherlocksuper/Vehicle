import {IHistory, IHistoryItemData, ITemplateData} from "@/apis/standard/history.ts";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";

self.onmessage = (event) => {

    const result = event.data as ITestProcessN;

    const historyData: ITemplateData[] = result.template.itemsConfig.map((item) => {

        const data = Array.from({length: 3000 * 60 * 6}, (v, k) => {
            return {
                xAxis: new Date().toString(),
                data: {
                    [item.id!]: Math.random()
                }
            } as IHistoryItemData
        })

        return {
            templateItemId: item.id,
            data: data
        } as ITemplateData
    })

    let historyResult: IHistory = {
        template: {
            id: result.template.id,
            name: result.template.name,
            description: result.template.description,
            createdAt: result.template.createdAt,
            updatedAt: result.template.updatedAt,
            itemsConfig: []
        },
        historyData: historyData
    }

    const blob = new Blob([JSON.stringify(historyResult)], {type: 'application/json'});

    self.postMessage(blob)
}