import React, {useEffect} from "react";
import {Button, Card, message} from "antd";
import {FAIL_CODE} from "@/constants";
import {getCurrentTestConfig} from "@/apis/request/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";


const DataSee = () => {

  useEffect(() => {
  }, [])

  return (
    <Card
      title="接收数据动态监视"
      style={{
        height: "100vh",
        overflow: "scroll",
      }}
    >
      <Button onClick={() => {
        getCurrentTestConfig().then(res => {
          if (res.code === FAIL_CODE) {
            message.error(res.msg);
          } else {
            console.log(res.data);
            const config: ITestConfig = (res.data);
            if (config.id === undefined) {
              message.error("当前无测试配置");
              return
            }
            const win = window.open(`/test-template-for-config?testConfigId=${config?.id}`);
            if (!win) return
          }
        });
      }}
      >接收数据动态监视</Button>
    </Card>
  )
}


export default DataSee
