import axios from 'axios';
import {isFn} from "@/scripts/utils";
import Urls from './baseUrl'

const prefix = Urls.easySaleUrl

export default {
  registUser(user, cb, errCb) {
    let model = axios.post(prefix + '/addUser', user);
    if (isFn(cb)) {
      model.then(cb);
    }
    if (isFn(errCb)) {
      model.catch(errCb);
    }
  },
  authorizeUser(user, cb, errCb) {
    let model = axios.post(prefix + '/authorizeUser', user);
    if (isFn(cb)) {
      model.then(cb);
    }
    if (isFn(errCb)) {
      model.catch(errCb);
    }
  },
  getVcode(phonenum, cb, errCb) {
    let model = axios.get(prefix + '/getVcode/' + phonenum);
    if (isFn(cb)) {
      model.then(cb);
    }
    if (isFn(errCb)) {
      model.catch(errCb);
    }
  },
  resetPwd(user, cb, errCb) {
    let model = axios.post(prefix + '/resetPwd', user);
    if (isFn(cb)) {
      model.then(cb);
    }
    if (isFn(errCb)) {
      model.catch(errCb);
    }
  },
//根据省获取相应的城市
  findJiupiCityByProvinceName(params={}){
    return axios.post(prefix+'/Register/findJiupiCityByProvinceName',params);
  },

  //获取可以开店的城市列表
  getListProvinceAndSubCity(params = {}) {
    return axios.post(prefix + '/Register/listProvinceAndSubCityDTO', params);
  },
  //获取验证码
  getIdentifyingCode(params = {}) {
    return axios.post(prefix + '/Register/identifyingCode', params);
  },
  //验证验证码是否正确
  checkValidateCode(params = {}) {
    return axios.post(prefix + '/Register/validateCode', params);
  },
  //注册
  finishRegister(params={}){
    return axios.post(prefix+'/Register/dealerRegister',params);
  },
  //登陆
  dealerLogin(params={}){
    return axios.post(prefix+'/Register/dealerlogin',params);
  },
  //忘记密码
  forgetPassword(params={}){
    return axios.post(prefix+'/Register/forgetPassword',params);
  }


}
