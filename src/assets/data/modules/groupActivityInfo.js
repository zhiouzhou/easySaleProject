const state = {
  groupProductInfo:{}
};
const getters = {};
const mutations = {
  setProductInfo(state,productInfo){
    state.groupProductInfo = productInfo
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
