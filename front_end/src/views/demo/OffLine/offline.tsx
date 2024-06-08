import {ITemplate} from "@/apis/standard/template.ts";
import {SetDragItem} from "@/views/demo/DataDisplay/DropContainer";
import {transferToDragItems} from "@/utils";
import React from "react";
import GridLayout from "react-grid-layout";

interface IOfflineData {
    template?: ITemplate
}

const OfflineDate: React.FC<null | IOfflineData> = (props) => {

    if (props === null || Object.getOwnPropertyNames(props).length === 0 || !props.template) {
        return <p>离线数据</p>
    }

    const items = transferToDragItems(props.template)

    return <div className="dc_container" onClick={undefined}>
        <GridLayout cols={30} rowHeight={40} width={1500} className="layout" isDraggable={false}
                    isResizable={false}
                    onLayoutChange={() => {
                    }}
        >
            {
                items?.map((item) => {
                    return <div className="dc_item_container" id={item.id} key={item.id}
                                style={{border: '1px solid transparent'}}
                                data-grid={{
                                    ...item.itemConfig,
                                    w: item.itemConfig.width / 30,
                                    h: item.itemConfig.height / 30,
                                    i: item.id
                                }}
                    >
                        <SetDragItem item={item} banModify={true}/>
                    </div>
                })
            }
        </GridLayout>
    </div>

}

export default OfflineDate