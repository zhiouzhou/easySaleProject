import http from "@/assets/models/stockAPIs";

const state = {
  warehouseList: [],
  currentWarehouseId: ``
};

const getters = {};

const mutations = {
  setWarehouseList(state, {list}) {
    state.warehouseList = list
  },
  setCurrentWarehouseId(state, {id}) {
    state.currentWarehouseId = id
  },
};

const actions = {

  /**
   * 经销商下面的仓库，只返回有过库存记录的仓库
   * @type {{warehouseList: Array, currentWarehouseId: string}}
   */
  getWarehouseListByCity({commit, state}) {
    //调用接口拿到数据
    let params = {pageNum: 1, pageSize: 50}
    return http.getWarehouseList(params)
      .then(res => {
        let warehouseList = res.data.dataList
        if (warehouseList && warehouseList.length) {
          commit(`setWarehouseList`, {list: warehouseList})
          commit(`setCurrentWarehouseId`, {id: warehouseList[0].id})
          //返回调用者想要的数据
          return Promise.resolve(warehouseList)
        }
      })
      .catch(e => {
        return Promise.reject(e)
      })

  },

  /**
   * 经销商下面的仓库，0：全部仓库；1：自有仓库；2：托管仓库
   */
  getWarehouseListByDealer({commit, state}, params) {
    //调用接口拿到数据
    return http.getDealerWarehouse(params)
      .then(res => {
        let warehouseList = res.data||[]
        if (warehouseList && warehouseList.length) {
          commit(`setWarehouseList`, {list: warehouseList})
          commit(`setCurrentWarehouseId`, {id: warehouseList[0].id})
          //返回调用者想要的数据
          return Promise.resolve(warehouseList)
        }
      })
      .catch(e => {
        return Promise.reject(``)
      })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
