import React, {useState} from 'react';
import type {TreeDataNode} from 'antd';
import {Button, Modal, Tree} from 'antd';
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";

//查看配置树
const SEE_PROCESS_TREE = '查看配置树';

export const generateTreeData = (record: ITestProcessN) => {
    const data: TreeDataNode[] = [];
    for (let i = 0; i < record.testObjectNs.length; i++) {
        const key = `${i}`;
        const vehicleLeaf = {
            title: `车辆 ${record.testObjectNs[i].vehicle.vehicleName}`,
            key: key,
            children: [] as TreeDataNode[]
        }
        const projects = record.testObjectNs[i].project;
        const projectLeafs = projects.map((project, projectIndex) => {
            return {
                title: `项目 ${project.projectName}`,
                key: `${key}-${projectIndex}`,
                children: project.projectConfig.map((config, index) => {
                    return {
                        title: `${config.controller.controllerName} - ${config.collector.collectorName} - ${config.signal.signalName}`,
                        key: `${key}-${projectIndex}-${index}`,
                    }
                })
            }
        });

        vehicleLeaf.children = projectLeafs;
        data.push(vehicleLeaf);
    }
    return data;
};

interface IProcessTreeProps {
    record: ITestProcessN
}

const ProcessTree: React.FC<IProcessTreeProps> = ({record}) => {
    const data = generateTreeData(record);
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{SEE_PROCESS_TREE}</Button>
            <Modal title={SEE_PROCESS_TREE} open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
                <Tree
                    key={record.id}
                    className="draggable-tree"
                    blockNode
                    treeData={data}
                    draggable={false}
                />
            </Modal>
        </>
    );
};

export default ProcessTree;
