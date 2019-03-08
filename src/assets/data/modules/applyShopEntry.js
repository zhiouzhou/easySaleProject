/**
 * 经销商入驻
 */
const state = {
  dealerDetail: {},
  shopDetail: {}
};

const getters = {};

const mutations = {
  setDealerDetail(state, detail) {
    state.dealerDetail = detail
  },
  setShopDetail(state, detail) {
    state.shopDetail = detail
  },

};

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
