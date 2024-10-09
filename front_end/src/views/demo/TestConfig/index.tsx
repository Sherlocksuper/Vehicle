import {Button, Card, message, Modal, Row, Space, Table, TableProps} from "antd";
import React, {useEffect} from "react";
import {FAIL_CODE} from "@/constants";
import {ITestConfig} from "@/apis/standard/test.ts";
import {deleteTestConfig, downTestConfig, getCurrentTestConfig, getTestConfigs, stopCurrentTestConfig} from "@/apis/request/testConfig.ts";
import {confirmDelete} from "@/utils";
import Search from "antd/es/input/Search";
import {TestConfigModel} from "@/views/demo/TestProcessN/TestVehicle/TestVehicle.tsx";
import {TestConfigTree} from "@/views/demo/TestConfig/testConfigModel.tsx";


const TestConfig = () => {
  const [configs, setConfigs] = React.useState<ITestConfig[]>([]);
  const [configsStore, setConfigsStore] = React.useState<ITestConfig[]>([]);

  const [openTestConfigModal, setOpenTestConfigModal] = React.useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = React.useState<ITestConfig | undefined>(undefined);
  const [currentDownConfig, setCurrentDownConfig] = React.useState<ITestConfig | undefined>(undefined);

  const handleShowDetail = (record: ITestConfig) => {
    setCurrentRecord(record);
    setOpenTestConfigModal(true);
  };

  const downConfig = (record: ITestConfig) => {
    if (currentDownConfig) {
      message.error('请先停止当前下发');
      return;
    }
    message.loading('下发中', 0);
    downTestConfig(record.id).then(res => {
      console.log(res)
      if (res.code === FAIL_CODE) {
        message.destroy()
        message.error("下发失败:" + res.msg + "请检查网络");
      } else {
        message.destroy()
        message.success('下发成功');
        setCurrentDownConfig(record);
      }
    })
  }

  const fetchConfigs = () => {
    getTestConfigs().then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        console.log(res.data);
        setConfigs(res.data);
        setConfigsStore(res.data);
      }
    });
  };

  const fetchCurrentConfig = () => {
    getCurrentTestConfig().then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        console.log(res.data);
        setCurrentDownConfig(res.data);
      }
    });
  }

  const deleteConfig = (id: number) => {
    confirmDelete() && deleteTestConfig(id).then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        message.success('删除成功');
        fetchConfigs();
      }
    });
  };

  // 前往查看当前数据
  const handleShowCurrentData = () => {
    const win = window.open(`/test-template-for-config?testConfigId=${currentDownConfig?.id}`);
    if (!win) return
  }

  const handleStopCurrentCollect = () => {
    stopCurrentTestConfig().then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        message.success('停止成功');
        setCurrentDownConfig(undefined);
      }
    });
  }

  const columns: TableProps<ITestConfig>['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '测试任务名称',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: '测试任务配置',
      key: 'set',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => downConfig(record)}>测试单元管理</Button>
          <Button type="link" onClick={() => downConfig(record)}>数据采集项</Button>
          <Button type="link" onClick={() => downConfig(record)}>采集数据封装</Button>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => handleShowDetail(record)}>查看</Button>
          <Button type="link" onClick={() => deleteConfig(record.id)}>删除</Button>
          <Button type="link" onClick={() => downConfig(record)}>下发</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchConfigs()
    fetchCurrentConfig()
  }, []);

  return (
    <Card title={"测试任务"}
          style={{overflow: "scroll", overflowX: "hidden", height: "100vh", padding: "20px", display: "flex", flexDirection: "column"}}
          extra={
            <Space style={{marginBottom: "20px", alignItems: "center",}}>
              <Button type="primary" onClick={() => {
                setOpenTestConfigModal(true);
              }}>{"添加测试任务"}</Button>

              <Button type={"primary"} disabled={!currentDownConfig} onClick={() => handleShowCurrentData()}>{
                currentDownConfig ? (currentDownConfig.name) : "暂无在下发任务"
              }</Button>

              <Button type={"primary"} onClick={() => handleStopCurrentCollect()}>停止当前采集</Button>

              {currentDownConfig?.name ?? "暂无下发配置"}

              <Search placeholder="请输入关键词" enterButton="搜索" size="large" onSearch={(value) => {
                const targetConfigs = configsStore.map(config => {
                  if (config.name.includes(value)) {
                    return config
                  }
                }).filter(config => config !== undefined)
                setConfigs(targetConfigs)
              }}/>
            </Space>
          }
    >
      <Table
        columns={columns}
        dataSource={configs}
        rowKey="id"
        style={{marginTop: "20px"}}
        locale={{emptyText: '暂无协议数据'}}
      />
      <TestConfigModel
        belongVehicle={undefined}
        onFinished={
          () => {
            fetchConfigs();
            setOpenTestConfigModal(false);
          }
        }
        open={openTestConfigModal}
      />
    </Card>
  );
};
export default TestConfig
