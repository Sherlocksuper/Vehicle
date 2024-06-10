import {ISignalItem} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {IHistoryItemData} from "@/apis/standard/history.ts";
import {DataSourceType} from "@/components/Charts/interface.ts";
import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import React, {useEffect, useMemo, useRef} from "react";
import * as echarts from "echarts";
import {generateRandomData} from "@/components/Charts/index.ts";
import {TEST_INTERNAL} from "@/constants";


export interface IChartInterface {
    startRequest: boolean
    sourceType?: DataSourceType
    requestSignals: ISignalItem[]
    onReceiveData: (data: IHistoryItemData) => void
    historyData?: IHistoryItemData
    chartType: DragItemType

    requestSignalId: number | null
    width: number
    height: number
    title: string
    trueLabel?: string
    falseLabel?: string
    unit?: string
    during?: number
    min?: number
    max?: number
    label?: string
}


const TotalChat: React.FC<IChartInterface> = (props) => {
    const {
        startRequest,
        requestSignals,
        sourceType,
        onReceiveData,

        trueLabel,
        falseLabel,
        title,
    } = props


    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const chartPositionRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<echarts.ECharts | null>()

    const xAxis = useRef<string[]>([])


    useMemo(() => {
        if (requestSignals.length > 0) {
            timerRef.current = setInterval(() => {
            }, TEST_INTERNAL)
        }
        return () => {
            timerRef.current && clearInterval(timerRef.current)
        }
    }, [requestSignals.length])


    useEffect(() => {
        chartRef.current = echarts.init(chartPositionRef.current)
        chartRef.current.setOption({
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: requestSignals.map(item => item.signal.signalName)
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: requestSignals.map(item => {
                return {
                    name: item.signal.signalName,
                    type: 'line',
                    stack: '总量',
                    data: []
                }
            })
        })

    }, [startRequest, requestSignals])

    return (
        <div ref={chartPositionRef} style={{
            width: '100%', height: '100%'
        }}></div>
    )
}

export default TotalChat