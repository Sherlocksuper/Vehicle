import CollectUnit, {ICollectUnitModel} from "../model/CollectUnit.model";

export default class CollectUnitService {
  async addCollectUnit(collectUnit: ICollectUnitModel) {
    try {
      return await CollectUnit.create(collectUnit)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async deleteCollectUnit(id: number) {
    try {
      return await CollectUnit.destroy({where: {id}})
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async updateCollectUnit(collectUnit: ICollectUnitModel) {
    try {
      return await CollectUnit.update(collectUnit, {where: {id: collectUnit.id}})
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getCollectUnits() {
    try {
      return await CollectUnit.findAll()
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
