import React, {useEffect} from 'react';
import {Button, message, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {IProject} from "@/apis/standard/project.ts";
import NewTestProcessN from "@/views/demo/TestProcessN/NewTestProcessN.tsx";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {getTestProcess} from "@/apis/standard/test.ts";
import {deleteProcessN, getProcessNById, getProcessNList} from "@/apis/request/testProcessN.ts";
import {DELETE, SUCCESS_CODE} from "@/constants";
import ProcessNTree from "@/views/demo/TestProcessN/ProcessNTree.tsx";
import {NewTestTemplateMode} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";

const SEE_DETAIL = "查看详情"
const DOWN = "下发"


const columns: TableProps<ITestProcessN>['columns'] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "配置名称",
        dataIndex: "testName",
        key: "testName",
        render: (value, record, index) => (
            <Space>
                <span>{record.testName}</span>
            </Space>
        )
    },
    {
        title: "测试车辆(名称)",
        dataIndex: "vehicle",
        key: "vehicle",
        render: (value, record, index) => (
            <Space>
                {record.testObjectNs.slice(0, 4).map((testObject, idnex) => (
                    <span key={index}>{`${testObject.vehicle.vehicleName} `}</span>
                ))}
            </Space>
        )
    },
    {
        title: "测试模板(名称 - ID)",
        dataIndex: "template",
        key: "template",
        render: (value, record, index) => (
            <Space>
                <span>{`${record.template.name} - ${record.template.id}`}</span>
            </Space>
        )
    },
    {
        //操作
        title: "操作",
        key: "action",
    }
];

const TestProcessN: React.FC = () => {
    const [processNList, setProcessNList] = React.useState<ITestProcessN[]>([]);

    const ActionButtons = (record: ITestProcessN) => {
        const templateRecord = JSON.stringify(record.template)
        const model = NewTestTemplateMode.CONFIG

        return (
            <Space>
                <Button type="link"
                        href={`/test-template-config?templateRecord=${templateRecord}&model=${model}`}
                        target={"_blank"}>前往配置采集关系</Button>

                <ProcessNTree record={record}/>
                <Button type={"primary"}>{DOWN}</Button>
                <Button type="primary" danger={true} onClick={() => {
                    if (prompt("请输入 delete 来确认删除") === "delete") {
                        deleteProcessN(record.id!).then(res => {
                            if (res.code !== SUCCESS_CODE) {
                                message.error(res.message);
                                return;
                            }
                        })
                        return
                    }
                    message.error("删除失败")
                }}>{DELETE}</Button>
            </Space>
        )
    }
    const newColumns = columns.map(col => {
        if (col.key === 'action') {
            return {
                ...col,
                render: (value: unknown, record: ITestProcessN) => ActionButtons(record)
            }
        }
        return col;
    });

    const fetchTestProcessN = () => {
        getProcessNList().then(res => {
            if (res.code !== SUCCESS_CODE) {
                message.error(res.message);
                return;
            }
            setProcessNList(res.data);
        })
    }

    useEffect(() => {
        fetchTestProcessN();
    }, []);

    return (
        <div style={{padding: 20}}>
            <div style={{
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <NewTestProcessN onFinish={fetchTestProcessN}/>
            </div>
            <Table columns={newColumns} dataSource={processNList}/>
        </div>
    )
}

export default TestProcessN;