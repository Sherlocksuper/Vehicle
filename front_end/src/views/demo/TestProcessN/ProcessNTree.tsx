import React, {useState} from 'react';
import type {TreeDataNode} from 'antd';
import {Button, Modal, Tree} from 'antd';
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

        vehicleLeaf.children = record.testObjectNs[i].project.map((project, index) => {
            return {
                title: `项目 ${project.projectName}`,
                key: `${key}-${index}`
            }
        });
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