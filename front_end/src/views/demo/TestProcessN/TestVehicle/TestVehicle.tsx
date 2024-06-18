import React, { useEffect } from "react";
import { Button, Form, Input, message, Modal, Row, Space, Table } from "antd";
import type { TableProps } from "antd";
import { IVehicle } from "@/apis/standard/vehicle.ts";
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from "@/apis/request/vehicle.ts";
import { SUCCESS_CODE } from "@/constants";
import { useLoaderData } from "react-router-dom";
import { confirmDelete } from "@/utils";

const columns: TableProps<IVehicle>["columns"] = [
  {
    title: "车辆名称",
    dataIndex: "vehicleName",
    key: "vehicleName",
  },
  {
    title: "是否启用",
    dataIndex: "isDisabled",
    key: "isDisabled",
    render: (text) => (!text ? "是" : "否"),
  },
  {
    title: "操作",
    key: "action",
  },
];

const TestVehicle: React.FC = () => {
  const [vehicles, setVehicles] = React.useState<IVehicle[]>([]);
  const fetchVehicles = async () => {
    getVehicles().then((res) => {
      console.log("vehicle:" + res.data);
      setVehicles(res.data);
    });
  };

  useEffect(() => {
    fetchVehicles();
    columns[columns.length - 1].render = (_, record) => (
      <Space size="middle">
        <Button
          type="primary"
          danger={!record.isDisabled}
          onClick={() => {
            record.isDisabled = !record.isDisabled;
            updateVehicle(Number(record.id), record).then((res) => {
              if (res.code === SUCCESS_CODE) {
                fetchVehicles();
              } else {
                message.error("操作失败");
              }
            });
          }}
        >
          {record.isDisabled ? "启用" : "禁用"}
        </Button>
        <Button
          type="primary"
          disabled={!record.isDisabled}
          danger={true}
          onClick={() => {
            confirmDelete() &&
              deleteVehicle(Number(record.id)).then((res) => {
                if (res.code === SUCCESS_CODE) {
                  fetchVehicles();
                } else {
                  message.error("操作失败");
                }
              });
          }}
        >
          {"删除"}
        </Button>
      </Space>
    );
  }, []);

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <Row justify="end" style={{ marginBottom: 20 }}>
        <CreateViehcleModal
          openIndex={false}
          onFinished={function (): void {
            console.log("finished");
            fetchVehicles();
          }}
        ></CreateViehcleModal>
      </Row>
      <Table columns={columns} dataSource={vehicles} />
    </div>
  );
};

export default TestVehicle;

interface ICreateViehcleModalProps {
  openIndex: boolean;
  onFinished: () => void;
}
const CreateViehcleModal: React.FC<ICreateViehcleModalProps> = ({
  openIndex,
  onFinished,
}) => {
  const [form] = Form.useForm<IVehicle>();
  const [showCreateTestVehicle, setShowCreateTestVehicle] =
    React.useState<boolean>(openIndex);
  useEffect(() => {
    if (showCreateTestVehicle) {
      form.resetFields();
    }
    form.setFieldsValue({
      isDisabled: false,
    });
  }, [open]);

  const newVehicle = (value: IVehicle) => {
    createVehicle(value).then((res) => {
      console.log(res);
      setShowCreateTestVehicle(false);
      onFinished();
    });
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setShowCreateTestVehicle(true);
        }}
      >
        New
      </Button>
      <Modal
        title="新建车辆"
        open={showCreateTestVehicle}
        onOk={() => {
          form.validateFields().then((values) => {
            newVehicle(values);
          });
        }}
        onCancel={() => {
          setShowCreateTestVehicle(false);
          onFinished();
        }}
      >
        <Form form={form}>
          <Form.Item
            label="车辆名称"
            name="vehicleName"
            rules={[{ required: true, message: "请输入车辆名称!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
