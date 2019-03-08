<template>
  <div style="background-color: #f6f6f6;display: flex;flex-direction: column;">
    <title-nav :title="title"></title-nav>
    <search-bar @onClickSearch="onSearch"></search-bar>
    <!--类目，商品-->
    <div class="main-content" v-if="categoryList.length">
      <div class="left">
        <left-sidebar :categoryList="categoryList"
                      :initId="currentCategoryId"
                      @select-id="onCategorySelected"
                      ref="categoryComponent"
                      v-if="currentCategoryId&&categoryList&&categoryList.length">
        </left-sidebar>
      </div>
      <div class="right">
        <!--品牌-->
        <brand-selecter :brandList="brandList"
                        :brandName="currentBrandId"
                        v-if="currentBrandId&&brandList&&brandList.length"
                        ref="brandComponent"
                        @select-brand="onBrandSelected"
                        style="margin-bottom: 0.16rem;">
        </brand-selecter>
        <div>
          <list-product v-for="item in productList"
                        type="select"
                        :key="item.productId"
                        :product="item"
                        :ref="item.productId"
                        @onProductSelected="onProductSelected"
          ></list-product>
        </div>
      </div>
    </div>
    <empty-view txt="暂无产品" v-else></empty-view>
    <div style="height: 1.31rem;"></div>
    <div class="button ft-45r color-fff" @click="confirmSelect">确认</div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import listProduct from "@/components/common/ListProduct"
  import searchBar from "@/components/common/SearchBar"
  import brandSelecter from "@/components/common/BrandSelecter"
  import EmptyView from "@/components/common/EmptyView"
  import leftSidebar from "@/components/common/LeftSidebar"
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  /**
   * 实现思路：
   * 1.进入页面前初始化数据
   * 2.根据传入的warehouseId去拿类目，品牌和产品列表，并初始化选中
   * 3.根据传入的isMulti属性判断当前选择产品是多选还是单选
   * 4.点确认的情况下，根据传入的callBack等参数，去修改vuex中对应文件的products，达到传递数据的效果
   * 5.退出页面的时候清空数据
   */

  export default {
    data() {
      return {
        title: `选择商品`,
        keyWord: ``,
        productList: [],
        isMulti: false,
        pageInitParams: null//传到当前页面的参数，里面包含callBackNameSpace，callBackFun，extraParams
      }
    },
    components: {
      'search-bar': searchBar,
      'title-nav': Navigator,
      'list-product': listProduct,
      'brand-selecter': brandSelecter,
      'left-sidebar': leftSidebar,
      EmptyView
    },
    mounted() {
      this.pageInitParams = this.$route.params
      console.log(this.pageInitParams)
      this.isMulti = this.pageInitParams.isMulti || false
      let warehouseId = this.pageInitParams.warehouseId || ``

      return Promise.resolve()
        .then(() => {
          if (warehouseId && warehouseId !== ``) return this.getCategoryListByWarehouse(warehouseId)
          else if(warehouseId == '') return this.getCategoryListByWarehouse()
          else return this.getCategoryList()
        })
        .then(data => {
          this.initData({data})
          this.$refs.categoryComponent && this.$refs.categoryComponent.updateSelectedId(this.currentCategoryId)
        })
        .then(() => this.updateProductList())
    },
    beforeDestroy() {
    },
    methods: {
      onSearch(searchText) {
        this.keyWord = searchText
      },
      onCategorySelected(id) {
        this.$refs.brandComponent && this.$refs.brandComponent.updateSelectedId(`allBrand`)
        this.$refs.categoryComponent && this.$refs.categoryComponent.updateSelectedId(id)
        this.setCurrentCategoryId({id})
      },
      onBrandSelected(id) {
        this.setCurrentBrandId({id})
        this.$refs.brandComponent.updateSelectedId(id)
      },
      onProductSelected(product, type, productId) {
        let index = this.productList.findIndex(item => item.productId === productId)
        if (index === -1) return
        let existInSelectProducts = this.selectProducts.findIndex(item => item.productId === productId) !== -1
        if (!existInSelectProducts) {
          if (this.isMulti) {
            this.$refs[`${productId}`][0].updateSelected(true)
          } else {
            let refs = this.$refs
            for (let key in refs) {
              refs[key] && refs[key].length && refs[key][0].updateSelected(key == productId)
            }
          }
          this.addSelectProduct({product, isMultiSelect: this.isMulti})
        } else if (existInSelectProducts) {
          if (this.isMulti) {
            this.$refs[`${productId}`][0].updateSelected(false)
          } else {
            let refs = this.$refs
            for (let key in refs) {
              refs[key].length && refs[key][0].updateSelected(false)
            }
          }
          this.removeSelectProduct({product})
        }
      },
      updateProductList() {
        this.productList = this.getProductList(this.currentCategoryId, this.currentBrandId, this.keyWord)
      },
      confirmSelect() {
        //点击确认按钮的时候触发回调
        this.$store.commit(`${this.pageInitParams.callBackNameSpace}/${this.pageInitParams.callBackFun}`,
          {products: this.selectProducts, ...(this.pageInitParams.extraParams || {})}
        )
        //清空数据
        this.resetData()
        // if (this.pageInitParams.fromPageName) {
        //   this.$router.push({name: `${this.pageInitParams.fromPageName}`, params: this.pageInitParams.fromPageParams})
        // } else {
        this.$router.go(-1)
        // }
      },
      ...mapActions(`category`, [`getCategoryList`]),
      ...mapActions(`categoryByWarehouse`, {getCategoryListByWarehouse: `getCategoryList`}),
      ...mapMutations(`selectProduct`, [`initData`, `resetData`, `setCurrentCategoryId`,
        `setCurrentBrandId`, `setSelectProducts`, `addSelectProduct`, `removeSelectProduct`]),

    },
    computed: {
      ...mapGetters(`selectProduct`, [`getProductList`]),
      ...mapState(`selectProduct`, [`categoryList`, `currentCategoryId`, `brandList`, `currentBrandId`, `selectProducts`])
    },
    watch: {
      currentCategoryId() {
        this.updateProductList()
      },
      currentBrandId() {
        this.updateProductList()
      },
      keyWord() {
        this.updateProductList()
      }
    }

  }
</script>


<style lang="stylus" scoped>
  .main-content {
    display flex;
    flex-direction row;
    justify-content space-between;
    flex: 1;
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
    height 100%;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;

    > div:last-child {
      flex 1;
      overflow scroll;
    }
  }

  .button {
    position: fixed;
    bottom 0;
    width 100%;
    height 1.31rem;
    line-height 1.31rem;
    background: rgba(0, 150, 255, 1);
    text-align center;
  }
</style>
