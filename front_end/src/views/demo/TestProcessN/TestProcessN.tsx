import React from 'react';
import {Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {ITestObjectN} from "@/apis/standard/testObjectN.ts";
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {IProject} from "@/apis/standard/project.ts";

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
        title: "测测试项目",
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
        title: "Template",
        dataIndex: "template",
        key: "template",
        render: () => (
            <Space>
                <span>123</span>
            </Space>
        )
    }
];

const TestProcessN: React.FC = () => <Table columns={columns} dataSource={[]}/>;

export default TestProcessN;