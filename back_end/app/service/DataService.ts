import DataModel, {IData} from "../model/Data.model";
import {Op} from "sequelize";
import {sendMessageToFront} from "../ztcp/toFront";
import fs from "fs";
import {formatOneSignal} from "../../utils/File/format";

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
        belongId: belongId
      }
    });
    return result
  }

  // 开始数据回放
  async startDataReplay(belongHistoryId: number) {
    // const pageNum = 1
    // const pageSize = 100_000
    //
    // let writeArr = await this.getDataWithScope(belongHistoryId, pageNum, pageSize);
    // let searchArr: any[] = [];
    // let page = 1;
    //
    // const sendHalfData = async (dataArray: IData[], writeStream: fs.WriteStream) => {
    //   const halfIndex = Math.floor(dataArray.length / 2);
    //   for (let i = 0; i < halfIndex; i++) {
    //
    //   }
    //   return dataArray.slice(halfIndex); // 返回未写入的数据
    // };
    //
    // while (writeArr.length > 0 || searchArr.length > 0) {
    //   // 写入 writeArr 前半部分数据，同时开始并行获取 searchArr
    //   const halfWriteArr = await sendHalfData(writeArr, writeStream);
    //
    //   // 并行获取 searchArr（下一批数据）
    //   const searchPromise = this.getDataWithScope(belongHistoryId, page + 1, pageSize);
    //   page += 1;
    //
    //   // 写入 writeArr 剩下的部分
    //   for (const data of halfWriteArr) {
    //     // TODO 处理后送到前端
    //   }
    //
    //   // 等待 searchArr 数据获取完成
    //   searchArr = await searchPromise;
    //
    //   // 将 writeArr 替换为 searchArr，searchArr 置为空
    //   writeArr = searchArr;
    //   searchArr = [];
    // }
  }
}

export default new DataService()


