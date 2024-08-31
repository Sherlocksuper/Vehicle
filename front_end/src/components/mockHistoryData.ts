// 假设已经导入了必要的接口类型

import {IHistory, IHistoryItemData} from "@/apis/standard/history.ts";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";

export function generateHistoryData(testProcess: ITestProcessN, interval: number): { start: () => void; stop: () => void; getHistory: () => IHistory } {
    // 初始化 IHistory 对象
    const history: IHistory = {
        historyName: testProcess.testName,
        configName: testProcess.template.name,
        startTime: Date.now(),
        endTime: 0,
        template: testProcess.template,
        historyData: [],
    };

    let timer: NodeJS.Timer | null = null;


    // 根据 template 创建 initial historyData
    history.historyData = testProcess.template.itemsConfig.map((templateItem) => ({
        templateItemId: templateItem.id!.toString(),
        data: [],
    }));

    // 定义生成随机数的函数（可根据需要调整生成逻辑）
    const generateRandomValue = () => Math.random() * 100;

    // 定义定时生成数据的函数
    const start = () => {
        if (timer) return; // 防止重复启动

        timer = setInterval(() => {
            const timestamp = Date.now();

            testProcess.template.itemsConfig.forEach((item)=>{
                const historyItemData: IHistoryItemData = {
                    xAxis: timestamp,
                    data: {},
                };
                item.requestSignals.forEach((item)=>{
                    historyItemData.data[item.signal.id] = generateRandomValue();
                })

                // 推送到id为item.id的数据
                const index = history.historyData.findIndex((historyItem) => historyItem.templateItemId === item.id);
                if (index !== -1) {
                    history.historyData[index].data.push(historyItemData);
                }
            })

            console.log(`在 ${new Date(timestamp).toLocaleString()} 生成了一条数据`);
            console.log(JSON.stringify(history))
        }, interval);
    };

    // 停止生成数据
    const stop = () => {
        if (timer) {
            // @ts-ignore
            clearInterval(timer)
            timer = null;
            history.endTime = Date.now();
            console.log(`数据采集已停止，结束时间：${new Date(history.endTime).toLocaleString()}`);
        }
    };

    // 获取当前的 history 数据
    const getHistory = () => history;

    return { start, stop, getHistory };
}



