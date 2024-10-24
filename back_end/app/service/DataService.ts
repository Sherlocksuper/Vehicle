import DataModel, {IData} from "../model/Data.model";
import {Op} from "sequelize";
import User from "../model/User.model";
import {getReplayWorker} from "../worker";

//worker_threads

class DataService {
  async addData(dataGroup: IData[]) {
    // Add data to the database
    const result = await DataModel.bulkCreate(dataGroup);
    return result
  }

  async getTargetData(belongId: string,
                      name: string,
                      startTime: number,
                      endTime: number,
                      minValue: number,
                      maxValue: number) {
    return await DataModel.findAll({
      where: {
        belongId,
        name :{
          [Op.like]: `%${name}%`
        },
        time: {
          [Op.gte]: startTime,
          [Op.lte]: endTime
        },
        value: {
          [Op.gte]: minValue,
          [Op.lte]: maxValue
        }
      }
    })
  }

  async getDataMaxMinMiddle(belongId: string) {
    if (!DataModel.sequelize) {
      throw new Error("Sequelize instance is not initialized");
    }

    // 获取不同信号的最大值，最小值，平均值
    return await DataModel.findAll({
      attributes: ['name', [DataModel.sequelize.fn('max', DataModel.sequelize.col('value')), 'max'],
        [DataModel.sequelize.fn('min', DataModel.sequelize.col('value')), 'min'],
        [DataModel.sequelize.fn('avg', DataModel.sequelize.col('value')), 'middle']],
      where: {
        belongId
      },
      group: 'name'
    })
  }

  async getDataWithScope(belongId: number, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    return await DataModel.findAll({
      where: {
        belongId
      },
      offset: offset,
      limit: limit
    });
  }

  async getDataWithTimeScope(belongId: number, startTime: number, endTime: number) {

  }

  async updateData(configName: string, name: string, time: number, value: number) {
    const result = await DataModel.update({value}, {
      where: {
        configName,
        name,
        time
      }
    });
    return result
  }

  async deleteData(belongId: number, name: string, time: number, value: number) {
    const result = await DataModel.destroy({
      where: {
        belongId,
        name,
        time,
        value,
      }
    });
    return result
  }

  async deleteDataByBelongId(belongId: number) {
    const result = await DataModel.destroy({
      where: {
        belongId: belongId
      }
    });
    return result
  }

  async getSampledDataForSignals(signalIds: number[], startTime: Date, endTime: Date, limit: number) {
    const result: { [key: number]: any[] } = {};

    for (const signalId of signalIds) {
      // 第一步：查询当前 signalId 符合条件的数据条数
      const totalCount = await DataModel.count({
        where: {
          signalId: signalId,
          createdAt: {
            [Op.between]: [startTime, endTime]
          }
        }
      });

      // 如果数据小于等于1000条，直接返回所有数据
      if (totalCount <= limit) {
        result[signalId] = await DataModel.findAll({
          where: {
            signalId: signalId,
            createdAt: {
              [Op.between]: [startTime, endTime]
            }
          }
        });
      } else {
        // 第二步：数据量大于1000条，计算步长，并按步长取样
        const step = Math.ceil(totalCount / limit);
        const sampledData = [];

        // 使用 OFFSET 和 LIMIT 按步长获取数据
        for (let i = 0; i < totalCount; i += step) {
          const data = await DataModel.findAll({
            where: {
              signalId: signalId,
              createdAt: {
                [Op.between]: [startTime, endTime]
              }
            },
            offset: i,
            limit: 1  // 每次获取一条数据
          });
          sampledData.push(...data);
        }
        result[signalId] = sampledData;
      }
    }

    return result;
  }
}

export default new DataService()


