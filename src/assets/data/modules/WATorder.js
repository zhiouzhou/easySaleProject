import http from '@/assets/models/warehouseAndTransferAPIs';

/**
 * 仓配服务 新建出入库，委托配送单据
 * @type {{inBound: {warehouse: null, productList: null, time: string, useService: boolean}, outBound: {warehouse: null, productList: null, person: {id: string, name: string, mobileNo: string, address: string}, time: string, useService: boolean}, applyDelivery: {warehouse: null, productList: null, person: {id: string, name: string, mobileNo: string, address: string}, useService: boolean}, orderPayResult: null}}
 */

const state = {
  facilitatorWarehouseList: [],
  facilitatorList: [],
  currentFacilitatorId: ``,
  // currentWarehouseId: ``,
  orderPayResult: null,
  inBound: {
    warehouse: null,
    productList: null,
    time: ``,
    useService: false
  },
  outBound: {
    warehouse: null,
    productList: null,
    person: null,
    time: ``,
    useService: false
  },
  applyDelivery: {
    warehouse: null,
    productList: null,
    person: null,
    useService: false
  }
};

const getters = {
  warehouseList(state) {
    return state.facilitatorWarehouseList.filter(item => item.facilitatorId === state.currentFacilitatorId)
  }
};

const mutations = {
  setWarehouseList(state, {facilitatorWarehouseList}) {
    state.facilitatorWarehouseList = facilitatorWarehouseList
  },
  setCurrentFacilitatorId(state, {id}) {
    state.currentFacilitatorId = id
  },
  setFacilitatorList(state, {facilitatorList}) {
    state.facilitatorList = facilitatorList
  },
  setWarehouse(state, {type, warehouse}) {
    state[type].warehouse = warehouse
  },
  setProductList(state, {type, productList}) {
    state[type].productList = productList
  },
  setPerson(state, {type, person}) {
    state[type].person = person
  },
  setTime(state, {type, time}) {
    state[type].time = time
  },
  setUseService(state, {type, useService}) {
    state[type].useService = useService
  },
  cleanSingleOrderStorage(state, type) {
    state[type].warehouse = null
    state[type].productList = null
    if (type !== `inBound`) {
      state[type].person = null
    }
    if (type !== `applyDelivery`) {
      state[type].time = ``
    }
    state[type].useService = false
  },
  cleanWATOrderStorage(state) {
    mutations.cleanSingleOrderStorage(state, `inBound`)
    mutations.cleanSingleOrderStorage(state, `outBound`)
    mutations.cleanSingleOrderStorage(state, `applyDelivery`)
  },
  setOrderPayResult(state, result) {
    state.orderPayResult = result
  },
  cleanOrderPayResult() {
    state.orderPayResult = null
  }
};

const actions = {
  getFacilitatorWarehouseList({commit, state}, params) {
    return http.getFacilitatorWarehouse(params)
      .then(data => {
        let warehouseList = data.data || []
        let facilitatorArr = []
        warehouseList.forEach(item => {
          if (facilitatorArr.findIndex(facilitator => facilitator.facilitatorId === item.facilitatorId) === -1) {
            facilitatorArr.push({facilitatorId: item.facilitatorId, facilitatorName: item.facilitatorName})
          }
        })
        commit(`setCurrentFacilitatorId`, {id: warehouseList.length && warehouseList[0].facilitatorId})
        commit(`setFacilitatorList`, {facilitatorList: facilitatorArr})
        commit(`setWarehouseList`, {facilitatorWarehouseList: warehouseList})
      })
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
