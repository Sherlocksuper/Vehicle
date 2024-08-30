import * as XLSX from "xlsx";

const directoryPath = "data/"

export function parseToXlsxData(rawData) {
  console.log(rawData)
  const data = rawData.signals.map(signal => {
    const a = {
      timestamp: rawData.timestamp,
      collectType: rawData.collectType,
      frameId: rawData.frameId,
      signalType: `Signal ${signal.signalNumber}`,  // 可以根据实际需要调整信号类型的表示
      signalValue: signal.integerPart + signal.fractionalPart / 1000  // 例如，转换为浮点数形式
    };

    // 0表示正 1表示负
    if (signal.signFlag) {
      a.signalValue = -a.signalValue;
    }
    return a
  });

  console.log(data)
  return data;
}

// 封装方法
export function saveDataToXlsx(data) {
  // 获取当前日期和时间，精确到分钟
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const fileName = `${year}${month}${day}_${hours}${minutes}${seconds}.xlsx`;

  // 创建工作簿和工作表
  const workbook = XLSX.utils.book_new();
  const worksheetData = data.map(item => [
    item.timestamp,
    item.collectType,
    item.frameId,
    item.signalType,
    item.signalValue
  ]);

  // 添加标题行
  worksheetData.unshift(['时间戳', '采集类型', '帧id', '信号名称', '信号值']);

  // 将数据添加到工作表
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 保存为xlsx文件
  XLSX.writeFile(workbook, directoryPath + fileName);

  console.log(`文件已保存为 ${fileName}`);
}

// 示例数据
const data = [
  {timestamp: '2024-08-30 12:00:00', collectType: 'type1', frameId: 'frame1', signalType: 'signal1', signalValue: 123},
  {timestamp: '2024-08-30 12:01:00', collectType: 'type2', frameId: 'frame2', signalType: 'signal2', signalValue: 456},
];

// 调用方法保存文件
saveDataToXlsx(data);
