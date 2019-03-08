import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.easySaleUrl
const supPrefix = Urls.supplyChainUrl + `/openapi`
const config = {notShowLoading: true}
export default {
  //直配商品修改库存
  editDirectMatchProductStock(params = {}) {
    return axios.post(prefix + '/Inventory/setShopDirectProductInventory', params);
  },
  //查询经销商仓库列表
  getListDealerWarehouse(params = {}) {
    return axios.post(prefix + '/Warehouse/listDealerWarehouse', params);
  },
  //新增仓库
  addWarehouse(params = {}) {
    return axios.post(prefix + '/Warehouse/addWarehouse', params);
  },
  //修改经销商自有仓库
  updateWarehouse(params = {}) {
    return axios.post(prefix + '/Warehouse/updateWarehouse', params);
  },
  //获取类目列表
  getCategoryList(params) {
    if (typeof params === `object` && params.dealerType) {//直配经销商
      params = {dealerType: 1}
    } else if (typeof params === `string` || typeof params === `number`) {   //只传仓库id
      params = {warehouseId: params, dealerType: 0}
    } else if (typeof params === `object` && params.param) { //只传仓库id
      params = {warehouseId: params.param, dealerType: 0}
    } else if (typeof params === `object` && !params.param) {//什么都没传
      params = {dealerType: 0}
    } else if (typeof params === `undefined`) {//什么都没传
      params = {dealerType: 0}
    }
    //将参数放到param字段下
    params = {param: params}
    return axios.post(prefix + '/Product/ListCategoryAndBrand', params, config);
  },
  //根据仓库获取类目列表
  getCategoryListByWarehouse(params) {
    if (typeof params === `object` && params.dealerType) {//直配经销商
      params = {dealerType: 1}
    } else if (typeof params === `string` || typeof params === `number`) {   //只传仓库id
      params = {warehouseId: params, dealerType: 0}
    } else if (typeof params === `object` && params.param) { //只传仓库id
      params = {warehouseId: params.param, dealerType: 0}
    } else if (typeof params === `object` && !params.param) {//什么都没传
      params = {dealerType: 0}
    } else if (typeof params === `undefined`) {//什么都没传
      params = {dealerType: 0}
    }
    //将参数放到param字段下
    params = {param: params}
    return axios.post(prefix + '/Product/ListCategoryAndBrand', params);
  },
  //获取商品在各个仓库的库存
  getStockFromEveryWarehouse(params = {}) {
    return axios.post(supPrefix + '/productStock/findProductInfoStockList', params);
  },
  //查询商品详情
  getProductDetail(params = {}) {
    return axios.post(prefix + '/Product/GetProductSkuById', params);
  },
  //获取产品包装单位（新增商品）
  getProductUnit(params = {}) {
    return axios.post(prefix + '/Product/ListProductUnit', params, config);
  },
  //获取所有一级和二级统计类目的接口
  getAllCategoryList(params = {}) {
    return axios.post(prefix + '/Product/listStatisticsCategoryWithChild', params, config);
  },
  //查询产品信息列表(新增商品的模糊搜索)
  getProductInfo(params = {}) {
    return axios.post(prefix + '/Product/ListEnableProductInfo', params);
  },
  //新增商品
  addProduct(params = {}) {
    return axios.post(prefix + '/Product/addProductInfoForMultiTenant', params);
  },
  //编辑商品信息
  editProductInfo(params = {}) {
    return axios.post(prefix + '/Product/updateProductInfoForMultiTenant', params);
  },
  //根据条形码箱码查商品信息
  queryProductByCode(params = {}) {
    return axios.post(prefix + '/Product/listProductSkuIdByCode', params);
  },
  //查询直配商品的区域采购价列表
  getShopDirectProductSkuAreaSellPolicy(params = {}) {
    return axios.post(prefix + '/Product/getShopDirectProductSkuAreaSellPolicy', params);
  },
  //地址查询接口
  findDirectChildrenByParentCode(params={}){
    return axios.post(prefix+`/Warehouse/findDirectChildrenByParentCode`,params);
  }
}
