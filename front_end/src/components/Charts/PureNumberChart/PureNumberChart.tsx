import React, {useCallback, useEffect,useState} from 'react'
import {IChartInterface} from "@/components/Charts/interface.ts";
import {ITimeData} from "@/views/demo/TestConfig/template.tsx";

const PureNumberChart: React.FC<IChartInterface> = (props) => {
    const {
        requestSignals,
        currentTestChartData,

        title,
        height,
        width,
    } = props

  const [map, setMap] = useState<Map<string, number>>(new Map<string, number>())

  const pushData = useCallback((data: Map<string, ITimeData[]>) => {
    if (data.size === 0) {
      return
    }
    if (!requestSignals || requestSignals.length === 0) {
      return;
    }

    Array.from(data.keys()).forEach((key) => {
      const value = data.get(key)
      if (value) {
        setMap((pre) => {
          pre.set(key, value[value.length - 1].value)
          return new Map(pre)
        })
      }
    })

  }, [requestSignals]);


    useEffect(() => {
        if (currentTestChartData) {
            pushData(currentTestChartData)
        }
    }, [currentTestChartData, pushData])



    return (
      <div className="bc_container" style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        // 根据width和height来设置字体大小
        fontSize: width && height ? Math.min(width, height) / 15 : "1em"
      }}>
        <div className='bc_title' style={{
          color: "#333",
          textAlign: "center",
          fontSize: "2em" // 标题大小随着视口宽度变化
        }}>
          {(title && title !== "") ? title : (requestSignals[0]?.name ?? "")}
        </div>
        <div style={{
          fontWeight: "bold",
          color: "#666",
          fontSize: "1em" // 文字大小随着视口宽度变化
        }}>
          {
            requestSignals.map((signal) => {
              return <div key={signal.id}>
                {signal.name}: {map.get(signal.id) || 0} : {signal.dimension}
              </div>
            })
          }
        </div>
      </div>
    )
}
export default PureNumberChart
