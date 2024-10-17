import {Button, Card, Descriptions, Input, message, Modal, Slider, Space, Typography, Upload, UploadProps} from "antd";
import React, {useEffect, useState} from "react";
import {IHistory} from "@/apis/standard/history.ts";
import {InboxOutlined} from "@ant-design/icons";
import {debounce, formatFileSize, formatTime} from "@/utils";
import {getExportFileWorker, getFileToHistoryWorker, getHistoryToData, getSearchHistoryWorker} from "@/worker/app.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

const {Title, Text} = Typography;


const OfflineDate = () => {
  const [history, setHistory] = useState<IHistory>()
  const [file, setFile] = useState<File>()
  const [name, setName] = useState<string>('')
  const [period, setPeriod] = useState<number[]>([0, 0])
  const debounceSetPeriod = debounce((value) => {
    setPeriod(value as number[])
  })

  useEffect(() => {
    console.log(window.location.toString());
    const url = new URL(window.location.toString());
    const targetFile = url.searchParams.get("fileAdd");
    if (targetFile && targetFile !== "") {
      fetch(targetFile)
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            // 将JSON数据转换为Blob对象
            const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
            // 创建一个File对象
            const file = new File([blob], 'filename.json', {type: 'application/json'});
            manageTargetFile(file)
          } else {
            console.error('Failed to fetch the file:', res.status);
          }
        })
        .catch((error) => {
          console.error('Error fetching the file:', error);
        });
    }
  }, []);

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

  const manageTargetFile = (file: File) => {
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
  }

  // 导出附件一 格式的文件
  const exportForMatFile = () => {
    const worker = getHistoryToData()
    worker.onmessage = (e) => {
      const file = e.data
      const a = document.createElement('a')
      a.href = URL.createObjectURL(file)
      a.download = file.name
      a.click()
    }
    worker.postMessage(history)
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
      (!file || !history) && <Upload.Dragger
        name='file'
        multiple={false}
        customRequest={(options) => {
          const file = options.file as File
          manageTargetFile(file)
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
      (file && history) && <>
        <FileInfo file={file}/>
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
          <ShowHistoryDataParsing history={history}/>
          <Button onClick={() => exportForMatFile()}> 导出格式化文件 </Button>
          <DetailSearch history={history}/>
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


const ShowHistoryDataParsing = ({history}: { history: IHistory }) => {
  const [open, setOpen] = useState(false)

  return <>
    <Button onClick={() => {
      setOpen(true)
    }}>
      展示历史数据分析
    </Button>
    <Modal open={open}
           onCancel={() => {
             setOpen(false)
           }}
           onOk={() => {
             setOpen(false)
           }}
           width={"80%"}
    >
      {
        open && history.dataParseResult!.map((item, index) => {
          // 计算最大值、最小值和平均值
          const max = item.dataArr[0];
          const min = item.dataArr[1];
          const avg = item.dataArr[2]

          return (
            <Descriptions title={item.name} key={index}
                          style={{marginTop: '20px'}}>
              <Descriptions.Item label="最大值">{max}</Descriptions.Item>
              <Descriptions.Item label="最小值">{min}</Descriptions.Item>
              <Descriptions.Item label="平均值">{avg}</Descriptions.Item>
            </Descriptions>
          );
        })
      }
    </Modal>
  </>
}

const DetailSearch = ({history}: { history: IHistory }) => {
  const itemHeight = 30
  const containerHigh = 500
  const [scrollTop, setScrollTop] = useState(0)

  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<IProtocolSignal[]>([])

  const [targetName, setTargetName] = useState("")
  const [targetPeriod, setTargetPeriod] = useState<number[]>([history.startTime, history.endTime])

  const [targetSignal, setTargetSignal] = useState<IProtocolSignal>(undefined)

  const debounceSetPeriod = debounce((value) => {
    setTargetPeriod(value as number[])
  })

  const startSearch = () => {
    message.loading("正在检索数据")
    const worker = getSearchHistoryWorker()
    worker.onmessage = (e) => {
      const result = e.data as IProtocolSignal[]
      setResult(result)
      console.log(result)
      message.destroy()
    }
    worker.postMessage({
      history: history,
      searchName: targetName,
      startTime: targetPeriod[0],
      endTime: targetPeriod[1]
    })
  }

  // 获取虚拟列表
  const getVirtualList = (scrollTop: number) => {
    if (targetSignal === undefined) {
      return []
    }

    const virtualList = []

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5)
    const endIndex = Math.min(targetSignal.totalDataArr.length - 1, startIndex + Math.floor(containerHigh / itemHeight) + 5)
    for (let i = startIndex; i < endIndex; i++) {
      const data = targetSignal.totalDataArr[i]
      data && virtualList.push(
        <div
          key={i + startIndex}
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            height: itemHeight,
          }}>
          <p style={{display: "inline", marginRight: 30}}>{`${(new Date(data.time)).toLocaleString()}`}</p>
          <p style={{display: "inline"}}>{`${data.value}`}</p>
        </div>
      )
    }

    return virtualList
  }

  return <>
    <Button onClick={() => {
      setOpen(true)
    }}>
      查询历史数据
    </Button>
    <Modal open={open}
           onCancel={() => {
             setOpen(false)
           }}
           onOk={() => {
             if (!targetName) {
               message.error("请输入信号名称")
               return;
             }
             startSearch()
           }}
           okText={"开始搜索"}
           cancelText={"取消"}
    >
      <Space>
        输入搜索名称:<Input onChange={(e) => {
        setTargetName(e.target.value)
      }}/>
      </Space>
      <div style={{
        marginTop: 20
      }}>
        拖动选择搜索时间:
        <Slider range
                defaultValue={[history.startTime, history.endTime]}
                min={history.startTime}
                max={history.endTime}
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
                }}/>
      </div>
      <div>
        <p style={{}}>
          搜索到的结果：
        </p>
        <p style={{fontSize: 10, marginBottom: 20, color: "grey"}}>
          (点击对应信号查看结果)
        </p>
        {
          result.map((signal, index) => {
            return <div style={{display: "flex", justifyItems: "center",}}>
              <p style={{display: "inline"}} onClick={() => {
                setTargetSignal(signal)
              }}>{`${index + 1}: ${signal.name}`}</p>
            </div>
          })
        }
      </div>
      <Modal
        open={targetSignal !== undefined}
        onCancel={() => {
          setTargetSignal(undefined)
        }}
        onOk={() => {
          setTargetSignal(undefined)
        }}
        title={`${targetSignal?.name ?? ""}(${targetSignal?.dimension ?? ""})`}
        height={containerHigh}
        styles={{body: {maxHeight: containerHigh}}}
        style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

        <div style={{overflowY: "scroll", padding: 20, border: "1px solid #f0f0f0", height: containerHigh}}
             onScroll={(e) => {
               const currentScrollTop = e.currentTarget.scrollTop
               setScrollTop(currentScrollTop)
             }}>
          <div style={{height: itemHeight * targetSignal?.totalDataArr.length}}>
            <div style={{transform: `translateY(${Math.floor(scrollTop / itemHeight) * itemHeight}px)`,}}>
              {getVirtualList(scrollTop)}
            </div>
          </div>
        </div>
      </Modal>
    </Modal>
  </>
}

export default OfflineDate
