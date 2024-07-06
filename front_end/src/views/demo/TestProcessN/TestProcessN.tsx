import React, {useEffect} from 'react';
import {Button, message, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import NewTestProcessN from "@/views/demo/TestProcessN/NewTestProcessN.tsx";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {
    checkCurrentProcessN,
    deleteProcessN,
    downProcessN,
    getCurrentProcessN,
    getProcessNList, stopCurrentProcessN
} from "@/apis/request/testProcessN.ts";
import {DELETE, SUCCESS_CODE} from "@/constants";
import ProcessNTree from "@/views/demo/TestProcessN/ProcessNTree.tsx";
import ConfigTestTemplate, {NewTestTemplateMode} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {PROCESS_CONFIG_HINT, TEMPLATE} from "@/constants/process_hint.ts";
import {confirmDelete} from "@/utils";

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
        title: TEMPLATE + "(名称 - ID)",
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
    const [currentDownProcessN, setCurrentDownProcessN] = React.useState<ITestProcessN | null>(null);

    useEffect(() => {
        setCurrentDownProcessN(getCurrentProcessN());
    }, []);

    const ActionButtons = (record: ITestProcessN) => {
        const testProcessNRecord = JSON.stringify(record)

        return (
            <Space>
                <Button type="link"
                        href={`/test-template-config?testProcessNRecord=${testProcessNRecord}&model=${NewTestTemplateMode.CONFIG}`}
                        onClick={() => {
                            const win = window.open(`/test-template-config?testProcessNRecord=${testProcessNRecord}&model=${NewTestTemplateMode.CONFIG}`)
                            if (!win) return
                            const checkClosed = setInterval(() => {
                                if (win.closed) {
                                    fetchTestProcessN()
                                    clearInterval(checkClosed);
                                }
                            }, 1000);
                        }}
                        target={"_blank"}>前往配置采集关系</Button>
                <Button type={"link"} onClick={() => {
                    downProcessN(record).then(() => {
                        setCurrentDownProcessN(record)
                    })
                }}>{DOWN}</Button>
                <ProcessNTree record={record}/>
                <Button type="primary" danger={true} onClick={() => {
                    confirmDelete() && deleteProcessN(record.id!).then(res => {
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
                justifyContent: 'space-between'
            }}>
                <CheckCurrentProcessN currentProcessN={currentDownProcessN} onStop={()=>{
                    setCurrentDownProcessN(null)
                }}/>
                <NewTestProcessN onFinish={fetchTestProcessN}/>
            </div>
            <Table columns={newColumns} dataSource={processNList} rowKey={(value) => {
                return value.id ?? value.testName
            }}/>
        </div>
    )
}

export default TestProcessN;

const CheckCurrentProcessN: React.FC<{
    currentProcessN: ITestProcessN | null,
    onStop: () => void
}> = ({currentProcessN,onStop}) => {
    return (
        <Row gutter={[16, 8]} align={"middle"}>
            <Button
                style={{marginRight: 20}}
                onClick={() => {
                    if (!currentProcessN) {
                        message.error("当前无下发配置")
                        return;
                    }
                    stopCurrentProcessN().then(() => {
                        message.success("停止成功")
                        onStop()

                    })
                }}>停止当前下发配置</Button>
            <Button
                style={{marginRight: 20}}
                onClick={() => {
                    if (!currentProcessN) {
                        message.error("当前无下发配置")
                        return;
                    }
                    checkCurrentProcessN(currentProcessN!)
                }}>前往查看当前采集信息</Button>
            {currentProcessN?.testName ?? "暂无下发配置"}
        </Row>
    )
}
