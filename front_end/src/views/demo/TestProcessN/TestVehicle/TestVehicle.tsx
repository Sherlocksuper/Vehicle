import React, {useEffect} from 'react';
import {Button, Card, Form, Input, message, Modal, Row, Select, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {createVehicle, deleteVehicle, getVehicles, updateVehicle} from "@/apis/request/vehicle.ts";
import {SUCCESS_CODE} from "@/constants";
import {useLoaderData} from "react-router-dom";
import {confirmDelete} from "@/utils";
import {RuleObject} from 'antd/es/form';
import {getProtocols, IProtocol} from "@/apis/request/protocol.ts";


const columns: TableProps<IVehicle>["columns"] = [
    {
        title: "车辆名称",
        dataIndex: "vehicleName",
        key: "vehicleName",
    },
    {
        title: "是否启用",
        dataIndex: "isDisabled",
        key: "isDisabled",
        render: (text) => (!text ? "是" : "否"),
    },
    {
        title: "操作",
        key: "action",
    },
];

const TestVehicle: React.FC = () => {
    const [vehicles, setVehicles] = React.useState<IVehicle[]>([])

    const fetchVehicles = async () => {
        getVehicles().then((res) => {
            console.log("vehicle:" + res.data)
            setVehicles(res.data)
        })
    }

    useEffect(() => {
        fetchVehicles()

        columns[columns.length - 1].render = (_, record) => (
            <Space size="middle">
                <Button type="primary" danger={!record.isDisabled} onClick={() => {
                    record.isDisabled = !record.isDisabled
                    updateVehicle(Number(record.id), record).then((res) => {
                        if (res.code === SUCCESS_CODE) {
                            fetchVehicles()
                        } else {
                            message.error("操作失败")
                        }
                    })
                }
                }>{record.isDisabled ? "启用" : "禁用"}</Button>
                <Button type="primary" disabled={!record.isDisabled} danger={true} onClick={() => {
                    confirmDelete() &&
                    deleteVehicle(Number(record.id)).then((res) => {
                        if (res.code === SUCCESS_CODE) {
                            fetchVehicles()
                        } else {
                            message.error("操作失败")
                        }
                    })
                }
                }>{"删除"}</Button>
                <TestVehicleDetailButton vehicle={record}/>
            </Space>
        )
    }, [])


    return (
        <Card style={{
            overflow: "scroll",
            overflowX: "hidden",
            height: "100vh",
        }}>
            <CreateTestVehicleButton
                vehicles={vehicles}
                onFinished={() => {
                    getVehicles().then((res) => {
                        setVehicles(res.data)
                    })
                }} key={new Date().getTime()}/>
            <Table style={{
                marginTop: 20
            }} columns={columns} dataSource={vehicles}/>
        </Card>
    );
};

export default TestVehicle;


export const CreateTestVehicleButton: React.FC<{ onFinished: () => void, vehicles: IVehicle[] }> = ({
                                                                                                        onFinished,
                                                                                                        vehicles
                                                                                                    }) => {
    const title = "新建车辆"
    const [form] = Form.useForm<IVehicle>()
    const [open, setOpen] = React.useState<boolean>(false)
    const [protocols, setProtocols] = React.useState<IProtocol[]>([])

    useEffect(() => {
        if (open) {
            form.resetFields()
        }
        fetchProtocol();
    }, [form, open])

    const newVehicle = (value) => {
        value.protocols = value.protocols.map((item: string) => JSON.parse(item))
        createVehicle(value).then((res) => {
            console.log(res)
            onFinished()
        })
    }

    const isSameName = (vehicles: IVehicle[], thisVehicle: string) => {
        for (const value of vehicles)
            if (value.vehicleName == thisVehicle) return true;
        return false;
    };

    const validateVehicleData = async (_: RuleObject, value: string) => {
        if (!value) {
            return Promise.reject(new Error("请输入车辆名称!"));
        } else if (isSameName(vehicles, value)) {
            return Promise.reject(new Error("不能与列表内已有汽车重名!"));
        } else {
            return Promise.resolve();
        }
    };

    const fetchProtocol = async () => {
        getProtocols().then((res) => {
            setProtocols(res.data)
        })
    }


    return (
        <>
            <Button type="primary" onClick={() => {
                setOpen(true)
            }}>{title}</Button>
            <Modal
                title={title}
                open={open}
                onOk={() => {
                    form.validateFields().then((values) => {
                        newVehicle(values)
                    })
                }}
                onCancel={() => {
                    onFinished()
                }}
            >
                <Form form={form}>
                    <Form.Item
                        label="车辆名称"
                        name="vehicleName"
                        rules={[{validator: validateVehicleData}]}
                    >
                        <Input placeholder={"请输入车辆名称"}/>
                    </Form.Item>
                    <Form.Item
                        label="选择协议"
                        name="protocols"
                        rules={[{required: true, message: "请选择协议"}]}
                    >
                        <Select placeholder="请选择协议"
                                mode="multiple"
                                style={{marginBottom: 20}}
                        >
                            {
                                protocols.map((item) => {
                                    return <Select.Option key={item.protocolName}
                                                          value={JSON.stringify(item)}>{item.protocolName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export const TestVehicleDetailButton: React.FC<{ vehicle: IVehicle }> = ({vehicle}) => {
    const title = "查看车辆"
    const [open, setOpen] = React.useState<boolean>(false)

    return (
        <>
            <Button type="primary" onClick={() => {
                setOpen(true)
            }}>{title}</Button>
            <Modal
                title={title}
                open={open}
                onOk={() => {
                    setOpen(false)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            >
                <Form>
                    <Form.Item
                        label="车辆名称"
                        name="vehicleName"
                        rules={[{required: true, message: "请输入车辆名称"}]}
                    >
                        <Input placeholder={"请输入车辆名称"} defaultValue={vehicle.vehicleName} disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="协议"
                        name="protocols"
                        rules={[{required: true, message: "请选择协议"}]}
                    >
                        <Select placeholder="请选择协议"
                                mode="multiple"
                                disabled={true}
                                style={{marginBottom: 20}}
                                defaultValue={vehicle.protocols?.map((item) => item.protocolName)}
                        >
                            {
                                vehicle.protocols?.map((item: IProtocol) => {
                                    return <Select.Option key={item.protocolName}
                                                          value={item}>{item.protocolName}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

