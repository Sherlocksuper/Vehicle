import {CAN, getCollectItem, getTargetId} from "../public/config.js";

class SignalConfig {
  constructor(type) {
    this.targetId = getTargetId(type)
    this.collectItem = getCollectItem(type)
  }

  setFunctionCode(functionCode) {
    this.functionCode = functionCode;
    return this;
  }

  setFrameNumber(frameNumber) {
    this.frameNumber = frameNumber;
    return this;
  }

  setFrameId(frameIds) {
    this.frameId = frameIds.join(" ");
    return this;
  }

  setSignalCount(signalCount) {
    this.signalCount = signalCount;
    return this;
  }

  setSignalStart(signalStart) {
    this.signalStart = signalStart;
    return this;
  }

  setSignalLength(signalLength) {
    this.signalLength = signalLength;
    return this;
  }

  setSignalSlope(signalSlope) {
    this.signalSlope = signalSlope;
    return this;
  }

  setSignalOffset(signalOffset) {
    this.signalOffset = signalOffset;
    return this;
  }

  // Method to convert the instance to a byte array
  toByteArray() {
    return [
      0xff,
      0x00,
      this.targetId !== undefined ? this.targetId : null,
      this.collectItem !== undefined ? this.collectItem : null,
      this.functionCode !== undefined ? this.functionCode : null,
      this.frameNumber !== undefined ? this.frameNumber : null,
      this.frameId !== undefined ? this.frameId : null,
      this.signalCount !== undefined ? this.signalCount : null,
      this.signalStart !== undefined ? this.signalStart : null,
      this.signalLength !== undefined ? this.signalLength : null,
      this.signalSlope !== undefined ? this.signalSlope : null,
      this.signalOffset !== undefined ? this.signalOffset : null
    ].filter(item => item !== null).join(" ");
  }

  send() {
    senderForDown.write(Buffer.from(this.toByteArray()))
  }
}

export const CanConfig = new SignalConfig(CAN)

