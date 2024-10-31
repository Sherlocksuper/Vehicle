import {ITemplate} from "@/apis/standard/template.ts";
import {IDragItem} from "@/views/demo/TestConfig/template.tsx";
import {ITestConfig} from "@/apis/standard/test.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";
import {IHistory} from "@/apis/standard/history.ts";


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

export function transferToDragItems(template: ITemplate): IDragItem[] {
  const dragItems = template.itemsConfig.map((item) => {
    const newItem: IDragItem = {
      id: item.id!,
      type: item.type,
      itemConfig: {
        requestSignalId: null,
        requestSignals: item.requestSignals,
        colors: item.colors,
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
        label: item.label,
        windowSize: item.windowSize
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
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`
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

/**
 * 确认删除
 */

export function confirmDelete() {
  return (confirm('是否删除'))
}

export const parseToObject = (value: any) => {
  if (typeof value === "undefined") {
    return undefined
  }
  if (typeof value === "object") {
    return value
  } else {
    return JSON.parse(value)
  }
}

export const getAllProtocolSignalsFromTestConfig = (testConfig: ITestConfig) => {
  const signals: IProtocolSignal[] = []
  testConfig.configs.forEach((config) => {
    config.projects.forEach((project) => {
      project.indicators.forEach((indicator) => {
        signals.push(indicator.signal)
      })
    })
  })
  return signals
}

export const wrapData = (history: IHistory) => {
  const encoder = new TextEncoder()
  const totalSignals: string[] = getTotalSignals(history)
  const usedSignals: IProtocolSignal[] = getUsedSignals(history)

  const wrapHeader = (history: IHistory, bodySize: number) => {
    const version = history.testConfig.dataWrap.version ?? "未定义"
    const equipmentType = history.testConfig.dataWrap.equipmentType ?? "未定义"
    const equipmentId = history.testConfig.dataWrap.equipmentId ?? "未定义"
    let dataLength = 0 // 初始化dataLength

    let dataStat = ''

    // 构造dataStat字符串
    for (let i = 0; i < totalSignals.length; i++) {
      const currentSignal = totalSignals[i]
      if (usedSignals.findIndex(item => item.id === currentSignal) !== -1) {
        dataStat += "1"
      } else {
        dataStat += "0"
      }
    }

    let finalResult = ""

    // 迭代直到dataLength稳定
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // 构造包含当前dataLength的部分结果
      const partialResult = [version, equipmentType, equipmentId, dataLength + bodySize, dataStat].join(" ")
      const newDataLength = encoder.encode(partialResult).length

      // 如果新计算的dataLength与之前相同，退出循环
      if (newDataLength === dataLength) {
        finalResult = partialResult
        break
      }

      // 否则更新dataLength并继续循环
      dataLength = newDataLength
    }

    return finalResult
  }

  const wrapOneSignal = (time: number, signal: IProtocolSignal, value: number) => {
    const date = new Date(time)
    const dateResultP1 = [date.getFullYear(), date.getMonth(), date.getDay() + 1].join("-")
    const dateResultP2 = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()].join("-")
    const dateResult = dateResultP1 + "." + dateResultP2
    let numResult = signal.name + ":" + value
    if (signal.dimension !== "/") {
      numResult += signal.dimension
    }

    let numLength = 0
    let finalResult = ""

    // 迭代直到numLength稳定
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // 构造包含当前numLength的字符串
      const partialResult = [dateResult, numLength, numResult].join(" ")
      const newNumLength = encoder.encode(partialResult).length

      // 如果新计算的长度与之前的相同，则退出循环
      if (newNumLength === numLength) {
        finalResult = partialResult
        break
      }

      // 否则更新numLength并继续循环
      numLength = newNumLength
    }

    return finalResult
  }


  const wrapSignals = []
  history.historyData.forEach(dataItem => {
    const datas = dataItem.data
    const time = dataItem.time
    const ids = Object.keys(datas)
    ids.forEach(id => {
      const value = datas[id]
      const targetSignal = usedSignals.find(item => item.id === id)
      if (targetSignal !== undefined) {
        console.log(targetSignal)
        wrapSignals.push(wrapOneSignal(time, targetSignal, value))
      }
    })
  })


  const bodyPart = wrapSignals.join("\n")
  const bodyLength = encoder.encode(bodyPart).length


  const headerPart = wrapHeader(history, bodyLength)

  return [headerPart, bodyPart].join("\n")
}

const getTotalSignals = (history: IHistory) => {
  const result = []
  history.testConfig.configs.forEach(config => {
    config.vehicle.protocols.forEach(protocol => {
      protocol.protocol.signalsParsingConfig.forEach(spConfig => {
        spConfig.signals.forEach(signal => {
          result.push(signal.id)
        })
      })
    })
  })
  return result
}

const getUsedSignals = (history: IHistory) => {
  const result = []
  history.testConfig.configs.forEach(config => {
    config.projects.forEach(project => {
      project.indicators.forEach(indicator => {
        result.push(indicator.signal)
      })
    })
  })
  return result
}

// 合并n项升序整数
export function mergeTwoArrays(arr1, arr2) {
  const merged = [];
  let i = 0, j = 0;

  // 合并两个数组
  // 合并两个数组
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      merged.push(arr1[i]);
      i++;
    } else if (arr1[i] > arr2[j]) {
      merged.push(arr2[j]);
      j++;
    } else {
      // Skip pushing when arr1[i] is equal to arr2[j]
      merged.push(arr1[i]);
      i++;
      j++;
    }
  }

  // 将剩余的元素加入结果中
  while (i < arr1.length) {
    merged.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    merged.push(arr2[j]);
    j++;
  }

  return merged;
}

export function mergeKArrays(arrays) {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0];

  // 使用归并的方式逐步合并
  let mergedArray = arrays[0];
  for (let i = 1; i < arrays.length; i++) {
    mergedArray = mergeTwoArrays(mergedArray, arrays[i]);
  }

  return mergedArray;
}

