<template>
  <div id="commodityDetail">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>商品详情</span>
    </div>
    <div class="blank"></div>
    <div class="commoditySwipe">
      <!--<mt-swipe :auto="4000" v-if="!productDetailInfo.productImgUrls||productDetailInfo.productImgUrls.length!=0">
        <mt-swipe-item v-for="item in productDetailInfo.productImgUrls" :key="item">
          <img :src="item" style=" height: 100%;">
        </mt-swipe-item>
      </mt-swipe>-->
      <img :src="productDetailInfo.imageUrl" style=" height: 100%;">
      <div class="productStateIcon" :style="productDetailInfo.state==0?'background:#BDBDBD;':''">
        {{productDetailInfo.state==2?'销售中':'已下架'}}
      </div>
    </div>
    <div class="commodity-message">
      <div class="comm-price-name">
        <p class="ft-40r color-333">{{productDetailInfo.productName}}</p>
        <p class="ft-35r color-999">{{productDetailInfo.promotionInfo}}</p>
        <p v-show="productDetailInfo.priceType==0"><span>￥</span>{{productDetailInfo.minSellingPrice}}~{{productDetailInfo.maxSellingPrice}}<span>{{productDetailInfo.sellingPriceUnit}}</span>
        </p>
        <p v-show="productDetailInfo.priceType==1"><span>￥</span>{{productDetailInfo.sellingPrice}}<span>{{productDetailInfo.sellingPriceUnit}}</span>
        </p>
      </div>
      <div class="full-of-gift" v-show="productDetailInfo.salePolicyGift">
        <span>满赠</span>
        <div>
          <p v-for="item in productDetailInfo.salePolicyGift">{{item.giftName}}</p>

        </div>

      </div>
    </div>
    <div class="commodity-information">
      <p class="comm-info">商品信息</p>
      <div class="information-show">
        <p><span>起购：</span><span v-if="productDetailInfo.minPurchaseNum">{{productDetailInfo.minPurchaseNum}}{{productDetailInfo.minUnit}}</span><span
          v-else>不限</span></p>
        <p><span>限购：</span><span v-if="limitationNum">每{{productDetailInfo.salePolicyRule.intervalDay}}天购买{{limitationNum}}箱<span
          v-show="productDetailInfo.permanent">（永久有效）</span></span><span
          v-else>不限</span></p>
        <p><span>包装规格：</span><span>{{productDetailInfo.specName}}</span></p>
        <p><span>销售规格：</span><span>{{productDetailInfo.saleSpecName}}</span></p>
        <p><span>配送方式：</span><span>{{productDetailInfo.deliveryMode==0?'易酒批配送':'自己配送'}}</span></p>
        <p><span>配送费：</span><span>￥{{productDetailInfo.deliveryFee}}</span></p>
        <p><span>库存：</span><span>{{productDetailInfo.inventory}}</span></p>
        <p><span>生产日期：</span><span>{{productDetailInfo.productionDate}}</span></p>
      </div>
    </div>
    <div class="footer-botton">
      <div @click="gotoModifyInformation(productDetailInfo)">修改商品信息</div>
      <div @click="setupSpec('settingSpec')">设置销售规格</div>
      <div @click="gotoProGifts(productDetailInfo.productSalePolicyId)">产品满赠</div>
    </div>
    <!--设置销售规格弹框-->
    <cube-pop position="center" ref="settingSpec">
      <div class="setting">
        <p class="popHeader">设置销售规格</p>
        <div>
          <p>包装规格：{{productDetailInfo.specName}}</p>
          <p>销售规格数量<input type="number" v-model="quantity" v-validate="'required|decimal|min_value:1'" name="quantity"
                          id="quantity" ref="quantity"/>{{productDetailInfo.minUnit}}</p>
        </div>
        <div class="selectButton">
          <span @click="cancelPop('settingSpec')">取消</span>
          <span @click="enSure('settingSpec')">确定</span>
        </div>
      </div>
    </cube-pop>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import {Popup} from 'cube-ui'
  import http from "@/assets/models/shopAPIs";

  export default {
    name: "commodity-detail",
    data() {
      return {
        transitionName: 'slide-left',
        title: '商品详情',
        productSkuId: '',
        productDetailInfo: {},
        saleQuantity: '',      //商品已有的销售规格系数
        quantity: '',
        limitationNum: '',   //限购规格数量
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-pop': Popup
    },
    created() {
      this.productSkuId = this.$route.query.productSkuId;
      this.getProductDetailInfo()
    },
    methods: {
      getProductDetailInfo() {
        let {productSkuId} = this
        http.getProductDetailInfo({param: {productSkuId, productType: 0}})
          .then(data => {
            this.productDetailInfo = data.data
            this.productDetailInfo.minSellingPrice = this.productDetailInfo.minSellingPrice.toFixed(2)
            this.productDetailInfo.maxSellingPrice = this.productDetailInfo.maxSellingPrice.toFixed(2)
            this.productDetailInfo.sellingPrice = this.productDetailInfo.sellingPrice.toFixed(2)
            let saleSpecName = this.productDetailInfo.saleSpecName
            console.log(saleSpecName.split('块'))
            let specNameArr = saleSpecName.split('块')
            this.saleQuantity = parseInt(specNameArr[0])
            this.limitationNum = this.productDetailInfo.salePolicyRule.limitationNum
            console.log(this.limitationNum)
          })
          .catch(error => {
            console.log(error)
          })
      },
      gotoModifyInformation(productInfo) {
        this.$router.push({path: `/modifyInformation`, query: {productInfo}})
      },
      setupSpec(refId) {
        if (this.productDetailInfo.state == 2) {
          this.$toast({message: `只有下架商品才能设置销售规格`})
        } else {
          this.$refs[refId].show();
        }
      },
      cancelPop(refId) {
        this.$refs[refId].hide();
      },
      enSure(refId) {
        let _this = this;
        this.$validator.validate().then((rs) => {
          if (!rs) {
            let err = _this.$validator.errors;
            let field = err.items[0].field;
            let el = _this.$refs[field];
            let clsname = 'warn-highlight';
            if (el.classList.contains(clsname)) {
              el.classList.remove(clsname);
            }
            setTimeout(() => el.classList.add(clsname), 0);
            _this.$toast({
              message: err.first(field),
              iconClass: 'weui-icon-info', duration: 2000
            });
          } else {
            let {productSkuId, quantity, saleQuantity} = this;
            let minUnit = this.productDetailInfo.minUnit;
            console.log(quantity == saleQuantity)
            if (saleQuantity == quantity) {
              this.$toast({message: `销售规格已存在`})
            } else {
              http.setSaleSpecification({param: {minUnit, productSkuId, quantity}})
                .then(data => {
                  this.$toast({message: `修改成功`})
                  this.getProductDetailInfo()
                })
                .catch(error => {
                  this.$toast({message: error})
                })
              this.$refs[refId].hide();
            }
          }
        })
      },
      gotoProGifts(productSalePolicyId) {
        this.$router.push({name: `proGifts`, query: {productSalePolicyId}})
      },
      goBack() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped lang="stylus">
  #commodityDetail {
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
      display: flex;
      flex-direction: row;
      align-items center;
      padding-left: 0.24rem;
      z-index: 99;
      span {
        padding-left: 3rem;
        color: #fff;
        font-size: 0.48rem;
      }
    }

    .blank {
      height: 1.17rem;
    }
    .commoditySwipe {
      background: #fff;
      height: 5.01rem;
      position: relative;
      img {
        height: 100%;
      }
    }
    .productStateIcon {
      position: absolute;
      top: 0.32rem;
      right: 0.32rem;
      font-size: 0.32rem;
      color: #fff;
      width: 1.71rem;
      height: 0.64rem;
      line-height: 0.64rem;
      text-align: center;
      background: rgba(250, 123, 67, 1);
      border-radius: 0.08rem;
    }
    .commodity-message {
      margin-top: 0.16rem;
      background: #fff;
      .comm-price-name {
        border-bottom: 0.01rem solid rgba(0, 0, 0, .1);
        display: flex;
        flex-direction: column;
        padding: 0.32rem;
        align-items flex-start;
        p {
          padding-bottom: 0.21rem;
          text-align: left;
          line-height: 0.36rem;
          width: 100%;
          word-wrap: break-word;
          &:nth-child(1) {
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
          }
          &:nth-child(3), &:nth-child(4) {
            font-size: 0.48rem;
            color: #FA6F31;
            padding-bottom: 0;
            span {
              font-size: 0.32rem;
            }
          }
        }
      }
      .full-of-gift {
        display: flex;
        flex-direction: row;
        padding: 0.33rem 0.32rem;
        align-items flex-start;
        span {
          display: block;
          color: #E53935;
          border: 1px solid #E53935;
          padding: 0.03rem;
          font-size: 0.32rem;
          -webkit-border-radius: 0.05rem
          -moz-border-radius: 0.05rem
          border-radius: 0.05rem
          min-width: 1rem;
        }
        div {
          display: flex;
          flex-direction: column;
          padding-left: 0.24rem;
          align-items flex-start;
          p {
            color: #333;
            font-size: 0.35rem;
            padding-bottom: 0.21rem;
            text-align left
            word-break break-all
            &:last-child {
              padding-bottom: 0;
            }
          }
        }
      }
    }
    .commodity-information {
      margin-top: 0.16rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 1.63rem;
      .comm-info {
        width: 100%;
        text-align left;
        font-size: 0.37rem;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        padding: 0.33rem 0.32rem;
        border-bottom: 0.01rem solid rgba(0, 0, 0, .1);
      }
      .information-show {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0.32rem;
        p {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          color: #666;
          font-size: 0.35rem;
          padding-bottom: 0.27rem;
          &:last-child {
            padding-bottom: 0;
          }
          span {
            &:nth-child(1) {
              text-align right;
              width: 2rem;
            }

          }
        }
      }
    }
    .footer-botton {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #fff;
      display: flex;
      flex-direction: row;
      justify-content flex-end;
      height: 1.31rem;
      padding: 0 0.32rem;
      align-items center;
      div {
        font-size: 0.37rem;
        color: #666;
        padding: 0.19rem 0.16rem;
        margin-left: 0.27rem;
        -webkit-border-radius: 0.05rem;
        -moz-border-radius: 0.05rem;
        border-radius: 0.05rem;
        background: #e6e6e6;
      }
    }
    .setting {
      background: #fff;
      /*width: 7.68rem;*/
      font-size: 0.43rem;
      color: #333;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      .popHeader {
        text-align center;
        padding: 0.43rem 0 0.6rem 0;
      }
      div {
        display: flex;
        flex-direction: column;
        padding: 0 0.32rem 0 0.43rem;
        align-items: flex-start;
        p {
          padding-bottom: 0.43rem
          input {
            width: 3.73rem;
            border: 1px solid rgba(0, 0, 0, .1);
            -webkit-border-radius: 0.05rem;
            -moz-border-radius: 0.05rem;
            border-radius: 0.05rem;
            height: 0.75rem;
            outline 0;
            margin: 0 0.21rem;
          }
          &:nth-child(2) {

          }
        }
      }
      .selectButton {
        border-top 1px solid #ededed;
        display: flex;
        flex-direction: row;
        span {
          flex: 1;
          border-right: 1px solid #ededed;
          padding: 0.37rem 0;
          &:nth-child(2) {
            color: #099AFF
            border-right: 0;
          }
        }
      }
    }

  }
</style>
