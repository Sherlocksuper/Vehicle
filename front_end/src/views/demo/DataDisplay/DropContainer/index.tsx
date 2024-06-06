import "./index.css";
import {DragItemType, IDragItem} from "../display";
import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import LineChart from "@/components/Charts/LineChart";
import GridLayout from 'react-grid-layout';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React from "react";
import LinesChart from "@/components/Charts/LinesChart/LinesChart.tsx";

const DropContainer: React.FC<{
    banModify: boolean,
    items: IDragItem[],
    selectFunc: Function,
    selectedItemId: string | null,
    onUpdateItems: (items: GridLayout.Layout) => void
    onLayoutChange: (layout: GridLayout.Layout[]) => void
}> = ({banModify, items, selectFunc, selectedItemId, onUpdateItems, onLayoutChange}) => {


    return <div className="dc_container" onClick={() => selectFunc(null)}>
        <GridLayout cols={30} rowHeight={40} width={1200} className="layout" isDraggable={!banModify}
                    isResizable={!banModify}
                    onLayoutChange={layout => {onLayoutChange(layout)}}
                    margin={[10, 10]}
                    containerPadding={[10, 10]}

        >
            {
                items?.map((item) => {
                    const {
                        id,
                        type,
                        itemConfig: {
                            requestSignalId,
                            x,
                            y,
                            width,
                            height,
                            title,
                            trueLabel,
                            falseLabel,
                            interval,
                            unit,
                            min,
                            max,
                            during,
                            label
                        }
                    } = item


                    return <div className="dc_item_container" id={id} key={id}
                                style={{border: selectedItemId === id ? '1px solid #1677ff' : '1px solid transparent'}}
                                data-grid={{x: x, y: y, w: width / 30, h: height / 30, i: id}}
                    >
                        {
                            {
                                [DragItemType.NUMBER]: <NumberGaugeChart startRequest={banModify}
                                                                         requestSignalId={requestSignalId}
                                                                         unit={unit || ''} title={title}
                                                                         width={width}
                                                                         height={height} interval={interval}
                                                                         min={min || 0} max={max || 100}/>,
                                [DragItemType.BOOLEAN]: <BooleanChart startRequest={banModify}
                                                                      requestSignalId={requestSignalId}
                                                                      trueLabel={trueLabel || '是'}
                                                                      falseLabel={falseLabel || '否'} title={title}
                                                                      width={width} height={height}
                                                                      interval={interval}/>,
                                [DragItemType.LINE]: <LineChart label={label || '数值'}
                                                                startRequest={banModify}
                                                                requestSignalId={requestSignalId} title={title}
                                                                width={width} height={height} interval={interval}
                                                                during={during || 1}/>,
                                [DragItemType.LINES]: <LinesChart chartTitle={title} series={[]} xAxisData={[]}
                                                                  startRequest={banModify}/>,
                            }[type]

                        }
                    </div>
                })
            }
        </GridLayout>
    </div>
}

export default DropContainer