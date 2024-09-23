import {Button, Col, Form, Input, Row, Space, Tooltip} from "antd";
import React from "react";
import {MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";

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
          rules={[{required: true, message: "请输入周期微时钟(microticksPerCycle)"}]}
        >
          <Input type="number" placeholder="周期微时钟(microticksPerCycle)"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "macroticksPerCycle"]}
          rules={[{required: true, message: "请输入周期宏时钟(macroticksPerCycle)"}]}
        >
          <Input type="number" placeholder="周期宏时钟(macroticksPerCycle)"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "transmissionStartTime"]}
          rules={[{required: true, message: "请输入传输开始时间(transmissionStartTime)"}]}
        >
          <Input type="number" placeholder="传输开始时间(transmissionStartTime)"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "staticFramepayload"]}
          rules={[{required: true, message: "请输入静态帧负载(staticFramepayload)"}]}
        >
          <Input type="number" placeholder="静态帧负载(staticFramepayload)"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "staticSlotsCount"]}
          rules={[{required: true, message: "请输入静态槽(staticSlotsCount)"}]}
        >
          <Input type="number" placeholder="静态槽(staticSlotsCount)"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dynamicSlotCount"]}
          rules={[{required: true, message: "请输入动态槽(dynamicSlotCount)"}]}
        >
          <Input type="number" placeholder="动态槽(dynamicSlotCount)"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dynamicSlotLength"]}
          rules={[{required: true, message: "请输入动态槽长度(dynamicSlotLength)"}]}
        >
          <Input type="number" placeholder="动态槽长度(dynamicSlotLength)"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "setAsSyncNode"]}
          rules={[{required: true, message: "请输入设置为同步节点(setAsSyncNode)"}]}
        >
          <Input type="number" placeholder="设置为同步节点(setAsSyncNode)"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

// MIC配置
export const MICBaseConfig = () => {
  // NCTC、BTC、NRTC、MODADD
  return (
    <Row gutter={[8, 0]}>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "nctc"]}
          rules={[{required: true, message: "请输入NCTC"}]}
        >
          <Input placeholder="NCTC"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "btc"]}
          rules={[{required: true, message: "请输入BTC"}]}
        >
          <Input placeholder="BTC"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "nrtc"]}
          rules={[{required: true, message: "请输入NRTC"}]}
        >
          <Input placeholder="NRTC"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "modadd"]}
          rules={[{required: true, message: "请输入MODADD"}]}
        >
          <Input placeholder="MODADD"/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dataUpdateRate"]}
          rules={[{required: true, message: "请输入数据更新速率"}]}
        >
          <Input placeholder="数据更新速率"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

// 1552b
export const B1552BaseConfig = () => {
  // 选择监听的地址
  return (
    <Row gutter={[8, 0]}>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "listenAddress"]}
          rules={[{required: true, message: "请输入监听地址"}]}
        >
          <Input placeholder="监听地址"/>
        </Form.Item>
      </Col>
    </Row>
  )
}

export const Serial422BaseConfig = () => {
  return (
    <Row gutter={[8, 0]}>
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
          name={["baseConfig", "stopBits"]}
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

export const Serial232BaseConfig = Serial422BaseConfig

// 模拟量
export const AnalogBaseConfig = () => {
  return (
    <Row gutter={[8, 0]}>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dataUpdateRate"]}
          rules={[{required: true, message: "请输入数据更新速率"}]}
        >
          <Input type="number" placeholder="数据更新速率"/>
        </Form.Item>
      </Col>
      {/*<Col className="gutter-row" span={6}>*/}
      {/*  <Form.Item*/}
      {/*    name={["baseConfig", "voltageRange"]}*/}
      {/*    rules={[{required: true, message: "请输入电压范围"}]}*/}
      {/*  >*/}
      {/*    <Input type="number" placeholder="电压范围"/>*/}
      {/*  </Form.Item>*/}
      {/*</Col>*/}
    </Row>
  )
}

// 数字量
export const DigitalBaseConfig = () => {
  return (
    <Row gutter={[8, 0]}>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dataUpdateRate"]}
          rules={[{required: true, message: "请输入数据更新速率"}]}
        >
          <Input type="number" placeholder="数据更新速率"/>
        </Form.Item>
      </Col>
      {/*<Col className="gutter-row" span={6}>*/}
      {/*  <Form.Item*/}
      {/*    name={["baseConfig", "voltageRange"]}*/}
      {/*    rules={[{required: true, message: "请输入电压范围"}]}*/}
      {/*  >*/}
      {/*    <Input type="number" placeholder="电压范围"/>*/}
      {/*  </Form.Item>*/}
      {/*</Col>*/}
    </Row>
  )
}

///------------------信号解析配置-------------------

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


// MIC信号解析配置
export const MICSignalsParsingForm = () => {
  return (
    <Form.List name="signalsParsingConfig">
      {(fields, {add, remove}) => {
        return (
          <>
            {fields.map(({key, name, ...restField}) => (
              <Space key={key} style={{display: 'flex', flexDirection: 'column'}} align="baseline">
                <Space key={key} style={{display: 'flex'}} align="baseline">
                  <Form.Item  {...restField} name={[name, 'frameNumber']}
                              rules={[{required: true, message: '请输入帧编号'}]}>
                    <Input type="number" placeholder="帧编号"/>
                  </Form.Item>
                  <Form.Item  {...restField} name={[name, 'modadd']}
                              rules={[{required: true, message: '请输入MODADD'}]}>
                    <Input type="number" placeholder="MODADD"/>
                  </Form.Item>
                  <Form.Item  {...restField} name={[name, 'devid']}
                              rules={[{required: true, message: '请输入DEVID'}]}>
                    <Input type="number" placeholder="DEVID"/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)}/>

                  <Form.Item>
                    <Tooltip title="信号解析配置按照Dev Select由大位到小位的顺序进行解析">
                      <QuestionCircleOutlined/>
                    </Tooltip>
                  </Form.Item>

                </Space>
                <Form.List name={[name, 'signals']}>
                  {(signalFields, {add: addSignal, remove: removeSignal}) => (
                    <SignalForm fields={signalFields} add={() => {
                      addSignal()
                    }} remove={(index) => {
                      removeSignal(index)
                    }} onlyName={true}
                    />
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
        );
      }}
    </Form.List>
  )
}

export const B1552BSignalParsingForm = () => {
  return (
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
                <Form.Item  {...restField} name={[name, 'rtAddress']}
                            rules={[{required: true, message: '请输入RT地址'}]}>
                  <Input type="number" placeholder="RT地址"/>
                </Form.Item>
                <Form.Item  {...restField} name={[name, 'childAddress']}
                            rules={[{required: true, message: '请输入子地址'}]}>
                  <Input type="number" placeholder="子地址"/>
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)}/>
                <Form.Item>
                  <Tooltip title="信号解析配置按照子地址由大位到小位的顺序进行解析">
                    <QuestionCircleOutlined/>
                  </Tooltip>
                </Form.Item>
              </Space>
              <Space>
                <Form.List name={[name, 'signals']}>
                  {(signalFields, {add: addSignal, remove: removeSignal}) => (
                    <SignalForm fields={signalFields} add={() => {
                      addSignal()
                    }} remove={(index) => {
                      removeSignal(index)
                    }} onlyName={true}
                    />
                  )}
                </Form.List>
              </Space>
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
  )
}

// 串口
export const Serial422SignalsParsingForm = () => (
  <Form.List name="signalsParsingConfig">
    {(fields, {add, remove}) => (
      <>
        {fields.map(({key, name}) => (
          <Space key={key} style={{display: 'flex', flexDirection: 'column'}} align="baseline">
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
        {
          fields.length === 0 && (
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                添加解析配置
              </Button>
            </Form.Item>
          )
        }
      </>
    )}
  </Form.List>
);

export const Serial232SignalsParsingForm = () => (
  <Form.List name="signalsParsingConfig">
    {(fields, {add}) => (
      <>
        {fields.map(({key, name}) => (
          <Space key={key} style={{display: 'flex', flexDirection: 'column'}} align="baseline">
            <Form.List name={[name, 'signals']}>
              {(signalFields, {add: addSignal, remove: removeSignal}) => (
                <SignalForm fields={signalFields} add={() => {
                  addSignal()
                }} remove={(index) => {
                  removeSignal(index)
                }}
                />
              )}
            </Form.List>
          </Space>
        ))}
        {
          fields.length === 0 && (
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                添加解析配置
              </Button>
            </Form.Item>
          )
        }
      </>
    )}
  </Form.List>
);

// 模拟量
export const AnalogSignalsParsingForm = () => {
  return <Form.List name="signalsParsingConfig">
    {(fields,{add}) => (
      <>
        {fields.map(({key, name}) => (
          <Space key={key} style={{display: 'flex', flexDirection: 'column'}} align="baseline">
            <Form.List name={[name, 'signals']}>
              {(signalFields, {add: addSignal, remove: removeSignal}) => (
                <SignalForm fields={signalFields} add={() => {
                  addSignal()
                }} remove={(index) => {
                  removeSignal(index)
                }} onlyName={true}
                />
              )}
            </Form.List>
          </Space>
        ))}
        {
          fields.length === 0 && (
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                添加解析配置
              </Button>
            </Form.Item>
          )
        }
      </>
    )}
  </Form.List>

}

//数字量
export const DigitalSignalsParsingForm = () => {
  return <Form.List name="signalsParsingConfig">
    {(fields) => (
      <>
        {fields.map(({key, name}) => (
          <Space key={key} style={{display: 'flex', flexDirection: 'column'}} align="baseline">
            <Form.List name={[name, 'signals']}>
              {(signalFields, {add: addSignal, remove: removeSignal}) => (
                <SignalForm fields={signalFields} add={() => {
                  addSignal()
                }} remove={(index) => {
                  removeSignal(index)
                }} onlyName={true}
                />
              )}
            </Form.List>
          </Space>
        ))}
        {/*<Form.Item>*/}
        {/*  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>*/}
        {/*    添加解析配置*/}
        {/*  </Button>*/}
        {/*</Form.Item>*/}
      </>
    )}
  </Form.List>
}

/**
 * @param fields
 * @param add
 * @param remove
 * @constructor
 * 功能：信号表单
 * 属性：信号名称、信号量纲、起点、长度、斜率、偏移
 */
export const SignalForm = ({fields, add, remove, onlyName = false}) => {
  if (onlyName) {
    return (
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
  }

  return (
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
}


