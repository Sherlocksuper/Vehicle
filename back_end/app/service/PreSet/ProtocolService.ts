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
    const targetData = {
      "id": 1,
      "protocolName": "CAN-1",
      "protocolType": "CAN",
      "baseConfig": {
        "baudRate": "800"
      },
      "signalsParsingConfig": [
        {
          "frameNumber": "aa",
          "frameId": "aa",
          "signals": [
            {
              "name": "aa",
              "dimension": "aa",
              "startPoint": "aa",
              "length": "aa",
              "slope": "aa",
              "offset": "aa"
            }
          ]
        }
      ],
      "updatedAt": "2024-09-13T14:04:24.706Z",
      "createdAt": "2024-09-13T14:04:24.706Z"
    }

    const protocol = await Protocol.findByPk(targetData.id);
    if (protocol) {
      return protocol;
    }

    // @ts-ignore
    await Protocol.create(targetData);
  }
}

export default new ProtocolService()
