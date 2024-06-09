import React, {useEffect} from 'react';
import {Button, message, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import NewTestProcessN from "@/views/demo/TestProcessN/NewTestProcessN.tsx";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {deleteProcessN, getProcessNList} from "@/apis/request/testProcessN.ts";
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
        render: (_, record) => (
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
        const testProcessNRecord = JSON.stringify(record)
        const model = NewTestTemplateMode.SHOW

        return (
            <Space>
                <Button type="link"
                        href={`/test-template-config?testProcessNRecord=${testProcessNRecord}&model=${model}`}
                        target={"_blank"}>前往配置采集关系</Button>
                <Button type={"link"} onClick={() => {
                    if (!confirm(PROCESS_CONFIG_HINT)) return
                    window.open(`/test-template-config?testProcessNRecord=${testProcessNRecord}&model=${model}`)
                }}>{DOWN}</Button>
                <ProcessNTree record={record}/>
                <Button type="primary" danger={true} onClick={() => {
                    if (prompt("请输入 delete 来确认删除") !== "delete") return
                    deleteProcessN(record.id!).then(res => {
                        if (res.code !== SUCCESS_CODE) {
                            message.error(res.message);
                            return;
                        }
                        fetchTestProcessN()
                    })
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
            <Table columns={newColumns} dataSource={processNList} rowKey={(value) => {
                return value.id ?? value.testName
            }}/>
        </div>
    )
}

export default TestProcessN;