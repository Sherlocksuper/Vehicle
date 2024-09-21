import {Button, Card, Input, message, Modal, Row, Slider, Space, Typography, Upload, UploadProps} from "antd";
import React, {useState} from "react";
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
    setPeriod(value as number[])
  })

  const exportFile = () => {
    const worker = getExportFileWorker()
    worker.onmessage = (e) => {
      const file = e.data
      const a = document.createElement('a')
      a.href = URL.createObjectURL(file)
      a.download = file.name
      a.click()
    }
    worker.postMessage({
      startTime: period[0],
      endTime: period[1],
      fileName: name,
      file: file
    })
  }

  const showData = () => {
    const worker = getExportFileWorker()
    worker.onmessage = (e) => {
      const file = e.data
      const win = window.open('/offline-show')
      setTimeout(() => {
        win!.postMessage(file, '*')
      }, 1000)
    }
    worker.postMessage({
      startTime: period[0],
      endTime: period[1],
      fileName: name,
      file: file
    })
  }

  const buttonFunction = (type: 'EXPORT' | 'SHOW') => {
    if (type === 'EXPORT') {
      exportFile()
    } else {
      showData()
    }
  }

  return <Card style={{
    margin: 'auto',
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'scroll'
  }}>
    {
      !file && <Upload.Dragger
        name='file'
        multiple={false}
        customRequest={(options) => {
          const file = options.file as File
          if (file.size > 1024 * 1024 * 100) {
            message.error('文件大小不能超过100M')
            return
          }
          // 加载
          message.loading('文件加载中', 0)
          const worker = getFileToHistoryWorker()
          worker.onmessage = (e) => {
            const history = e.data as IHistory
            setHistory(history)
            setFile(file)
            setPeriod([history.startTime, history.endTime])
            message.destroy()
          }
          worker.postMessage(file)
        }}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined/>
        </p>
        <p className="ant-upload-text">点击或者拖拽文件到这里</p>
        <p className="ant-upload-hint">支持单个文件上传</p>
      </Upload.Dragger>
    }
    {
      (file) && <>
        <FileInfo file={file}/>
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
        <Space style={{marginTop: '20px'}}>
          <ExportButton selectTime={period} buttonFunction={() => {
            buttonFunction('EXPORT')
          }} fileName={name}/>
          <ShowButton selectTime={period} buttonFunction={() => {
            buttonFunction('SHOW')
          }}/>
        </Space>
      </>
    }
  </Card>

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

const ExportButton = (props: {
  selectTime: number[],
  buttonFunction: () => void,
  fileName: string
}) => {
  const [open, setOpen] = useState(false)

  return <>
    <Button onClick={() => {
      if (props.fileName === '') {
        message.error('文件名不能为空')
        return
      }
      setOpen(true)
    }}>导出文件</Button>

    <Modal title='导出文件' open={open} onOk={() => {
      props.buttonFunction()
      setOpen(false)
    }} onCancel={() => {
      setOpen(false)
    }}>
      <Title level={5}>操作时间段：</Title>
      <Text>{formatTime(props.selectTime[0])} - {formatTime(props.selectTime[1])}</Text>
      <br/>
      <Title level={5}>文件名：</Title>
      <Text>{props.fileName || 'default'}</Text>
    </Modal>
  </>
}

const ShowButton = (props: {
  selectTime: number[],
  buttonFunction: () => void,
}) => {
  const [open, setOpen] = useState(false)

  return <>
    <Button onClick={() => {
      setOpen(true)
    }}>开始展示</Button>

    <Modal title='开始展示' open={open} onOk={() => {
      props.buttonFunction()
      setOpen(false)
    }} onCancel={() => {
      setOpen(false)
    }}>
      <Title level={5}>操作时间段：</Title>
      <Text>{formatTime(props.selectTime[0])} - {formatTime(props.selectTime[1])}</Text>
    </Modal>
  </>
}

export default OfflineDate
