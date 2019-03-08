<template>
  <div id="shop">
    <div class="header">店铺</div>
    <div class="blank"></div>


    <!--直配经销商未入驻-->
    <!---->
    <div class="vipOrder" v-if="isDirectMatch&&!isOpenShop">
      <div class="order-icon" style="padding: 0;">
        <p class="canSelect"
           style="padding: .42rem 0;"
           @click="navigateFun('pickingList')">
          <img class="img-icon" src="/static/icons/ic-peisongyewu@2x.png"/>
          <span>易久批备货单</span>
        </p>
        <p class="canSelect"
           @click="navigateFun('accountOrder')"
           style="padding: .42rem 0;">
          <img class="img-icon" src="/static/icons/tz_ic_zhipeizhangdan@2x.png"/>
          <span>易久批对账单</span>
        </p>
        <div class="applyIcon" @click="showPop(`remind`)">
          <span class="sign" v-show="auditState===0">待审核</span>
          <span class="sign" v-show="auditState===2">已拒绝</span>
          <img class="img-icon" src="/static/icons/hydd_ic_sqrz@2x.png"/>
          <span>申请入驻</span>
        </div>
      </div>
    </div>
    <!--经销商未入驻-->
    <div class="applyAdmission" v-show="!isDirectMatch&&!isOpenShop">
      <p class="apply-title">申请入驻</p>
      <div class="applyIcon" @click="showPop(`remind`)">
        <span class="sign" v-show="auditState===0">待审核</span>
        <span class="sign" v-show="auditState===2">已拒绝</span>
        <img class="img-icon" src="/static/icons/hydd_ic_sqrz@2x.png"/>
        <span>申请入驻</span>
      </div>
    </div>


    <div class="vipOrder" v-if="!(isDirectMatch&&!isOpenShop)">
      <p class="order-title">会员订单</p>
      <div class="order-icon">
        <p :class="!isOpenShop?'cannotSelect':'canSelect'" @click="navigateFun('priceAudit')">
          <img class="img-icon" src="/static/icons/ic-jiegeshehe@2x.png"/>
          <span>价格审核</span>
          <!--<span class="num">1</span>-->
        </p>
        <p :class="!isOpenShop?'cannotSelect':'canSelect'" @click="navigateFun('orders')">
          <img class="img-icon" src="/static/icons/jiupidingdan@2x.png"/>
          <span>久批订单</span>
        </p>
        <p :class="!isOpenShop?'cannotSelect':'canSelect'"
           @click="navigateFun('pickingList')"
           v-if="isDirectMatch">
          <img class="img-icon" src="/static/icons/ic-peisongyewu@2x.png"/>
          <span>易久批备货单</span>
        </p>
      </div>
    </div>
    <div class="commo-up" v-if="!(isDirectMatch&&!isOpenShop)">
      <p class="order-title">商品上下架</p>
      <div class="order-icon">
        <p :class="!isOpenShop?'cannotSelect':'canSelect'"
           @click="navigateFun('productUpAndDown',{productState:2})">
          <img class="img-icon" src="/static/icons/hydd_ic_xsz@2x.png"/>
          <span>销售中</span>
        </p>
        <p :class="!isOpenShop?'cannotSelect':'canSelect'"
           @click="navigateFun('productUpAndDown',{productState:0})">
          <img class="img-icon" src="/static/icons/ic-shangpinxiajia@2x.png"/>
          <span>商品下架</span>
        </p>
      </div>
    </div>
    <div class="commo-up" v-if="!(isDirectMatch&&!isOpenShop)">
      <p class="order-title">优惠券</p>
      <div class="order-icon">
        <p :class="!isOpenShop?'cannotSelect':'canSelect'"
           @click="navigateFun(`gotoCoupon`,false)">
          <img class="img-icon" src="/static/icons/ic-tongyongquan@2x.png"/>
          <span>通用券</span>
        </p>
        <p :class="!isOpenShop?'cannotSelect':'canSelect'"
           @click="navigateFun(`gotoCoupon`,true)">
          <img class="img-icon" src="/static/icons/ic-dingxiangchanpinquan@2x.png"/>
          <span>定向产品券</span>
        </p>
      </div>
    </div>
    <div class="commo-up" v-if="!(isDirectMatch&&!isOpenShop)">
      <p class="order-title">营销</p>
      <div class="order-icon">
        <p :class="!isOpenShop?'cannotSelect':'canSelect'"
           @click="navigateFun('groupActivity')">
          <img class="img-icon" src="/static/icons/tz_ic_zhhd@2x.png"/>
          <span>组合活动</span>
        </p>
      </div>
    </div>
    <div class="commo-up" v-if="!(isDirectMatch&&!isOpenShop)">
      <p class="order-title">会员</p>
      <div class="order-icon">
        <p :class="!isOpenShop?'cannotSelect':'canSelect'" @click="navigateFun('memberList')">
          <img class="img-icon" src="/static/icons/tz_ic_qhsp@2x.png"/>
          <span>会员</span>
        </p>
      </div>
    </div>
    <div class="commo-up" v-if="isDirectMatch&&isOpenShop">
      <p class="order-title">结算对账</p>
      <div class="order-icon">
        <p class="canSelect" @click="navigateFun('accountOrder')">
          <img class="img-icon" src="/static/icons/tz_ic_zhipeizhangdan@2x.png"/>
          <span>易久批对账单</span>
        </p>
      </div>
    </div>
    <cube-pop position="center" ref="remind">
      <div class="remind-dialog">
        <div class="remind-header ft-43r color-333">
          选择仓库
        </div>
        <ul>
          店铺入驻功能暂未开放，请联系管理员({{contentMobileNo}})！
        </ul>
        <div class="remind-footer" @click="hidePop(`remind`)">确定</div>
      </div>
    </cube-pop>
    <!--拿不到经销商信息时弹框-->
    <message-dialog :messageDialogVisible="messageDialogVisible" @closeDialog="closeDialog"
                    @ensureDialog="ensureDialog" ref="dialog"></message-dialog>
    <div style="height:1.31rem ;margin-top:0.27rem ;"></div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import {Popup} from 'cube-ui';
  import http from "@/assets/models/shopAPIs";
  import MessageDialog from "@/components/common/MessageDialog"

  export default {
    name: "shop",
    data() {
      return {
        auditState: 0,
        contentMobileNo: ``,
        messageDialogVisible: false
      }
    },
    components: {
      'cube-pop': Popup,
      MessageDialog,
    },
    activated() {
      this.auditState = this.userInfo.auditState
      this.getContentValue();
    },
    methods: {
      //申请入驻获取手机号接口
      getContentValue() {
        let key = `EasySaleMobileNo`;
        let defaulValue = ``;
        http.getContentValue({key, defaulValue}).then(data => {
          this.contentMobileNo = data.data;
        }).catch(e => {
          console.log(e)
        })
      },
      showPop(refId) {
        //  申请入驻功能里面经销商信息和店铺信息拆开来写  经销商信息在刚登录之后根据shopId来判断经销商信息是否存在  不存在直接去完善信息  所以这里的申请入驻直接去填写店铺信息
        if (this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: `applyShopEntryStepTwo`, params: {auditState: this.auditState}})
        }
        // this.$router.push({name: `applyShopEntryStepTwo`})
      },
      hidePop(refId) {
        this.$refs[refId].hide()
      },
      navigateFun(keyword, query = {}) {
        //点击先判断是否能进入次级页面,直配经销商能看到就能点，普通经销商没审核的情况下除了入驻都不能点
        if (!this.isOpenShop && !this.isDirectMatch && keyword !== `applyShopEntryStepTwo`) {
          return this.$toast({message: `请先入驻店铺`})
        }
        //判断是否已经在审核中
        // if (keyword === `applyShopEntryStepOne` && this.auditState === 0) {
        //   return this.$toast({message: `您的申请已经在审核中，请耐心等候`})
        // }
        //优惠券
        if (keyword === 'gotoCoupon') {
          this.setCouponType(query);
          if (this.userInfo.dealerState == -1) {
            this.$refs[`dialog`].showPop()
          } else {
            this.$router.push({name: `coupon`, params: {query}})
          }
          return
        }
        //商品上下架
        if (keyword === 'productUpAndDown') {
          this.setProductState(query.productState)
        }
        if (this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else {
          this.$router.push({name: `${keyword}`, query})
        }
      },
      closeDialog(dialogState) {
        this.$refs[`dialog`].hide()
      },
      ensureDialog(dialogState, type) {
        if (this.userInfo.dealerState == -1) {
          this.$router.push({name: `myInformation`, params: {type}})
        } else {
          this.$router.push({name: `applyShopEntryStepTwo`})
        }
        this.$refs[`dialog`].hide()
      },
      ...mapMutations(`couponInfo`, [`setCouponType`]),
      ...mapMutations(`upAndDownInfo`, [`setProductState`]),
      ...mapMutations(`user`, [`changeApplyState`,])
    },
    computed: {
      isOpenShop() {
        return this.auditState === 1
      },
      isDirectMatch() {
        return this.userInfo.dealerType === 1
      },
      ...mapState(`user`, [`userInfo`]),
      ...mapState(`dealerInfo`, [`shopId`]),
    }
  }
</script>

<style scoped lang="stylus">
  #shop {
    background: #f6f6f6;
    .header {
      height: 1.17rem;
      background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
      width: 100%;
      text-align: center;
      line-height: 1.17rem;
      position: fixed;
      top: 0;
      left: 0;
      color: #fff;
      font-size: 0.48rem;
      z-index: 10;
    }
    .blank {
      height: 1.17rem;
    }
    .img-icon {
      width 1.07rem;
      height 1.07rem;
    }
    .applyAdmission, .vipOrder, .commo-up {
      margin-top: 0.27rem;
      background: #fff;
      text-align left;
      display: flex;
      flex-direction: column;
      align-items flex-start;
      .apply-title, .order-title {
        width: 100%;
        padding: 0.32rem;
        color: #333;
        font-size 0.4rem;
        border-bottom: 1px solid #ededed;
      }
      .applyIcon {
        width: 33.3333%;
        display: flex;
        flex-direction: column;
        align-items center;
        padding: 0.43rem 0rem;
        position: relative;
        span {
          padding-top: 0.27rem;
          font-size: 0.4rem;
          color: #333;
        }
        .sign {
          position: absolute;
          background: #FA6F31;
          font-size: 0.29rem;
          color: #fff;
          -webkit-border-radius: 0.21rem;
          -moz-border-radius: 0.21rem;
          border-radius: 0.21rem;
          padding: 0.09rem;
          top: 0.15rem;
          right: 0.5rem;
        }
      }
    }
    .vipOrder, .commo-up {
      .order-icon {
        width: 100%;
        display: flex;
        flex-direction row;
        align-items flex-start;
        padding: 0.43rem 0;
        .canSelect {
          width 33.3333%;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #333;
          font-size: 0.4rem;
          span {
            padding-top: 0.27rem;
          }
          .num {
            padding .08rem;
            min-width .5rem;
            background: rgba(250, 111, 49, 1);
            border-radius: 0.21rem;
            margin-right -1rem;
            margin-top -1.9rem;
            font-size .35rem;
            color #fff;
            text-align center;
          }
        }
        .cannotSelect {
          width 33.3333%;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #333;
          font-size: 0.4rem;
          justify-content flex-start;
          opacity 0.5;
          span {
            padding-top: 0.27rem;
          }
          .num {
            padding .08rem;
            min-width .5rem;
            background: rgba(250, 111, 49, 1);
            border-radius: 0.21rem;
            margin-right -1rem;
            margin-top -1.9rem;
            font-size .35rem;
            color #fff;
            text-align center;
          }
        }
      }
    }
  }

  .remind-dialog {
    background-color #fff;
    width 7.68rem;
    border-radius .43rem;
    padding-top .43rem;
    > ul {
      padding-bottom 0.2rem;
      line-height 0.41rem;
      font-size 0.38rem;
      border-bottom .01rem solid #ededed;
    }
  }

  .remind-header {
    text-align center;
    margin-bottom .43rem;
  }

  .remind-footer {
    border-top .01rem solid #ededed;
    height: 1.17rem;
    text-align center;
    line-height 1.17rem;
    font-size 0.43rem;
    color #0096FF;
  }
</style>
