<template>
  <div style="background-color: #f6f6f6;">
    <title-nav :title="title" class="top-nav"></title-nav>
    <div style="height: 1.1733333rem;"></div>
    <div class="title-bg"></div>
    <div class="order-detail">
      <div class="order-info">
        <i class="icon icon-xxd_ic_bt" style="margin-top: -.9rem;"></i>
        <div>
          <span>{{orderNoTxt}}</span>
          <span class="color-333">{{pageType=='applyDelivery'?deliveryOrderInfo.orderNo:orderDetail.noteNo}}</span>
        </div>
        <!--入库单费用-->
        <div v-if="pageType===`inBound`&&orderDetail.sortingFee">
          <span>分拣费</span>
          <span class="color-FA6F31">¥{{orderDetail.sortingFee|fixedTwo}}</span>
        </div>
        <div v-if="pageType===`inBound`&&orderDetail.shipGoodsAmount">
          <span>下货费</span>
          <span class="color-FA6F31">¥{{orderDetail.shipGoodsAmount|fixedTwo}}</span>
        </div>
        <!--出库单费用-->
        <div v-if="pageType===`outBound`&&orderDetail.depositFee">
          <span>托管费</span>
          <span class="color-FA6F31">¥{{orderDetail.depositFee|fixedTwo}}</span>
        </div>
        <div v-if="pageType===`outBound`&&orderDetail.loadingCharge">
          <span>装车费</span>
          <span class="color-FA6F31">¥{{orderDetail.loadingCharge|fixedTwo}}</span>
        </div>
        <!--配送单费用-->
        <div v-if="pageType===`applyDelivery`&&deliveryOrderInfo.entrustedFee">
          <span>托管费</span>
          <span class="color-FA6F31">¥{{deliveryOrderInfo.entrustedFee|fixedTwo}}</span>
        </div>
        <div v-if="pageType===`applyDelivery`&&deliveryOrderInfo.transportFee">
          <span>配送费</span>
          <span class="color-FA6F31">¥{{deliveryOrderInfo.transportFee|fixedTwo}}</span>
        </div>
        <!--<div v-if="pageType===`applyDelivery`&&orderDetail.landingCharge">
          <span>卸货费</span>
          <span class="color-FA6F31">¥{{orderDetail.landingCharge|fixedTwo}}</span>
        </div>-->
        <!---->
        <div>
          <span>仓库名称</span>
          <span class="color-333">{{orderDetail.storeHouseName}}</span>
        </div>
        <div>
          <span>地址</span>
          <span class="color-333 two-line" style="line-height: 110%;">{{orderDetail.warehouseAddress}}</span>
        </div>
        <div>
          <span>创建时间</span>
          <span class="color-333">{{orderDetail.businessTimeText}}</span>
        </div>
        <div>
          <span>{{orderStateTitle}}</span>
          <span class="color-FA6F31">{{pageType=='applyDelivery'?deliveryOrderInfo.stateName:orderStateTxt}}</span>
        </div>
      </div>
      <img class="divider-img" src="/static/icons/dingdan@2x.png"/>
      <div class="product-info">
        <span class="info-tag">商品信息</span>
        <!--出库单商品信息-->
        <ul v-if="orderDetail.items&&orderDetail.items.length">
          <li v-for="product in orderDetail.items">
            <!--<img :src="product."/>-->
            <div>
              <span class="ft-40r color-333 one-line" style="line-height: 110%;">{{product.productName}}</span>
              <span class="ft-35r color-666">规格 {{product.specificationText}}</span>
            </div>
            <div class="ft-35r color-666">x{{product.countText}}</div>
          </li>
        </ul>
        <!--入库单商品信息-->
        <ul v-if="orderDetail.itemList&&orderDetail.itemList.length">
          <li v-for="product in orderDetail.itemList">
            <div>
              <span class="ft-40r color-333 one-line" style="line-height: 110%;">{{product.productName}}</span>
              <span class="ft-35r color-666">规格 {{product.specificationText}}</span>
            </div>
            <div class="ft-35r color-666">x{{product.stockCountName}}</div>
          </li>
        </ul>
        <!--委托配送单商品信息-->
        <ul v-if="orderDetail.productDetailInfoList&&orderDetail.productDetailInfoList.length">
          <li v-for="product in orderDetail.productDetailInfoList">
            <div>
              <span class="ft-40r color-333 one-line" style="line-height: 110%;">{{product.productName}}</span>
              <span class="ft-35r color-666">规格 {{product.productSpec}}</span>
            </div>
            <div class="ft-35r color-666">x{{product.productCount}}</div>
          </li>
        </ul>
      </div>
      <img class="divider-img" src="/static/icons/dingdan@2x.png"/>
      <!--入库单-->
      <div class="delivery-time" v-if="pageType===`inBound`">
        <span class="info-tag">送货时间</span>
        <div class="ft-37r" style="margin-top: .32rem;">
          <span class="color-666">送货时间</span>
          <span class="color-333" style="margin-left:.43rem; ">{{orderDetail.inStockTimeText}}</span>
        </div>
      </div>
      <!--出库单-->
      <div class="delivery-time" v-else-if="pageType===`outBound`&&orderDetail.toUserInfo">
        <span class="info-tag">提货时间</span>
        <div class="person-wrap">
          <span class="ft-40r color-333">提货人：{{orderDetail.toUserInfo.userName}}（{{orderDetail.toUserInfo.userMobileNo}}）</span>
          <span class="ft-37r color-666">身份证信息：{{orderDetail.toUserInfo.identitycard}}</span>
          <div>
            <span class="ft-37r color-666">提货时间：{{orderDetail.pickupTimeText}}</span>
            <span class="mini-info-tag">预计</span>
          </div>
        </div>
      </div>
      <!--配送单-->
      <div class="delivery-time" v-else-if="pageType===`applyDelivery`&&orderDetail.userInfo">
        <span class="info-tag">收货信息</span>
        <div class="receiver-wrap">
          <span class="ft-40r color-333">收货人：{{orderDetail.userInfo.contact}}（{{orderDetail.userInfo.phone}}）</span>
          <span class="ft-37r color-666 two-line"
                style="line-height: 110%;">{{orderDetail.userInfo.detailAddress}}</span>
        </div>
      </div>
      <img class="divider-img" src="/static/icons/dingdan@2x.png" v-if="showPay"/>
      <div class="pay-type" v-if="showPay">
        <span class="info-tag">支付方式</span>
        <div>
          <i class="icon icon-ic_wx"></i>
          <span class="ft-40r color-333" style="margin-left:.21rem;flex: 1">微信支付</span>
          <i class="icon icon-ic_xuanzhong"></i>
        </div>
      </div>
    </div>
    <div style="height:1.31rem; " v-if="showPay"></div>
    <div class="bottom-bar" v-if="showPay">
      <span class="ft-40r color-fff">费用合计：¥{{orderDetail.costAmount||orderDetail.totalAmount||`0.00`}}</span>
      <div class="pay-button ft-45r color-fff" @click="onPay">支付</div>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import {mapState, mapMutations} from 'vuex'
  import http from '@/assets/models/warehouseAndTransferAPIs'

  export default {
    name: '',
    props: [],
    data() {
      return {
        orderNo: ``,
        pageType: ``,
        orderDetail: {},
        deliveryOrderInfo: {},
        storedPathWithPayParams: ``
      }
    },
    components: {
      'title-nav': Navigator
    },
    mounted() {
      console.log(this.$route)
      this.pageType = this.$route.params.type
      this.orderNo = this.$route.query.orderNo
      return Promise.resolve()
        .then(() => {
          if (this.pageType === `inBound`) {
            return http.inBoundOrderDetail(this.orderNo)
          } else if (this.pageType === `applyDelivery`) {
            return http.deliveryOrderDetail({param: this.orderNo})
          } else {
            return http.outBoundAndApplyDeliveryOrderDetail(this.orderNo)
          }
        })
        .then(data => {
          this.orderDetail = data.data || {}
          this.deliveryOrderInfo = data.data.deliveryOrderInfo
        })
        .catch(e => {
          this.$toast({message: e})
        })
    },
    beforeRouteUpdate(to, from, next) {
      if (to.query.payResult == `true` || to.query.payResult == `false`) {
        if (to.query.payResult == `false`) {
          this.$toast({message: `支付失败`})
          return
        }
        this.setOrderPayResult({
          success: to.query.payResult == `true`,//支付是否成功
          payAmount: this.orderDetail.totalAmount,//支付金额
          timeStamp: parseInt(to.query.timeStamp),//支付成功的时间
          storedPathWithPayParams: this.storedPathWithPayParams,//附带支付参数的路径，用于重新支付
          orderId: this.orderDetail.id//订单id，用于支付成功后返回详情
        })
        this.$router.push({path: `/WATpayResult/${this.pageType}`})
      }
      next()
    },
    methods: {
      // //重新支付的时候，失败返回的路径应该还是在支付结果页面
      // getFixedJumpUrl(storedPathWithPayParams) {
      //   // `/pages/payment/payment?jumpUrl=${jumpUrl}&requestUrl=${requestUrl}&payObject=${payObject}`
      //   let startIndex = storedPathWithPayParams.indexOf(`=`) + 1
      //   let endIndex = storedPathWithPayParams.indexOf(`&`)
      //   let prefix = storedPathWithPayParams.substring(0, startIndex)
      //   let suffix = storedPathWithPayParams.substring(endIndex, storedPathWithPayParams.length - 1)
      //   let jumpUrl = storedPathWithPayParams.substring(startIndex, endIndex)
      //   jumpUrl = decodeURIComponent(jumpUrl)
      //   jumpUrl = jumpUrl.split(`#`)[0]
      //   jumpUrl += `/WATpayResult/${this.pageType}`
      //   jumpUrl = encodeURIComponent(jumpUrl)
      //   return `${prefix}${jumpUrl}${suffix}`
      // },
      onPay() {
        let payObject = this.getPayParams()
        payObject = JSON.stringify(payObject)
        payObject = encodeURIComponent(payObject)
        let requestUrl = this.payRequestUrl
        requestUrl = encodeURIComponent(requestUrl)
        let jumpUrl = window.location.href.toString().split(`?`)[0]
        jumpUrl += `?orderNo=${this.orderNo}`
        jumpUrl = encodeURIComponent(jumpUrl)
        let path = `/pages/payment/payment?jumpUrl=${jumpUrl}&requestUrl=${requestUrl}&payObject=${payObject}`
        this.storedPathWithPayParams = path
        window.wx.miniProgram.navigateTo({
          url: path,
        })
      },
      getPayParams() {
        let payObject = {}
        let productInfo = []

        this.orderDetail.itemList &&
        this.orderDetail.itemList.length &&
        this.orderDetail.itemList.forEach(item => {
          console.log(item)
          productInfo.push({
            num: item.count,
            productDesc: item.productName
          })
        })

        this.orderDetail.items &&
        this.orderDetail.items.length &&
        this.orderDetail.items.forEach(item => {
          console.log(item)
          productInfo.push({
            num: item.count,
            productDesc: item.productName
          })
        })

        this.orderDetail.productDetailInfoList &&
        this.orderDetail.productDetailInfoList.length &&
        this.orderDetail.productDetailInfoList.forEach(item => {
          console.log(item)
          productInfo.push({
            num: item.deliveryCount,
            productDesc: item.productName
          })
        })

        payObject.amount = this.orderDetail.totalAmount || this.orderDetail.costAmount
        payObject.clientInfo = {
          clientType: 8
        }
        payObject.orderInfos = [{
          amount: this.orderDetail.totalAmount||this.orderDetail.costAmount,
          orderNo: this.orderDetail.id||this.orderDetail.deliveryOrderInfo.orderNo,
          productInfo: productInfo
        }]

        /*payObject.orderInfos = [{
          amount: this.orderDetail.costAmount,
          orderNo: this.orderDetail.deliveryOrderInfo.orderNo,
          productInfo: productInfo
        }]*/

        payObject.partnerCode = `YJX`
        payObject.shopId = `20181112`
        payObject.stockType = this.pageType === `inBound` ? 1 : this.pageType === `outBound` ? 2 : 3
        payObject.timeStamp = Date.parse(new Date())
        payObject.userId = this.userId //店铺Id
        payObject.userInfo = {
          mobile: this.username,
          state: 1,
          userName: this.username,
        }

        payObject.webChatAppletPayInfo = {
          subAppId: this.subAppId
        }

        /*if(this.pageType === `applyDelivery`){
          payObject.entrustPayDTO = {
            SubAppID:this.subAppId,
            amount: this.orderDetail.costAmount,
            clientType:1,
            deviceNumber:`android` ,   //设备号
            distributorId:this.shopId,   //经销商id
            orderId:this.deliveryOrderInfo.orderNo,    //配送单id
            payTarget:2,    //支付类型
            payType:1,
            storeNo:`BJYJP`,
            terminalIP:`197.168.13.23`,
            userId:this.userId,
          }
          stockType:2
        }*/
        return payObject
      },
      ...mapMutations(`WATorder`, [`setOrderPayResult`])
    },
    computed: {
      title() {
        return this.pageType === `inBound` ? `入库单信息` :
          this.pageType === `outBound` ? `出库单信息` :
            this.pageType === `applyDelivery` ? `配送单信息` : ``
      },
      orderNoTxt() {
        return this.pageType === `inBound` ? `入库单编号` :
          this.pageType === `outBound` ? `出库单编号` :
            this.pageType === `applyDelivery` ? `配送单编号` : ``
      },
      orderStateTitle() {
        return this.pageType === `inBound` ? `入库单状态` :
          this.pageType === `outBound` ? `出库单状态` :
            this.pageType === `applyDelivery` ? `配送单状态` : ``
      },
      orderStateTxt() {
        // 入库单据状态 (申请入库 = 0,待入库 = 1,部分入库 = 2,拒绝入库 = 3,已入库 = 4,已过期 = 5,待支付=6，已取消=7)；
        // 出库单据状态(待支付 = 0,待提货 = 1,待出库 = 2,已出库 = 3,部分出库 = 4,已取消 = 5)；
        // 委托配送状态： 待支付=0 新增=1 待配送=2 配送中=3 已完成=4 已取消=5
        if (this.pageType === `inBound`) {
          return this.orderDetail.state === 0 ? `申请入库` :
            this.orderDetail.state === 1 ? `待入库` :
              this.orderDetail.state === 2 ? `部分入库` :
                this.orderDetail.state === 3 ? `拒绝入库` :
                  this.orderDetail.state === 4 ? `已入库` :
                    this.orderDetail.state === 5 ? `已过期` :
                      this.orderDetail.state === 6 ? `待支付` :
                        this.orderDetail.state === 7 ? `已取消` : ``
        } else if (this.pageType === `outBound`) {
          return this.orderDetail.state === 0 ? `待支付` :
            this.orderDetail.state === 1 ? `待提货` :
              this.orderDetail.state === 2 ? `待出库` :
                this.orderDetail.state === 3 ? `已出库` :
                  this.orderDetail.state === 4 ? `部分出库` :
                    this.orderDetail.state === 5 ? `已取消` : ``
        }
        /*else if (this.pageType === `applyDelivery`) {
                 return this.orderDetail.state === 0 ? `待支付` :
                   this.orderDetail.state === 1 ? `新增` :
                     this.orderDetail.state === 2 ? `待配送` :
                       this.orderDetail.state === 3 ? `配送中` :
                         this.orderDetail.state === 4 ? `已完成` :
                           this.orderDetail.state === 5 ? `已取消` : ``
               }*/
      },
      //待支付((byte) 1), 支付成功((byte) 2), 支付失败((byte) 3);
      showPay() {
        return (this.orderDetail.payState === 1 && this.orderDetail.totalAmount) || this.orderDetail.costAmount
      },
      ...mapState(`user`, [`username`, `userInfo`]),
      ...mapState(`dealerInfo`, [`userId`, `shopId`]),
      ...mapState(`appConfig`, [`payRequestUrl`, `subAppId`]),
    },
  }
</script>


<style lang="stylus" scoped>
  .top-nav {
    position: fixed;
    top: 0;
    width 100%;
  }

  .title-bg {
    width: 100%;
    height: 3.25rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    margin-bottom -2.29rem;
  }

  .order-detail {
    margin: .32rem;
    margin-top 0;
  }

  .divider-img {
    width 100%;
    display block;
    margin -.01rem 0;
  }

  .info-tag {
    height: .64rem;
    padding 0 .27rem;
    box-sizing border-box;
    background: rgba(247, 98, 41, 0.2);
    border-radius: .59rem;
    font-size .32rem;
    color: #F76229;
    line-height .64rem;
    align-self flex-start;
  }

  .order-info {
    background-color #fff;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
    padding 0 .32rem .32rem .32rem;
    box-sizing border-box;
    > div {
      width 100%;
      display flex;
      flex-direction row;
      justify-content flex-start;
      align-items flex-start;
      margin-top .43rem;
      font-size .37rem;
      color: #666;
      text-align left;
      > span:first-child {
        min-width 2.43rem;
        text-align left;
      }
    }
  }

  .product-info {
    display flex;
    flex-direction column;
    align-items stretch;
    background-color #fff;
    padding .16rem .32rem;
    > ul {
      width 100%;
      > li:last-child {
        border-bottom 0;
      }
      > li {
        width 100%;
        padding .32rem 0;
        box-sizing border-box;
        display flex;
        flex-direction row;
        justify-content space-between;
        align-items center;
        border-bottom 1px dashed rgba(0, 0, 0, .1);
        > img {
          width 1.49rem;
          height 1.49rem;
        }
        > div:nth-of-type(1) {
          flex 1;
          height 1.49rem;
          margin 0 .21rem;
          display flex;
          flex-direction column;
          justify-content space-between;
          align-items flex-start;
        }
      }
    }
  }

  .delivery-time {
    background-color #fff;
    padding .16rem .32rem;
    box-sizing border-box;
    display flex;
    flex-direction column;
    align-items stretch;
    text-align left;
  }

  .pay-type {
    background-color #fff;
    padding .16rem .32rem;
    box-sizing border-box;
    display flex;
    flex-direction column;
    align-items stretch;
    text-align left;
    > div {
      display: flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      margin-top .32rem;
    }
  }

  .person-wrap {
    display flex;
    flex-direction column;
    align-items flex-start;
    margin-top .32rem;
    padding .32rem;
    box-sizing border-box;
    border 1px dashed rgba(0, 0, 0, .1)
    > span {
      margin-bottom .32rem;
    }
    > div {
      display flex;
      flex-direction row;
      align-items center;
    }
  }

  .mini-info-tag {
    margin-left .21rem;
    height: .48rem;
    padding 0 .21rem;
    box-sizing border-box;
    background: rgba(247, 98, 41, 0.2);
    border-radius: .32rem;
    font-size .29rem;
    color: #F76229;
    line-height .48rem;
    text-align center;
  }

  .receiver-wrap {
    display flex;
    flex-direction column;
    align-items flex-start;
    margin-top .32rem;
    padding .32rem;
    padding-bottom 0;
    box-sizing border-box;
    border 1px dashed rgba(0, 0, 0, .1)
    > span {
      margin-bottom .32rem;
    }
  }

  .bottom-bar {
    position fixed;
    bottom 0;
    width: 100%;
    height: 1.31rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    background: #626262;
    padding-left .32rem;
    box-sizing border-box;
    .pay-button {
      height 100%;
      width 2.67rem;
      background-color #0096FF;
      text-align center;
      line-height 1.31rem;
    }
  }
</style>
