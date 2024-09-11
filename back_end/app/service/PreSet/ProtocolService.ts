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
        if (protocol) {
            protocol.protocolName = newProtocol.protocolName;
            protocol.protocolType = newProtocol.protocolType;
            protocol.signals = newProtocol.signals;
            await protocol.save();
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
}

export default new ProtocolService()
