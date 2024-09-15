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
    const targetData1 = {
      "id": 3,
      "protocolName": "CAN-1",
      "protocolType": "CAN",
      "baseConfig": {
        "baudRate": "800"
      },
      "signalsParsingConfig": [
        {
          "frameId": "aa",
          "signals": [
            {
              "id": "d5ddf1f7-fdaf-4513-8edd-8a993b2663ba",
              "name": "速度",
              "slope": "10",
              "length": "aa",
              "offset": "11",
              "dimension": "km/h",
              "startPoint": "00"
            }
          ],
          "frameNumber": "aa"
        },
        {
          "frameId": "2",
          "signals": [
            {
              "id": "a96a74f2-eddb-41a7-b7a0-0cd8d08c9b59",
              "name": "历程",
              "slope": "45",
              "length": "22",
              "offset": "3+",
              "dimension": "123",
              "startPoint": "11"
            }
          ],
          "frameNumber": "12"
        }
      ],
      "createdAt": "2024-09-14T06:42:58.000Z",
      "updatedAt": "2024-09-14T06:42:58.000Z"
    }
    const targetData2 = {
      "id": 4,
      "protocolName": "CAN-2",
      "protocolType": "CAN",
      "baseConfig": {
        "baudRate": "800"
      },
      "signalsParsingConfig": [
        {
          "frameId": "a4",
          "signals": [
            {
              "id": "380ea76d-c04d-4f24-a9b9-99157d9d3b0a",
              "name": "速度2",
              "slope": "10",
              "length": "aa",
              "offset": "11",
              "dimension": "km/h",
              "startPoint": "00"
            }
          ],
          "frameNumber": "a3"
        },
        {
          "frameId": "24",
          "signals": [
            {
              "id": "214d6c85-d8bb-4606-81f5-c5f6749b058b",
              "name": "历程2",
              "slope": "45",
              "length": "22",
              "offset": "3+",
              "dimension": "123",
              "startPoint": "11"
            }
          ],
          "frameNumber": "124"
        }
      ],
      "createdAt": "2024-09-14T06:43:26.000Z",
      "updatedAt": "2024-09-14T06:43:26.000Z"
    }

    // @ts-ignore

    Protocol.create(targetData1);
    // @ts-ignore
    Protocol.create(targetData2);
    return
  }
}

export default new ProtocolService()
