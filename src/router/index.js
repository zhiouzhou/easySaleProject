import Vue from 'vue'
import Router from 'vue-router'

import home from '@/components/portal/Home'
import commodity from '@/components/commodity/Commodity'   //商品页面
import shop from '@/components/shop/Shop';    //店铺页面
import chooseProduct from '@/components/commonPage/ChooseProduct';//选择商品
import cityChoose from '@/components/commonPage/CityChoose';    //选择城市
import user from '@/components/user/User';
import myBusiness from '@/components/user/MyBusiness';    //我的商贸

import batchInfo from '@/components/pickingList/batchInfo'; //批次信息
import pickingList from '@/components/pickingList/pickingList'; //直配 备货单
import accountOrder from '@/components/pickingList/accountOrder'; //对账单

import {
  login, resetPassword, registerOne
} from './LoginModule'

import {
  provider, commodityShow, stock, commodityClassify, brandList,
  addCommodity, commodityList, commodityDetail, addProvider
} from './CommodityModule'

import {
  homePage, greenhandGuide, addQuickEntry, guideDetail
} from './HomePageModule'

import {
  WAThomepage,
  WATchooseWarehouse,
  WATchooseProduct,
  WATchooseTime,
  WATchoosePerson,
  WATeditPerson,
  WATorderDetail,
  WATpayResult,
  InBoundOrder,
  OutBoundOrder,
  EntrustDelivery
} from './WATModule'

import {
  chooseSupplier, chooseWarehouse, stockQuery, stockDetail, addStockCheck, stockCheckDetail,
  stockCheck, stockFlow, stockFlowDetail, inOutBound, wareHouse, addStore
} from './StockModule';

import {
  applyShopEntryStepOne, applyShopEntryStepTwo, applyShopEntryStepThree
} from './ApplyAdmission'

import {
  orders, orderDetail, priceAudit, transactionPrice, priceAuditDetail, chooseDeliveryUser, addDeliveryUser
} from './OrderModule'

import {
  productUpAndDown, productShelves, proGifts, addProGifts, chooseGifts,
  shopCommodityDetail, modifyInformation,
} from './upAndDownModule'

import {
  coupon, detailCoupon, addCoupon, releaseDetail
} from './CouponModule'

import {
  groupActivity, groupProductDetail, addGroupActivity
} from './GroupModule'

import {
  memberList, priceChange, agentChange, addRole
} from './MemberModule'

import {
  myMessage, messageList
} from './MessageModule'

import {
  myStaff, addStaff
} from './StaffModule'

import {
  myInformation
} from './InformationModules'

import {
  setting, changePassword
} from './SettingModule'

Vue.use(Router)

export default new Router({
  // mode : 'history',
  routes: [
    {
      path: "/login",
      name: 'login',
      title: '登录',
      component: login,
    },
    {
      path: "/",
      name: "home",
      title: "首页",
      component: home,
      children: [
        {
          path: "homepage",
          component: homePage,
          meta: {keepAlive: true},
        },
        {
          path: "commodity",
          component: commodity,
          meta: {keepAlive: true},
          children: [
            {
              path: 'commodityShow',
              component: commodityShow,
              meta: {keepAlive: true},
            },
            {
              path: 'stock',
              component: stock,
              meta: {keepAlive: true},
            },
            {
              path: 'provider',
              component: provider,
              meta: {keepAlive: true},
            }
          ],
          redirect: '/commodity/commodityShow'
        },
        {
          path: 'shop',
          component: shop,
          meta: {keepAlive: true},
        },
        {
          path: 'WAThomepage',
          component: WAThomepage,
          meta: {keepAlive: true},
        },
        {
          path: 'user',
          component: user,
          meta: {keepAlive: true},
        }
      ],
      // redirect:"/homepage",
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/greenhandGuide",
      name: "greenhandGuide",
      title: "新手引导",
      component: greenhandGuide
    },
    {
      path: "/guideDetail",
      name: "guideDetail",
      title: "新手引导详情",
      component: guideDetail
    },
    {
      path: "/addQuickEntry",
      name: "addQuickEntry",
      title: "添加快捷功能",
      component: addQuickEntry
    },
    {
      path: "/registerOne",
      name: "registerOne",
      title: "用户注册",
      component: registerOne
    },
    {
      path: "/resetPassword",
      name: 'resetPassword',
      title: '重置密码',
      component: resetPassword
    },
    {
      path: "/warehouse",
      name: 'warehouse',
      title: '仓库管理',
      component: wareHouse
    },
    {
      path: "/commodityClassify",
      name: "commodityClassify",
      title: "商品分类",
      component: commodityClassify
    },
    {
      path: "/cityChoose",
      name: "cityChoose",
      title: "选择城市",
      component: cityChoose,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/brandList/:id",
      name: "brandList",
      title: "品牌列表",
      component: brandList
    },
    {
      path: "/addStore",
      name: 'addStore',
      title: '新增仓库',
      component: addStore
    },
    {
      path: "/editStore/:id/:name/:detailAddress/:province/:city/:county/:street",
      name: 'editStore',
      title: '编辑仓库',
      component: addStore
    },
    {
      path: "/addCommodity",
      name: "addCommodity",
      title: '新增商品',
      component: addCommodity
    },
    {
      path: "/chooseProduct",
      name: "chooseProduct",
      title: '选择商品',
      component: chooseProduct,
    },
    {
      path: "/commodityList",
      name: 'commodityList',
      title: '商品列表',
      component: commodityList,
    },
    {
      path: "/commodityDetail",
      name: "commodityDetail",
      title: '商品详情',
      component: commodityDetail
    },
    {
      path: "/stockQuery",
      name: 'stockQuery',
      title: '库存查询',
      component: stockQuery,
      // meta: {keepAlive: true}
    },
    {
      path: "/stockDetail/:warehouseId",
      name: 'stockDetail',
      title: '库存明细',
      component: stockDetail,
    },
    {
      path: "/stockFlow",
      name: 'stockFlow',
      title: '库存流水',
      component: stockFlow,
      // meta: {keepAlive: true}
    }, {
      path: "/stockFlowDetail/:orderType/:orderId",
      name: 'stockFlowDetail',
      title: '库存详情',
      component: stockFlowDetail,
    },
    {
      path: "/inOutBound/:isInBound",
      name: 'inOutBound',
      title: '出入库',
      component: inOutBound,
    },
    {
      path: "/chooseSupplier",
      name: 'chooseSupplier',
      title: '选择供应商',
      component: chooseSupplier,
    },
    {
      path: "/chooseWarehouse",
      name: 'chooseWarehouse',
      title: '选择仓库',
      component: chooseWarehouse,
    },
    {
      path: "/stockCheck",
      name: 'stockCheck',
      title: '库存盘点',
      component: stockCheck,
    },
    {
      path: "/addStockCheck",
      name: 'addStockCheck',
      title: '新增库存盘点',
      component: addStockCheck,
    },
    {
      path: "/stockCheckDetail/:orderNo",
      name: 'stockCheckDetail',
      title: '库存盘点记录',
      component: stockCheckDetail,
    },
    {
      path: "/WATchooseWarehouse",
      name: 'WATchooseWarehouse',
      title: '仓配服务选择仓库',
      component: WATchooseWarehouse,
    },
    {
      path: "/WATchooseProduct/:type",
      name: 'WATchooseProduct',
      title: '仓配服务选择商品',
      component: WATchooseProduct,
    },
    {
      path: "/WATchooseTime/:type",
      name: 'WATchooseTime',
      title: '仓配服务预计送货时间',
      component: WATchooseTime,
    },
    {
      path: "/WATchoosePerson/:pageType",
      name: 'WATchoosePerson',
      title: '仓配服务选择收货人或者提货人',
      component: WATchoosePerson,
    },
    {
      path: "/WATeditPerson/:pageType/:operateType",
      name: 'WATeditPerson',
      title: '仓配服务新增收货人或者提货人',
      component: WATeditPerson,
    },
    {
      path: "/WATorderDetail/:type",
      name: 'WATorderDetail',
      title: '仓配服务单据详情',
      component: WATorderDetail,
    },
    {
      path: "/WATpayResult/:type",
      name: 'WATpayResult',
      title: '仓配服务单据支付结果',
      component: WATpayResult,
    },
    {
      path: "/orders",
      name: 'orders',
      title: '会员订单',
      component: orders,
    },
    {
      path: "/orderDetail",
      name: 'orderDetail',
      title: '会员订单详情',
      component: orderDetail,
    },
    {
      path: "/chooseDeliveryUser",
      name: 'chooseDeliveryUser',
      title: '选择配送人员',
      component: chooseDeliveryUser,
    },
    {
      path: "/addDeliveryUser",
      name: 'addDeliveryUser',
      title: '新增配送人员',
      component: addDeliveryUser,
    },
    {
      path: "/addProvider",
      name: "addProvider",
      title: "新增供应商",
      component: addProvider
    },
    {
      path: "/editProvider",
      name: "editProvider",
      title: "编辑供应商",
      component: addProvider
    },
    {
      path: "/memberList",
      name: "memberList",
      title: "会员管理",
      component: memberList
    },
    {
      path: "/priceChange/:list",
      name: "priceChange",
      title: "商品价格",
      component: priceChange
    },
    {
      path: "/agentChange/:id",
      name: "agentChange",
      title: "选择经纪人",
      component: agentChange
    },
    {
      path: "/addRole",
      name: "addRole",
      title: "新增员工",
      component: addRole
    },
    {
      path: "/shopCommodityDetail",
      name: 'shopCommodityDetail',
      title: '商品详情',
      component: shopCommodityDetail,
    },
    {
      path: "/modifyInformation",
      name: 'modifyInformation',
      title: '修改商品信息',
      component: modifyInformation,
    },
    {
      path: "/proGifts",
      name: 'proGifts',
      title: '产品满赠',
      component: proGifts,
    },
    {
      path: "/chooseGifts",
      name: 'chooseGifts',
      title: '选择商品',
      component: chooseGifts,
    },
    {
      path: "/addProGifts",
      name: 'addProGifts',
      title: '新增产品满赠',
      component: addProGifts,
    },
    {
      path: "/coupon",
      name: 'coupon',
      title: '优惠券',
      component: coupon,
      //meta:{keepAlive:true}
    },
    {
      path: "/detailCoupon/:id/:assignProductCoupon",
      name: 'detailCoupon',
      title: '优惠券详情',
      component: detailCoupon,
    },
    {
      path: "/releaseDetail/:couponActivityId",
      name: 'releaseDetail',
      title: '发放明细',
      component: releaseDetail,
    }, {
      path: "/addCoupon",
      name: 'addCoupon',
      title: '新增优惠券',
      component: addCoupon,
    }, {
      path: "/editCoupon",
      name: 'editCoupon',
      title: '编辑优惠券',
      component: addCoupon,
    },
    {
      path: "/applyShopEntryStepOne",
      name: 'applyShopEntryStepOne',
      title: '填写入驻信息',
      component: applyShopEntryStepOne,
    },
    {
      path: "/applyShopEntryStepTwo",
      name: 'applyShopEntryStepTwo',
      title: '填写入驻信息',
      component: applyShopEntryStepTwo,
    },
    {
      path: "/applyShopEntryStepThree",
      name: 'applyShopEntryStepThree',
      title: '填写入驻信息',
      component: applyShopEntryStepThree,
    },
    {
      path: "/priceAudit",
      name: 'priceAudit',
      title: '价格审核列表',
      component: priceAudit,
      meta: {
        keepAlive: true,
      }
    },
    {
      path: "/transactionPrice",
      name: 'transactionPrice',
      title: '成交价格',
      component: transactionPrice,
    },
    {
      path: "/priceAuditDetail",
      name: 'priceAuditDetail',
      title: '价格审核详情',
      component: priceAuditDetail,
    },
    {
      path: "/productUpAndDown",
      name: 'productUpAndDown',
      title: '商品上下架',
      component: productUpAndDown,
    },
    {
      path: "/productShelves",
      name: 'productShelves',
      title: '商品上下架',
      component: productShelves,
    },
    {
      path: "/myStaff",
      name: 'myStaff',
      title: '我的员工',
      component: myStaff,
    },
    {
      path: "/addStaff/:id",
      name: 'addStaff',
      title: '新增员工',
      component: addStaff,
    },
    {
      path: "/myBusiness",
      name: 'myBusiness',
      title: '我的商贸',
      component: myBusiness
    },
    {
      path: "/myMessage",
      name: "myMessage",
      title: '我的信息',
      component: myMessage
    },
    {
      path: "/setting",
      name: 'setting',
      title: '设置',
      component: setting,
    },
    {
      path: "/myInformation",
      name: 'myInformation',
      title: '消息',
      component: myInformation,
    },
    {
      path: "/messageList",
      name: 'messageList',
      title: '消息列表',
      component: messageList,
      meta: {keepAlive: true}
    },
    {
      path: "/changePassword",
      name: 'changePassword',
      title: '修改密码',
      component: changePassword,
    },
    {
      path: "/groupActivity",
      name: 'groupActivity',
      title: '组合活动',
      component: groupActivity,
    },
    {
      path: "/groupProductDetail",
      name: 'groupProductDetail',
      title: '组合活动详情',
      component: groupProductDetail,
    },
    {
      path: "/addGroupActivity",
      name: 'addGroupActivity',
      title: '新增组合活动',
      component: addGroupActivity,
    },
    {
      path: "/EntrustDelivery",
      name: 'EntrustDelivery',
      title: '委托配送',
      component: EntrustDelivery,
      meta: {keepAlive: true}
    },
    {
      path: "/InBoundOrder",
      name: 'InBoundOrder',
      title: '入库单',
      component: InBoundOrder,
      meta: {keepAlive: true}
    },
    {
      path: "/OutBoundOrder",
      name: 'OutBoundOrder',
      title: '出库单',
      component: OutBoundOrder,
      meta: {keepAlive: true}
    },
    {
      path: "/batchInfo/:id",
      name: 'batchInfo',
      title: '直赔单详情',
      component: batchInfo,
    },
    {
      path: "/pickingList",
      name: 'pickingList',
      title: '备货单',
      component: pickingList,
    },
    {
      path: "/accountOrder",
      name: 'accountOrder',
      title: '对账单',
      component: accountOrder,
    },
  ]
})

