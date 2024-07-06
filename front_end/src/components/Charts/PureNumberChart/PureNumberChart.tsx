import React, {useMemo, useRef, useState} from 'react'
import {IChartInterface} from "@/components/Charts/interface.ts";
import {generateRandomData, mockHistoryData} from "@/components/Charts";
import {TEST_INTERNAL} from "@/constants";
import {IHistoryItemData} from "@/apis/standard/history.ts";

const PureNumberChart: React.FC<IChartInterface> = (props) => {
    const {
        startRequest,
        requestSignals,
        sourceType,
        onReceiveData,
        historyData,

        title,
    } = props
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [value, setValue] = useState<number>(0)

    const pushData = (data: IHistoryItemData) => {
        console.log(data.data[requestSignals[0].signal.id])
        setValue(data.data[requestSignals[0].signal.id])
    }

    const mockRandomData = () => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignals.length > 0) {
            timerRef.current = setInterval(() => {
                const data = generateRandomData(requestSignals)
                onReceiveData(data)
                pushData(data)
            }, TEST_INTERNAL)
        }
    }


    useMemo(() => {
        if (!historyData) {
            mockRandomData()
            return
        }
        const getFileData = mockHistoryData(0, pushData, historyData!)
        getFileData(0)
    }, [startRequest, requestSignals])


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