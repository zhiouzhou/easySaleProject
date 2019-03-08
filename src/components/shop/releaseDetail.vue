<template>
  <div style="background-color:#F6F6F6 ">
    <title-nav v-bind:title="title"></title-nav>

    <div class="release-detail-box" v-for="item in releaseList" v-if="releaseList&&releaseList.length">

      <div class="box-time">
        <span>领取时间：</span>
        {{item.receiveTime}}
        <!--使用状态 （1-未使用，2-已使用，3-已过期）-->
        <span class="box-sp" :style="item.state==2?'color:red':''">{{item.state==1?'未使用':item.state==2?'已使用':item.state==3?'已过期':''}}</span>
      </div>
      <div class="box-info">
        <div style="font-size: 0.4rem;color: #333333">会员姓名：{{item.userName}}</div>
        <div>联系电话：{{item.mobileNo}}</div>
        <div>店铺名称：{{item.companyName}}</div>
      </div>
    </div>
    <!--空页面-->
    <empty-view v-else></empty-view>

  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import EmptyView from "@/components/common/EmptyView";
  import http from '@/assets/models/shopAPIs'

  export default {
    name: "releaseDetail",

    data() {
      return {
        title: '发放明细',
        currentPage: 1,
        pageSize: 10,
        couponActivityId: '',
        releaseList: [],
      }
    },
    components: {
      'title-nav': Navigator,
      'empty-view':EmptyView,
    },
    methods: {
      getListCouponReleaseDetail() {
        let {currentPage, pageSize, couponActivityId} = this;
        http.getListCouponReleaseDetail({currentPage, pageSize, param: couponActivityId})
          .then(data => {
            //1.拿第1页，有数据   列表清空，直接把数据填入，页码加1
            //2.拿第1页。没数据    列表清空，显示暂无数据
            //3.拿非第1页，有数据   列表不清空，直接追加，页码加1
            //4.拿非第1页，没数据   列表不清空，页码不加1

            let list=data.data||[];
            let hasData=list.length;
            if(currentPage===1&&hasData){//1
              this.releaseList=list;
              this.currentPage++
            }else if(currentPage!==1&&hasData){//3
              this.releaseList=this.releaseList.concat(list);
              this.currentPage++
            }else if(currentPage===1&&!hasData){//2
              this.releaseList=[]
            }

          }).catch(e=>{
            console.log(e)
        })
      }
    },
    created() {
      this.couponActivityId = this.$route.params.couponActivityId;
      this.getListCouponReleaseDetail();
    },

  }
</script>

<style lang="stylus" scoped>
  .release-detail-box {
    width 10rem;
    text-align left;
    background-color white;
    margin-top 0.16rem;
    font-size 0.37rem;
    padding-left 0.32rem;
    padding-right 0.32rem;
    font-family: PingFang-SC-Medium;
  }

  .box-time {
    height 1.17rem;
    border-bottom 0.01rem solid #EDEDED;
    color #666666;
    line-height 1.17rem;
  }

  .box-info {
    height 2.43rem;
    line-height 0.6rem;
    padding-top 0.32rem;
    color #666666;
  }

  .box-sp {
    display inline-block;
    float right;
  }

</style>
