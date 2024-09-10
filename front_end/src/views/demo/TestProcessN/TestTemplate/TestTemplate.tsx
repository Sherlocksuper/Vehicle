import React from 'react';
import {Button, Card, message, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {ITemplate} from "@/apis/standard/template.ts";
import {deleteTestTemplate, getTestTemplateList} from "@/apis/request/template.ts";
import {NewTestTemplateMode} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {SUCCESS_CODE} from "@/constants";

const columns: TableProps<ITemplate>['columns'] = [
    {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
        render: (value, record, index) => {
            return <a>{`${record.name} - ${record.id}`}</a>
        }
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '创建日期',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value, record, index) => {
            return new Date(value).toLocaleString()
        }
    },
    {
        title: '更新日期',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (value, record, index) => {
            return new Date(value).toLocaleString()
        }
    },
    {
        title: '操作',
        key: 'action',
        render: (value, record, index) => {
            const newTestProcessN: ITestProcessN = {
                userId: 0,
                testName: record.name,
                testObjectNs: [],
                template: record
            }
            const testProcessNRecord = JSON.stringify(newTestProcessN)
            const model = NewTestTemplateMode.SHOW

            return <Space size="middle">
                <Button type="link"
                        href={`/test-template-config?testProcessNRecord=${testProcessNRecord}&model=${model}`}
                        target={"_blank"}>查看</Button>
            </Space>
        }
    },
];

const TestTemplate: React.FC = () => {
    const [templates, setTemplate] = React.useState<ITemplate[]>([])

    const fetchTestTemplate = async () => {
        getTestTemplateList().then((res) => {
            console.log("template:" + res.data)
            setTemplate(res.data)
        })
    }

    React.useEffect(() => {
        fetchTestTemplate()

        columns[columns.length - 1].render = (value, record, index) => {
            const newTestProcessN: ITestProcessN = {
                userId: 0,
                testName: record.name,
                testObjectNs: [],
                template: record
            }
            const testProcessNRecord = JSON.stringify(newTestProcessN)
            const model = NewTestTemplateMode.SHOW

            return <Space size="middle">
                <Button type="link"
                        href={`/test-template-config?testProcessNRecord=${testProcessNRecord}&model=${model}`}
                        target={"_blank"}>查看</Button>
                <Button type="link" onClick={() => {
                    deleteTestTemplate(record.id!.toString()).then((res) => {
                        if (res.code !== SUCCESS_CODE) {
                            message.success("删除失败,请重试")
                            return
                        }
                        fetchTestTemplate()
                    })
                }}>删除</Button>
            </Space>
        }
    }, [])

    return (
        <Card>
            <Row justify="end" style={{marginBottom: 20}}>
                <Button type="link"
                        onClick={() => {
                            const win = window.open(`/test-template-config`);
                            if (!win) return
                            const checkClosed = setInterval(() => {
                                if (win.closed) {
                                    fetchTestTemplate();
                                    clearInterval(checkClosed);
                                }
                            }, 1000);
                        }}
                >模板配置</Button>
                <Button type="primary" onClick={() => {
                    fetchTestTemplate()
                }}>刷新</Button>
            </Row>
            <Table columns={columns} dataSource={templates} rowKey={(record) => record.id!.toString()}/>
        </Card>
    );
};

export default TestTemplate;
