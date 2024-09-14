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

  async initVehicleData() {
    const targetData = {
      "id": 1,
      "vehicleName": "车辆1",
      "isDisabled": false,
      "protocols": [
        {
          "core": {
            "id": 1,
            "userId": null,
            "isDisabled": false,
            "controllerName": "hx-04A-1",
            "controllerAddress": "192.168.0.101"
          },
          "protocol": {
            "id": 1,
            "createdAt": "2024-09-13T14:04:24.000Z",
            "updatedAt": "2024-09-13T14:04:24.000Z",
            "baseConfig": {
              "baudRate": "800"
            },
            "protocolName": "CAN-1",
            "protocolType": "CAN",
            "signalsParsingConfig": [
              {
                "frameId": "aa",
                "signals": [
                  {
                    "name": "aa",
                    "slope": "aa",
                    "length": "aa",
                    "offset": "aa",
                    "dimension": "aa",
                    "startPoint": "aa"
                  }
                ],
                "frameNumber": "aa"
              }
            ]
          },
          "collector": {
            "id": 1,
            "userId": null,
            "isDisabled": false,
            "collectorName": "zx-04A-1",
            "collectorAddress": "1"
          }
        }
      ],
      "createdAt": "2024-09-13T14:07:11.000Z",
      "updatedAt": "2024-09-13T14:07:11.000Z"
    }
    const vehicle = await Vehicle.findByPk(targetData.id);
    if (vehicle) {
      return vehicle;
    }
    // @ts-ignore
    Vehicle.create(targetData);
    return null;
  }
}

export default new VehicleService;
