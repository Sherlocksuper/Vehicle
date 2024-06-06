import {Button, message, Space, Table} from "antd";
import {IControllersConfigItem} from "../PhyTopology";
import {NOT_ON_USED, ENABLE, ON_USED, USED_INFO, DISABLE} from "@/constants/board.ts";
import {updateController} from "@/apis/request/board-signal/controller.ts";
import {SUCCESS_CODE} from "@/constants";

const ControllerInfoTable: React.FC<{
    dataSource: IControllersConfigItem[],
    reload: () => void
}> = ({dataSource, reload}) => {

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
            render: (record: IControllersConfigItem) => {
                return <span>{record.isDisabled ? NOT_ON_USED : ON_USED}</span>
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (record: IControllersConfigItem) => {
                return <Space size="middle">
                    <Button type="primary" onClick={() => {
                        const newController = {...record, isDisabled: !record.isDisabled} as IControllersConfigItem
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
                </Space>
            }
        }
    ];


    return <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
                  dataSource={dataSource} columns={columns}/>
}

export default ControllerInfoTable  