import {Button, Card, message, Row, Space, Table, TableProps} from "antd";
import React, {useEffect} from "react";
import {confirmDelete} from "@/utils";
import {FAIL_CODE} from "@/constants";
import {deleteProtocolApi, getProtocols, IProtocol} from "@/apis/request/protocol.ts";
import {ProtocolModel} from "@/views/demo/ProtocolTable/protocols.tsx";


const columns: TableProps<IProtocol>['columns'] = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "协议名称",
        dataIndex: "protocolName",
        key: "protocolName",
    },
    {
        title: "协议类型",
        dataIndex: "protocolType",
        key: "protocolType",
    },
    {
        title: "结果",
        dataIndex: "result",
        key: "result",
    },
    {
        title: "操作",
        key: "action",
    }
];

const ProtocolTable = () => {
    const [protocols, setProtocols] = React.useState([])
    const [openProtocolModel, setOpenProtocolModal] = React.useState<"ADD" | "SHOW" | "">("")

    columns[columns.length - 1].render = (text, record) => (
        <Space>
            <a onClick={() => deleteProtocol(record.id!)}>删除</a>
        </Space>
    )

    const fetchProtocolData = () => {
        getProtocols().then(res => {
            if (res.code === FAIL_CODE) message.error("请求失败：", res.msg)
            setProtocols(res.data)
        })
    }

    const deleteProtocol = (id: number) => {
        console.log(id)
        confirmDelete() && deleteProtocolApi(id).then(res => {
            if (res.code === FAIL_CODE) message.error(res.msg)
            fetchProtocolData()
        })
    }


    useEffect(() => {
        fetchProtocolData()
    }, [])

    return (
        <Card style={{
            overflow: "scroll",
            overflowX: "hidden",
            height: "100vh",
        }}>
            <Row justify="start">
                <Button type={"primary"} onClick={() => setOpenProtocolModal("ADD")}>添加协议</Button>
                <ProtocolModel mode={openProtocolModel} result={""} close={() => setOpenProtocolModal("")}
                               onOk={() => fetchProtocolData()}
                />
            </Row>
            <Table
                columns={columns}
                dataSource={protocols}
                rowKey="id"
                style={{
                    marginTop: "20px"
                }}
            />
        </Card>
    )
}

export default ProtocolTable
