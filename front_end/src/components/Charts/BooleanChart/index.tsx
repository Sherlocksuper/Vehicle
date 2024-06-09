import {useMemo, useRef, useState} from 'react'
import './index.css'
import {IChartInterface} from "@/components/Charts/interface.ts";
import {generateRandomData} from "@/components/Charts";
import {TEST_INTERNAL} from "@/constants";

const BooleanChart: React.FC<IChartInterface> = (props) => {
    const {
        startRequest,
        requestSignals,
        sourceType,
        onReceiveData,

        trueLabel,
        falseLabel,
        title,
    } = props
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useMemo(() => {
        timerRef.current && clearInterval(timerRef.current)
        if (startRequest && requestSignals.length > 0) {
            timerRef.current = setInterval(() => {
                const data = generateRandomData(requestSignals)

                onReceiveData(data)
                setValue(data.data[requestSignals[0].signal.id] > 0.5)
            }, TEST_INTERNAL)
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