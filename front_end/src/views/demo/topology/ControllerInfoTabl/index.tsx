import {Button, Space, Table} from "antd";
import {IControllersConfigItem} from "../PhyTopology";

const ControllerInfoTable: React.FC<{
    dataSource: IControllersConfigItem[]
}> = ({dataSource}) => {
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


    return <Table  sticky={true} bordered={true} pagination={false} rowKey={'id'}
                  dataSource={dataSource} columns={columns}/>
}

export default ControllerInfoTable  