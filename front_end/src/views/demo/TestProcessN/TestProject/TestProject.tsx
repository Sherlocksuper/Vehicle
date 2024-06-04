import React from 'react';
import {Button, Row, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IProject} from "@/apis/standard/project.ts";
import {IcollectorsConfigItem, IcontrollersConfigItem, IsignalsConfigItem} from "@/views/demo/Topology/PhyTopology.tsx";
import CreateProject from "@/views/demo/TestProcessN/TestProject/NewTestProject.tsx";

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
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "项目名称",
        dataIndex: "projectName",
        key: "projectName",
    },
    {
        title: "核心板卡",
        dataIndex: "controller",
        key: "controller",
        render: (controller: IcontrollersConfigItem) => (
            <Space>
                <span>{controller.id}</span>
                <span>{controller.controllerName}</span>
            </Space>
        )
    },
    {
        title: "采集板卡",
        dataIndex: "collector",
        key: "collector",
        render: (collector: IcollectorsConfigItem) => (
            <Space>
                <span>{collector.id}</span>
                <span>{collector.collectorName}</span>
            </Space>
        )
    },
    {
        title: "采集项目",
        dataIndex: "single",
        key: "single",
        render: (single: IsignalsConfigItem) => (
            <Space>
                <span>{single.id}</span>
                <span>{single.signalName}</span>
            </Space>
        )
    },
    //操作
    {
        title: "操作",
        key: "action",
        render: () => (
            <Space>
                <Button type="link">编辑</Button>
                <Button type="link">删除</Button>
            </Space>
        )
    }
];

const TestProject: React.FC = () => {
    const [showCreateProject, setShowCreateProject] = React.useState<boolean>(false)
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
            <Table columns={columns} dataSource={[]}/>
        </div>
    );
};

export default TestProject;