export interface IDataHistory {

}
//  // id - []
export const getSignalValue = (arrs: {
  time: number
  data: {
    [key: number]: number
  }
}[]) => {
  const resultMap = new Map<string,number[]>()
  const historyData = new Map<string,number[]>()
  arrs.forEach(item=>{
    //  // 找到最大值放到第0个，最小值放到第1个，平均值第2个
    const keys = Object.keys(item.data)
    keys.forEach(key=>{
      const value = item.data[key]
      const keyResult = resultMap.get(key)
      const historyResult = historyData.get(key)

      if(!keyResult || !historyData) {
        resultMap.set(key,[value,value,value])
        historyData.set(key,[value])
      }
      else{
        if(historyResult){
          if(value > keyResult[0])
            keyResult[0] = value
          if(value < keyResult[1])
            keyResult[1] = value
          historyResult.push(value)
          keyResult[2] = historyResult.reduce((a,c)=>a+c,0) / historyResult.length
          resultMap.set(key,keyResult)
        }
      }

    })
  })
}










//  // id - []
//  const resultMap = new Map<string, number[]>()//前面是键类型，后边是值类型

//  // 找到最大值放到第0个，最小值放到第1个，平均值第2个
//  arrs.forEach(item => {
//    const keys = Object.keys(item.data)//item是一个数组，item.data也是一个数组，keys也是一个数组，
//    keys.forEach((key) => {
//      const value = item.data[key] // number
//      const keyResult = resultMap.get(key) //number[] resultMap键为key对应的值

//      if (!keyResult) {
//        resultMap.set(key, [value, value, 0])
//      } else{
//        if(value > keyResult[0])
//          keyResult[0] = value
//        if(value < keyResult[1])
//          keyResult[1] = value
//        resultMap.set(key,keyResult)
//      }


//    })
//  })