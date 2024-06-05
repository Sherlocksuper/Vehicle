import React from 'react';
import {Button, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {ITemplate} from "@/apis/standard/template.ts";
import {getTestTemplateList} from "@/apis/request/template.ts";

const columns: TableProps<ITemplate>['columns'] = [
    {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
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
        render: (text) => {
            return new Date(text).toLocaleString()
        }
    },
    {
        title: '更新日期',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (text) => {
            return new Date(text).toLocaleString()
        }
    },
    {
        title: '操作',
        key: 'action',
        render: () => (
            <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
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
    }, [])

    return (
        <div style={{
            padding: 20
        }}>
            <Row justify="end" style={{marginBottom: 20}}>
                <Button type="link" href={"/test-template-config"}
                        target={"_blank"}>模板配置</Button>
                <Button type="primary">刷新</Button>
            </Row>
            <Table columns={columns} dataSource={templates} rowKey={(record) => record.id!.toString()}/>
        </div>
    );
};

export default TestTemplate;