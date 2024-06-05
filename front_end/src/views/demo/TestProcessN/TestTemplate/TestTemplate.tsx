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
    },
    {
        title: '更新日期',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
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
    const [showCreateProject, setShowCreateProject] = React.useState<boolean>(false)
    const [templates, setTemplate] = React.useState<ITemplate[]>([])

    React.useEffect(() => {
        getTestTemplateList().then((res) => {
            console.log("template:" + res.data)
            setTemplate(res.data)
        })
    }, [])

    return (
        <div style={{
            padding: 20
        }}>
            <Row justify="end" style={{marginBottom: 20}}>
                <Button type="link" href={"/test-template-config"}
                        target={"_blank"}>模板配置</Button>
            </Row>
            <Table columns={columns} dataSource={templates}/>
        </div>
    );
};

export default TestTemplate;