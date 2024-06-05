import {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Select, Table} from "antd";
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {IProject} from "@/apis/standard/project.ts";
import {ITemplate} from "@/apis/standard/template.ts";
import {getVehicles} from "@/apis/request/vehicle.ts";
import {getProjects} from "@/apis/request/project.ts";
import {getTestTemplateList} from "@/apis/request/template.ts";
import {ITestObjectN} from "@/apis/standard/testObjectN.ts";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";

const NewTestProcessN = () => {
    const [testProcessN, setTestProcessN] = useState<ITestProcessN>()

    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<'show' | 'edit'>('edit');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [vehicleList, setVehicleList] = useState<IVehicle[]>([]);
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const [testTemplateList, setTestTemplateList] = useState<ITemplate[]>([]);

    useEffect(() => {
        getVehicles().then((res) => {
            setVehicleList(res.data);
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
        if (!testProcessN?.testObjects) {
            message.error('测试对象不能为空');
            return false;
        }

        testProcessN.testObjects.forEach((testObject) => {
            if (!testObject.title || !testObject.vehicle || !testObject.project || !testObject.template) {
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
                    setTimeout(() => {
                        setVisible(false);
                        setConfirmLoading(false);
                    }, 2000);
                }}
                onCancel={() => {
                    setVisible(false);
                    setTestProcessN({} as ITestProcessN);
                }}
                confirmLoading={confirmLoading}
            >
                <Input value={testProcessN?.testName} disabled={modalType === 'show'}
                       onChange={(e) => {
                           setTestProcessN({...testProcessN, testName: e.target.value} as ITestProcessN);
                       }} placeholder="请输入测试流程名称"/>
                <Table
                    dataSource={testProcessN?.testObjects}
                    columns={[
                        {
                            title: '车辆',
                            dataIndex: 'vehicle.vehicleName',
                            key: 'vehicle.vehicleName',
                            render: (value, record, index) => (
                                <Select onSelect={(value) => {
                                    const newTestProcess = testProcessN
                                    newTestProcess!.testObjects[index].vehicle = vehicleList.find((item) => item.id === value) as IVehicle
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
                                    newTestProcess!.testObjects[index].project = projectList.find((item) => item.id === value) as IProject
                                    setTestProcessN(newTestProcess)
                                }} size={"middle"} style={{width: 200}}>
                                    {projectList.map((item) => (
                                        <Select.Option value={item.id}>{item.projectName}</Select.Option>
                                    ))}
                                </Select>
                            )
                        },
                        {
                            title: '模板',
                            dataIndex: 'template.name',
                            key: 'template.name',
                            render: (value, record, index) => (
                                <Select onSelect={(value) => {
                                    const newTestProcess = testProcessN
                                    newTestProcess!.testObjects[index].template = testTemplateList.find((item) => item.id === value) as ITemplate
                                    setTestProcessN(newTestProcess)
                                }} size={"middle"} style={{width: 200}}>
                                    {testTemplateList.map((item) => (
                                        <Select.Option value={item.id}>{item.name}</Select.Option>
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
                                            testObjects: testProcessN?.testObjects?.filter((item) => item !== record)
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
                        testObjects: [...testProcessN?.testObjects || [], {} as ITestObjectN]
                    } as ITestProcessN);
                }}>添加测试对象</Button>
            </Modal>
        </div>
    );
}

export default NewTestProcessN;