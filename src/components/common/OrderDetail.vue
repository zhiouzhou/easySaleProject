<template>
  <div class="order-wrap">
    <div class="order-title">
      <div class="title-top">
        <span class="ft-40r color-333 one-line" style="text-align: left;">{{noteNoTxt}} {{order.noteno}}</span>
        <div class="state-tag">{{orderState}}</div>
      </div>
      <div class="title-bottom">{{order.storetime}}</div>
    </div>
    <div class="order-fold-content">
      <div class="content-header" @click.stop="folded=!folded">
        <span class="ft-40r color-333 one-line" style="line-height: 110%;">{{productNoticeTxt}}</span>
        <img style="height: .21rem;" :src="folded?`/static/icons/xiala@2x.png`:`/static/icons/shangla@2x.png`"/>
      </div>
      <div class="content" v-show="!folded">
        <ul>
          <li class="product-wrap" v-for="product in order.items">
            <div class="ft-40r color-333 two-line" style="line-height: 110%;text-align: left;">{{product.productName}}
            </div>
            <div class="product-spec">
              <span class="ft-35r color-666">规格 {{product.specificationName}}</span>
              <span class="ft-35r color-666">X{{product.count|showStock(product.packageName,product.unitName,product.packageQuantity)}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="service-fee ft-37r color-666" v-show="!folded&&order.chargeConfig">服务费合计：<span class="color-E53935">¥{{order.chargeConfig}}</span>
      </div>
    </div>
    <div class="order-button" v-show="!folded">
      <div class="button" v-if="showCancel" @click="cancelOrder(order.id)">取消</div>
      <div class="button" v-if="showMore" @click="goToDetail(order.id)">查看详情</div>
      <!--<div class="button blue" v-if="showPay">支付</div>-->
    </div>
  </div>
</template>


<script>
  import http from '@/assets/models/warehouseAndTransferAPIs'
  import {mapState} from 'vuex'

  /**
   * 仓配单据列表项
   */
  export default {
    name: "OrderDetail",
    props: {
      order: Object,
      orderType: String
    },
    data() {
      return {
        folded: false
      }
    },
    methods: {
      cancelOrder(orderId) {
        return Promise.resolve()
          .then(() => {
            if (this.orderType === `inBound`) {
              return http.cancelInBoundOrder({id: orderId, userId: this.userId})
            } else {
              return http.cancelOutBoundAndApplyDeliveryOrder({id: orderId, userId: this.userId})
            }
          })
          .then(() => {
            //修改当前订单状态
            if (this.orderType === `inBound`) {
              this.order.state = 7
            } else {
              this.order.state = 5
            }
            this.$toast({message: `取消成功`})
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      goToDetail(orderId) {
        this.$router.push({path: `/WATorderDetail/${this.orderType}`, query: {orderNo: orderId}})
      }
    },
    computed: {
      noteNoTxt() {
        return this.orderType === `inBound` ? `入库单编号` :
          this.orderType === `outBound` ? `出库单编号` :
            this.orderType === `applyDelivery` ? `配送单编号` : ``
      },
      productNoticeTxt() {
        if (!this.folded) {
          return `商品信息`
        } else {
          return `${this.order.items[0].productName}等${this.order.items.length}件商品`
        }
      },
      orderState() {
        // 入库单据状态 (申请入库 = 0,待入库 = 1,部分入库 = 2,拒绝入库 = 3,已入库 = 4,已过期 = 5,待支付=6，已取消=7)；
        // 出库单据状态 (待支付 = 0,待提货 = 1,待出库 = 2,已出库 = 3,部分出库 = 4,已取消 = 5)；
        // 委托配送状态 (待支付=0 新增=1 待配送=2 配送中=3 已完成=4 已取消=5)
        if (this.orderType === `inBound`) {
          return this.order.state === 0 ? `申请入库` :
            this.order.state === 1 ? `待入库` :
              this.order.state === 2 ? `部分入库` :
                this.order.state === 3 ? `拒绝入库` :
                  this.order.state === 4 ? `已入库` :
                    this.order.state === 5 ? `已过期` :
                      this.order.state === 6 ? `待支付` :
                        this.order.state === 7 ? `已取消` : ``
        } else if (this.orderType === `outBound`) {
          return this.order.state === 0 ? `待支付` :
            this.order.state === 1 ? `待提货` :
              this.order.state === 2 ? `待出库` :
                this.order.state === 3 ? `已出库` :
                  this.order.state === 4 ? `部分出库` :
                    this.order.state === 5 ? `已取消` : ``
        } else if (this.orderType === `applyDelivery`) {
          return this.order.state === 0 ? `待支付` :
            this.order.state === 1 ? `新增` :
              this.order.state === 2 ? `待配送` :
                this.order.state === 3 ? `配送中` :
                  this.order.state === 4 ? `已完成` :
                    this.order.state === 5 ? `已取消` : ``
        } else return ``
      },
      // 可取消的状态：
      // 入库单据状态 (申请入库 = 0,待入库 = 1,待支付 = 6)；
      // 出库单据状态 (待支付 = 0,待提货 = 1,待出库 = 2)；
      // 委托配送状态 (待支付 = 0 新增 = 1 待配送 = 2)
      showCancel() {
        if (this.orderType === `inBound` && (this.order.state === 0 || this.order.state === 1 || this.order.state === 6)) {
          return true
        } else if (this.orderType === `outBound` && (this.order.state === 0 || this.order.state === 1 || this.order.state === 2)) {
          return true
        } else if (this.orderType === `applyDelivery` && (this.order.state === 0 || this.order.state === 1 || this.order.state === 2)) {
          return true
        } else return false
      },
      showMore() {
        return true
      },
      //待支付((byte) 1), 支付成功((byte) 2), 支付失败((byte) 3);
      showPay() {
        let canPay = false
        if (this.orderType === `inBound` && (this.order.state === 0 || this.order.state === 1 || this.order.state === 6)) {
          canPay = true
        } else if (this.orderType === `outBound` && (this.order.state === 0 || this.order.state === 1 || this.order.state === 2)) {
          canPay = true
        } else if (this.orderType === `applyDelivery` && (this.order.state === 0 || this.order.state === 1 || this.order.state === 2)) {
          canPay = true
        }
        return canPay && this.order.paystate === 1
      },
      ...mapState(`dealerInfo`, [`userId`])
    }
  }
</script>

<style lang="stylus" scoped>
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
