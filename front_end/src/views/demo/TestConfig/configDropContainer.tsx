import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, {useEffect, useMemo, useRef, useState} from "react";
import LinesChart from "@/components/Charts/LinesChart/LinesChart.tsx";
import {DataSourceType} from "@/components/Charts/interface.ts";
import {IHistory} from "@/apis/standard/history.ts";
import PureNumberChart from "@/components/Charts/PureNumberChart/PureNumberChart.tsx";
import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import {IDragItem, ITimeData} from "@/views/demo/TestConfig/template.tsx";
import {Form, Input, Modal, Select, Tooltip} from "antd";
import {ITestConfig} from "@/apis/standard/test.ts";
import {getAllProtocolSignalsFromTestConfig} from "@/utils";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {DataParsingModal} from "@/views/demo/History/history.tsx";
import {getDataMaxMinMiddle} from "@/apis/request/data.ts";
import {SUCCESS_CODE} from "@/constants";

const ConfigDropContainer: React.FC<{
  banModify: boolean;
  items: IDragItem[];
  testConfig: ITestConfig;
  onLayoutChange: (layout: GridLayout.Layout[]) => void;
  updateDragItem: (id: string, itemConfig: IDragItem["itemConfig"]) => void;
  fileHistory?: IHistory;
  netHistory?: Map<string, ITimeData[]>
}> = ({
        banModify,
        items,
        testConfig,
        onLayoutChange,
        fileHistory,
        netHistory,
        updateDragItem,
      }) => {


  const [openItemId, setOpenItemId] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);

  const pathRef = useRef(window.location.pathname);

  const [belongId, setBelongId] = React.useState<string>(undefined)
  const [openDataParsing, setOpenDataParsing] = useState(false);

  const handleCloseParsing=()=>{
    setOpenDataParsing(false)
  }
  const handleOpenParsing=()=>{
    if (!banModify) {
      return
    }
    const belongId = getQueryParam('historyId')
    console.log("belongId",belongId)
    if (!belongId) {
      return
    }
    setBelongId(belongId)
    setOpenDataParsing(true)
  }
  const getQueryParam=(param:string)=> {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  const [dataParsing, setDataParsing] = useState<{
    name: string,
    max: number,
    min: number,
    middle: number
  }[]>([]);
  useEffect(()=>{
    getDataMaxMinMiddle(Number(belongId)).then(res => {
      if (res.code === SUCCESS_CODE) {
        setDataParsing(res.data)
      } else {
        setDataParsing(null)
      }
    })
  },[belongId])

  return (
    <div className="dc_container">
      {
        openItemId && items && items.length > 0 && (
          <UpdateItemModal
            item={items.find((item) => item.id === openItemId)!}
            open={open}
            setOpenItemId={setOpenItemId}
            updateDragItem={updateDragItem}
            testConfig={testConfig}
          />
        )
      }

      <GridLayout
        cols={30}
        rowHeight={40}
        width={1500}
        className="layout"
        isDraggable={!banModify}
        isResizable={!banModify}
        onLayoutChange={onLayoutChange}
      >
        {items?.map((item) => {
          return (
            <div
              className="dc_item_container"
              id={item.id}
              key={item.id}
              style={{
                border: "1px solid transparent",
                backgroundColor: "rgba(255, 255, 255, 0.8)"
              }}
              data-grid={{
                ...item.itemConfig,
                w: item.itemConfig.width / 30,
                h: item.itemConfig.height / 30,
                i: item.id,
              }}
              onClick={()=>{handleOpenParsing()}}
              onContextMenu={(e) => {
                e.preventDefault();
                if (pathRef.current === "/offline-show") {
                  return
                }
                if (banModify) {
                  setOpen(true);
                  setOpenItemId(item.id);
                }
              }}
            >
              <SetDragItem
                item={item}
                banModify={banModify}
                fileHistory={fileHistory}
                currentTestData={netHistory}
              />
            </div>
          );
        })}
      </GridLayout>
      <DataParsingModal source={dataParsing} open={openDataParsing} onFinished={handleCloseParsing}></DataParsingModal>
    </div>
  );
};

const UpdateItemModal: React.FC<{
  item: IDragItem;
  open: boolean;
  testConfig: ITestConfig
  setOpenItemId: (id: string) => void;
  updateDragItem: (id: string, itemConfig: IDragItem["itemConfig"]) => void;
}> = ({item, open, setOpenItemId, updateDragItem, testConfig}) => {

  const [form] = Form.useForm();

  const itemConfig = useMemo(() => item.itemConfig, [item])
  const [requestSignals, setRequestSignals] = useState<IProtocolSignal[]>([])

  useEffect(() => {
    setRequestSignals(getAllProtocolSignalsFromTestConfig(testConfig))
  }, [testConfig])

  const isSingleChart = (type: DragItemType) => !(type === DragItemType.LINES) && !(type === DragItemType.PURENUMBER)


  useEffect(() => {
    console.log(itemConfig)
    form.setFieldsValue(itemConfig)
    form.setFieldsValue({requestSignals: itemConfig.requestSignals.map((signal) => JSON.stringify(signal))})
  }, [form, itemConfig, open])

  const handleUpdate = () => {
    console.log(itemConfig)
    const newConfig = form.getFieldsValue()
    console.log(newConfig)
    newConfig.requestSignals = newConfig.requestSignals.map((signal: string) => {
      return JSON.parse(signal)
    })
    itemConfig.requestSignals = newConfig.requestSignals
    itemConfig.title = newConfig.title
    itemConfig.min = newConfig.min
    itemConfig.max = newConfig.max
    itemConfig.trueValue = newConfig.trueValue
    itemConfig.trueLabel = newConfig.trueLabel
    itemConfig.falseLabel = newConfig.falseLabel
    itemConfig.windowSize = (newConfig.windowSize % 2) === 0 ? newConfig.windowSize + 1 : newConfig.windowSize
    setOpenItemId("");
    updateDragItem(item.id, itemConfig);
  };

  return (
    <Modal
      title="修改控件"
      open={open}
      onOk={handleUpdate}
      onClose={() => setOpenItemId("")}
      onCancel={() => setOpenItemId("")}
    >
      <Form
        form={form}
        labelCol={{span: 6}}
        wrapperCol={{span: 18}}
        initialValues={itemConfig}
      >
        <Form.Item label="标题" name="title">
          <Input/>
        </Form.Item>
        <Form.Item label="请求信号" name="requestSignals">
          <Select mode={"multiple"}
                  maxCount={isSingleChart(item.type) ? 1 : undefined}
          >

            {requestSignals.map((signal) => (
              <Select.Option key={signal.id} value={JSON.stringify(signal)}>
                {signal.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {
          item.type === DragItemType.LINES && (
            <Form.Item label="滤波窗口长度" name="windowSize" initialValue={0}
                       extra={
                         <Tooltip title={"滤波窗口长度为奇数"}>
                           <QuestionCircleOutlined/>
                         </Tooltip>
                       }>
              <Input type={"number"} defaultValue={0}/>
            </Form.Item>
          )
        }
        {
          item.type === DragItemType.NUMBER && (
            <>
              <Form.Item label="最小值" name="min" initialValue={0}>
                <Input/>
              </Form.Item>
              <Form.Item label="最大值" name="max" initialValue={100}>
                <Input/>
              </Form.Item>
            </>
          )
        }
        {
          item.type === DragItemType.BOOLEAN && (
            <>
              <Form.Item label="真值条件" name="trueValue" initialValue={"1"}>
                <Input placeholder={"请输入真值"}/>
              </Form.Item>
              <Form.Item label="真值标签" name="trueLable" initialValue={"是"}>
                <Input placeholder={"请输入真值标签"}/>
              </Form.Item>
              <Form.Item label="非真值标签 " name="falseLabel" initialValue={"否"}>
                <Input placeholder={"请输入非真值标签"}/>
              </Form.Item>
            </>
          )
        }
      </Form>
    </Modal>
  );
};

// const getUsefulSignal = (requestSignals: IProtocolSignal[], signalRecordMap: Map<string, ITimeData[]>) => {
//   if (typeof requestSignals === 'string') {
//     requestSignals = [requestSignals]
//   }
//   const resultMap = new Map<string, ITimeData[]>()
//   requestSignals.forEach((signal) => {
//     const signalData = signalRecordMap.get(signal.id)
//     if (signalData) {
//       resultMap.set(signal.id, signalData)
//     }
//   })
//   return resultMap
// }


/**
 *
 * @param item
 * @param banModify
 * @param onReceiveData
 * @param fileHistory
 * @param currentTestData
 * @constructor
 * 功能：根据不同的type返回不同的控件
 */

interface ISetDragItem {
  item: IDragItem;
  banModify: boolean;
  fileHistory?: IHistory;
  currentTestData?: Map<string, ITimeData[]>;
}

export const SetDragItem = ({item, banModify, currentTestData,}: ISetDragItem) => {
  const {
    type,
    itemConfig: {
      requestSignalId,
      requestSignals,
      width,
      height,
      title,
      trueLabel,
      falseLabel,
      unit,
      min,
      max,
      windowSize,
    },
  } = item as IDragItem;

  // const memoizedTestData = getUsefulSignal(requestSignals || [], currentTestData || new Map());


  return {
    [DragItemType.LINES]: (
      <LinesChart
        startRequest={banModify}
        requestSignalId={requestSignalId}
        requestSignals={requestSignals || []}
        sourceType={DataSourceType.RANDOM}
        title={title}
        width={width}
        height={height}
        historyData={[]}
        currentTestChartData={
          currentTestData
        }
        windowSize={windowSize}
      />
    ),
    [DragItemType.NUMBER]: (
      <NumberGaugeChart
        startRequest={banModify}
        requestSignalId={requestSignalId}
        requestSignals={requestSignals || []}
        sourceType={DataSourceType.RANDOM}
        title={title}
        unit={unit || ""}
        min={min || 0}
        max={max || 100}
        width={width}
        height={height}
        historyData={[]}
        currentTestChartData={
          currentTestData
        }
      />
    ),
    [DragItemType.BOOLEAN]: (
      <BooleanChart
        startRequest={banModify}
        requestSignalId={requestSignalId}
        requestSignals={requestSignals || []}
        sourceType={DataSourceType.RANDOM}
        title={title}
        trueLabel={trueLabel || "是"}
        falseLabel={falseLabel || "否"}
        width={width}
        height={height}
        historyData={[]}
        currentTestChartData={
          currentTestData
        }
      />
    ),
    [DragItemType.PURENUMBER]: (
      <PureNumberChart
        startRequest={banModify}
        requestSignalId={requestSignalId}
        requestSignals={requestSignals || []}
        sourceType={DataSourceType.RANDOM}
        title={title}
        trueLabel={trueLabel || "是"}
        falseLabel={falseLabel || "否"}
        width={width}
        height={height}
        historyData={[]}
        currentTestChartData={
          currentTestData
        }
      />
    ),
  }[type];
};

export default ConfigDropContainer;
