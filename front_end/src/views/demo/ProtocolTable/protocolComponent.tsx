import {Button, Col, Form, Input, Row, Space, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined} from "@ant-design/icons";

const HexInput = ({
                    value = '0',
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onChange = (value) => {
                    }
                  }) => {
  const [hexValue, setHexValue] = useState('0');

  useEffect(() => {
    setHexValue(parseInt(value).toString(16));
  }, [value]);

  const handleHexChange = (e) => {
    const hex = e.target.value;
    setHexValue(hex);
    const decimal = parseInt(hex, 16);
    if (!isNaN(decimal)) {
      onChange(decimal);
    }
  };

  return <Input type="text" value={hexValue} onChange={handleHexChange}/>;
};

export interface IProtocolSignal {
  id: string
  name: string
  belongVehicle: string
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
      label={"波特率"}
    >
      <HexInput/>
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
          label={"周期微时钟(microticksPerCycle)"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "macroticksPerCycle"]}
          rules={[{required: true, message: "请输入周期宏时钟(macroticksPerCycle)"}]}
          label={"周期宏时钟(macroticksPerCycle)"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "transmissionStartTime"]}
          rules={[{required: true, message: "请输入传输开始时间(transmissionStartTime)"}]}
          label={"传输开始时间(transmissionStartTime)"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "staticFramepayload"]}
          rules={[{required: true, message: "请输入静态帧负载(staticFramepayload)"}]}
          label={"静态帧负载(staticFramepayload)"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "staticSlotsCount"]}
          rules={[{required: true, message: "请输入静态槽(staticSlotsCount)"}]}
          label={"静态槽(staticSlotsCount)"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dynamicSlotCount"]}
          rules={[{required: true, message: "请输入动态槽(dynamicSlotCount)"}]}
          label={"动态槽(dynamicSlotCount)"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dynamicSlotLength"]}
          rules={[{required: true, message: "请输入动态槽长度(dynamicSlotLength)"}]}
          label={"动态槽长度(dynamicSlotLength)"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "setAsSyncNode"]}
          rules={[{required: true, message: "请输入设置为同步节点(setAsSyncNode)"}]}
          label={"设置为同步节点(setAsSyncNode)"}
        >
          <HexInput/>
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
          label={"NCTC"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "btc"]}
          rules={[{required: true, message: "请输入BTC"}]}
          label={"BTC"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "nrtc"]}
          rules={[{required: true, message: "请输入NRTC"}]}
          label={"NRTC"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "modadd"]}
          rules={[{required: true, message: "请输入MODADD"}]}
          label={"MODADD"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "dataUpdateRate"]}
          rules={[{required: true, message: "请输入数据更新速率"}]}
          label={"数据更新速率"}
        >
          <HexInput/>
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
          label={"监听地址"}
        >
          <HexInput/>
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
          label={"波特率"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "stopBits"]}
          rules={[{required: true, message: "请输入停止位"}]}
          label={"停止位"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "check"]}
          rules={[{required: true, message: "请输入是否校验"}]}
          label={"是否校验"}
        >
          <HexInput/>
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={6}>
        <Form.Item
          name={["baseConfig", "checkType"]}
          rules={[{required: true, message: "请输入校验类型"}]}
          label={"校验类型"}
        >
          <HexInput/>
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
          label={"数据更新速率"}
          name={["baseConfig", "dataUpdateRate"]}
          rules={[{required: true, message: "请输入数据更新速率"}]}
        >
          <HexInput/>
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
          label={"数据更新速率"}
          name={["baseConfig", "dataUpdateRate"]}
          rules={[{required: true, message: "请输入数据更新速率"}]}
        >
          <HexInput/>
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
              <Form.Item label={"帧编号"} {...restField} name={[name, 'frameNumber']}
                         rules={[{required: true, message: '请输入帧编号'}]}>
                <HexInput/>
              </Form.Item>
              <Form.Item label={"帧ID"} {...restField} name={[name, 'frameId']}
                         rules={[{required: true, message: '请输入帧ID'}]}>
                <HexInput/>
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
              <Form.Item  {...restField} name={[name, 'frameNumber']} label={"帧编号"}
                          rules={[{required: true, message: '请输入帧编号'}]}>
                <HexInput/>
              </Form.Item>
              <Form.Item  {...restField} name={[name, 'frameId']} label={"帧ID"}
                          rules={[{required: true, message: '请输入帧ID'}]}>
                <HexInput/>
              </Form.Item>
              <Form.Item  {...restField} name={[name, 'cycleNumber']} label={"循环号"}
                          rules={[{required: true, message: '请输入循环号'}]}>
                <HexInput/>
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
                  <Form.Item  {...restField} name={[name, 'frameNumber']} label={"帧编号"}
                              rules={[{required: true, message: '请输入帧编号'}]}>
                    <HexInput/>
                  </Form.Item>
                  <Form.Item  {...restField} name={[name, 'modadd']} label={"MODADD"}
                              rules={[{required: true, message: '请输入MODADD'}]}>
                    <HexInput/>
                  </Form.Item>
                  <Form.Item  {...restField} name={[name, 'devid']} label={"DEVID"}
                              rules={[{required: true, message: '请输入DEVID'}]}>
                    <HexInput/>
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
                <Form.Item  {...restField} name={[name, 'frameNumber']} label={"帧编号"}
                            rules={[{required: true, message: '请输入帧编号'}]}>
                  <HexInput/>
                </Form.Item>
                <Form.Item  {...restField} name={[name, 'rtAddress']} label={"RT地址"}
                            rules={[{required: true, message: '请输入RT地址'}]}>
                  <HexInput/>
                </Form.Item>
                <Form.Item  {...restField} name={[name, 'childAddress']} label={"子地址"}
                            rules={[{required: true, message: '请输入子地址'}]}>
                  <HexInput/>
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

/**
 * @param fields
 * @param add
 * @param remove
 * @param onlyName
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
              <Form.Item {...restField} name={[name, 'name']} label={"信号名称"}
                         rules={[{required: true, message: `请输入信号${key + 1}名称`}]}>
                <Input placeholder="信号名称"/>
              </Form.Item>
              <Form.Item {...restField} name={[name, 'dimension']} label={"信号量纲"}
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
            <Form.Item {...restField} name={[name, 'name']} label={"信号名称"}
                       rules={[{required: true, message: `请输入信号${key + 1}名称`}]}>
              <Input placeholder="信号名称"/>
            </Form.Item>
            <Form.Item {...restField} name={[name, 'dimension']} label={"信号量纲"}
                       rules={[{required: true, message: `请输入信号${key + 1}量纲`}]}>
              <Input placeholder="信号量纲"/>
            </Form.Item>
            <Form.Item {...restField} name={[name, 'startPoint']} label={"起点"}
                       rules={[{required: true, message: '请输入起点'}]}>
              <HexInput/>
            </Form.Item>
            <Form.Item {...restField} name={[name, 'length']}
                       rules={[{required: true, message: '请输入长度'}]}
                       label={"长度"}>
              <HexInput/>
            </Form.Item>
            <Form.Item {...restField} name={[name, 'slope']} rules={[{required: true, message: '请输入斜率'}]} label={"斜率"}>
              <HexInput/>
            </Form.Item>
            <Form.Item {...restField} name={[name, 'offset']} rules={[{required: true, message: '请输入偏移'}]} label={"偏移"}>
              <HexInput/>
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


