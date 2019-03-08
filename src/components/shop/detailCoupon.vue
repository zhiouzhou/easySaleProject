<template>
    <div style="background-color:#F6F6F6">
      <title-nav v-bind:title="title"></title-nav>
      <div style="background-color: white" class="box">
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label"  >活动日期</label></div>
          <div class="weui-cell__bd"><span class="box-sp">{{detailList.couponActivityBeginTime	}}-{{detailList.couponActivityEndTime}}</span></div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label" >优惠券有效日期</label></div>
          <div class="weui-cell__bd"><span class="box-sp">{{detailList.couponBeginTime}}-{{detailList.couponEndTime}}</span></div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label" >发放数量</label></div>
          <div class="weui-cell__bd"> <span class="box-sp">{{detailList.couponTotalNum}}</span></div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label" >已领取数量</label></div>
          <div class="weui-cell__bd"><span class="box-sp">{{detailList.couponReceiveNum}}</span></div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label" >抵扣金额</label></div>
          <div class="weui-cell__bd"><span class="box-sp">{{detailList.discountAmount}}</span></div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label" >最低下单金额</label></div>
          <div class="weui-cell__bd"><span class="box-sp">{{detailList.requireOrderAmount}}</span></div>
        </div>
        <div class="weui-cell" v-if="assignProductCoupon===true">
          <div class="weui-cell__hd"><label class="weui-label" >适用的商品</label></div>
          <div class="weui-cell__bd"><span class="box-sp">{{detailList.productName}}</span></div>
        </div>
      </div>
      <!--底部按钮-->
      <!--	0-待发布，2-已发布，3-已下架-->
      <div class="bottom-button" v-if="detailList.state=='0'">
        <!--<div class="button ft-45r color-fff"><router-link :to="{name:'editCoupon',query:{list:detailList,assignProductCoupon:assignProductCoupon}}"><span style="color: white">编辑</span></router-link></div>-->
        <div class="button ft-45r color-fff" @click="gotoEdit(detailList,assignProductCoupon)">编辑</div>
        <div class="button ft-45r color-fff" @click="publishCouponActivity">发布</div>
      </div>
      <div class="bottom-button" v-else-if="detailList.state=='2'">
        <div class="button ft-45r color-fff"><router-link :to="'/releaseDetail/'+this.couponActivityId"><span style="color: white">发布明细</span></router-link></div>
        <div class="button ft-45r color-fff" @click=" disableCouponActivity">下架</div>
      </div>
      <div class="bottom-button" v-else-if="detailList.state=='3'">
        <div class="button ft-45r color-fff" style="width: 100%"><router-link :to="'/releaseDetail/'+this.couponActivityId"><span style="color: white">发布明细</span></router-link></div>
      </div>
    </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
 // import { createNamespacedHelpers } from 'vuex';
  import http from '@/assets/models/shopAPIs'
  import {mapState,mapMutations} from 'vuex';
 // const {mapState, mapGetters} = createNamespacedHelpers('couponInfo');
    export default {
        name: "detailCoupon",
        data(){
            return {
              title:'优惠券详情',
              couponActivityId:'',
              assignProductCoupon:'',
              detailList:[],
            }
        },
      methods:{
          //获取优惠券详情接口
        getCouponActivityById(){
            http.getCouponActivityById({param:this.couponActivityId})
              .then(data=>{
                this.detailList=data.data;
              })
        },
        //发布优惠券
        publishCouponActivity(){
          http.publishCouponActivity({param:this.couponActivityId})
            .then(data=>{
              this.$toast({message:`发布成功`});
              this.$router.replace('/coupon');
            })
            .catch(error=>{
              console.log(error)
            })
        },
        //下架优惠券
        disableCouponActivity() {
          http.disableCouponActivity({param: this.couponActivityId})
            .then(data => {
              this.$toast({message:`下架成功`});
              this.$router.replace('/coupon');
            })
            .catch(error => {
              console.log(error)
            })
        },
        gotoEdit(itemList,couponType){
          this.setCouponDetailList(itemList);
          this.setItemType(couponType);
          let fromPage=2;
          this.$router.push({name:'editCoupon',params:{itemList,couponType,fromPage}});
        },
        ...mapMutations('couponInfo',['setCouponDetailList','setItemType'])
      },
      components:{
        'title-nav' : Navigator,
      },
      created(){
        this.couponActivityId = this.$route.params.id;
        //将路由传递过来的参数assignProductCoupon，重新恢复为boolean类型
        let value = this.$route.params.assignProductCoupon;
        this.assignProductCoupon = value === 'false' ? false : true;
        this.getCouponActivityById();
      },
      computed : {
        ...mapState('couponInfo',['couponDetailList','itemType'])
        //...mapGetters(['couponDetailList']),
      }
    }
</script>

<style scoped>
  .weui-cell{
    border-bottom:#EDEDED solid 0.01rem;
    height: 1.28rem;
    font-size: 0.4rem;
  }
  .weui-label{
    width: 3rem;
    text-align: left;
  }
  .box{
    margin-top: 0.16rem;
  }

  .weui-cell__bd{
    text-align: right;
    margin-right: 0.32rem;
  }
  .bottom-button {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.31rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
  }

  .button {
    width: 50%;
    background: rgba(0, 150, 255, 1);
    text-align: center;
    line-height: 1.31rem;
  }
</style>
