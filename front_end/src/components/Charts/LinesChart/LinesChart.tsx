import * as echarts from "echarts"
import {useEffect, useMemo, useRef} from "react"
import {IChartInterface} from "@/components/Charts/interface.ts";
import {generateRandomData, mockHistoryData} from "@/components/Charts";
import {TEST_INTERNAL} from "@/constants";
import {IHistoryItemData} from "@/apis/standard/history.ts";

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
        onReceiveData,
        historyData
    } = props

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const chartRef = useRef<echarts.ECharts | null>()
    const chartContainerRef = useRef<HTMLDivElement>(null)

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

    const pushData = (data: IHistoryItemData) => {
        xAxis.current.push(new Date(data.xAxis).toLocaleTimeString())
        dataRef.current.forEach((item) => {
            item.data.push(data.data[item.id])
        })
        const option = {
            xAxis: {
                data: xAxis.current
            },
            series: dataRef.current
        }
        chartRef.current?.setOption(option)
    }

    const mockRandomData = () => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignals.length > 0) {
            timerRef.current = setInterval(() => {
                const data = generateRandomData(requestSignals)
                pushData(data)
                onReceiveData(data)
            }, TEST_INTERNAL)
        }
        return () => {
            timerRef.current && clearInterval(timerRef.current)
        }
    }


    useMemo(() => {
        if (!historyData) mockRandomData()
        const getFileData = mockHistoryData(0, pushData, historyData!)
        getFileData(0)
    }, [requestSignals.length])

    useEffect(() => {
        chartRef.current = echarts.init(chartContainerRef.current)
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
        chartContainerRef.current && resizeObserver.observe(chartContainerRef.current)
        chartRef.current?.setOption(option)

        return () => {
            resizeObserver.disconnect()
            chartRef.current?.dispose()
        }
    }, [])

    return <div ref={chartContainerRef} style={{
        width: '100%', height: '100%'
    }}></div>
}

export default LinesChart