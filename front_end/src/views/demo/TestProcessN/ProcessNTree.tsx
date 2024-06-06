import React, {useState} from 'react';
import {Button, Modal, Tree} from 'antd';
import type {TreeDataNode, TreeProps} from 'antd';
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";

//查看配置树
const SEE_PROCESS_TREE = '查看配置树';

const generateData = (record: ITestProcessN) => {
    const data: TreeDataNode[] = [];
    for (let i = 0; i < record.testObjectNs.length; i++) {
        const key = `${i}`;
        const vehicleLeaf = {
            title: `车辆 ${record.testObjectNs[i].vehicle.vehicleName}`,
            key: key,
            children: [] as TreeDataNode[]
        }

        for (let j = 0; j < record.testObjectNs.length; j++) {
            const key = `${i}-${j}`;
            const projectLeaf = {
                title: `项目 ${record.testObjectNs[j].project.projectName}`,
                key: key,
                children: [] as TreeDataNode[]
            }

            for (let k = 0; k < record.testObjectNs[i].project.projectConfig.length; k++) {
                const key = `${i}-${j}-${k}`;
                const configLeaf = {
                    title: `${record.testObjectNs[i].project.projectConfig[k].controller.controllerName} - ${record.testObjectNs[i].project.projectConfig[k].collector.collectorName} - ${record.testObjectNs[i].project.projectConfig[k].signal.signalName}`,
                    key: key,
                }
                projectLeaf.children.push(configLeaf);
            }

            vehicleLeaf.children.push(projectLeaf);
        }

        data.push(vehicleLeaf);
    }
    return data;
};

interface IProcessTreeProps {
    record: ITestProcessN
}

const ProcessTree: React.FC<IProcessTreeProps> = ({record}) => {
    const data = generateData(record);

    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>{SEE_PROCESS_TREE}</Button>
            <Modal title={SEE_PROCESS_TREE} open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)}>
                <Tree
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