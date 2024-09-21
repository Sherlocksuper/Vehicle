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
      await vehicle.update(newVehicle);

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
    const targetData3 = {
      "id": 7,
      "vehicleName": "车辆test",
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
            "id": 6,
            "createdAt": "2024-09-16T00:36:34.000Z",
            "updatedAt": "2024-09-16T00:36:34.000Z",
            "baseConfig": {
              "baudRate": "800"
            },
            "protocolName": "CAN-1",
            "protocolType": "CAN",
            "signalsParsingConfig": [
              {
                "frameId": "1",
                "signals": [
                  {
                    "id": "63c7df50-3598-4645-bc55-221c1f73ac87",
                    "name": "速度",
                    "slope": "3",
                    "length": "2",
                    "offset": "4",
                    "dimension": "km/h",
                    "startPoint": "1"
                  },
                  {
                    "id": "db06679c-e84e-43b1-888f-1d07fd64e878",
                    "name": "里程",
                    "slope": "7",
                    "length": "6",
                    "offset": "8",
                    "dimension": "km",
                    "startPoint": "5"
                  },
                  {
                    "id": "f2ad17c7-e374-43bf-a7c7-6038baac3837",
                    "name": "电压",
                    "slope": "11",
                    "length": "10",
                    "offset": "12",
                    "dimension": "V",
                    "startPoint": "9"
                  }
                ],
                "frameNumber": "1"
              },
              {
                "frameId": "2",
                "signals": [
                  {
                    "id": "eabe53ec-d764-48d2-99dc-e97e1d7da858",
                    "name": "速度-2",
                    "slope": "15",
                    "length": "14",
                    "offset": "16",
                    "dimension": "km/h",
                    "startPoint": "13"
                  },
                  {
                    "id": "b213b031-c45a-4ce9-a99e-5c822aea418d",
                    "name": "里程-2",
                    "slope": "19",
                    "length": "18",
                    "offset": "20",
                    "dimension": "km.h",
                    "startPoint": "17"
                  }
                ],
                "frameNumber": "2"
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
            "id": 7,
            "createdAt": "2024-09-16T00:38:54.000Z",
            "updatedAt": "2024-09-16T00:38:54.000Z",
            "baseConfig": {
              "setAsSyncNode": "8",
              "dynamicSlotCount": "6",
              "staticSlotsCount": "5",
              "dynamicSlotLength": "7",
              "macroticksPerCycle": "2",
              "microticksPerCycle": "1",
              "staticFramepayload": "4",
              "transmissionStartTime": "3"
            },
            "protocolName": "Flexray-1",
            "protocolType": "FlexRay",
            "signalsParsingConfig": [
              {
                "frameId": "0",
                "signals": [
                  {
                    "id": "1d413c9c-f14f-473b-bb97-6ac6fb450e2c",
                    "name": "速度",
                    "slope": "3",
                    "length": "2",
                    "offset": "4",
                    "dimension": "km/h",
                    "startPoint": "1"
                  },
                  {
                    "id": "5c362f0a-45d5-476a-b632-14e0e8f89c72",
                    "name": "里程",
                    "slope": "7",
                    "length": "6",
                    "offset": "8",
                    "dimension": "km",
                    "startPoint": "5"
                  },
                  {
                    "id": "82091432-d1c3-4f36-81af-7fb07c3d81ee",
                    "name": "电压",
                    "slope": "11",
                    "length": "10",
                    "offset": "12",
                    "dimension": "V",
                    "startPoint": "9"
                  }
                ],
                "cycleNumber": "0",
                "frameNumber": "0"
              },
              {
                "frameId": "1",
                "signals": [
                  {
                    "id": "9e1089aa-2c24-4cf6-b306-53c5c542e3ec",
                    "name": "速度-2",
                    "slope": "15",
                    "length": "14",
                    "offset": "16",
                    "dimension": "km/h",
                    "startPoint": "13"
                  },
                  {
                    "id": "8d67e3b8-22f6-41ca-ad15-f257185991e7",
                    "name": "里程-2",
                    "slope": "19",
                    "length": "18",
                    "offset": "20",
                    "dimension": "km",
                    "startPoint": "17"
                  }
                ],
                "cycleNumber": "1",
                "frameNumber": "1"
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
      "createdAt": "2024-09-16T00:40:09.000Z",
      "updatedAt": "2024-09-16T00:40:09.000Z"
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

    vehicle = await Vehicle.findByPk(targetData3.id);
    if (vehicle) {
      return vehicle;
    }

    // @ts-ignore
    Vehicle.create(targetData3);

    return null;
  }
}

export default new VehicleService;
