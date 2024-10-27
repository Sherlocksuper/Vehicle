import {Button, Card, Form, Input, message, Modal, Row, Select, Space, Table, TableProps} from "antd";
import React, {useEffect, useState} from "react";
import {FAIL_CODE, SUCCESS_CODE} from "@/constants";
import {ITestConfig} from "@/apis/standard/test.ts";
import {createTestConfig, deleteTestConfig, downTestConfig, getCurrentTestConfig, getTestConfigs, stopCurrentTestConfig, updateTestConfigById} from "@/apis/request/testConfig.ts";
import {confirmDelete} from "@/utils";
import Search from "antd/es/input/Search";
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {ICollectUnit} from "@/apis/standard/collectUnit.ts";
import {v4 as uuid} from "uuid";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {CollectUnitEdit} from "@/views/demo/CollectUnit/collectUnit.tsx";
import {ICollector, IController} from "@/views/demo/Topology/PhyTopology.tsx";
import {CollectorDetailModal} from "@/views/demo/Topology/CollectorInfoTable";
import {ControllerDetailModal} from "@/views/demo/Topology/ControllerInfoTabl";

enum TaskStep {
  CREATE = "CREATE",
  UNIT = "UNIT",
  COLLECT = "COLLECT",
  WRAP = "WRAP",
  BASEINFO = "BASEINFO"
}


const TestConfig = () => {
  const [configs, setConfigs] = React.useState<ITestConfig[]>([]);
  const [configsStore, setConfigsStore] = React.useState<ITestConfig[]>([]);

  const [currentDownConfig, setCurrentDownConfig] = React.useState<ITestConfig | undefined>(undefined);

  const [currentTaskStep, setCurrentTaskStep] = React.useState<{
    step: TaskStep,
    config: ITestConfig
  }>(undefined);

  const downConfig = (record: ITestConfig) => {
    if (currentDownConfig) {
      message.error('请先停止当前下发');
      return;
    }
    message.loading('下发中', 0);
    downTestConfig(record.id).then(res => {
      console.log(res)
      if (res.code === FAIL_CODE) {
        message.destroy()
        message.error("下发失败:" + res.msg);
      } else {
        message.destroy()
        message.success('下发成功');
        setCurrentDownConfig(record);
      }
    })
  }

  const fetchConfigs = () => {
    getTestConfigs().then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        setConfigs(res.data);
        setConfigsStore(res.data);
      }
    });
  };

  const fetchCurrentConfig = () => {
    getCurrentTestConfig().then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        console.log(res.data);
        setCurrentDownConfig(res.data);
      }
    });
  }

  const deleteConfig = (id: number) => {
    confirmDelete() && deleteTestConfig(id).then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        message.success('删除成功');
        fetchConfigs();
      }
    });
  };

  const copyConfig = (config: ITestConfig) => {
    delete config["id"]
    createTestConfig(config).then(res => {
      if (res.code === SUCCESS_CODE) {
        message.success("复制成功")
        fetchConfigs()
      }
      if (res.code === FAIL_CODE) message.success("复制失败")
    })
  }

  // 前往查看当前数据
  const handleShowCurrentData = () => {
    const win = window.open(`/test-template-for-config?testConfigId=${currentDownConfig?.id}`);
    if (!win) return
  }

  const handleStopCurrentCollect = () => {
    stopCurrentTestConfig().then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        message.success('停止成功');
        setCurrentDownConfig(undefined);
      }
    });
  }

  const columns: TableProps<ITestConfig>['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '测试任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '测试车辆',
      key: 'vehicle',
      render: (text, record) => (
        <Space>
          <span>{record.configs[0].vehicle.vehicleName}</span>
        </Space>
      ),
    },
    {
      title: '测试任务配置',
      key: 'set',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => setCurrentTaskStep({step: TaskStep.BASEINFO, config: record})}>任务信息修改</Button>
          <Button type="link" onClick={() => setCurrentTaskStep({step: TaskStep.UNIT, config: record})}>测试单元管理</Button>
          <Button type="link" onClick={() => setCurrentTaskStep({step: TaskStep.COLLECT, config: record})}>数据采集项</Button>
          <Button type="link" onClick={() => setCurrentTaskStep({step: TaskStep.WRAP, config: record})}>采集数据封装</Button>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => copyConfig(record)}>复制</Button>
          {currentDownConfig?.id === record.id ?
            (<Button type="link" onClick={() => handleStopCurrentCollect()}>使用中</Button>)
            :
            <>
              <Button type="link" onClick={() => deleteConfig(record.id)}>删除</Button>
              <Button type="link" onClick={() => downConfig(record)}>下发</Button>
            </>
          }

        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchConfigs()
    fetchCurrentConfig()
  }, []);

  return (
    <Card title={"测试任务"}
          style={{overflow: "scroll", overflowX: "hidden", height: "100vh", padding: "20px", display: "flex", flexDirection: "column"}}
          extra={
            <Space style={{marginBottom: "20px", alignItems: "center",}}>
              <Button type="primary" onClick={() => {
                setCurrentTaskStep({step: TaskStep.CREATE, config: undefined})
              }}>{"添加测试任务"}</Button>

              {/*<Button type={"primary"} disabled={!currentDownConfig} onClick={() => handleShowCurrentData()}>{*/}
              {/*  currentDownConfig ? (currentDownConfig.name) : "暂无在下发任务"*/}
              {/*}</Button>*/}

              {/*<Button type={"primary"} onClick={() => handleStopCurrentCollect()}>停止当前采集</Button>*/}

              <Search placeholder="请输入关键词" enterButton="搜索" size="large" onSearch={(value) => {
                const targetConfigs = configsStore.map(config => {
                  if (config.name.includes(value)) {
                    return config
                  }
                }).filter(config => config !== undefined)
                setConfigs(targetConfigs)
              }}/>
            </Space>
          }
    >
      <Table
        columns={columns}
        dataSource={configs}
        rowKey="id"
        style={{marginTop: "20px"}}
        locale={{emptyText: '暂无协议数据'}}
      />
      <CreateTestTask onFinished={() => {
        fetchConfigs()
        setCurrentTaskStep(undefined)
      }} open={currentTaskStep?.step === TaskStep.CREATE}/>
      <TestUnitManage onFinished={() => {
        fetchConfigs()
        setCurrentTaskStep(undefined)
      }} open={currentTaskStep?.step === TaskStep.UNIT && currentTaskStep?.config !== undefined} initValue={currentTaskStep?.config}/>
      <CollectItemManage onFinished={() => {
        fetchConfigs()
        setCurrentTaskStep(undefined)
      }} open={currentTaskStep?.step === TaskStep.COLLECT && currentTaskStep?.config !== undefined} initValue={currentTaskStep?.config}/>
      <CollectDataWrap onFinished={() => {
        fetchConfigs()
        setCurrentTaskStep(undefined)
      }} open={currentTaskStep?.step === TaskStep.WRAP && currentTaskStep?.config !== undefined} initValue={currentTaskStep?.config}/>
      <ConfigBaseInfo onFinished={() => {
        fetchConfigs()
        setCurrentTaskStep(undefined)
      }} open={currentTaskStep?.step === TaskStep.BASEINFO && currentTaskStep?.config !== undefined} initValue={currentTaskStep?.config}/>
    </Card>
  );
};
export default TestConfig


// 新建测试任务
export const CreateTestTask: React.FC<{
  onFinished: () => void,
  open: boolean,
  initValue?: IVehicle
}> = ({
        onFinished,
        open,
        initValue
      }) => {

  const title = (initValue === undefined ? "新建" : "编辑") + "测试任务"
  const [form] = Form.useForm()
  const [configName, setConfigName] = React.useState<string>("")
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

  const createTestConfigApi = async () => {

    // @ts-ignore
    const result: ITestConfig = {
      name: configName,
      configs: [{
        vehicle: {
          ...belongVehicle,
          collectUnits: [],
          protocols: []
        },
        projects: []
      }],
      dataWrap: {
        equipmentType: "",
        equipmentId: "",
        version: ""
      },
      template: undefined
    }
    console.log(result)

    createTestConfig(result).then((res) => {
      if (res.code === SUCCESS_CODE) {
        onFinished()
      } else {
        message.error("创建失败")
      }
    })

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
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form}>
          <Form.Item name={"name"} rules={[{required: true, message: '请输入测试任务名称'}]}
                     label={"测试任务名称"}>
            <Input placeholder="测试任务名称" onChange={(value) => {
              setConfigName(value.target.value)
            }}/>
          </Form.Item>
          <Form.Item label={"测试车辆名称"}
                     name={"vehicle"}
                     rules={[{required: true, message: '请输入车辆名称'}]}
          >
            <Input value={belongVehicle?.vehicleName} onChange={(value) => {
              const newVehicle: IVehicle = {
                ...belongVehicle,
                vehicleName: value.target.value
              }
              setBelongVehicle(newVehicle)
            }}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}


// 测试单元管理
export const TestUnitManage: React.FC<{
  onFinished: () => void,
  open: boolean,
  initValue: ITestConfig
}> = ({
        onFinished,
        open,
        initValue
      }) => {

  const title = "编辑采集单元"
  const [form] = Form.useForm()
  const [selectUnits, setSelectUnits] = React.useState<ICollectUnit[]>([])
  const [addUnitOpen, setAddUnitOpen] = React.useState<boolean>(false)

  const [showCoreBoard, setShowCoreBoard] = useState<IController>(undefined)
  const [showCollectBoard, setShowCollectBoard] = useState<ICollector>(undefined)

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
    if (initValue) {
      setSelectUnits(initValue.configs[0].vehicle.collectUnits)
    }
  }, [initValue])

  const updateTestConfigApi = async () => {
    let index = 1
    const result: ITestConfig = {
      id: initValue.id,
      name: initValue.name,
      configs: [{
        vehicle: {
          ...initValue.configs[0].vehicle,
          collectUnits: selectUnits,
          protocols: selectUnits.map(unit => {
            return unit.collectors.map(collector => {
              return collector.protocols.map(protocol => {
                protocol.signalsParsingConfig = protocol.signalsParsingConfig.map(spConfig => {
                  spConfig.signals = spConfig.signals.map(signal => {
                    return {
                      ...signal,
                      id: String(index++),
                    }
                  })
                  return spConfig
                })

                return {
                  protocol: protocol,
                  core: unit.core,
                  collector: collector,
                }
              })
            })
          }).flat(3),
        },
        projects: []
      }],
      dataWrap: initValue.dataWrap,
      template: {
        ...initValue.template,
        itemsConfig: []
      }
    }

    updateTestConfigById(result.id, result).then((res) => {
      if (res.code === SUCCESS_CODE) {
        onFinished()
      } else {
        message.error("更新失败")
      }
    })
  }

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={() => {
          form.validateFields().then(() => {
            updateTestConfigApi()
          })
        }}
        onCancel={() => {
          onFinished()
          setSelectUnits([])
        }}
        okText="确定"
        cancelText="取消"
      >
        {
          selectUnits.map((unit, index) => {
            return <Card title={unit.collectUnitName} key={index} style={{marginBottom: "20px"}}
                         extra={<Button type="link" onClick={() => {
                           setSelectUnits(selectUnits.filter((value) => {
                             return value !== unit
                           }))
                         }}>删除</Button>}
            >
              <Space direction={"vertical"}>
                <p>核心板卡:</p>
                <a onClick={() => setShowCoreBoard(unit.core)}>{unit.core.controllerName}</a>
                <p>采集器:</p>
                {
                  unit.collectors.map((collector) => {
                    return <a onClick={() => setShowCollectBoard(collector)}> {`${collector.collectorName},`}</a>
                  })
                }
              </Space>
            </Card>
          })
        }
        <Button type="dashed"
                onClick={() => {
                  setAddUnitOpen(true)
                }}>
          <PlusOutlined/>添加采集单元
        </Button>
        <CollectUnitEdit open={
          addUnitOpen
        } onClose={
          (unit) => {
            if (unit) {
              setSelectUnits([...selectUnits, unit])
            }
            setAddUnitOpen(false)
          }
        }/>
        <CollectorDetailModal collector={showCollectBoard} onClose={() => {
          setShowCollectBoard(undefined)
        }}/>
        <ControllerDetailModal controller={showCoreBoard} onClose={() => {
          setShowCoreBoard(undefined)
        }}/>
      </Modal>
    </>
  );
}


// 数据采集项
export const CollectItemManage: React.FC<{
  onFinished: () => void,
  open: boolean,
  initValue?: ITestConfig
}> = ({
        onFinished,
        open,
        initValue
      }) => {

  const title = (initValue === undefined ? "新建" : "编辑")
  const [projects, setProjects] = React.useState<ITestConfig["configs"][0]["projects"]>([])

  useEffect(() => {
    if (open === false) {
      setProjects([])
    }
    if (open === true) {
      setProjects(initValue.configs[0].projects)
      if (initValue.configs[0].projects.length === 0) {
        setProjects([{
          name: "defaultProject",
          indicators: []
        }])
      }
    }
  }, [open])

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

  const updateTestConfigApi = async () => {
    const prores = assignForEachProtocolSignal()

    const result: ITestConfig = {
      ...initValue,
      configs: [{
        ...initValue.configs[0],
        projects: prores
      }]
    }

    updateTestConfigById(result.id, result).then((res) => {
      if (res.code === SUCCESS_CODE) {
        onFinished()
      } else {
        message.error("更新失败")
      }
    })
  }

  const assignForEachProtocolSignal = () => {
    // const result = projects
    // let index = 1
    // result.forEach((project) => {
    //   project.indicators.forEach((indicator) => {
    //     if (indicator.signal === undefined) {
    //       indicator.signal = {
    //         ...indicator.signal,
    //       }
    //     }
    //   })
    // })
    // return result
    return projects
  }

  // 一键导入所有
  const handleImportAll = (collectUnits: ICollectUnit[]) => {
    const result = []
    collectUnits.forEach((collectUnit) => {
      collectUnit.collectors.forEach((collector) => {
        collector.protocols.forEach((protocol) => {
          protocol.signalsParsingConfig.forEach((spConfig) => {
            spConfig.signals.forEach((signal) => {
              result.push({
                name: signal.name,
                signal: {
                  ...signal,
                }
              })
            })
          })
        })
      })
    })
    const newProjects = Array.from(projects)
    newProjects[0].indicators = result
    setProjects(newProjects)
  }

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={() => {
          updateTestConfigApi().then(() => {
            onFinished()
          })
        }}
        onCancel={() => {
          onFinished()
        }}
        okText="确定"
        cancelText="取消"
        width={"80%"}
      >
        <Button
          onClick={() => {
            handleImportAll(initValue.configs[0].vehicle.collectUnits)
          }}
        >
          一键导入所有
        </Button>
        {
          projects.map((project) => {
            return <Card style={{marginBottom: "20px", width: "100%"}}>
              {
                project.indicators.map((indicator) => {
                  return <Row style={{marginBottom: "20px"}}>
                    <Space>
                      <Input placeholder="指标名称" value={indicator.name} onChange={(value) => {
                        const newName = value.target.value
                        setProjects(projects.map((value) => {
                          if (value === project) {
                            return {
                              ...value,
                              indicators: value.indicators.map((value) => {
                                if (value === indicator) {
                                  return {
                                    ...value,
                                    name: newName
                                  }
                                }
                                return value
                              })
                            }
                          }
                          return value
                        }))
                      }}/>
                      <Select placeholder="选择信号"
                              value={indicator.signal && JSON.stringify(indicator.signal)}
                              onChange={(targetSignal) => {
                                setProjects(projects.map((value) => {
                                  if (value === project) {
                                    return {
                                      ...value,
                                      indicators: value.indicators.map((value) => {
                                        if (value === indicator) {
                                          return {
                                            ...value,
                                            signal: JSON.parse(targetSignal)
                                          }
                                        }
                                        return value
                                      })
                                    }
                                  }
                                  return value
                                }))
                              }}
                              style={{width: "700px"}}
                      >
                        {
                          initValue && getSelectOptions(initValue.configs[0].vehicle.collectUnits)
                        }
                      </Select>
                      <Button type="link" onClick={() => {
                        setProjects(projects.map((value) => {
                          if (value === project) {
                            return {
                              ...value,
                              indicators: value.indicators.filter((value) => {
                                return value !== indicator
                              })
                            }
                          }
                          return value
                        }))
                      }}><DeleteOutlined/></Button>
                    </Space>
                  </Row>
                })}
              <Button type="dashed"
                      onClick={() => {
                        setProjects(projects.map((value) => {
                          if (value === project) {
                            return {
                              ...value,
                              indicators: [...value.indicators, {
                                name: "",
                                signal: undefined
                              }]
                            }
                          }
                          return value
                        }))
                      }}>
                <PlusOutlined/>添加指标
              </Button>

            </Card>
          })
        }
      </Modal>
    </>
  );
}

export const CollectDataWrap: React.FC<{
  onFinished: () => void,
  open: boolean,
  initValue?: ITestConfig
}> = ({
        onFinished,
        open,
        initValue
      }) => {

  const title = "采集数据封装"

  const [wrapForm, setWrapForm] = React.useState<{
    equipmentType: string,
    equipmentId: number,
    version: string,
  }>(null)

  const [form] = Form.useForm()

  useEffect(() => {
    if (open === false) form.resetFields()
    if (open === true) {
      console.log(initValue.dataWrap)
      form.setFieldsValue(initValue.dataWrap)
    }
  }, [open])


  const updateTestConfigApi = async (dataWrap) => {
    const result: ITestConfig = {
      ...initValue,
      dataWrap: dataWrap
    }

    updateTestConfigById(result.id, result).then((res) => {
      if (res.code === SUCCESS_CODE) {
        onFinished()
      } else {
        message.error("更新失败")
      }
    })
  }


  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={() => {
          form.validateFields().then(() => {
            updateTestConfigApi(wrapForm)
          })
        }}
        onCancel={() => {
          onFinished()
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          onValuesChange={(changedValues, allValues) => {
            setWrapForm(allValues)
          }}>
          <Form.Item label={"版本号"}
                     name={"version"}
                     rules={[{required: true, message: '请输入版本号'}]}>
            <Input/>
          </Form.Item>
          <Form.Item label={"装备类型"}
                     name={"equipmentType"}
                     rules={[{required: true, message: '请输入装备类型类型'}]}>
            <Input/>
          </Form.Item>
          <Form.Item label={"装备ID"}
                     name={"equipmentId"}
                     rules={[{required: true, message: '请输入装备ID'}]}>
            <Input/>
          </Form.Item>
          <Form.Item label={"使用北斗授时"}
                     name={"useBeidou"}
                     rules={[{required: true, message: '请输入装备ID'}]}
                     initialValue={true}>
            <Select>
              <Select.Option value={true}>是</Select.Option>
              <Select.Option value={false}>否</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}


// 新建测试任务
export const ConfigBaseInfo: React.FC<{
  onFinished: () => void,
  open: boolean,
  initValue?: ITestConfig
}> = ({
        onFinished,
        open,
        initValue
      }) => {

  const title = (initValue === undefined ? "新建" : "编辑") + "测试任务"
  const [form] = Form.useForm()
  const [configName, setConfigName] = React.useState<string>("")
  const [belongVehicle, setBelongVehicle] = React.useState<IVehicle>(undefined)

  useEffect(() => {
    if (open === true) {
      setConfigName(initValue.name)
      setBelongVehicle(initValue.configs[0].vehicle)
    }
  }, [form, open])

  const updateTestConfigApi = async () => {
    const result: ITestConfig = Object.assign(initValue)
    result.name = configName
    result.configs[0].vehicle = belongVehicle

    updateTestConfigById(initValue.id, result).then((res) => {
      if (res.code === SUCCESS_CODE) {
        onFinished()
      } else {
        message.error("创建失败")
      }
    })
  }

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={() => {
          form.validateFields().then(() => {
            updateTestConfigApi()
          })
          // onFinished()
        }}
        onCancel={() => {
          onFinished()
        }}
        okText="确定"
        cancelText="取消"
      >
        <Input value={configName} placeholder="测试任务名称" onChange={(value) => {
          setConfigName(value.target.value)
        }}/>
        <Input value={belongVehicle?.vehicleName} onChange={(value) => {
          const newVehicle: IVehicle = {
            ...belongVehicle,
            vehicleName: value.target.value
          }
          setBelongVehicle(newVehicle)
        }} style={{
          marginTop: 20
        }}
        />
      </Modal>
    </>
  );
}
