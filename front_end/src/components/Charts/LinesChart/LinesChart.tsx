import * as echarts from "echarts"
import {useCallback, useEffect, useRef} from "react"
import {IChartInterface} from "@/components/Charts/interface.ts";
import {ITimeData} from "@/views/demo/TestConfig/template.tsx";
import {mergeKArrays} from "@/utils";

interface ISeries {
  id: string
  name: string
  type: string
  symbol: string
  data: Array<number>[]
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
    requestSignals,
    currentTestChartData,
    windowSize
  } = props


  const chartRef = useRef<echarts.ECharts | null>()
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const xAxis = useRef<string[]>([])
  const dataRef = useRef<ISeries[]>(requestSignals.map((item, index) => {
    return {
      id: item.id,
      name: item.name,
      type: 'line',
      symbol: 'none',
      data: []
    }
  }))

  // 中值滤波
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const medianFilter = (arr: { time: number, value: number }[], windowSize: number | string) :Array<[number, number]> => {
    let window = typeof windowSize === "string" ? parseInt(windowSize) : windowSize;
    if (isNaN(window) || window <= 2) {
      return arr.map(item => [item.time,item.value])
    }
    if (window % 2 === 0) {
      window += 1;  // 确保窗口大小为奇数
    }

    if (!arr || arr.length === 0) return [];  // 处理空数组情况
    const result = [];
    const halfWindow = Math.floor(window / 2);

    for (let i = 0; i < arr.length; i++) {
      if (i < halfWindow || i >= arr.length - halfWindow) {
        result.push([arr[i].time, arr[i].value]);  // 边界处保持原值
      } else {
        const temp = arr.slice(i - halfWindow, i + halfWindow + 1).map(item => item.value);
        temp.sort((a, b) => a - b);  // 排序
        result.push([arr[i].time, temp[Math.floor(window / 2)]]);  // 获取中间值，格式为 [time, value]
      }
    }

    return result;
  };

  const pushData = useCallback((data: Map<string, ITimeData[]>) => {
    if (!requestSignals || requestSignals.length === 0) {
      return;
    }

    if (dataRef.current.length === 0) {
      requestSignals.forEach((item) => {
        dataRef.current.push({
          id: item.id,
          name: item.name + '/' + item.dimension,
          type: 'line',
          symbol: 'none',
          data: []
        });
      });
    }

    // 把每个信号的数据push到对应的dataRef中
    requestSignals.forEach((signal) => {
      const signalData = data.get(signal.id)
      if (signalData) {
        // TODO 在这里添加中值滤波
        dataRef.current.forEach((item) => {
          if (item.id === signal.id) {
            item.data = medianFilter(signalData, windowSize)
          }
        });
      }
    });

    // 合并时间
    const time = mergeKArrays(requestSignals.map((signal) => {
      return data.get(signal.id)?.map((item) => item.time) || []
    }))

    // Update chart options
    const option = {
      xAxis: {
        type: 'time',
        data: time
      },
      series: dataRef.current
    };
    chartRef.current?.setOption(option);
  }, [requestSignals]);

  const requestSignalIds = requestSignals.map((signal) => signal.id).join('');

  useEffect(() => {
    // 如果需要采集的信号变了,更新dataref，并且清空time
    let length = 0
    dataRef.current = requestSignals.map((item) => {
      length = currentTestChartData.get(item.id)?.length || 0
      return {
        id: item.id,
        name: (item.dimension === '/') ? item.name : (item.name + '/' + item.dimension),
        type: 'line',
        symbol: 'none',
        data: currentTestChartData.get(item.id)?.map((item) => [item.time, item.value]) || []
      }
    })
    // 截取时间 前length个
    xAxis.current = xAxis.current.slice(-length)

  }, [requestSignalIds])

  // 同步netWorkData
  useEffect(() => {
    if (currentTestChartData && !chartRef.current?.isDisposed()) {
      pushData(currentTestChartData)
    }
  }, [pushData, requestSignals, currentTestChartData])

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
        },
        {
          type: 'inside',
          orient: 'vertical',
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
  }, [requestSignals.length])

  return <div ref={chartContainerRef} style={{
    width: '100%', height: '100%'
  }}></div>
}

export default LinesChart
