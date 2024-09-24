import {Button, message, Space, Table} from "antd";
import {ICollector, IController} from "../PhyTopology.tsx";
import {deleteCollector, updateCollector} from "@/apis/request/board-signal/collector.ts";
import {SUCCESS_CODE} from "@/constants";
import {NOT_ON_USED, ON_USED, USED_INFO} from "@/constants/board.ts";
import {confirmDelete} from "@/utils";
import {deleteController} from "@/apis/request/board-signal/controller.ts";

const CollectorInfoTable: React.FC<{
    dataSource: ICollector[],
    reload: () => void
}> = ({dataSource, reload}) => {
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
                </Space>
            }
        }
    ];


    return <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
                  dataSource={dataSource}
                  columns={columns}/>
}

export default CollectorInfoTable
