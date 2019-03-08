import http from "@/assets/models/stockAPIs";

/**
 * 库存流水详情
 * @type {{productList: Array}}
 */
const state = {
  orderDetail: null,
  productList: []
};

const getters = {};

const mutations = {
  setProductList(state, {list}) {
    state.productList = list
  },
  setOrderDetail(state, {detail}) {
    state.orderDetail = detail
  }
};

const actions = {
  getStockFlowList({commit, state}, params) {
    return http.getStockFlowDetailProductInfo(params)
      .then(data => {
        let productList = data.data.dataList || []
        commit(`setProductList`, {list: productList})
      })

  },
  getStockFlowDetail({commit, state}, params) {
    return http.getStockFlowDetail(params)
      .then(data => {
        commit(`setOrderDetail`, {detail: data.data})
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



