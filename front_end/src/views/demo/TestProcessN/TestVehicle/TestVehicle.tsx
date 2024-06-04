import React, {useEffect} from 'react';
import {Button, Form, Input, Modal, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {createVehicle, getVehicles, updateVehicle} from "@/apis/request/vehicle.ts";

//
// export interface IVehicle {
//     id?: number
//     vehicleName: string
//     isDisabled: boolean
// }

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
        render: (_, record) => (
            <Space size="middle">
                <Button type="primary" danger={true} onClick={
                    () => {
                        record.isDisabled = !record.isDisabled
                        console.log("record")
                        console.log(record)
                        updateVehicle(Number(record.id), record).then((res) => {
                            console.log(res)
                        })
                    }
                }>{record.isDisabled ? "启用" : "禁用"}</Button>
            </Space>
        ),
    },
];

const TestVehicle: React.FC = () => {
    const [vehicles, setVehicles] = React.useState<IVehicle[]>([])
    const [showCreateTestVehicle, setShowCreateTestVehicle] = React.useState<boolean>(false)

    useEffect(() => {
        getVehicles().then((res) => {
            console.log("vehicle:" + res.data)
            setVehicles(res.data)
        })
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
            }}/>
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
        })
    }

    return (
        <Modal
            title="新建车辆"
            open={open}
            onOk={() => {
                form.validateFields().then((values) => {
                    newVehicle(values)
                    onFinished()
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