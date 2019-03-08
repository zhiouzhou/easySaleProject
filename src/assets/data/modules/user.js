/**
 * 用户登录信息
 * @type {{username: string, password: string, userInfo: {}}}
 */
const state = {
  username: "",
  password: "",
  userInfo: {}
};

const getters = {};

const mutations = {
  setAccountInfo(state, {username, password}) {
    state.username = username
    state.password = password
  },
  setLoginInfo(state, loginInfo) {
    state.userInfo = loginInfo
  },
  changeApplyState(state, applyState) {
    state.userInfo.auditState = applyState
  },
  changeDealerState(state, dealerState) {
    state.userInfo.dealerState = dealerState
  },
  changePassword(state, pwd) {
    state.password = pwd
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
