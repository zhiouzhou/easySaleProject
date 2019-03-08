import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.supplyChainUrl + '/openapi';
const config = {notShowLoading: true}

export default {
  //根据经销商id得到仓库id和仓库名称(有库存的经销商仓库)
  getWarehouseList(params = {}) {
    return axios.post(prefix + '/stockWarehouse/findStockWarehouseList', params, config);
  },
  //根据商品SKUID、经销商、仓库编号查询库存出入库历史记录明细（库存查询，商品库存明细）
  getStockDetail(params = {}) {
    return axios.post(prefix + '/productStock/findProductStoreRecordList', params)
  },
  //根据经销商、仓库、月份、单据类型、查询出入库单据信息接口(库存流水列表)
  getStockFlowList(params = {}) {
    return axios.post(prefix + '/stockSerial/findProductStoreSerialList', params);
  },
  //根据单据类型，单据id查询单据信息(库存流水详情，单据信息)
  getStockFlowDetail(params = {}) {
    return axios.post(prefix + '/stockSerial/findStockDetail', params);
  },
  //库存流水详情，商品信息
  getStockFlowDetailProductInfo(params = {}) {
    return axios.post(prefix + '/stockSerial/findProductSeriaDetailList', params);
  },
  //查询盘点记录(库存盘点)
  getStockCheckList(params = {}) {
    return axios.post(prefix + '/stockTaking/findStockTakingRecord', params);
  },
  //新增盘点记录(库存盘点)
  addStockCheck(params = {}) {
    return axios.post(prefix + '/stockTaking/saveStockTaking', params);
  },
  //盘点记录详情(库存盘点)
  stockCheckDetail(params = {}) {
    return axios.post(prefix + '/stockTaking/findStockTakingDetail', params);
  },
  //快速入库
  addInBoundOrder(params = {}) {
    return axios.post(prefix + '/inStock/quicklyInStock', params);
  },
  //快速出库
  addOutBoundOrder(params = {}) {
    return axios.post(prefix + '/outStock/quicklyOutStock', params);
  },
  //获取经销商仓库(按类型,全部，托管，自有)
  getDealerWarehouse(params = {}) {
    return axios.post(prefix + '/chargeConfig/findWarehouseChooseList', params);
  },
}
