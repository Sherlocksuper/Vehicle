import {Button, Space, Table} from "antd";
import {ICollectorsConfigItem} from "../PhyTopology";
import {updateCollector} from "@/apis/request/board-signal/collector.ts";
import {SUCCESS_CODE} from "@/constants";
import {NOT_ON_USED, ON_USED, USED_INFO} from "@/constants/board.ts";

const CollectorInfoTable: React.FC<{
    dataSource: ICollectorsConfigItem[],
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
            render: (record: ICollectorsConfigItem) => {
                return record.isDisabled ? NOT_ON_USED : ON_USED
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (record: ICollectorsConfigItem) => {
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
                </Space>
            }
        }
    ];


    return <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
                  dataSource={dataSource}
                  columns={columns}/>
}

export default CollectorInfoTable  