import {Space, Table, TableProps} from "antd";
import React, {useEffect} from "react";
import {deleteTestsHistory, getTestsHistory} from "@/apis/request/testhistory.ts";
import {FAIL_CODE} from "@/constants";

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
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text) => new Date(text).toLocaleString()
    },
    {
        title: "操作",
        key: "action",
    }
];

const HistoryData = () => {
    const [historyData, setHistoryData] = React.useState<IHistoryList[]>([])

    columns[columns.length - 1].render = (text, record) => (
        <Space>
            <a onClick={() => deleteHistory(record.id!)}>删除</a>
            <a href={record.path}
               download={record.fatherConfigName + '.json'}
            >下载</a>
        </Space>
    )

    const fetchHistoryData = () => {
        getTestsHistory().then(res => {
            setHistoryData(res.data)
        })
    }

    const deleteHistory = (id: number) => {
        if (prompt("请输入 delete 删除") !== "delete") return
        deleteTestsHistory(id).then(res => {
            if (res.code === FAIL_CODE) return
            fetchHistoryData()
        })
    }

    useEffect(() => {
        fetchHistoryData()
    }, [])

    return (
        <div>
            <Table
                columns={columns}
                dataSource={historyData}
                rowKey="id"
            />
        </div>
    )
}

export default HistoryData