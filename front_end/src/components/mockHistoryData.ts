import { IHistory, IHistoryItemData } from "@/apis/standard/history.ts";
import { ITestProcessN } from "@/apis/standard/testProcessN.ts";

// 改进后的generateHistoryData函数
export function generateHistoryData(
    testProcess: ITestProcessN,
    minInterval: number,
    maxInterval: number,
    onReceiveData: (templateId: string, data: IHistoryItemData) => void
): { start: () => void; stop: () => void; getHistory: () => IHistory } {
    const history: IHistory = {
        historyName: testProcess.testName,
        configName: testProcess.template.name,
        startTime: Date.now(),
        endTime: 0,
        template: testProcess.template,
        historyData: [],
    };

    let timers: { [key: string]: NodeJS.Timer } = {};

    history.historyData = testProcess.template.itemsConfig.map((templateItem) => ({
        templateItemId: templateItem.id!.toString(),
        data: [],
    }));

    const generateRandomValue = () => Math.random() * 100;
    const generateRandomInterval = () => Math.random() * (maxInterval - minInterval) + minInterval;

    const start = () => {
        testProcess.template.itemsConfig.forEach((item) => {
            const generateData = () => {
                const timestamp = Date.now();
                const historyItemData: IHistoryItemData = {
                    xAxis: timestamp,
                    data: {},
                };

                item.requestSignals.forEach((signal) => {
                    historyItemData.data[signal.signal.id] = generateRandomValue();
                });

                const index = history.historyData.findIndex((historyItem) => historyItem.templateItemId === item.id);
                if (index !== -1) {
                    history.historyData[index].data.push(historyItemData);
                    onReceiveData(item.id!, historyItemData); // 实时反馈新数据
                }

                // 继续为该 templateId 设置随机间隔的定时器
                timers[item.id!] = setTimeout(generateData, generateRandomInterval());
            };

            // 初始启动数据生成
            timers[item.id!] = setTimeout(generateData, generateRandomInterval());
        });
    };

    const stop = () => {

        // @ts-ignore
        Object.values(timers).forEach(clearTimeout);
        timers = {};
        history.endTime = Date.now();
        console.log(`数据采集已停止，结束时间：${new Date(history.endTime).toLocaleString()}`);
    };

    const getHistory = () => history;

    return { start, stop, getHistory };
}
