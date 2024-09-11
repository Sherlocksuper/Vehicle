import {Button, Form, Input, message, Modal, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {createProtocol, IProtocol, ProtocolType} from "@/apis/request/protocol.ts";
import {SUCCESS_CODE} from "@/constants";
import {parseProtocolData, processProtocolData} from "@/views/demo/ProtocolTable/protocolDataProcess.ts";

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
            form.setFieldsValue(parseProtocolData(initValue.protocolType, initValue))
        }

        return () => {
            form.resetFields()
        }
    }, [form, initValue])

    const handleOk = () => {
        // 检查是否合法
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
                          if (!values.signals) values.signals = []
                          const data = processProtocolData(protocolType, values)
                          if (Object.keys(data).length === 0) return;
                          createProtocol(data as IProtocol).then((res) => {
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
                    <Form.Item name={"protocolType"}
                               initialValue={ProtocolType.CAN}
                    >
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
                    {protocolType === ProtocolType.CAN && <CanForm/>}
                </Form>
            </Modal>
        </>
    );
};

const CanForm = () => {
    return (
        <Form.List name="signals">
            {(fields, {add, remove}) => (
                <>
                    {fields.map(({key, name, ...restField}) => {
                        return (
                            <Space key={key} style={{display: 'flex'}} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    rules={[{required: true, message: `请输入信号${key + 1}名称`}]}
                                >
                                    <Input placeholder="信号名称"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'dimension']}
                                    rules={[{required: true, message: `请输入信号${key + 1}量纲`}]}
                                >
                                    <Input placeholder="信号量纲"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'startPoint']}
                                    rules={[{required: true, message: '请输入起点'}]}
                                >
                                    <Input placeholder="起点" maxLength={2}/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'length']}
                                    rules={[{required: true, message: '请输入长度'}]}
                                >
                                    <Input placeholder="长度、斜率乘/除、偏移正/负" style={{width: 200}} maxLength={2}/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'slope']}
                                    rules={[{required: true, message: '请输入斜率'}]}
                                >
                                    <Input placeholder="斜率" maxLength={2}/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'offset']}
                                    rules={[{required: true, message: '请输入偏移'}]}
                                >
                                    <Input placeholder="偏移" maxLength={2}/>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)}/>
                            </Space>
                        )
                    })}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                            添加信号
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    )
}
