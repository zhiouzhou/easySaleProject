import http from "@/assets/models/stockAPIs";

/**
 * 添加库存盘点单
 * @type {{warehouse: null, shop: null, productList: Array}}
 */

const state = {
  warehouse: null,
  productList: []
};

const getters = {};

const mutations = {
  setWarehouse(state, {warehouse}) {
    state.warehouse = warehouse
  },
  setProductList(state, {products}) {
    state.productList = products
  },
  changeProductNum(state, {index, editId, value}) {
    if (index > state.productList.length - 1 || index === -1) return
    state.productList[index][editId] = value
  },
  clean(state) {
    state.warehouse = null
    state.shop = null
    state.productList = []
  }
};

const actions = {
  addStockCheck({commit, state}, params) {
    return http.addStockCheck(params)
      .then(() => {
        commit(`clean`)
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


