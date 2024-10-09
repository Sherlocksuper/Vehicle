import {Button, Divider, Form, Input, Modal, Select, Space, Tree, TreeDataNode} from "antd";
import React, {useEffect} from "react";
import {ITestConfig} from "@/apis/standard/test.ts";
import {DeleteFilled, DeleteOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {getVehicles} from "@/apis/request/vehicle.ts";
import {SUCCESS_CODE} from "@/constants";
import {createTestConfig} from "@/apis/request/testConfig.ts";
import {parseToObject} from "@/utils";

export const TestConfigModel = ({open, close, onOk, initValue}: {
  // 外面的状态
  open: boolean,
  close: () => void
  initValue?: ITestConfig
  onOk?: () => void,
}) => {


  const [form] = Form.useForm();
  const [vehicles, setVehicles] = React.useState<IVehicle[]>([])
  const [vehicleHasSelected, setVehicleHasSelected] = React.useState<IVehicle[]>([])

  const fetchData = () => {
    getVehicles().then(res => {
      if (res.code === SUCCESS_CODE) {
        setVehicles(res.data)
        const vehicle = res.data[0]
        console.log(vehicle)
      } else {
        console.error("请求车辆数据失败，请重试：", res.msg)
      }
    })
  }


  useEffect(() => {
    fetchData()
    return () => {
      form.resetFields()
    }
  }, [form])

  const handleOk = () => {
    form.validateFields().then(() => {
      // 把每个config的vehicle部分JSON.parse
      form.setFieldsValue({
        configs: form.getFieldsValue().configs.map(config => {
          return {
            ...config,
            vehicle: JSON.parse(config.vehicle)
          }
        })
      })

      // 把每个config的projects的indicators的signal部分JSON.parse
      form.setFieldsValue({
        configs: form.getFieldsValue().configs.map(config => {
          return {
            ...config,
            projects: config.projects.map(project => {
              return {
                ...project,
                indicators: project.indicators.map(indicator => {
                  return {
                    ...indicator,
                    signal: JSON.parse(indicator.signal)
                  }
                })
              }
            })
          }
        })
      })
      console.log(form.getFieldsValue())

      createTestConfig(form.getFieldsValue()).then(res => {
        if (res.code === SUCCESS_CODE) {
          form.resetFields()
          onOk && onOk()
          close()
        } else {
          console.error("创建测试任务失败，请重试：" + res.msg)
        }
      })
    })
  };


  const handleCancel = () => {
    form.resetFields()
    close()
  };


  return (
    <>
      <Modal
        open={open}
        onOk={handleOk}
        onCancel={()=>{
          handleCancel()
        }}
        okText="确定"
        cancelText="取消"
        width={"80%"}
      >
        {
          initValue !== undefined ? <TestConfigTree testConfig={initValue}/> :
            <Form form={form}>
              <Form.Item name={"name"} rules={[{required: true, message: 'Missing test config name'}]}>
                <Input placeholder="Test config name"/>
              </Form.Item>
              <Form.List name={['configs']}>
                {(fields, {add, remove}) => (
                  <>
                    {fields.map(({key, name, fieldKey, ...restField}) => {
                      const configIndex = name
                      return (
                        <Space key={key}
                               style={{display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start'}}
                        >
                          <Form.Item
                            {...restField}
                            name={[configIndex, 'vehicle']}
                            rules={[{required: true, message: 'Missing vehicle'}]}
                          >
                            <Select placeholder={"Select vehicle"}
                                    onChange={() => {
                                      const formValue = form.getFieldsValue()
                                      const currentVehicles = formValue.configs.map(config => parseToObject(config.vehicle))
                                      setVehicleHasSelected(currentVehicles.filter(vehicle => vehicle !== undefined))
                                    }}>
                              {vehicles.map(vehicle => (
                                <Select.Option key={vehicle.id} value={JSON.stringify(vehicle)}>{vehicle.vehicleName}</Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.List name={[configIndex, 'projects']}>
                            {(fields, {add, remove}) => (
                              <>
                                {fields.map(({key, name, fieldKey, ...restField}) => {
                                  const projectIndex = name
                                  return (
                                    <Space key={key} style={{display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start',}}>
                                      <Form.Item {...restField} name={[projectIndex, 'name']} rules={[{required: true, message: 'Missing project name'}]}>
                                        <Input placeholder="Project name"/>
                                      </Form.Item>
                                      <Form.List name={[projectIndex, 'indicators']}>
                                        {(fields, {add, remove}) => (
                                          <>
                                            {fields.map(({key, name, fieldKey, ...restField}) => {
                                              const indicatorIndex = name
                                              return (
                                                <Space key={key}
                                                       style={{display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'start',}}>
                                                  <Space key={key}
                                                         style={{display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'start'}}>
                                                    <Form.Item {...restField} name={[indicatorIndex, 'name']}
                                                               rules={[{required: true, message: 'Missing indicator name'}]}>
                                                      <Input placeholder="Indicator name"/>
                                                    </Form.Item>
                                                    <Form.Item {...restField} name={[indicatorIndex, 'signal']} fieldKey={[fieldKey, 'signal']}
                                                               rules={[{required: true, message: 'Missing signal'}]}>

                                                      <Select placeholder="Select signal"
                                                              style={{
                                                                width: 200
                                                              }}
                                                      >
                                                        {
                                                          vehicleHasSelected.find(vehicle => vehicle.id === parseToObject(form.getFieldValue(['configs', configIndex, 'vehicle']))?.id)?.protocols.map(protocol => {
                                                            const vehicle =  vehicleHasSelected.find(vehicle => vehicle.id === parseToObject(form.getFieldValue(['configs', configIndex, 'vehicle']))?.id)
                                                            return (
                                                              protocol.protocol.signalsParsingConfig.map(parsingConfig => (
                                                                parsingConfig.signals.map(signal => {
                                                                  signal.belongVehicle = vehicle.vehicleName
                                                                  return (
                                                                    <Select.Option key={signal.id}
                                                                                   value={JSON.stringify(signal)}>{ protocol.protocol.protocolName + ": " + signal.name}</Select.Option>
                                                                  )
                                                                })
                                                              ))
                                                            )
                                                          })
                                                        }
                                                      </Select>
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} disabled={initValue !== undefined}/>
                                                  </Space>
                                                </Space>
                                              )
                                            })}
                                            <Form.Item>
                                              <Button type="dashed" onClick={() => {
                                                add()
                                              }}
                                                      disabled={initValue !== undefined}
                                              >
                                                <PlusOutlined/> Add indicator
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
                                    <PlusOutlined/> Add project
                                  </Button>
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                          <DeleteFilled onClick={() => remove(name)} disabled={initValue !== undefined}/>
                          <Divider/>
                        </Space>
                      )
                    })}

                    <Form.Item>
                      <Button type="dashed" onClick={() => {
                        add()
                      }}
                              disabled={initValue !== undefined}
                      >
                        <PlusOutlined/> Add Vehicle
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form>

        }
      </Modal>
    </>
  );
};

export const TestConfigTree = ({testConfig}: { testConfig: ITestConfig }) => {

  const calculateTreeNode = (testConfig: ITestConfig) => {
    const treeData: TreeDataNode[] = []
    testConfig.configs[0].projects
    testConfig.configs.forEach(config => {
      const configNode: TreeDataNode = {
        title: config.vehicle.vehicleName,
        key: config.vehicle.id.toString(),
        children: []
      }

      config.projects.forEach(project => {
        const projectNode: TreeDataNode = {
          title: project.name,
          key: project.name,
          children: []
        }

        project.indicators.forEach(indicator => {
          const indicatorNode: TreeDataNode = {
            title: indicator.name + " - " + indicator.signal.name,
            key: indicator.name,
          }
          projectNode.children.push(indicatorNode)
        })

        configNode.children.push(projectNode)
      })

      treeData.push(configNode)
    })

    return treeData
  }

  return (
    <Tree
      treeData={calculateTreeNode(testConfig)}
    />
  )
}


