import "./index.css";
import {DragItemType} from "../display";
import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import GridLayout from 'react-grid-layout';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React from "react";
import LinesChart from "@/components/Charts/LinesChart/LinesChart.tsx";
import {Input, Modal, Select} from "antd";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {IDragItem, ISignalItem, NewTestTemplateMode} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";
import {DataSourceType} from "@/components/Charts/interface.ts";
import {DEFAULT_TITLE} from "@/constants";

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
                })
            }
        </Select>
    </Modal>
}

/**
 *
 * @param item
 * @param banModify
 * @param iSignalItems
 * @constructor
 * 功能：根据不同的type返回不同的控件
 */
export const SetDragItem = ({item, banModify}: {
                                item: IDragItem
                                banModify: boolean
                            }
) => {
    const {
        type,
        itemConfig: {
            requestSignalId,
            requestSignals,
            width,
            height,
            title,
            trueLabel,
            falseLabel,
            unit,
            min,
            max,
        }
    } = item as IDragItem

    if (title === DEFAULT_TITLE && banModify) {
    }



    return {
        [DragItemType.LINES]: <LinesChart startRequest={banModify}
                                          requestSignalId={requestSignalId}
                                          requestSignals={requestSignals || []}
                                          sourceType={DataSourceType.RANDOM}

                                          title={title}
                                          width={width}
                                          height={height}
        />,
        [DragItemType.NUMBER]: <NumberGaugeChart startRequest={banModify}
                                                 requestSignalId={requestSignalId}
                                                 requestSignals={requestSignals || []}
                                                 sourceType={DataSourceType.RANDOM}

                                                 title={title}
                                                 unit={unit || ''}
                                                 min={min || 0} max={max || 100}
                                                 width={width} height={height}
        />,
        [DragItemType.BOOLEAN]: <BooleanChart startRequest={banModify}
                                              requestSignalId={requestSignalId}
                                              requestSignals={requestSignals || []}
                                              sourceType={DataSourceType.RANDOM}

                                              title={title}
                                              trueLabel={trueLabel || '是'}
                                              falseLabel={falseLabel || '否'}
                                              width={width} height={height}
        />,
    }[type]
}

export default DropContainer