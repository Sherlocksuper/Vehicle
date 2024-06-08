import {
    Button,
    Card,
    List,
    Modal,
    Popconfirm,
    Result,
    Tabs,
    TabsProps,
    Tag,
    message,
    Row,
    Col,
    Input,
    Select
} from "antd"
import ControllerInfoTable from "./ControllerInfoTabl"
import {useMemo, useState} from "react";
import {request} from "@/utils/request";
import {ContentType, Method, ResponseType} from "@/apis/standard/all";
import CollectorInfoTable from "./CollectorInfoTable";
import SignalInfoTable from "./SignalInfoTable";
import './PhyTopology.css'
import Dragger from "antd/es/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
import ExcelJs from 'exceljs'
import {SUCCESS_CODE} from "@/constants";
import userUtils from "@/utils/userUtils.ts";
import {useNavigate} from "react-router-dom";
import {createCollector, createController, getActiveCollectorList} from "@/apis/request/test.ts";
import {createSignal} from "@/apis/request/board-signal/signal.ts";

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

const UploadConfig = ({
                          reloadData,
                      }: {
    reloadData: () => void
}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [preTestConfig, setPreTestConfig] = useState<any>({
        controllersConfig: [] as any,
        collectorsConfig: [] as any,
        signalsConfig: [] as any
    })
    const navigate = useNavigate()

    const itemsTitle = ['核心板卡描述', '采集板卡描述', '信号描述']
    const titles = [
        ['核心板卡代号', '核心板卡地址'],
        ['采集板卡代号', '采集板卡地址'],
        ['卡内序号', '采集板代号', '信号名', '单位', '信号类型', '备注']
    ]
    const titlesKey = [
        ['controllerName', 'controllerAddress'],
        ['collectorName', 'collectorAddress'],
        ['innerIndex', 'collectorName', 'signalName', 'signalUnit', 'signalType', 'remark']
    ]
    const sheetKey: ['controllersConfig', 'collectorsConfig', 'signalsConfig'] = ['controllersConfig', 'collectorsConfig', 'signalsConfig']


    function verifyWorkBook(wb: ExcelJs.Workbook) {
        // 工作簿前三个必须依次是核心板卡描述，采集板卡描述，采集板卡信号描述
        const wss = wb.worksheets
        const wsCount = wss.length
        const countOk = wsCount >= 3
        if (!countOk) return {
            msg: 'worksheet缺失',
            data: null
        }
        const nameOk = wss[0].name === '核心板卡描述' && wss[1].name === '采集板卡描述' && wss[2].name === '采集板卡信号描述'
        if (!nameOk) return {
            msg: 'worksheet名称校验未通过',
            data: null
        }
        // 校验title

        let titleOkObj = {
            wsName: '',
            ok: true
        }
        wb.eachSheet((ws, wsi) => {
            ws.getRow(1).eachCell((c, ci) => {
                if (titles[wsi - 1][ci - 1] !== c.value)
                    titleOkObj = {
                        wsName: ws.name,
                        ok: false
                    }
            })
        })
        if (!titleOkObj.ok) return {
            msg: `检测到${titleOkObj.wsName}中标题有误`,
            data: null
        }
        const data = {
            controllersConfig: [] as any,
            collectorsConfig: [] as any,
            signalsConfig: [] as any
        }
        wb.eachSheet((ws, wsi) => {
            data[sheetKey[wsi - 1]] = []
            ws.eachRow((r, ri) => {
                if (ri === 1) return
                const item = {} as any
                for (let i = 0; i < titlesKey[wsi - 1].length; i++) {
                    const key = titlesKey[wsi - 1][i]
                    item[key] = r.getCell(i + 1)?.value
                }
                data[sheetKey[wsi - 1]].push(item)
            })

        })
        setPreTestConfig(data)
        return {
            msg: '测试预配置文件合法',
            data
        }

    }

    async function handleDragger(info: any) {
        const {file} = info
        try {
            // 读取上传的excel文件
            const wb = new ExcelJs.Workbook()

            await wb.xlsx.load(file)
            const verifyObj = verifyWorkBook(wb)
            if (verifyObj.data === null) {
                return messageApi.error(verifyObj.msg);
            }
            setOpen(true)
        } catch (error) {
            messageApi.error('不合法的测试预配置文件');

        }

    }

    async function syncPreTestConfig() {
        return new Promise((resolve => {
            request({
                api: {
                    url: '/syncPreTestConfig',
                    method: Method.POST,
                    format: ContentType.JSON
                },
                params: preTestConfig,
            }).then((res: any) => {
                const {code} = res
                if (code === SUCCESS_CODE) {
                    setOpen(false)
                    reloadData()
                    messageApi.success('同步配置成功')
                } else {
                    throw new Error
                }
            }).catch(err => {
                console.log(err);
                setOpen(false)
                messageApi.success('同步配置失败')
            }).finally(() => {
                resolve(null)
            })
        }))
    }

    return <>
        {contextHolder}
        {userUtils.isRootUser() && <Dragger
          accept=".xlsx"
          maxCount={1}
          beforeUpload={() => false}
          onChange={handleDragger}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">请点击或拖拽到此区域上传板卡配置文件</p>
          <p className="ant-upload-hint">
            <Button style={{padding: 0}} type="link" onClick={async () => {
                try {
                    const response = await request({
                        api: {
                            url: '/downloadPreTestConfigFileTemp',
                            method: Method.GET,
                            responseType: ResponseType.ARRAY_BUFFER,
                            format: ContentType.FILE
                        }
                    })

                    // const response = await fetch('http://localhost:3000/api/downloadPreTestConfigFile')
                    // 将二进制ArrayBuffer转换成Blob
                    const blob = new Blob([response], {type: ContentType.FILE})

                    //  创建一个 <a> 元素，并设置其属性
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(blob);
                    downloadLink.download = '板卡配置模板文件.xlsx';

                    // 将 <a> 元素添加到 DOM，并模拟点击以触发下载
                    document.body.appendChild(downloadLink);
                    downloadLink.click();

                    // 下载完成后移除 <a> 元素
                    document.body.removeChild(downloadLink);

                } catch (error) {
                    console.error('下载文件时出错：', error);
                }
            }}>点击此链接</Button>下载板卡配置模板文件
          </p>
        </Dragger>}
        {!userUtils.isRootUser() && <Result
          style={{padding: 0, paddingTop: 10}}
          title="普通用户无法配置板卡"
          extra={
              <Button type="primary" key="console" onClick={() => {
                  navigate('/login')
              }}>
                  使用管理员账户登录
              </Button>
          }
        />}
        <Modal
            width={600}
            title="excel格式检查通过，是否立即同步测试预配置文件？"
            open={open}
            onOk={() => syncPreTestConfig()}
            onCancel={() => setOpen(false)}
            footer={
                [
                    <Popconfirm
                        title="高危操作"
                        description="立即同步将清除所有已创建的测试流程，以及下发的测试配置文件！！！"
                        onConfirm={() => syncPreTestConfig()}
                        onCancel={() => setOpen(false)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button danger>立即同步</Button>
                    </Popconfirm>,
                    <Button onClick={() => setOpen(false)}>取消</Button>
                ]
            }
        >
            <Tabs className="tm_tabs" defaultActiveKey="1" items={
                itemsTitle.map((item, index) => {
                    return ({
                        key: index + 1 + '',
                        label: item,
                        children: <List
                            style={{
                                height: 250,
                                overflowY: 'scroll'
                            }}
                            size="small"
                            header={<b>{
                                titles[index].map(i => <Tag>{i || 'NULL'}</Tag>)
                            }</b>}
                            bordered
                            dataSource={preTestConfig[sheetKey[index]]}
                            renderItem={(item) => <List.Item
                                style={{justifyContent: 'left'}}>{Object.values(item as string).map(i =>
                                <Tag>{i || 'NULL'}</Tag>)}</List.Item>}
                        />,
                    })
                })
            }/>
        </Modal>
    </>
}

