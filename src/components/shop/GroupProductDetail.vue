<template>
  <div id="groupProductDetail">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>组合活动详情</span>
    </div>
    <div class="blank"></div>
    <div class="productImg">
      <img :src="productInfo.appShowImg">
    </div>
    <div class="product-price">
      <span style="font-size: 0.53rem;">￥</span>{{productInfo.promotionPrice}}<span
      style="font-size: 0.32rem;"> / 套</span>
    </div>
    <div class="product-info">
      <p class="productName">
        <i class="pro-icon">组</i>
        <span>{{productInfo.promotionName}}</span>
      </p>
      <p class="stock">库存：{{productInfo.inventory}}</p>
      <p class="activityTime">活动时间：{{productInfo.startTime}}-{{productInfo.endTime}}</p>
    </div>
    <div class="product-information">
      <p class="info-title">产品信息</p>
      <div class="product-content" v-for="item in productInfo.items" @click="gotoProductDetail(item.productSkuId)">
        <img :src="item.imageUrl"/>
        <div>
          <p>{{item.productName}}（1*4）</p>
          <p><span>规格：{{item.specName}}</span><span>数量：{{item.productCount}}{{item.maxUnit}}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import {mapState, mapMutations} from 'vuex';

  export default {
    name: '',
    props: [],
    data() {
      return {
        title: '',
        productInfo:{
          appShowImg:''
        },
      }
    },
    created() {
      // this.setProductInfo(this.$route.query.productInfo)
      this.productInfo = this.groupProductInfo
      console.log(this.productInfo)
    },
    components: {},
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      gotoProductDetail(productId) {
        this.$router.push({name: `commodityDetail`, query: {productId}})
      },
      ...mapMutations(`groupActivityInfo`,[`setProductInfo`])
    },
    computed: {
      ...mapState(`groupActivityInfo`,[`groupProductInfo`])
    },
  }
</script>


<style lang="stylus" scoped>
  #groupProductDetail {
    background: #f6f6f6;
  }

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
    span {
      padding-left: 3rem;
      color: #fff;
      font-size: 0.48rem;
    }
  }

  .blank {
    height: 1.17rem;
  }

  .productImg {
    width: 100%;
    height: 5.01rem;
    background: #fff;
    display: flex;
    align-items center;
    justify-content center;
    img {
      width: 4.37rem;
      height: 4.37rem;
    }
  }

  .product-price {
    text-align: left;
    padding: 0.37rem 0.32rem;
    color: #fff;
    font-size: 0.85rem;
    background: linear-gradient(125.2deg, rgba(254, 131, 107, 1), rgba(255, 99, 109, 1));
  }

  .product-info {
    background: #fff;
    padding: 0.43rem 0.32rem 0.32rem;
    text-align: left;
    .productName {
      display: flex;
      align-items center;
      padding-bottom: 0.32rem;
      .pro-icon {
        width: 0.37rem;
        height: 0.37rem;
        background #e53935;
        color: #fff;
        font-size: 0.29rem;
        -webkit-border-radius: 0.05rem;
        -moz-border-radius: 0.05rem;
        border-radius: 0.05rem;
        line-height: 0.37rem;
        text-align center;
        margin-right: 0.11rem;
      }
      span {
        color: #333;
        font-size: 0.4rem;
      }
    }
    .stock {
      font-size: 0.35rem;
      color: #E53935;
      padding-bottom: 0.21rem;
    }
    .activityTime {
      color: #666;
      font-size: 0.35rem;
    }
  }

  .product-information {
    margin-top: 0.16rem;
    background: #fff;
    .info-title {
      font-size: 0.4rem;
      color: #333;
      border-bottom 1px solid #ededed;
      padding: 0.32rem;
      text-align left;
      font-weight bold;
    }
    .product-content {
      padding: 0.32rem;
      display: flex;
      border-bottom: 1px solid #ededed;
      img {
        width: 1.92rem;
        height: 1.92rem;
        margin-right: 0.21rem;
      }
      div {
        text-align left;
        p {
          color: #333;
          font-size: 0.37rem;
          &:nth-child(2) {
            color: #666;
            font-size: 0.32rem;
            padding-top: 0.21rem;
            span {
              padding-right: 0.43rem;
            }
          }
        }
      }
    }
  }
</style>
