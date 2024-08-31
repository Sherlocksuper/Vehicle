export enum LongMessage {
    STARTCOLLECT = "start_collect",
    STOPCOLLECT = "stop_collect",
}

export interface ILongMessageType {
    type: LongMessage
    body: any
}
