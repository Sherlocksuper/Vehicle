import {Button, Col, Form, Input, Row, Space} from "antd";
import React from "react";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

export interface IProtocolSignal {
    name: string
    dimension: string
    startPoint: string
    length: string
    slope: string
    offset: string
}

export const CanBaseConfig = () => {
    return (
        <Form.Item
            name={["baseConfig", "baudRate"]}
            rules={[{required: true, message: "请输入波特率"}]} // 必填
        >
            <Input placeholder="波特率"/>
        </Form.Item>
    )
}

export const FlexRayBaseConfig = () => {
    return (
        <Row gutter={[8, 0]}>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "microticksPerCycle"]}
                    rules={[{required: true, message: "请输入周期微时钟"}]}
                >
                    <Input placeholder="周期微时钟"/>
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "macroticksPerCycle"]}
                    rules={[{required: true, message: "请输入周期宏时钟"}]}
                >
                    <Input placeholder="周期宏时钟"/>
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "transmissionStartTime"]}
                    rules={[{required: true, message: "请输入传输开始时间"}]}
                >
                    <Input placeholder="传输开始时间"/>
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "staticFramepayload"]}
                    rules={[{required: true, message: "请输入静态帧负载"}]}
                >
                    <Input placeholder="静态帧负载"/>
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "staticSlotsCount"]}
                    rules={[{required: true, message: "请输入静态槽"}]}
                >
                    <Input placeholder="静态槽"/>
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "dynamicSlotCount"]}
                    rules={[{required: true, message: "请输入动态槽"}]}
                >
                    <Input placeholder="动态槽"/>
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "dynamicSlotLength"]}
                    rules={[{required: true, message: "请输入动态槽长度"}]}
                >
                    <Input placeholder="动态槽长度"/>
                </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
                <Form.Item
                    name={["baseConfig", "setAsSyncNode"]}
                    rules={[{required: true, message: "请输入设置为同步节点"}]}
                >
                    <Input placeholder="设置为同步节点"/>
                </Form.Item>
            </Col>
        </Row>
    )
}

export const CanSignalsParsingForm = () => (
    <Form.List name="signalsParsingConfig">
        {(fields, {add, remove}) => (
            <>
                {fields.map(({key, name, ...restField}) => (
                    <Space key={key} style={{display: 'flex', flexDirection: 'column'}} align="baseline">
                        <Space key={key} style={{display: 'flex'}} align="baseline">
                            <Form.Item  {...restField} name={[name, 'frameNumber']}
                                        rules={[{required: true, message: '请输入帧编号'}]}>
                                <Input placeholder="帧编号"/>
                            </Form.Item>
                            <Form.Item  {...restField} name={[name, 'frameId']}
                                        rules={[{required: true, message: '请输入帧ID'}]}>
                                <Input placeholder="帧ID"/>
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)}/>
                        </Space>
                        <Form.List name={[name, 'signals']}>
                            {(signalFields, {add: addSignal, remove: removeSignal}) => (
                                <SignalForm fields={signalFields} add={() => {
                                    addSignal()
                                }} remove={(index) => {
                                    removeSignal(index)
                                }}/>
                            )}
                        </Form.List>
                    </Space>
                ))}
                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                        添加解析配置
                    </Button>
                </Form.Item>
            </>
        )}
    </Form.List>
);

export const FlexRaySignalsParsingForm = CanSignalsParsingForm

/**
 * @param fields
 * @param add
 * @param remove
 * @constructor
 * 功能：信号表单
 * 属性：信号名称、信号量纲、起点、长度、斜率、偏移
 */
export const SignalForm = ({fields, add, remove}) => (
    <>
        {fields.map(({key, name, ...restField}) => {
            return (
                <Space key={key} style={{display: 'flex'}} align="baseline">
                    <Form.Item {...restField} name={[name, 'name']}
                               rules={[{required: true, message: `请输入信号${key + 1}名称`}]}>
                        <Input placeholder="信号名称"/>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'dimension']}
                               rules={[{required: true, message: `请输入信号${key + 1}量纲`}]}>
                        <Input placeholder="信号量纲"/>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'startPoint']}
                               rules={[{required: true, message: '请输入起点'}]}>
                        <Input placeholder="起点" maxLength={2}/>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'length']} rules={[{required: true, message: '请输入长度'}]}>
                        <Input placeholder="长度、斜率乘/除、偏移正/负" style={{width: 200}} maxLength={2}/>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'slope']} rules={[{required: true, message: '请输入斜率'}]}>
                        <Input placeholder="斜率" maxLength={2}/>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'offset']} rules={[{required: true, message: '请输入偏移'}]}>
                        <Input placeholder="偏移" maxLength={2}/>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)}/>
                </Space>
            )
        })}
        <Form.Item>
            <Button type="dashed" onClick={add} block icon={<PlusOutlined/>}>
                添加信号
            </Button>
        </Form.Item>
    </>
);


