import * as echarts from "echarts"
import {useEffect, useMemo, useRef} from "react"
import {Slider} from "antd";

interface ISeries {
    name: string
    type: string
    stack: string
    data: number[]
}

interface ILinesChart {
    chartTitle: string
    xAxisData: string[]
    series: ISeries[]
    startRequest: boolean
}


const LinesChart: React.FC<ILinesChart> = (props, context) => {
    const chartRef = useRef<echarts.ECharts | null>()
    const lineContainerRef = useRef<HTMLDivElement>(null)

    const interval = 1000
    const requestSignalId = 123

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const durationRef = useRef(30)
    const xAxis = useRef(['1', '2', '3', '4', '5', '6', '7'])
    const dataRef = useRef([
        {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: "Direct",
            type: "line",
            stack: "Total",
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ])

    useMemo(() => {
        timerRef.current && clearInterval(timerRef.current)
        if (props.startRequest && requestSignalId !== null) {
            timerRef.current = setInterval(() => {
                const nowTime = new Date().toString()
                xAxis.current.push(nowTime)

                dataRef.current.forEach(i => {
                    i.data.push(Math.random() * 1000)
                })

                chartRef.current?.setOption({
                    xAxis: {
                        data: xAxis.current
                    },
                    series: dataRef.current.map(i => ({
                        name: i.name,
                        type: 'line',
                        stack: 'Total',
                        symbol: 'none',
                        data: i.data,
                    }))
                });

            }, interval)
        }
    }, [props.startRequest, interval, durationRef.current])

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
            title: {
                text: props.chartTitle
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: props.series.map(i => i.name)
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
            series: props.series.map(i => ({
                name: i.name,
                type: 'line',
                stack: 'Total',
                symbol: 'none',
                data: i.data,
            }))
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
    }, [props.chartTitle])

    return <div ref={lineContainerRef} style={{
        width: '100%', height: '100%'
    }}></div>
}

export default LinesChart