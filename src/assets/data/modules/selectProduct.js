/**
 * 选择商品页面
 * @type {{categoryList: Array, currentCategoryId: string, brandList: Array, currentBrandId: string, productList: Array, selectProducts: Array}}
 */
const state = {
  categoryList: [],
  currentCategoryId: ``,
  brandList: [],
  currentBrandId: ``,
  productList: [],
  selectProducts: []//以数组形式保存
};

const getters = {
  getProductList: (state) => (categoryName = ``, brandName = ``, searchWord = ``) => {
    if (!state.categoryList || !state.categoryList.length) return []
    let allProductList = getAllProducts(state.categoryList)
    let fitProducts = getFitProducts(allProductList, categoryName, brandName, searchWord)
    return initProductSelectState(state, fitProducts)
  }
};

//获取全部商品列表
function getAllProducts(categoryList) {
  //展开商品列表，将所有商品汇合到一个list
  let allBrandList = []
  for (let category of categoryList) {
    allBrandList = allBrandList.concat(category.listbrand)
  }
  let allProductList = []
  for (let brand of allBrandList) {
    allProductList = allProductList.concat(brand.productList)
  }
  return allProductList
}

//获取符合条件的商品列表
function getFitProducts(allProductList, categoryName, brandName, searchWord) {
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

//初始化商品的选择状态
function initProductSelectState(state, products) {
  return products.map(item => {
    let exist = state.selectProducts.findIndex(product => product.productId === item.productId) !== -1
    item.selected = exist
    return item
  })
}

const mutations = {
  //初始化选择商品页面的数据
  initData(state, {data}) {
    if (!data || !data.length) return mutations.resetData(state)
    let categoryList = data
    state.categoryList = categoryList
    state.currentCategoryId = categoryList[0].categoryName
    state.brandList = categoryList[0].listbrand
    state.currentBrandId = `allBrand`
    state.productList = categoryList[0].listbrand[0].productList
    state.selectProducts = []
  },
  resetData(state) {
    state.categoryList = []
    state.currentCategoryId = ``
    state.brandList = []
    state.currentBrandId = ``
    state.productList = []
    state.selectProducts = []
  },
  setCategoryList(state, {list}) {
    state.categoryList = list
  },
  setCurrentCategoryId(state, {id}) {
    state.currentCategoryId = id
    let targetCategory = state.categoryList.find(item => item.categoryName === id)
    let newBrandList = targetCategory && targetCategory.listbrand && targetCategory.listbrand.length ? targetCategory.listbrand : []
    state.brandList = newBrandList
    state.currentBrandId = `allBrand`
  },
  setBrandList(state, {list}) {
    state.brandList = list
  },
  setCurrentBrandId(state, {id}) {
    state.currentBrandId = id
  },
  setProductList(state, {list}) {
    state.productList = list
  },
  setSelectProducts(state, {list}) {
    state.selectProducts = list
  },
  addSelectProduct(state, {product, isMultiSelect}) {
    //单选多选切换
    if (isMultiSelect) {
      state.selectProducts.push(product)
    } else {
      state.selectProducts = [product]
    }
  },
  removeSelectProduct(state, {product}) {
    let index = state.selectProducts.findIndex(item => item.productId === product.productId)
    if (index !== -1) state.selectProducts.splice(index, 1)
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


