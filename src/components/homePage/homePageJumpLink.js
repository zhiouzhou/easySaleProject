import router from '../../router/index'
import store from '@/assets/data/index'
import Vue from 'vue'

let jumpLink = id => {
  let isOpenShop = store.state.user.userInfo.auditState === 1
  let isDirectMatch = store.state.user.userInfo.dealerType === 1
  let isAuditState = store.state.user.userInfo.auditState === -1
  let isDealerState = store.state.user.userInfo.dealerState === -1
  let isDealerState_1 = store.state.user.userInfo.dealerState === 0

  //在这里判断，先取shopId。如果取不到就把跳转的逻辑阻断
  if (isDealerState) {
    return new Vue().$confirm('需完善信息才能使用该功能。', '提示', {
      confirmButtonText: '去完善',
      cancelButtonText: '取消',
    }).then(() => {
      router.push({name: `myInformation`, params: {type: `newRegister`}})
    }).catch(() => {

    });
  } else if (isDealerState_1) {
    return Vue.$toast({message: `您的信息还在审核中，暂无法用此功能`})
  }
  if (!isOpenShop && (id === `13` || id === `14` || id === `15` || id === `16` || id === `17`)) {
    return Vue.$toast({message: `该功能需要开启店铺才能使用`})
  }
  if (id === `1`) {//新增商品
    router.push({name: `addCommodity`, query: {comeInType: 'addProduct'}})
  } else if (id === `2`) {//商品列表
    router.push({name: `commodityList`})
  } else if (id === `3`) {//仓库管理
    router.push({name: `warehouse`})
  } else if (id === `4`) {//库存查询
    router.push({name: `stockQuery`})
  } else if (id === `5`) {//入库
    router.push({path: `/inOutBound/1`})
  } else if (id === `6`) {//出库
    router.push({path: `/inOutBound/0`})
  } else if (id === `7`) {//库存流水
    router.push({name: `stockFlow`})
  } else if (id === `8`) {//库存盘点
    router.push({name: `stockCheck`})
  } else if (id === `9`) {//供应商
    router.push({name: `addProvider`})
  } else if (id === `10`) {//申请入库
    router.push({path: `/WATchooseWarehouse/inBound`})
  } else if (id === `11`) {//申请出库
    router.push({path: `/WATchooseWarehouse/outBound`})
  } else if (id === `12`) {//委托配送
    router.push({path: `/WATchooseWarehouse/applyDelivery`})
  } else if (id === `13`) {//会员订单
    router.push({name: `orders`})
  } else if (id === `14`) {//商品上下架
    router.push({name: `productUpAndDown`})
  } else if (id === `15`) {//优惠券
    router.push({name: `coupon`})
  } else if (id === `16`) {//组合活动
    router.push({name: `groupActivity`})
  } else if (id === `17`) {//会员
    router.push({name: `memberList`})
  } else if (id === `18`) {//易久批备货商品
    router.push({name: `commodityList`, query: {pageType: 'directMatch'}})
  } else if (id === `19`) {//易久批备货单
    router.push({name: `pickingList`})
  } else if (id === `20`) {//易久批对账单
    router.push({name: `accountOrder`})
  }
}

export default jumpLink


