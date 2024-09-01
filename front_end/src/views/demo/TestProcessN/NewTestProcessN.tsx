import React, {useEffect, useState} from "react";
import {Button, Input, message, Modal, Row, Select, Table, Tree} from "antd";
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {IProject} from "@/apis/standard/project.ts";
import {ITemplate} from "@/apis/standard/template.ts";
import {getVehicles} from "@/apis/request/vehicle.ts";
import {getProjects} from "@/apis/request/project.ts";
import {getTestTemplateList} from "@/apis/request/template.ts";
import {ITestObjectN} from "@/apis/standard/testObjectN.ts";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {createProcessN} from "@/apis/request/testProcessN.ts";
import {SUCCESS_CODE} from "@/constants";
import {CreateTestVehicleButton} from "@/views/demo/TestProcessN/TestVehicle/TestVehicle.tsx";
import {CreateProjectButton} from "@/views/demo/TestProcessN/TestProject/NewTestProject.tsx";
import {TEMPLATE} from "@/constants/process_hint.ts";
import {generateTreeData} from "@/views/demo/TestProcessN/ProcessNTree.tsx";

interface INewTestProcessNProps {
    onFinish: () => void;
}

const NewTestProcessN: React.FC<INewTestProcessNProps> = ({onFinish}) => {
    const [testProcessN, setTestProcessN] = useState<ITestProcessN>({
        userId: 1,
        testName: '',
        testObjectNs: [],
        template: {} as ITemplate
    })
    const [treeShowData, setTreeShowData] = useState<ITestProcessN>({
        userId: 1,
        testName: '',
        testObjectNs: [],
        template: {} as ITemplate
    });

    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<"show" | "edit">("edit");
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [vehicleList, setVehicleList] = useState<IVehicle[]>([]);
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const [testTemplateList, setTestTemplateList] = useState<ITemplate[]>([]);

    useEffect(() => {
        getVehicles().then((res) => {
            setVehicleList(res.data.filter((item: IVehicle) => !item.isDisabled));
        });
        getProjects().then((res) => {
            setProjectList(res.data);
        });
        getTestTemplateList().then((res) => {
            setTestTemplateList(res.data);
        });
    }, []);

    const check = () => {
        if (!testProcessN?.testName) {
            message.error("测试流程名称不能为空");
            return false;
        }
        if (!testProcessN?.testObjectNs) {
            message.error("测试对象不能为空");
            return false;
        }

        if (!testProcessN?.template) {
            message.error(TEMPLATE + '不能为空');
            return false;
        }

        testProcessN.testObjectNs.forEach((testObject) => {
            if (!testObject.vehicle || !testObject.project) {
                message.error('测试对象信息不完整');
                return false;
            }
        });
        return true;
    }

    const renderCreateConfigTable = () => {
        return <Table
            dataSource={testProcessN?.testObjectNs}
            columns={[
                {
                    title: () => {
                        return <Row align={"middle"} justify={"center"}>
                            <div style={{
                                marginRight: 20
                            }}>车辆
                            </div>
                            <CreateTestVehicleButton onFinished={
                                () => {
                                    getVehicles().then((res) => {
                                        setVehicleList(res.data.filter((item: IVehicle) => !item.isDisabled));
                                    });
                                }
                            } key={new Date().getTime()} vehicles={vehicleList}/>
                        </Row>
                    },
                    dataIndex: 'vehicle.vehicleName',
                    key: 'vehicle.vehicleName',
                    render: (_, __, index) => (
                        <Select onSelect={(value) => {
                            const newTestProcess = testProcessN
                            newTestProcess!.testObjectNs[index].vehicle = vehicleList.find((item) => item.id === value) as IVehicle
                            setTestProcessN(newTestProcess)
                        }}
                                size={'middle'} style={{width: "100%"}}>
                            {vehicleList.map((item) => (
                                <Select.Option key={item.id} value={item.id}>{item.vehicleName}</Select.Option>
                            ))}
                        </Select>
                    )
                },
                {
                    title: () => {
                        return <Row align={"middle"} justify={"center"}>
                            <div style={{
                                marginRight: 20
                            }}>项目
                            </div>
                            <CreateProjectButton onFinished={
                                () => {
                                    getProjects().then((res) => {
                                        setProjectList(res.data);
                                    });
                                }
                            } projects={projectList} key={new Date().getTime()}/>
                        </Row>
                    },
                    dataIndex: 'project.projectName',
                    key: 'project.projectName',
                    render: (_, __, index) => (
                        <Select mode={"multiple"}
                                onChange={(value) => {
                                    const newTestProcess = testProcessN
                                    newTestProcess!.testObjectNs[index].project = value.map((item: number) => projectList.find((project) => project.id === Number(item)) as IProject)
                                    setTestProcessN(newTestProcess)

                                }}
                                size={"middle"} style={{width: "100%"}}>
                            {projectList.map((item) => (
                                <Select.Option key={item.id} value={item.id}>{item.projectName}</Select.Option>
                            ))}
                        </Select>
                    )
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (_, record) => (
                        <span>
                                    <a onClick={() => {
                                        setTestProcessN({
                                            ...testProcessN,
                                            testObjectNs: testProcessN?.testObjectNs?.filter((item) => item !== record)
                                        } as ITestProcessN);
                                    }}>删除</a>
                                </span>
                    ),
                }
            ]}
            rowKey={(_, index) => index ?? 1}
        />
    }

    const updateTreeShowData = () => {
        if (!check()) return;
        setTreeShowData(testProcessN);
    }

    const refresh = () => {
        setTestProcessN({
            userId: 1,
            testName: '',
            testObjectNs: [],
            template: {} as ITemplate
        });
        setTreeShowData({
            userId: 1,
            testName: '',
            testObjectNs: [],
            template: {} as ITemplate
        });
    }

    const filterProcessNSignalId = (testProcessN: ITestProcessN): ITestProcessN => {
        const signalIds: number[] = []

        // 生成独一无二的id，如果原来的id为1有重复，那么之后的id就是1.2342类似的
        const getUniqueId = (pre: number): number => {
            const randomFourNumber = (Math.floor(Math.random() * 9000) + 1000) / 10000;
            const resultId = pre + randomFourNumber

            if (!signalIds.includes(resultId)) {
                return resultId
            } else {
                return getUniqueId(pre)
            }
        }

        testProcessN.testObjectNs.forEach((item) => {
            item.project.forEach(projectItem => {
                projectItem.projectConfig.forEach(projectConfigItem => {
                    if (signalIds.includes(projectConfigItem.signal.id)) {
                        projectConfigItem.signal.id = getUniqueId(projectConfigItem.signal.id)
                    }
                    signalIds.push(projectConfigItem.signal.id)
                })
            })
        })
        console.log("result:" ,JSON.stringify(testProcessN))
        return testProcessN
    }

    return (
        <div>
            <div>
                <Button type="primary" onClick={() => {
                    setVisible(true);
                    setModalType('edit');
                }}>新建</Button>
            </div>
            <Modal
                width={1200}
                title={modalType === 'show' ? '展示' : '编辑'}
                open={visible}
                onOk={() => {
                    if (!check()) return;
                    setConfirmLoading(true);
                    createProcessN(filterProcessNSignalId(testProcessN)).then((res) => {
                        if (res.code === SUCCESS_CODE) {
                            message.success('创建成功');
                            setVisible(false);
                            setTestProcessN({} as ITestProcessN);
                            setConfirmLoading(false);
                            onFinish();
                            return
                        }
                        message.error('创建失败');
                        setConfirmLoading(false);
                    }).catch((err) => {
                        message.error('创建失败', err.toString());
                        setConfirmLoading(false);
                    });
                }}
                onCancel={() => {
                    setVisible(false);
                    refresh();
                }}
                confirmLoading={confirmLoading}
            >
                <Input
                    prefix="测试配置名称："
                    defaultValue={testProcessN?.testName} disabled={modalType === 'show'}
                    onChange={(e) => {
                        setTestProcessN({...testProcessN, testName: e.target.value} as ITestProcessN);
                    }} placeholder="请输入测试配置名称"/>
                {TEMPLATE}：
                <Select
                    placeholder={'请选择' + TEMPLATE}
                    onSelect={(value) => {
                        const newTestProcess = testProcessN
                        newTestProcess!.template = testTemplateList.find((item) => item.id === value) as ITemplate
                        setTestProcessN(newTestProcess)
                    }} size={'middle'} style={{
                    width: 200,
                    marginTop: 20,
                    marginBottom: 20
                }}>
                    {testTemplateList.map((item) => (
                        <Select.Option key={item.id} value={item.id}>{item.name}-{item.id}</Select.Option>
                    ))}
                </Select>
                <Button onClick={updateTreeShowData}>更新树</Button>
                <Row>
                    <div style={{marginBottom: 20, flex: 1}}>
                        {renderCreateConfigTable()}
                    </div>
                    <div style={{flex: 0.6}}>
                        <Tree
                            className="draggable-tree"
                            blockNode
                            treeData={generateTreeData(treeShowData)}
                            draggable={false}
                        />
                    </div>
                </Row>
                <Button onClick={() => {
                    setTestProcessN({
                        ...testProcessN,
                        testObjectNs: [...testProcessN?.testObjectNs || [], {} as ITestObjectN]
                    } as ITestProcessN);
                }}>添加测试对象</Button>
            </Modal>
        </div>
    );
}

export default NewTestProcessN;
