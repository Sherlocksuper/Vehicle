import * as echarts from "echarts"
import {useCallback, useEffect, useRef} from "react"
import {IChartInterface} from "@/components/Charts/interface.ts";

interface ISeries {
  id: string
  name: string
  type: string
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
  const medianFilter = (arr, windowSize) => {
    if (!arr) return []
    const padSize = Math.floor(windowSize / 2);
    const paddedArr = [...Array(padSize).fill(arr[0]), ...arr, ...Array(padSize).fill(arr[arr.length - 1])];
    const result = [];

    for (let i = padSize; i < paddedArr.length - padSize; i++) {
      const window = paddedArr.slice(i - padSize, i + padSize + 1);
      window.sort((a, b) => a - b);
      const median = window[Math.floor(window.length / 2)];
      result.push(median);
    }

    return result;
  }

  const pushData = useCallback((data: Map<string, number[]>) => {
    if (!requestSignals || requestSignals.length === 0) {
      return;
    }

    const getCurrentTime = (time?: number) => {
      if (!time) return new Date().getTime()
      return new Date(time).getTime()
    }

    // Check if it's the first time initializing the chart data
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

    // Add current time to the x-axis
    xAxis.current.push(new Date(getCurrentTime()).toLocaleTimeString());

    // Iterate through each series in dataRef
    dataRef.current.forEach((seriesItem, index) => {
      let signalData = data.get(seriesItem.id); // Get data for this particular signal
      let ws = windowSize;
      if (typeof ws === "string") {
        ws = parseInt(ws)
        //如果是NaN
        if (isNaN(ws)) {
          ws = 0
        } else {
          if (ws % 2 === 0) ws += 1; // Ensure window size is odd
        }
      }

      if (windowSize && windowSize >= 2) {
        signalData = medianFilter(signalData, ws); // Apply median filter to the data
      }
      const lastExistingValue = seriesItem.data[seriesItem.data.length - 1]; // Last value in the chart series

      // Only update the data for this signal if it's changed
      if (signalData && signalData[signalData.length - 1] !== lastExistingValue) {
        const newValue = signalData[signalData.length - 1] || 0;
        seriesItem.data.push(newValue);
      } else {
        // Keep the last value in case there's no update for this signal
        seriesItem.data.push(lastExistingValue || 0);
      }
    });

    // Update chart options
    const option = {
      xAxis: {
        data: xAxis.current
      },
      // yAxis: {
      //   minInterval: 0.01, // 设置较小的最小间隔，以提高精度
      // },
      series: dataRef.current
    };
    // console.log(option.series)
    chartRef.current?.setOption(option);
  }, [requestSignals]);

  const requestSignalIds = requestSignals.map((signal) => signal.id).join('');

  useEffect(() => {
    // 如果需要采集的信号变了,更新dataref，并且清空time
    let length = 0
    dataRef.current = requestSignals.map((item, index) => {
      length = currentTestChartData.get(item.id)?.length || 0
      return {
        id: item.id,
        name: (item.dimension === '/') ? item.name : (item.name + '/' + item.dimension),
        type: 'line',
        symbol: 'none',
        data: currentTestChartData.get(item.id) || []
      }
    })
    // 截取时间 前length个
    xAxis.current = xAxis.current.slice(-length)

  }, [requestSignalIds])

  // 只有存在展示的信息发生变化的时候才更新
  const updateFlag = requestSignals.map((signal) => {
    if (currentTestChartData.has(signal.id)) {
      return currentTestChartData.get(signal.id).length
    }
    return 0
  }).reduce((prev, curr) => prev + curr, 0)

  // 同步netWorkData
  useEffect(() => {
    if (currentTestChartData && !chartRef.current?.isDisposed()) {
      pushData(currentTestChartData)
    }
  }, [updateFlag, pushData, requestSignals])

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
