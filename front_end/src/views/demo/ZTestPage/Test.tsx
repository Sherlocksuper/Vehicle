import LinesChart from "@/components/Charts/LinesChart/LinesChart.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import LineChart from "@/components/Charts/LineChart";

interface IMyLinesChart {

}

const MyLinesChart = () => {

    const chartTitle = "Test Chart"
    const xAxisDataRef = useRef(['1', '2', '3', '4', '5', '6', '7'])
    const seriesRef = useRef([
        {
            name: "Email",
            type: "line",
            stack: "Total",
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: "Union Ads",
            type: "line",
            stack: "Total",
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: "Video Ads",
            type: "line",
            stack: "Total",
            data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
            name: "Direct",
            type: "line",
            stack: "Total",
            data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
            name: "Search Engine",
            type: "line",
            stack: "Total",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ])

    return <>
        <LinesChart chartTitle={chartTitle} xAxisData={xAxisDataRef.current} series={seriesRef.current}/>
    </>
}

export default MyLinesChart