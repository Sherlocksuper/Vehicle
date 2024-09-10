import React from 'react';
import {Button, Card, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IProject} from "@/apis/standard/project.ts";
import {
    CreateProjectButton,
    ShowProjectButton
} from "@/views/demo/TestProcessN/TestProject/NewTestProject.tsx";
import {deleteProject, getProjects} from "@/apis/request/project.ts";
import {confirmDelete} from "@/utils";

const TestProject: React.FC = () => {
    const [projects, setProjects] = React.useState<IProject[]>([])


    const columns: TableProps<IProject>['columns'] = [
        {
            title: "项目名称",
            dataIndex: "projectName",
            key: "projectName",
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Space>
                    <ShowProjectButton projects={projects} initValue={JSON.stringify(record)}/>
                    <Button type="link" onClick={() => {
                        confirmDelete() &&
                        deleteProject(Number(record.id)).then(() => {
                            fetchProjects()
                        })
                    }}>删除</Button>
                </Space>
            )
        }
    ];

    const fetchProjects = () => {
        getProjects().then((res) => {
            setProjects(res.data);
        });
    };

    React.useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <Card style={{
            overflow: "scroll",
            overflowX: "hidden",
            height: "100vh",

        }}>
            <CreateProjectButton projects={projects} onFinished={() => {
                fetchProjects()
            }}/>
            <Table style={{
                marginTop: 20
            }} columns={columns} dataSource={projects} key={projects?.length ?? 0} rowKey={"id"}/>
        </Card>
    );
};

export default TestProject;
