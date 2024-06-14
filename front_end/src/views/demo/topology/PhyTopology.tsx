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
    Select
} from "antd"
import ControllerInfoTable from "./ControllerInfoTabl"
import {useMemo, useState} from "react";
import {request} from "@/utils/request";
import {Method} from "@/apis/standard/all";
import CollectorInfoTable from "./CollectorInfoTable";
import SignalInfoTable from "./SignalInfoTable";
import './PhyTopology.css'
import {SUCCESS_CODE} from "@/constants";
import {createSignal} from "@/apis/request/board-signal/signal.ts";
import {createCollector, getActiveCollectorList} from "@/apis/request/board-signal/collector.ts";
import {createController} from "@/apis/request/board-signal/controller.ts";

export interface IControllersConfigItem {
    id: number
    controllerName: string
    controllerAddress: string
    userId?: number
    isDisabled: boolean
}

export interface ICollectorsConfigItem {
    id: number
    collectorName: string
    collectorAddress: string
    userId?: number
    isDisabled: boolean
}

export interface ISignalsConfigItem {
    id: number
    signalName: string
    signalUnit: string
    signalType: string
    remark: string
    innerIndex: number
    collectorId: number
    collector: ICollectorsConfigItem
}

interface ITestData {
    controllersConfig: IControllersConfigItem[]
    collectorsConfig: ICollectorsConfigItem[]
    signalsConfig: ISignalsConfigItem[]
}


const PreTestManager: React.FC = () => {
    const [testData, setTestData] = useState<ITestData>()

    function reloadData() {
        (async () => {
            const res = await request({
                api: {
                    url: '/getTestDevicesInfo',
                    method: Method.GET
                }
            })
            if (res.code === SUCCESS_CODE) {
                message.success('获取测试设备信息成功', 0.5)
                setTestData(res.data)
            } else {
                message.error('获取测试设备信息失败')
            }
        })()
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
        {
            key: '3',
            label: '信号描述',
            children: <SignalInfoTable dataSource={testData?.signalsConfig || []}/>,
        },
    ]


    return <Card title='当前板卡配置情况' className="tm_card" style={{
        height: '100%',
        overflowY: 'scroll'
    }} extra={<Row gutter={[10, 10]}>
        <Col>
            <Button type="primary" onClick={reloadData}>刷新</Button>
        </Col>
        <AddConOrCollect reloadData={reloadData} type="controller"/>
        <AddConOrCollect reloadData={reloadData} type="collector"/>
        <AddSignal reloadData={reloadData}/>
    </Row>}>
        <Tabs className="tm_tabs" defaultActiveKey="1" items={items}/>
    </Card>
}

export default PreTestManager


interface AddManagerProps {
    reloadData: () => void
    type: 'controller' | 'collector'
}

//添加核心板卡
const AddConOrCollect = ({reloadData, type}: AddManagerProps) => {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')

    const boardType = type === 'controller' ? '核心板卡' : '采集板卡'

    const checkValid = () => {
        const addresses = address.split('.')
        if (addresses.length !== 4) {
            message.error('板卡地址格式错误')
            return false
        }
        addresses.forEach((i: string) => {
            if (isNaN(Number(i)) || Number(i) < 0 || Number(i) > 255) {
                message.error('板卡地址格式错误')
                return false
            }
        })

        return true
    }

    const close = () => {
        setOpen(false)
        setName('')
        setAddress('')
    }

    const addController = () => {
        const controller = {
            controllerName: name,
            controllerAddress: address
        } as IControllersConfigItem

        createController(controller).then((res) => {
            if (res.code === SUCCESS_CODE) {
                message.success('添加成功')
                close()
                reloadData()
            } else {
                message.error('添加失败')
            }
        })
    }

    const addCollector = () => {
        const collector = {
            collectorName: name,
            collectorAddress: address
        } as ICollectorsConfigItem

        createCollector(collector).then((res: any) => {
            if (res.code === SUCCESS_CODE) {
                message.success('添加成功')
                close()
                reloadData()
            } else {
                message.error('添加失败')
            }
        })
    }

    return <>
        <Col>
            <Button type="primary" onClick={() => {
                setOpen(true)
            }}>
                添加{boardType}
            </Button>
        </Col>
        <Modal
            title={`添加${boardType}`}
            open={open}
            onOk={() => {
                if (checkValid()) {
                    type === 'controller' ? addController() : addCollector()
                    setOpen(false)
                }
            }}
            onCancel={close}
        >
            <Input placeholder={`请输入${boardType}名称`} style={{marginBottom: 10}} required={true} onChange={
                (e) => {
                    setName(e.target.value)
                }
            }/>
            <Input placeholder={`请输入${boardType}地址,格式如：127.0.0.1`} style={{marginBottom: 10}} required={true}
                   onChange={
                       (e) => {
                           setAddress(e.target.value)
                       }
                   }/>
        </Modal>
    </>
}


//添加采集指标
interface AddSignalProps {
    reloadData: () => void
}

const AddSignal = ({reloadData}: AddSignalProps) => {
    const [open, setOpen] = useState(false)
    const [single, setSingle] = useState<ISignalsConfigItem>({
        signalName: '',
        signalUnit: '',
        signalType: '',
        remark: '',
        innerIndex: 0,
        collectorId: 0
    } as ISignalsConfigItem)

    //获取采集板卡列表
    const [collectors, setCollectors] = useState<any[]>([])

    const newSignal = () => {
        if (!checkValid()) return
        createSignal(single).then((res: any) => {
            console.log(res)
            if (res.code === SUCCESS_CODE) {
                message.success('添加成功')
                close()
                reloadData()
            } else {
                message.error('添加失败')
            }
        }).catch((error) => {
            console.log(error)
            message.error('添加失败')
        })
    }

    const checkValid = () => {
        if (single.signalName === '' || single.signalUnit === '' || single.signalType === '') {
            message.error('请填写完整信息')
            return false
        }
        return true
    }

    const close = () => {
        setOpen(false)
        setSingle({
            signalName: '',
            signalUnit: '',
            signalType: '',
            remark: '',
            innerIndex: 0,
            collectorId: 0
        } as ISignalsConfigItem)
    }

    useMemo(() => {
        (async () => {
            getActiveCollectorList().then((res: any) => {
                if (res.code === SUCCESS_CODE) {
                    setCollectors(res.data)
                } else {
                    message.error('获取采集板卡列表失败')

                }
            })
        })()
    }, [])

    return <>
        <Col>
            <Button type="primary" onClick={() => {
                setOpen(true)
            }}>
                添加采集指标
            </Button>
        </Col>
        <Modal
            title="添加采集指标"
            open={open}
            onOk={() => {
                newSignal()
            }}
            onCancel={close}
            key={single.innerIndex + open.toString()}
        >
            请选择采集板卡：
            <Select placeholder="采集板卡" style={{marginBottom: 10}} onSelect={(value) => {
                setSingle({...single, collectorId: value})
            }}>
                {collectors.map((item: any) => {
                    return <Select.Option value={item.id}>{item.collectorName}</Select.Option>
                })}
            </Select>

            <br/>
            请输入信号名：
            <Input placeholder="信号名" style={{marginBottom: 10}} required={true} onChange={
                (e) => {
                    setSingle({...single, signalName: e.target.value})
                }
            }/>

            <br/>
            请选择信号单位：
            <Select placeholder="单位" style={{marginBottom: 10}} onSelect={(value) => {
                setSingle({...single, signalUnit: value})
            }}>
                <Select.Option value="V">V</Select.Option>
                <Select.Option value="A">A</Select.Option>
                <Select.Option value="W">W</Select.Option>
                <Select.Option value="Hz">Hz</Select.Option>
                <Select.Option value="℃">℃</Select.Option>
                <Select.Option value="%">%</Select.Option>
            </Select>

            <br/>

            请选择信号类型：
            <Select placeholder="信号类型" style={{marginBottom: 10}} onSelect={(value) => {
                setSingle({...single, signalType: value})
            }}>
                <Select.Option value="模拟量">模拟量</Select.Option>
                <Select.Option value="数字量">数字量</Select.Option>
            </Select>
        </Modal>
    </>
}