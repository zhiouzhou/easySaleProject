<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <div class="product">
      <img class="img"
           :src="product.imageUrl||`../../static/icons/defaul_product.png`"/>
      <div class="content">
        <span class="ft-40r color-333 two-line" style="line-height: 1.1;">{{product.productName}}</span>
        <div>
          <span class="ft-35r color-666">规格：{{product.specName}}</span>
          <span class="ft-35r color-666" style="margin-left: 0.43rem;" v-if="!product.inventory">库存：<span class="ft-35r color-FA6F31">
            {{ totalCountMinUnit|showStockBySpec(product.specName,product.packageCount)}}</span>
          </span>

          <span class="ft-35r color-666" style="margin-left: 0.43rem;" v-if="product.inventory">库存：<span class="ft-35r color-FA6F31">{{product.inventory}}</span></span>
        </div>
      </div>
    </div>

    <div class="scroll-wrap">
      <cube-scroll
        ref="scroll" :data="stockDetailList" :options="scrollOptions"
        @pulling-down="onPullingDown" @pulling-up="onPullingUp">
        <ul class="stock-details" v-for="item in stockDetailList">
          <li class="stock-detail">
            <div class="ft-35r color-999" style="text-align: left;">{{item.createtime}}</div>
            <div class="ft-37r detail">
          <span class="color-333">{{item.ordertype===7?'盘点':item.ordertype===101?'新增出库':item.ordertype===102?'新增入库':'其他'}}：
            <span
              :class="[item.ordertype==101?'color-E53935':'color-2F9B60']">{{item.totalcount|showStock(item.packagename,item.unitName,item.packagequantity)}}</span>
          </span>
              <span class="color-333">库存：{{item.sourcetotalcount|showStock(item.packagename,item.unitName,item.packagequantity)}}</span>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
  //库存明细
  import Navigator from '@/components/common/Navigator'
  import http from "../../assets/models/stockAPIs";
  import {mapState, mapMutations, mapActions} from 'vuex'
  import {Scroll} from "cube-ui"


  export default {
    name: `stockDetail`,
    data() {
      return {
        title: `库存明细`,
        productSkuId: ``,
        warehouseId: ``,
        product: {},
        totalCountMinUnit:``,
        imgUrl:``,
        stockDetailList: [],
        pageNum: 1,
        pageSize: 50,
        pager: {}
      }
    },
    props: [],
    components: {
      'title-nav': Navigator,
      'cube-scroll': Scroll,
    },
    mounted() {
      this.product = this.$route.query.product
      console.log(this.$route.query.product)
      this.warehouseId = this.$route.params.warehouseId
      this.updateDetailList()
    },
    methods: {
      onPullingDown() {
        this.pageNum = 1
        this.updateDetailList()
      },
      onPullingUp() {
        let originalNum = this.pageNum
        this.pageNum = ++originalNum
      },
      updateDetailList() {
        let param = {
          productSpecificationId: this.product.productInfoSpecId,
          warehouseId: this.warehouseId,
          productSkuId: this.product.productId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        if (this.pager.totalPage && this.pageNum > this.pager.totalPage) return this.$refs.scroll.forceUpdate()
        http.getStockDetail(param).then(data => {
          console.log(data.data.list.dataList)
          this.totalCountMinUnit = data.data.productDetail.totalCountMinUnit
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          if (!data.data || !data.data.list.dataList || !data.data.list.dataList.length) return
          if (this.pageNum === 1) {
            this.stockDetailList = data.data.list.dataList
          } else {
            this.stockDetailList = this.stockDetailList.concat(data.data.list.dataList)
          }
          this.pager = data.data.list.pager
        })
      },

    },
    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },

    },
    watch: {
      pageNum() {
        this.updateDetailList()
      },
    }
  }
</script>


<style lang="stylus" scoped>
  .page {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    background-color #f6f6f6;
  }

  .product {
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    padding 0.32rem;
    box-sizing border-box;
    margin-bottom .32rem;
  }

  .img {
    width 1.92rem;
    height 1.92rem;
    margin-right 0.21rem;
  }

  .content {
    flex 1;
    height 1.92rem;
    display flex;
    flex-direction column;
    justify-content space-between;
    > span, > div {
      text-align left;
    }
  }

  .scroll-wrap {
    flex 1;
    overflow hidden;
  }

  .stock-details {
    margin-top: 0.16rem;
  }

  .stock-detail {
    background-color #fff;
    padding 0.32rem;
    box-sizing border-box;
    border-bottom 1px solid rgba(0, 0, 0, 0.1)
  }

  .detail {
    width 100%;
    margin-top: 0.21rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

</style>
