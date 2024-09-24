import {Button, message, Space, Table} from "antd";
import {IController} from "../PhyTopology.tsx";
import {NOT_ON_USED, ENABLE, ON_USED, USED_INFO, DISABLE} from "@/constants/board.ts";
import {deleteController, updateController} from "@/apis/request/board-signal/controller.ts";
import {SUCCESS_CODE} from "@/constants";
import {confirmDelete} from "@/utils";

const ControllerInfoTable: React.FC<{
    dataSource: IController[],
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
                    <Button type="primary" danger onClick={() => {
                        if (!confirmDelete())return;
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


    return <Table sticky={true} bordered={true} pagination={false} rowKey={'id'}
                  dataSource={dataSource} columns={columns}/>
}

export default ControllerInfoTable
