const state = {
  product: null,
  requiredNumber: null,  //需要购买数量
};
const getters = {};
const mutations = {
  changeProduct(state, {products}) {
    state.product = products[0]
  },
  setRequiredNumber(state,requiredNumber){
    state.requiredNumber = requiredNumber
  }

};
const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
