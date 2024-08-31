// 此文件用来解析下位机传来的数据
// 比如 CD EF 02 01 FF FF 00 00 00 05 01 FF 00 10 00 00 A1 5E

import {parseToXlsxData, saveDataToXlsx} from "../file.js";

class ParseClass {
  constructor(buffer) {
    this.buffer = buffer;
    this.parsedData = this.parseBuffer();
  }

  // 解析Buffer的方法
  parseBuffer() {
    console.log(this.buffer.size)
    let offset = 0;

    // 帧头段解析
    const frameHeader = this.buffer.slice(offset, offset + 2).toString('hex').toUpperCase();  // 固定为CDEF
    offset += 2;

    const moduleId = this.buffer.slice(offset, offset + 1).readUInt8(0);// 模块ID
    offset += 1;

    const collectAndSignalType = this.buffer.slice(offset, offset + 1);  // 采集类型和信号类型
    const collectType = collectAndSignalType.readUInt8(0) >> 4;  // 采集类型
    const signalType = collectAndSignalType.readUInt8(0) & 0x0F;  // 信号类型
    offset += 1;

    const timestamp = this.buffer.slice(offset, offset + 2).readUInt16BE(0);  // 时间戳
    offset += 2;

    const frameId = this.buffer.slice(offset, offset + 4).readUInt32BE(0);
    offset += 4;

    const signalCount = this.buffer.slice(offset, offset + 1).readUInt8(0)
    offset += 1;

    const reserved = this.buffer.slice(offset, offset + 1).readUInt8(0)
    offset += 1;

    const signals = [];
    for (let i = 0; i < signalCount; i++) {
      const signalNumber = this.buffer.slice(offset, offset + 1).readUInt8(0);  // 信号编号
      offset += 1;

      const signalLengthAndSign = this.buffer.slice(offset, offset + 1)
      const signalLength = signalLengthAndSign.readUInt8(0) >> 1;  // 信号长度
      const signFlag = signalLengthAndSign.readUInt8(0) & 0x01;  // 符号位
      offset += 1

      const numberPart = this.buffer.slice(offset, offset + 4).readUInt32BE(0)
      console.log(this.buffer.slice(offset, offset + 4))
      offset += 4
      const integerPart = numberPart >> 12;  // 整数部分
      const fractionalPart = numberPart & 0x0FFF;  // 小数部分


      // 解析信号数据并存储
      signals.push({
        signalNumber,
        signalLength,
        signFlag,
        integerPart,
        fractionalPart,
      });
    }

    // 将解析后的数据组织成对象返回
    return {
      frameHeader,
      moduleId,
      collectType,
      signalType,
      timestamp,
      frameId,
      signalCount,
      reserved,
      signals,
    };
  }

  // 获取解析后的数据
  getParsedData() {
    return this.parsedData;
  }
}

// 假设收到的Buffer数据
//CD EF 02 01 FF FF 00 00 00 05 01 FF 00 10 00 00 A1 5E
const receivedBuffer = Buffer.from([
  0xCD, 0xEF, 0x02, 0x01, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x05, 0x01, 0xFF, 0x00, 0x10, 0x00, 0x00, 0xA1, 0x5E
]);

// 实例化ParseClass并解析数据
const parser = new ParseClass(receivedBuffer);
const parsedData = parser.getParsedData();

saveDataToXlsx(parseToXlsxData(parsedData))
