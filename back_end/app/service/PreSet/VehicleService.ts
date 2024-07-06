// vehicle.service.ts

import Vehicle, {IVehicleModel} from "../../model/PreSet/Vehicle.model";

class VehicleService {
    async createVehicle(vehicleName: string): Promise<Vehicle> {
        return Vehicle.create({
            vehicleName: vehicleName,
            isDisabled: false
        });
    }

    async getVehicles(): Promise<Vehicle[]> {
        return Vehicle.findAll();
    }

    async getVehicleById(id: number): Promise<Vehicle | null> {
        return Vehicle.findByPk(id);
    }

    async updateVehicle(id: number, newVehicle: IVehicleModel): Promise<Vehicle | null> {
        const vehicle = await Vehicle.findByPk(id);
        if (vehicle) {
            vehicle.vehicleName = newVehicle.vehicleName;
            vehicle.isDisabled = newVehicle.isDisabled
            await vehicle.save();
            return vehicle;
        }
        return null;
    }

    async deleteVehicle(id: number): Promise<number> {
        const vehicle = await Vehicle.findByPk(id);
        if (vehicle) {
            await vehicle.destroy();
            return vehicle.id;
        }
        return 0;
    }


    //初始化车辆
    async initVehicle(num: number) {
        for (let i = 0; i < num; i++) {
            const name = `测试车辆车辆${i}`
            const vehicle = await Vehicle.findOne({
                where: {
                    vehicleName: name
                }
            });
            if (!vehicle) {
                await Vehicle.create({
                    vehicleName: name,
                    isDisabled: false
                });
            }
        }

    }

}

export default new VehicleService;
