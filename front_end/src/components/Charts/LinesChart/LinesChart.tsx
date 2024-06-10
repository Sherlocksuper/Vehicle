import * as echarts from "echarts"
import {useEffect, useMemo, useRef} from "react"
import {IChartInterface } from "@/components/Charts/interface.ts";
import {generateRandomData} from "@/components/Charts";
import {TEST_INTERNAL} from "@/constants";

interface ISeries {
    id: number
    name: string
    type: string
    stack: string
    symbol: string
    data: number[]
}

/**
 * 生成格式的random数据
 * @returns
 * 格式：{
 *     xAxis: '时间',
 *     data: {
 *     '信号1': 1,
 *     '信号2': 2,
 *     '信号3': 3,
 * }
 * data key的格式根据ISignalItem的id来决定
 * @param props
 */
const LinesChart: React.FC<IChartInterface> = (props) => {
    const {
        startRequest,
        requestSignals,
        sourceType,
        onReceiveData,
        historyData
    } = props

    const chartRef = useRef<echarts.ECharts | null>()
    const lineContainerRef = useRef<HTMLDivElement>(null)


    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const xAxis = useRef<string[]>([])
    const dataRef = useRef<ISeries[]>(requestSignals.map((item) => {
        return {
            id: item.signal.id,
            name: item.vehicleName + ' ' + item.projectName + ' ' + item.signal.signalName,
            type: 'line',
            stack: 'Total',
            symbol: 'none',
            data: []
        }
    }))

    const mockRandomData = () => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignals.length > 0) {
            timerRef.current = setInterval(() => {
                const data = generateRandomData(requestSignals)

                xAxis.current.push(data.xAxis)
                dataRef.current.forEach((item) => {
                    item.data.push(data.data[item.id])
                })
                const option = {
                    xAxis: {
                        data: xAxis.current
                    },
                    series: dataRef.current
                }

                onReceiveData(data)
                chartRef.current?.setOption(option)
            }, TEST_INTERNAL)
        }
        return () => {
            timerRef.current && clearInterval(timerRef.current)
        }
    }

    const mockHistoryData = () => {

    }

    useMemo(() => {
        if (!historyData) mockRandomData()
    }, [requestSignals.length])

    useEffect(() => {
        chartRef.current = echarts.init(lineContainerRef.current)
        const option = {
            dataZoom: [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    start: 1,
                    end: 100
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 1,
                    end: 100
                }
            ],
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: dataRef.current.map((item) => item.name)
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
                data: xAxis.current,
            },
            yAxis: {
                type: 'value'
            },
            series: []
        };
        const resizeObserver = new ResizeObserver(() => {
            chartRef.current && chartRef.current.resize()
        })
        lineContainerRef.current && resizeObserver.observe(lineContainerRef.current)
        chartRef.current?.setOption(option)

        return () => {
            resizeObserver.disconnect()
            chartRef.current?.dispose()
        }
    }, [])

    return <div ref={lineContainerRef} style={{
        width: '100%', height: '100%'
    }}></div>
}

export default LinesChart