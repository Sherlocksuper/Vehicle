import {ITemplate, ITemplateItem} from "@/apis/standard/template.ts";
import {IDragItem} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";


/**
 * @param targetFunction
 * @param delay
 * 防抖
 * 功能：防抖
 */
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
    return new Set(list).size !== list.length;
}

export async function sleep(time: number) {
    return new Promise(res => {
        setTimeout(res, time)
    })
}

export function deleteUndefined(obj: any) {
    for (let key in obj) {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key]
        } else if (typeof obj[key] === 'object') {
            deleteUndefined(obj[key])
        }
    }
}

export function transferToDragItems(template: ITemplate): IDragItem[] {
    const dragItems = template.itemsConfig.map((item) => {
        const newItem: IDragItem = {
            id: item.id!,
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
    return dragItems
}

/**
 * 传入时间戳
 * 返回格式化后的时间字符串
 * YYYY-MM-DD HH:mm:ss
 */
export function formatTime(timeStamp: number) {
    const date = new Date(timeStamp)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

/**
 * 传入number类型的文件带线啊哦
 */

export function formatFileSize(size: number) {
    if (size < 1024) {
        return size + 'B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
    } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    }
}