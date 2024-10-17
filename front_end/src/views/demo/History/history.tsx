import {Button, Card, message, Space, Table, TableProps} from "antd";
import React, {useEffect} from "react";
import {deleteTestsHistory, getTestsHistory} from "@/apis/request/testhistory.ts";
import {FAIL_CODE} from "@/constants";
import {confirmDelete} from "@/utils";
import Search from "antd/es/input/Search";
import {BASE_URL} from "@/apis/url/myUrl.ts";

interface IHistoryList {
  id?: number
  fatherConfigName: string
  vehicleName: string
  path: string
  size: number
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
    title: "测试车辆",
    dataIndex: "vehicleName",
    key: "vehicleName",
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
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
  const [historyDataStore, setHistoryDataStore] = React.useState<IHistoryList[]>([])
  const [historyData, setHistoryData] = React.useState<IHistoryList[]>([])

  columns[columns.length - 1].render = (text, record) => (
    <Space>
      <a onClick={() => deleteHistory(record.id!)}>删除</a>
      <a href={"/test-receive/offline-management?fileAdd=" + BASE_URL + record.path}>数据分析</a>
    </Space>
  )

  const fetchHistoryData = () => {
    getTestsHistory().then(res => {
      if (res.code === FAIL_CODE) {
        message.error('获取历史数据失败' + res.msg)
        return
      }
      setHistoryData(res.data)
      setHistoryDataStore(res.data)
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
      extra={<Space>
        <Search placeholder="搜索" onSearch={value => {
          setHistoryData(historyDataStore.filter(item => item.fatherConfigName.includes(value) || item.createdAt.toString().includes(value) || item.vehicleName.toString().includes(value)))
        }}/>
        <Space/>
        <Button onClick={fetchHistoryData}>刷新</Button>
      </Space>}
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
