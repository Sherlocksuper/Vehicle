import {Button, Form, Input, Modal, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {ProtocolType} from "@/apis/request/protocol.ts";


export const ProtocolModel = ({mode, close}: {
    mode: "ADD" | "SHOW" | "",
    close: () => void
    result?: string,
}) => {
    const [form] = Form.useForm();
    const [protocolType, setProtocolType] = React.useState<ProtocolType>(ProtocolType.CAN)

    const handleOk = () => {
        // setIsModalOpen(false);
        console.log(form.getFieldsValue())
        close()

    };

    const handleCancel = () => {
        close()
    };

    return (
        <>
            <Modal
                title="动态添加信号"
                open={mode !== ""}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="确定"
                cancelText="取消"
            >
                <Form layout="vertical" form={form}>
                    <Select placeholder="请选择协议" onSelect={(value) => {
                        form.setFieldsValue({protocolType: value})
                        setProtocolType(value)
                    }} style={{marginBottom: 20}} defaultValue={ProtocolType.CAN}>
                        {
                            Object.values(ProtocolType).map((item) => {
                                return <Select.Option key={item} value={item}>{item}</Select.Option>
                            })
                        }
                    </Select>
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
                        console.log(key)
                        console.log(name)
                        return (
                            <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'name']}
                                    rules={[{required: true, message: `请输入信号${key}名称`}]}
                                >
                                    <Input placeholder="信号名称"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'startPoint']}
                                    rules={[{required: true, message: '请输入起点'}]}
                                >
                                    <Input placeholder="起点"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'length']}
                                    rules={[{required: true, message: '请输入长度'}]}
                                >
                                    <Input placeholder="长度"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'slope']}
                                    rules={[{required: true, message: '请输入斜率'}]}
                                >
                                    <Input placeholder="斜率"/>
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'offset']}
                                    rules={[{required: true, message: '请输入偏移'}]}
                                >
                                    <Input placeholder="偏移"/>
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
