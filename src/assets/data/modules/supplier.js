import userAPIs from "@/assets/models/userAPIs";

let fakeSupplierList = [
  {supplierId: 1, supplierName: `易酒批1号酒厂`, contact: `王庭1`, mobileNo: `18983775631`, address: `西藏自治区拉萨市城关区扎西街道`},
  {supplierId: 2, supplierName: `易酒批2号酒厂`, contact: `王庭2`, mobileNo: `18983775632`, address: `西藏自治区拉萨市城关区扎西街道`},
  {supplierId: 3, supplierName: `易酒批3号酒厂`, contact: `王庭3`, mobileNo: `18983775633`, address: `西藏自治区拉萨市城关区扎西街道`},
  {supplierId: 4, supplierName: `易酒批4号酒厂`, contact: `王庭4`, mobileNo: `18983775634`, address: `西藏自治区拉萨市城关区扎西街道`},
  {supplierId: 5, supplierName: `易酒批5号酒厂`, contact: `王庭5`, mobileNo: `18983775635`, address: `西藏自治区拉萨市城关区扎西街道`},
  {supplierId: 6, supplierName: `易酒批6号酒厂`, contact: `王庭6`, mobileNo: `18983775636`, address: `西藏自治区拉萨市城关区扎西街道`}
]


const state = {
  supplierList: []
};

const getters = {};

const mutations = {
  setSupplierList(state, {supplierList}) {
    state.supplierList = supplierList
  },
};

const actions = {
  getSupplierList({commit, state}) {
    if (!state.supplierList || !state.supplierList.length) {
      //网络请求拿到supplierList
      //.....
      commit(`setSupplierList`, {supplierList: fakeSupplierList})
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
