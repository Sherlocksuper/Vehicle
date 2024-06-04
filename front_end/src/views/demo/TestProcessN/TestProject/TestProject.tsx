import React from 'react';
import {Button, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IProject} from "@/apis/standard/project.ts";
import CreateProject from "@/views/demo/TestProcessN/TestProject/NewTestProject.tsx";
import {getProjects} from "@/apis/request/project.ts";

// export interface IProject {
//     id?: number
//     projectName: string
//
//     controller: IcontrollersConfigItem
//     collector: IcollectorsConfigItem
//     single: IsignalsConfigItem
// }

const columns: TableProps<IProject>['columns'] = [
    {
        title: "项目名称",
        dataIndex: "projectName",
        key: "projectName",
    },
    {
        title: "操作",
        key: "action",
        render: () => (
            <Space>
                <Button type="link">详情</Button>
            </Space>
        )
    }
];

const TestProject: React.FC = () => {
    const [showCreateProject, setShowCreateProject] = React.useState<boolean>(false)
    const [projects, setProjects] = React.useState<IProject[]>([])

    React.useEffect(() => {
        getProjects().then((res) => {
            setProjects(res.data)
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
            <Table columns={columns} dataSource={projects}/>
        </div>
    );
};

export default TestProject;