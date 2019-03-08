import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.easySaleUrl
const supPrefix = Urls.supplyChainUrl + `/openapi`
const config = {notShowLoading: true}

export default {
  //根据经销商查询待支付、待入库、已完成、全部单据的数量接口(仓配服务首页单据数量)
  getOrdersNum(params = {}) {
    return axios.post(supPrefix + '/entrustDelivery/findInStockNoteList', params, config);
  },
  //根据单据状态查询商品集合(仓配服务单据列表)
  getOrderList(params = {}) {
    return axios.post(supPrefix + '/entrustDelivery/findEntrustDeliveryList', params);
  },

  //委托配送单列表
  getDeliveryOrderList(params = {}) {
    return axios.post(prefix + 'DeliveryOrder/AllList', params)
  },

  //获取服务商仓库
  getFacilitatorWarehouse(params = {}) {
    return axios.post(prefix + '/Warehouse/getWarehouseInfo', params);
  },
  //******************选择服务，计算费率***************//
  getServiceFee(keyWord, params = {}) {
    if (keyWord === `inBound`) {
      //获取入库服务费
      return axios.post(supPrefix + '/chargeConfig/findInStockTotalCharge', params, config);
    } else {
      //获取出库和配送服务费
      return axios.post(supPrefix + '/chargeConfig/findOutStockTotalCharge', params, config);
    }
  },
  //******************收货人相关***************//
  //获取客户收货地址列表(委托配送收货人)
  getReceiverList(params = {}) {
    return axios.post(prefix + '/Customer/ListAddress', params, config);
  },
  //修改收货人
  updateReceiver(params = {}) {
    return axios.post(prefix + '/Customer/updateContactsAddress', params);
  },
  //删除收货人
  deleteReceiver(params = {}) {
    return axios.post(prefix + '/Customer/deleteContactsAddress', params);
  },
  //新增收货人
  addReceiver(params = {}) {
    return axios.post(prefix + '/Customer/addContactsAddress', params);
  },
  //获取省市区数据
  getLocaticonList(params = {}) {
    return axios.post(prefix + '/Street/ListProvinceVO', params, config);
  },
  //******************提货人相关***************//
  //获取提货人列表（出库提货人）
  getPickerList(params = {}) {
    return axios.post(prefix + '/consigneer/getConsigneerList', params, config);
  },
  //修改提货人
  updatePicker(params = {}) {
    return axios.post(prefix + '/consigneer/updateDealerconsigneer', params);
  },
  //删除提货人
  deletePicker(params = {}) {
    return axios.post(prefix + '/consigneer/deleteDealerConsigneer', params);
  },
  //新增提货人
  addPicker(params = {}) {
    return axios.post(prefix + '/consigneer/addConsigneer', params);
  },
  //******************新增仓配单***************//
  //新增入库单
  addInBoundOrder(params = {}) {
    return axios.post(supPrefix + '/easySell/addStockInBillToSell', params);
  },
  //新增出库单和委托配送单
  addOutBoundAndApplyDeliveryOrder(params = {}) {
    return axios.post(supPrefix + '/easySell/addStockOutApplyBillToSell', params);
  },

  //新增配送单
  addDeliveryOrder(params = {}) {
    return axios.post(prefix + '/DeliveryOrder/Add', params);
  },

  //******************仓配单详情***************//
  //入库单详情
  inBoundOrderDetail(params = ``) {
    return axios.get(supPrefix + `/easySell/findStockInItem/${params}`);
  },
  //出库单
  outBoundAndApplyDeliveryOrderDetail(params = ``) {
    return axios.get(supPrefix + `/easySell/findStockOutItem/${params}`);
  },

  //委托配送单详情
  deliveryOrderDetail(params){
    return axios.post(prefix + '/DeliveryOrder/Detail', params);
  },


  //取消入库单
  cancelInBoundOrder(params = {}) {
    return axios.get(supPrefix + `/easySell/cancelStockInState/${params.id}/${params.userId}`);
  },
  //取消出库单和委托配送单
  cancelOutBoundAndApplyDeliveryOrder(params = {}) {
    return axios.get(supPrefix + `/easySell/cancelStockOutState/${params.id}/${params.userId}`);
  },

  //取消委托配送单
  cancelDeliveryOrder(params = {}) {
    return axios.post(prefix + `/DeliveryOrder/Cancel`,params);
  },
}
