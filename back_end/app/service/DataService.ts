import DataModel, {IData} from "../model/Data.model";
import {Op} from "sequelize";

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
        name,
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

  async deleteData(belongId: number, name: string, time: number, value:number) {
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
        belongId
      }
    });
    return result
  }
}

export default new DataService()


