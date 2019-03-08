import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.easySaleUrl
const supfix = Urls.supplyChainUrl + '/openapi'
const config = {notShowLoading: true}
export default {
  //新增店铺并入驻
  addShopAndEntry(params = {}) {
    return axios.post(prefix + '/Dealer/addShop', params);
  },
  //面向会员设置商品价格
  setProductPriceToUser(params = {}) {
    return axios.post(prefix + '/Product/SetProductPriceToUser', params);
  },
  /*查询会员列表*/
  getListBizUser(params = {}) {
    return axios.post(prefix + '/BizUser/ListBizUser', params);
  },
  /*查询会员商品列表*/
  getListBizUserProduct(params = {}) {
    return axios.post(prefix + '/UserPrice/ListBizUserProduct', params);
  },
  /*查询经销商经纪人列表*/
  getListBroker(params = {}) {
    return axios.post(prefix + '/Employee/ListBroker', params, config);
  },
  /*变更会员经纪人*/
  updateBizUserBroker(params = {}) {
    return axios.post(prefix + '/BizUser/UpdateBizUserBroker', params);
  },
  /*查询优惠券活动列表*/
  getListCouponActivity(params = {}) {
    return axios.post(prefix + '/Coupon/ListCouponActivity', params);
  },
  /*下架优惠券活动*/
  disableCouponActivity(params = {}) {
    return axios.post(prefix + '/Coupon/DisableCouponActivity', params);
  },
  /*发布优惠券活动*/
  publishCouponActivity(params = {}) {
    return axios.post(prefix + '/Coupon/PublishCouponActivity', params);
  },
  /*新增优惠券*/
  addCouponActivity(params = {}) {
    return axios.post(prefix + '/Coupon/AddCouponActivity', params);
  },
  /*编辑优惠券*/
  updateCouponActivity(params = {}) {
    return axios.post(prefix + '/Coupon/UpdateCouponActivity', params);
  },
  /*查询优惠券发放明细列表*/
  getListCouponReleaseDetail(params = {}) {
    return axios.post(prefix + '/Coupon/ListCouponReleaseDetail', params);
  },
  /*查询优惠券活动详情*/
  getCouponActivityById(params = {}) {
    return axios.post(prefix + '/Coupon/GetCouponActivityById', params);
  },
  /*价格审核列表*/
  getPriceAuditList(params = {}) {
    return axios.post(prefix + '/PriceAudit/ListPriceAudit', params);
  },
  /*价格审核详情*/
  getPriceAuditDetail(params = {}) {
    return axios.post(prefix + '/PriceAudit/GetPriceAuditDetail', params);
  },
  /*获取成交价格列表*/
  getTransactionPrice(params = {}) {
    return axios.post(prefix + '/PriceAudit/ListRecentDealRecord', params);
  },
  /*设置价格*/
  setPrice(params = {}) {
    return axios.post(prefix + '/PriceAudit/AgreeProductApply', params);
  },
  /*拒绝申请*/
  refusalApply(params = {}) {
    return axios.post(prefix + '/PriceAudit/RefuseProductApply', params);
  },
  /*商品列表(商品上下架)*/
  getProductList(params = {}) {
    return axios.post(prefix + '/Product/ListProduct', params);
  },
  /*新增一条产品限购规则*/
  productLimitationRule(params = {}) {
    return axios.post(prefix + '/Rule/AddProductLimitationRule', params);
  },
  /*商品上架*/
  productShelves(params = {}) {
    return axios.post(prefix + '/Product/Enable', params);
  },
  /*商品修改*/
  productEdit(params = {}) {
    return axios.post(prefix + '/Product/UpdateProduct', params);
  },
  /*获取商品详情信息*/
  getProductDetailInfo(params = {}) {
    return axios.post(prefix + '/Product/GetProductSkuById', params);
  },
  /*商品下架*/
  productFrame(params = {}) {
    return axios.post(prefix + '/Product/Disable', params);
  },
  /*设置销售规格*/
  setSaleSpecification(params = {}) {
    return axios.post(prefix + '/Product/UpdateSaleSpecification', params);
  },
  /*获取产品满赠列表*/
  getProductGiftList(params = {}) {
    return axios.post(prefix + '/Rule/ListProductGift', params);
  },
  /*设置全局时间*/
  // setGlobalTime(params = {}) {
  //   return axios.post(prefix + '/Rule/SetProductGiftTime', params);
  // },
  /*新增一条产品满赠*/
  addProGifts(params = {}) {
    return axios.post(prefix + '/Rule/AddProductGift', params);
  },
  /*删除一条产品满赠*/
  deleteProGift(params = {}) {
    return axios.post(prefix + '/Rule/DeleteProductGift', params);
  },
  /*申请入住（经销商店铺查询）*/
  getShopInfo(params = {}) {
    return axios.post(prefix + '/User/getShop', params, config);
  },
  /*店铺入驻确认*/
  shopEntry(params = {}) {
    return axios.post(prefix + '/Register/shopEntry', params);
  },

  /*查询经销商店铺审核状态*/
  getShopState(params = {}) {
    return axios.post(prefix + '/Employee/getShopAuditState', params, config);
  },
  /*查询组合活动列表*/
  getGroupActivityList(params = {}) {
    return axios.post(prefix + '/Activity/ListCompositeProduct', params);
  },
  /*新增组合活动*/
  addGroupActivity(params = {}) {
    return axios.post(prefix + '/Activity/AddCompositePromotion', params);
  },
  /*下架组合活动*/
  LowerFrameActivity(params = {}) {
    return axios.post(prefix + '/Activity/discardPromotion', params);
  },
  /*发布组合活动*/
  releaseActivity(params = {}) {
    return axios.post(prefix + '/Activity/releasePromotion', params);
  },
  /***********************订单相关********************/
  /*获取会员订单*/
  getOrders(params = {}) {
    return axios.post(prefix + '/Order/ListOrder', params);
  },
  /*获取会员订单详情*/
  getOrdersDetail(params = {}) {
    return axios.post(prefix + '/Order/GetOrderById', params);
  },
  /*完成订单*/
  completeOrder(params = {}) {
    return axios.post(prefix + '/Order/CompleteOrder', params);
  },
  /*审核经销商收款订单*/
  auditOrder(params = {}) {
    return axios.post(prefix + '/Order/Audit', params);
  },
  /*订单发货*/
  handleOrder(params = {}) {
    return axios.post(prefix + '/Order/HandleOrder', params);
  },
  /*获取配送员列表*/
  getDeliveryUsers(params = {}) {
    return axios.post(prefix + '/Employee/ListDeliveryUser', params);
  },
  /*新增配送员*/
  addDeliveryUser(params = {}) {
    return axios.post(prefix + '/Employee/AddEmployee', params);
  },
  /***********************经销商直配相关********************/
  /*备货单对账单数量*/
  directMatchOrderCounts(params = {}) {
    return axios.post(prefix + '/storeUp/dealerStoreCount', params, config);
  },
  /*查询备货单或对账单*/
  directMatchOrderList(params = {}) {
    return axios.post(prefix + '/storeUp/findDealerStoreList', params);
  },
  /*查询备货单或对账单详情*/
  directMatchOrderDetail(params = ``) {
    return axios.get(prefix + `/storeUp/findDealerStoreDetail/${params}`);
  },
  /*货物总数量统计*/
  getDealerStoreCount(params = ``) {
    return axios.get(prefix + `/storeUp/getDealerStoreCount/${params}`);
  },
  //结算金额
  totalPayAmount(params = ``) {
    return axios.get(prefix + `/storeUp/totalPayAmount/${params}`);
  },
  //待结算金额
  totalWaitPayAmount(params = ``) {
    return axios.get(prefix + `/storeUp/totalWaitPayAmount/${params}`);
  },
  //店铺入驻查询电话号码接口
  getContentValue(params = ``) {
    return axios.post(supfix + `/ContentConfig/getContentValue`, params);
  },

  /*查看经销商信息*/
  getDealerInfo(params = {}) {
    return axios.post(prefix + `/Dealer/getShopInfo`, params);
  }
}
