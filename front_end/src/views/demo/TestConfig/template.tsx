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
import {getTestConfigById, updateTestConfigById} from "@/apis/request/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";
import ConfigDropContainer from "@/views/demo/TestConfig/configDropContainer.tsx";
import {ITemplate, ITemplateItem} from "@/apis/standard/template.ts";
import {IHistory} from "@/apis/standard/history.ts";
import {getTestsHistoryById} from "@/apis/request/testhistory.ts";
import * as url from "url";
import {BASE_URL} from "@/apis/url/myUrl.ts";

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
    trueValue?: string
    trueLabel?: string
    falseLabel?: string
    unit?: string
    during?: number
    min?: number
    max?: number
    label?: string
    windowSize?: number
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
    testConfig: undefined,
    historyName: "默认名称",
    configName: '默认配置',
    startTime: Date.now(),
    endTime: Date.now(),
    template: null,
    historyData: [],
    dataParseResult: []
  })
  const [netDataRecorder, setNetDataRecorder] = useState<Map<string, number[]>>(new Map())
  const historyManagers = useRef(undefined)

  const dataCacheRef = useRef({});
  const throttleTimeoutRef = useRef(null);

// 节流函数：每500ms调用一次 updateDataRecorder
  function throttleUpdate(data) {
    Object.assign(dataCacheRef.current, data)
    if (throttleTimeoutRef.current) {
      return;
    }

    throttleTimeoutRef.current = setTimeout(() => {
      updateDataRecorder(dataCacheRef.current);  // 调用 updateDataRecorder 处理缓存数据

      dataCacheRef.current = {};  // 清空缓存
      throttleTimeoutRef.current = null
    }, 487);
  }

  const updateDataRecorder = (data, time = undefined) => {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const currentData = {
      time: time ?? new Date().getTime(),
      data: parsedData
    };

    history.current.historyData.push(currentData);

    const updatedNetDataRecorder = new Map(netDataRecorder);
    Object.keys(parsedData).forEach((key) => {
      if (updatedNetDataRecorder.has(key)) {
        updatedNetDataRecorder.set(key, [...updatedNetDataRecorder.get(key), parsedData[key]]);
      } else {
        updatedNetDataRecorder.set(key, [parsedData[key]]);
      }
    });

    // 更新触发状态更新
    setNetDataRecorder(updatedNetDataRecorder);
  };

  // 在线、离线数据的时候获取testConfig
  useEffect(() => {
    if (dataMode === "OFFLINE") {
      return () => {
      }
    }

    const search = window.location.search
    const params = new URLSearchParams(search)
    const testConfigId = params.get('testConfigId') ?? undefined
    const historyId = params.get('historyId') ?? undefined

    if (testConfigId) {
      let testConfig: ITestConfig = undefined
      getTestConfigById(Number(testConfigId)).then((res) => {
        if (res.code === SUCCESS_CODE) {
          testConfig = res.data as ITestConfig
          history.current.template = testConfig.template

          setTestConfig(testConfig)
          setDragItems(transferITemplateToDragItems(testConfig.template))
        }
      })
      return
    }

    // 从历史记录中获取数据
    getTestsHistoryById(Number(historyId)).then((res) => {
      if (res.code === SUCCESS_CODE) {
        const testConfig = res.data.testConfig as ITestConfig
        history.current.template = testConfig.template

        setTestConfig(testConfig)
        setDragItems(transferITemplateToDragItems(testConfig.template))
      }
    })
  }, [dataMode])

  // 处理在线数据源头
  useEffect(() => {
    if (dataMode === "OFFLINE") {
      return () => {
      }
    }
    window.onbeforeunload = function () {
      return "你确定要离开吗？";
    }


    const socket = new WebSocket(BASE_URL + '/ws');
    socket.onopen = () => {
      socketRef.current = socket
    }
    socket.onclose = () => {
      socketRef.current = null
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === "DATA") {
        throttleUpdate(JSON.parse(message.message));
      } else if (message.type === "NOTIFICATION") {
        message.info(message.message)
      }
    };

    // 清理 WebSocket 连接
    return () => {
      socket.close();
    };
  }, [dataMode, throttleUpdate]);

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
        defaultWidth: 200,
        defaultHeight: 200,
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
        defaultWidth: 200,
        defaultHeight: 200,
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
        defaultWidth: 200,
        defaultHeight: 200,
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
    console.log("新的", itemConfig)
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
      return <Space direction={"vertical"}>
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
          label: item.itemConfig.label,
          windowSize: item.itemConfig.windowSize
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
          label: item.label,
          windowSize: item.windowSize
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
