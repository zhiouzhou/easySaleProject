<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <div class="header">盘点单号：{{orderNo}}</div>
    <ul class="list">
      <li v-for="product in productList">
        <div>
          <span class="ft-40r color-333 two-line" style="line-height: 100%;">{{product.productSkuName}}</span>
          <span class="ft-35r color-666">规格：{{product.productSkuSpecName}}</span>
        </div>
        <div>
          <span class="ft-35r color-666">
            盘前库存：
            {{product.currentInventory|showStock(product.theBigUnit,product.theSmallUnit,product.theUnitQuantity)}}
          </span>
          <span class="ft-35r color-666">
            盘后库存：
            {{product.afterInventory|showStock(product.theBigUnit,product.theSmallUnit,product.theUnitQuantity)}}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import http from "@/assets/models/stockAPIs";


  export default {
    name: 'StockCheckDetail',
    props: [],
    data() {
      return {
        title: '盘点记录',
        orderNo: ``,
        productList: []
      }
    },
    components: {
      'title-nav': Navigator
    },
    mounted() {
      this.orderNo = this.$route.params.orderNo
      this.getDetail(this.orderNo)
    },
    methods: {
      getDetail(orderNo) {
        return http.stockCheckDetail({takingNo:orderNo})
          .then(data => {
            let products = data.data || []
            products.forEach(item => {
              let unitStr = item.productSkuSpecName.substr(-3)
              item.minUnit = unitStr.split(`/`)[0]
              item.packageUnit = unitStr.split(`/`)[1]
              return item
            })
            this.productList = products
          })
      }
    },
    computed: {},
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

  .header {
    height 1.17rem;
    padding 0 .32rem;
    line-height 1.17rem;
    text-align left;
    color #333;
    font-size .35rem;
  }

  .list {
    flex 1;
    overflow-y scroll;

    > li {
      background-color #fff;
      margin-bottom .16rem;

      > div:first-child {
        display flex;
        flex-direction column;
        justify-content flex-start;
        align-items flex-start;
        padding .32rem;
        box-sizing border-box
        border-bottom .01rem solid #ededed;

        > span:first-child {
          margin-bottom .32rem;
        }
      }

      > div:last-child {
        height 1.17rem;
        display flex;
        flex-direction row;
        justify-content space-between;
        align-items center;
        padding 0 .32rem;
        box-sizing border-box
      }
    }
  }

</style>
