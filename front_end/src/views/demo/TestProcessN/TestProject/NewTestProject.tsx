import {Button, Form, Input, Modal, Select, Space} from "antd";
import React, {useEffect} from "react";
import {ITestProcess} from "@/apis/standard/test.ts";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {getCollectorList, getControllerList, getSignalListByCollectorId} from "@/apis/request/test.ts";
import {IProject} from "@/apis/standard/project.ts";
import {IcollectorsConfigItem, IcontrollersConfigItem, IsignalsConfigItem} from "@/views/demo/Topology/PhyTopology.tsx";

interface CreateProjectProps {
    open: boolean,
    mode: "create" | "edit" | "show"
    onFinished: (newTest?: ITestProcess) => void
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
 * @constructor
 */

const CreateProject: React.FC<CreateProjectProps> = ({open, mode, onFinished}) => {
    const [form] = Form.useForm<IProject>();

    const [controllerList, setControllerList] = React.useState<IcontrollersConfigItem[]>([])
    const [collectorList, setCollectorList] = React.useState<IcollectorsConfigItem[]>([])
    const [signalList, setSignalList] = React.useState<IsignalsConfigItem[]>([])


    const [selectedCollector, setSelectedCollector] = React.useState<string | null>(null);
    const [singleKey, setSingleKey] = React.useState<string | null>(null);

    const getController = async () => {
        const res = await getControllerList()
        setControllerList(res.data)
    }

    const getCollector = async () => {
        const res = await getCollectorList()
        setCollectorList(res.data)
    }

    const getSignalList = async (collectorId: number) => {
        const res = await getSignalListByCollectorId(collectorId)
        setSignalList(res.data)
    }

    useEffect(() => {
        form.resetFields()
        setSingleKey(Math.random().toString(36).slice(-8))
        getController()
        getCollector()
    }, [])


    const handleSubmit = () => {
        form.validateFields().then(values => {
            console.log(values);
            onFinished();
        });
    };

    return (
        <Modal
            visible={open}
            title={generateTitle(mode)}
            onOk={handleSubmit}
            onCancel={() => {
                onFinished()
            }}
        >
            <Form form={form}>
                <Form.Item name="projectName" label="项目名称" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.List name="testIndicators">
                    {(fields, {add, remove}) => (
                        <>
                            {fields.map((field, index) => (
                                <Space key={field.key + index} style={{display: 'flex', marginBottom: 8}}
                                       align="baseline">
                                    <Form.Item
                                        {...field}
                                        key={field.key + "controller"}
                                        name={[field.name, 'controller']}
                                        rules={[{required: true, message: '请选择控制器'}]}
                                    >
                                        <Select
                                            placeholder="请选择控制器">{
                                            controllerList.map(item => {
                                                return <Select.Option key={"controller" + item.id}
                                                                      value={item.id}>{item.controllerName}</Select.Option>
                                            })
                                        }</Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        key={field.key + "collector"}
                                        name={[field.name, 'collector']}
                                        rules={[{required: true, message: '请选择采集器'}]}
                                    >
                                        <Select
                                            placeholder="请选择采集器"
                                            onChange={(value: string) => {
                                                console.log(field.name)
                                                console.log(form.getFieldValue([field.name, 'single']))
                                                setSelectedCollector(value)
                                                setSingleKey(Math.random().toString(36).slice(-8))
                                                getSignalList(parseInt(value))
                                            }}
                                        >
                                            {
                                                collectorList.map(item => {
                                                    return <Select.Option key={"collector" + item.id}
                                                                          value={item.id}>{item.collectorName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        key={field.key + "single"}
                                        name={[field.name, 'single']}
                                        rules={[{required: true, message: '请选择指标'}]}
                                        dependencies={[field.name, 'collector']}
                                    >
                                        <Select placeholder="请选择指标" disabled={!selectedCollector} key={singleKey}>
                                            {signalList.map(item => {
                                                return <Select.Option key={"signal" + item.id}
                                                                      value={item.id}>{item.signalName}</Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
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