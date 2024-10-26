import DataModel, {IData} from "../model/Data.model";
import Sequelize, {Op} from "sequelize";
import HistoryService from "./HistoryService";

//worker_threads

class DataService {
  async addData(dataGroup: IData[]) {
    // Add data to the database
    const result = await DataModel.bulkCreate(dataGroup,
      // 不插入重复的数据
      {
        ignoreDuplicates: true,
        logging: false
      });
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
        name: {
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

  async updateData(id: string, value: number) {
    const result = await DataModel.update({value}, {
      where: {
        id
      }
    });
    return result
  }

  async deleteData(targetData: string[]) {
    for (const id of targetData) {
      await DataModel.destroy({
        where: {
          id: id
        }
      });
    }
    return true
  }

  async deleteDataByBelongId(belongId: number) {
    const result = await DataModel.destroy({
      where: {
        belongId: belongId
      }
    });
    return result
  }

  async getSampledDataForSignals(belongId: number, startTime: Date, endTime: Date, limit: number = 1000) {
    const history = await HistoryService.getHistoryById(belongId);
    if (!history) {
      return [];
    }

    // 获取所有 signalId
    const signalIds: string[] = [];
    history.testConfig?.configs.forEach((config) => {
      config.projects.forEach((project) => {
        project.indicators.forEach((indicator) => {
          signalIds.push(indicator.signal.id);
        });
      });
    });

    const validSignalIds = signalIds.filter(signalId => signalId !== undefined);

    // 使用 group by 查询每个 signalId 的数据量
    const counts = await DataModel.findAll({
      attributes: ['signalId', [Sequelize.fn('COUNT', Sequelize.col('signalId')), 'totalCount']],
      where: {
        signalId: {
          [Op.in]: validSignalIds
        },
        time: {
          [Op.between]: [startTime, endTime]
        }
      },
      group: ['signalId']
    });

    const result: { [key: string]: any[] } = {};

    for (const countEntry of counts) {
      // @ts-ignore
      const {signalId, totalCount} = countEntry.get();
      console.log(signalId)
      if (totalCount <= limit) {
        const allData = await DataModel.findAll({
          attributes: ['time', 'value'],
          where: {
            signalId: signalId,
            time: {
              [Op.between]: [startTime, endTime]
            }
          }
        });
        result[signalId] = allData;
      } else {
        const step = Math.ceil(totalCount / limit);
        const sampledData = [];

        for (let i = 0; i < totalCount; i += step) {
          const data = await DataModel.findAll({
            attributes: ['time', 'value'],
            where: {
              signalId: signalId,
              time: {
                [Op.between]: [startTime, endTime]
              }
            },
            offset: i,
            limit: 1  // 每步获取一条数据
          });

          if (data.length > 0) {
            sampledData.push(data[0]);
          }
        }
        result[signalId] = sampledData;
      }
    }

    return result;
  }
}

export default new DataService()


