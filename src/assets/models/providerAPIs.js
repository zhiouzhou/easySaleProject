import axios from 'axios';
import Urls from './baseUrl'

const prefix = Urls.easySaleUrl
const config = {notShowLoading: true}

export default {
  //查询供应商列表
  getProviderList(params = {}) {
    return axios.post(prefix + '/supplier/ListSupplier', params, config);
  },
  //新增供应商列表
  addProvider(params = {}) {
    return axios.post(prefix + '/supplier/addSupplier', params);
  },
  //编辑供应商列表
  editProvider(params = {}) {
    return axios.post(prefix + '/supplier/updateSupplier', params);
  },
}
