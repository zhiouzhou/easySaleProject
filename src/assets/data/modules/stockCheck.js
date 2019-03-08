import http from "@/assets/models/stockAPIs";
import Vue from 'vue'

/**
 * 库存盘点单列表
 * @type {{dateTypeList: {dateTypeId: string, dateTypeName: string}[], currentDateTypeId: string, orderList: Array, pageNum: number, pageSize: number, pager: {}, selectDate: string[]}}
 */
const state = {
  dateTypeList: [
    {dateTypeId: `0`, dateTypeName: `本月`},
    {dateTypeId: `1`, dateTypeName: `时间段`}
  ],
  currentDateTypeId: `0`,
  orderList: [],
  pageNum: 1,
  pageSize: 8,
  pager: {},
  //选中的日期,传入两个日期，第一个为开始日期，第二个为结束时间
  selectDate: [``, ``]
};

const getters = {};

const mutations = {
  setCurrentDateTypeId(state, {id}) {
    state.currentDateTypeId = id
  },
  setSelectDate(state, {date}) {
    state.selectDate = date
  },
  setOrderList(state, {list}) {
    state.orderList = list
  },
  setPageNum(state, {num}) {
    state.pageNum = num
  },
  setPager(state, {pager}) {
    state.pager = pager
  }
};

const actions = {
  getStockCheckList({commit, state}, params) {
    if (state.pager.totalPage && (state.pageNum > state.pager.totalPage)) return
    return http.getStockCheckList(params)
      .then(data => {
        let orderList = data.data.dataList || []
        let pager = data.data.pager || {}
        commit(`setPager`, {pager})
        if (state.pageNum === 1) {
          commit(`setOrderList`, {list: orderList})
        } else {
          commit(`setOrderList`, {list: state.orderList.concat(orderList)})
        }
      })
      .catch(e => {
        Vue.$toast({message: e})
      })
  }
};


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}


