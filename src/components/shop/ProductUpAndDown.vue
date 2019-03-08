<template>
  <div id="productUpAndDown">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>商品上下架</span>
    </div>
    <ul class="product-state">
      <li @click="selectState(2)"><span :style="productState==2?'color:#099AFF':''">销售中</span><i class="line"
                                                                                                 v-show="productState==2"></i>
      </li>
      <li @click="selectState(0)"><span :style="productState==0?'color:#099AFF':''">未销售</span><i class="line"
                                                                                                 v-show="productState==0||productState==3||productState==4"></i>
      </li>
    </ul>
    <!--销售中状态-->
    <ul class="state-sales" v-show="productState==2">
      <li v-for="item in salesList" @click="selectSales(item.id,productState)"
          :style="deliveryType==item.id?'background:#fff;border:1px solid #099AFF;color:#099AFF':''">
        <i class="icon icon-zjps_ic_xz_24_copy" v-show="deliveryType==item.id"></i>
        {{item.state}}
      </li>
    </ul>
    <!--下架状态-->
    <ul class="state-sales" v-show="productState==0||productState==3||productState==4">
      <li v-for="item in alreadyDown" @click="selectSales(item.id,productState)"
          :style="productState==item.id?'background:#fff;border:1px solid #099AFF;color:#099AFF':''">
        <i class="icon icon-zjps_ic_xz_24_copy" v-show="productState==item.id"></i>
        {{item.state}}
      </li>
    </ul>
    <div class="scroll-wrap" v-if="productList&&productList.length">
      <cube-scroll
        ref="scroll"
        :data="productList"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <div class="product-list" v-for="item in productList">
          <div class="product-info" @click="gotoshopDetail(item.productSkuId)">
            <img :src="item.imageUrl" class="product-img"/>
            <div class="product-info-show">
              <p>{{item.productName}}</p>
              <p>{{item.promotionInfo}}</p>
              <p v-if="item.priceType==1">
                <span>￥</span>{{item.sellingPrice.toFixed(2)}}<span> {{item.sellingPriceUnit}}</span>
              </p>
              <p v-else><span>￥</span>{{item.minSellingPrice.toFixed(2)}}-{{item.maxSellingPrice.toFixed(2)}}<span> {{item.sellingPriceUnit}}</span>
              </p>
              <div>
                <span>包装规格：{{item.specName}}</span>
                <span>销售规格：{{item.saleSpecName}}</span>
                <span>库存：{{item.inventory}}</span>
                <span>配送方式：{{item.deliveryMode==0?'易酒批配送':'经销商配送'}}</span>
              </div>
              <p><i class="icon icon-spsxj_bq_huo" v-show="item.productAcvitity"></i><i class="icon icon-vspsxj_bq_qi"
                                                                                        v-show="item.purchaseStart"></i><i
                class="icon icon-spsxj_bq_xian" v-show="item.purchaseLimitation"></i></p>
            </div>
          </div>
          <div class="product-button">
            <span @click="priceChanges(productState,'tips',item,item.productSkuId)">调整价格</span>
            <span v-show="productState==2" @click="lowerFrame(item.productSkuId)">下架</span>
            <span v-show="productState==0"
                  @click="gotoProductUp({productInfo:item})">上架</span>
          </div>
        </div>
      </cube-scroll>
      <!--温馨提示弹框-->
    </div>
    <!--空页面-->
    <!--<div class="emptyPage" v-show="!productList||!productList.length">
      <img src="/static/icons/Group7Copy.png">
      <span>暂无数据</span>
    </div>-->
    <empty-view v-else></empty-view>
    <cube-pop position="center" ref="tips">
      <div class="tips">
        <p class="popHeader">温馨提示</p>
        <p class="popContent">若要调整商品信息则要先下架该商品，是否继续？</p>
        <div class="selectButton">
          <span @click="cancelPop('tips')">取消</span>
          <span @click="enSure('tips')">确定</span>
        </div>
      </div>
    </cube-pop>
  </div>
</template>

<script>
  import {Scroll, Popup} from 'cube-ui'
  import http from '@/assets/models/shopAPIs'
  import EmptyView from "@/components/common/EmptyView"
  import {mapState, mapMutations} from 'vuex';

  export default {
    name: "product-up-and-down",
    data() {
      return {
        salesList: [{id: -1, state: '全部'}, {id: 0, state: '易久批配送'}, {id: 1, state: '自己配送'}],
        alreadyDown: [{id: 0, state: '已下架'}, {id: 3, state: '申请上架中'}, {id: 4, state: '上架不通过'}],
        productList: [],
        currentPage: 1,
        pageSize: 8,
        deliveryType: -1,   //配送方式  -1 -全部  	0-易酒批，1-经销商
        productState: 2,   //产品状态     0-已下架 2-销售中，3-审核中，4-已拒绝
        // warehouseTypeSet: [0, 1],  //仓库类型     0-易酒批仓库，1-经销商仓库
        productSkuId: '',    //产品SKUId
      }
    },
    mounted() {
      this.productState = this.upAndDownState
      this.deliveryType = this.proDeliveryType
      this.getProductList();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
        this.setClearState();
      },
      getProductList() {
        let {currentPage, pageSize, productState, deliveryType} = this;
        let param = null
        //如果配送方式是全部的话不传deliveryType这个字段，如果是易酒批和自己配送的话传deliveryType字段
        if (deliveryType === -1) {
          param = {
            brandName: '',
            productState,
            searchWord: '',
          }
        } else {
          param = {
            brandName: '',
            productState,
            searchWord: '',
            deliveryType,
          }
        }
        param.productSaleType = 0 //0：经销商自有产品 1：经销商直配商品
        http.getProductList({
          currentPage,
          pageSize,
          param,
        })
          .then(data => {
            if ((!data.data || !data.data.length) && this.currentPage == 1) {
              this.productList = [];
            } else if ((!data.data || !data.data.length) && this.currentPage != 1) {
              console.log(`没有更多数据了`)
            } else if ((data.data || data.data.length) && this.currentPage == 1) {
              this.productList = data.data
              this.currentPage++
            } else {
              let oldProductList = this.productList;
              let newProductList = data.data;
              let finalList = oldProductList.concat(newProductList)
              this.productList = finalList;
              ++this.currentPage
            }
          }).catch(e => {

        })
      },
      selectState(state) {
        this.productList = [];
        this.setProductState(state)
        this.productState = this.upAndDownState;
        this.currentPage = 1;
        this.getProductList()
      },
      selectSales(state, productState) {
        if (productState == 2) {
          this.setDeliveryType(state)
          this.deliveryType = this.proDeliveryType
        } else {
          this.setProductState(state)
          this.productState = this.upAndDownState;
          console.log(this.productState)
        }
        this.productList = [];
        this.currentPage = 1;
        this.getProductList()
      },
      gotoProductUp(query = {}) {
        this.$router.push({name: `productShelves`, query})
      },
      onPullingDown() {    /*滚动下拉*/
        this.currentPage = 1;
        this.getProductList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      onPullingUp() {   //滚动上拉
        this.getProductList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      gotoshopDetail(productSkuId) {
        this.$router.push({name: `shopCommodityDetail`, query: {productSkuId}})
      },
      priceChanges(productState, refId, productInfo, productSkuId) {
        if (productState == 2) {
          this.productSkuId = productSkuId;
          this.$refs[refId].show();
        } else {
          this.$router.push({name: `modifyInformation`, query: {productInfo}})
        }
      },
      lowerFrame(productSkuId) {   //下架
        this.productSkuId = productSkuId
        this.productFrame();
      },
      productFrame() {
        http.productFrame({param: this.productSkuId})
          .then(data => {
            this.productList = this.productList.filter(item => item.productSkuId !== this.productSkuId)
            this.$toast({message: `下架成功`})
          })
          .catch(error => {
            this.$toast({message: error})
          })
      },
      cancelPop(refId) {
        this.$refs[refId].hide();
      },
      //提示调整价格需先下架商品
      enSure(refId) {
        console.log(this.productSkuId)
        this.productFrame();
        this.$refs[refId].hide();
      },
      ...mapMutations('upAndDownInfo', ['setProductState', 'setDeliveryType', 'setClearState'])
    },
    components: {
      'cube-scroll': Scroll,
      'cube-pop': Popup,
      EmptyView,
    },

    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
      isDirectMatch() {
        return this.userInfo.dealerType === 1
      },
      ...mapState('upAndDownInfo', ['upAndDownState', 'proDeliveryType']),
      ...mapState(`user`, [`userInfo`])
    }
  }
</script>

<style scoped lang="stylus">
  #productUpAndDown {
    background: #f6f6f6;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .header {
      height: 1.17rem;
      background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
      width: 100%;
      text-align: center;
      line-height: 1.17rem;
      color: #fff;
      font-size: 0.48rem;
      display: flex;
      flex-direction: row;
      align-items center;
      padding-left: 0.24rem;
      span {
        padding-left: 3rem;
        color: #fff;
        font-size: 0.48rem;
      }
    }
    .blank {
      height: 1.17rem;
    }
    .product-state {
      background: #fff;
      border-bottom: 1px solid #ededed;
      display: flex;
      flex-direction: row;
      align-items center;
      li {
        padding: 0.39rem 0;
        width: 50%;
        color: #666;
        font-size: 0.4rem;
        position: relative;
        .line {
          position: absolute;
          bottom: 0;
          left: 38%;
          width: 1.2rem;
          height: 0.05rem;
          background: #099AFF;
          display: block;
        }
      }
    }
    .state-sales {
      display: flex;
      flex-direction: row;
      justify-content space-between;
      padding: 0.21rem 0.32rem;
      background: #fff;
      li {
        width: 2.91rem;
        height: 0.75rem;
        background: #f6f6f6;
        font-size: 0.37rem;
        -webkit-border-radius: 0.05rem;
        -moz-border-radius: 0.05rem;
        border-radius: 0.05rem;
        line-height: 0.75rem;
        i {
          padding-right: 0.13rem;
        }
      }
    }
    .scroll-wrap {
      overflow: hidden;
      flex: 1;
    }
    .product-list {
      background: #fff;
      .product-info {
        margin-top: 0.16rem;
        padding: 0.32rem;
        display: flex;
        flex-direction: row;
        justify-content flex-start;
        border-bottom: 1px solid #ededed;
        .product-img {
          width: 2.13rem;
          height: 2.13rem;
        }
        .product-info-show {
          flex: 1;
          margin-left: 0.21rem;
          display: flex;
          flex-direction: column;
          align-items flex-start;
          text-align left;
          p {
            &:nth-child(1) {
              color: #333;
              font-size: 0.4rem;
              padding-bottom: 0.27rem;
            }
            &:nth-child(2) {
              color: #999;
              font-size: 0.35rem;
              padding-bottom: 0.24rem;
              width: 100%;
              word-break: break-word;
            }
            &:nth-child(3) {
              color: #FA6F31;
              font-size: 0.48rem;
              padding-bottom: 0.21rem;
              span {
                font-size: 0.32rem;
              }
            }
            &:nth-child(5) {
              i {
                margin-right: 0.16rem;
              }
            }
          }
          div {
            display: flex;
            flex-wrap: wrap;
            span {
              color: #666;
              font-size: 0.35rem;
              padding-right: 0.43rem;
              padding-bottom: 0.21rem;
            }
          }
        }
      }
      .product-button {
        display: flex;
        flex-direction: row;
        justify-content flex-end;
        padding: 0.21rem 0.32rem;
        span {
          width: 1.81rem;
          height: 0.75rem;
          line-height 0.75rem;
          text-align: center;
          border: 1px solid #666;
          -webkit-border-radius: 0.05rem;
          -moz-border-radius: 0.05rem;
          border-radius: 0.05rem;
          color: #666;
          font-size: 0.37rem;
          &:nth-child(2), &:nth-child(3) {
            border: 1px solid #099AFF;
            color: #099AFF;
            margin-left: 0.27rem;
          }
        }
      }
    }
    .tips {
      background: #fff;
      color: #333;
      -webkit-border-radius: 0.43rem;
      -moz-border-radius: 0.43rem;
      border-radius: 0.43rem;
      font-size: 0.4rem;
      width: 7.68rem;
      .popHeader {
        text-align center;
        padding-top: 0.43rem;

      }
      .popContent {
        padding: 0.64rem 0.44rem 0.44rem;
        text-align: left;
        border-bottom: 1px solid #ededed;
      }
      .selectButton {
        display: flex;
        flex-direction: row;
        font-size: 0.43rem;
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
    .emptyPage {
      flex: 1;
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 80vh;
      span {
        font-size: 30px;
        color: #333;
        padding-top: 32px;
      }
    }
  }
</style>
