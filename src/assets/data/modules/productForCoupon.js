const state = {
  product: null,
  sourcePage:``
};
const getters = {};
const mutations = {
  changeProduct(state, {products,sourcePage}) {
    state.product = products[0]
    state.sourcePage=sourcePage
  },
  setClearProduct(state){
    state.product=''
  },
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
