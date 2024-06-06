import {Button, Space, Table} from "antd";
import {ICollectorsConfigItem} from "../PhyTopology";

const CollectorInfoTable: React.FC<{
    dataSource: ICollectorsConfigItem[]
}> = ({dataSource}) => {
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
            title: '是否禁用',
            dataIndex: 'isDisabled',
            key: 'isDisabled',
            render: (isDisabled: boolean) => isDisabled ? '是' : '否'
        },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <Button type="primary">禁用</Button>
                </Space>
            ),
        }
    ];


    return <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
                  dataSource={dataSource}
                  columns={columns}/>
}

export default CollectorInfoTable  