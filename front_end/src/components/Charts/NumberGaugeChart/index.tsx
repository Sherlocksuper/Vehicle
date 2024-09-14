import * as echarts from "echarts"
import {useEffect, useRef, useState} from "react"
import {IChartInterface} from "@/components/Charts/interface.ts";
import {IHistoryItemData} from "@/apis/standard/history.ts";
import {mockHistoryData} from "@/components/Charts";

const NumberGaugeChart: React.FC<IChartInterface> = (props, context) => {

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const [value, setValue] = useState(0)

    const chartRef = useRef<echarts.ECharts | null>()
    const chartContainerRef = useRef<HTMLDivElement | null>(null)

    const {
        startRequest,
        requestSignals,
        sourceType,
        historyData,
        currentTestChartData,

        unit,
        title,
        width,
        height,
    } = props


    const pushData = (data: IHistoryItemData) => {
        if (!requestSignals || requestSignals.length === 0) {
            return;
        }
        setValue(data.data[requestSignals[0].name])
    }

    // 历史记录
    useEffect(() => {
        if (!historyData) {
            return
        }
        const getFileData = mockHistoryData(0, pushData, historyData!)
        getFileData(0)

        return () => {
            timerRef.current && clearInterval(timerRef.current)
        }
    }, [startRequest, requestSignals])

    // 同步netWorkData
    useEffect(() => {
        if (!currentTestChartData || currentTestChartData.length === 0) {
            return
        }
        pushData(currentTestChartData[currentTestChartData.length - 1])
    }, [currentTestChartData?.length])


    useEffect(() => {
        chartRef.current?.setOption({
            series: [
                {
                    data: [
                        {
                            value,
                            name: title
                        }
                    ]
                }
            ]
        });
    }, [value])

    useEffect(() => {
        chartRef.current = echarts.init(chartContainerRef.current)

        const option = {
            series: [
                {
                    type: 'gauge',
                    splitNumber: 10,
                    progress: {
                        show: true,
                        width: Math.min(height, width) / 25
                    },
                    axisLine: {
                        lineStyle: {
                            width: Math.min(height, width) / 25
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        length: Math.min(height, width) / 26,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: Math.min(height, width) / 22,
                        color: '#999',
                        fontSize: Math.min(height, width) / 23
                    },
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: Math.min(height, width) / 22,
                        itemStyle: {
                            borderWidth: Math.min(height, width) / 30
                        }
                    },
                    title: {
                        offsetCenter: [0, '-120%'],
                        fontSize: Math.min(height, width) / 15
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: Math.min(height, width) / 18,
                        offsetCenter: [0, '70%'],
                        formatter: `{value} ${unit}`,
                        color: 'inherit'
                    },
                    data: [
                        {
                            value,
                            name: title
                        }
                    ]
                }
            ]
        };

        const resizeObserver = new ResizeObserver(() => {
            chartRef.current && chartRef.current.resize()
        })
        chartContainerRef.current && resizeObserver.observe(chartContainerRef.current)
        chartRef.current.setOption(option)

        return () => {
            resizeObserver.disconnect()
            chartRef.current?.dispose()
        }
    }, [unit, title, width, height])

    return <div ref={chartContainerRef} style={{
        width: '100%', height: '100%'
    }}></div>
}

export default NumberGaugeChart
