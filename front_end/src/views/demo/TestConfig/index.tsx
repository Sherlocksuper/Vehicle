import {Button, Card, message, Row, Space, Table, TableProps} from "antd";
import React, {useEffect} from "react";
import {FAIL_CODE} from "@/constants";
import {ITestConfig} from "@/apis/standard/test.ts";
import {deleteTestConfig, getTestConfigs} from "@/apis/request/testConfig.ts";
import {TestConfigModel} from "@/views/demo/TestConfig/testConfigModel.tsx";


const TestConfig = () => {
    const [configs, setConfigs] = React.useState<ITestConfig[]>([]);
    const [openTestConfigModal, setOpenTestConfigModal] = React.useState<boolean>(false);
    const [currentRecord, setCurrentRecord] = React.useState<ITestConfig | undefined>(undefined);

    const handleShowDetail = (record: ITestConfig) => {
        setCurrentRecord(record);
        setOpenTestConfigModal(true);
    };

    const columns: TableProps<ITestConfig>['columns'] = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '测试配置名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button type="link" onClick={() => handleShowDetail(record) }>查看</Button>
                    <Button type="link" onClick={() => deleteConfig(record.id)}>删除</Button>
                </Space>
            ),
        },
    ];

    const fetchConfigs = () => {
        getTestConfigs().then(res => {
            if (res.code === FAIL_CODE) {
                message.error(res.msg);
            } else {
                console.log(res.data);
                setConfigs(res.data);
            }
        });
    };

    const deleteConfig = (id: number) => {
        deleteTestConfig(id).then(res => {
            if (res.code === FAIL_CODE) {
                message.error(res.msg);
            } else {
                message.success('删除成功');
                fetchConfigs();
            }
        });
    };

    useEffect(() => {
        fetchConfigs()
    }, []);

    return (
        <Card style={{overflow: "scroll", overflowX: "hidden", height: "100vh"}}>
            <Row justify="start" style={{marginBottom: "20px"}}>
                <Button type={"primary"} onClick={() => {
                    setCurrentRecord(undefined);
                    setOpenTestConfigModal(true);
                }}>添加创建配置</Button>
            </Row>
            <Table
                columns={columns}
                dataSource={configs}
                rowKey="id"
                style={{marginTop: "20px"}}
                locale={{emptyText: '暂无协议数据'}}
            />
            <TestConfigModel
                open={openTestConfigModal}
                close={() => {
                    setCurrentRecord(undefined)
                    setOpenTestConfigModal(false);
                }}
                onOk={() => fetchConfigs()}
                initValue={currentRecord}
            />
        </Card>
    );
};
export default TestConfig
