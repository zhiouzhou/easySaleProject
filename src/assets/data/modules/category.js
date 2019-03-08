import http from "@/assets/models/productAPIs";

/**
 * 类目，品牌，产品信息，经销商基本产品库
 * @type {{categoryList: Array}}
 */
const state = {
  categoryList: [],
  defaultcategoryName: '',
  setDefaultbrandName: ''
};

const getters = {
  getProductList: (state) => (categoryName = ``, brandName = ``, searchWord = ``) => {
    if (!state.categoryList || !state.categoryList.length) return []
    //展开商品列表，将所有商品汇合到一个list
    let allBrandList = []
    for (let category of state.categoryList) {
      allBrandList = allBrandList.concat(category.listbrand)
    }
    let allProductList = []
    for (let brand of allBrandList) {
      allProductList = allProductList.concat(brand.productList)
    }
    //通过各种筛选条件选出想要的商品
    //类目是必须有的，品牌和关键字不一定
    let hasBrand = brandName !== `allBrand` && !!brandName
    let hasSearchWord = !!searchWord
    let resultArr = []
    allProductList.forEach(item => {
      let fitCategory = categoryName === `全部` ? true : item.categoryName === categoryName
      let fitBrand = (!hasBrand) || item.brandName === brandName
      let fitSearchWord = (!hasSearchWord) || item.productName.indexOf(searchWord) !== -1
      //类目符合，品牌符合，关键字符合 三个条件
      if (fitCategory && fitBrand && fitSearchWord) {
        resultArr.push(item)
      }
    })
    return resultArr
  }
};

const mutations = {
  setCategoryList(state, {categoryList}) {
    state.categoryList = categoryList
  },
  setDefaultName(state, defaultcategoryName) {
    state.defaultcategoryName = defaultcategoryName
  },
  setDefaultSelect(state, setDefaultbrandName) {
    state.setDefaultbrandName = setDefaultbrandName
  }
};

const actions = {
  //获取普通商品列表
  getCategoryList({commit, state}) {
    return http.getCategoryList()
      .then(data => {
        let resultCategoryList = data.data
        commit(`setCategoryList`, {categoryList: resultCategoryList})
        return Promise.resolve(resultCategoryList)
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
  //获取直配经销商商品列表
  getDirectMatchCategoryList({commit, state}) {
    return http.getCategoryList({dealerType: 1})
      .then(data => {
        let resultCategoryList = data.data
        commit(`setCategoryList`, {categoryList: resultCategoryList})
        return Promise.resolve(resultCategoryList)
      })
      .catch(e => {
        return Promise.reject(e)
      })
  },
};

/**
 * 为类目添加全部类目选项
 */
// function addItemToCategory(categoryList) {
//   let categories = categoryList
//   let newCategory = {categoryId: `allCategory`, categoryName: `全部`}
//   let allBrandList = []
//   categoryList.forEach(category => {
//     allBrandList=allBrandList.concat(category.listbrand)
//   })
//   newCategory.listbrand = allBrandList
//   categories.unshift(newCategory)
//   return categories
// }

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
