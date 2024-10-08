import {
    Button,
    Card,
    Modal,
    Tabs,
    TabsProps,
    message,
    Row,
    Col,
    Input,
    Select, Form,
} from "antd";
import ControllerInfoTable from "./ControllerInfoTabl";
import React, {useEffect, useMemo, useState} from "react";
import {request} from "@/utils/request";
import {Method} from "@/apis/standard/all";
import CollectorInfoTable from "./CollectorInfoTable";
import {SUCCESS_CODE} from "@/constants";
import {createSignal} from "@/apis/request/board-signal/signal.ts";
import {
    createCollector,
    getActiveCollectorList,
} from "@/apis/request/board-signal/collector.ts";
import {createController} from "@/apis/request/board-signal/controller.ts";
import {getProtocols, IProtocol} from "@/apis/request/protocol.ts";

export interface IController {
    id: number;
    controllerName: string;
    controllerAddress: string;
    userId?: number;
    isDisabled: boolean;
}

export interface ICollector {
    id: number;
    collectorName: string;
    collectorAddress: number;
    protocols: IProtocol[];
    userId?: number;
    isDisabled: boolean;
}

export interface ISignal {
    id: number;
    signalName: string;
    signalUnit: string;
    signalType: string;
    signalAttribute: string;
    remark: string;
    innerIndex: number;
    collectorId: number;
    collector: ICollector;
}

interface ITestData {
    controllersConfig: IController[];
    collectorsConfig: ICollector[];
    signalsConfig: ISignal[];
}

const PreTestManager: React.FC = () => {
    const [testData, setTestData] = useState<ITestData>();

    function reloadData() {
        (async () => {
            const res = await request({
                api: {
                    url: "/getTestDevicesInfo",
                    method: Method.GET,
                },
            });
            if (res.code === SUCCESS_CODE) {
                message.success("获取测试设备信息成功", 0.5);
                setTestData(res.data);
            } else {
                message.error("获取测试设备信息失败");
            }
        })();
    }

    useMemo(() => {
        reloadData()
    }, [])


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '核心板卡描述',
            children: <ControllerInfoTable dataSource={testData?.controllersConfig || []} reload={reloadData}/>,
        },
        {
            key: '2',
            label: '采集板卡描述',
            children: <CollectorInfoTable dataSource={testData?.collectorsConfig || []} reload={reloadData}/>
        },
        // {
        //     key: '3',
        //     label: '信号描述',
        //     children: <SignalInfoTable dataSource={testData?.signalsConfig || []}/>,
        // },
    ]


    return (<Card title='当前板卡配置情况' className="tm_card" style={{
            height: '100%',
            overflowY: 'scroll'
        }} extra={<Row gutter={[10, 10]}>
            <Col>
                <Button type="primary" onClick={reloadData}>刷新</Button>
            </Col>
            <AddConOrCollectButton reloadData={reloadData} type="controller"/>
            <AddConOrCollectButton reloadData={reloadData} type="collector"/>
            {/*<AddSignalButton reloadData={reloadData}/>*/}
        </Row>}>
            <Tabs className="tm_tabs" defaultActiveKey="1" items={items}/>
        </Card>
    );
};


interface AddManagerProps {
    reloadData: () => void;
    type: "controller" | "collector";
}

//添加核心板卡
const AddConOrCollectButton = ({reloadData, type}: AddManagerProps) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [selectedProtocols, setSelectedProtocols] = useState<IProtocol[]>([])

    const boardType = type === 'controller' ? '核心板卡' : '采集板卡'
    const [protocols,setProtocols] = useState<IProtocol[]>([])

    useEffect(()=>{
        fetchData()
    },[])

    const fetchData = () => {
        getProtocols().then((res) => {
            if (res.code !== SUCCESS_CODE) {
                message.error("获取协议失败："+ res.msg)
                return
            }
            setProtocols(res.data)
        })
    }

    const close = () => {
        setOpen(false);
        setName("");
        setAddress("");
        setSelectedProtocols([])
    };

    const addController = () => {
        const controller = {
            controllerName: name,
            controllerAddress: address,
        } as IController;

        createController(controller).then((res) => {
            if (res.code === SUCCESS_CODE) {
                message.success("添加成功");
                close();
                reloadData();
            } else {
                message.error("添加失败");
            }
        });
    };

    const addCollector = () => {
        const collector = {
            collectorName: name,
            collectorAddress: Number(address),
            protocols: selectedProtocols
        } as ICollector;

        createCollector(collector).then((res: any) => {
            if (res.code === SUCCESS_CODE) {
                message.success("添加成功");
                close();
                reloadData();
            } else {
                message.error("添加失败");
            }
        });
    };

    return (
        <>
            <Col>
                <Button
                    type="primary"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    添加{boardType}
                </Button>
            </Col>
            <Modal
                title={`添加${boardType}`}
                open={open}
                onOk={() => {
                    if (name === "" || address === "") {
                        message.error("请填写完整信息");
                        return;
                    }
                    type === "controller" ? addController() : addCollector();
                    close()
                }}
                onCancel={()=>{close()}} >
                <Input
                    placeholder={`请输入${boardType}名称`}
                    style={{marginBottom: 10}}
                    required={true}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    value={name}
                />
                <Input
                    placeholder={`请输入板卡地址`}
                    style={{marginBottom: 10}}
                    required={true}
                    onChange={(e) => {
                        setAddress(e.target.value);
                    }}
                    value={address}
                />
                {
                    type === 'collector' ?
                        <Select
                          mode="multiple"
                          placeholder="请选择协议"
                          style={{marginBottom: 20,width:'100%'}}
                          onSelect={(value) => {
                              setSelectedProtocols([...selectedProtocols, JSON.parse(value as string)])
                          }}
                          value={selectedProtocols.map((item) => JSON.stringify(item))}
                        >
                            {
                                protocols.map((item) => {
                                    return <Select.Option key={item.protocolName}
                                                          value={JSON.stringify(item)}>{item.protocolName}</Select.Option>
                                })
                            }
                        </Select> : null
                }
            </Modal>
        </>
    );
};

//添加采集指标
interface AddSignalProps {
    reloadData: () => void;
}

const AddSignalButton = ({reloadData}: AddSignalProps) => {
    const [open, setOpen] = useState(false)
    const [single, setSingle] = useState<ISignal>({
        signalName: '',
        signalUnit: '',
        signalType: '',
        signalAttribute: '',
        remark: '',
        innerIndex: 0,
        collectorId: 0
    } as ISignal)

    //获取采集板卡列表
    const [collectors, setCollectors] = useState<any[]>([]);

    const newSignal = () => {
        if (!checkValid()) return;
        createSignal(single)
            .then((res: any) => {
                if (res.code === SUCCESS_CODE) {
                    message.success("添加成功");
                    close();
                    reloadData();
                } else {
                    message.error("添加失败");
                }
            })
            .catch((error) => {
                console.log(error);
                message.error("添加失败");
            });
    };

    const checkValid = () => {
        if (
            single.signalName === "" ||
            single.signalUnit === "" ||
            single.signalType === "" ||
            single.signalAttribute === ""
        ) {
            message.error("请填写完整信息");
            return false;
        }
        return true;
    };

    const close = () => {
        setOpen(false);
        setSingle({
            signalName: "",
            signalUnit: "",
            signalType: "",
            remark: "",
            innerIndex: 0,
            collectorId: 0,
        } as ISignal);
    };

    useMemo(() => {
        (async () => {
            getActiveCollectorList().then((res: any) => {
                if (res.code === SUCCESS_CODE) {
                    setCollectors(res.data);
                } else {
                    message.error("获取采集板卡列表失败");
                }
            });
        })();
    }, []);

    return (
        <>
            <Col>
                <Button
                    type="primary"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    添加采集指标
                </Button>
            </Col>
            <Modal
                title="添加采集指标"
                open={open}
                onOk={() => {
                    newSignal();
                }}
                onCancel={close}
                key={single.innerIndex + open.toString()}
            >
                请选择采集板卡：
                <Select
                    placeholder="采集板卡"
                    style={{marginBottom: 10}}
                    onSelect={(value) => {
                        setSingle({...single, collectorId: value});
                    }}
                >
                    {collectors.map((item: any) => {
                        return (
                            <Select.Option value={item.id} key={item.id}>
                                {item.collectorName}
                            </Select.Option>
                        );
                    })}
                </Select>
                <br/>
                请输入信号名：
                <Input
                    placeholder="信号名"
                    style={{marginBottom: 10}}
                    required={true}
                    onChange={(e) => {
                        setSingle({...single, signalName: e.target.value});
                    }}
                />
                <br/>
                请选择信号单位：
                <Select
                    placeholder="单位"
                    style={{marginBottom: 10}}
                    onSelect={(value) => {
                        setSingle({...single, signalUnit: value});
                    }}
                >
                    <Select.Option value="V">V</Select.Option>
                    <Select.Option value="A">A</Select.Option>
                    <Select.Option value="W">W</Select.Option>
                    <Select.Option value="Hz">Hz</Select.Option>
                    <Select.Option value="℃">℃</Select.Option>
                    <Select.Option value="%">%</Select.Option>
                </Select>
                <br/>
                请选择信号类型：
                <Select
                    placeholder="信号类型"
                    style={{marginBottom: 10}}
                    onSelect={(value) => {
                        setSingle({...single, signalType: value});
                    }}
                >
                    <Select.Option value="模拟量">模拟量</Select.Option>
                    <Select.Option value="数字量">数字量</Select.Option>
                </Select>
                <br/>
                请选择输入信号属性：
                <Input placeholder="信号属性" style={{marginBottom: 10}} required={true}
                          onChange={(e) => {
                            setSingle({...single, signalAttribute: e.target.value})
                          }}/>
                <br/>
            </Modal>
        </>
    )
}

export default PreTestManager;
