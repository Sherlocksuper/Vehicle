import {IHistory} from "@/apis/standard/history.ts";
import React, {useState} from "react";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";
import {debounce} from "@/utils";
import {message, Modal} from "antd";
import {getSearchHistoryWorker} from "@/worker/app.ts";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <Modal open={open}
           onCancel={() => {}}
           onOk={() => {
             startSearch()
           }}
           okText={"开始搜索"}
           cancelText={"取消"}
    >
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
