import React, {useEffect} from 'react';
import {Button, message, Space, Table} from 'antd';
import type {TableProps} from 'antd';
import {IVehicle} from "@/apis/standard/vehicle.ts";
import {IProject} from "@/apis/standard/project.ts";
import NewTestProcessN from "@/views/demo/TestProcessN/NewTestProcessN.tsx";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {getTestProcess} from "@/apis/standard/test.ts";
import {getProcessNById, getProcessNList} from "@/apis/request/testProcessN.ts";
import {SUCCESS_CODE} from "@/constants";

const columns: TableProps<ITestProcessN>['columns'] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "测试名称",
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
        title: "测试模板(名称 - ID)",
        dataIndex: "template",
        key: "template",
        render: (value, record, index) => (
            <Space>
                <span>{`${record.template.name} - ${record.template.id}`}</span>
            </Space>
        )
    },
    {
        //操作
        title: "操作",
        key: "action",
        render: (value, record, index) => (
            <Space>
                <Button type="primary" onClick={() => {
                    getProcessNById(record.id!).then(res => {
                        if (res.code !== SUCCESS_CODE) {
                            message.error(res.message);
                            return;
                        }
                        console.log(res.data);
                    })
                }}>查看</Button>
                <Button type="primary">编辑</Button>
                <Button type="primary">删除</Button>
            </Space>
        )
    }
];

const TestProcessN: React.FC = () => {
    const [processNList, setProcessNList] = React.useState<ITestProcessN[]>([]);

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
                justifyContent: 'flex-end'
            }}>
                <NewTestProcessN/>
            </div>
            <Table columns={columns} dataSource={processNList}/>
        </div>
    )
}

export default TestProcessN;