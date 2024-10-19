import {Button, Card, Descriptions, Input, message, Modal, Select, Space, Table, TableProps, Tag} from "antd";
import React, {useEffect} from "react";
import {FAIL_CODE} from "@/constants";
import {confirmDelete} from "@/utils";
import {deleteCollectUnit, getCollectUnits} from "@/apis/request/collectUnit.ts";
import {ICollectUnit} from "@/apis/standard/collectUnit.ts";
import {getActiveControllerList} from "@/apis/request/board-signal/controller.ts";
import {getActiveCollectorList} from "@/apis/request/board-signal/collector.ts";
import {ICollector, IController} from "@/views/demo/Topology/PhyTopology.tsx";
import {NOT_ON_USED, ON_USED} from "@/constants/board.ts";
import Search from "antd/es/input/Search";


const CollectUnitPage = () => {
  const [collectUnitData, setCollectUnitData] = React.useState<ICollectUnit[]>([])
  const [collectUnitDataStore, setCollectUnitDataStore] = React.useState<ICollectUnit[]>([])
  const [currentCollectUnit, setCurrentCollectUnit] = React.useState<ICollectUnit | undefined>(undefined)
  const [mode, setMode] = React.useState<"SHOW" | "ADD" | "EDIT">(undefined)

  const columns: TableProps<ICollectUnit>['columns'] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "采集单元名称",
      dataIndex: "collectUnitName",
      key: "collectUnitName",
    },
    {
      title: "核心",
      dataIndex: "core",
      key: "core",
      render: (text, record) => (
        <Space>
          {record.core.controllerName}
        </Space>
      )
    },
    {
      title: "采集器",
      dataIndex: "collectors",
      key: "collectors",
      render: (text, record) => (
        <Space>
          {record.collectors.map((collector, index) => (
            <Tag onClick={() => {
              setCurrentCollectUnit(record)
            }} key={index}>{collector.collectorName}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <Space>
          <a onClick={() => deleteCollectUnitApi(record.id!)}>删除</a>
          <a onClick={() => {
            setCurrentCollectUnit(record)
          }}>查看</a>
          <a onClick={() => {
            setCurrentCollectUnit(record)
            setMode("EDIT")
          }}>编辑</a>
        </Space>
      )
    }
  ];

  const fetchCollectUnitData = () => {
    getCollectUnits().then(res => {
      if (res.code === FAIL_CODE) return
      setCollectUnitData(res.data)
      setCollectUnitDataStore(res.data)
    })
  }

  const deleteCollectUnitApi = (id: number) => {
    confirmDelete() && deleteCollectUnit(id).then(res => {
      if (res.code === FAIL_CODE) return
      fetchCollectUnitData()
    })
  }

  useEffect(() => {
    fetchCollectUnitData()
  }, [])

  return (
    <Card
      title="测试单元管理"
      extra={<Space>
        <Button type="primary" onClick={() => {
          setCurrentCollectUnit(undefined)
          setMode("ADD")
        }}>新建测试单元</Button>
        <Button type={"primary"} onClick={() => {
          fetchCollectUnitData()
        }}>刷新</Button>
        <Search
          placeholder="搜索"
          onSearch={(value) => {
            if (value === "") {
              setCollectUnitData(collectUnitDataStore)
              return
            }
            const result = collectUnitDataStore.filter((item) => {
              return item.collectUnitName.includes(value)
            })
            setCollectUnitData(result)
          }}
          enterButton
        />
      </Space>}
      style={{
        height: "100vh",
        overflow: "scroll",
      }}
    >
      <Table
        columns={columns}
        dataSource={collectUnitData}
        rowKey="id"
      />
      <CollectUnitDetail collectUnit={mode === undefined ? currentCollectUnit : undefined} onClose={() => {
        setCurrentCollectUnit(undefined)
      }}/>
      <CollectUnitEdit open={mode === "ADD" || mode === "EDIT"} collectUnit={currentCollectUnit} onClose={() => {
        setCurrentCollectUnit(undefined)
        setMode(undefined)
        fetchCollectUnitData()
      }}/>
    </Card>
  )
}

export const CollectUnitDetail = ({collectUnit, onClose}: { collectUnit?: ICollectUnit, onClose: () => void }) => {
  return <Modal open={collectUnit !== undefined}
                onCancel={onClose}
                onOk={onClose}>
    <Card
      title="采集单元详情"
    >
      {
        collectUnit === undefined ? null : <Space direction="vertical">
          <Descriptions bordered>
            <Descriptions.Item label="采集单元名称">{collectUnit?.collectUnitName}</Descriptions.Item>
            <Descriptions.Item label="核心板卡名称">{collectUnit?.core.controllerName}</Descriptions.Item>
            <Descriptions.Item label="核心板卡地址">{collectUnit?.core.controllerAddress}</Descriptions.Item>
            <Descriptions.Item label="核心板卡状态">{collectUnit?.core.isDisabled ? NOT_ON_USED : ON_USED}</Descriptions.Item>
            <Descriptions.Item label="采集器">
              {collectUnit?.collectors.map((collector, index) => (
                <Tag key={index}>{collector.collectorName}</Tag>
              ))}
            </Descriptions.Item>

          </Descriptions>
        </Space>
      }
    </Card>
  </Modal>
}

export const CollectUnitEdit = ({collectUnit, open, onClose}: { collectUnit?: ICollectUnit, open: boolean, onClose: (result: ICollectUnit) => void }) => {
  const [controllers, setControllers] = React.useState([])
  const [collectors, setCollectors] = React.useState([])
  const [collectUnitName, setCollectUnitName] = React.useState<string>("")

  const [controllerSelect, setControllerSelect] = React.useState<IController>(undefined)
  const [collectorsSelect, setCollectorsSelect] = React.useState<ICollector[]>([])

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    setState()
  }, [open, collectUnit])

  const fetchAll = () => {
    getControllerApi()
    getCollectorsApi()
  }

  const getControllerApi = () => {
    getActiveControllerList().then(res => {
      if (res.code === FAIL_CODE) return
      setControllers(res.data)
    })
  }

  const getCollectorsApi = () => {
    getActiveCollectorList().then(res => {
      if (res.code === FAIL_CODE) return
      setCollectors(res.data)
    })
  }


  const checkValid = () => {
    if (collectUnitName === "") {
      message.error("采集单元名称不能为空")
      return false
    }
    if (controllerSelect === undefined) {
      message.error("请选择核心")
      return false
    }
    if (collectorsSelect.length === 0) {
      message.error("请选择采集器")
      return false
    }
    return true
  }

  const setState = () => {
    setCollectUnitName(collectUnit?.collectUnitName ?? "")
    setControllerSelect(collectUnit?.core)
    setCollectorsSelect(collectUnit?.collectors ?? [])
    console.log(collectUnit)
    console.log("清空状态")
  }

  return <Modal open={open}
                onCancel={() => {
                  onClose(undefined)
                }}
                onOk={() => {
                  if (!checkValid()) return
                  onClose({
                    id: collectUnit?.id,
                    collectUnitName: collectUnitName,
                    core: controllerSelect,
                    collectors: collectorsSelect
                  })
                }}>
    <Card title={collectUnit === undefined ? "新建采集单元" : "编辑采集单元"}>
      <Space
        direction={"vertical"}
      >
        <Input placeholder="采集单元名称" defaultValue={collectUnitName} onChange={(e) => {
          setCollectUnitName(e.target.value)
        }}/>
        <span>核心：</span>
        <Select
          value={{
            key: JSON.stringify(controllerSelect),
            label: controllerSelect?.controllerName
          }}
          placeholder={"请选择核心"}
          style={{width: "100%"}}
          labelInValue // 添加这一行
          onChange={(value: any) => {
            console.log(value)
            setControllerSelect(JSON.parse(value.key))
          }}
        >
          {controllers.map((item, index) => (
            <Select.Option key={JSON.stringify(item)} value={index}>{item.controllerName}</Select.Option>
          ))}
        </Select>
        <span>采集器：</span>
        <Select
          value={collectorsSelect.map((item) => {
            return {
              key: JSON.stringify(item),
              label: item.collectorName
            }
          })}
          mode="multiple"
          placeholder={"请选择采集器"}
          style={{width: "100%"}}
          labelInValue // 添加这一行
          onChange={(value) => {
            // 过滤掉key重复的
            const result = value.filter((item, index, self) =>
                index === self.findIndex((t) => (
                  t.label === item.label
                ))
            ).map((item) => JSON.parse(item.key))
            setCollectorsSelect(result)
          }}>
          {collectors.map((item, index) => (
            <Select.Option key={JSON.stringify(item)} value={index}>{item.collectorName}</Select.Option>
          ))}
        </Select>
      </Space>
    </Card>
  </Modal>
}

export default CollectUnitPage
