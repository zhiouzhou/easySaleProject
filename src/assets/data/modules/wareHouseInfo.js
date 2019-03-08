import userAPIs from "@/assets/models/userAPIs";

const state={
  wareHouseInfoList:[{
    id:'0',
    shopNo: "易酒批武汉1号仓",
    type:'12',//自有
    name: "王婷",
    phone: "18983775638",
    local: "西藏自治区拉萨市城关区扎西街道"
  },{
    id:'1',
    shopNo: "易酒批武汉2号仓",
    type:'13',//托管
    local: "西藏自治区拉萨市城关区扎西街道"
  }]
}

const getters = {
  getInfoList:state =>{
    return  state.wareHouseInfoList
  },

  warehouseList: (state) => (id) => {
    return state.wareHouseInfoList.find(item => item.id == id)
  }
}

const mutations = {
  // updateAllListInfo(state,infoList){
  //   state.wareHouseInfoList=infoList
  // },
  add(state, warehouse) {
    if (!warehouse.id) {
      warehouse.id = state.wareHouseInfoList.length +1+"";
      state.wareHouseInfoList.push(warehouse);
    } else {
      let index = state.wareHouseInfoList.findIndex(item => item.id == warehouse.id);
      if (index >= 0 ) {
        state.wareHouseInfoList[index] = warehouse;
      }
    }
  },
  // add(state, warehouse) {
  //   warehouse.id = state.wareHouseInfoList.length +1+"";
  //   state.wareHouseInfoList.push(warehouse);
  // },
  // updateItemInfo(state,id,item){
  //   let index= state.wareHouseInfoList.findIndex(obj=>obj.id==id)
  //    state.wareHouseInfoList[index]=item
  // }
  update(state, storeInfo) {
    state.wareHouseInfoList.forEach((item) =>  {
      if (item.id == storeInfo.id) {
        item = storeInfo;
      }
    })
  },

};

const actions = {
  changeList(context,list){
      context.commit('updateAllListInfo',list)
    },
  updateWarehouse(ctx, storeInfo) {
    storeInfo && ctx.commit('update', storeInfo);
  },
  addWarehouse(ctx, newhouse) {
    newhouse && ctx.commit('add',newhouse);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
