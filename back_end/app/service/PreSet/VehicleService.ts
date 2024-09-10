// vehicle.service.ts

import Vehicle, {IVehicleModel} from "../../model/PreSet/Vehicle.model";

class VehicleService {
    async createVehicle(vehicle: IVehicleModel): Promise<Vehicle> {
        return Vehicle.create(vehicle);
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
}

export default new VehicleService;
