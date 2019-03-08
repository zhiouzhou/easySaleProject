import http from "@/assets/models/productAPIs";
import category from "./category";

/**
 * 根据仓库拿类目，品牌，产品，其中只返回有库存的部分，跟基本产品库有所区别
 * @type {{categoryList: Array, currentCategoryId: string, brandList: Array, currentBrandId: string, productList: Array}}
 */
const state = {
  categoryList: [],
  currentCategoryId: ``,
  brandList: [],
  currentBrandId: ``,
  productList: []
};

const getters = {
  categoryList: (state) => {
    return state.categoryList
  },
  currentCategoryId: (state) => {
    return state.currentCategoryId
  },
  brandList: (state) => {
    if (!state.currentCategoryId || !state.categoryList || !state.categoryList.length) return []
    let targetCategory = state.categoryList.filter(item => item.categoryName === state.currentCategoryId)
    return targetCategory.length ? targetCategory[0].listbrand : []
  },
  currentBrandId: (state) => {
    return state.currentBrandId
  },
  getProductList: (state) => (keyWord) => {
    let unFilterProductList = []
    if (state.currentCategoryId === `全部`) {
      state.categoryList.forEach(category => {
        category.listbrand.forEach(brand => {
          unFilterProductList = unFilterProductList.concat(brand.productList)
        })
      })
    } else {
      if (state.currentBrandId === `allBrand`) {
        for (let brand of state.brandList) {
          unFilterProductList = unFilterProductList.concat(brand.productList)
        }
      } else {
        let targetBrand = state.brandList.filter(item => item.brandName === state.currentBrandId)
        unFilterProductList = targetBrand && targetBrand.length ? targetBrand[0].productList : []
      }
    }

    return unFilterProductList.filter(item => item.productName.indexOf(keyWord) !== -1)
  },
};

const mutations = {
  setCategoryList(state, {categoryList}) {
    state.categoryList = categoryList
  },
  setCurrentCategoryId(state, {id}) {
    state.currentCategoryId = id
    let allProducts = []
    if (id === `全部`) {
      state.brandList = []
      state.currentBrandId = `allBrand`
      state.categoryList.forEach(category => {
        category.listbrand.forEach(brand => {
          allProducts = allProducts.concat(brand.productList)
        })
      })
      state.productList = allProducts
    } else {
      let targetCategory = state.categoryList.filter(item => item.categoryName === id)
      state.brandList = targetCategory.length && targetCategory[0].listbrand
      state.currentBrandId = `allBrand`
      state.productList = state.brandList.length && state.brandList[0].productList
    }
  },
  setBrandList(state, {brandList}) {
    state.brandList = brandList
  },
  setCurrentBrandId(state, {id}) {
    let targetBrand = state.brandList.filter(item => item.brandName === id)
    state.currentBrandId = id
    state.productList = targetBrand.length && targetBrand.productList
  },
  setProductList(state, {productList}) {
    state.productList = productList
  },
  cleanCategory(state) {
    state.categoryList = []
    state.currentCategoryId = ``
    state.brandList = []
    state.currentBrandId = ``
    state.productList = []
  }
};

const actions = {
  getCategoryList({commit, state}, id) {
    //调用接口拿到数据
    return http.getCategoryListByWarehouse({param: id})
      .then(data => {
        //存到vuex里面
        let categoryList = data.data || []
        if (!categoryList || !categoryList.length) return Promise.resolve([])
        commit(`setCategoryList`, {categoryList})
        commit(`setCurrentCategoryId`, {id: categoryList[0].categoryName})
        commit(`setBrandList`, {brandList: categoryList[0].listbrand})
        commit(`setCurrentBrandId`, {id: `allBrand`})
        commit(`setProductList`, {productList: categoryList[0].listbrand[0].productList})
        //返回调用者想要的数据
        return Promise.resolve(categoryList)
      })
      .catch(e => {
        return Promise.reject(e)
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
