<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <search-bar searchNoticeText="搜索商品"></search-bar>
    <div class="main-content" v-if="categoryList.length">
      <div class="left">
        <left-side-bar :categoryList="categoryList"
                       :initId="currentCategoryId"
                       v-if="currentCategoryId"
                       ref="categoryComponent"
                       @select-id="onSelectCategory"
        >
        </left-side-bar>
      </div>
      <div class="right">
        <div class="scroll-wrap">
          <cube-scroll
            ref="scroll"
            :data="productList"
            :options="scrollOptions">
            <num-product :product="product"
                         :ref="product.productId"
                         v-for="(product,index) in productList"
                         :key="product.productId"
                         @on-change="onProductNumChange"
            ></num-product>
          </cube-scroll>
        </div>
      </div>
    </div>
    <empty-view txt="暂无产品" v-else></empty-view>
    <pop-menu position="bottom" :edgeMargin="1.31" v-show="showPop" @on-dismiss="showPop=false">
      <div class="content-wrap">
        <div class="top-bar ft-35r color-666">
          <span>已选商品</span>
          <span @click="cleanProducts">清空</span>
        </div>
        <ul class="pop-content">
          <li class="select-item" v-for="(product,index) in storeProductList" :key="product.productId">
            <div class="top">
              <span class="ft-40r color-333 one-line" style="text-align: left;line-height: 110%;">{{product.productName}}</span>
              <span class="ft-35r color-666" style="min-width: 2rem;">{{product.specName}}</span>
            </div>
            <div class="bottom">
              <edit-num :editId="`bigUnitNum-${product.productId}`" :num="product.bigUnitNum"
                        :ref="`bigUnitNum-${product.productId}`"
                        @on-change="onStoreNumChange"></edit-num>
              <span class="ft-35r color-666">{{product.maxUnit}}</span>
              <edit-num :editId="`smallUnitNum-${product.productId}`" :num="product.smallUnitNum"
                        :ref="`smallUnitNum-${product.productId}`"
                        @on-change="onStoreNumChange"></edit-num>
              <span class="ft-35r color-666">{{product.minUnit}}</span>
            </div>
          </li>
        </ul>
      </div>
    </pop-menu>
    <div style="height: 1.31rem;"></div>
    <div class="bottom-bar">
      <div>
        <i class="icon icon-ic_dingdanliebiao" @click="showPop = !showPop"></i>
        <span v-show="bottomBarCornerNum">{{bottomBarCornerNum}}</span>
        <span class="ft-40r color-fff">{{bottomBarTxt}}{{bottomBarNum}}</span>
        <div class="confirm ft-45r color-fff" @click="onConfirm">选好了</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator"
  import LeftSidebar from "@/components/common/LeftSidebar"
  import SearchBar from "@/components/common/SearchBar"
  import EditNumListProduct from "@/components/common/EditNumListProduct"
  import EditNumber from "@/components/common/EditNumber"
  import PopMenu from "@/components/common/PopMenu"
  import EmptyView from "@/components/common/EmptyView"
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import {Scroll} from 'cube-ui'

  /**
   * 设计思路：
   * 通过传入的pageType确定是申请入库，申请出库还是委托配送
   * 页面上的产品列表有两个，主页面上的是productList
   * 弹框里的是storeProductList，当点击其中某个产品的加减框时，
   * 更新当前的列表，并将另一个列表的数据进行更新，添加或者删除
   */

  export default {
    name: 'WATchooseProduct',
    props: [],
    data() {
      return {
        title: '选择商品',
        pageType: ``,
        showPop: false,
        categoryList: [],
        currentCategoryId: ``,
        currentBrandId: ``,
        productList: [],
        storeProductList: []
      }
    },
    components: {
      'title-nav': Navigator,
      'num-product': EditNumListProduct,
      'edit-num': EditNumber,
      'cube-scroll': Scroll,
      'left-side-bar': LeftSidebar,
      SearchBar, PopMenu, EmptyView
    },
    mounted() {
      this.pageType = this.$route.params.type
      return Promise.resolve()
        .then(() => {
          //入库不需要校验库存
          if (this.pageType !== `inBound` && this.warehouseId && this.warehouseId !== ``) return this.getCategoryListByWarehouse(this.warehouseId)
          else return this.getCategoryList()
        })
        .then(data => {
          this.categoryList = data

          this.currentCategoryId = data && data[0].categoryName

          this.currentBrandId = `allBrand`
        })
        .catch(e => {
          console.log(e)
        })
    },
    methods: {
      onSelectCategory(id) {
        this.currentCategoryId = id
        this.currentBrandId = `allBrand`
      },
      onConfirm() {
        if (!this.storeProductList || !this.storeProductList.length) return this.$toast({message: `请选择产品`})
        let invalidProductList = []
        let allProductFitStock = this.storeProductList.every(product => {
          let bigUnitNum = product.bigUnitNum || 0
          let smallUnitNum = product.smallUnitNum || 0
          //商品是否超过库存
          let productFitStock = bigUnitNum * product.packageCount + smallUnitNum <= product.currentInventory
          if (!productFitStock) invalidProductList.push(product)
          return productFitStock
        })
        //出库和配送需要校验库存
        if (this.pageType !== `inBound` && !allProductFitStock) return this.$toast({message: `${invalidProductList[0].productName}没有足够库存`})
        this.setProductList({type: this.pageType, productList: this.storeProductList})
        this.$router.replace({path: `/WATchooseTime/${this.$route.params.type}`})
      },
      cleanProducts() {
        this.storeProductList = []
        if (this.productList.length) {
          this.productList.forEach(item => {
            item.bigUnitNum = 0
            item.smallUnitNum = 0
            this.updateShowNum(`productList`, item, 0, `bigUnitNum`)
            this.updateShowNum(`productList`, item, 0, `smallUnitNum`)
          })
        }
      },
      //编辑弹框产品的数量
      onStoreNumChange(value, editId) {
        let infoArr = editId.split('-')
        let unit = infoArr[0]
        let productId = infoArr[1]
        let index = this.storeProductList.findIndex(item => item.productId == productId)//productId是字符串
        if (index === -1) return

        //vue不能检测到数组元素内部属性的变化去触发计算属性，必须用这种写法才能生效
        let changeItem = this.storeProductList[index]
        changeItem[unit] = value
        if (!changeItem.bigUnitNum && !changeItem.smallUnitNum) {
          this.storeProductList.splice(index, 1)
          this.updateProductList(changeItem, 0, editId)
        } else {
          this.$set(this.storeProductList, index, changeItem)
          this.updateProductList(changeItem, value, editId)
        }
      },
      //编辑产品列表数量
      onProductNumChange(product, value, editId) {
        let index = this.productList.findIndex(item => item.productId === product.productId)
        if (index === -1) return
        this.productList[index][editId] = value
        this.updateStoreList(this.productList[index], value, editId)
      },
      //更新产品列表
      updateProductList(product, value, editId) {
        //此处的editId为 单位-productId
        let index = this.productList.findIndex(item => item.productId === product.productId)
        if (index === -1) return
        this.productList[index] = product
        this.updateShowNum(`productList`, product, value, editId)
      },
      //更新弹框产品列表
      updateStoreList(product, value, editId) {
        //此处的editId为 单位
        let isRemove = !product.bigUnitNum && !product.smallUnitNum
        let index = this.storeProductList.findIndex(item => item.productId === product.productId)
        // 1.移除 2.更新 3.新增
        if (isRemove && index !== -1) {
          this.storeProductList.splice(index, 1)
          this.updateShowNum(`storeList`, product, value, editId)
        } else if (!isRemove && index !== -1) {
          this.$set(this.storeProductList, index, product)
          this.updateShowNum(`storeList`, product, value, editId)
        } else if (!isRemove && index === -1) {
          this.storeProductList.push(product)
        }
      },
      //更新弹框内的数字显示,产品列表的ref值为产品的productId，弹框的ref值为 单位-productId
      updateShowNum(keyWord, product, value, editId) {
        let productId = product.productId
        //这里只用editId的第一个值，也就是单位
        let unit = editId.split(`-`)[0]
        if (keyWord === `productList`) {
          this.$refs[productId][0].updateValue(value, unit)
        } else if (keyWord === `storeList`) {
          this.$refs[`${unit}-${productId}`][0].updateValue(value)
        }
      },
      refreshProductList() {
        try {
          if (this.currentCategoryId === `全部`) {
            let allProducts = []
            this.categoryList.forEach(category => {
              category.listbrand && category.listbrand.length && category.listbrand.forEach(brand => {
                allProducts = allProducts.concat(brand.productList)
              })
            })
            this.productList = allProducts
          } else {
            let brandList = this.categoryList.find(item => item.categoryName === this.currentCategoryId).listbrand
            if (this.currentBrandId === `allBrand`) {
              let allProducts = []
              brandList.forEach(item => allProducts = allProducts.concat(item.productList))
              this.productList = allProducts
            } else {
              this.productList = brandList.find(item => item.brandName === this.currentBrandId).productList
            }
          }

        } catch (e) {
          this.productList = []
        }
      },
      ...mapMutations(`WATorder`, [`setProductList`]),
      ...mapActions(`category`, [`getCategoryList`]),
      ...mapActions(`categoryByWarehouse`, {getCategoryListByWarehouse: `getCategoryList`}),
    },
    computed: {
      warehouseId() {
        if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].warehouse.warehouseId
      },
      brandList() {
        try {
          return this.categoryList.find(item => item.categoryName === this.currentCategoryId).listbrand
        } catch (e) {
          return []
        }
      },
      scrollOptions() {
        let defaultOptions = this.$store.state.scrollOptions.defaultOptions
        defaultOptions.pullUpLoad = false
        defaultOptions.pullDownRefresh = false
        return defaultOptions
      },
      bottomBarTxt() {
        return this.pageType === `outBound` ? `出库数量` : this.pageType === `inBound` ? `入库数量` : `配送数量`
      },
      bottomBarNum() {
        let bigNum = this.storeProductList.reduce((init, current) => init + (current.bigUnitNum || 0), 0)
        let smallNum = this.storeProductList.reduce((init, current) => init + (current.smallUnitNum || 0), 0)
        let bigNumStr = bigNum ? `${bigNum}件` : ``
        let smallNumStr = smallNum ? `${smallNum}瓶` : ``
        return bigNum === 0 && smallNum === 0 ? `0件` : `${bigNumStr}${smallNumStr}`
      },
      bottomBarCornerNum() {
        let bigNum = this.storeProductList.reduce((init, current) => init + (current.bigUnitNum || 0), 0)
        let smallNum = this.storeProductList.reduce((init, current) => init + (current.smallUnitNum || 0), 0)
        return bigNum + smallNum
      },
    },
    watch: {
      currentCategoryId() {
        this.refreshProductList()
      },
      currentBrandId() {
        this.refreshProductList()
      }
    }
  }
</script>


<style lang="stylus" scoped>

  .page {
    height: 100%;
    display flex;
    flex-direction column;
    align-items stretch;
    justify-content flex-start;
    background-color #f6f6f6;
  }

  .main-content {
    flex 1;
    display flex;
    flex-direction row;
    justify-content flex-start;
    align-items flex-start;
    .left {
      height 100%;
      width 2.4rem;
      background-color #fff;
    }
    .right {
      padding .16rem;
      box-sizing border-box;
      flex 1;
      height 100%;
      display flex;
      flex-direction column;
      justify-content flex-start;
      align-items stretch;
    }
  }

  .scroll-wrap {
    height 100%;
    width 100%;
    overflow hidden;
  }

  .bottom-bar {
    height 1.34rem;
    width 100%;
    background-color rgba(0, 0, 0, .6);
    position fixed;
    bottom 0;
    z-index 100;
    > div {
      position relative;
      width 100;
      height 100%;
      > i {
        position absolute;
        left .32rem;
        top -.48rem;
      }
      span:nth-of-type(1) {
        height: .43rem;
        position absolute;
        top -.16rem;
        left: 1.25rem;
        background: rgba(250, 111, 49, 1);
        border-radius: .22rem;
        text-align center;
        line-height .43rem;
        font-size .35rem;
        color: #fff;
        padding 0 .16rem;
      }
      > span {
        position absolute;
        left 1.97rem;
        top 50%;
        transform translateY(-50%);
      }
      > div {
        position absolute;
        right 0;
        height 100%;
        width 2.67rem;
        background-color #0096FF;
        text-align center;
        line-height 1.31rem;
      }
    }
  }

  .content-wrap {
    background-color #fff;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    overflow hidden;
    height 60%;
  }

  .top-bar {
    height 1.07rem;
    width 100%;
    display: flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    background-color #f6f6f6;
    padding 0 .32rem;
  }

  .pop-content {
    overflow scroll;
    flex 1;
    padding 0 .32rem;
    box-sizing border-box;
  }

  .select-item {
    padding .32rem 0;
    box-sizing border-box;
    border-bottom 1px solid #ededed;
    .top {
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
    }
    .bottom {
      display flex;
      flex-direction row;
      justify-content flex-start;
      align-items center;
      > span {
        margin 0 .16rem;
      }
    }
    > div:first-child {
      margin-bottom .32rem;
    }
  }
</style>
