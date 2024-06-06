import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Select, Table} from "antd";
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

interface INewTestProcessNProps {
    onFinish: () => void;
}

const NewTestProcessN: React.FC<INewTestProcessNProps> = ({onFinish}) => {
    const [testProcessN, setTestProcessN] = useState<ITestProcessN>()

    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<'show' | 'edit'>('edit');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [vehicleList, setVehicleList] = useState<IVehicle[]>([]);
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const [testTemplateList, setTestTemplateList] = useState<ITemplate[]>([]);

    useEffect(() => {
        getVehicles().then((res) => {
            setVehicleList(res.data.filter((item:IVehicle) => !item.isDisabled));
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
            message.error('测试流程名称不能为空');
            return false;
        }
        if (!testProcessN?.testObjectNs) {
            message.error('测试对象不能为空');
            return false;
        }

        if (!testProcessN?.template) {
            message.error('测试模板不能为空');
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

    return (
        <div>
            <div>
                <Button type="primary" onClick={() => {
                    setVisible(true);
                    setModalType('edit');
                }}>新建</Button>
            </div>
            <Modal
                width={800}
                title={modalType === 'show' ? '展示' : '编辑'}
                open={visible}
                onOk={() => {
                    if (!check()) return;
                    setConfirmLoading(true);
                    createProcessN(testProcessN!).then((res) => {
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
                        message.error('创建失败');
                        setConfirmLoading(false);
                    });
                }}
                onCancel={() => {
                    setVisible(false);
                    setTestProcessN({} as ITestProcessN);
                }}
                confirmLoading={confirmLoading}
            >
                <Input
                    prefix="测试流程名称："
                    value={testProcessN?.testName} disabled={modalType === 'show'}
                    onChange={(e) => {
                        setTestProcessN({...testProcessN, testName: e.target.value} as ITestProcessN);
                    }} placeholder="请输入测试流程名称"/>
                测试模板：
                <Select
                    placeholder={'请选择测试模板'}
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
                        <Select.Option value={item.id}>{item.name}</Select.Option>
                    ))}
                </Select>
                <Table
                    dataSource={testProcessN?.testObjectNs}
                    columns={[
                        {
                            title: '车辆',
                            dataIndex: 'vehicle.vehicleName',
                            key: 'vehicle.vehicleName',
                            render: (value, record, index) => (
                                <Select onSelect={(value) => {
                                    const newTestProcess = testProcessN
                                    newTestProcess!.testObjectNs[index].vehicle = vehicleList.find((item) => item.id === value) as IVehicle
                                    setTestProcessN(newTestProcess)
                                }}
                                        size={'middle'} style={{width: 200}}>
                                    {vehicleList.map((item) => (
                                        <Select.Option value={item.id}>{item.vehicleName}</Select.Option>
                                    ))}
                                </Select>
                            )
                        },
                        {
                            title: '项目',
                            dataIndex: 'project.projectName',
                            key: 'project.projectName',
                            render: (value, record, index) => (
                                <Select mode={"multiple"} onSelect={(value) => {
                                    const newTestProcess = testProcessN
                                    newTestProcess!.testObjectNs[index].project = projectList.find((item) => item.id === value) as IProject
                                    setTestProcessN(newTestProcess)
                                }} size={"middle"} style={{width: 200}}>
                                    {projectList.map((item) => (
                                        <Select.Option value={item.id}>{item.projectName}</Select.Option>
                                    ))}
                                </Select>
                            )
                        },

                        {
                            title: '操作',
                            key: 'action',
                            render: (text, record) => (
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
                />
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