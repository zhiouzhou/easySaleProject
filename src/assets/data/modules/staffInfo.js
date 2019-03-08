import userAPIs from "@/assets/models/userAPIs";

const state={
  staffList: [{
    id: '1',
    name: '张清',
    role: '经纪人',  //11经纪人 12 配送员 13管理员
    telephone: '15698569874',
    stateType:true, //true启用 false停用
    psd:'123644',
  }, {
    id: '2',
    name: '王天名',
    role: '配送员',
    telephone: '15698569874',
    stateType:false,
    psd:'123634',
  }, {
    id: '3',
    name: '张天名',
    role: '管理员',
    telephone: '15698569874',
    stateType:true,
    psd:'124644',
  }]
}

const getters = {
  getStaffList:state =>{
    return  state.staffList
  },
  staffInfoList: (state) => (id) => {
    return state.staffList.find(item => item.id == id)
  },
  getAgentList:state =>{
    return state.staffList.filter(item=>item.role=='经纪人')
  }
}

const mutations = {

  add(state, staff) {
    staff.id = state.staffList.length +1+"";
    state.staffList.push(staff);
  },

  toggleStaffInfo(state,id){
      let index= state.staffList.findIndex(item=>item.id==id)
       state.staffList[index].stateType=!state.staffList[index].stateType
    }

};

const actions = {

  addStaff(ctx, newstaff) {
    newstaff && ctx.commit('add',newstaff);
  },
  toggleStaffInfo({commit},id){
    commit('toggleStaffInfo',id)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
