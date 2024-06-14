import {Button, Form, Input, Modal, Select, Space} from "antd";
import React, {useEffect} from "react";
import {ITestProcess} from "@/apis/standard/test.ts";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {IProject} from "@/apis/standard/project.ts";
import {ICollectorsConfigItem, IControllersConfigItem, ISignalsConfigItem} from "@/views/demo/Topology/PhyTopology.tsx";
import {createProject} from "@/apis/request/project.ts";
import {SUCCESS_CODE} from "@/constants";
import {getSignalListByCollectorId} from "@/apis/request/board-signal/signal.ts";
import {getActiveControllerList} from "@/apis/request/board-signal/controller.ts";
import {getActiveCollectorList} from "@/apis/request/board-signal/collector.ts";

interface CreateProjectProps {
    open: boolean,
    mode: "create" | "edit" | "show"
    onFinished: (newTest?: ITestProcess) => void
    disable: boolean
    initValue: string
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

const CreateProject: React.FC<CreateProjectProps> = ({open, mode, onFinished, disable, initValue}) => {
    const [form] = Form.useForm<IProject>();

    const [controllerList, setControllerList] = React.useState<IControllersConfigItem[]>([])
    const [collectorList, setCollectorList] = React.useState<ICollectorsConfigItem[]>([])
    const [signalList, setSignalList] = React.useState<ISignalsConfigItem[]>([])


    const [selectedCollector, setSelectedCollector] = React.useState<boolean>(false);
    const [singleKey, setSingleKey] = React.useState<string | null>(null);
    const [projectResult, setProjectResult] = React.useState<IProject | null>(null)

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

    const newProject = async (value: IProject) => {
        createProject(value).then(res => {
            if (res.code === SUCCESS_CODE) {
                onFinished()
            } else {
                console.log(res)
            }
        })
    }

    useEffect(() => {
        if (disable) {
            setProjectResult(JSON.parse(initValue))
        } else {
            form.resetFields()
            setSingleKey(Math.random().toString(36).slice(-8))
            getController()
            getCollector()
        }
    }, [disable])


    const handleSubmit = () => {
        if (disable) {
            onFinished()
            return
        }

        form.validateFields().then(() => {
            newProject(projectResult as IProject)
        });
    };

    return (
        <Modal
            open={open}
            title={generateTitle(mode)}
            onOk={handleSubmit}
            onCancel={() => {
                onFinished()
            }}
        >
            <Form form={form} disabled={disable} initialValues={disable ? JSON.parse(initValue) : undefined}
                  name="projectForm">
                <Form.Item name="projectName" label="项目名称" rules={[{required: true}]}>
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
                                            const item = JSON.parse(value) as IControllersConfigItem;
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
                                                const item: ICollectorsConfigItem = JSON.parse(value);

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
                                                const item = JSON.parse(value) as ISignalsConfigItem;
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
                                            controller: {} as IControllersConfigItem,
                                            collector: {} as ICollectorsConfigItem,
                                            signal: {} as ISignalsConfigItem
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

export default CreateProject;