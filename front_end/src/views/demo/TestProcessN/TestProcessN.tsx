import React from 'react';
import {Button, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {ITestObjectN} from "@/apis/standard/testObjectN.ts";
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {IProject} from "@/apis/standard/project.ts";
import NewTestProcessN from "@/views/demo/TestProcessN/NewTestProcessN.tsx";

const columns: TableProps<ITestObjectN>['columns'] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "测试车辆",
        dataIndex: "vehicle",
        key: "vehicle",
        render: (vehicle: IVehicle) => (
            <Space>
                <span>{vehicle.id}</span>
                <span>{vehicle.vehicleName}</span>
            </Space>
        )
    },
    {
        title: "测试项目",
        dataIndex: "project",
        key: "project",
        render: (project: IProject) => (
            <Space>
                <span>{project.id}</span>
                <span>{project.projectName}</span>
            </Space>
        )
    },
    {
        title: "测试模板",
        dataIndex: "template",
        key: "template",
        render: (value, record, index) => (
            <Space>
                <span>{`${record.template.name} - ${record.template.id}`}</span>
            </Space>
        )
    }
];

const TestProcessN: React.FC = () => {


    return (
        <div style={{padding: 20}}>
            <div style={{
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <NewTestProcessN/>
            </div>
            <Table columns={columns} dataSource={[]}/>
        </div>
    )
}

export default TestProcessN;