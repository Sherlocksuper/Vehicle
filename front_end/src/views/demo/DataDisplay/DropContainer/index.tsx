import "./index.css";
import {DragItemType} from "../display";
import BooleanChart from "@/components/Charts/BooleanChart";
import NumberGaugeChart from "@/components/Charts/NumberGaugeChart";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, {useEffect} from "react";
import LinesChart from "@/components/Charts/LinesChart/LinesChart.tsx";
import {Input, Modal, Select} from "antd";
import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {
    IDragItem,
    ISignalItem,
    NewTestTemplateMode,
} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {DataSourceType} from "@/components/Charts/interface.ts";
import {IHistory, IHistoryItemData} from "@/apis/standard/history.ts";
import PureNumberChart from "@/components/Charts/PureNumberChart/PureNumberChart.tsx";
import {generateHistoryData} from "@/components/mockHistoryData.ts";

const DropContainer: React.FC<{
    banModify: boolean;
    items: IDragItem[];
    onLayoutChange: (layout: GridLayout.Layout[]) => void;
    updateDragItem: (id: string, itemConfig: IDragItem["itemConfig"]) => void;
    onReceiveData: (data: IHistoryItemData) => void;
    fileHistory?: IHistory;
    netHistory?: IHistory
}> = ({
          banModify,
          items,
          onLayoutChange,
          updateDragItem,
          onReceiveData,
          fileHistory,
          netHistory
      }) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const testProcessNRecord = params.get("testProcessNRecord");
    const mode: NewTestTemplateMode = params.get("model") as NewTestTemplateMode;
    const [openItemId, setOpenItemId] = React.useState<string | null>(null);
    let testProcessN: ITestProcessN | null = null;

    if (testProcessNRecord && mode) {
        testProcessN = JSON.parse(testProcessNRecord) as ITestProcessN;
    }

    useEffect(() => {
        if (mode === NewTestTemplateMode.CONFIG) {
            return
        }

        if (!testProcessN) {
            return
        }

        if (fileHistory !== undefined) {
            return
        }

        const signalTemplateMap: Map<number, string[]> = new Map()
        items.forEach(item => {
            item.itemConfig.requestSignals.forEach(signal => {
                const currentTemplateIds = signalTemplateMap.get(signal.signal.id) ?? []
                currentTemplateIds.push(item.id)
                signalTemplateMap.set(signal.signal.id, currentTemplateIds)
            })
        })

        const {start, stop} = generateHistoryData(testProcessN!, 1000, 1500, onReceiveData, signalTemplateMap)
        start()

        return () => {
            stop()
        }
    }, [items.length])


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
                            style={{border: "1px solid transparent"}}
                            data-grid={{
                                ...item.itemConfig,
                                w: item.itemConfig.width / 30,
                                h: item.itemConfig.height / 30,
                                i: item.id,
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                if (mode === NewTestTemplateMode.CONFIG) setOpenItemId(item.id);
                            }}
                        >
                            <UpdateItemModal
                                item={item}
                                setOpenItemId={setOpenItemId}
                                open={item.id === openItemId}
                                testProcessN={testProcessN}
                                updateDragItem={updateDragItem}
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

interface IUpdateItemModal {
    item: IDragItem;
    open: boolean;
    setOpenItemId: Function;
    testProcessN: ITestProcessN | null;
    updateDragItem: (id: string, itemConfig: IDragItem["itemConfig"]) => void;
}

const UpdateItemModal: React.FC<IUpdateItemModal> = (props) => {
    const {item, open, setOpenItemId, testProcessN, updateDragItem} = props;

    const getDefaultValue = (dragItem: IDragItem) => {
        return dragItem.itemConfig.requestSignals.map((signal) => {
            return JSON.stringify({
                vehicleName: signal.vehicleName,
                projectName: signal.projectName,
                controller: signal.controller,
                collector: signal.collector,
                signal: signal.signal,
            });
        });
    };

    return (
        <Modal
            title={
                item.type + "-" + item.itemConfig.title + "-" + item.id.slice(0, 6)
            }
            open={open}
            onOk={() => {
                setOpenItemId(null);
            }}
            onCancel={() => setOpenItemId(null)}
            key={item.id}
        >
            <Input
                placeholder="标题"
                defaultValue={item.itemConfig.title}
                onChange={(e) => {
                    updateDragItem(item.id, {
                        ...item.itemConfig,
                        title: e.target.value,
                    });
                }}
            />
            <Select
                placeholder="采集信号选择"
                mode={item.type === DragItemType.LINES ? "multiple" : undefined}
                style={{width: "100%"}}
                defaultValue={getDefaultValue(item)}
                onChange={(value) => {
                    if (!Array.isArray(value)) {
                        value = [value];
                    }
                    const requestSignals = value.map(
                        (v: string) => JSON.parse(v) as ISignalItem
                    );
                    updateDragItem(item.id, {
                        ...item.itemConfig,
                        requestSignals,
                    });
                }}
            >
                {testProcessN?.testObjectNs.map((testObject) => {
                    return testObject.project.map((project) => {
                        return project.projectConfig.map((projectConfig) => {
                            return (
                                <Select.Option
                                    value={JSON.stringify({
                                        vehicleName: testObject.vehicle.vehicleName,
                                        projectName: project.projectName,
                                        controller: projectConfig.controller,
                                        collector: projectConfig.collector,
                                        signal: projectConfig.signal,
                                    } as ISignalItem)}
                                >
                                    {testObject.vehicle.vehicleName +
                                        "-" +
                                        project.projectName +
                                        "-" +
                                        projectConfig.signal.signalName}
                                </Select.Option>
                            );
                        });
                    });
                })}
            </Select>
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

export default DropContainer;
