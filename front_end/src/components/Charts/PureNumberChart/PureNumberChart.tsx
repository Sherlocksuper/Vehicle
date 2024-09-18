import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {IChartInterface} from "@/components/Charts/interface.ts";

const PureNumberChart: React.FC<IChartInterface> = (props) => {
    const {
        requestSignals,
        currentTestChartData,

        title,
    } = props
    const [value, setValue] = useState<number>(0)

  const pushData = useCallback((data: Map<string, number[]>) => {
    if (!requestSignals){
      return
    }

    if (!data) {
      setValue(-1)
      return
    }
    if (!requestSignals || requestSignals.length === 0) {
      return;
    }
    if (value === data.get(requestSignals[0].id)![ data.get(requestSignals[0].id)!.length - 1 ]) {
      return
    }

    setValue(data.get(requestSignals[0].id)![ data.get(requestSignals[0].id)!.length - 1 ])
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
                {value}
            </div>
        </div>
    )
}
export default PureNumberChart
