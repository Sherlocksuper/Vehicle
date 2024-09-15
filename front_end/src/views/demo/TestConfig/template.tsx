import React, {useEffect, useRef, useState} from 'react';
import {useDrop} from 'react-dnd';
import DraggableComponent, {
  IBooleanChartExtra,
  IDraggleComponent,
  INumberChartExtra
} from "@/views/demo/DataDisplay/DraggableComponent";
import {Button, message} from "antd";
import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import GridLayout from "react-grid-layout";
import {DEFAULT_TITLE, SUCCESS_CODE} from "@/constants";
import {IHistory, IHistoryItemData} from "@/apis/standard/history.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";
import {getTestConfigById, updateTestConfigById} from "@/apis/request/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";
import ConfigDropContainer from "@/views/demo/TestConfig/configDropContainer.tsx";
import {ITemplate, ITemplateItem} from "@/apis/standard/template.ts";
import {createConnection} from "@/views/demo/TestConfig/eventsource.ts";

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

const TestTemplateForConfig: React.FC = () => {
  const [testConfig, setTestConfig] = useState<ITestConfig | null>(null)
  const [mode, setMode] = useState<'CHANGING' | 'COLLECTING'>('CHANGING')

  const ref = useRef<HTMLDivElement>(null)
  const [dragItems, setDragItems] = useState<IDragItem[]>([])

  const socketRef = useRef<WebSocket>(null)

  const [history, setHistory] = useState<IHistory>({
    historyName: '默认名称',
    configName: '默认名称',
    startTime: Date.now(),
    endTime: Date.now(),
    template: {
      name: '默认模板',
      description: '默认描述',
      createdAt: new Date(),
      updatedAt: new Date(),
      itemsConfig: []
    },
    historyData: []
  })


  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const testConfigId = params.get('testConfigId')

    if (testConfigId) {
      let testConfig: ITestConfig = undefined
      getTestConfigById(Number(testConfigId)).then((res) => {
        if (res.code === SUCCESS_CODE) {
          testConfig = res.data as ITestConfig
          console.log(testConfig)
          setTestConfig(testConfig)
          setDragItems(transferITemplateToDragItems(testConfig.template))
        }
      })
    }
  }, [])

  useEffect(() => {
    const socket = new WebSocket('http://localhost:8080/ws');
    socket.onopen = () => {
      socketRef.current = socket
    }
    socket.onclose = () => {
      socketRef.current = null
    }

    socket.onmessage = (event) => {
      console.log(event.data)
      console.log(event)
    };

    // 清理 WebSocket 连接
    return () => {
      socket.close();
    };
  }, []);

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
    console.log(id)
    setDragItems(dragItems.map((item) => {
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
    }))
  }

  const updateAllByLayout = (layout: GridLayout.Layout[]) => {
    setDragItems(dragItems.map((item) => {
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
    }))
  }

  const renderManageButton = () => {

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
      return <Button onClick={() => {
        setMode('CHANGING')
      }}>切换到配置模式</Button>
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

  const onReceiveData = (data: IHistoryItemData) => {
    const newHistory = {...history} as IHistory
    for (let i = 0; i < history.historyData.length; i++) {
      newHistory.historyData[i].data.push(data)
    }
    setHistory(newHistory)
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
            banModify={mode === "COLLECTING"}
            items={dragItems}
            testConfig={testConfig}

            onLayoutChange={updateAllByLayout}
            updateDragItem={updateDragItem}
            onReceiveData={onReceiveData}
            fileHistory={undefined}
            netHistory={history}
          />
        </div>
        {renderManageButton()}
      </div>
    </div>
  );
};

export default TestTemplateForConfig;
