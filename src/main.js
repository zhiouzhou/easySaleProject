// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './assets/data';
import VeeValidate, {Validator} from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN'
import custom_dict from './assets/validates/custom'
import VueI18n from 'vue-i18n';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
// import '../static/style/mint-ui/style_reload.css'
import '../static/style/weui.scss';
import '../static/style/global.styl';
import '../static/style/1x/icons.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'lib-flexible'
import cube from 'cube-ui'
import axios from 'axios'
import Interceptors from './assets/models/defaultInterceptor'
import Loading from '@/loading/loading';
//打开调试
// import Vconsole from 'vconsole'
// let vConsole=new Vconsole()
// export default vConsole

axios.interceptors.request.use(Interceptors.requestInterceptor.config, Interceptors.requestInterceptor.error)
axios.interceptors.response.use(Interceptors.responseInterceptor.response, Interceptors.responseInterceptor.error)


Vue.use(VueI18n)
Vue.use(MintUI)
Vue.use(ElementUI)
Vue.use(cube)
Vue.use(Loading)

Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'zh_CN',
})

Vue.use(VeeValidate, {
  i18n,
  i18nRootKey: 'validation',
  dictionary: {
    zh_CN
  },
  events: 'change|blur'
});

Validator.extend('mobile', {
  getMessage: (filed) => "手机号不正确",
  validate: (value) => {
    return value.length == 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/.test(value);
  }
});
Validator.extend('email', {
  getMessage: {
    zh_CN: (field) => '请填写有效邮箱地址'
  },
  validate: (value, arg) => {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
  }
});
//可输入整数，小数
Validator.extend('decimal', {
  getMessage: {
    zh_CN: (field) => '请填写有效数字'
  },
  validate: (value, arg) => {
    return /^\d+(?=\.{0,1}\d+$|$)/.test(value);
  }
});
//可输入非零的正整数
Validator.extend('number', {
  getMessage: (field) => '请输入整型数字',
  validate: (value, arg) => {
    let reg = /^\d+[0-9]$/;
    return reg.test(value)
  }
})
  //可输入0的正整数
Validator.extend('integerNo', {
  getMessage: (field) => '请输入整型数字',
  validate: (value, arg) => {
    let reg = /^([1-9]\d*|[0]{1,1})$/;
    return reg.test(value)
  }
})
Validator.localize('zh_CN', custom_dict);

/********************************************过滤器**************************************************/
//时间戳转时间
Vue.filter('timestamp', (timestamp) => {
  let date = new Date(timestamp)
  return `${date.getFullYear()}-` +
    `${date.getMonth() + 1}-` +
    `${date.getDate()} ` +
    `${date.getHours()}:` +
    `${date.getMinutes()}:` +
    `${date.getSeconds()}`
})
//小单位库存数量转大单位加小单位的字符串
Vue.filter('showStock', (stockCount, bigUnit, smallUnit, packageCount) => {
  let isPlus = stockCount >= 0
  stockCount = Math.abs(stockCount)
  if (!stockCount || !packageCount) return `0${bigUnit}`
  let bigNum = Math.floor(stockCount / packageCount)
  let smallNum = stockCount % packageCount
  let result = ``
  if (!bigNum) result = `${smallNum}${smallUnit}`
  else if (!smallNum) result = `${bigNum}${bigUnit}`
  else result = `${bigNum}${bigUnit}${smallNum}${smallUnit}`
  if (!isPlus) {
    return `-${result}`
  } else return result
})
//根据specName小单位库存数量转大单位加小单位的字符串
Vue.filter('showStockBySpec', (stockCount, specName, packageCount) => {
  let isPlus = stockCount >= 0
  stockCount = Math.abs(stockCount)
  if (!stockCount || !packageCount || !specName) return `0`
  let unitStr = specName.substr(-3)
  let smallUnit = unitStr.split(`/`)[0]
  let bigUnit = unitStr.split(`/`)[1]
  let bigNum = Math.floor(stockCount / packageCount)
  let smallNum = stockCount % packageCount
  let result = ``
  if (!bigNum) result = `${smallNum}${smallUnit}`
  else if (!smallNum) result = `${bigNum}${bigUnit}`
  else result = `${bigNum}${bigUnit}${smallNum}${smallUnit}`
  if (!isPlus) {
    return `-${result}`
  } else return result
})
//保留两位小数
Vue.filter('fixedTwo', num => {
  if (Number.isNaN(num)) return ``
  else return parseFloat(num).toFixed(2)
})
//数量超过99显示+号
Vue.filter('over99Num', num => {
  if (Number.isNaN(parseInt(num))) return ``
  else if (num > 99) return `99+`
  else if (num < 0) return ``
  else return num
})
//消息列表 时间展示
Vue.filter('messageTimeStamp', paramTimeStamp => {
  let date = new Date(paramTimeStamp)

  let now = new Date()

  let nowTimeStamp = now.getTime()

  let todayBegin = new Date().setHours(0, 0, 0, 0)//  今日凌晨时间戳

  let yesterdayBegin = todayBegin - 86400000;//一天86400秒

  if (paramTimeStamp >= todayBegin && paramTimeStamp < nowTimeStamp) {
    return `${date.getHours()}:${date.getMinutes()}`
  } else if (paramTimeStamp < todayBegin && paramTimeStamp >= yesterdayBegin) {
    return `昨天`
  } else if (paramTimeStamp < yesterdayBegin) {
    return `${date.getFullYear()}-` +
      `${date.getMonth() + 1}-` +
      `${date.getDate()} ` +
      `${date.getHours()}:` +
      `${date.getMinutes()}`
  } else return ``
})


/* eslint-disable no-new */

router.beforeEach(function (to, from, next) {
  let hasToken = !!this.app.$options.store.state.user.userInfo.token
  if (to.path === "/login" || to.path === "/resetPassword"
    || to.path === "/registerOne" || to.path === "/registerStepTwo" || to.path === "/registerStepThree") {
    next();
  } else if (!hasToken) {
    next({path: '/login', replace: true, query: {redirect: to.fullPath}});
  } else {
    next();
  }
}.bind(router));

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
