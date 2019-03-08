
const state = {
  noticeType:``
};
const mutations = {
  setNoticeType(state,noticeType){
    state.noticeType = noticeType

  },
};
export default {
  namespaced: true,
  state,
  mutations,
}
