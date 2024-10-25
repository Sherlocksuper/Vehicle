import { Sequelize } from "sequelize-typescript";
import DataModel, { IData } from "../model/Data.model";
import DataService from "../service/DataService";

process.on('message', async (data: IData[]) => {
  // 初始化 Sequelize 实例
  const sequelize = new Sequelize({
    dialect: 'mysql',    // 数据库类型
    host: 'localhost',   // 数据库地址
    username: 'root',    // 数据库用户名
    password: 'root',// 数据库密码
    database: 'vehicle' // 数据库名称
  });

  // 手动注册模型
  sequelize.addModels([DataModel]);

  try {
    // 确保数据库同步
    await sequelize.sync();

    // 调用 DataService 的 addData 方法
    await DataService.addData(data);

    // 向主进程发送成功消息
    // @ts-ignore
    process.send('success');
  } catch (error) {
    // 向主进程发送错误消息并打印错误
    // @ts-ignore
    process.send('error');
    console.error(error);
  } finally {
    // 关闭 Sequelize 连接
    await sequelize.close();
  }
});
