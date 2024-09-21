import {Button, Card, message, Space, Table, TableProps} from "antd";
import React, {useEffect} from "react";
import {deleteTestsHistory, getTestsHistory} from "@/apis/request/testhistory.ts";
import {FAIL_CODE} from "@/constants";
import {confirmDelete} from "@/utils";

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
        // 可复制
        render: (text) => (
            <a
              onClick={() => {
                  const input = document.createElement('input');
                  input.value = text;
                  document.body.appendChild(input);
                  input.select();
                  document.execCommand('copy');
                  document.body.removeChild(input);
                  message.success('复制成功');
              }}
            >{text}</a>
        )
    },
    {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
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
        </Space>
    )

    const fetchHistoryData = () => {
        getTestsHistory().then(res => {
          if (res.code === FAIL_CODE) return
          setHistoryData(res.data)
          message.success('获取历史数据')
        })
    }

    const deleteHistory = (id: number) => {
        confirmDelete() && deleteTestsHistory(id).then(res => {
            if (res.code === FAIL_CODE) return
            fetchHistoryData()
        })
    }

    useEffect(() => {
        fetchHistoryData()
    }, [])

    return (
        <Card
            title="历史数据"
            extra={<Button onClick={fetchHistoryData}>刷新</Button>}
            style={{
              height: "100vh",
              overflow: "scroll",
            }}
        >
            <Table
                columns={columns}
                dataSource={historyData}
                rowKey="id"
            />
        </Card>
    )
}

export default HistoryData
