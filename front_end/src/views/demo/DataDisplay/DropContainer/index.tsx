import "./index.css";
import {DragItemType} from "../display";
import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import LineChart from "@/components/Charts/LineChart";
import GridLayout from 'react-grid-layout';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React from "react";
import LinesChart from "@/components/Charts/LinesChart/LinesChart.tsx";
import {Input, Modal, Select} from "antd";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {IDragItem, ISignalItem, NewTestTemplateMode} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";

const DropContainer: React.FC<{
    banModify: boolean,
    items: IDragItem[],
    selectFunc: Function,
    selectedItemId: string | null,
    onLayoutChange: (layout: GridLayout.Layout[]) => void,
    updateDragItem: (id: string, itemConfig: IDragItem['itemConfig']) => void,

}> = ({banModify, items, selectFunc, onLayoutChange, updateDragItem}) => {


    const search = window.location.search
    const params = new URLSearchParams(search)
    const testProcessNRecord = params.get('testProcessNRecord')
    const mode: NewTestTemplateMode = params.get('model') as NewTestTemplateMode
    let testProcessN: ITestProcessN | null = null

    if (testProcessNRecord && mode) {
        console.log(testProcessNRecord)
        testProcessN = (JSON.parse(testProcessNRecord) as ITestProcessN)
    }

    const [openItemId, setOpenItemId] = React.useState<string | null>(null);

    return <div className="dc_container" onClick={() => selectFunc(null)}>
        <GridLayout cols={30} rowHeight={40} width={1500} className="layout" isDraggable={!banModify}
                    isResizable={!banModify}
                    onLayoutChange={onLayoutChange}
        >
            {
                items?.map((item) => {
                    return <div className="dc_item_container" id={item.id} key={item.id}
                                style={{border: '1px solid transparent'}}
                                data-grid={{
                                    ...item.itemConfig,
                                    w: item.itemConfig.width / 30,
                                    h: item.itemConfig.height / 30,
                                    i: item.id
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault()
                                    if (mode === NewTestTemplateMode.CONFIG) setOpenItemId(item.id)
                                }}
                    >
                        <UpdateItemModal item={item} setOpenItemId={setOpenItemId} open={item.id === openItemId}
                                         testProcessN={testProcessN}
                                         updateDragItem={updateDragItem}
                        />
                        <SetDragItem item={item} banModify={banModify}/>
                    </div>
                })
            }
        </GridLayout>
    </div>
}

interface IUpdateItemModal {
    item: IDragItem,
    open: boolean,
    setOpenItemId: Function,
    testProcessN: ITestProcessN | null,
    updateDragItem: (id: string, itemConfig: IDragItem['itemConfig']) => void
}

const UpdateItemModal: React.FC<IUpdateItemModal> = ({
                                                         item,
                                                         open,
                                                         setOpenItemId,
                                                         testProcessN,
                                                         updateDragItem
                                                     }) => {
    const getDefaultValue = (dragItem: IDragItem) => {
        return dragItem.itemConfig.requestSignals.map((signal) => {
            console.log("extra")
            return JSON.stringify({
                vehicleName: signal.vehicleName,
                projectName: signal.projectName,
                controller: signal.controller,
                collector: signal.collector,
                signal: signal.signal
            })
        })
    }

    return <Modal
        title={item.type + '-' + item.itemConfig.title + '-' + item.id.slice(0, 6)}
        open={open}
        onOk={() => {
            setOpenItemId(null)
        }}
        onCancel={() => setOpenItemId(null)}
        key={item.id}
    >
        <Input placeholder="标题" defaultValue={item.itemConfig.title} onChange={(e) => {
            updateDragItem(item.id, {
                ...item.itemConfig,
                title: e.target.value
            })
        }}/>
        <Select
            placeholder="采集信号选择"
            mode={item.type === DragItemType.LINES ? 'multiple' : undefined}
            style={{width: '100%'}}
            defaultValue={getDefaultValue(item)}
            onChange={(value) => {
                if (!Array.isArray(value)) {
                    value = [value]
                }
                const requestSignals = value.map((v: string) => JSON.parse(v) as ISignalItem)
                updateDragItem(item.id, {
                    ...item.itemConfig,
                    requestSignals
                })
                console.log(requestSignals)
            }}
        >
            {
                testProcessN?.testObjectNs.map((testObject) => {

                    return testObject.project.map((project) => {
                        return project.projectConfig.map((projectConfig) => {
                            return <Select.Option value={JSON.stringify({
                                vehicleName: testObject.vehicle.vehicleName,
                                projectName: project.projectName,
                                controller: projectConfig.controller,
                                collector: projectConfig.collector,
                                signal: projectConfig.signal
                            } as ISignalItem)}>{
                                testObject.vehicle.vehicleName + '-' + project.projectName + '-' + projectConfig.signal.signalName
                            }</Select.Option>
                        })
                    })
                    // return testObject.project.projectConfig.map((projectConfig) => {
                    //     return <Select.Option value={JSON.stringify({
                    //         vehicleName: testObject.vehicle.vehicleName,
                    //         projectName: testObject.project.projectName,
                    //         controller: projectConfig.controller,
                    //         collector: projectConfig.collector,
                    //         signal: projectConfig.signal
                    //     } as ISignalItem)}>{
                    //         testObject.vehicle.vehicleName + '-' + testObject.project.projectName + '-' + projectConfig.signal.signalName
                    //     }</Select.Option>
                    // })
                })
            }
        </Select>
    </Modal>
}

/**
 *
 * @param item
 * @param banModify
 * @constructor
 * 功能：根据不同的type返回不同的控件
 */
export const SetDragItem = ({item, banModify}: {
                         item: IDragItem
                         banModify: boolean
                     }
) => {
    const {
        id,
        type,
        itemConfig: {
            requestSignalId,
            requestSignals,
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
    } = item as IDragItem

    return {
        [DragItemType.LINES]: <LinesChart chartTitle={title} series={[]} xAxisData={[]}
                                          startRequest={banModify}/>,
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

    }[type]
}

export default DropContainer