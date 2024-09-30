import React, {useCallback, useEffect,useState} from 'react'
import {IChartInterface} from "@/components/Charts/interface.ts";

const PureNumberChart: React.FC<IChartInterface> = (props) => {
    const {
        requestSignals,
        currentTestChartData,

        title,
    } = props

  const [map, setMap] = useState<Map<string, number>>(new Map<string, number>())

  const pushData = useCallback((data: Map<string, number[]>) => {
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
          pre.set(key, value[value.length - 1])
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
        }}>
            <div className='bc_title' style={{
                fontSize: "16px",
                color: "#333",
                textAlign: "center",
            }}>
                {title}
            </div>
            <div style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#666",
            }}>
              {
                requestSignals.map((signal) => {
                  return <div key={signal.id}>
                    {signal.belongVehicle} :{signal.name}: {signal.dimension}: {map.get(signal.id) || 0}
                  </div>
                })
              }
            </div>
        </div>
    )
}
export default PureNumberChart
