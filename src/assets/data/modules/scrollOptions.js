/**
 * 默认的scroll配置
 * @type {{defaultOptions: {scrollbar: {fade: boolean}, pullDownRefresh: {txt: string, stopTime: number}, pullUpLoad: {}}}}
 */
const state = {
  defaultOptions: {
    scrollbar: {
      fade: true
    },
    pullDownRefresh: {
      txt: `刷新成功`, stopTime: 2000
    },
    pullUpLoad: {
      // txt: {more: '加载更多', noMore: '没有更多数据了~'}
    }
  }
};

const getters = {};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
