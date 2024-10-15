import {Divider, Form, Input, message, Modal, Select} from "antd";
import React, {useEffect} from "react";
import {createProtocol, IProtocol, ProtocolType, updateProtocol} from "@/apis/request/protocol.ts";
import {SUCCESS_CODE} from "@/constants";
import {
  AnalogBaseConfig,
  AnalogSignalsParsingForm,
  B1552BaseConfig,
  B1552BSignalParsingForm,
  CanBaseConfig,
  CanSignalsParsingForm,
  DigitalBaseConfig,
  DigitalSignalsParsingForm,
  FlexRayBaseConfig,
  FlexRaySignalsParsingForm,
  MICBaseConfig,
  MICSignalsParsingForm,
  Serial232BaseConfig,
  Serial232SignalsParsingForm,
  Serial422BaseConfig,
  Serial422SignalsParsingForm
} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

export const ProtocolModel = ({open, close, onOk, mode, initValue}: {
  // 外面的状态
  open: boolean,
  close: () => void
  initValue?: IProtocol
  mode?: "EDIT" | "ADD" | "SHOW",
  onOk?: () => void,
}) => {
  const [form] = Form.useForm();
  const [protocolType, setProtocolType] = React.useState<ProtocolType>(undefined)

  useEffect(() => {
    // 给form添加一个信号解析配置
    form.setFieldsValue({
      signalsParsingConfig: [{
        signals: []
      }]
    })

    // 初始化为initValue
    if (initValue) {
      form.setFieldsValue(initValue)
      setProtocolType(initValue.protocolType)
    }

    return () => {
      form.resetFields()
    }
  }, [form, initValue])


  const handleOk = () => {
    // 检查是否合法
    form.validateFields().then(() => {
      form.submit()
    })
  };

  const handleCancel = () => {
    close()
  };

  const checkNameValid = (value: IProtocol) => {
    const signalNames = value.signalsParsingConfig.map((spConfig) => {
      return spConfig.signals.map((signal) => {
        return signal.name
      })
    }).flat(3)
    const names = new Set<string>()
    for (const name of signalNames) {
      if (names.has(name)) {
        return false
      }
      names.add(name)
    }
    return true
  }

  return (
    <>
      <Modal
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        width={"80%"}
      >
        <Form layout="vertical" form={form}
              disabled={mode === "SHOW"}
              onFinish={() => {
                const value = form.getFieldsValue() as IProtocol
                if (!checkNameValid(value)) {
                  message.error("存在重复的信号名称，请检查")
                  return
                }
                if (mode === "ADD") {
                  createProtocol(value as IProtocol).then((res) => {
                    if (res.code === SUCCESS_CODE) {
                      message.success("添加成功")
                      onOk && onOk()
                      close()
                    } else {
                      message.error("添加失败：", res.message)
                    }
                  })
                } else if (mode === "EDIT") {
                  value.id = initValue.id
                  updateProtocol(value as IProtocol).then((res) => {
                    if (res.code === SUCCESS_CODE) {
                      message.success("添加成功")
                      onOk && onOk()
                      close()
                    } else {
                      message.error("添加失败：", res.message)
                    }
                  })
                }
              }}
        >
          <Form.Item name={"protocolName"} rules={[{required: true, message: "请输入协议名称"}]}>
            <Input placeholder="为协议命名"/>
          </Form.Item>
          <Form.Item name={"protocolType"} initialValue={protocolType}>
            <Select placeholder="请选择协议" onSelect={(value) => {
              form.resetFields(["signalsParsingConfig"])
              form.setFieldsValue({protocolType: value})
              setProtocolType(value
              )
            }}>
              {
                Object.values(ProtocolType).map((item) => {
                  if (ProtocolType.B1552B === item) return <Select.Option key={item} value={item}>{"1553B"}</Select.Option>
                  if (ProtocolType.Serial232 === item) return <Select.Option key={item} value={item}>{"RS232"}</Select.Option>
                  if (ProtocolType.Serial422 === item) return <Select.Option key={item} value={item}>{"RS422/RS485"}</Select.Option>
                  if (ProtocolType.Analog === item) return <Select.Option key={item} value={item}>{"模拟量"}</Select.Option>
                  if (ProtocolType.Digital === item) return <Select.Option key={item} value={item}>{"数字量"}</Select.Option>

                  if (ProtocolType.CAN === item) return <Select.Option key={item} value={item}>{"CAN/TTCAN"}</Select.Option>
                  return <Select.Option key={item} value={item}>{item}</Select.Option>
                })
              }
            </Select>
          </Form.Item>

          <Divider>基础配置</Divider>
          {protocolType === ProtocolType.CAN && <CanBaseConfig/>}
          {protocolType === ProtocolType.FlexRay && <FlexRayBaseConfig/>}
          {protocolType === ProtocolType.MIC && <MICBaseConfig/>}
          {protocolType === ProtocolType.B1552B && <B1552BaseConfig/>}
          {protocolType === ProtocolType.Serial422 && <Serial422BaseConfig/>}
          {protocolType === ProtocolType.Serial232 && <Serial232BaseConfig/>}
          {protocolType === ProtocolType.Analog && <AnalogBaseConfig/>}
          {protocolType === ProtocolType.Digital && <DigitalBaseConfig/>}
          <Divider>信号解析配置</Divider>
          {protocolType === ProtocolType.CAN && <CanSignalsParsingForm/>}
          {protocolType === ProtocolType.FlexRay && <FlexRaySignalsParsingForm/>}
          {protocolType === ProtocolType.MIC && <MICSignalsParsingForm/>}
          {protocolType === ProtocolType.B1552B && <B1552BSignalParsingForm/>}
          {protocolType === ProtocolType.Serial422 && <Serial422SignalsParsingForm/>}
          {protocolType === ProtocolType.Serial232 && <Serial232SignalsParsingForm/>}
          {protocolType === ProtocolType.Analog && <AnalogSignalsParsingForm/>}
          {protocolType === ProtocolType.Digital && <DigitalSignalsParsingForm/>}
        </Form>
      </Modal>
    </>
  );
};


