import {Button, Card, message, Modal, Row, Space, Table, TableProps} from "antd";
import React, {useEffect} from "react";
import {FAIL_CODE} from "@/constants";
import {deleteProtocolApi, getProtocols, IProtocol} from "@/apis/request/protocol.ts";
import {ProtocolModel} from "@/views/demo/ProtocolTable/protocols.tsx";
import Search from "antd/es/input/Search";
import {ExpandAltOutlined} from "@ant-design/icons";


const ProtocolTable = () => {
    const [protocolStore, setProtocolStore] = React.useState<IProtocol[]>([]);

    const [protocols, setProtocols] = React.useState<IProtocol[]>([]);
    const [openProtocolModal, setOpenProtocolModal] = React.useState<boolean>(false);
    const [currentRecord, setCurrentRecord] = React.useState<IProtocol | undefined>(undefined);
    const [modelMode , setModelMode] = React.useState<"EDIT" | "ADD" | "SHOW">("EDIT");

    // 展示詳情,不允許編輯
    const handleShowDetail = (record: IProtocol) => {
        setCurrentRecord(record);
        setModelMode("SHOW");
        setOpenProtocolModal(true);
    };

    const updateProtocol = (record: IProtocol) => {
        setCurrentRecord(record);
        setModelMode("EDIT");
        setOpenProtocolModal(true);
    }

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
            title: "操作",
            key: "action",
            render: (text, record) => (
                <Space>
                    <a onClick={() => deleteProtocol(record.id!)}>删除</a>
                    <Button type={"link"} onClick={() => handleShowDetail(record)}>查看详情</Button>
                    <Button type={"link"} onClick={() => updateProtocol(record)}>编辑</Button>
                </Space>
            ),
        },
    ];

    const fetchProtocolData = () => {
        getProtocols().then(res => {
            if (res.code === FAIL_CODE) {
                message.error("请求失败：" + res.msg);
            } else {
                setProtocolStore(res.data)
                setProtocols(res.data);
            }
        });
    };

    const deleteProtocol = (id: number) => {
        confirm() && deleteProtocolApi(id).then(res => {
            if (res.code === FAIL_CODE) {
                message.error(res.msg);
            } else {
                fetchProtocolData();
            }
        });
    };

    useEffect(() => {
        fetchProtocolData();
    }, []);

    return (
        <Card style={{overflow: "scroll", overflowX: "hidden", height: "100vh"}}>
            <Space style={{marginBottom: "20px"}}>
                <Button type={"primary"} onClick={() => {
                    setCurrentRecord(undefined);
                    setOpenProtocolModal(true);
                    setModelMode("ADD");
                }}>添加协议</Button>
                <Search placeholder="请输入关键词" enterButton="搜索" size="large" onSearch={(value)=>{
                    const targetProtocols = protocolStore.map(protocol => {
                        if (protocol.protocolName.includes(value)){
                            return protocol
                        }
                    }).filter(protocol => protocol !== undefined)
                    setProtocols(targetProtocols)
                }}/>
            </Space>
            <Table
                columns={columns}
                dataSource={protocols}
                rowKey="id"
                style={{marginTop: "20px"}}
                locale={{emptyText: '暂无协议数据'}}
            />
            <ProtocolModel
                open={openProtocolModal}
                mode={modelMode}
                close={() => {
                    setCurrentRecord(undefined)
                    setOpenProtocolModal(false);
                }}
                onOk={() => fetchProtocolData()}
                initValue={currentRecord}
            />
        </Card>
    );
};
export default ProtocolTable
