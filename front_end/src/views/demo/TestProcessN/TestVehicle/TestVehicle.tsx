import React, {useEffect} from 'react';
import {Button, Card, Descriptions, Divider, Form, Input, message, Modal, Select, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {createVehicle, deleteVehicle, getVehicles, updateVehicle} from "@/apis/request/vehicle.ts";
import {SUCCESS_CODE} from "@/constants";
import {confirmDelete} from "@/utils";
import {RuleObject} from 'antd/es/form';
import Search from "antd/es/input/Search";
import {getCollectUnits} from "@/apis/request/collectUnit.ts";
import {ICollectUnit} from "@/apis/standard/collectUnit.ts";
import {DeleteOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {ITestConfig} from "@/apis/standard/test.ts";
import {createTestConfig} from "@/apis/request/testConfig.ts";
import {ICollector} from "@/views/demo/Topology/PhyTopology.tsx";
import {v4 as uuid} from "uuid"


const TestVehicle: React.FC = () => {
  const [vehicles, setVehicles] = React.useState<IVehicle[]>([])
  const [vehiclesStore, setVehiclesStore] = React.useState<IVehicle[]>([])
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
        <TestConfigModel onFinished={
          () => {
            fetchVehicles()
            setTargetVehicle(undefined)
          }
        } belongVehicle={targetVehicle} open={targetVehicle !== undefined}></TestConfigModel>
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
              // collectUnits要放到新建配置的时候，所以此处先设置为空
              result.collectUnits = []
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
            // collectUnits要放到新建配置的时候，所以此处先设置为空
            result.collectUnits = []
            result.collectUnits = result.collectUnits.map((item) => JSON.parse(item.key))

            // 给每个车的每个协议设置uuid
            result.collectUnits.forEach(collectUnit => {
              collectUnit.collectors.forEach(collector => {
                collector.protocols.forEach(protocol => {
                  protocol.signalsParsingConfig.forEach(spConfig => {
                    spConfig.signals.forEach(signal => {
                      signal.id = uuid()
                    })
                  })
                })
              })
            })

            result.collectUnits.forEach(collectUnit => {
              collectUnit.collectors.forEach(collector => {
                collector.protocols.forEach(protocol => {
                  if (!result.protocols) result.protocols = []
                  // 把protocol变为空
                  const col: ICollector = {
                    ...collector,
                    protocols: []
                  }

                  result.protocols.push({
                    core: collectUnit.core,
                    collector: col,
                    protocol: protocol,
                  })
                })
              })
            })

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
                }) ?? []
              }}
        >
          <Form.Item
            label="车辆名称"
            name="vehicleName"
            rules={[{validator: validateVehicleData}, {required: true, message: '请输入车辆名称'}]}
          >
            <Input placeholder={"请输入车辆名称"}/>
          </Form.Item>
          <Form.Item
            label="装备类型"
            name="equipmentType"
            rules={[{required: true, message: '请输入装备类型'}]}
          >
            <Input placeholder={"请输入装备类型"}/>
          </Form.Item>
          {/*<Form.Item*/}
          {/*  label={"选择采集单元"}*/}
          {/*  name={"collectUnits"}*/}
          {/*>*/}
          {/*  <Select*/}
          {/*    labelInValue*/}
          {/*    mode={"multiple"}*/}
          {/*  >*/}
          {/*    {*/}
          {/*      collectUnits.map((item) => (*/}
          {/*        <Select.Option key={JSON.stringify(item)} value={JSON.stringify(item)}>{item.collectUnitName}</Select.Option>*/}
          {/*      ))*/}
          {/*    }*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
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
            <Descriptions.Item label="装备类型">{vehicle.equipmentType}</Descriptions.Item>
            {/*<Descriptions.Item label="采集单元">*/}
            {/*  {*/}
            {/*    vehicle.collectUnits.map((item) => (*/}
            {/*      <Tag key={item.id}>{item.collectUnitName}</Tag>*/}
            {/*    ))*/}
            {/*  }*/}
            {/*</Descriptions.Item>*/}
          </Descriptions>
        </Card>
      </Modal>
    </>
  );
}

// 新建车辆测试配置
export const TestConfigModel: React.FC<{
  onFinished: () => void,
  belongVehicle: IVehicle,
  open: boolean,
  initValue?: IVehicle
}> = ({
        onFinished,
        open,
        initValue
      }) => {

  const title = (initValue === undefined ? "新建" : "编辑")
  const [form] = Form.useForm()
  const [collectUnits, setCollectUnits] = React.useState<ICollectUnit[]>([])
  const [selectUnits, setSelectUnits] = React.useState<ICollectUnit[]>([])
  const [belongVehicle, setBelongVehicle] = React.useState<IVehicle>(undefined)

  useEffect(() => {
    if (initValue !== undefined) {
      form.setFieldsValue(initValue)
    }
  }, [form, initValue])

  useEffect(() => {
    if (open === false) {
      form.resetFields()
    }
  }, [form, open])

  useEffect(() => {
    getCollectUnits().then((res) => {
      if (res.code !== SUCCESS_CODE) {
        message.error("获取采集单元失败：" + res.msg)
        return
      }
      setCollectUnits(res.data)
    })
  }, [])

  const createTestConfigApi = async () => {
    const value = form.getFieldsValue()
    value.projects = value.projects.map((project) => {
      project.indicators = project.indicators.map((indicator) => {
        indicator.signal = JSON.parse(indicator.signal.value)
        return indicator
      })
      return project
    })

    const result: ITestConfig = {
      id: undefined,
      name: value.name,
      configs: [{
        vehicle: {
          ...belongVehicle,
          collectUnits: selectUnits,
          protocols: selectUnits.map(unit => {
            return unit.collectors.map(collector => {
              return collector.protocols.map(protocol => {
                return {
                  protocol: protocol,
                  core: unit.core,
                  collector: collector
                }
              })
            })
          }).flat(3)
        },
        projects: value.projects
      }],
      dataWrap:{
        equipmentId: "",
        equipmentType: "",
        version: ""
      },
      template: undefined
    }
    console.log(result)

    createTestConfig(result).then((res) => {
      if (res.code === SUCCESS_CODE) {
        onFinished()
        setSelectUnits([])
      } else {
        message.error("创建失败")
      }
    })

  }

  const getSelectOptions = (collectUnits: ICollectUnit[]) => {
    const result = []
    collectUnits.forEach((collectUnit) => {
      collectUnit.collectors.forEach((collector) => {
        collector.protocols.forEach((protocol) => {
          protocol.signalsParsingConfig.forEach((spConfig) => {
            spConfig.signals.forEach((signal) => {
              result.push(<Select.Option key={collectUnit.collectUnitName + "/" + collector.collectorName + "/" + protocol.protocolName + "/" + signal.name}
                                         onClick={() => console.log(signal)}
                                         value={JSON.stringify(signal)}>{collectUnit.collectUnitName + "/" + collector.collectorName + "/" + protocol.protocolName + "/" + signal.name}</Select.Option>)

            })
          })
        })
      })
    })
    return result
  }

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={() => {
          form.validateFields().then(() => {
            createTestConfigApi()
          })
          // onFinished()
        }}
        onCancel={() => {
          onFinished()
          setSelectUnits([])
        }}
        okText="确定"
        cancelText="取消"
        width={"80%"}
      >
        <Form form={form}>
          <Form.Item name={"name"} rules={[{required: true, message: '请输入测试任务名称'}]}
                     label={"测试任务名称"}>
            <Input placeholder="测试任务名称"/>
          </Form.Item>
          <Form.Item label={"选择测试车辆"}
                     name={"vehicle"}
          >
            <Input value={belongVehicle?.vehicleName} onChange={(value) => {
              const newVehicle: IVehicle = {
                ...belongVehicle,
                vehicleName: value.target.value
              }
              setBelongVehicle(newVehicle)
            }}/>
          </Form.Item>
          <Form.Item label={"选择采集单元"}
                     name={"collectUnits"}>
            <Select
              labelInValue
              mode={"multiple"}
              onChange={(value) => {
                setSelectUnits(value.map(item => {
                  const unit: ICollectUnit = JSON.parse(item.key)
                  unit.collectors.forEach(collector => {
                    collector.protocols.forEach(protocol => {
                      protocol.signalsParsingConfig.forEach(spConfig => {
                        spConfig.signals.forEach(signal => {
                          signal.id = uuid()
                        })
                      })
                    })
                  })
                  return unit
                }))
              }}>
              {
                collectUnits.map((item) => (
                  <Select.Option key={JSON.stringify(item)} value={JSON.stringify(item)}>{item.collectUnitName}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.List name={['projects']}>
            {(fields, {add, remove}) => (
              <>
                {fields.map(({key, name, fieldKey, ...restField}) => {
                  const projectIndex = name
                  return (
                    <Space key={key} style={{display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start',}}>
                      <Form.Item {...restField} name={[projectIndex, 'name']}
                                 rules={[{required: true, message: '请输入测试项目名称'}]}
                                 label={"测试项目名称"}>
                        <Input placeholder="测试项目名称"/>
                      </Form.Item>
                      <Form.List name={[projectIndex, 'indicators']}>
                        {(fields, {add, remove}) => (
                          <>
                            {fields.map(({key, name, fieldKey, ...restField}) => {
                              const indicatorIndex = name
                              return (
                                <Space key={key}
                                       style={{display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start'}}>
                                  <Form.Item {...restField} name={[indicatorIndex, 'name']}
                                             rules={[{required: true, message: '请输入指标名称'}]}
                                             label={"指标名称"}>
                                    <Input placeholder="指标名称"/>
                                  </Form.Item>
                                  <Form.Item {...restField} name={[indicatorIndex, 'signal']} fieldKey={[fieldKey, 'signal']}
                                             rules={[{required: true, message: '请选择内侧参数'}]}
                                             label={"内测参数"}
                                  >
                                    <Select
                                      labelInValue
                                      placeholder="选择内测参数"
                                      style={{
                                        width: 300
                                      }}
                                    >
                                      {getSelectOptions(selectUnits)}
                                    </Select>
                                  </Form.Item>
                                  <MinusCircleOutlined onClick={() => remove(name)} disabled={initValue !== undefined}/>
                                </Space>
                              )
                            })}
                            <Form.Item>
                              <Button type="dashed" onClick={() => {
                                add()
                              }}
                                      disabled={initValue !== undefined}>
                                <PlusOutlined/>添加指标
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                      <DeleteOutlined onClick={() => remove(name)} disabled={initValue !== undefined}/>
                      <Divider/>
                    </Space>
                  )
                })}
                <Form.Item>
                  <Button type="dashed" onClick={() => {
                    add()
                  }}>
                    <PlusOutlined/>添加测试项目
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
