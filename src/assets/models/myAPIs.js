import axios from 'axios';
import {isFn} from "@/scripts/utils";
import Urls from './baseUrl'

const prefix = Urls.easySaleUrl
const config = {notShowLoading: true}

export default {
  //消息栏目列表
  getSimpleMessage(params = {}) {
    return axios.post(prefix + '/Notice/ListNoticeColumn', params);
  },
  //单个类型消息列表
  getMessageList(params = {}) {
    return axios.post(prefix + '/Notice/ListNotice', params);
  },
  //备货消息列表
  getStockNoticeList(params = {}) {
    return axios.post(prefix + '/Notice/listStockNotice', params);
  },
  //阅读消息
  readMessage(params = {}) {
    return axios.post(prefix + '/Notice/Read', params);
  },
  //查询经销商员工列表
  getEmployeeList(params = {}) {
    return axios.post(prefix + '/Employee/ListEmployee', params);
  },
  //新增经销商员工列表
  addEmployee(params = {}) {
    return axios.post(prefix + '/Employee/AddEmployee', params);
  },
  //禁用经销商员工
  disableEmployee(params = {}) {
    return axios.post(prefix + '/Employee/DisableEmployee', params);
  },
  //启用经销商员工
  enableEmployee(params = {}) {
    return axios.post(prefix + '/Employee/EnableEmployee', params);
  }
}
