/**
 * 配送员
 */
const state = {
  deliveryUser: null
};

const getters = {};

const mutations = {
  setDeliveryUser(state, user) {
    state.deliveryUser = user
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
