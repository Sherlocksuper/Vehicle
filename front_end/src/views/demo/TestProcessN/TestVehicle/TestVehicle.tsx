import React, {useEffect} from 'react';
import {Button, Form, Input, message, Modal, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {createVehicle, deleteVehicle, getVehicles, updateVehicle} from "@/apis/request/vehicle.ts";
import {SUCCESS_CODE} from "@/constants";
import {useLoaderData} from "react-router-dom";
import {confirmDelete} from "@/utils";


const columns: TableProps<IVehicle>['columns'] = [
    {
        title: '车辆名称',
        dataIndex: 'vehicleName',
        key: 'vehicleName',
    },
    {
        title: '是否启用',
        dataIndex: 'isDisabled',
        key: 'isDisabled',
        render: (text) => !text ? "是" : "否"
    },
    {
        title: '操作',
        key: 'action',
    },
];

const TestVehicle: React.FC = () => {
        const [vehicles, setVehicles] = React.useState<IVehicle[]>([])
        const [showCreateTestVehicle, setShowCreateTestVehicle] = React.useState<boolean>(false)

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
                    </Space>
                )
            }, [])


        return (
            <div style={{
                padding: 20
            }}>
                <Row justify="end" style={{marginBottom: 20}}>
                    <Button type="primary" onClick={() => {
                        setShowCreateTestVehicle(true)
                    }}>New</Button>
                </Row>
                <Table columns={columns} dataSource={vehicles}/>
                <CreateTestVehicle open={showCreateTestVehicle} onFinished={() => {
                    setShowCreateTestVehicle(false)
                    getVehicles().then((res) => {
                        console.log(res)
                        setVehicles(res.data)
                    })
                }} key={new Date().getTime()}/>
            </div>
        );
    };

export default TestVehicle;

interface ICreateTestVehicleProps {
    open: boolean
    onFinished: () => void
}

const CreateTestVehicle: React.FC<ICreateTestVehicleProps> = ({open, onFinished}) => {
    const [form] = Form.useForm<IVehicle>()

    useEffect(() => {
        if (open) {
            form.resetFields()
        }
        form.setFieldsValue({
            isDisabled: false
        })
    }, [open])

    const newVehicle = (value: IVehicle) => {
        createVehicle(value).then((res) => {
            console.log(res)
            onFinished()
        })
    }

    return (
        <Modal
            title="新建车辆"
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
                    rules={[{required: true, message: '请输入车辆名称!'}]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
}