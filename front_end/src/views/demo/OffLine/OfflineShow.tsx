import React, {useEffect, useRef, useState} from "react";
import {IHistory, IHistoryItemData, ITemplateData} from "@/apis/standard/history.ts";
import {useDrop} from "react-dnd";
import {
    IBooleanChartExtra,
    IDraggleComponent,
    INumberChartExtra
} from "@/views/demo/DataDisplay/DraggableComponent";
import GridLayout from "react-grid-layout";
import DropContainer from "@/views/demo/DataDisplay/DropContainer";
import {IDragItem, NewTestTemplateMode} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import {transferToDragItems} from "@/utils";
import {getFileToHistoryWorker} from "@/worker/app.ts";


const OfflineShow: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null)
    const [dragItems, setDragItems] = useState<IDragItem[]>([])

    const [history, setHistory] = useState<IHistory>({
        configName: '默认配置',
        startTime: Date.now(),
        endTime: Date.now(),
        template: {
            name: '默认模板',
            description: '默认描述',
            createdAt: new Date(),
            updatedAt: new Date(),
            itemsConfig: []
        },
        historyData: []
    })

    useEffect(() => {
        const messageHandler = (event: MessageEvent<any>) => {
            if (!(event.data instanceof File)) return

            const file = event.data
            const worker = getFileToHistoryWorker()
            worker.onmessage = (event: MessageEvent<IHistory>) => {
                const history = event.data
                setHistory(history)
                setDragItems(transferToDragItems(history.template))
            }
            worker.postMessage(file)
        }

        window.addEventListener('message', messageHandler)

        return () => {
            window.removeEventListener('message', messageHandler)
        }
    }, [])

    const [, drop] = useDrop<{ id: string } & IDraggleComponent>({
        accept: 'box',
        drop({
                 id,
                 type,
                 draggleConfig: {defaultX, defaultY, defaultHeight, defaultWidth, defaultTitle, defaultInterval, extra}
             }) {
            const itemConfig: IDragItem['itemConfig'] = {
                requestSignalId: null,
                requestSignals: [],
                x: defaultX,
                y: defaultY,
                width: defaultWidth,
                height: defaultHeight,
                title: defaultTitle,
                interval: defaultInterval,
            }
            switch (type) {
                case DragItemType.BOOLEAN:
                    itemConfig['trueLabel'] = (extra as IBooleanChartExtra).defaultTrueLabel
                    itemConfig['falseLabel'] = (extra as IBooleanChartExtra).defaultFalseLabel
                    break
                case DragItemType.NUMBER:
                    itemConfig['unit'] = (extra as INumberChartExtra).defaultUnit
                    itemConfig['min'] = (extra as INumberChartExtra).defaultMin
                    itemConfig['max'] = (extra as INumberChartExtra).defaultMax
                    break
            }
            setDragItems([...dragItems, {
                id,
                type,
                itemConfig: {...itemConfig}
            }])
        }
    })
    drop(ref)

    function updateAllByLayout(layout: GridLayout.Layout[]) {
        setDragItems(dragItems.map((item) => {
            const newItem = layout.find((newItem) => newItem.i === item.id)
            if (newItem) {
                return {
                    ...item,
                    itemConfig: {
                        ...item.itemConfig,
                        width: newItem.w * 30,
                        height: newItem.h * 30,
                        x: newItem.x,
                        y: newItem.y
                    }
                }
            }
            return item
        }))
    }

    const onReceiveData = (templateId: string, data: IHistoryItemData) => {
        const newHistory = {...history} as IHistory
        for (let i = 0; i < history.historyData.length; i++) {
            if (newHistory.historyData[i].templateItemId === templateId) {
                newHistory.historyData[i].data.push(data)
                break
            }
        }
        setHistory(newHistory)
    }

    return (
        <div className='dd_container' style={{
            backgroundColor: '#f8f8f8',
            backgroundImage: 'linear-gradient(#e2e2e2 1px, transparent 1px), linear-gradient(90deg, #e2e2e2 1px, transparent 1px)'
        }}>
            <div className="dd_body">
                <div className="dd_drop_container" ref={ref}>
                    <DropContainer
                        banModify={true}
                        items={dragItems}

                        onLayoutChange={updateAllByLayout}
                        updateDragItem={(newItem) => {
                        }}
                        onReceiveData={onReceiveData}
                        fileHistory={history}
                    />
                </div>
            </div>
        </div>
    );
};

export default OfflineShow;