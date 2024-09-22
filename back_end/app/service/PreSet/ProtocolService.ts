import Protocol, {IProtocolModel} from "../../model/PreSet/Protocol.model";

class ProtocolService {
  async getProtocolList() {
    return await Protocol.findAll();
  }

  async getProtocolById(id: number) {
    return await Protocol
      .findOne({
        where: {
          id
        }
      });
  }

  async createProtocol(protocol: IProtocolModel) {
    return await Protocol.create(protocol);
  }

  async updateProtocol(id: number, newProtocol: IProtocolModel) {
    const protocol = await Protocol.findByPk(id);
    newProtocol.id = id
    if (protocol) {
      await protocol.update(newProtocol);
      return protocol;
    }

    return null;
  }

  async deleteProtocol(id: number) {
    const protocol = await Protocol.findByPk(id);
    if (protocol) {
      await protocol.destroy();
      return protocol.id;
    }
    return 0;
  }

  async initProtocol() {
    // const targetData2 = {
    //   "id": 6,
    //   "protocolName": "CAN-1",
    //   "protocolType": "CAN",
    //   "baseConfig": {
    //     "baudRate": "800"
    //   },
    //   "signalsParsingConfig": [
    //     {
    //       "frameId": "1",
    //       "signals": [
    //         {
    //           "id": "63c7df50-3598-4645-bc55-221c1f73ac87",
    //           "name": "速度",
    //           "slope": "3",
    //           "length": "2",
    //           "offset": "4",
    //           "dimension": "km/h",
    //           "startPoint": "1"
    //         },
    //         {
    //           "id": "db06679c-e84e-43b1-888f-1d07fd64e878",
    //           "name": "里程",
    //           "slope": "7",
    //           "length": "6",
    //           "offset": "8",
    //           "dimension": "km",
    //           "startPoint": "5"
    //         },
    //         {
    //           "id": "f2ad17c7-e374-43bf-a7c7-6038baac3837",
    //           "name": "电压",
    //           "slope": "11",
    //           "length": "10",
    //           "offset": "12",
    //           "dimension": "V",
    //           "startPoint": "9"
    //         }
    //       ],
    //       "frameNumber": "1"
    //     },
    //     {
    //       "frameId": "2",
    //       "signals": [
    //         {
    //           "id": "eabe53ec-d764-48d2-99dc-e97e1d7da858",
    //           "name": "速度-2",
    //           "slope": "15",
    //           "length": "14",
    //           "offset": "16",
    //           "dimension": "km/h",
    //           "startPoint": "13"
    //         },
    //         {
    //           "id": "b213b031-c45a-4ce9-a99e-5c822aea418d",
    //           "name": "里程-2",
    //           "slope": "19",
    //           "length": "18",
    //           "offset": "20",
    //           "dimension": "km.h",
    //           "startPoint": "17"
    //         }
    //       ],
    //       "frameNumber": "2"
    //     }
    //   ],
    //   "createdAt": "2024-09-16T00:36:34.000Z",
    //   "updatedAt": "2024-09-16T00:36:34.000Z"
    // }
    // const targetData3 = {
    //   "id": 7,
    //   "protocolName": "Flexray-1",
    //   "protocolType": "FlexRay",
    //   "baseConfig": {
    //     "setAsSyncNode": "8",
    //     "dynamicSlotCount": "6",
    //     "staticSlotsCount": "5",
    //     "dynamicSlotLength": "7",
    //     "macroticksPerCycle": "2",
    //     "microticksPerCycle": "1",
    //     "staticFramepayload": "4",
    //     "transmissionStartTime": "3"
    //   },
    //   "signalsParsingConfig": [
    //     {
    //       "frameId": "0",
    //       "signals": [
    //         {
    //           "id": "1d413c9c-f14f-473b-bb97-6ac6fb450e2c",
    //           "name": "速度",
    //           "slope": "3",
    //           "length": "2",
    //           "offset": "4",
    //           "dimension": "km/h",
    //           "startPoint": "1"
    //         },
    //         {
    //           "id": "5c362f0a-45d5-476a-b632-14e0e8f89c72",
    //           "name": "里程",
    //           "slope": "7",
    //           "length": "6",
    //           "offset": "8",
    //           "dimension": "km",
    //           "startPoint": "5"
    //         },
    //         {
    //           "id": "82091432-d1c3-4f36-81af-7fb07c3d81ee",
    //           "name": "电压",
    //           "slope": "11",
    //           "length": "10",
    //           "offset": "12",
    //           "dimension": "V",
    //           "startPoint": "9"
    //         }
    //       ],
    //       "cycleNumber": "0",
    //       "frameNumber": "0"
    //     },
    //     {
    //       "frameId": "1",
    //       "signals": [
    //         {
    //           "id": "9e1089aa-2c24-4cf6-b306-53c5c542e3ec",
    //           "name": "速度-2",
    //           "slope": "15",
    //           "length": "14",
    //           "offset": "16",
    //           "dimension": "km/h",
    //           "startPoint": "13"
    //         },
    //         {
    //           "id": "8d67e3b8-22f6-41ca-ad15-f257185991e7",
    //           "name": "里程-2",
    //           "slope": "19",
    //           "length": "18",
    //           "offset": "20",
    //           "dimension": "km",
    //           "startPoint": "17"
    //         }
    //       ],
    //       "cycleNumber": "1",
    //       "frameNumber": "1"
    //     }
    //   ],
    //   "createdAt": "2024-09-16T00:38:54.000Z",
    //   "updatedAt": "2024-09-16T00:38:54.000Z"
    // }
    //
    // // @ts-ignore
    // Protocol.create(targetData2);
    // // @ts-ignore
    // Protocol.create(targetData3)
    return
  }
}

export default new ProtocolService()
