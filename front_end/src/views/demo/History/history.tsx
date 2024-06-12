import {Space, Table, TableProps} from "antd";
import React from "react";

interface IHistoryList {
    id?: number
    fatherConfigName: string
    path: string
    createdAt: Date
    updatedAt: Date
}

const columns: TableProps<IHistoryList>['columns'] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "所属配置名称",
        dataIndex: "fatherConfigName",
        key: "fatherConfigName",
    },
    {
        title: "路径",
        dataIndex: "path",
        key: "path",
    },
    {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
    },
    {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
    },
    {
        title: "操作",
        key: "action",
        render: (value, record, index) => (
            <Space>
                <a>查看详情</a>
                <a>删除</a>
            </Space>
        )
    }
];

const HistoryData = () => {
    return (
        <div>
            <Table
                columns={columns}
                dataSource={[]}
                rowKey="id"
            />
        </div>
    )
}

export default HistoryData