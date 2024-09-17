import {Button, Col, Form, Input, Row, Space} from "antd";
import React from "react";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

export interface IProtocolSignal {
  id: string
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
      <Input
        type="number"
        placeholder="波特率"/>
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
          <Input type="number" placeholder="周期微时钟"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "macroticksPerCycle"]}
          rules={[{required: true, message: "请输入周期宏时钟"}]}
        >
          <Input type="number" placeholder="周期宏时钟"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "transmissionStartTime"]}
          rules={[{required: true, message: "请输入传输开始时间"}]}
        >
          <Input type="number" placeholder="传输开始时间"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "staticFramepayload"]}
          rules={[{required: true, message: "请输入静态帧负载"}]}
        >
          <Input type="number" placeholder="静态帧负载"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "staticSlotsCount"]}
          rules={[{required: true, message: "请输入静态槽"}]}
        >
          <Input type="number" placeholder="静态槽"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dynamicSlotCount"]}
          rules={[{required: true, message: "请输入动态槽"}]}
        >
          <Input type="number" placeholder="动态槽"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dynamicSlotLength"]}
          rules={[{required: true, message: "请输入动态槽长度"}]}
        >
          <Input type="number" placeholder="动态槽长度"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "setAsSyncNode"]}
          rules={[{required: true, message: "请输入设置为同步节点"}]}
        >
          <Input type="number" placeholder="设置为同步节点"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

// 串口基础配置
export const SerialBaseConfig = () => {
  //					reserved	波特率				停止位	是否校验	校验类型
  // 0xff	0x00	0x02	422->0x05,232->0x06	0xC1		32位波特率				0-7	0不校验1校验	0偶校验1奇校验

  return (
    <Row gutter={[8, 0]}>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "reserved"]}
          rules={[{required: true, message: "请输入保留位"}]}
        >
          <Input type="number" placeholder="保留位"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "baudRate"]}
          rules={[{required: true, message: "请输入波特率"}]}
        >
          <Input type="number" placeholder="波特率"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "stopBit"]}
          rules={[{required: true, message: "请输入停止位"}]}
        >
          <Input type="number" placeholder="停止位"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "check"]}
          rules={[{required: true, message: "请输入是否校验"}]}
        >
          <Input type="number" placeholder="是否校验"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "checkType"]}
          rules={[{required: true, message: "请输入校验类型"}]}
        >
          <Input type="number" placeholder="校验类型"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

export const AnalogBaseConfig = () => {
  return (
    <Row gutter={[8, 0]}>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "reserved"]}
          rules={[{required: true, message: "请输入保留位"}]}
        >
          <Input type="number" placeholder="保留位"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dataUpdateRate"]}
          rules={[{required: true, message: "请输入数据更新速率"}]}
        >
          <Input type="number" placeholder="数据更新速率"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "voltageRange"]}
          rules={[{required: true, message: "请输入电压范围"}]}
        >
          <Input type="number" placeholder="电压范围"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

// 数字量
export const DigitalBaseConfig = () => {
  return null
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
                <Input type="number" placeholder="帧编号"/>
              </Form.Item>
              <Form.Item  {...restField} name={[name, 'frameId']}
                          rules={[{required: true, message: '请输入帧ID'}]}>
                <Input type="number" placeholder="帧ID"/>
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

export const FlexRaySignalsParsingForm = () => (
  <Form.List name="signalsParsingConfig">
    {(fields, {add, remove}) => (
      <>
        {fields.map(({key, name, ...restField}) => (
          <Space key={key} style={{display: 'flex', flexDirection: 'column'}} align="baseline">
            <Space key={key} style={{display: 'flex'}} align="baseline">
              <Form.Item  {...restField} name={[name, 'frameNumber']}
                          rules={[{required: true, message: '请输入帧编号'}]}>
                <Input type="number" placeholder="帧编号"/>
              </Form.Item>
              <Form.Item  {...restField} name={[name, 'frameId']}
                          rules={[{required: true, message: '请输入帧ID'}]}>
                <Input type="number" placeholder="帧ID"/>
              </Form.Item>
              <Form.Item  {...restField} name={[name, 'cycleNumber']}
                          rules={[{required: true, message: '请输入循环号'}]}>
                <Input type="number" placeholder="循环号"/>
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


export const SerialSignalsParsingForm = CanSignalsParsingForm

export const AnalogSignalsParsingForm = () => {
  return null
}

export const DigitalSignalsParsingForm = () => {
  return null
}

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
            <Input type="number" placeholder="起点" maxLength={2}/>
          </Form.Item>
          <Form.Item {...restField} name={[name, 'length']} rules={[{required: true, message: '请输入长度'}]}>
            <Input type="number" placeholder="长度、斜率乘/除、偏移正/负" style={{width: 200}} maxLength={2}/>
          </Form.Item>
          <Form.Item {...restField} name={[name, 'slope']} rules={[{required: true, message: '请输入斜率'}]}>
            <Input type="number" placeholder="斜率" maxLength={2}/>
          </Form.Item>
          <Form.Item {...restField} name={[name, 'offset']} rules={[{required: true, message: '请输入偏移'}]}>
            <Input type="number" placeholder="偏移" maxLength={2}/>
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


