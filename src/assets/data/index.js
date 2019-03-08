import Vue from 'vue'
import Vuex from 'vuex'
import appConfig from './modules/appConfig'
import user from "./modules/user"
import dealerInfo from "./modules/dealerInfo"
import homePageShortCuts from "./modules/homePageShortCuts"
import cityAndWarehouse from "./modules/cityAndWarehouse"
import inOutBoundOrder from "./modules/inOutBoundOrder"
import wareHouseInfo from "./modules/wareHouseInfo"
import memberInfo from "./modules/memberInfo"
import couponInfo from "./modules/couponInfo"
import supplier from "./modules/supplier"
import upAndDownInfo from "./modules/upAndDownInfo"
import category from "./modules/category"
import categoryByWarehouse from "./modules/categoryByWarehouse"
import scrollOptions from "./modules/scrollOptions"
import staffInfo from "./modules/staffInfo"
import WATorder from "./modules/WATorder"
import stockFlow from "./modules/stockFlow"
import stockFlowDetail from "./modules/stockFlowDetail"
import stockCheck from "./modules/stockCheck"
import addStockCheck from "./modules/addStockCheck"
import selectProduct from "./modules/selectProduct"
import productFullGift from "./modules/productFullGift"
import userRegister from "./modules/userRegister"
import productForCoupon from "./modules/productForCoupon"
import chooseActivityProduct from "./modules/chooseActivityProduct"
import groupActivityInfo from "./modules/groupActivityInfo"
import showLoading from "./modules/showLoading"
import deliveryUser from "./modules/deliveryUser"
import applyShopEntry from "./modules/applyShopEntry"
import currentCity from "./modules/currentCity"
import myMessageNotice from "./modules/myMessageNotice"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    appConfig,
    user,
    dealerInfo,
    homePageShortCuts,
    cityAndWarehouse,
    inOutBoundOrder,
    wareHouseInfo,
    memberInfo,
    supplier,
    upAndDownInfo,
    couponInfo,
    category,
    categoryByWarehouse,
    scrollOptions,
    staffInfo,
    WATorder,
    stockFlow,
    stockFlowDetail,
    stockCheck,
    addStockCheck,
    selectProduct,
    userRegister,
    productFullGift,
    productForCoupon,
    chooseActivityProduct,
    groupActivityInfo,
    showLoading,
    deliveryUser,
    applyShopEntry,
    currentCity,
    myMessageNotice
  }
})

export default store
