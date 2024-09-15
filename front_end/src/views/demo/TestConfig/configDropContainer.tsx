import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React from "react";
import LinesChart from "@/components/Charts/LinesChart/LinesChart.tsx";
import {DataSourceType} from "@/components/Charts/interface.ts";
import {IHistory, IHistoryItemData} from "@/apis/standard/history.ts";
import PureNumberChart from "@/components/Charts/PureNumberChart/PureNumberChart.tsx";
import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import {IDragItem} from "@/views/demo/TestConfig/template.tsx";
import {Form, Input, Modal, Select} from "antd";
import {ITestConfig} from "@/apis/standard/test.ts";
import {getAllProtocolSignalsFromTestConfig} from "@/utils";

const ConfigDropContainer: React.FC<{
  banModify: boolean;
  items: IDragItem[];
  testConfig: ITestConfig;
  onLayoutChange: (layout: GridLayout.Layout[]) => void;
  updateDragItem: (id: string, itemConfig: IDragItem["itemConfig"]) => void;
  onReceiveData: (data: IHistoryItemData) => void;
  fileHistory?: IHistory;
  netHistory?: IHistory
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


  return (
    <div className="dc_container">
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
              onContextMenu={(e) => {
                e.preventDefault();
                if (banModify) setOpenItemId(item.id);
              }}
            >
              <UpdateItemModal
                item={item}
                setOpenItemId={setOpenItemId}
                open={item.id === openItemId}
                updateDragItem={updateDragItem}
                testConfig={testConfig}
              />
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

  const [itemConfig, setItemConfig] = React.useState(item.itemConfig);
  const requestSignals = getAllProtocolSignalsFromTestConfig(testConfig)

  const isSingleChart = (type: DragItemType) => ! (type === DragItemType.LINES)

  const handleUpdate = () => {
    updateDragItem(item.id, itemConfig);
    setOpenItemId("");
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
        labelCol={{span: 6}}
        wrapperCol={{span: 18}}
        initialValues={itemConfig}
        onValuesChange={(changedValues) => {
          setItemConfig((prev) => ({
            ...prev,
            ...changedValues,
          }));
        }}
      >
        <Form.Item label="标题" name="title">
          <Input/>
        </Form.Item>
        <Form.Item label="请求信号" name="requestSignals">
          <Select mode={isSingleChart(item.type) ? null : "multiple"}>

            {requestSignals.map((signal) => (
              <Select.Option key={signal.id} value={signal.id}>
                {signal.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};


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
export const SetDragItem = ({
                              item,
                              banModify,
                              fileHistory,
                              currentTestData,
                            }: {
  item: IDragItem;
  banModify: boolean;
  fileHistory?: IHistory;
  currentTestData?: IHistory
}) => {
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
    },
  } = item as IDragItem;

  const historyData: IHistoryItemData[] | undefined =
    fileHistory?.historyData.find(
      (templateItem) => templateItem.templateItemId === item.id
    )?.data || undefined;


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
        historyData={historyData}
        currentTestChartData={
          currentTestData?.historyData.find(
            (templateItem) => templateItem.templateItemId === item.id
          )?.data
        }
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
        historyData={historyData}
        currentTestChartData={
          currentTestData?.historyData.find(
            (templateItem) => templateItem.templateItemId === item.id
          )?.data ?? []
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
        historyData={historyData}
        currentTestChartData={
          currentTestData?.historyData.find(
            (templateItem) => templateItem.templateItemId === item.id
          )?.data ?? []
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
        historyData={historyData}
        currentTestChartData={
          currentTestData?.historyData.find(
            (templateItem) => templateItem.templateItemId === item.id
          )?.data ?? []
        }
      />
    ),
  }[type];
};

export default ConfigDropContainer;
