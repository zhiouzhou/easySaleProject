const state={
  couponType:false,//优惠券类型
  couponState:'0',//优惠券状态
  couponDetailList:[],
  itemType:``,

  selectActDate: ``,//活动日期
  selectLimitDate: ``,//优惠券有效日期
  couponActivityBeginTime: '',//优惠券活动开始时间
  couponActivityEndTime: '',	//优惠券活动结束时间
  couponBeginTime: '',//优惠券生效时间
  couponEndTime: '',//优惠券失效时间
  couponTotalNum: '',//优惠券发放数量总数
  discountAmount: '',//	优惠金额
  productName: '',//使用定向产品的产品名称
  requireOrderAmount: '',//最低下单金额
};

const getters = {

};

const mutations = {
  //保存优惠券类型
  setCouponType(state,couponType){
    state.couponType=couponType;
  },
  //保存优惠券状态
  setCouponState(state,couponState){
    state.couponState=couponState;
  },
  setCouponDetailList(state,list){
    state.couponDetailList=list;
  },
  setItemType(state,itemType){
    state.itemType=itemType;
  },
  //保存优惠券信息
  setSelectActDate(state,selectActDate){
    state.selectActDate=selectActDate;
  },
  setSelectLimitDate(state,selectLimitDate){
    state.selectLimitDate=selectLimitDate;
  },
  setCouponActivityBeginTime(state,couponActivityBeginTime){
    state.couponActivityBeginTime=couponActivityBeginTime;
  },
  setCouponActivityEndTime(state,couponActivityEndTime){
    state.couponActivityEndTime=couponActivityEndTime;
  },
  setCouponBeginTime(state,couponBeginTime){
    state.couponBeginTime=couponBeginTime;
  },
  setCouponEndTime(state,couponEndTime){
    state.couponEndTime=couponEndTime;
  },
  setCouponTotalNum(state,couponTotalNum){
    state.couponTotalNum=couponTotalNum;
  },
  setDiscountAmount(state,discountAmount){
    state.discountAmount=discountAmount;
  },
  setRequireOrderAmount(state,requireOrderAmount){
    state.requireOrderAmount=requireOrderAmount;
  },
  //清空
  setClearMessage(state){
    state.selectActDate='';
    state.selectLimitDate='';
    state.couponActivityBeginTime='';
    state.couponActivityEndTime='';
    state.couponBeginTime='';
    state.couponEndTime='';
    state.couponTotalNum='';
    state.discountAmount='';
    state.requireOrderAmount='';
    state.itemType='';
  }

};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
