import http from "@/assets/models/stockAPIs";

/**
 * 出入库
 * @type {{inOrder: {product: null, warehouse: null, bigUnitNum: number, smallUnitNum: number}, outOrder: {product: null, warehouse: null, bigUnitNum: number, smallUnitNum: number}}}
 */
const state = {
  inOrder: {
    product: null,
    warehouse: null,
    bigUnitNum: 0,
    smallUnitNum: 0,
  },
  outOrder: {
    product: null,
    warehouse: null,
    bigUnitNum: 0,
    smallUnitNum: 0,
  },
};

const getters = {};

const mutations = {
  changeUnitNum(state, {unitId, value, isInBound}) {
    if (isInBound) {
      state.inOrder[unitId] = value
    } else {
      state.outOrder[unitId] = value
    }
  },
  changeProduct(state, {products, isInBound}) {
    if (isInBound) {
      state.inOrder.product = products[0]
    } else {
      state.outOrder.product = products[0]
    }
  },
  changeWarehouse(state, {warehouse, isInBound}) {
    if (isInBound) {
      state.inOrder.warehouse = warehouse
    } else {
      state.outOrder.warehouse = warehouse
    }
  },
  cleanOrder(state, {isInBound}) {
    if (isInBound) {
      state.inOrder = {
        product: null,
        warehouse: null,
        bigUnitNum: 0,
        smallUnitNum: 0,
      }
    } else {
      state.outOrder = {
        product: null,
        warehouse: null,
        bigUnitNum: 0,
        smallUnitNum: 0,
      }
    }
  },
  cleanOrderExceptWarehouse(state, {isInBound}) {
    if (isInBound) {
      state.inOrder.product = null
      state.inOrder.bigUnitNum = 0
      state.inOrder.smallUnitNum = 0
    } else {
      state.outOrder.product = null
      state.outOrder.bigUnitNum = 0
      state.outOrder.smallUnitNum = 0
    }
  },
};

const actions = {
  addInOutBoundOrder({state, commit}, {params, isInBound}) {
    return Promise.resolve()
      .then(() => {
        if (isInBound) {
          return http.addInBoundOrder(params)
        } else {
          return http.addOutBoundOrder(params)
        }
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
