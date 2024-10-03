import React, {useEffect} from 'react';
import {Button, Card, Form, Input, message, Modal, Row, Select, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {createVehicle, deleteVehicle, getVehicles, updateVehicle} from "@/apis/request/vehicle.ts";
import {SUCCESS_CODE} from "@/constants";
import {confirmDelete, parseToObject} from "@/utils";
import {RuleObject} from 'antd/es/form';
import {getProtocols, IProtocol} from "@/apis/request/protocol.ts";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {ICollector, IController} from "@/views/demo/Topology/PhyTopology.tsx";
import {getAllControllerList} from "@/apis/request/board-signal/controller.ts";
import {getAllCollectorList} from "@/apis/request/board-signal/collector.ts";


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
  const [openUpdateModel, setOpenUpdateModel] = React.useState<boolean>(false)
  const [targetVehicle, setTargetVehicle] = React.useState<IVehicle>(undefined)

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

        <TestVehicleDetailButton vehicle={record}/>
        <Button type="primary" onClick={() => {
          setTargetVehicle(record)
          setOpenUpdateModel(true)
        }}>{"编辑车辆"}</Button>
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
      <UpdateTestVehicleModel onFinished={
        () => getVehicles().then((res) => {
          setVehicles(res.data)
        })
      } vehicles={vehicles} targetVehicle={
        targetVehicle
      } open={
        openUpdateModel
      } onClose={
        () => setOpenUpdateModel(false)
      }/>
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
  const [controllerBoards, setControllerBoards] = React.useState<IController[]>([])
  const [collectBoards, setCollectBoards] = React.useState<ICollector[]>([])

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
    fetchData();
  }, [form, open])

  const newVehicle = (value) => {
    value.protocols = value.protocols.map((item) => {
      return {
        protocol: JSON.parse(item.protocol),
        core: JSON.parse(item.core),
        collector: JSON.parse(item.collect),
      }
    })
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

  const fetchData = async () => {
    getProtocols().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取协议失败："+ res.msg)
        return
      }
      setProtocols(res.data)
    })
    getAllControllerList().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取核心板卡失败：", res.msg)
        return
      }
      setControllerBoards(res.data)
    })
    getAllCollectorList().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取协议失败："+ res.msg)
        return
      }
      setCollectBoards(res.data)
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
          setOpen(false)
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
          <Form.List name="protocols">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}) => {
                  return (
                    <Space key={key} style={{display: 'flex'}} align="baseline">
                      <Form.Item
                        label="选择协议"
                        {...restField}
                        name={[name, 'protocol']}
                        rules={[{required: true, message: "请选择协议"}]}
                      >
                        <Select placeholder="请选择协议"
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
                      <Form.Item
                        {...restField}
                        name={[name, 'core']}
                        rules={[{required: true, message: '核心板卡不可为空'}]}
                      >
                        <Select placeholder="核心板卡">
                          {
                            controllerBoards.map((item) => {
                              return <Select.Option key={item.controllerName}
                                                    value={JSON.stringify(item)}>{item.controllerName}</Select.Option>
                            })
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'collect']}
                        rules={[{required: true, message: '采集板卡不可为空'},
                          ({getFieldValue}) => ({
                            validator(_, value) {
                              // 协议类型相同的话，采集板卡不能相同
                              const protocol1 = parseToObject(getFieldValue(['protocols', name, 'protocol']))
                              const collect1 = parseToObject(value)
                              for (let i = 0; i < fields.length; i++) {
                                if (i === name) continue
                                const protocol2 = parseToObject(getFieldValue(['protocols', i, 'protocol']))
                                const collect2 = parseToObject(getFieldValue(['protocols', i, 'collect']))

                                console.log(protocol1, protocol2, collect1, collect2)

                                if (protocol1["protocolType"] === protocol2["protocolType"] &&
                                  collect1["collectorName"] === collect2["collectorName"]) {
                                  return Promise.reject('相同协议类型的协议采集板卡不能相同')
                                }
                              }
                              return Promise.resolve()
                            },
                          }),
                        ]}
                      >
                        <Select placeholder="采集板卡">
                          {
                            collectBoards.map((item) => {
                              return <Select.Option key={item.collectorName}
                                                    value={JSON.stringify(item)}>{item.collectorName}</Select.Option>
                            })
                          }
                        </Select>
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
            name="protocols"
          >
            <Table
              columns={[
                {
                  title: "协议名称",
                  dataIndex: "protocol",
                  key: "protocol",
                  render: (text) => text.protocolName
                },
                {
                  title: "核心板卡",
                  dataIndex: "core",
                  key: "core",
                  render: (text) => text.controllerName
                },
                {
                  title: "采集板卡",
                  dataIndex: "collector",
                  key: "collector",
                  render: (text) => text.collectorName
                }
              ]}
              dataSource={vehicle.protocols}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}


export const UpdateTestVehicleModel: React.FC<{
  onFinished: () => void, vehicles: IVehicle[], targetVehicle: IVehicle,
  open: boolean,
  onClose: () => void
}> = ({
        onFinished,
        vehicles,
        targetVehicle,
        open,
        onClose
      }) => {

  const title = "编辑车辆"
  const [form] = Form.useForm()
  const [protocols, setProtocols] = React.useState<IProtocol[]>([])
  const [controllerBoards, setControllerBoards] = React.useState<IController[]>([])
  const [collectBoards, setCollectBoards] = React.useState<ICollector[]>([])

  useEffect(() => {
    fetchData();
  }, [form, open])

  useEffect(() => {
    if (!targetVehicle) {
      return
    }
    form.setFieldsValue({
      vehicleName: targetVehicle.vehicleName,
      protocols: targetVehicle.protocols.map((item) => {
        return {
          protocol: {label: item.protocol.protocolName, value: JSON.stringify(item.protocol)},
          core: {label: item.core.controllerName, value: JSON.stringify(item.core)},
          collector: {label: item.collector.collectorName, value: JSON.stringify(item.collector)},
        }
      })
    })
  }, [form, targetVehicle])

  const isSameName = (vehicles: IVehicle[], thisVehicle: string) => {
    for (const value of vehicles)
      if (value.vehicleName == thisVehicle) return true;
    return false;
  };

  const editVehicle = (value) => {
    console.log(value)
    value.protocols = value.protocols.map((item) => {
      return {
        protocol: JSON.parse(item.protocol.value),
        core: JSON.parse(item.core.value),
        collector: JSON.parse(item.collector.value),
      }
    })
    updateVehicle(Number(targetVehicle.id), value).then((res) => {
      if (res.code === SUCCESS_CODE) {
        message.success("更新成功")
        onFinished()
        onClose()
      } else {
        message.error("更新失败", res.msg)
      }
    })
  }

  const validateVehicleData = async (_: RuleObject, value: string) => {
    const vs = vehicles.filter((item) => item.vehicleName !== targetVehicle.vehicleName)

    if (!value) {
      return Promise.reject(new Error("请输入车辆名称!"));
    } else if (isSameName(vs, value)) {
      return Promise.reject(new Error("不能与列表内已有汽车重名!"));
    } else {
      return Promise.resolve();
    }
  };

  const fetchData = async () => {
    getProtocols().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取协议失败："+ res.msg)
        return
      }
      setProtocols(res.data)
    })
    getAllControllerList().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取核心板卡失败：", res.msg)
        return
      }
      setControllerBoards(res.data)
    })
    getAllCollectorList().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取协议失败："+ res.msg)
        return
      }
      setCollectBoards(res.data)
    })
  }


  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={() => {
          form.validateFields().then((value) => {
            editVehicle(value)
          })
        }}
        onCancel={() => {
          onFinished()
          onClose()
        }}
      >
        <Form form={form}
              initialValues={{
                vehicleName: targetVehicle?.vehicleName,
                protocols: targetVehicle?.protocols
              }}
        >
          <Form.Item
            label="车辆名称"
            name="vehicleName"
            rules={[{validator: validateVehicleData}]}
          >
            <Input placeholder={"请输入车辆名称"}/>
          </Form.Item>
          <Form.List name="protocols">
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, ...restField}) => {
                  return (
                    <Space key={key} style={{display: 'flex'}} align="baseline">
                      <Form.Item
                        label="选择协议"
                        {...restField}
                        name={[name, 'protocol']}
                        rules={[{required: true, message: "请选择协议"}]}
                      >
                        <Select
                          placeholder="请选择协议"
                          labelInValue
                          style={{marginBottom: 20}}
                        >
                          {
                            protocols.map((item) => (
                              <Select.Option key={item.protocolName} value={JSON.stringify(item)}>
                                {item.protocolName}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'core']}
                        rules={[{required: true, message: '核心板卡不可为空'}]}
                      >
                        <Select
                          placeholder="核心板卡"
                          labelInValue
                        >
                          {
                            controllerBoards.map((item) => (
                              <Select.Option key={item.controllerName} value={JSON.stringify(item)}>
                                {item.controllerName}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'collector']}
                        rules={[{required: true, message: '采集板卡不可为空'}]}
                      >
                        <Select
                          placeholder="采集板卡"
                          labelInValue
                        >
                          {
                            collectBoards.map((item) => (
                              <Select.Option key={item.collectorName} value={JSON.stringify(item)}>
                                {item.collectorName}
                              </Select.Option>
                            ))
                          }
                        </Select>
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
        </Form>
      </Modal>
    </>
  );
}

