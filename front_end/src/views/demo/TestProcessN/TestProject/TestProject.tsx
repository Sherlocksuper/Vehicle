import React from "react";
import { Button, Row, Space, Table } from "antd";
import type { TableProps } from "antd";
import { IProject } from "@/apis/standard/project.ts";
import CreateProject from "@/views/demo/TestProcessN/TestProject/NewTestProject.tsx";
import { deleteProject, getProjects } from "@/apis/request/project.ts";
import { confirmDelete } from "@/utils";

const TestProject: React.FC = () => {
  const [showCreateProject, setShowCreateProject] = React.useState<{
    disabled: boolean;
    open: boolean;
    initValue: string;
  }>({
    disabled: false,
    open: false,
    initValue: "",
  });
  const [projects, setProjects] = React.useState<IProject[]>([]);

  const columns: TableProps<IProject>["columns"] = [
    {
      title: "项目名称",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              console.log(record);
              setShowCreateProject({
                disabled: true,
                open: true,
                initValue: JSON.stringify(record),
              });
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            onClick={() => {
              confirmDelete() &&
                deleteProject(Number(record.id)).then(() => {
                  fetchProjects();
                });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const fetchProjects = () => {
    getProjects().then((res) => {
      setProjects(res.data);
    });
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <Row justify="end" style={{ marginBottom: 20 }}>
        <CreateProjectTest
          onOpen={() => {
            setShowCreateProject({
              disabled: false,
              open: true,
              initValue: "",
            });
          }}
          onOver={() => {
            setShowCreateProject({
              disabled: false,
              open: false,
              initValue: "",
            });
            fetchProjects();
          }}
          openIndex={showCreateProject.open}
          disableIndex={showCreateProject.disabled}
          initValueIndex={showCreateProject.initValue}
        ></CreateProjectTest>
      </Row>
      <Table
        columns={columns}
        dataSource={projects}
        key={projects?.length ?? 0}
        rowKey={"id"}
      />
    </div>
  );
};

export default TestProject;
interface ICreateProjectTestProps {
  onOpen: () => void;
  onOver: () => void;
  openIndex: boolean;
  disableIndex: boolean;
  initValueIndex: string;
}

const CreateProjectTest: React.FC<ICreateProjectTestProps> = ({
  onOpen,
  onOver,
  openIndex,
  disableIndex,
  initValueIndex,
}) => {
  const [showCreateProject, setShowCreateProject] = React.useState<{
    disabled: boolean;
    open: boolean;
    initValue: string;
  }>({
    disabled: false,
    open: false,
    initValue: "",
  });
  return (
    <div>
      <Button type="primary" onClick={() => onOpen()}>
        New
      </Button>
      <CreateProject
        open={openIndex}
        mode={"create"}
        onFinished={() => onOver()}
        disable={disableIndex}
        initValue={initValueIndex}
        key={new Date().getTime()}
      />
    </div>
  );
};
