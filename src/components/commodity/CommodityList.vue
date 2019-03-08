<template>
  <div id="commodityList">
    <div style="position: fixed; width: 100%;">
      <title-nav v-bind:title="title"></title-nav>
      <search-bar @onClickSearch="onClickSearch"
                  :productList="productList"></search-bar>
    </div>
    <div style="height: 2.34rem;"></div>
    <div class="commodity-list" v-if="categoryList&&categoryList.length">
      <left-side-bar :categoryList='categoryList'
                     :initId="selectedCategoryName"
                     v-if="categoryList&&categoryList.length"
                     @select-id="onSelectCategoryId"></left-side-bar>
      <div class="list-right">
        <brand-select :brandList="currentBrandList"
                      :brandName="selectedBrandName"
                      v-if="currentBrandList&&selectedCategoryName"
                      ref="brandComponent"
                      @select-brand="onBrandSelected"
                      style="margin-bottom: 0.16rem;">
        </brand-select>
        <div class="productList">
          <list-product v-for="item in productList"
                        type="normal"
                        :key="Math.random()+`-${item.productId}`"
                        :product="item"
                        @onProductSelected="onProductSelected"
          ></list-product>
        </div>
      </div>
    </div>
    <empty-view v-else></empty-view>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import EmptyView from "@/components/common/EmptyView";
  import listProduct from "@/components/common/ListProduct"
  import searchBar from "@/components/common/SearchBar"
  import leftSidebar from "@/components/common/LeftSidebar"
  import brandSelect from "@/components/common/BrandSelecter"
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';


  export default {
    name: "commodity-list",
    data() {
      return {
        transitionName: "slide-left",
        title: '商品列表',
        value: '',
        selectBrand: false,
        selectedBrandName: `allBrand`,
        selectedCategoryName: '',
        initId: "",
        searchWord: '',
        categoryList: [],
        currentBrandList: [],    //当前品牌列表

        productList: [],    //商品列表
      }
    },
    components: {
      EmptyView,
      'title-nav': Navigator,
      'list-product': listProduct,
      'search-bar': searchBar,
      'left-side-bar': leftSidebar,
      'brand-select': brandSelect,
    },
    methods: {
      onSelectCategoryId(name) {
        this.selectedCategoryName = name;
        let selectIndex = this.categoryList.findIndex(item => item.categoryName == name)
        this.currentBrandList = selectIndex !== -1 && this.categoryList[selectIndex].listbrand
        this.$refs.brandComponent && this.$refs.brandComponent.updateSelectedId(`allBrand`)
        this.selectedBrandName = `allBrand`
      },
      onProductSelected(product, type, productId) {
        //选择或者展开
        if (type === `select` || type === `extand`) {
          let hasSelectedIndex = this.productList.findIndex(item => item.selected)
          let index = this.productList.findIndex(item => item.id == product.id)
          if (hasSelectedIndex !== index) {
            if (hasSelectedIndex !== -1) this.productList[hasSelectedIndex].selected = false
            this.productList[index].selected = !this.productList[index].selected
          }
        } else {
          //商品列表跳商品详情
          this.$router.push({name: `commodityDetail`, query: {productId, isDirectMatch: this.isDirectMatch.toString()}})
        }
        this.setDefaultSelect(this.selectedBrandName)
        this.setDefaultName(this.selectedCategoryName)
      },
      onClickSearch(searchText) {
        this.searchWord = searchText
        this.changeProductList()
      },
      onBrandSelected(brandName) {
        this.selectedBrandName = brandName;
      },
      changeProductList() {
        this.productList = this.getProductList(this.selectedCategoryName, this.selectedBrandName, this.searchWord)
      },
      ...mapMutations(`category`, [`setDefaultSelect`, `setDefaultName`]),
      ...mapActions(`category`, [`getDirectMatchCategoryList`, `getCategoryList`])
    },
    mounted() {
      return Promise.resolve()
        .then(() => {
          if (this.isDirectMatch) {
            return this.getDirectMatchCategoryList()
          } else {
            return this.getCategoryList()
          }
        })
        .then(data => {
          this.categoryList = data
          if (this.$route.params.categoryName) {
            this.selectedCategoryName = this.$route.params.categoryName
          } else if (data && data.length) {
            this.selectedCategoryName = data[0].categoryName
          }
          if (this.$route.params.brandFlag === 'all') {
          } else {
            this.selectedBrandName = this.$route.params.brandName || this.selectedBrandName
          }
          let targetCategory = this.categoryList.find(item => item.categoryName === this.selectedCategoryName)
          if (targetCategory) {
            this.currentBrandList = targetCategory.listbrand
          } else {
            this.currentBrandList = []
          }
          this.changeProductList()
        })
        .catch(e => {
          console.log(e)
        })
    },
    computed: {
      isDirectMatch() {
        return this.$route.query.pageType === `directMatch`
      },
      ...mapGetters('category', ['getProductList']),
      ...mapState(`category`, [`setDefaultbrandName`, `defaultcategoryName`])
    },
    watch: {
      selectedCategoryName() {
        this.changeProductList()
      },
      selectedBrandName() {
        this.changeProductList()
      },
    }

  }
</script>

<style scoped lang="stylus">
  #commodityList {
    display: flex;
    flex-direction: column;
    background: #f6f6f6;
  }

  .commodity-list {
    flex: 1;
    display: flex;
    flex-direction: row;
    .list-left {
      width: 2.4rem;
      background: #fff;
      li {
        width: 100%;
        padding: 0.37rem;
        border-bottom 1px solid rgba(0, 0, 0, .1)
        color: #333;
        font-size: 0.4rem;
        position: relative;
        i {
          display: block;
          background: #0096FF;
          width: 0.05rem;
          height: 0.53rem;
          position: absolute;
          left: 0;
          top: 0.29rem;
        }
      }
    }
    .list-right {
      margin: 0.16rem;
      flex: 1;
      margin-left: 2.56rem;
    }
  }

  .productList {
    background: #fff;

  }
</style>
