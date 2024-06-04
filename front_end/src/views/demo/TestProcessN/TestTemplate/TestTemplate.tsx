import React from 'react';
import {Button, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import CreateProject from "@/views/demo/TestProcessN/TestProject/NewTestProject.tsx";
import {ITemplate} from "@/apis/standard/template.ts";
import {getTestTemplateList} from "@/apis/request/template.ts";

//
// export interface ITemplate {
//     id?: number
//     name: string
//     description: string
//     createdAt: Date
//     updatedAt: Date
//     itemConfig: {
//         type: TestTemplateType
//         requestSignalId: number | null
//         x: number
//         y: number
//         width: number
//         height: number
//         title: string
//         interval: number
//         trueLabel?: string
//         falseLabel?: string
//         unit?: string
//         during?: number
//         min?: number
//         max?: number
//         label?: string
//     }[]
// }

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

const TestProject: React.FC = () => {
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
                <Button type="primary" onClick={() => {
                    setShowCreateProject(true)
                }}>New</Button>
            </Row>
            <CreateProject open={showCreateProject} mode={"create"} onFinished={() => {
                setShowCreateProject(false)
            }}/>
            <Table columns={columns} dataSource={templates}/>
        </div>
    );
};

export default TestProject;