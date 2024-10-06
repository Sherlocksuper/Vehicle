import React, {useEffect} from 'react';
import {Button, Card, Descriptions, Form, Input, message, Modal, Select, Space, Table, Tag} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {createVehicle, deleteVehicle, getVehicles, updateVehicle} from "@/apis/request/vehicle.ts";
import {SUCCESS_CODE} from "@/constants";
import {confirmDelete} from "@/utils";
import {RuleObject} from 'antd/es/form';
import Search from "antd/es/input/Search";
import {getCollectUnits} from "@/apis/request/collectUnit.ts";
import {ICollectUnit} from "@/apis/standard/collectUnit.ts";


const TestVehicle: React.FC = () => {
  const [vehicles, setVehicles] = React.useState<IVehicle[]>([])
  const [vehiclesStore, setVehiclesStore] = React.useState<IVehicle[]>([])
  const [openUpdateModel, setOpenUpdateModel] = React.useState<boolean>(false)
  const [targetVehicle, setTargetVehicle] = React.useState<IVehicle>(undefined)

  const fetchVehicles = async () => {
    getVehicles().then((res) => {
      setVehicles(res.data)
      setVehiclesStore(res.data)
    })
  }

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
      render: (_, record) => (
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

          <TestVehicleDetailButton vehicle={record}/>

          <CreateTestVehicleButton
            vehicles={vehicles}
            initValue={record}
            onFinished={() => {
              getVehicles().then((res) => {
                setVehicles(res.data)
              })
              setTargetVehicle(undefined)
            }}/>


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
    },
  ];

  useEffect(() => {
    fetchVehicles()
  }, [])


  return (
    <Card style={{
      overflow: "scroll",
      overflowX: "hidden",
      height: "100vh",
    }}>
      <Space>
        <CreateTestVehicleButton
          vehicles={vehicles}
          initValue={undefined}
          onFinished={() => {
            getVehicles().then((res) => {
              setVehicles(res.data)
            })
            setTargetVehicle(undefined)
          }} key={new Date().getTime()}/>

        <Search placeholder="请输入关键词" enterButton="搜索" size="large" onSearch={(value) => {
          const targetVehicles = vehiclesStore.map(vehicle => {
            if (vehicle.vehicleName.includes(value)) {
              return vehicle
            }
          }).filter(vehicle => vehicle !== undefined)
          setVehicles(targetVehicles)
        }}/>
      </Space>
      <Table style={{
        marginTop: 20
      }} columns={columns} dataSource={vehicles}
             rowKey={"id"}
      />
    </Card>
  );
};

export default TestVehicle;


export const CreateTestVehicleButton: React.FC<{ onFinished: () => void, vehicles: IVehicle[], initValue?: IVehicle }> = ({
                                                                                                                            onFinished,
                                                                                                                            vehicles,
                                                                                                                            initValue
                                                                                                                          }) => {
  const title = initValue === undefined ? "新建车辆" : "编辑车辆"
  const [form] = Form.useForm()
  const [open, setOpen] = React.useState<boolean>(false)
  const [collectUnits, setCollectUnits] = React.useState<ICollectUnit[]>([])

  useEffect(() => {
    fetchData();
  }, [form, open])

  const newVehicle = (value) => {
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
    if (initValue !== undefined) return Promise.resolve()
    if (!value) {
      return Promise.reject(new Error("请输入车辆名称!"));
    } else if (isSameName(vehicles, value)) {
      return Promise.reject(new Error("不能与列表内已有汽车重名!"));
    } else {
      return Promise.resolve();
    }
  };

  const fetchData = async () => {
    getCollectUnits().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取采集单元失败：" + res.msg)
        return
      }
      setCollectUnits(res.data)
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
          if (initValue !== undefined) {
            form.validateFields().then(() => {
              const result = form.getFieldsValue()
              result.collectUnits = result.collectUnits.map((item) => JSON.parse(item.key))
              updateVehicle(Number(initValue.id), result).then((res) => {
                if (res.code === SUCCESS_CODE) {
                  onFinished()
                  setOpen(false)
                } else {
                  message.error("更新失败")
                }
              })
            })
            return
          }
          form.validateFields().then(() => {
            const result = form.getFieldsValue()
            result.collectUnits = result.collectUnits.map((item) => JSON.parse(item.key))
            newVehicle(result)
          })
        }}
        onCancel={() => {
          onFinished()
          setOpen(false)
        }}
      >
        <Form form={form}
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}
              initialValues={{
                vehicleName: initValue?.vehicleName,
                collectUnits: initValue?.collectUnits?.map((item) => {
                  return {
                    key: JSON.stringify(item),
                    label: item.collectUnitName
                  }
                })
              }}
        >
          <Form.Item
            label="车辆名称"
            name="vehicleName"
            rules={[{validator: validateVehicleData}]}
          >
            <Input placeholder={"请输入车辆名称"}/>
          </Form.Item>
          <Form.Item
            label={"选择采集单元"}
            name={"collectUnits"}
          >
            <Select
              labelInValue
              mode={"multiple"}
            >
              {
                collectUnits.map((item) => (
                  <Select.Option key={JSON.stringify(item)} value={JSON.stringify(item)}>{item.collectUnitName}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export const TestVehicleDetailButton: React.FC<{ vehicle: IVehicle }> = ({vehicle}) => {
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <>
      <Button type="primary" onClick={() => {
        setOpen(true)
      }}>{"查看车辆"}</Button>
      <Modal
        open={open}
        onOk={() => {
          setOpen(false)
        }}
        onCancel={() => {
          setOpen(false)
        }}
        width={800}
      >
        <Card title={vehicle.vehicleName}
              style={{
                width: "100%"
              }}
        >
          <Descriptions
            bordered
            column={1}
          >
            <Descriptions.Item label="车辆名称">{vehicle.vehicleName}</Descriptions.Item>
            <Descriptions.Item label="是否启用">{vehicle.isDisabled ? "否" : "是"}</Descriptions.Item>
            <Descriptions.Item label="采集单元">
              {
                vehicle.collectUnits.map((item) => (
                  <Tag key={item.id}>{item.collectUnitName}</Tag>
                ))
              }
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Modal>
    </>
  );
}
