import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.easySaleUrl
const config = {notShowLoading: true}

export default {
  //获取首页店铺销售情况
  getHomepageUserState(params = {}) {
    return axios.post(prefix + '/User/GetUserStatis', params, config);
  },
}
