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
      "id": 4,
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
            "id": 3,
            "createdAt": "2024-09-14T06:42:58.000Z",
            "updatedAt": "2024-09-14T06:42:58.000Z",
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
            ]
          },
          "collector": {
            "id": 2,
            "userId": null,
            "isDisabled": false,
            "collectorName": "zx-96-1",
            "collectorAddress": "2"
          }
        },
        {
          "core": {
            "id": 2,
            "userId": null,
            "isDisabled": false,
            "controllerName": "hx-96-1",
            "controllerAddress": "192.168.0.102"
          },
          "protocol": {
            "id": 3,
            "createdAt": "2024-09-14T06:42:58.000Z",
            "updatedAt": "2024-09-14T06:42:58.000Z",
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
      "createdAt": "2024-09-14T06:56:04.000Z",
      "updatedAt": "2024-09-14T06:56:04.000Z"
    }
    const targetData2 = {
      "id": 5,
      "vehicleName": "车辆123",
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
            "id": 3,
            "createdAt": "2024-09-14T06:42:58.000Z",
            "updatedAt": "2024-09-14T06:42:58.000Z",
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
            ]
          },
          "collector": {
            "id": 1,
            "userId": null,
            "isDisabled": false,
            "collectorName": "zx-04A-1",
            "collectorAddress": "1"
          }
        },
        {
          "core": {
            "id": 1,
            "userId": null,
            "isDisabled": false,
            "controllerName": "hx-04A-1",
            "controllerAddress": "192.168.0.101"
          },
          "protocol": {
            "id": 4,
            "createdAt": "2024-09-14T06:43:26.000Z",
            "updatedAt": "2024-09-14T06:43:26.000Z",
            "baseConfig": {
              "baudRate": "800"
            },
            "protocolName": "CAN-2",
            "protocolType": "CAN",
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
            ]
          },
          "collector": {
            "id": 2,
            "userId": null,
            "isDisabled": false,
            "collectorName": "zx-96-1",
            "collectorAddress": "2"
          }
        }
      ],
      "createdAt": "2024-09-14T07:03:57.000Z",
      "updatedAt": "2024-09-14T07:03:57.000Z"
    }

    let vehicle = await Vehicle.findByPk(targetData.id);
    if (vehicle) {
      return vehicle;
    }
    // @ts-ignore
    Vehicle.create(targetData);

    vehicle = await Vehicle.findByPk(targetData2.id);
    if (vehicle) {
      return vehicle;
    }

    // @ts-ignore
    Vehicle.create(targetData2);

    return null;
  }
}

export default new VehicleService;
