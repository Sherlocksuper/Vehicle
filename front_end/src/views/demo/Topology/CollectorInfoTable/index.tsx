import {Button, Descriptions, Input, Modal, Select, Space, Table, Tag} from "antd";
import {ICollector} from "../PhyTopology.tsx";
import {deleteCollector, updateCollector} from "@/apis/request/board-signal/collector.ts";
import {SUCCESS_CODE} from "@/constants";
import {NOT_ON_USED, ON_USED, USED_INFO} from "@/constants/board.ts";
import {confirmDelete} from "@/utils";
import React, {useEffect, useState} from "react";
import {ProtocolModel} from "@/views/demo/ProtocolTable/protocols.tsx";
import {getProtocols, IProtocol} from "@/apis/request/protocol.ts";

const CollectorInfoTable: React.FC<{
  dataSource: ICollector[],
  reload: () => void
}> = ({dataSource, reload}) => {
  const [collector, setCollector] = useState<ICollector | undefined>(undefined)
  const [mode, setMode] = useState<"SHOW" | "UPDATE">(undefined)
  const [showProtocol, setShowProtocol] = useState<IProtocol | undefined>(undefined)

  const columns = [
    {
      title: '采集板卡代号',
      dataIndex: 'collectorName',
      key: 'collectorName',
    },
    {
      title: '采集板卡地址',
      dataIndex: 'collectorAddress',
      key: 'collectorAddress',
    },
    {
      title: '采集板卡协议',
      dataIndex: 'protocols',
      key: 'protocols',
      render: (protocols: IProtocol[]) => {
        return protocols.map((protocol) => (
          <Tag key={protocol.protocolName} onClick={() => {
            setShowProtocol(protocol)
          }}>
            {protocol.protocolName}
          </Tag>
        ))
      }
    },
    {
      title: USED_INFO,
      key: 'isDisabled',
      render: (record: ICollector) => {
        return record.isDisabled ? NOT_ON_USED : ON_USED
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ICollector) => {
        return <Space size="middle">
          <Button type="primary" onClick={() => {
            const newCollector = {...record, isDisabled: !record.isDisabled}
            delete newCollector.userId
            updateCollector(newCollector).then((res) => {
              if (res.code === SUCCESS_CODE) {
                reload()
              } else {
                console.error(res.msg)
              }
            })
          }}>
            {record.isDisabled ? '启用' : '禁用'}
          </Button>
          <Button type="primary" onClick={() => {
            setCollector(record)
            setMode("UPDATE")
          }}> 修改 </Button>
          <Button type="primary" danger onClick={() => {
            if (!confirmDelete()) return;
            const collector = {...record} as ICollector
            deleteCollector(collector).then((res) => {
              if (res.code === SUCCESS_CODE) {
                reload()
              } else {
                console.error(res.msg)
              }
            })
          }}>
            删除
          </Button>
        </Space>
      }
    }
  ];


  return <>
    <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
           dataSource={dataSource}
           columns={columns}/>

    <CollectorUpdateModal collector={collector!} open={collector !== undefined && mode === "UPDATE"} setOpen={(value) => {
      if (!value) {
        setCollector(undefined)
        setMode(undefined)
      }
    }} reload={reload}/>
    <ProtocolModel
      open={showProtocol !== undefined}
      mode={"SHOW"}
      close={() => {
        setShowProtocol(undefined)
      }}
      onOk={() => {
        setShowProtocol(undefined)
      }}
      initValue={showProtocol}
    />
  </>
}

export default CollectorInfoTable

const CollectorUpdateModal: React.FC<{
  collector: ICollector,
  open: boolean,
  setOpen: (value: boolean) => void,
  reload: () => void
}> = ({collector, open, setOpen, reload}) => {
  const [newName, setNewName] = useState(undefined)
  const [newAddress, setNewAddress] = useState(undefined)
  const [newProtocols, setNewProtocols] = useState<IProtocol[]>([])

  const [protocols, setProtocols] = useState<IProtocol[]>([])

  useEffect(() => {
    setNewName(collector?.collectorName)
    setNewAddress(collector?.collectorAddress)
    setNewProtocols(collector?.protocols ?? [])
  }, [collector])

  useEffect(() => {
    getProtocols().then((res) => {
      if (res.code === SUCCESS_CODE) {
        setProtocols(res.data)
      } else {
        console.error(res.msg)
      }
    })
  }, [])

  return <Modal title="修改采集板卡" open={open} onOk={() => {
    updateCollector({
      ...collector,
      collectorName: newName,
      collectorAddress: newAddress,
      protocols: newProtocols
    }).then((res) => {
      if (res.code === SUCCESS_CODE) {
        setOpen(false)
        reload()
      } else {
        console.error(res.msg)
      }
    })
  }} onCancel={() => {
    setOpen(false)
  }}>
    <div>
      <div>
        <span>采集板卡代号:</span>
        <Input value={newName} onChange={(e) => {
          collector.collectorName = e.target.value
          setNewName(e.target.value)
        }}/>
      </div>
      <div>
        <span>采集板卡地址:</span>
        <Input value={newAddress} onChange={(e) => {
          setNewAddress(e.target.value)
        }}/>
      </div>
      <div>
        <span>采集板卡协议:</span>
        <Select mode="multiple" style={{width: '100%'}} placeholder="请选择协议" labelInValue
                value={newProtocols.map((protocol) => ({
                  label: protocol.protocolName,
                  value: protocol.protocolName
                }))}
                onChange={(value) => {
                  setNewProtocols(value.map((item) => {
                    return protocols.find((protocol) => protocol.protocolName === item.value)!
                  }))
                }}>
          {protocols.map((protocol) => (
            <Select.Option key={protocol.protocolName} value={protocol.protocolName}>
              {protocol.protocolName}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  </Modal>
}

export const CollectorDetailModal = ({collector, onClose}: { collector: ICollector, onClose: () => void }) => {
  const [showProtocol, setShowProtocol] = useState<IProtocol | undefined>(undefined)

  return (
    <Modal width={800} title="采集板卡信息" open={collector !== undefined} onOk={() => {
      onClose()
    }} onCancel={() => {
      onClose()
    }}>
      <Descriptions bordered>
        <Descriptions.Item label="采集板卡代号">{collector?.collectorName}</Descriptions.Item>
        <Descriptions.Item label="采集板卡地址">{collector?.collectorAddress}</Descriptions.Item>
        <Descriptions.Item label="采集板卡状态">{collector?.isDisabled ? NOT_ON_USED : ON_USED}</Descriptions.Item>
        <Descriptions.Item label="采集板卡协议">
          {collector?.protocols.map((protocol) => (
            <Tag
              key={protocol.protocolName}
              onClick={() => {
                setShowProtocol(protocol)
              }}
            >
              {protocol.protocolName}
            </Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
      <ProtocolModel
        open={showProtocol !== undefined}
        mode={"SHOW"}
        close={() => {
          setShowProtocol(undefined)
        }}
        onOk={() => {
          setShowProtocol(undefined)
        }}
        initValue={showProtocol}
      />
    </Modal>
  )
}
