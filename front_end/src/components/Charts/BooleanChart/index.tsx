import {useMemo, useRef, useState} from 'react'
import './index.css'
import {IChartInterface} from "@/components/Charts/interface.ts";
import {generateRandomData} from "@/components/Charts";

const BooleanChart: React.FC<IChartInterface> = ({
                                                     startRequest,
                                                     requestSignals,
                                                     sourceType,

                                                     trueLabel,
                                                     falseLabel,
                                                     title,
                                                 }) => {

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useMemo(() => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignals.length > 0) {
            timerRef.current = setInterval(() => {
                const data = generateRandomData(requestSignals)
                setValue(data.data[requestSignals[0].signal.id] > 0.5)
            }, 1000)
        }
    }, [startRequest, requestSignals])

    const [value, setValue] = useState(false)

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