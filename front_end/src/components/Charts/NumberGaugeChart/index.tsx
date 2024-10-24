import * as echarts from "echarts"
import {useCallback, useEffect, useRef, useState} from "react"
import {IChartInterface} from "@/components/Charts/interface.ts";
import {ITimeData} from "@/views/demo/TestConfig/template.tsx";

// 仪表盘图
const NumberGaugeChart: React.FC<IChartInterface> = (props, context) => {


  const chartRef = useRef<echarts.ECharts | null>()
  const chartContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    requestSignals,
    currentTestChartData,

    min,
    max,

    unit,
    title,
    width,
    height,
  } = props


  const pushData = useCallback((data: Map<string, ITimeData[]>) => {
    if (!requestSignals) {
      return
    }

    if (!requestSignals || requestSignals.length === 0) {
      return;
    }

    const value = data.get(requestSignals[0].id)

    if (!value) {
      return
    }

    // 如果value的最后一个和原有的最后一个一样，那么不更新
    if (value[value.length - 1].value === chartRef.current?.getOption()?.series[0].data[0].value ?? "undefined") {
      return
    }

    // 放到chartRef的current的option中
    chartRef.current?.setOption({
      series: [
        {
          min: min,
          max: max,
          splitNumber: 10,
          data: [
            {
              value: value[value.length - 1],
              // 如果有标题并且标题不为空字符串就显示标题，没有就显示信号名，没有信号名就显示空
              name: (title && title !== "") ? title : (requestSignals[0]?.name ?? "")
            }
          ]
        }
      ]
    });

  }, [requestSignals, title]);

  // 同步netWorkData
  useEffect(() => {
    if (currentTestChartData) {
      pushData(currentTestChartData)
    }
  }, [currentTestChartData, pushData])


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
            formatter: `{value} ${props?.requestSignals[0]?.dimension ?? "-"}`,
            color: 'inherit'
          },
          data: [
            {
              value: 0,
              name: (title && title !== "") ? title : (requestSignals[0]?.name ?? "")
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
  }, [unit, title, width, height, props.requestSignals])

  return <div ref={chartContainerRef} style={{
    width: '100%', height: '100%'
  }}></div>
}

export default NumberGaugeChart
