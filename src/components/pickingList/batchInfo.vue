<template>
  <div style="background-color: #F6F6F6">
    <title-nav v-bind:title="title"></title-nav>
    <div class="title ft-37r color-666">商品信息</div>
    <ul class="ul-box">
      <li class="li-box" v-for="item in productList">
        <div class="li-header color-333333 ft-37r"><span class="li-header-name">{{item.productName}}</span>
          <span>
            取{{item.takeBigQuantity}}{{item.theBigUnit}}<span v-if="item.takeSmallQuantity">{{item.takeSmallQuantity}}{{item.theSmallUnit}}</span>，
            退{{item.backBigQuantity}}{{item.theBigUnit}}<span v-if="item.backSmallQuantity">{{item.backSmallQuantity}}{{item.theSmallUnit}}</span>
          </span>
        </div>
        <div class="li-info color-999999 ft-35r">规格：{{item.productSpecName}}</div>
        <div class="li-info color-999999 ft-35r">采购价：{{item.purchasePrice}}元</div>
      </li>
    </ul>
    <div class="totalNum color-333333 ft-37r">
      <div class="getBox">
        <span>取货合计：<span class="orange">{{salesTakeBigCount}}大件{{salesTakeSmallCount}}小件</span></span>
        <span>应收：<span class="orange">￥{{receivaleAmount|fixedTwo}}</span></span>
      </div>
      <div>退货合计：<span class="orange">{{salesBackBigCount}}大件{{salesBackSmallCount}}小件</span></div>
    </div>
    <div class="title ft-37r color-666">批次信息</div>
    <div class="batchInfo ft-40r">
      <div class="info-line"><span class="info-line-title color-999">备货批次：</span>
        <span class="info-line-context">{{storeBatchNo}}</span>
      </div>
      <div class="info-line"><span class="info-line-title color-999">取货时间：</span>
        <span class="info-line-context">{{takeTime|timestamp}}</span>
      </div>
      <div class="info-line"><span class="info-line-title color-999">取货员：</span>
        <span class="info-line-context">{{takeUser}}</span>
      </div>
      <div class="info-line" v-if="settlementAmount"><span class="info-line-title color-999">结算金额：</span>
        <span class="info-line-context orange">￥{{settlementAmount|fixedTwo}}</span>
      </div>
      <div class="info-line" v-if="settlementTime"><span class="info-line-title color-999">结算时间：</span>
        <span class="info-line-context">{{settlementTime|timestamp}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import http from '@/assets/models/shopAPIs';
  export default {
    name: "batchInfo",
    data() {
      return {
        title: '批次信息',
        //storeBatchNo:'',
        salesBackBigCount:'',//退货合计大单位数量
        salesBackSmallCount:'',//退货合计小单位数量
        salesTakeBigCount:'',//取货合计大单位数量
        salesTakeSmallCount:'',//取货合计小单位数量
        settlementAmount:'',//结算金额
        receivaleAmount:'',//应收金额
        storeBatchNo:'',//备货批次
        takeTime:'',//取货时间
        takeUser:'',//取货员
        settlementTime:'',//结算时间
         productList: [],
      }
    },
    components: {
      'title-nav': Navigator,
    },
    methods:{
      //查询备货单或对账单详情接口
      directMatchOrderDetail(){

        http.directMatchOrderDetail(this.storeBatchNo).then(data=>{
            this.productList=data.data.dealerStoreUpItemList
           this.salesBackBigCount=data.data.salesBackBigCount;
            this.salesBackSmallCount=data.data.salesBackSmallCount;
            this.salesTakeBigCount=data.data.salesTakeBigCount;
            this.salesTakeSmallCount=data.data.salesTakeSmallCount;
            this.settlementAmount=data.data.settlementAmount;
            //this.storeBatchNo=data.data.storeBatchNo;
            this.takeTime=data.data.takeTime;
            this.takeUser=data.data.takeUser;
            this.settlementTime=data.data.settlementTime;
            this.receivaleAmount=data.data.receivaleAmount;
        }).catch(e=>{
          console.log(e)
        })
      }
    },
    mounted(){
      this.storeBatchNo=this.$route.params.id;
      this.directMatchOrderDetail();
    }
  }
</script>

<style lang="stylus" scoped>
  .title {
    background-color white;
    height 1.04rem;
    width 100%;
    line-height 1.04rem;
    text-align left;
    padding-left 0.5rem;
  }

  .ul-box {
    padding 0.1rem 0.4rem 0.4rem;
    font-weight:400;
    border-bottom 0.03rem solid #EDEDED;
    .li-box {
      padding-top 0.3rem;
      text-align left;
      .li-header {
        display flex;
        flex-direction row;
        justify-content space-between;
        line-height 0.4rem;
        padding-bottom 0.2rem;
        .li-header-name {
          width 44%;
          overflow hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
      .li-info {
        line-height 0.5rem;
      }
    }
  }
  .totalNum{
    font-weight:500;
    text-align left;
    padding 0.3rem 0.4rem;
    line-height 0.55rem;
    .getBox{
      display flex;
      flex-direction row;
      justify-content space-between;
    }

  }
  .batchInfo{
    padding 0.4rem;
    text-align left;
    line-height 0.55rem;
.info-line-title{
  color
}
  }
  .orange{
    color #FF703B
  }
</style>
