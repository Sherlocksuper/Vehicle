import React, {useEffect} from 'react';
import {Button, Form, Input, message, Modal, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {createVehicle, deleteVehicle, getVehicles, updateVehicle} from "@/apis/request/vehicle.ts";
import {SUCCESS_CODE} from "@/constants";
import {useLoaderData} from "react-router-dom";
import {confirmDelete} from "@/utils";
import { RuleObject } from 'antd/es/form';


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
            <CreateTestVehicleButton 
            vehicles={vehicles}
            onFinished={() => {
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


export const CreateTestVehicleButton: React.FC<{ onFinished: () => void,vehicles:IVehicle[] }> = ({onFinished,vehicles}) => {
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
                        rules={[{ validator: validateVehicleData }]}
                        >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
