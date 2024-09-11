import {Button, Form, Input, message, Modal, Select, Space} from "antd";
import React, {useEffect} from "react";
import {ITestProcess} from "@/apis/standard/test.ts";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {IProject} from "@/apis/standard/project.ts";
import {ICollector, IController, ISignal} from "@/views/demo/Topology/PhyTopology.tsx";
import {createProject, getProjects} from "@/apis/request/project.ts";
import {SUCCESS_CODE} from "@/constants";
import {getSignalListByCollectorId} from "@/apis/request/board-signal/signal.ts";
import {getActiveControllerList} from "@/apis/request/board-signal/controller.ts";
import {getActiveCollectorList} from "@/apis/request/board-signal/collector.ts";
import { RuleObject } from "antd/es/form";

interface CreateProjectProps {
    open: boolean,
    mode: "create" | "edit" | "show"
    onFinished: (newTest?: ITestProcess) => void
    disable: boolean
    initValue: string
    projects:IProject[]
}

/**
 * 创建测试项目，需要包含：
 * 项目名称、测试指标，
 * 控制器、采集器、单板
 * 其中 项目名称通过input输入，
 * 控制器、采集器、单板通过下拉框选择
 * @param open
 * @param mode
 * @param onFinished
 * @param disable
 * @param initValue
 * @constructor
 */

const ProjectManage: React.FC<CreateProjectProps> = ({open, mode, onFinished, disable, initValue, projects}) => {
    const [form] = Form.useForm<IProject>();
    const [controllerList, setControllerList] = React.useState<IController[]>([])
    const [collectorList, setCollectorList] = React.useState<ICollector[]>([])
    const [signalList, setSignalList] = React.useState<ISignal[]>([])
    const [projectList, setProjectList] = React.useState<IProject[]>([])


    const [selectedCollector, setSelectedCollector] = React.useState<boolean>(false);
    const [singleKey, setSingleKey] = React.useState<string | null>(null);
    const [projectResult, setProjectResult] = React.useState<IProject | null>(null)

    const ref = React.useRef(null)


    const getController = async () => {
        const res = await getActiveControllerList()
        setControllerList(res.data)
    }

    const getCollector = async () => {
        const res = await getActiveCollectorList()
        setCollectorList(res.data)
    }

    const getSignalList = async (collectorId: number) => {
        const res = await getSignalListByCollectorId(collectorId)
        setSignalList(res.data)
    }

    const getProjectList = async () => {
        const res = await getProjects()
        setProjectList(res.data)
    }

    const clear = () => {
        setSelectedCollector(false)
        setSingleKey(null)
        setProjectResult(null)
        form.resetFields()
    }

    const newProject = async (value: IProject) => {
        const checkMap = value.projectConfig.map((item) => item.signal.signalAttribute)
        if (new Set(checkMap).size !== checkMap.length) {
            message.error("测试指标属性不可重复")
            return false
        }

        createProject(value).then(res => {
            if (res.code === SUCCESS_CODE) {
                message.success("创建成功")
                onFinished()
            } else {
                console.log(res)
            }
        })
        return true
    }

    useEffect(() => {
        if (disable) {
            setProjectResult(JSON.parse(initValue))
        } else {
            form.resetFields()
            setSingleKey(Math.random().toString(36).slice(-8))
            getController()
            getCollector()
            getProjectList()
        }
    }, [disable])

    const handleSubmit = () => {
        if (disable) {
            onFinished()
            return
        }

        form.validateFields().then(() => {
            newProject(projectResult as IProject).then((value) => {
                if (value){
                    onFinished()
                    clear()
                    form.resetFields()
                }
            })
        });
    };

    const isSameName = (projects: IProject[], thisProject: string) => {
      for (const value of projects)
        if (value.projectName == thisProject) return true;
      return false;
    };

    const validateProjectData = async (_: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(new Error("请输入项目名称!"));
      } else if (isSameName(projects, value)) {
        return Promise.reject(new Error("不能与列表内已有项目重名!"));
      } else {
        return Promise.resolve();
      }
    };

    return (
        <Modal
            open={open}
            title={generateTitle(mode)}
            onOk={() => {
                handleSubmit()
            }}
            onCancel={() => {
                onFinished()
                clear()
            }}
        >
            <Form form={form} disabled={disable} initialValues={disable ? JSON.parse(initValue) : undefined}
                  name="projectForm">
                <Button type="primary" onClick={() => {
                    clear()
                    if (ref.current) {
                        // @ts-ignore
                        ref.current!.value = null
                    }
                }}>清空选择</Button>
                <Select
                    defaultValue={null}
                    ref={ref}
                    placeholder={"选择以从现有项目拷贝"}
                    onChange={(value) => {
                        const newProjectResult = {...projectList.find(item => item.id === value) as IProject}
                        newProjectResult.id = undefined
                        setProjectResult(newProjectResult)
                        form.setFieldsValue(newProjectResult)
                    }}
                    size={"middle"} style={{
                    width: "100%", marginTop: 10, marginBottom: 10
                }}>
                    {projectList.map((item) => (
                        <Select.Option key={item.id} value={item.id}>{item.projectName}</Select.Option>
                    ))}
                </Select>
                <Form.Item name="projectName" label="项目名称" rules={[{ validator: validateProjectData }]}>
                    <Input onChange={(e) => {
                        const newProjectResult = {...projectResult} as IProject
                        newProjectResult.projectName = e.target.value
                        setProjectResult(newProjectResult)
                    }}/>
                </Form.Item>
                <Form.List name="projectConfig">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => (
                                <Space key={field.key + index} style={{display: 'flex', marginBottom: 8}}
                                       align="baseline">
                                    <Form.Item
                                        {...field}
                                        key={field.key + "controller"}
                                        name={[field.name, 'controller', 'controllerName']}
                                        rules={[{required: true, message: '请选择控制器'}]}
                                    >
                                        <Select placeholder="请选择控制器" onSelect={(value) => {
                                            const item = JSON.parse(value) as IController;
                                            const newProjectResult = {...projectResult} as IProject
                                            newProjectResult.projectConfig[index].controller = item

                                            setProjectResult(newProjectResult)
                                        }}>
                                            {
                                                controllerList.map(item => {
                                                    const itemStr = JSON.stringify(item);
                                                    return <Select.Option key={"controller" + item.id}
                                                                          value={itemStr}>{item.controllerName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        key={field.key + "collector"}
                                        name={[field.name, 'collector', 'collectorName']}
                                        rules={[{required: true, message: '请选择采集器'}]}
                                    >
                                        <Select
                                            placeholder="请选择采集器"
                                            onChange={(value: string) => {
                                                const item: ICollector = JSON.parse(value);

                                                const newProjectResult = {...projectResult} as IProject
                                                newProjectResult.projectConfig[index].collector = item
                                                setProjectResult(newProjectResult)

                                                setSelectedCollector(true)
                                                setSingleKey(Math.random().toString(36).slice(-8))
                                                getSignalList(item.id)
                                            }}
                                        >
                                            {
                                                collectorList.map(item => {
                                                    const itemStr = JSON.stringify(item);
                                                    return <Select.Option key={"collector" + item.id}
                                                                          value={itemStr}>{item.collectorName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        key={field.key + "signal"}
                                        name={[field.name, 'signal', 'signalName']}
                                        rules={[{required: true, message: '请选择指标'}]}
                                        dependencies={[field.name, 'collector']}
                                    >

                                        <Select
                                            placeholder="请选择指标"
                                            disabled={disable || !selectedCollector}
                                            key={singleKey}
                                            onSelect={(value) => {
                                                const item = JSON.parse(value) as ISignal;
                                                const newProjectResult = {...projectResult} as IProject
                                                newProjectResult.projectConfig[index].signal = item
                                                setProjectResult(newProjectResult)
                                            }}
                                        >
                                            {
                                                signalList.map(item => {
                                                    const itemStr = JSON.stringify(item);
                                                    return <Select.Option key={"signal" + item.id}
                                                                          value={itemStr}>{item.signalName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => {
                                        if (disable) return
                                        remove(field.name)
                                        const newProjectResult = {...projectResult} as IProject
                                        newProjectResult.projectConfig.splice(index, 1)
                                        setProjectResult(newProjectResult)
                                    }}/>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button disabled={disable} type="dashed" onClick={() => {
                                    add()
                                    setProjectResult({
                                        ...projectResult,
                                        projectConfig: [...projectResult?.projectConfig || [], {
                                            controller: {} as IController,
                                            collector: {} as ICollector,
                                            signal: {} as ISignal
                                        }]
                                    } as IProject)
                                }} block icon={<PlusOutlined/>}>
                                    添加测试指标
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

function generateTitle(mode: 'create' | 'edit' | 'show') {
    switch (mode) {
        case 'create':
            return '创建测试项目';
        case 'edit':
            return '编辑测试项目';
        case 'show':
            return '查看测试项目';
        default:
            return '';
    }
}

export default ProjectManage;

export const CreateProjectButton: React.FC<{ onFinished: () => void,projects:IProject[] }> = ({onFinished,projects}) => {
    const [open, setOpen] = React.useState<boolean>(false)

    return <>
        <Button type="primary" onClick={() => {
            setOpen(true)
        }}>新建测试项目</Button>
        <ProjectManage open={open} mode={"create"} onFinished={() => {
            onFinished()
            setOpen(false)
        }} disable={false} initValue={""} projects={projects}/>
    </>
}

export const ShowProjectButton: React.FC<{ initValue: string,projects:IProject[]}> = ({initValue,projects}) => {
    const [open, setOpen] = React.useState<boolean>(false)
    let mode: "create" | "edit" | "show" = "show"
    if (initValue) mode = "show"

    return <>
        <Button type="link" onClick={() => {
            setOpen(true)
        }}>查看测试项目</Button>
        <ProjectManage open={open} mode={"show"} projects={projects} onFinished={() => {
            setOpen(false)
        }} disable={mode === "show"} initValue={initValue} key={new Date().getTime()}/>
    </>
}
