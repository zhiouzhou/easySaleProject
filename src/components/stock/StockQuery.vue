<template>
  <div class="page">
    <title-nav v-bind:title="title"></title-nav>
    <search-bar @onClickSearch="onSearch"></search-bar>
    <!--下拉菜单-->
    <drop-menu :menuData="dropMenuData" :edgeMargin="3.4633"
               @on-select-menu="onSelectMenuItem"
               v-if="showByWareHouse&&dropMenuData&&dropMenuData.length">
    </drop-menu>
    <!--类目，商品-->
    <div class="main-content" v-if="categoryList&&categoryList.length">
      <div class="left">
        <left-sidebar :categoryList="categoryList"
                      :initId="currentCategoryId"
                      v-if="categoryList&&categoryList.length"
                      ref="categorySelecter"
                      @select-id="onCategorySelected">
        </left-sidebar>
      </div>
      <div class="right">
        <!--品牌-->
        <brand-selecter :brandList="brandList" @select-brand="onBrandSelected"
                        v-if="currentBrandId&&brandList&&brandList.length"
                        :brandName="currentBrandId"
                        ref="brandSelecter"
                        style="margin-bottom: 0.16rem;">

        </brand-selecter>
        <div v-if="productList.length">
          <list-product v-for="item in productList"
                        :ref="`product-${item.productId}`"
                        :isShowStock="showByWareHouse"
                        :type="showByWareHouse?'normal':'extand'"
                        :key="item.productId"
                        :product="item"
                        @onProductSelected="onProductSelected"
          ></list-product>
        </div>
        <empty-view txt="暂无库存" v-else></empty-view>
      </div>
    </div>
    <empty-view txt="暂无产品" v-else></empty-view>
    <!--切换商品查询和仓库查询的悬浮图标-->
    <i :class="['float-button','icon',showByWareHouse?'icon-ic_aspc':'icon-ic_ackc']"
       @click="switchShowType"></i>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import DropMenu from "@/components/common/DropMenu"
  import listProduct from "@/components/common/ListProduct"
  import searchBar from "@/components/common/SearchBar"
  import popMenu from "@/components/common/PopMenu"
  import brandSelecter from "@/components/common/BrandSelecter"
  import leftSidebar from "@/components/common/LeftSidebar"
  import EmptyView from "@/components/common/EmptyView"
  import {Popup} from "cube-ui"
  import {mapState, mapGetters, mapMutations, mapActions} from "vuex"
  import http from '@/assets/models/productAPIs'

  export default {
    data() {
      return {
        title: `库存查询`,
        showByWareHouse: false,
        keyWord: ``,
        productList: []
      }
    },
    props: [],
    components: {
      'search-bar': searchBar,
      'title-nav': Navigator,
      'pop-menu': popMenu,
      'list-product': listProduct,
      'brand-selecter': brandSelecter,
      'left-sidebar': leftSidebar,
      'cube-pop': Popup,
      DropMenu, EmptyView
    },
    mounted() {
      this.switchShowType()
    },
    methods: {
      switchShowType() {
        this.showByWareHouse = !this.showByWareHouse
        if (this.showByWareHouse) {
          this.getWarehouseListByDealer({
            pageNum: 1, pageSize: 20, cityId: this.cityId, warehouseChooseType: 1
          })
            .then(() => {
              if (!this.currentWarehouseId) {
                this.cleanCategory()
                this.refreshProductList()
                return Promise.reject(`暂无仓库`)
              } else {
                return Promise.resolve(this.currentWarehouseId)
              }
            })
            .then(() => this.getCategoryList(this.currentWarehouseId))
            .then(() => this.refreshProductList())
            .catch(e => {
              this.$toast({message: e})
            })
        } else {
          this.getCategoryList()
            .then(() => this.refreshProductList())
        }
      },
      onSearch(searchText) {
        this.keyWord = searchText.trim()
        this.refreshProductList()
      },
      onCategorySelected(id) {
        this.setCurrentCategoryId({id})
      },
      onBrandSelected(brandName) {
        this.setCurrentBrandId({id: brandName})
      },
      onProductSelected(product, type) {
        if (type === `normal`) {
          if (!this.currentWarehouseId) {
            this.$toast({message: `请选择仓库`})
          } else {
            this.$router.push({path: `/stockDetail/${this.currentWarehouseId}`, query: {product}})
          }
        } else {
          let index = this.productList.findIndex(item => item.productId === product.productId)
          let finalBoolean = !this.productList[index].selected
          this.productList[index].selected = finalBoolean
          this.$refs[`product-${product.productId}`][0].updateSelected(finalBoolean)
          if (finalBoolean) {
            this.getStockFromEveryWarehouse(product, index)
          }
        }
      },
      getStockFromEveryWarehouse(product, index) {
        http.getStockFromEveryWarehouse({
          pageNum: 1,
          pageSize: 60,
          productSpecificationId: product.productInfoSpecId
        })
          .then(data => {
            let stockList = data.data.dataList || []
            this.productList[index].stockList = stockList
            this.$refs[`product-${product.productId}`][0].updateStockList(stockList)
          })
      },
      onSelectMenuItem(keyWord, menuId) {
        if (keyWord === `warehouse`) {
          this.setCurrentWarehouseId({id: menuId})
        }
      },
      refreshProductList() {
        this.productList = this.originalProductList
      },
      ...mapMutations('cityAndWarehouse', [`setCurrentWarehouseId`]),
      ...mapMutations('categoryByWarehouse', [`setCurrentCategoryId`, `setBrandList`, `setCurrentBrandId`, `cleanCategory`]),
      ...mapActions(`cityAndWarehouse`, [`getWarehouseListByDealer`]),
      ...mapActions(`categoryByWarehouse`, [`getCategoryList`]),
    },
    computed: {
      cityId() {
        if (this.currentCity) {
          return this.currentCity.id
        }
      },
      dropMenuData() {
        let store = this.$store.state.cityAndWarehouse
        if (!store.warehouseList || !store.warehouseList.length) return
        let warehouseList = store.warehouseList.map(item => {
          item.menuId = item.id
          item.menuName = item.name
          return item
        })
        let warehouseMenu = {keyWord: `warehouse`, warehouseList}
        return [warehouseMenu]
      },
      originalProductList() {
        return this.getProductList(this.keyWord)
      },
      ...mapState(`currentCity`, [`currentCity`]),
      ...mapState(`cityAndWarehouse`, [`currentWarehouseId`]),
      ...mapGetters(`categoryByWarehouse`, [`categoryList`, `currentCategoryId`, `brandList`, `currentBrandId`, `getProductList`])
    },
    watch: {
      //仓库改变的时候会刷新类目品牌商品列表
      currentWarehouseId(newValue) {
        if (!newValue) return
        this.getCategoryList(newValue)
          .then(() => this.refreshProductList())
      },
      currentCategoryId(newValue) {
        if (this.$refs.categorySelecter && newValue) {
          this.$refs.categorySelecter.updateSelectedId(newValue)
          this.refreshProductList()
        }
      },
      currentBrandId(newValue) {
        if (this.$refs.brandSelecter && newValue) {
          this.$refs.brandSelecter.updateSelectedId(newValue)
          this.refreshProductList()
        }

      }
    }
  }
</script>


<style lang="stylus" scoped>
  .page {
    background-color #f6f6f6;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
  }

  .main-content {
    flex 1;
    display flex;
    flex-direction row;
    justify-content space-between;
  }

  .left {
    width 2.4rem;
    height: 100%;
    background-color #fff;
  }

  .right {
    flex 1;
    padding 0.16rem;
    box-sizing border-box;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    > div:last-child {
      flex 1;
      overflow scroll;
    }
  }

  .float-button {
    position fixed;
    bottom 2.11rem;
    right 0.29rem;
    z-index 5;
  }

</style>
