import React, {useEffect, useState} from "react";
import {getTestsHistoryById} from "@/apis/request/testhistory.ts";
import {SUCCESS_CODE} from "@/constants";
import {Button, Card, Descriptions, Input, message, Modal, Slider, Space} from "antd";
import {getDataMaxMinMiddle, searchForTargetData} from "@/apis/request/data.ts";
import {debounce, formatTime} from "@/utils";
import {IHistoryList} from "@/views/demo/History/history.tsx";

const DataAnalysis = ({belongid}) => {
  const [history, setHistory] = useState(undefined);

  const [openDataParsing, setOpenDataParsing] = useState(false);
  const [dataParsing, setDataParsing] = useState<{
    name: string,
    max: number,
    min: number,
    middle: number
  }[]>([]);
  const [openDetailSearch, setOpenDetailSearch] = useState(false)

  const handleCloseParsing=()=>{
    setOpenDataParsing(false)
  }
  const handleCloseDetailSearch=()=>{
    setOpenDetailSearch(true)
  }

  useEffect(() => {
    // const url = new URL(window.location.href)
    // const belongId = url.searchParams.get('belongId')
    const belongId=belongid
    getTestsHistoryById(Number(belongId)).then(res => {
      if (res.code === SUCCESS_CODE) {
        setHistory(res.data)
      } else {
        setHistory(null)
      }
    })

    getDataMaxMinMiddle(Number(belongId)).then(res => {
      if (res.code === SUCCESS_CODE) {
        setDataParsing(res.data)
      } else {
        setDataParsing(null)
      }
    })
  }, [belongid])

  if (!history) {
    return (
      <div
        style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
        <h1>请在数据管理与维护界面选择数据</h1>
      </div>
    )
  }

  return (
    <Card
      title={"数据分析"}
      style={{width: "100%", height: "100%"}}>
      <Descriptions title={"基本信息"} bordered column={1}
                    labelStyle={{fontWeight: "bold", width: 200}}>
        <Descriptions.Item label={"所属配置名称"}>
          {history?.fatherConfigName}
        </Descriptions.Item>
        <Descriptions.Item label={"测试车辆"}>
          {history?.vehicleName}
        </Descriptions.Item>
        <Descriptions.Item label={"开始时间"}>
          {new Date(history?.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={"结束时间"}>
          {new Date(history?.updatedAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      <h1>操作</h1>
      <Button type={"primary"} onClick={() => {
        setOpenDataParsing(true)
      }}>
        查看数据分析
        <DataParsingModal source={dataParsing} open={openDataParsing} onFinished={()=>{handleCloseParsing()}}/>
      </Button>
      <Button type={"primary"} onClick={handleCloseDetailSearch}>
        查询数据
        <DetailSearchModal history={history} open={openDetailSearch} onFinished={() => {
          setOpenDetailSearch(false)
        }}/>
      </Button>
      <Button type={"primary"} onClick={() => {
         window.open(`/test-template-for-config?historyId=${history.id}`);
      }}>
       查看数据回放
      </Button>
    </Card>
  )
}

const DataParsingModal = ({source, open, onFinished}: {
  source: {
    name: string,
    max: number,
    min: number,
    middle: number
  }[],
  open: boolean,
  onFinished: () => void
}) => {
  return (
    <Modal
      open={open}
      onCancel={() => {
        onFinished()
      }}
      onOk={() => {
        onFinished()
      }}
    >
      {source.map((item) => {
        return (
          <div style={{marginBottom: 20}}>
            <p style={{fontWeight: 'bold', fontSize: 16}}>{item.name}</p>
            <p style={{fontSize: 14}}>
              <span style={{marginRight: 30}}>最大值: {item.max}</span>
              <span style={{marginRight: 30}}>最小值: {item.min}</span>
              <span>均值: {item.middle}</span>
            </p>
          </div>
        );
      })}
    </Modal>
  )
}

const DetailSearchModal = ({history, open, onFinished}: {
  history: IHistoryList,
  open: boolean,
  onFinished: () => void
}) => {

  const itemHeight = 30
  const containerHigh = 500
  const [scrollTop, setScrollTop] = useState(0)

  const [suitableName, setSuitableName] = useState<string[]>([])

  // 查询条件
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    startTime: new Date(history.createdAt).getTime(),
    endTime: new Date(history.updatedAt).getTime(),
    minValue: -1000,
    maxValue: 1000
  })

  const [searchResultArr, setSearchResultArr] = useState<{
    time: number,
    value: number
  }[]>(undefined)

  const debounceSetPeriod = debounce((value) => {
    setSearchCriteria({...searchCriteria, startTime: value[0], endTime: value[1]})
  })

  const searchForSuitAbleName = (name) => {
    const result = []
    history.testConfig.configs[0].projects.forEach(project => {
      project.indicators.forEach(indicator => {
        if (indicator.name.includes(name) || indicator.signal.name.includes(name))
          result.push(`${indicator.name}(${indicator.signal.name})`)
      })
    })
    setSuitableName(result)
  }

  const startSearch = (name) => {
    message.loading("正在检索数据")
    searchForTargetData(history.id,
      name,
      searchCriteria.startTime,
      searchCriteria.endTime,
      searchCriteria.minValue,
      searchCriteria.maxValue).then(res => {
      if (res.code === SUCCESS_CODE) {
        setSearchResultArr(res.data)
      }
      message.destroy()
    })
  }

  // 获取虚拟列表
  const getVirtualList = (scrollTop: number) => {
    if (searchResultArr === undefined) {
      return []
    }

    const virtualList = []

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5)
    const endIndex = Math.min(searchResultArr.length - 1, startIndex + Math.floor(containerHigh / itemHeight) + 5)
    for (let i = startIndex; i < endIndex; i++) {
      const data = searchResultArr[i]
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
    <Modal open={open}
           onCancel={() => {
             onFinished()
           }}
           onOk={() => {
             if (!searchCriteria.name) {
               message.error("请输入信号名称")
               return;
             }
             searchForSuitAbleName(searchCriteria.name)
           }}
           okText={"开始搜索"}
           cancelText={"取消"}
    >
      <Space>
        输入搜索名称:<Input onChange={(e) => {
        setSearchCriteria({...searchCriteria, name: e.target.value})
      }}/>
      </Space>
      <div style={{marginTop: 20}}>
        拖动选择搜索时间:
        <Slider range
                defaultValue={[(new Date(history.createdAt)).getTime(), (new Date(history.updatedAt)).getTime()]}
                min={(new Date(history.createdAt)).getTime()}
                max={(new Date(history.updatedAt)).getTime()}
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
      <div style={{marginTop: 20}}>
        <Space>
          <Input placeholder={"最小值"}
                 defaultValue={searchCriteria.minValue}
                 onChange={(e) => {
                   setSearchCriteria({...searchCriteria, minValue: Number(e.target.value)})
                 }}/>
          <Input placeholder={"最大值"}
                 defaultValue={searchCriteria.maxValue}
                 onChange={(e) => {
                   setSearchCriteria({...searchCriteria, maxValue: Number(e.target.value)})
                 }}/>
        </Space>
      </div>
      <div>
        <p style={{}}>
          搜索到的结果：
        </p>
        <p style={{fontSize: 10, marginBottom: 20, color: "grey"}}>
          (点击对应信号查看结果)
        </p>
        {
          suitableName.map((signalName, index) => {
            return <div style={{display: "flex", justifyItems: "center",}}>
              <p style={{display: "inline"}} onClick={() => {
                startSearch(signalName)
              }}>{`${index + 1}: ${signalName}`}</p>
            </div>
          })
        }
      </div>
      <Modal
        open={searchResultArr !== undefined}
        onCancel={() => {
          setSearchResultArr(undefined)
        }}
        onOk={() => {
          setSearchResultArr(undefined)
        }}
        title={"搜索结果"}
        height={containerHigh}
        styles={{body: {maxHeight: containerHigh}}}
        style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

        <div style={{overflowY: "scroll", padding: 20, border: "1px solid #f0f0f0", height: containerHigh}}
             onScroll={(e) => {
               const currentScrollTop = e.currentTarget.scrollTop
               setScrollTop(currentScrollTop)
             }}>
          <div style={{height: (searchResultArr?.length ?? 0) * itemHeight}}>
            <div style={{transform: `translateY(${Math.floor(scrollTop / itemHeight) * itemHeight}px)`,}}>
              {getVirtualList(scrollTop)}
            </div>
          </div>
        </div>
      </Modal>
    </Modal>
  </>
}


export default DataAnalysis;
