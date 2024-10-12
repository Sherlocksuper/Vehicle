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

      }}
      >接收数据动态监视</Button>
    </Card>
  )
}


export default DataSee
