import {Divider, Form, Input, message, Modal, Select} from "antd";
import React, {useEffect} from "react";
import {createProtocol, IProtocol, ProtocolType} from "@/apis/request/protocol.ts";
import {SUCCESS_CODE} from "@/constants";
import {
    AnalogBaseConfig, AnalogSignalsParsingForm, B1552BaseConfig, B1552BSignalParsingForm,
    CanBaseConfig,
    CanSignalsParsingForm, DigitalBaseConfig, DigitalSignalsParsingForm,
    FlexRayBaseConfig, FlexRaySignalsParsingForm, MICBaseConfig, MICSignalsParsingForm, Serial232BaseConfig, Serial232SignalsParsingForm, Serial422BaseConfig, Serial422SignalsParsingForm
} from "@/views/demo/ProtocolTable/protocolComponent.tsx";
import {v4 as uuid} from "uuid"

export const ProtocolModel = ({open, close, onOk, initValue}: {
    // 外面的状态
    open: boolean,
    close: () => void
    initValue?: IProtocol
    onOk?: () => void,
}) => {
    const [form] = Form.useForm();
    const [protocolType, setProtocolType] = React.useState<ProtocolType>(ProtocolType.CAN)

    useEffect(() => {
        form.setFieldValue("protocolType", ProtocolType.CAN)
        // 给form添加一个信号解析配置
        form.setFieldsValue({
            signalsParsingConfig: [{
                signals: []
            }]
        })

        // 初始化为initValue
        if (initValue) {
            form.setFieldsValue(initValue)
            setProtocolType(initValue.protocolType)
        }

        return () => {
            form.resetFields()
        }
    }, [form, initValue])

    // 每次更改协议类型，都要重新设置信号解析配置
    useEffect(() => {
        console.log(protocolType)
        console.log(ProtocolType[protocolType])
        form.setFieldsValue({
            signalsParsingConfig: [{
                signals: []
            }]
        })
    }, [form, protocolType])

    const handleOk = () => {
        // 检查是否合法
        console.log(form.getFieldsValue())
        form.validateFields().then(() => {
            form.submit()
        })
    };

    const handleCancel = () => {
        // 如果是ADD模式，重置表单
        close()
    };

    return (
        <>
            <Modal
                title="动态添加信号"
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
                width={"80%"}
            >
                <Form layout="vertical" form={form}
                      disabled={initValue !== undefined}
                      onFinish={() => {
                          const value = form.getFieldsValue() as IProtocol
                          value.signalsParsingConfig.forEach((item) => {
                              item.signals.forEach((signal) => {
                                  signal.id = uuid()
                              })
                          })

                          createProtocol(value as IProtocol).then((res) => {
                              if (res.code === SUCCESS_CODE) {
                                  message.success("添加成功")
                                  onOk && onOk()
                                  close()
                              } else {
                                  message.error("添加失败：", res.message)
                              }
                          })
                      }}
                >
                    <Form.Item name={"protocolName"} rules={[{required: true, message: "请输入协议名称"}]}>
                        <Input placeholder="为协议命名"/>
                    </Form.Item>
                    <Form.Item name={"protocolType"} initialValue={ProtocolType.CAN}>
                        <Select placeholder="请选择协议" onSelect={(value) => {
                            form.setFieldsValue({protocolType: value})
                            setProtocolType(value)
                        }}>
                            {
                                Object.values(ProtocolType).map((item) => {
                                    return <Select.Option key={item} value={item}>{item}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Divider>基础配置</Divider>
                    {protocolType === ProtocolType.CAN && <CanBaseConfig/>}
                    {protocolType === ProtocolType.FlexRay && <FlexRayBaseConfig/>}
                    {protocolType === ProtocolType.MIC && <MICBaseConfig/>}
                    {protocolType === ProtocolType.B1552B && <B1552BaseConfig/>}
                    {protocolType === ProtocolType.Serial422 && <Serial422BaseConfig/>}
                    {protocolType === ProtocolType.Serial232 && <Serial232BaseConfig/>}
                    {protocolType === ProtocolType.Analog && <AnalogBaseConfig/>}
                    {protocolType === ProtocolType.Digital && <DigitalBaseConfig/>}
                    <Divider>信号解析配置</Divider>
                    {protocolType === ProtocolType.CAN && <CanSignalsParsingForm/>}
                    {protocolType === ProtocolType.FlexRay && <FlexRaySignalsParsingForm/>}
                    {protocolType === ProtocolType.MIC && <MICSignalsParsingForm/>}
                    {protocolType === ProtocolType.B1552B && <B1552BSignalParsingForm/>}
                    {protocolType === ProtocolType.Serial422 && <Serial422SignalsParsingForm/>}
                    {protocolType === ProtocolType.Serial232 && <Serial232SignalsParsingForm/>}
                    {protocolType === ProtocolType.Analog && <AnalogSignalsParsingForm/>}
                    {protocolType === ProtocolType.Digital && <DigitalSignalsParsingForm/>}
                </Form>
            </Modal>
        </>
    );
};


