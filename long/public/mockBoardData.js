// 改进后的generateHistoryData函数
export function generateHistoryData(testProcess, minInterval, maxInterval, onReceiveData) {
  // 初始化 IHistory 对象
  const history = {
    historyName: testProcess.testName,
    configName: testProcess.template.name,
    startTime: Date.now(),
    endTime: 0,
    template: testProcess.template,
    historyData: [],
  };

  let hasStart = false
  let timers = [];  // 使用多个定时器以支持每个 templateItem 独立的时间间隔

  // 提取所有的 ISignalsConfigItem
  const signalItems = [];

  testProcess.testObjectNs.forEach((testObject) => {
    testObject.project.forEach((proj) => {
      proj.projectConfig.forEach((config) => {
        if (config.signal) {
          signalItems.push(config.signal);
        }
      });
    });
  });

  // 根据 template 创建 initial historyData
  history.historyData = testProcess.template.itemsConfig.map((templateItem) => ({
    templateItemId: templateItem.id.toString(),
    data: [],
  }));

  // 定义生成随机数的函数（可根据需要调整生成逻辑）
  const generateRandomValue = () => Math.random() * 100;

  // 定义随机时间间隔生成数据的函数
  const start = () => {
    if (hasStart) return;
    hasStart = true

    const createData = () => {
      const timestamp = Date.now();

      const historyItemData = {
        xAxis: timestamp,
        data: {},
      };

      signalItems.forEach((signal) => {
        historyItemData.data[signal.id] = generateRandomValue();
      });

      if (onReceiveData) {
        onReceiveData(historyItemData)
      }

      console.log(`在 ${new Date(timestamp).toLocaleString()} 生成了一条数据`);

      const nextInterval = Math.random() * (maxInterval - minInterval) + minInterval;
      timers.push(setTimeout(createData, 2000));
    };

    // 初始化时立即生成一条数据
    createData();
  };

  // 停止生成数据
  const stop = () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers = [];
    hasStart = false
    history.endTime = Date.now();
    console.log(`数据采集已停止，结束时间：${new Date(history.endTime).toLocaleString()}`);
  };

  // 获取当前的 history 数据
  const getHistory = () => history;

  return {start, stop, getHistory};
}
