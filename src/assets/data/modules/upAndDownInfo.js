const state = {
  upAndDownState: 2,   //产品状态  0 已下架   2 销售中  3  审核中   4 已拒绝
  proDeliveryType: -1,   //配送方式  -1 -全部  	0-易酒批，1-经销商
}
const getters = {}
const mutations = {
  //保存上下架状态
  setProductState(state, upAndDownState) {
    state.upAndDownState = upAndDownState
  },
  //保存配送方式
  setDeliveryType(state, proDeliveryType) {
    state.proDeliveryType = proDeliveryType
  },
  //点击返回按钮清空状态
  setClearState(state) {
    state.upAndDownState = 2   //产品状态  0 已下架   2 销售中  3  审核中   4 已拒绝
    state.proDeliveryType = -1
  },

}
const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
