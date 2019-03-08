import http from '@/assets/models/userAPIs'

const state = {
  mobileNo: ``,
  //validateCode: ``,
  password: ``,
  confirmPassword: ``,

  dealerName: ``,
  address: ``,
  contacts: ``,
  contactsMobileNo: ``,
  cityId: ``,

  shopLogo: ``,
  shopName: ``,
  shopIntroduce: ``
};

const getters = {
  getMobileNo: state => {
    return state.mobileNo
  },
  getPassword: state => {
    return state.password
  },
  getConfirmPassword: state => {
    return state.confirmPassword
  },
  getDealerName: state => {
    return state.dealerName
  },

};

const mutations = {
  setMobileNo(state, {mobile}) {
    state.mobileNo = mobile;
  },
  // setValidateCode(state, {validate}) {
  //   state.validateCode = validate;
  // },
  setPassword(state, {passwordInfo}) {
    state.password = passwordInfo;
  },
  setConfirmPassword(state, {confirm}) {
    state.confirmPassword = confirm;
  },
  setDealerName(state, {dealer}) {
    state.dealerName = dealer;
  },
  setAddress(state, {address}) {
    state.address = address;
  },
  setContacts(state, {contact}) {
    state.contacts = contact;
  },
  setContactsMobileNo(state, {contactsMobile}) {
    state.contactsMobileNo = contactsMobile
  },
  setCityId(state, {id}) {
    state.cityId = id;
  },
  setShopLogo(state, {logo}) {
    state.shopLogo = logo;
  },
  setShopName(state, {name}) {
    state.shopName = name;
  },
  setShopIntroduce(state, {introduce}) {
    state.shopIntroduce = introduce;
  },
};

const actions = {
  setUserInfo({state}) {
    let {mobileNo, password, confirmPassword, dealerName, address, contacts, contactsMobileNo, cityId, shopLogo, shopName, shopIntroduce} = state;
    return http.finishRegister({
      param: {
        mobileNo,
        password,
        confirmPassword,
        dealerName,
        address,
        contacts,
        contactsMobileNo,
        cityId,
        imgId: shopLogo,
        shopName,
        shopIntroduce
      }
    })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
