import {ProtocolType} from "@/apis/request/protocol.ts";

export const processProtocolData = (type, data) => {
    switch (type) {
        case ProtocolType.CAN:
            return processCanData(data)
        case ProtocolType.FlexRay:
            return processFlexRayData(data)
        default:
            return {}
    }
}

export const parseProtocolData = (type, data) => {
    switch (type) {
        case ProtocolType.CAN:
            return parseCanData(data)
        case ProtocolType.FlexRay:
            return processFlexRayData(data)
        default:
            return {}
    }
}

// 加工can模块数据
const processCanData = (data: any) => {
    const signals = data.signals.map((item: any) => {
        return {
            name: item.name,
            dimension: item.dimension,
            result: `${item.startPoint} ${item.length} ${item.slope} ${item.offset}`
        }
    })
    return {
        protocolName: data.protocolName,
        protocolType: data.protocolType,
        signals: signals
    }
}

const parseCanData = (data: any) => {
    const signals = data.signals.map((item: any) => {
        return {
            name: item.name,
            dimension: item.dimension,
            startPoint: item.result.split(' ')[0],
            length: item.result.split(' ')[1],
            slope: item.result.split(' ')[2],
            offset: item.result.split(' ')[3]
        }
    })
    return {
        protocolName: data.protocolName,
        protocolType: data.protocolType,
        signals: signals
    }
}

// 加工FlexRay模块数据
const processFlexRayData = (data: any) => {
    const signals = data.signals.map((item: any) => {
        return {
            name: item.name,
            dimension: item.dimension,
            result: `${item.startPoint} ${item.length} ${item.slope} ${item.offset}`
        }
    })
    return {
        protocolName: data.protocolName,
        protocolType: data.protocolType,
        signals: signals
    }
}

// 加工MIC模块数据
const processMicData = (data: any) => {
    const signals = data.signals.map((item: any) => {
        return {
            name: item.name,
            dimension: item.dimension,
            result: `${item.startPoint} ${item.length} ${item.slope} ${item.offset}`
        }
    })
    return {
        protocolName: data.protocolName,
        protocolType: data.protocolType,
        signals: signals
    }
}

// 加工B1552B模块数据
const processB1552BData = (data: any) => {
    const signals = data.signals.map((item: any) => {
        return {
            name: item.name,
            dimension: item.dimension,
            result: `${item.startPoint} ${item.length} ${item.slope} ${item.offset}`
        }
    })
    return {
        protocolName: data.protocolName,
        protocolType: data.protocolType,
        signals: signals
    }
}

