import {Button, Divider, Form, Input, message, Modal, Row, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {createProtocol, IProtocol, ProtocolType} from "@/apis/request/protocol.ts";
import {SUCCESS_CODE} from "@/constants";
import {parseProtocolData, processProtocolData} from "@/views/demo/ProtocolTable/protocolDataProcess.ts";
import {log} from "@antv/g2plot/lib/utils";
import {
    CanBaseConfig,
    CanSignalsParsingForm,
    FlexRayBaseConfig, FlexRaySignalsParsingForm
} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

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
        // 初始化为initValue
        if (initValue) {
            console.log(initValue)
            form.setFieldsValue(initValue)
        }

        return () => {
            form.resetFields()
        }
    }, [form, initValue])

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
                          const values = form.getFieldsValue()
                          // console.log(values)
                          createProtocol(values as IProtocol).then((res) => {
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
                    <Divider>信号解析配置</Divider>
                    {protocolType === ProtocolType.CAN && <CanSignalsParsingForm/>}
                    {protocolType === ProtocolType.FlexRay && <FlexRaySignalsParsingForm/>}
                </Form>
            </Modal>
        </>
    );
};


