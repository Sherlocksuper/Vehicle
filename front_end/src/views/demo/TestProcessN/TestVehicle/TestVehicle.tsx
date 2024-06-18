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
            <CreateTestVehicleButton onFinished={() => {
                getVehicles().then((res) => {
                    console.log(res)
                    setVehicles(res.data)
                })
            }} key={new Date().getTime()}/>
            <Table style={{
                marginTop: 20
            }} columns={columns} dataSource={vehicles}/>
        </div>
    );
};

export default TestVehicle;


export const CreateTestVehicleButton: React.FC<{ onFinished: () => void }> = ({onFinished}) => {
    const title = "新建车辆"
    const [form] = Form.useForm<IVehicle>()
    const [open, setOpen] = React.useState<boolean>(false)

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
                        rules={[{required: true, message: '请输入车辆名称!'}]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
