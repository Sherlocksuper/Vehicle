/**
 * @file NewTestTemplate.tsx
 * @desc NewTestTemplate Page
 */
import React, {FC, useEffect, useRef, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {useDrop} from 'react-dnd';
import GridLayout from "react-grid-layout";
import DraggableComponent, {
    IBooleanChartExtra,
    IDraggleComponent,
    ILineChartExtra,
    INumberChartExtra
} from "@/views/demo/DataDisplay/DraggableComponent";
import DropContainer from "@/views/demo/DataDisplay/DropContainer";
import {Button, Input, message, Modal} from "antd";
import {ITemplate, ITemplateItem} from "@/apis/standard/template.ts";
import {createTestTemplate} from "@/apis/request/template.ts";
import {SUCCESS_CODE} from "@/constants";
import TextArea from "antd/es/input/TextArea";

export enum DragItemType {
    BOOLEAN = 'BOOLEAN',
    LINE = 'LINE',
    NUMBER = 'NUMBER',
}

//模式
export enum NewTestTemplateMode {
    ADD = 'ADD',
    EDIT = 'EDIT',
    SHOW = 'SHOW'
}

export interface IDragItem {
    id: string
    type: DragItemType,
    itemConfig: {
        requestSignalId: number | null
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


const NewTestTemplate: React.FC = () => {

    const ref = useRef<HTMLDivElement>(null)
    const [dragItems, setDragItems] = useState<IDragItem[]>([])
    const [mode, setMode] = useState<NewTestTemplateMode>(NewTestTemplateMode.ADD)
    const [name, setName] = useState("默认名称")
    const [description, setDescription] = useState("默认描述")

    useEffect(() => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const templateRecord = params.get('templateRecord')
        const mode = params.get('model')

        if (templateRecord && mode) {
            const template: ITemplate = JSON.parse(templateRecord)
            console.log(transferToDragItems(template))
            const dragItems = transferToDragItems(template)
            setDragItems(dragItems)
            setName(template.name)
            setDescription(template.description)
            setMode(mode as NewTestTemplateMode)
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
                case DragItemType.LINE:
                    itemConfig['during'] = (extra as ILineChartExtra).defaultDuring
                    itemConfig['label'] = (extra as ILineChartExtra).defaultLabel
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

    const transferToDragItems = (template: ITemplate): IDragItem[] => {
        const dragItems = template.itemsConfig.map((item) => {
            const newItem: IDragItem = {
                id: item.id,
                type: item.type,
                itemConfig: {
                    requestSignalId: null,
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                    title: item.title,
                    interval: item.interval,
                    trueLabel: item.trueLabel,
                    falseLabel: item.falseLabel,
                    unit: item.unit,
                    during: item.during,
                    min: item.min,
                    max: item.max,
                    label: item.label
                }
            }
            return newItem
        })
        console.log("转换为DragItems")
        console.log(JSON.stringify(dragItems))
        return dragItems
    }

    function renderADDModeInfo() {
        return <>
            <DraggableComponent type={DragItemType.BOOLEAN} draggleConfig={{
                defaultTitle: '请编辑默认标题',
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
                defaultTitle: '请编辑默认标题',
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
            <DraggableComponent type={DragItemType.LINE} draggleConfig={{
                defaultTitle: '请编辑默认标题',
                defaultX: 0,
                defaultY: 0,
                defaultWidth: 400,
                defaultHeight: 400,
                defaultInterval: 1000,
                extra: {
                    defaultDuring: 10,  // 10s
                    defaultLabel: '数值'
                }
            }}/></>
    }

    function updateItemsByLayout(newItem: GridLayout.Layout) {
        setDragItems(dragItems.map((item) => {
            if (item.id === newItem.i) {
                //更新了
                console.log("更新id为", newItem.i, "的控件")
                // console.log('更新为', newItem)
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

    function renderSendedPage() {
        return (
            <div className='dd_container' style={{
                backgroundColor: '#f8f8f8',
                backgroundImage: 'linear-gradient(#e2e2e2 1px, transparent 1px), linear-gradient(90deg, #e2e2e2 1px, transparent 1px)'
            }}>
                <div className="dd_body">
                    <div className="dd_drop_container" ref={ref}>
                        <DropContainer ifStartGetData={mode === NewTestTemplateMode.SHOW} selectedItemId={null}
                                       selectFunc={() => {
                                       }} items={dragItems}
                                       onUpdateItems={updateItemsByLayout}
                                       onLayoutChange={updateAllByLayout}
                        />
                    </div>
                    <div className="dd_info">
                        {renderADDModeInfo()}
                        {

                            <ButtonModal dragItems={dragItems} name={name} description={description}
                                         updateDescription={(value) => {
                                             setDescription(value)
                                         }}
                                         updateName={(value) => {
                                             setName(value)
                                         }}
                                         mode={mode}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }

    return <>
        {renderSendedPage()}
    </>
};

export default NewTestTemplate;

interface IButtonModalProps {
    dragItems: IDragItem[]
    name: string
    description: string
    updateName: (name: string) => void
    updateDescription: (name: string) => void
    mode: NewTestTemplateMode
}

const ButtonModal: FC<IButtonModalProps> = ({
                                                dragItems, name, description, updateName, updateDescription, mode
                                            }) => {
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

    const showModal = () => {
        setVisible(true);
    };

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

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <>
            {
                mode !== NewTestTemplateMode.SHOW &&
              <Button type="primary" onClick={showModal}>
                确认
              </Button>
            }
            <p>名称：{name}</p>
            <p>描述：{description}</p>
            <Modal
                title="请输入模板名称和描述"
                open={visible}
                onOk={handleOk}
                onCancel={handleCancel}
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