import {useCallback, useEffect, useState} from 'react'
import './index.css'
import {IChartInterface} from "@/components/Charts/interface.ts";

const BooleanChart: React.FC<IChartInterface> = (props) => {
    const {
        requestSignals,
        currentTestChartData,
        trueLabel,
        falseLabel,
        title,
    } = props
    const [value, setValue] = useState(false)

    const pushData = useCallback((data: Map<string, number[]>) => {
        if (!requestSignals){
            return
        }
        if (!data) {
            setValue(false)
            return
        }
        if (!requestSignals || requestSignals.length === 0) {
            return;
        }
        const signal = requestSignals[0]
        const signalData = data.get(signal.id)
        if (signalData) {
            setValue(signalData[signalData.length - 1] > 50)
        }
    }, [requestSignals]);

    // 同步netWorkData
    useEffect(() => {
        if (currentTestChartData) {
            pushData(currentTestChartData)
        }
    }, [currentTestChartData, pushData])


    return <div className="bc_container" style={{
        width: "100%",
        height: "100%",
    }}>
        <div className='bc_title'>{title}</div>
        <div className="bc_result" style={{backgroundColor: value ? '#52c41a' : '#f5222d'}}>
            {value ? trueLabel : falseLabel}
        </div>
    </div>
}
export default BooleanChart
