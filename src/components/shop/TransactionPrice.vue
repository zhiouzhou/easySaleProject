<template>
  <div id="transactionPrice">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>成交价格</span>
    </div>
    <div class="blank"></div>
    <div class="priceList" v-for="item in transactionRecordList"
         v-if="transactionRecordList&&transactionRecordList.length">
      <div class="timeAndName">
        <p>成交时间：{{item.dealTime}}</p>
        <p>店铺名称：{{item.companyName}}</p>
      </div>
      <div class="priceInfo">
        <p>会员姓名：{{item.userName}}</p>
        <p>联系电话：{{item.mobileNo}}</p>
        <p>成交价格：<span>{{item.productPrice}}</span>{{item.priceUnit}}</p>
      </div>
    </div>
    <div class="emptyPage" v-if="!transactionRecordList||!transactionRecordList.length">
      <img src="/static/icons/Group7Copy.png">
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script>
  import http from '@/assets/models/shopAPIs'

  export default {
    name: "transaction-price",
    data() {
      return {
        productSkuId: '',
        transactionRecordList: [],   //交易记录列表
      }
    },
    created() {
      this.productSkuId = this.$route.query.productSkuId;
      http.getTransactionPrice({param: this.productSkuId})
        .then(data => {
          this.transactionRecordList = data.data
        })
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped lang="stylus">
  #transactionPrice {
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
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
    .priceList {
      background: #ffffff;
      margin-top: 0.16rem;
      .timeAndName, .priceInfo {
        text-align: left;
        padding: 0.32rem 0.32rem 0;
        border-bottom: 1px solid #ededed;
        p {
          padding-bottom: 0.32rem;
          color: #666;
          font-size: 0.37rem;
        }
      }
      .priceInfo {
        p {
          padding-bottom: 0.32rem;
          color: #333;
          font-size: 0.4rem;
          span {
            color: #FA7B43;
          }
        }
      }
    }
    .emptyPage {
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items center;
      span {
        font-size: 30px;
        color: #333;
        padding-top: 32px;
      }
    }
  }
</style>
