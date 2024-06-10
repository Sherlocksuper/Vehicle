import {Button, Card, Input, message, Modal, Row, Slider, Typography, Upload, UploadProps} from "antd";
import React, {useRef, useState} from "react";
import {IHistory} from "@/apis/standard/history.ts";
import {InboxOutlined} from "@ant-design/icons";
import {debounce, formatFileSize, formatTime} from "@/utils";
import {getExportFileWorker, getFileToHistoryWorker} from "@/worker/app.ts";

const {Title, Text} = Typography;


const OfflineDate = () => {
    const [history, setHistory] = useState<IHistory>()
    const [file, setFile] = useState<File>()
    const [name, setName] = useState<string>('')
    const [period, setPeriod] = useState<number[]>([0, 0])
    const debounceSetPeriod = debounce((value) => {
        console.log(value)
        setPeriod(value as number[])
    })


    const exportFile = () => {
        const worker = getExportFileWorker()
        worker.postMessage({
            startTime: period[0],
            endTime: period[1],
            fileName: name,
            file: file
        })
        worker.onmessage = (e) => {
            const file = e.data
            const a = document.createElement('a')
            a.href = URL.createObjectURL(file)
            a.download = file.name
            a.click()
        }
    }

    const showData = () => {
        const win = window.open('/offline-show')

        setTimeout(() => {
            win!.postMessage(file, '*')
        }, 1000)
    }

    const buttonFunction = (type: 'EXPORT' | 'SHOW') => {
        if (type === 'EXPORT') {
            exportFile()
            return
        }
        showData()
    }

    return <div style={{
        width: '80%',
        margin: 'auto',
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    }}>
        <Upload.Dragger
            name={'file'}
            multiple={false}
            showUploadList={false}
            accept={'application/json'}
            action={(file) => {
                message.loading('文件上传中', 0)
                setFile(file)
                const worker = getFileToHistoryWorker()

                worker.postMessage(file)
                worker.onmessage = (e) => {
                    const data = e.data
                    setHistory(data)
                    message.destroy()
                }

                return Promise.resolve('File processed')
            }}
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">点击或者拖拽以输入或替换文件</p>
        </Upload.Dragger>
        {
            (file && history) && <>
            <FileInfo file={file}/>
            总时长:{formatTime(history.endTime - history.startTime)}
            操作时间段：
            <Slider range
                    defaultValue={[history.startTime, history.endTime]}
                    min={history.startTime}
                    max={history.endTime}
                    marks={{
                        [history.startTime]: formatTime(history.startTime),
                        [history.endTime]: formatTime(history.endTime)
                    }}
                    tooltip={{
                        formatter: (value: number | number[] | undefined) => {
                            if (typeof value === 'number') {
                                return <div>{formatTime(value)}</div>;
                            } else if (Array.isArray(value)) {
                                return <div>{formatTime(value[0])} - {formatTime(value[1])}</div>
                            }
                            return null;
                        }
                    }}
                    onChange={(value) => {
                        debounceSetPeriod(value)
                    }}
            />
            <br/>
            导出文件名： <Input placeholder={'请输入导出文件名'} onChange={(e) => {
                setName(e.target.value)
            }}/>
            <br/>
            <Row>
              <FunctionButton type={'EXPORT'} selectTime={period} buttonFunction={buttonFunction}
                              fileName={name}/>
              <FunctionButton type={'SHOW'} selectTime={period} buttonFunction={buttonFunction} fileName={name}/>
            </Row>
          </>
        }
    </div>

}

const FileInfo = (props: { file: File }) => {
    return (
        <Card title="文件信息" style={{width: 300, margin: 20}}>
            <Title level={5}>文件名：</Title>
            <Text>{props.file.name}</Text>
            <Title level={5} style={{marginTop: '20px'}}>数据信息：</Title>
            <Text>最近更改时间：{formatTime(props.file.lastModified)}</Text>
            <br/>
            <Text style={{marginTop: '10px'}}>数据量：{formatFileSize(props.file.size)}</Text>
        </Card>
    );
}

const FunctionButton = (props: {
    type: 'EXPORT' | 'SHOW',
    selectTime: number[],
    buttonFunction: (type: 'EXPORT' | 'SHOW') => void,
    fileName: string
}) => {

    const [open, setOpen] = useState(false)

    return <>
        <Button onClick={() => {
            setOpen(true)
        }}>{props.type === 'EXPORT' ? '导出文件' : '展示离线数据'}</Button>

        <Modal title={props.type === 'EXPORT' ? '导出文件' : '展示离线数据'} open={open} onOk={() => {
            props.buttonFunction(props.type)
            setOpen(false)
        }} onCancel={() => {
            setOpen(false)
        }}>
            <Title level={5}>操作时间段：</Title>
            <Text>{formatTime(props.selectTime[0])} - {formatTime(props.selectTime[1])}</Text>
            <br/>
            <Title level={5}>文件名：</Title>
            <Text>{props.fileName}</Text>
        </Modal>
    </>
}

export default OfflineDate