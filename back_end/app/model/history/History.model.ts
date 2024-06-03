/**
 * 记录开始、结束时间方便回放、裁剪
 * 需求功能：
 * 1. 数据编辑
 * 2. 历史数据浏览
 */

interface IHistory {
    sourceFileName: string
    version: string
    startedAt: string
    endedAt: string
    dataCount: number
    dataTypes: DataType[]
    timeRecords: ITimeRecord[]
}

interface DataType {
    type: string
    title: string
    unit: string
}

interface ITimeRecord {
    time: string
    currentTimeRecord: ITimeRecordItem[]
}

interface ITimeRecordItem {
    data: string
}

// {
//     sourceFileName: "sourceFile.ts",
//     version: "1.0.0",
//     startedAt: new Date().toISOString(),
//     endedAt: new Date().toISOString(),
//     dataTypes: [
//         {
//             type: "liner",
//             title: "xx车速度",
//             unit: "m/s"
//         },
//         {
//             type: "liner",
//             title: "xx车速度",
//             unit: "m/s"
//         }
//     ],
//     timeRecord: [
//         {
//             time: new Date().toISOString(),
//             每个currentTimeRecord的长度必须等于dataTypes的长度
//             currentTimeRecord: [
//                 {
//                     data: "1",
//                 },
//                 {
//                     data: "1",
//                 },
//             ]
//         }
//     ]
// };