/**
 * 经销商信息
 */
const state = {
  shopId: ``,
  userId:``,
  shopName: ``,
  userName: ``,
  shopDetail: {}
};

const getters = {};

const mutations = {
  setShopId(state, id) {
    state.shopId = id
  },
  setShopName(state, name) {
    state.shopName = name
  },
  setUserId(state, id) {
    state.userId = id
  },
  setUserName(state, name) {
    state.userName = name
  },

  setShopDetail(state, detail) {
    state.shopDetail = detail
  }
};

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
