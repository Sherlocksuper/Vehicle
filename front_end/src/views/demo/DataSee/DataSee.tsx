import React, {useEffect} from "react";
import {Button, Card, message, Space, Table, TableProps} from "antd";
import {FAIL_CODE} from "@/constants";
import {getCurrentTestConfig, stopCurrentTestConfig} from "@/apis/request/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";


const DataSee = () => {
  const [currentDownConfig, setCurrentDownConfig] = React.useState<ITestConfig | undefined>(undefined);

  const fetchCurrentConfig = () => {
    getCurrentTestConfig().then(res => {
      if (res.code === FAIL_CODE) {
        message.error(res.msg);
      } else {
        console.log('currentConfig:',res.data);
        setCurrentDownConfig(res.data);
      }
    });
  }

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
      title: '测试车辆',
      key: 'vehicle',
      render: (text, record) => (
        <span>{record.configs[0].vehicle.vehicleName}</span>
      ),
    },
    {
      title: `测试信号${currentDownConfig?(currentDownConfig.configs[0].projects ? ('('+currentDownConfig.configs[0].projects[0].indicators.length+')') : '未配置'):'无配置'}`,
      key: 'vehicle',
      render: (text, record) => (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}>
          {
            record.configs[0].projects.map(project => {
              return project.indicators.map(indicator => {
                return <span key={indicator.name}>{indicator.signal.name}</span>
              })
            }).flat(2)
          }
        </div>
      ),
    },
    // {
    //   title: '测试任务配置',
    //   key: 'set',
    //   render: (text, record) => (
    //     <Space direction={"vertical"} align={"start"}>
    //       {currentDownConfig?.id === record.id ?
    //         (<Button type={"link"} onClick={() => handleShowCurrentData()}>数据监视</Button>) : (" ")}
    //     </Space>
    //   ),
    // },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space align={"start"}>
          {currentDownConfig?.id === record.id ?
              (<Button type={"link"} onClick={() => handleShowCurrentData()}>数据监视</Button>) : (" ")}
          {(<Button type="link" onClick={() => handleStopCurrentCollect()}>停止下发</Button>)}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchCurrentConfig()
  }, []);

  return (
    <Card title={"当前测试任务"}
          style={{overflow: "scroll", overflowX: "hidden", height: "100vh", padding: "20px", display: "flex", flexDirection: "column"}}
    >
      <Table
        columns={columns}
        dataSource={!currentDownConfig ? [] : [currentDownConfig]}
        rowKey="id"
        style={{marginTop: "20px"}}
        locale={{emptyText: '暂无协议数据'}}
        pagination={false}
      />
    </Card>
  );
};

export default DataSee
