import {ITemplate} from "@/apis/standard/template.ts";
import {IDragItem} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";

export const debounce = (targetFunction: (...args: any[]) => void, delay?: number) => {
    let timer: any = null;
    if (!delay) delay = 500;
    return (...args: any[]) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            targetFunction(...args);
        }, delay);
    }
}//节流

export const throttle = (fn: (...args: any[]) => void, delay: number) => {
    let flag = true;
    if (!delay) delay = 500;
    return (...args: any[]) => {
        if (!flag) {
            alert('操作过于频繁');
            return;
        }
        flag = false;
        setTimeout(() => {
            fn(...args);
            flag = true;
        }, delay);
    }
}//防抖

export const hasDuplicate = (list: string[]) => {
    console.log("检查 list:" + list)
    return new Set(list).size !== list.length;
}

export async function sleep(time: number) {
    return new Promise(res => {
        setTimeout(res, time)
    })
}

export function transferToDragItems(template: ITemplate): IDragItem[] {
    const dragItems = template.itemsConfig.map((item) => {
        const newItem: IDragItem = {
            id: item.id,
            type: item.type,
            itemConfig: {
                requestSignalId: null,
                requestSignals: item.requestSignals,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height,
                title: item.title,
                interval: item.interval,
                trueLabel: item.trueLabel,
                falseLabel: item.falseLabel,
                unit: item.unit,
                during: item.during,
                min: item.min,
                max: item.max,
                label: item.label
            }
        }
        return newItem
    })
    console.log("转换为DragItems")
    console.log(JSON.stringify(dragItems))
    return dragItems
}