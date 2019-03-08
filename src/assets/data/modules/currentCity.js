const state = {
  currentCity: {}
};

const getters = {

};

const mutations = {
  setCurrentCity(state, city) {
    state.currentCity = city
    localStorage.setItem('currentCity', JSON.stringify(city))
  },
  initCurrentCity(state) {
    let currentCity = localStorage.getItem('currentCity')
    if (currentCity) {
      state.currentCity = JSON.parse(currentCity)
    } else {
      state.currentCity = {id: 103, name: `武汉市`, jiupiCityFullName: `湖北省武汉市`}
    }
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
