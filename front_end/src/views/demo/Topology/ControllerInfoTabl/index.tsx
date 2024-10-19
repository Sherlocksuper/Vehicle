import {Button, Descriptions, Input, message, Modal, Space, Table, Tag} from "antd";
import {ICollector, IController} from "../PhyTopology.tsx";
import {NOT_ON_USED, ENABLE, ON_USED, USED_INFO, DISABLE} from "@/constants/board.ts";
import {deleteController, updateController} from "@/apis/request/board-signal/controller.ts";
import {SUCCESS_CODE} from "@/constants";
import {confirmDelete} from "@/utils";
import React, {useEffect, useState} from "react";
import {IProtocol} from "@/apis/request/protocol.ts";
import {ProtocolModel} from "@/views/demo/ProtocolTable/protocols.tsx";

const ControllerInfoTable: React.FC<{
  dataSource: IController[],
  reload: () => void
}> = ({dataSource, reload}) => {
  const [targetController, setTargetController] = useState<IController | undefined>(undefined)

  const columns = [
    {
      title: '核心板卡代号',
      dataIndex: 'controllerName',
      key: 'controllerName',
    },
    {
      title: '核心板卡地址',
      dataIndex: 'controllerAddress',
      key: 'controllerAddress',
    },
    {
      title: USED_INFO,
      key: 'isDisabled',
      render: (record: IController) => {
        return <span>{record.isDisabled ? NOT_ON_USED : ON_USED}</span>
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (record: IController) => {
        return <Space size="middle">
          <Button type="primary" onClick={() => {
            const newController = {...record, isDisabled: !record.isDisabled} as IController
            delete newController.userId
            updateController(newController).then((res) => {
              if (res.code === SUCCESS_CODE) {
                reload()
              } else {
                message.error(res.msg)
              }
            })
          }}>
            {record.isDisabled ? ENABLE : DISABLE}
          </Button>
          <Button type="primary"
                  onClick={() => {
                    setTargetController(record)
                  }}>修改</Button>
          <Button type="primary" danger onClick={() => {
            if (!confirmDelete()) return;
            const newController = {...record} as IController
            deleteController(newController).then((res) => {
              if (res.code === SUCCESS_CODE) {
                reload()
              } else {
                message.error(res.msg)
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
           dataSource={dataSource} columns={columns}/>
    <ControllerEditModal controller={targetController} open={targetController !== undefined} setOpen={(value) => {
      if (!value) setTargetController(undefined)
    }} reload={reload}/>
  </>
}

export default ControllerInfoTable

const ControllerEditModal: React.FC<{
  controller: IController | null,
  open: boolean,
  setOpen: (visible: boolean) => void,
  reload: () => void
}> = ({controller, open, setOpen, reload}) => {
  const [newName, setNewName] = useState(undefined)
  const [newAddress, setNewAddress] = useState(undefined)

  useEffect(() => {
    setNewName(controller?.controllerName)
    setNewAddress(controller?.controllerAddress)
  }, [controller])

  return <Modal
    width={800}
    title="核心板卡信息"
    open={open}
    onOk={() => {
      updateController({
        ...controller,
        controllerName: newName,
        controllerAddress: newAddress
      }).then((res) => {
        if (res.code === SUCCESS_CODE) {
          setOpen(false)
          reload()
        }
      })
    }}
    onCancel={() => {
      setOpen(false)
    }}
  >
    <div>
      <div>
        <span>核心板卡代号:</span>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div>
        <span>核心板卡地址:</span>
        <Input
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
      </div>
    </div>
  </Modal>
}


export const ControllerDetailModal = ({controller, onClose}: { controller: IController, onClose: () => void }) => {

  return (
    <Modal width={800} title="采集板卡信息" open={controller !== undefined} onOk={() => {
      onClose()
    }} onCancel={() => {
      onClose()
    }}>
      <Descriptions bordered>
        <Descriptions.Item label="采集板卡代号">{controller?.controllerName}</Descriptions.Item>
        <Descriptions.Item label="采集板卡地址">{controller?.controllerAddress}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

