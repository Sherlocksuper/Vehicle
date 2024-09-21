const splitBufferByDelimiter = (buffer: Buffer, delimiter: Buffer): Buffer[] => {
  let start = 0;
  const result: Buffer[] = [];
  let index = buffer.indexOf(delimiter);
  while (index !== -1) {
    result.push(buffer.subarray(start, index));
    start = index + 1;
    index = buffer.indexOf(delimiter, start);
  }
  result.push(buffer.subarray(start));
  return result;
}

interface IReceiveData {
  moduleId: number;
  collectType: number;
  busType: number;
  timestamp: number;
  frameId: number;
  signalCount: number;
  reserved: number;
  signals: IReceiveSignal[];
}

interface IReceiveSignal {
  signalId: number;
  signalLength: number;
  sign: number;
  integer: number;
  decimal: number;
  value: number;
}

// 当前数据映射表/Map
let currentDataMapDecoding = new Map<string, string[]>();

// 处理一个
export const decodingBoardMessage = (buffer: Buffer): IReceiveData => {
  const result = {} as IReceiveData, moduleId = buffer[2];
  // 模块id
  result.moduleId = moduleId;
  // 采集的类型，0表示总线采集，1表示数模采集
  result.collectType = buffer[3] >> 4;
  // 总线种类,如果是总线采集，表示总线种类，如果是数模采集，表示A还是D
  result.busType = buffer[3] & 0x0f;
  // 时间戳 4、5
  result.timestamp = buffer[4] << 8 | buffer[5]
  // 帧id 6、7、8、9
  result.frameId = buffer[6] << 24 | buffer[7] << 16 | buffer[8] << 8 | buffer[9];
  // 10字节是信号数量
  result.signalCount = buffer[10];
  // 11字节是预留
  result.reserved = buffer[11];
  // const signals = splitBufferByDelimiter(buffer.subarray(12), Buffer.from([0xff, 0xff]));

  // 去掉前面11个字节
  const signalsPart = buffer.subarray(12);

  // 每个信号6个字节
  const signalLength = 6;
  const signals = [];
  for (let i = 0; i < result.signalCount; i++) {
    const signal = signalsPart.subarray(i * signalLength, (i + 1) * signalLength);
    signals.push(decodingOneSignal(signal));
  }
  result.signals = signals;

  return result;
}

export const setCurrentDataMapDecoding = (map: Map<string, string[]>) => {
  currentDataMapDecoding = map;
}

// 做一个数据映射
export const decodingBoardMessageWithMap = (key: string, values: number[]): Map<string, number> => {
  const result = new Map<string, number>();
  // 序列
  const signalOrder = currentDataMapDecoding.get(key);
  if (!signalOrder) {
    return result;
  }

  for (let i = 0; i < signalOrder.length; i++) {
    result.set(signalOrder[i], values[i]);
  }

  return result
}


const decodingOneSignal = (buffer: Buffer): IReceiveSignal => {
  const signalId = buffer[0];
  const signalLength = buffer[1] >> 1;
  const sign = buffer[1] & 0x01;
  const integer = buffer[2] << 16 | buffer[3] << 8 | buffer[4] >> 4;
  const decimal = (buffer[4] & 0x0f) << 8 | buffer[5];
  const value = integer + decimal / 1000;

  return {
    signalId,
    signalLength,
    sign,
    integer,
    decimal,
    value
  }
}




