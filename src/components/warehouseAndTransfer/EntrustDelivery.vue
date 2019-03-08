<template>
  <div style="background-color: #F6F6F6;display: flex;flex-direction: column">
    <title-nav v-bind:title="title"></title-nav>
    <ul class="delivery-state">
      <li v-for="item in stateList" :key="item.id" @click="selectState(item.id)">
        <span :style="item.id===auditState?'color:#099AFF':''">{{item.state}}</span>
        <i v-if='item.id===auditState'></i>
      </li>
    </ul>
    <div style="flex: 1;overflow: hidden" v-if="orderList.length">
      <cube-scroll
        ref="scroll"
        :data="orderList"
        :options="scrollOptions"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <div class="order-wrap" v-for="order in orderList" :key="order.orderId">
          <div class="order-title">
            <div class="title-top">
              <span class="ft-40r color-333 one-line" style="text-align: left;">配送单编号 {{order.orderId}}</span>
              <div class="state-tag">{{order.stateName}}</div>
            </div>
            <div class="title-bottom">{{order.orderCreateTime}}</div>
          </div>
          <div class="order-fold-content">
            <div class="content-header" @click.stop="changeFolded(order)">
              <!--{{!folded?`商品信息`:`${order.items[0].productName}等${order.items.length}件商品`}}-->
              <span class="ft-40r color-333 one-line" style="line-height: 110%;">{{productNoticeTxt}}</span>
              <img style="height: .21rem;" :src="folded?`/static/icons/xiala@2x.png`:`/static/icons/shangla@2x.png`"/>
            </div>
            <div class="content" v-show="!folded">
              <ul>
                <li class="product-wrap" v-for="product in order.items">
                  <div class="ft-40r color-333 two-line" style="line-height: 110%;text-align: left;">
                    {{product.productName}}
                  </div>
                  <div class="product-spec">
                    <span class="ft-35r color-666">规格 {{product.productSpec}}</span>
                    <span class="ft-35r color-666">X{{product.saleCount|showStock(product.packageName,product.unitName,product.specQuantity)}}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div class="service-fee ft-37r color-666" v-show="!folded&&order.chargeConfig">服务费合计：<span
              class="color-E53935">¥{{order.chargeConfig}}</span>
            </div>
          </div>
          <div class="order-button" v-show="!folded">
            <div class="button" v-if="order.state === 11 || order.state === 5" @click="cancelOrder(order.orderId)">取消
            </div>
            <div class="button" @click="goToDetail(order.orderId)">查看详情</div>
            <!--<div class="button blue" v-if="showPay">支付</div>-->
          </div>
        </div>
      </cube-scroll>
    </div>
    <empty-view v-else></empty-view>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import OrderDetail from "@/components/common/OrderDetail";
  import EmptyView from "@/components/common/EmptyView";
  import {Scroll} from 'cube-ui';
  import http from '@/assets/models/warehouseAndTransferAPIs'
  import {mapState} from "vuex"

  export default {
    name: "EntrustDelivery",
    data() {
      return {
        title: '委托配送',
        stateList: [{
          id: '-1',
          state: '全部',
        }, {
          id: '11',
          state: '待支付',
        }, {
          id: '5',
          state: '待配送',
        }, {
          id: '6',
          state: '配送中',
        }, {
          id: '7',
          state: '已完成',
        }],
        orderList: [],
        auditState: `-1`,
        currentPage: 1,
        pageSize: 8,
        pager: {},
        folded: false,
        productNoticeTxt: ``,
        pageType:`applyDelivery`,
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-scroll': Scroll,
      'orderDetail': OrderDetail,
      EmptyView
    },
    activated() {
      if (this.$route.params.auditState) {
        this.auditState = this.$route.params.auditState
        this.getOrderList()
      }
    },

    methods: {
      selectState(id) {
        this.auditState = id;
        this.currentPage = 1
        this.pager = {}
        this.orderList = []
        this.getOrderList()
      },
      onPullingDown() {
        this.currentPage = 1
        this.getOrderList()
      },
      onPullingUp() {
        ++this.currentPage
        this.getOrderList()
      },
      changeFolded(orderInfo) {
        this.folded = !this.folded
        if (!this.folded) {
          this.productNoticeTxt = `商品信息`
        }
        else {
          this.productNoticeTxt = `${orderInfo.items[0].productName}等${orderInfo.items.length}件商品`
        }
      },
      getOrderList() {
        let {currentPage, pageSize, auditState} = this
        if (this.pager && (currentPage > this.pager.totalPage && currentPage > 1)) {
          --this.currentPage
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        //取全部状态的时候传null
        // 入库单据状态 (申请入库 = 0,待入库 = 1,部分入库 = 2,拒绝入库 = 3,已入库 = 4,已过期 = 5,待支付=6，已取消=7)；
        // 出库单据状态(待支付 = 0,待提货 = 1,待出库 = 2,已出库 = 3,部分出库 = 4,已取消 = 5)；
        // 委托配送状态： 待支付=0 新增=1 待配送=2 配送中=3 已完成=4 已取消=5
        //          billType: 2,
        /*warehouseType: 2,
         stateList: auditState === `-1` ? null : [parseInt(auditState)]*/

        return http.getDeliveryOrderList({
          pageNum: currentPage,
          pageSize: pageSize,
          param: {period: 0, searchKey: ``, state: parseInt(auditState)}
        }).then(data => {
          if (data.data) {
            data.data.forEach(item => {
              item.orderCreateTime = this.formatDate(item.orderCreateTime)
            })
            if (currentPage === 1) {//拿第一页数据
              this.orderList = data.data || []
            } else {
              this.orderList = this.orderList.concat(data.data)
            }
            this.pager = data.data.pager
            this.$refs.scroll && this.$refs.scroll.forceUpdate()
          }

        })
      },
      //格式化时间
      formatDate(time) {
        let date = new Date(time);

        let year = date.getFullYear(),
          month = date.getMonth() + 1,//月份是从0开始的
          day = date.getDate(),
          hour = date.getHours(),
          min = date.getMinutes(),
          sec = date.getSeconds();
        let newTime = year + '-' +
          month + '-' +
          day + ' ' +
          hour + ':' +
          min + ':' +
          sec;
        return newTime;
      },
      //取消委托配送
      cancelOrder(deliveryOrderId) {
        let param = {deliveryOrderId, remark: ``}
        return http.cancelDeliveryOrder({param}).then(data => {
          this.orderList = this.orderList.filter(item => item.orderId !== deliveryOrderId)
          this.$toast({message: `取消成功`})
        })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      goToDetail(orderId) {
        this.$router.push({path: `/WATorderDetail/applyDelivery`, query: {orderNo: orderId}})
      },
    },
    computed: {
      /*productNoticeTxt() {
        if (!this.folded) {
          return `商品信息`
        }
        /!*else {
                 return `${this.order.items[0].productName}等${this.order.items.length}件商品`
               }*!/
      },*/
      warehouse() {
        // if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].warehouse
      },
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
      ...mapState(`dealerInfo`, [`userId`])
    }
  }
</script>

<style lang="stylus" scoped>
  .delivery-state {
    width: 100%;
    display: flex;
    flex-direction: row;
    background: #fff;
    li {
      flex: 1;
      font-size: 0.4rem;
      color: #666;
      position: relative;
      text-align: center;
      padding: 0.39rem 0;
      i {
        display: block;
        width: 1.2rem;
        height: 0.05rem;
        background: rgba(9, 154, 255, 1);
        position: absolute;
        bottom: 0;
        left: 0.4rem;
      }
    }
  }

  .order-wrap {
    background-color #fff;
    width 100%;
    margin-top .27rem;
  }

  .order-title {
    padding .32rem;
    box-sizing border-box;
    border-bottom .01rem solid #ededed;
    .title-top {
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      .state-tag {
        width 1.39rem;
        height 0.48rem;
        background rgba(255, 227, 217, 1);
        border-radius 0.24rem;
        font-size 0.32rem;
        text-align center;
        color rgba(255, 112, 67, 1);
        line-height 0.48rem;
      }
    }
    .title-bottom {
      margin-top .21rem;
      text-align left;
    }
  }

  .content-header {
    display: flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    height .94rem;
    padding 0 .32rem;
    box-sizing border-box;
  }

  .product-wrap {
    margin-bottom .43rem;
    padding 0 .32rem;
    box-sizing border-box;
    .product-spec {
      margin-top .21rem;
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
    }
  }

  .service-fee {
    text-align right;
    padding-right .32rem;
    margin-bottom .43rem;
  }

  .order-button {
    padding .21rem .32rem;
    box-sizing border-box;
    display flex;
    flex-direction row;
    justify-content flex-end;
    align-items center;
    border-top .01rem solid #ededed;
    .button {
      height .75rem;
      line-height .75rem;
      min-width 1.81rem;
      margin-left .27rem;
      border-radius: 0.05rem;
      text-align center;
      padding 0 .16rem;
      color #666;
      border 0.02rem solid #666;
    }
    .blue {
      border-color #0096FF;
      color: #0096FF;
    }
  }
</style>
