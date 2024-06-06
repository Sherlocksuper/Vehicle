import {Table} from "antd";
import {ISignalsConfigItem} from "../PhyTopology";

const SignalInfoTable: React.FC<{
    dataSource: ISignalsConfigItem[],
}> = ({dataSource}) => {
    const columns = [
        {
            title: '卡内序号',
            dataIndex: 'innerIndex',
            key: 'innerIndex',
        },
        {
            title: '采集板代号',
            dataIndex: 'collectorName',
            key: 'collectorName'
        },
        {
            title: '信号名',
            dataIndex: 'signalName',
            key: 'signalName',
        },
        {
            title: '单位',
            dataIndex: 'signalUnit',
            key: 'signalUnit',
        },
        {
            title: '信号类型',
            dataIndex: 'signalType',
            key: 'signalType',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
    ];


    return <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
                  dataSource={dataSource} columns={columns}/>
}

export default SignalInfoTable  