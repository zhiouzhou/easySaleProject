<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <div class="header">
      <span class="ft-43r color-333" v-if="orderDetail">{{orderNoTxt}}：{{orderDetail.noteno}}</span>
      <span class="ft-35r color-666" v-if="orderDetail">{{orderTimeTxt}}：{{orderDetail.storetime}}</span>
    </div>
    <ul class="list-wrap">
      <li class="list-item" v-for="product in productList">
        <div class="product-detail">
          <span class="ft-40r color-333 one-line" style="margin-right: .32rem;line-height: 110%;">{{product.productName}}</span>
          <div :class="orderType===1?`color-2F9B60`:`color-E53935`" style="min-width: 1rem;">
            <span>{{orderType===1?`+`:`-`}}</span>
            <span>{{product.stockCount|showStock(product.packageName,product.unitName,product.packageQuantity)}}</span>
          </div>
        </div>
        <div class="stock-info">
          <span class="ft-35r color-666">规格：{{product.specificationName}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
  //库存流水详情
  import Navigator from "@/components/common/Navigator"
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'stockFlowDetail',
    props: [],
    data() {
      return {
        title: '库存详请',
        orderType: 1,
        orderId: ``
      }
    },
    components: {
      'title-nav': Navigator
    },
    mounted() {
      let orderType = parseInt(this.$route.params.orderType)
      let orderId = this.$route.params.orderId
      this.orderType = orderType
      this.orderId = orderId
      let getDetailPro = this.getStockFlowDetail({type: orderType, id: orderId})
      let getListPro = this.getStockFlowList({type: orderType, id: orderId})
      return Promise.all([getDetailPro, getListPro])
        .catch(e => {
        })
    },
    methods: {
      ...mapActions(`stockFlowDetail`, [`getStockFlowList`, `getStockFlowDetail`])
    },
    computed: {
      orderNoTxt() {
        return this.orderType === 1 ? `入库单号` : `出库单号`
      },
      orderTimeTxt() {
        return this.orderType === 1 ? `入库时间` : `出库时间`
      },
      ...mapState(`stockFlowDetail`, [`productList`, `orderDetail`])
    },
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
    padding .32rem;
    box-sizing border-box;
    background-color #fff;
    display flex;
    flex-direction column;
    align-items flex-start;
    border-bottom 2px solid #ededed;
    span:first-child {
      margin-bottom .19rem;
    }
  }

  .list-wrap {
    flex 1;
    overflow scroll;
  }

  .list-item {
    display: flex;
    flex-direction column;
    justify-content space-between;
    align-items stretch;
    padding .32rem;
    background-color #fff;
    margin-bottom .16rem;
  }

  .product-detail {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

  .stock-info {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    margin-top .32rem;
  }

</style>
