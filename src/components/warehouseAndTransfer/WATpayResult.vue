<template>
  <div>
    <div class="header-title">支付中心</div>
    <div class="header">
      <i class="result-icon icon icon-zf_ic_zfcg" v-if="orderPayResult.success"></i>
      <i class="result-icon icon icon-zf_ic_zfsb" v-if="!orderPayResult.success"></i>
      <span class="ft-67r color-fff" style="margin-bottom: .53rem;">{{payResultTxt}}</span>
      <span class="money">¥ {{orderPayResult.payAmount}}</span>
    </div>
    <div class="content ft-40r color-666">
      <div>
        <i class="icon icon-zf_ic_ddxx"></i>
        <span>订单信息</span>
        <span>{{orderInfoTxt}}</span>
      </div>
      <div>
        <i class="icon icon-zf_ic_fkfs"></i>
        <span>付款方式</span>
        <span>微信支付</span>
      </div>
      <div>
        <i class="icon icon-zf_ic_zfsj"></i>
        <span>支付时间</span>
        <span>{{orderPayResult.timeStamp|timestamp}}</span>
      </div>
    </div>
    <div class="button-wrap">
      <div class="button" style="background-color:#ededed;" @click="goToHomePage">返回首页</div>
      <div class="button" style="background-color:#0096FF;" @click="goToOrderDetail" v-if="orderPayResult.success">
        {{buttonNoticeTxt}}
      </div>
      <div class="button" style="background-color:#0096FF;" @click="repay" v-else>重新支付</div>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import {mapState, mapMutations} from "vuex"

  export default {
    name: 'WATpayResult',
    props: [],
    data() {
      return {
        pageType: ``
      }
    },
    components: {
      'title-nav': Navigator
    },
    created() {
      this.pageType = this.$route.params.type
    },
    beforeDestroy() {
      //离开页面的时候要清除掉支付结果记录
      this.cleanOrderPayResult()
    },
    methods: {
      goToHomePage() {
        this.$router.replace({name: `home`, params: {selectedView: `home`}})
      },
      goToOrderDetail() {
        this.$router.replace({path: `/WATorderDetail/${this.pageType}`, query: {orderNo: this.orderPayResult.orderId}})
      },
      repay() {
        window.wx.miniProgram.navigateTo({
          url: this.orderPayResult.storedPathWithPayParams,
        })
      },
      ...mapMutations(`WATorder`, [`cleanOrderPayResult`])
    },
    computed: {
      payResultTxt() {
        return this.orderPayResult.success ? `支付成功` : `支付失败`
      },
      orderInfoTxt() {
        return this.pageType === `inBound` ? `支付入库单费用` :
          this.pageType === `outBound` ? `支付出库单费用` :
            this.pageType === `applyDelivery` ? `支付配送单费用` : ``
      },
      buttonNoticeTxt() {
        return this.pageType === `inBound` ? `查看入库单详情` :
          this.pageType === `outBound` ? `查看出库单详情` :
            this.pageType === `applyDelivery` ? `查看配送单详情` : ``
      },
      ...mapState(`WATorder`, [`orderPayResult`])
    },
  }
</script>


<style lang="stylus" scoped>

  .header-title {
    height: 1.17rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    width: 100%;
    text-align: center;
    line-height: 1.17rem;
    color: #fff;
    font-size: 0.48rem;
  }

  .header {
    width: 100%;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
    margin-bottom .43rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    .result-icon {
      margin 1.12rem 0 .32rem 0;
    }
  }

  .money {
    height: 1.33rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.67rem;
    font-size: 0.69rem;
    color: rgba(0, 150, 255, 1);
    line-height: 1.33rem;
    text-align center;
    padding 0 1.02rem;
    margin-bottom 1.79rem;
  }

  .content {
    padding .32rem;
    box-sizing border-box;
    > div {
      height 1.28rem;
      display flex;
      flex-direction row;
      justify-content flex-start;
      align-items center;
      border-bottom 1px solid #ededed;
      > span:last-child {
        flex 1;
        text-align right;
      }
    }
  }

  .button-wrap {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    margin .35rem .32rem;
    .button {
      width 4.48rem;
      height: 1.17rem;
      background: rgba(0, 150, 255, 1);
      border-radius: 0.56rem;
      text-align center;
      font-size .45rem;
      line-height 1.17rem;
      color: #fff;
    }
  }


</style>
