/**
 * 首页快捷方式入口
 * @type {{allShortCut: Array}}
 */
const state = {
  allShortCut: []
};
//TODO:根据经销商状态进行过滤
const getters = {
  subscribeShortCut: state => {
    return state.allShortCut.filter(item => item.added)
  },
  productShortCut: state => {
    return state.allShortCut.filter(item => item.type === `product`)
  },
  wareHouseShortCut: state => {
    return state.allShortCut.filter(item => item.type === `wareHouse`)
  },
  ordersShortCut: state => {
    return state.allShortCut.filter(item => item.type === `orders`)
  }
};

const mutations = {
  initShortCutData(state) {
    let allShortCut = localStorage.getItem('allShortCut')
    if (allShortCut && JSON.parse(allShortCut).length !== 0) {
      state.allShortCut = JSON.parse(allShortCut)
    } else {
      state.allShortCut = [
        {imgUrl: `icon-ic_xinzengshangpin`, name: `新增商品`, added: true, id: `1`, type: `product`,isSprites:true},
        {imgUrl: `icon-in_shangpinliebiao`, name: `商品列表`, added: false, id: `2`, type: `product`,isSprites:true},
        {imgUrl: `icon-lm_cangkuguanli`, name: `仓库管理`, added: false, id: `3`, type: `product`,isSprites:true},
        {imgUrl: `icon-zhangdan`, name: `库存查询`, added: true, id: `4`, type: `product`,isSprites:true},
        {imgUrl: `icon-in_ruku`, name: `入库`, added: true, id: `5`, type: `product`,isSprites:true},
        {imgUrl: `icon-in_ruku_copy`, name: `出库`, added: false, id: `6`, type: `product`,isSprites:true},
        {imgUrl: `icon-ic_kcls`, name: `库存流水`, added: false, id: `7`, type: `product`,isSprites:true},
        {imgUrl: `icon-ic_kcpd`, name: `库存盘点`, added: false, id: `8`, type: `product`,isSprites:true},
        {imgUrl: `icon-ic_gys`, name: `供应商`, added: false, id: `9`, type: `product`,isSprites:true},
        {imgUrl: `icon-ic_sqrk`, name: `申请入库`, added: false, id: `10`, type: `wareHouse`,isSprites:true},
        {imgUrl: `icon-ic_sqck`, name: `申请出库`, added: false, id: `11`, type: `wareHouse`,isSprites:true},
        {imgUrl: `icon-ic_wtps`, name: `委托配送`, added: false, id: `12`, type: `wareHouse`,isSprites:true},
        {imgUrl: `icon-ic_hydd`, name: `会员订单`, added: false, id: `13`, type: `orders`,isSprites:true},
        {imgUrl: `icon-ic_spsxj`, name: `商品上下架`, added: false, id: `14`, type: `orders`,isSprites:true},
        {imgUrl: `icon-ic_yhq`, name: `优惠券`, added: false, id: `15`, type: `orders`,isSprites:true},
        {imgUrl: `icon-ic_zhhd`, name: `组合活动`, added: false, id: `16`, type: `orders`,isSprites:true},
        {imgUrl: `icon-ic_hy`, name: `会员`, added: true, id: `17`, type: `orders`,isSprites:true},
        {imgUrl: `/static/icons/im_beihuoshangpin.png`, name: `易久批备货商品`, added: false, id: `18`, type: `orders`,isSprites:false},
        {imgUrl: `/static/icons/im_beihuodan.png`, name: `易久批备货单`, added: false, id: `19`, type: `orders`,isSprites:false},
        {imgUrl: `/static/icons/im_duizhangdan.png`, name: `易久批对账单`, added: false, id: `20`, type: `orders`,isSprites:false},
      ]
    }
  },
  toggleSingleShortCut(state, id) {
    let index = state.allShortCut.findIndex(item => item.id == id)
    state.allShortCut[index].added = !state.allShortCut[index].added
    localStorage.setItem('allShortCut', JSON.stringify(state.allShortCut))
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
