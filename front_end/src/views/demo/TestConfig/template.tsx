import React, {useEffect, useRef, useState} from 'react';
import {useDrop} from 'react-dnd';
import DraggableComponent, {
  IBooleanChartExtra,
  IDraggleComponent,
  INumberChartExtra
} from "@/views/demo/DataDisplay/DraggableComponent";
import {Button, message, Space} from "antd";
import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import GridLayout from "react-grid-layout";
import {DEFAULT_TITLE, SUCCESS_CODE} from "@/constants";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";
import {downHistoryDataAsJson, getTestConfigById, updateTestConfigById} from "@/apis/request/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";
import ConfigDropContainer from "@/views/demo/TestConfig/configDropContainer.tsx";
import {ITemplate, ITemplateItem} from "@/apis/standard/template.ts";
import {getFileToHistoryWorker, getHistoryToFileWorker} from "@/worker/app.ts";
import {IHistory} from "@/apis/standard/history.ts";
import {addTestsHistory} from "@/apis/request/testhistory.ts";

export interface IDragItem {
  id: string
  type: DragItemType,
  itemConfig: {
    requestSignalId: number | null
    requestSignals: IProtocolSignal[]
    x: number,
    y: number,
    width: number
    height: number
    title: string
    interval: number
    trueLabel?: string
    falseLabel?: string
    unit?: string
    during?: number
    min?: number
    max?: number
    label?: string
  }
}

// dataMode 不用放到useEffect，因为它不会变
const TestTemplateForConfig: React.FC<{ dataMode: 'OFFLINE' | 'ONLINE' }> = ({
                                                                               dataMode
                                                                             }) => {
  const [testConfig, setTestConfig] = useState<ITestConfig | null>(null)
  const [mode, setMode] = useState<'CHANGING' | 'COLLECTING'>('CHANGING')

  const ref = useRef<HTMLDivElement>(null)
  const [dragItems, setDragItems] = useState<IDragItem[]>([])
  const socketRef = useRef<WebSocket>(null)
  const history = useRef<IHistory>({
    historyName: "默认名称",
    configName: '默认配置',
    startTime: Date.now(),
    endTime: Date.now(),
    template: null,
    historyData: []
  })
  const [netDataRecorder, setNetDataRecorder] = useState<Map<string, number[]>>(new Map())
  const historyManagers = useRef(undefined)
  const downFileIndex = useRef(0)

  const updateDataRecorder = (data, time = undefined) => {
    const currentData = {
      time: time ?? new Date().getTime(),
      data: JSON.parse(data)
    }

    history.current.historyData.push(currentData)

    const keys = Object.keys(JSON.parse(data))
    keys.forEach((key) => {

      if (netDataRecorder.has(key)) {
        netDataRecorder.set(key, [...netDataRecorder.get(key), JSON.parse(data)[key]])
      } else {
        netDataRecorder.set(key, [JSON.parse(data)[key]])
      }

    })
    // 更新触发状态更新
    setNetDataRecorder(new Map(netDataRecorder))
  }
  const startOfflineData = (dataToShow: { time: number, data: { [key: string]: number } }[]) => {
    let index = 0;
    let isPaused = true;  // 控制是否暂停
    const scheduleNext = () => {
      if (isPaused || index >= dataToShow.length - 1) return;
      const currentTime = dataToShow[index].time;
      const nextTime = dataToShow[index + 1]?.time;

      if (nextTime === undefined) return;

      setTimeout(() => {
        if (!isPaused) {
          updateDataRecorder(JSON.stringify(dataToShow[index].data), currentTime);
          index++;
          scheduleNext();  // 递归调用，继续调度下一个
        }
      }, nextTime - currentTime);
    };

    // 暴露的控制接口
    return {
      start: () => {
        if (isPaused) {
          isPaused = false;
          scheduleNext();  // 继续执行
        }
      },
      pause: () => {
        isPaused = true;  // 暂停执行
      },
    };
  };

  const downFile = (file, configName, mode: 'ACTIVE' | 'SCHEDULED', index = 0) => {
    // TODO 是否要从浏览器下载一份
    // const a = document.createElement('a')
    // a.href = URL.createObjectURL(file)
    // const mod = mode === 'ACTIVE' ? '主动下载' : '定时下载'
    // a.download = configName + '-' + index + '-' + mod + '.json'
    // downFileIndex.current++
    // a.click()

    addTestsHistory({
      fatherConfigName: configName,
      file: file
    }).then((res) => {
      if (res.code === SUCCESS_CODE) {
        message.success('上传成功')
      } else {
        message.error('上传失败')
      }
    })
  }

  // TODO 清除之前记录的逻辑和定时下载的逻辑
  //
  // const clearFileData = () => {
  //   history.current.startTime = Date.now()
  //   history.current.historyData = []
  //   setNetDataRecorder(new Map())
  // }
  //
  // const downFileIndex = useRef(0)
  // const downFileInterval = useRef<any>(0)
  //
  // // 设置一个internal，ONLINE模式下每半个小时自动下载当前文件
  // useEffect(() => {
  //   if (!testConfig) {
  //     return
  //   }
  //   if (dataMode !== "ONLINE") {
  //     return;
  //   }
  //   console.log("开始定时下载")
  //   downFileInterval.current = setInterval(() => {
  //     const worker = getHistoryToFileWorker()
  //     worker.onmessage = (event) => {
  //       const file = event.data
  //       downFile(file, testConfig.name, 'SCHEDULED', downFileIndex.current)
  //     }
  //
  //     history.current.endTime = Date.now()
  //     worker.postMessage(history.current)
  //     clearFileData()
  //   }, 3000)
  //   return () => {
  //     clearInterval(downFileInterval.current)
  //   }
  // }, [dataMode, testConfig?.name])

  // 在线数据的时候获取testConfig
  useEffect(() => {
    if (dataMode === "OFFLINE") {
      return () => {
      }
    }

    const search = window.location.search
    const params = new URLSearchParams(search)
    const testConfigId = params.get('testConfigId')

    if (testConfigId) {
      let testConfig: ITestConfig = undefined
      getTestConfigById(Number(testConfigId)).then((res) => {
        if (res.code === SUCCESS_CODE) {
          testConfig = res.data as ITestConfig
          console.log(testConfigId)
          history.current.template = testConfig.template

          setTestConfig(testConfig)
          setDragItems(transferITemplateToDragItems(testConfig.template))
        }
      })
    }
  }, [])

  // 处理在线数据源头
  useEffect(() => {
    if (dataMode === "OFFLINE") {
      return () => {
      }
    }
    window.onbeforeunload = function() {
      return "你确定要离开吗？";
    }

    const socket = new WebSocket('http://localhost:8080/ws');
    socket.onopen = () => {
      socketRef.current = socket
    }
    socket.onclose = () => {
      socketRef.current = null
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === "DATA") {
        updateDataRecorder(message.message)
      } else if (message.type === "NOTIFICATION") {
        message.info(message.message)
      }
    };

    // 清理 WebSocket 连接
    return () => {
      socket.close();
    };
  }, []);

  // 处理离线数据源头
  useEffect(() => {
    if (dataMode === "ONLINE") {
      return;
    }

    // 收到一个文件
    window.onmessage = (event) => {
      if (history.current.historyData.length !== 0) {
        return
      }
      if (!(event.data instanceof File)) {
        return
      }
      // 把文件放给worker处理
      const worker = getFileToHistoryWorker()
      worker.onmessage = (event) => {
        const historyData = event.data as IHistory
        setDragItems(transferITemplateToDragItems(historyData.template))
        history.current.historyData = historyData.historyData
        historyManagers.current = startOfflineData(historyData.historyData)
      }
      worker.postMessage(event.data)
    }

  }, [])

  const [, drop] = useDrop<{ id: string } & IDraggleComponent>({
    accept: 'box',
    drop({
           id,
           type,
           draggleConfig: {defaultX, defaultY, defaultHeight, defaultWidth, defaultTitle, defaultInterval, extra}
         }) {
      const itemConfig: IDragItem['itemConfig'] = {
        requestSignalId: null,
        requestSignals: [],
        x: defaultX,
        y: defaultY,
        width: defaultWidth,
        height: defaultHeight,
        title: defaultTitle,
        interval: defaultInterval,
      }
      switch (type) {
        case DragItemType.BOOLEAN:
          itemConfig['trueLabel'] = (extra as IBooleanChartExtra).defaultTrueLabel
          itemConfig['falseLabel'] = (extra as IBooleanChartExtra).defaultFalseLabel
          break
        case DragItemType.NUMBER:
          itemConfig['unit'] = (extra as INumberChartExtra).defaultUnit
          itemConfig['min'] = (extra as INumberChartExtra).defaultMin
          itemConfig['max'] = (extra as INumberChartExtra).defaultMax
          break
      }
      setDragItems([...dragItems, {
        id,
        type,
        itemConfig: {...itemConfig}
      }])
    }
  })
  drop(ref)

  const renderADDModeInfo = () => {
    return <>
      <DraggableComponent type={DragItemType.BOOLEAN} draggleConfig={{
        defaultTitle: DEFAULT_TITLE,
        defaultX: 0,
        defaultY: 0,
        defaultWidth: 100,
        defaultHeight: 100,
        defaultInterval: 1000,
        extra: {
          defaultTrueLabel: '是',
          defaultFalseLabel: '否',
        }
      }}/>
      <DraggableComponent type={DragItemType.NUMBER} draggleConfig={{
        defaultTitle: DEFAULT_TITLE,
        defaultX: 0,
        defaultY: 0,
        defaultWidth: 300,
        defaultHeight: 300,
        defaultInterval: 1000,
        extra: {
          defaultUnit: '单位',
          defaultMin: 0,
          defaultMax: 100,
        }
      }}/>
      <DraggableComponent type={DragItemType.LINES} draggleConfig={{
        defaultTitle: DEFAULT_TITLE,
        defaultX: 0,
        defaultY: 0,
        defaultWidth: 400,
        defaultHeight: 400,
        defaultInterval: 1000,
        extra: {
          defaultDuring: 10,  // 10s
          defaultLabel: '数值'
        }
      }}/>
      <DraggableComponent type={DragItemType.PURENUMBER} draggleConfig={{
        defaultTitle: DEFAULT_TITLE,
        defaultX: 0,
        defaultY: 0,
        defaultWidth: 100,
        defaultHeight: 100,
        defaultInterval: 1000,
        extra: {
          defaultDuring: 10,  // 10s
          defaultLabel: '数值'
        }
      }}/>
    </>
  }

  const updateDragItem = (id: string, itemConfig: IDragItem['itemConfig']) => {
    const result = dragItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          itemConfig: {
            ...item.itemConfig,
            ...itemConfig
          }
        }
      }
      return item
    })
    setDragItems(result)
    history.current.template = transferDragItemsToITemplate(result)
  }

  const updateAllByLayout = (layout: GridLayout.Layout[]) => {
    const result = dragItems.map((item) => {
      const newItem = layout.find((newItem) => newItem.i === item.id)
      if (newItem) {
        return {
          ...item,
          itemConfig: {
            ...item.itemConfig,
            width: newItem.w * 30,
            height: newItem.h * 30,
            x: newItem.x,
            y: newItem.y
          }
        }
      }
      return item
    })
    setDragItems(result)
    history.current.template = transferDragItemsToITemplate(result)
  }

  const renderManageButton = () => {
    if (dataMode === "OFFLINE") {
      return <Space>
        <Button onClick={() => {
          if (dragItems.length === 0) {
            message.error('请等待数据加载完成,或重新载入数据')
            return
          }
          if (historyManagers.current) {
            console.log(historyManagers.current)
            historyManagers.current.start()
          }
        }}>开始离线数据</Button>
        <Button onClick={() => {
          if (historyManagers.current) {
            historyManagers.current.pause()
          }
        }}>暂停</Button>
        <Button onClick={() => {
          if (historyManagers.current) {
            historyManagers.current.reset()
          }
        }}>重置</Button>
      </Space>
    }

    const confirmChangeConfig = () => {
      const config = Object.assign({}, testConfig)
      config.template = transferDragItemsToITemplate(dragItems)
      updateTestConfigById(config.id, config).then((res) => {
        if (res.code === SUCCESS_CODE) {
          message.success('更新成功')
        }
      })
    }

    if (mode === "COLLECTING") {
      return <Space
        direction="vertical"
        size="middle"
      >
        <Button onClick={() => {
          confirmChangeConfig()
        }}>确定更改配置</Button>

        <Button
          onClick={() => {
            setMode('CHANGING')
          }}>切换到配置模式</Button>

        <Button onClick={() => {
          // const worker = getHistoryToFileWorker()
          // worker.onmessage = (event) => {
          //   const file = event.data
          //   downFile(file, testConfig.name, 'ACTIVE')
          // }

          downHistoryDataAsJson().then((res) => {
            if (res.code === SUCCESS_CODE) {
              // downFile(res.data, testConfig.name, 'ACTIVE')
              message.success('下载成功')
            } else {
              message.error('下载失败,请重试')
            }
          })

          // TODO 是否保留以前的数据
          // history.current.endTime = Date.now()
          // worker.postMessage(history.current)
          // history.current.startTime = Date.now()
          // history.current.historyData = []
        }}>下载收集数据</Button>
      </Space>
    }

    return <div style={{
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 10,
      position: "absolute",
      top: 0,
      right: 0,
    }}>
      <Button onClick={() => {
        confirmChangeConfig()
      }}>确定更改配置</Button>
      <Button onClick={() => {
        confirmChangeConfig()
        setMode('COLLECTING')
      }}>查看收集数据</Button>
      <div className="dd_info">
        {renderADDModeInfo()}
      </div>
    </div>
  }

  const transferDragItemsToITemplate = (dragItems: IDragItem[]): ITemplate => {
    return {
      name: '默认模板',
      description: '默认描述',
      itemsConfig: dragItems.map((item) => {
        return {
          type: item.type,
          requestSignalId: item.itemConfig.requestSignalId,
          requestSignals: item.itemConfig.requestSignals,
          x: item.itemConfig.x,
          y: item.itemConfig.y,
          width: item.itemConfig.width,
          height: item.itemConfig.height,
          title: item.itemConfig.title,
          interval: item.itemConfig.interval,
          trueLabel: item.itemConfig.trueLabel,
          falseLabel: item.itemConfig.falseLabel,
          unit: item.itemConfig.unit,
          during: item.itemConfig.during,
          min: item.itemConfig.min,
          max: item.itemConfig.max,
          label: item.itemConfig.label
        } as ITemplateItem
      })
    } as ITemplate
  }

  const transferITemplateToDragItems = (template: ITemplate): IDragItem[] => {
    return template.itemsConfig.map((item) => {
      return {
        id: item?.id ?? Math.random().toString(),
        type: item.type,
        itemConfig: {
          requestSignalId: item.requestSignalId,
          requestSignals: item.requestSignals,
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          title: item.title,
          interval: item.interval,
          trueLabel: item.trueLabel,
          falseLabel: item.falseLabel,
          unit: item.unit,
          during: item.during,
          min: item.min,
          max: item.max,
          label: item.label
        }
      }
    })
  }

  return (
    <div className='dd_container' style={{
      backgroundColor: '#f8f8f8',
      backgroundImage: 'linear-gradient(#e2e2e2 1px, transparent 1px), linear-gradient(90deg, #e2e2e2 1px, transparent 1px)'
    }}>
      <div className="dd_body">
        <div className="dd_drop_container" ref={ref}>
          <ConfigDropContainer
            banModify={mode === "COLLECTING" || dataMode === "OFFLINE"}
            items={dragItems}
            testConfig={testConfig}

            onLayoutChange={updateAllByLayout}
            updateDragItem={updateDragItem}
            fileHistory={undefined}
            netHistory={netDataRecorder}
          />
        </div>
        {renderManageButton()}
      </div>
    </div>
  );
};

export default TestTemplateForConfig;
