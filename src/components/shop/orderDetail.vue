<template>
  <div style="background-color: #f6f6f6;">
    <title-nav :title="title"></title-nav>
    <div class="address">
      <i class="icon icon-xk_dingwei1"></i>
      <div class="address-info">
        <div style="margin-bottom: 0.32rem;">
          <span class="ft-40r color-333">收货人：{{orderDetail.receiverName}}</span>
          <span class="ft-35r color-666">收货地址：{{orderDetail.receiverMobileNo}}</span>
        </div>
        <span class="ft-35r color-666 two-line" style="line-height: 120%">{{orderDetail.address}}</span>
      </div>
    </div>
    <div class="products">
      <div class="order-no">
        <div>
          <span class="ft-40r color-333">订单编号：{{orderDetail.orderNo}}</span>
          <span class="ft-35r color-0096FF">{{orderDetail.orderState|orderStateTxt}}</span>
        </div>
        <span class="ft-35r color-999">下单时间：{{orderDetail.orderCreateTime}}</span>
      </div>
      <order-product :product="product" v-for="product in orderDetail.orderItemVOList"
                     :key="product.orderProductVO.productSkuId"></order-product>
    </div>
    <div class="delivery-pay-wrap">
      <div class="delivery-pay-item">
        <span class="ft-40r color-333">配送方式</span>
        <span class="ft-40r color-666">{{orderDetail.deliveryMode|deliveryModeTxt}}</span>
      </div>
      <div class="delivery-pay-item">
        <span class="ft-40r color-333">取货仓库</span>
        <span class="ft-40r color-666">{{orderDetail.warehouseType|warehouseTypeTxt}}</span>
      </div>
      <div class="delivery-pay-item">
        <span class="ft-40r color-333">支付方式</span>
        <span class="ft-40r color-666">{{orderDetail.payType|payTypeTxt}}</span>
      </div>
    </div>
    <div class="money">
      <div class="money-left ft-35r color-666">
        <span>总金额：¥{{orderDetail.orderAmount|toFixed2}}</span>
        <span>优惠券抵扣：¥{{orderDetail.discountAmount|toFixed2}}</span>
      </div>
      <div>
        <span class="ft-35r color-666">实付：</span>
        <span class="ft-35r color-FA6F31">¥
          <span class="ft-48r">{{orderDetail.finalAmount|integerPart}}</span>{{orderDetail.finalAmount|decimalPart}}
        </span>
      </div>
    </div>
    <div class="delivery-wrap" v-if="orderDetail.deliveryUserName">
      <div class="ft-40r color-333">配送员</div>
      <div class="delivery-content color-333">{{orderDetail.deliveryUserName}}-{{orderDetail.deliveryUserMobileNo}}</div>
    </div>
    <div class="delivery-wrap" v-if="canHandle" @click="goToChooseDeliveryUser">
      <div class="ft-40r color-333">配送员</div>
      <div class="delivery-content color-333" v-if="deliveryUser">{{deliveryUser.deliveryUserName}}</div>
      <div class="delivery-content color-999" v-else>请选择配送员</div>
      <i class="icon icon-ic_jt_hui_36"></i>
    </div>
    <div class="bottom-button" v-if="canHandle">
      <div class="button" @click="handleOrder()">发货</div>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import OrderProduct from "@/components/common/OrderProduct"
  import http from '@/assets/models/shopAPIs'
  import {mapState} from "vuex"

  export default {
    name: 'orderDetail',
    props: [],
    data() {
      return {
        title: '订单详情',
        orderDetail: {}
      }
    },
    filters: {
      //   已下单(1),已取消(2),审核通过(3),审核不通过(4),待发货(5),已发货(6),已完成(7),配送失败(8),已入库(9),待结账(10),
      // 待支付(11),成团待确认(12),成团失败(13),延迟配送(14),已收定金(15),已作废(16),已收款(17),
      orderStateTxt(value) {
        return value === 1 ? `已下单` : value === 2 ? `已取消` :
          value === 3 ? `审核通过` : value === 4 ? `审核不通过` :
            value === 5 ? `待发货` : value === 6 ? `已发货` :
              value === 7 ? `已完成` : value === 8 ? `配送失败` :
                value === 9 ? `已入库` : value === 10 ? `待结账` :
                  value === 11 ? `待支付` : value === 12 ? `成团待确认` :
                    value === 13 ? `成团失败` : value === 14 ? `延迟配送` :
                      value === 15 ? `已收定金` : value === 16 ? `已作废` :
                        value === 17 ? `已收款` : ``
      },
      deliveryModeTxt(value) {
        // deliveryModeSet	配送方式	array<number>	0-易酒批，1-经销商
        return value === 0 ? `易酒批配送` : value === 1 ? `经销商配送` : ``
      },

      warehouseTypeTxt(value) {
        // warehouseType	仓库类型	number	0-易酒批，1-经销商
        return value === 1 ? `经销商仓库` : value === 0 ? `易酒批仓库` : ``
      },
      payTypeTxt(value) {
        // 货到付款(0),微信支付(1),支付宝支付(2),银联支付(3),连连支付(5),易酒贷(6),线下转账(11),经销商收款(12);
        return value === 0 ? `货到付款` : value === 1 ? `微信支付` :
          value === 2 ? `支付宝支付` : value === 3 ? `银联支付` :
            value === 5 ? `连连支付` : value === 6 ? `易酒贷` :
              value === 11 ? `线下转账` : value === 12 ? `经销商收款` : ``
      },
      toFixed2(value) {
        let num = parseFloat(value)
        return num.toFixed(2)
      },
      integerPart(value) {
        let num = parseFloat(value)
        return Math.floor(num / 1)
      },
      decimalPart(value) {
        let num = parseFloat(value)
        return num.toFixed(2).substr(-3)
      }
    },
    components: {
      'title-nav': Navigator,
      'order-product': OrderProduct
    },
    methods: {
      handleOrder() {
        if (!this.deliveryUser) return this.$toast({message: `请先选择配送员`})
        let param = {
          deliveryUserId: this.deliveryUser.deliveryUserId,
          orderId: this.orderDetail.orderId
        }
        http.handleOrder({param})
          .then(() => {
            this.orderDetail.orderState = 6
            this.$toast({message: `发货成功`})
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      goToChooseDeliveryUser() {
        this.$router.push({name: `chooseDeliveryUser`})
      }
    },
    computed: {
      // 已下单(1),已取消(2),审核通过(3),审核不通过(4),待发货(5),已发货(6),已完成(7),配送失败(8),已入库(9),
      // 待结账(10),待支付(11),成团待确认(12),成团失败(13),延迟配送(14),已收定金(15),已作废(16),已收款(17),
      canHandle() {
        return (this.orderDetail.orderState === 3 || this.orderDetail.orderState === 5) && this.orderDetail.deliveryMode !== 0
      },
      ...mapState(`deliveryUser`, [`deliveryUser`])
    },
    mounted() {
      let id = this.$route.query.orderId;
      http.getOrdersDetail({param: id})
        .then(data => {
          this.orderDetail = data.data
        })
        .catch(e => {
          this.$toast({message: e})
        })
    }
  }
</script>


<style lang="stylus" scoped>
  .address {
    padding .43rem;
    box-sizing border-box;
    background-color #fff;
    display flex;
    flex-direction: row;
    justify-content flex-start;
    align-items center;
  }

  .address-info {
    flex 1;
    margin-left .43rem;
    text-align left;
  }

  .products {
    margin-top .16rem;
    background-color #fff;
  }

  .order-no {
    padding .32rem;
    box-sizing border-box;
    text-align left;
    border-bottom 1px solid #ededed;

    > div {
      display: flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      margin-bottom .21rem;
    }
  }

  .delivery-pay-wrap {
    margin-top .16rem;
    background-color #fff;
    padding 0 .32rem;
  }

  .delivery-pay-item {
    height 1.28rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    border-bottom 1px solid #ededed;
  }

  .money {
    margin-top .16rem;
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    padding .32rem;
    box-sizing border-box;
  }

  .money-left {
    display flex;
    flex-direction column;
    align-items flex-start;

    span:nth-of-type(2) {
      margin-top .21rem;
    }
  }

  .bottom-button {
    height 1.31rem;
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content flex-end;
    align-items center;
    border-top .02rem solid #ededed;
    padding-right .32rem;
  }

  .button {
    width 1.81rem;
    height 0.75rem;
    background rgba(9, 154, 255, 1);
    border-radius: 0.05rem;
    line-height .75rem;
    text-align center;
    color: #fff;
  }

  .delivery-wrap {
    display: flex;
    flex-direction: row;
    justify-content space-between;
    align-items center;
    background-color #fff;
    height 1.25rem;
    margin-top .27rem;
    padding 0 .32rem;
    box-sizing border-box;
  }

  .delivery-content {
    flex 1;
    text-align right;
    font-size .4rem;
  }
</style>
