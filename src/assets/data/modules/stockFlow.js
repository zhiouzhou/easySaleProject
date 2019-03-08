
import http from "@/assets/models/stockAPIs";

/**
 * 库存流水列表
 * @type {{orderTypeList: {orderTypeId: string, orderTypeName: string}[], currentOrderTypeId: string, dateTypeList: {dateTypeId: string, dateTypeName: string}[], currentDateTypeId: string, orderList: Array, inWarehouseNum: string, outWarehouseNum: string, pageNum: number, pageSize: number, pager: {}, selectDate: string[]}}
 */
const state = {
  orderTypeList: [
    {orderTypeId: `0`, orderTypeName: `全部单据`},
    {orderTypeId: `1`, orderTypeName: `入库记录`},
    {orderTypeId: `2`, orderTypeName: `出库记录`},
    // {orderTypeId: 3, orderTypeName: `销售记录`}
  ],
  currentOrderTypeId: `0`,
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

const getters = {
  filterOrderList: (state) => (keyWord) => {
    if (state.orderList && state.orderList.length) {
      return state.orderList.filter(item => item.noteno.indexOf(keyWord) !== -1)
    } else {
      return []
    }
  }
};

const mutations = {
  setCurrentOrderTypeId(state, {id}) {
    state.currentOrderTypeId = id
  },
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
  },
  // setInWarehouseNum(state, {num}) {
  //   state.inWarehouseNum = num
  // },
  // setOutWarehouseNum(state, {num}) {
  //   state.outWarehouseNum = num
  // },
};

const actions = {
  getStockFlowList({commit, state}, params) {
    if (state.pager.totalPage && (state.pageNum > state.pager.totalPage)) return
    return http.getStockFlowList(params)
      .then(data => {
        let orderList = data.data.dataList || []
        let pager = data.data.pager || {}
        commit(`setPager`, {pager})
        if (state.pageNum === 1) {
          commit(`setOrderList`, {list: orderList})
        } else {
          commit(`setOrderList`, {list: state.orderList.concat(orderList)})
        }
        // let totalNumResult = getTotalNumStr(state.orderList)
        // commit(`setInWarehouseNum`, {num: totalNumResult.inStr})
        // commit(`setOutWarehouseNum`, {num: totalNumResult.outStr})
      })
      .catch(e => {
      })
  }
};

// function getTotalNumStr(orderList) {
//   let inBigNum = 0
//   let inSmallNum = 0
//   let outBigNum = 0
//   let outSmallNum = 0
//   for (let order of orderList) {
//     if (order.type === 1) {
//       inBigNum += order.specificationscount
//       inSmallNum += order.unitcount
//     } else if (order.type === 2) {
//       outBigNum += order.specificationscount
//       outSmallNum += order.unitcount
//     }
//   }
//   let inStr = inBigNum === 0 && inSmallNum === 0 ? `0件` :
//     inBigNum === 0 ? `${inSmallNum}瓶` :
//       inSmallNum === 0 ? `${inBigNum}件` :
//         `${inBigNum}件${inSmallNum}瓶`
//   let outStr = outBigNum === 0 && outSmallNum === 0 ? `0件` :
//     outBigNum === 0 ? `${outSmallNum}瓶` :
//       outSmallNum === 0 ? `${outBigNum}件` :
//         `${outBigNum}件${outSmallNum}瓶`
//   return {inStr, outStr}
// }

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}


