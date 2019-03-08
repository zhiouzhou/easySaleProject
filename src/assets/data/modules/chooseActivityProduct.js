import Vue from 'vue'

const state = {
  appImg: ``,  //app端展示图片id
  pcImg: '',     //pc端展示图片id
  appImageUrl: '',
  pcImageUrl: '',
  activityName: '',        //活动名称
  activityPrice: '',       //活动价格
  maxCanSaleInventory: null,   //最大可销售库存
  activityTime: '',
  activityStartTime: '',   //活动开始时间
  activityEndTime: '',     //活动结束时间
  compositeProductList: [
    {
      productCount: null,    //组合产品数量
      productId: '',    //产品skuId
      promotionUnit: '件',    //参与活动单位
      regularPrice: null,    //商品正常价格
      productPrice: null,     //商品价格
    }
  ],
};
const getters = {};
const mutations = {
  setAppImg(state, imgUrl) {
    state.appImg = imgUrl
  },
  setPcImg(state, imgUrl) {
    state.pcImg = imgUrl
  },
  setAppImageUrl(state, appImageUrl) {
    state.appImageUrl = appImageUrl
  },
  setPcImageUrl(state, pcImageUrl) {
    state.pcImageUrl = pcImageUrl
  },
  setActivityName(state, activityName) {
    state.activityName = activityName
  },
  setActivityPrice(state, activityPrice) {
    state.activityPrice = activityPrice
  },
  setMaxCanSaleInventory(state, maxCanSaleInventory) {
    state.maxCanSaleInventory = maxCanSaleInventory
  },
  setActivityStartTime(state, activityStartTime) {
    state.activityStartTime = activityStartTime
  },
  setActivityEndTime(state, activityEndTime) {
    state.activityEndTime = activityEndTime
  },
  setActivityTime(state, activityTime) {
    state.activityTime = activityTime
  },
  setClearContent(state) {
    state.appImg = '';
    state.pcImg = '';
    state.appImageUrl = '';
    state.pcImageUrl = '';
    state.activityName = '';
    state.activityPrice = '';
    state.maxCanSaleInventory = null;
    state.activityTime = '';
    state.activityStartTime = '';
    state.activityEndTime = '';
    state.compositeProductList = [
      {
        productCount: null,    //组合产品数量
        productId: '',    //产品skuId
        promotionUnit: '件',    //参与活动单位
        regularPrice: null,    //商品正常价格
        productPrice: null,
      }
    ]
  },
  chooseProduct(state, {products, selectIndex}) {
    console.log(products, selectIndex)
    state.compositeProductList[selectIndex] = products[0]
    /*state.compositeProductList.forEach(item=>{
      item.promotionUnit = '件'
    })*/
    state.compositeProductList[selectIndex].promotionUnit = '件'
  },
  addActivityInfo(state) {
    state.compositeProductList.push({
      productCount: null,    //组合产品数量
      productId: '',    //产品skuId
      promotionUnit: '件',    //参与活动单位
      regularPrice: null,    //商品正常价格
      productPrice: null,
    })
  },
  selectUnit(state, {selectItem, selectIndex}) {
    //数组元素 的响应式变化只能检测到数组元素个数的变化，推测是监听length的变化来触发
    //如果是数组元素的内部属性，因为不是响应式的，所以在数组元素个数发生变化的时候，才能刷新到页面上
    //解决办法是通过下面这种方式去修改数组内的元素达到响应式变化
    // Vue.set(array,indexOfNewItem,newItem)
    let newItem = state.compositeProductList[selectIndex]
    newItem.promotionUnit = selectItem
    Vue.set(state.compositeProductList, selectIndex, newItem)
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
