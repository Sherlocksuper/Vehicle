import {Button, Descriptions, Modal, Space, Table, Tag} from "antd";
import {ICollector} from "../PhyTopology.tsx";
import {deleteCollector, updateCollector} from "@/apis/request/board-signal/collector.ts";
import {SUCCESS_CODE} from "@/constants";
import {NOT_ON_USED, ON_USED, USED_INFO} from "@/constants/board.ts";
import {confirmDelete} from "@/utils";
import React, {useState} from "react";
import {ProtocolModel} from "@/views/demo/ProtocolTable/protocols.tsx";
import {IProtocol} from "@/apis/request/protocol.ts";

const CollectorInfoTable: React.FC<{
    dataSource: ICollector[],
    reload: () => void
}> = ({dataSource, reload}) => {
    const [collector, setCollector] = useState<ICollector | undefined>(undefined)
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
                    <Button type="primary" danger onClick={() => {
                        if (!confirmDelete())return;
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
                     <Button type="primary" onClick={() => {
                          setCollector(record)
                     }}>
                         详情
                     </Button>
                </Space>
            }
        }
    ];


    return <>
        <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
               dataSource={dataSource}
               columns={columns}/>

        <Modal width={800} title="采集板卡信息" open={collector !== undefined} onOk={() => {
            setCollector(undefined)
        }} onCancel={() => {
            setCollector(undefined)
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
        </Modal>
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
