import { Table } from "antd";
import { IControllersConfigItem } from "../PhyTopology";

const ControllerInfoTable: React.FC<{
    dataSource: IControllersConfigItem[]
}> = ({ dataSource }) => {
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
    ];



    return <div style={{ height: 350 }}>
        <Table scroll={{ y: 300 }} sticky={true} bordered={true} pagination={false} rowKey={'id'} dataSource={dataSource} columns={columns} />
    </div>
}

export default ControllerInfoTable  