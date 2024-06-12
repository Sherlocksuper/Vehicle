/**
 * @file NewTestTemplate.tsx
 * @desc NewTestTemplate Page
 */
import React, {FC, useEffect, useRef, useState} from 'react';
import {useDrop} from 'react-dnd';
import DraggableComponent, {
    IBooleanChartExtra,
    IDraggleComponent,
    INumberChartExtra
} from "@/views/demo/DataDisplay/DraggableComponent";
import DropContainer from "@/views/demo/DataDisplay/DropContainer";
import {Button, Input, message, Modal} from "antd";
import {ITemplate, ITemplateItem} from "@/apis/standard/template.ts";
import TextArea from "antd/es/input/TextArea";
import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import GridLayout from "react-grid-layout";
import {createTestTemplate} from "@/apis/request/template.ts";
import {DEFAULT_TITLE, SUCCESS_CODE} from "@/constants";
import {v4 as uuidv4} from 'uuid';
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {ICollectorsConfigItem, IControllersConfigItem, ISignalsConfigItem} from "@/views/demo/Topology/PhyTopology.tsx";
import {updateProcessN} from "@/apis/request/testProcessN.ts";
import {deleteUndefined, transferToDragItems} from "@/utils";
import {PROCESS_CLOSE_HINT} from "@/constants/process_hint.ts";
import {IHistory, IHistoryItemData, ITemplateData} from "@/apis/standard/history.ts";
import {getFileToHistoryWorker, getHistoryToFileWorker} from "@/worker/app.ts";
import {addTestsHistory} from "@/apis/request/testhistory.ts";

/**
 * 新建template的modal
 */


/**
 * @enum NewTestTemplateMode
 * @desc
 * ADD: 新建
 * SHOW: 展示
 * CONFIG:配置数据关联关系
 */
//模式
export enum NewTestTemplateMode {
    ADD = 'ADD',
    SHOW = 'SHOW',
    CONFIG = 'CONFIG'
}

export interface IDragItem {
    id: string
    type: DragItemType,
    itemConfig: {
        requestSignalId: number | null
        requestSignals: ISignalItem[]
        x: number,
        y: number,
        width: number
        height: number
        title: string
        interval: number
        trueLabel?: string
        falseLabel?: string
        unit?: string
        during?: number
        min?: number
        max?: number
        label?: string
    }
}

/**
 * label: string,
 */
export interface ISignalItem {
    vehicleName: string
    projectName: string
    controller: IControllersConfigItem
    collector: ICollectorsConfigItem
    signal: ISignalsConfigItem
}

const ConfigTestTemplate: React.FC = () => {
    const [mode, setMode] = useState<NewTestTemplateMode>(NewTestTemplateMode.ADD)
    const [testProcessN, setTestProcessN] = useState<ITestProcessN | null>(null)

    const ref = useRef<HTMLDivElement>(null)
    const [dragItems, setDragItems] = useState<IDragItem[]>([])

    const [name, setName] = useState("默认名称")
    const [description, setDescription] = useState("默认描述")

    const [history, setHistory] = useState<IHistory>({
        historyName: '默认名称',
        configName: '默认名称',
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

    const initHistoryByTestProcessN = (testProcessN: ITestProcessN) => {
        const newHistory = {...history} as IHistory
        newHistory.configName = testProcessN.testName
        newHistory.template = testProcessN.template
        testProcessN.template.itemsConfig.forEach((item) => {
            const templateData: ITemplateData = {
                templateItemId: item.id!,
                data: []
            }
            newHistory.historyData.push(templateData)
        })
        setHistory(newHistory)
    }

    useEffect(() => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const testProcessNRecord = params.get('testProcessNRecord')

        if (testProcessNRecord && params.get('model')) {
            const testProcess = JSON.parse(testProcessNRecord) as ITestProcessN
            initHistoryByTestProcessN(testProcess)


            setTestProcessN(testProcess)


            setName(testProcess.template.name)
            setDescription(testProcess.template.description)
            setDragItems(transferToDragItems(testProcess.template))
            setMode(params.get('model') as NewTestTemplateMode)
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

    const transferToTestProcessN = (dragItems: IDragItem[]): ITestProcessN => {
        const newTestProcessN = {...testProcessN} as ITestProcessN
        newTestProcessN.template = {
            id: testProcessN?.template.id || undefined,
            name: name,
            description: description,
            createdAt: testProcessN?.template.createdAt || new Date(),
            updatedAt: new Date(),
            itemsConfig: dragItems.map((item) => {
                const newItem: ITemplateItem = {
                    id: item.id,
                    type: item.type,
                    ...item.itemConfig
                }
                return newItem
            })
        }

        deleteUndefined(newTestProcessN)

        return newTestProcessN
    }

    function renderADDModeInfo() {
        return <>
            <DraggableComponent type={DragItemType.BOOLEAN} draggleConfig={{
                defaultTitle: DEFAULT_TITLE,
                defaultX: 0,
                defaultY: 0,
                defaultWidth: 100,
                defaultHeight: 100,
                defaultInterval: 1000,
                extra: {
                    defaultTrueLabel: '是',
                    defaultFalseLabel: '否',
                }
            }}/>
            <DraggableComponent type={DragItemType.NUMBER} draggleConfig={{
                defaultTitle: DEFAULT_TITLE,
                defaultX: 0,
                defaultY: 0,
                defaultWidth: 300,
                defaultHeight: 300,
                defaultInterval: 1000,
                extra: {
                    defaultUnit: '单位',
                    defaultMin: 0,
                    defaultMax: 100,
                }
            }}/>
            <DraggableComponent type={DragItemType.LINES} draggleConfig={{
                defaultTitle: DEFAULT_TITLE,
                defaultX: 0,
                defaultY: 0,
                defaultWidth: 400,
                defaultHeight: 400,
                defaultInterval: 1000,
                extra: {
                    defaultDuring: 10,  // 10s
                    defaultLabel: '数值'
                }
            }}/>
        </>
    }

    function updateDragItem(id: string, itemConfig: IDragItem['itemConfig']) {
        if (mode === NewTestTemplateMode.SHOW) {
            message.error('展示模式下不允许修改')
            return
        }
        setDragItems(dragItems.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    itemConfig: {
                        ...item.itemConfig,
                        ...itemConfig
                    }
                }
            }
            return item
        }))
    }

    function updateAllByLayout(layout: GridLayout.Layout[]) {
        if (mode === NewTestTemplateMode.SHOW) {
            message.error('展示模式下不允许修改')
            return
        }

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

    const renderManageButton = () => {
        const downCurrentDataFile = () => {
            const webWorker = getHistoryToFileWorker()
            webWorker.postMessage(history)

            webWorker.onmessage = (event) => {
                const file = event.data as File
                const url = window.URL.createObjectURL(file)
                const a = document.createElement('a')
                a.href = url
                a.download = 'data.json'
                a.click()
                window.URL.revokeObjectURL(url)

                addTestsHistory({
                    file: file,
                    fatherConfigName: testProcessN?.testName || '默认名称'
                }).then((res) => {
                    if (res.code === SUCCESS_CODE) message.success("已保存历史记录")
                });

                setOnload(false)
            }
        }
        const [onload, setOnload] = useState(false)

        return <div style={{
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
            position: "absolute",
            top: 0,
            right: 0,
        }}>
            {
                mode === NewTestTemplateMode.ADD &&
              <div className="dd_info">
                  {renderADDModeInfo()}
                <ButtonModal dragItems={dragItems} name={name} description={description}
                             updateDescription={setDescription}
                             updateName={setName}
                             mode={mode}
                />
              </div>
            }
            {
                mode === NewTestTemplateMode.CONFIG &&
              <Button onClick={() => {
                  const newTestProcessN = transferToTestProcessN(dragItems)
                  updateProcessN(testProcessN?.id!, newTestProcessN).then((res) => {
                      if (res.code === SUCCESS_CODE) {
                          message.success('更新成功')
                      } else {
                          message.error('更新失败')
                      }
                  })
              }}>确定更改配置</Button>
            }
            {
                mode === NewTestTemplateMode.SHOW &&
              <Button onClick={() => {
                  if (!confirm(PROCESS_CLOSE_HINT)) return
                  window.close()
              }}>关闭</Button>
            }
            {
                mode === NewTestTemplateMode.SHOW &&
              <Button onClick={() => {
                  setOnload(true)
                  downCurrentDataFile()
              }} loading={onload}>导出当前记录</Button>
            }
        </div>
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
                        banModify={mode === NewTestTemplateMode.SHOW || mode === NewTestTemplateMode.CONFIG}
                        items={dragItems}

                        onLayoutChange={updateAllByLayout}
                        updateDragItem={updateDragItem}
                        onReceiveData={onReceiveData}
                    />
                </div>
                {renderManageButton()}
            </div>
        </div>
    );
};

export default ConfigTestTemplate;

interface IButtonModalProps {
    dragItems: IDragItem[]
    name: string
    description: string
    updateName: (name: string) => void
    updateDescription: (name: string) => void
    mode: NewTestTemplateMode
}

const ButtonModal: FC<IButtonModalProps> = (props) => {
    const {dragItems, name, description, updateName, updateDescription, mode} = props
    const [visible, setVisible] = useState(false);

    const newTemplate = (template: ITemplate) => {
        createTestTemplate(template)
            .then((res) => {
                if (res.code === SUCCESS_CODE) {
                    console.log(res)
                    if (window.confirm('创建成功，是否退出创建页面')) {
                        window.close()
                    } else {
                        window.location.reload()
                    }
                } else {
                    console.log('创建失败,请重试')
                }
            })
    }

    const transferToTemplate = (dragItems: IDragItem[]): ITemplate => {
        const name = '默认标题'
        const description = '默认模板'

        return {
            name: name,
            description: description,
            createdAt: new Date(),
            updatedAt: new Date(),
            itemsConfig: [
                ...dragItems.map((item) => {
                    const newItem: ITemplateItem = {
                        id: uuidv4(),
                        type: item.type,
                        ...item.itemConfig
                    }
                    return newItem
                })
            ]
        }
    }

    const handleOk = () => {
        if (name === '' || description === '') {
            message.error('请输入模板名称和描述')
            return
        }
        const targetTemplate = transferToTemplate(dragItems)
        targetTemplate.name = name
        targetTemplate.description = description
        targetTemplate.createdAt = new Date()
        targetTemplate.updatedAt = new Date()
        newTemplate(targetTemplate)
        setVisible(false);
    };

    return (
        <>
            {
                mode !== NewTestTemplateMode.SHOW &&
              <Button type="primary" onClick={() => setVisible(true)}>
                确认
              </Button>
            }
            <p>名称：{name}</p>
            <p>描述：{description}</p>
            <Modal
                title="请输入模板名称和描述"
                open={visible}
                onOk={handleOk}
                onCancel={() => setVisible(false)}
            >
                <Input placeholder="请输入该模板名称" value={name} onChange={(e) => {
                    updateName(e.target.value)
                }}/>
                <TextArea placeholder="请输入该模板描述" value={description} onChange={(e) => {
                    updateDescription(e.target.value)
                }} style={{
                    marginTop: 10
                }}/>
            </Modal>
        </>
    );
}