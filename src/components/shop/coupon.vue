<template>
  <div style="background-color: #F6F6F6;display: flex;flex-direction: column;overflow: hidden;">
    <title-nav v-bind:title="title"></title-nav>
    <!--选择优惠券类型-->
    <div class="title">
      <div class="titleBox" @click="handleChangeType(false)">
        <span :class="['.ft-40r',assignProductCoupon===false?'color-0096FF':'color-666']">通用券</span>
        <i class="line" v-show="assignProductCoupon===false"></i>
      </div>
      <div class="titleBox" @click="handleChangeType(true)">
        <span :class="['.ft-40r',assignProductCoupon===true?'color-0096FF':'color-666']">定向产品券</span>
        <i class="line" style="left: 0.3rem" v-show="assignProductCoupon===true"></i>
      </div>
    </div>
    <!--选择优惠券发布状态-->
    <div class="coupon-state">
      <div :class="['msg-btn',state=='0'?'msg-btn-active':'']"
           @click="handleSelectState('0')">
        <i class="icon icon-pop_ic_xz" style="margin-right: 0.2rem"  v-show="state=='0'"></i>
        待发布
      </div>
      <div :class="['msg-btn',state=='2'?'msg-btn-active':'']"
           @click="handleSelectState('2')">
        <i class="icon icon-pop_ic_xz" style="margin-right: 0.2rem"  v-show="state=='2'"></i>
        已发布
      </div>
      <div :class="['msg-btn',state=='3'?'msg-btn-active':'']"
           @click="handleSelectState('3')">
        <i class="icon icon-pop_ic_xz" style="margin-right: 0.2rem" v-show="state=='3'"></i>
        已下架
      </div>
    </div>
    <div class="line-box"></div>
    <!--优惠券信息-->
    <div class="coupon-box scroll-wrap" style="margin-bottom: 0.5rem" v-if="listTemp&&listTemp.length">
      <cube-scroll
        ref="scroll"
        :data="listTemp"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @scroll="onScrollHandle"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <ul>

          <li :class="['coupon-li',assignProductCoupon===true?'note2':'note']"
              :style="assignProductCoupon===true?note2:note" v-for="item in listTemp"
              :key="item.id">
            <router-link :to="{path:'/detailCoupon/'+item.couponActivityId+'/'+assignProductCoupon}">
              <p class="note-name color-333333 ft-40r">
                <span>{{item. couponName}}</span>
                <span><i class="icon icon-xk_youjiantou_copy"></i></span>
            </p>
            <p class="note-limit color-666">{{item.productName}}</p>
            </router-link>
            <p class="note-time">
              <span>{{item.beginDate}}-{{item.endDate}}</span>
              <span v-if="item.state===0" class="genre"
                    @click="handlePublishCoupon('0',item.couponActivityId)">发布</span>
              <span v-else-if="item.state===2" class="genre"
                    @click="gotoHandleDisableCoupon(item.couponActivityId)">下架</span>
              <span v-else="item.state===3"></span>
            </p>

          </li>

        </ul>

      </cube-scroll>
    </div>
    <!--空页面-->
    <empty-view v-else></empty-view>
    <!--下架提醒弹框-->
    <cube-pop position="center" :maskClosable="true" ref="note">
      <div class="setting">
        <p class="popHeader ft-43r">温馨提示</p>
        <div class="mode ft-40r ">下架优惠券后，已领取的优惠券仍可使用，但不能再领取

        </div>
        <div class="selectButton color-0096FF">
          <span @click="handleDisableCoupon()">好的</span>
        </div>
      </div>
    </cube-pop>
    <div class="footer" @click="gotoAddCoupon">
      <span class="footer-span" >
          <i class="icon icon-ic_tianjia_bai"></i>
        <span style="margin-left: 0.1rem">新增优惠券</span>
      </span>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import EmptyView from "@/components/common/EmptyView";
  import {Scroll,Popup} from 'cube-ui';
  import http from '@/assets/models/shopAPIs';
  import {mapState,mapMutations} from 'vuex';

  export default {
    name: "coupon",
    data() {
      return {
        title: '优惠券',
        fromPage:'1',//从优惠券页面跳转
        currentPage: 1,
        pageSize: 10,
        couponActivityId: '',
        assignProductCoupon: false, //false 通用券 true 定向券
        state: '0',//0-待发布，2-已发布，3-已下架
        listTemp: [],
        note: {
          backgroundImage: "url(" + require("../../../static/icons/tyq_bg_xq@3x.png") + ")",
          backgroundRepeat: "no-repeat",
          width: "9.36rem",
          height: "2.35rem",
        },
        note2: {
          backgroundImage: "url(" + require("../../../static/icons/tyq_bg_dq@3x.png") + ")",
          backgroundRepeat: "no-repeat",
          width: "9.36rem",
          height: "2.77rem",
        },
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-scroll': Scroll,
      'empty-view':EmptyView,
      'cube-pop': Popup
    },
    methods: {
      //获取优惠券活动信息
      getListCouponActivity() {
        let {currentPage, pageSize, assignProductCoupon, state} = this;
        http.getListCouponActivity({currentPage, pageSize, param: {assignProductCoupon, state}})
          .then(data => {
            //1.拿第1页，有数据   列表清空，直接把数据填入，页码加1
            //2.拿第1页。没数据    列表清空，显示暂无数据
            //3.拿非第1页，有数据   列表不清空，直接追加，页码加1
            //4.拿非第1页，没数据   列表不清空，页码不加1
            let list = data.data || []
            let hasData = list.length
            if (currentPage === 1 && hasData) {//1
              this.listTemp = list
              this.currentPage++
            } else if (currentPage !== 1 && hasData) {//3
              this.listTemp = this.listTemp.concat(list)
              this.currentPage++
            } else if (currentPage === 1 && !hasData) {//2
              this.listTemp = []
            }//4 不做任何处理

          })
      },
      //下架优惠券
      disableCouponActivity() {
        http.disableCouponActivity({param: this.couponActivityId})
          .then(data => {
            //下架成功后手动去掉所选的那一张券
            //过滤当前的列表 ，把下架的券去掉
            this.listTemp=this.listTemp.filter(item=>item.couponActivityId!==this.couponActivityId)
            // this.getListCouponActivity()
            this.$toast({message:`下架成功`})
          })
          .catch(error => {
            console.log(error)
          })
      },

      gotoHandleDisableCoupon(couponId){
        this.couponActivityId=couponId
        this.$refs.note.show();
      },
      //发布优惠券
      publishCouponActivity(){
        http.publishCouponActivity({param:this.couponActivityId})
          .then(data=>{
            //下架成功后手动去掉所选的那一张券
            this.listTemp=this.listTemp.filter(item=>item.couponActivityId!==this.couponActivityId)
            this.$toast({message:`发布成功`})
          })
          .catch(error=>{
            console.log(error)
          })
      },
      //切换定向券和通用券
      handleChangeType(toggle) {
        //将优惠券状态保存在vuex中，这样返回当前页面时选中状态不会丢失
        this.setCouponType(toggle);
        this.assignProductCoupon = this.couponType;
        this.currentPage = 1;
        this.getListCouponActivity();
      },
      //选择发布状态
      handleSelectState(stateTypes) {
        this.setCouponState(stateTypes);
        this.state=this.couponState;
        this.currentPage = 1;
        this.getListCouponActivity()
      },
      //下架优惠券，将优惠券的状态由已发布改为下架
      handleDisableCoupon() {
        this.$refs.note.hide();
        this.disableCouponActivity();
      },
      //发布优惠券，将优惠券的状态由待发布改为发布
      handlePublishCoupon(primaryState,id){
        this.couponActivityId=id;
        this.publishCouponActivity();
      },
      onScrollHandle() {
      },
      /*滚动下拉*/
      onPullingDown() {
        console.log('下拉滚动');
        this.currentPage = 1;
        this.getListCouponActivity();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      //滚动上拉
      onPullingUp() {
        console.log('滚动上拉');
        this.getListCouponActivity();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      gotoAddCoupon(){
        //进入新增页面前，清空编辑页面时vuex中存储得数据
        this.setClearMessage();
        this.setClearProduct();
        let fromPage=this.fromPage
        this.$router.push({name:'addCoupon',params:{fromPage}});
      },

      ...mapMutations('couponInfo',['setCouponType','setCouponState','setClearMessage']),
      ...mapMutations('productForCoupon',['setClearProduct']),
    },
    created() {
      //将vuex中存储的优惠券类型赋给assignProductCoupon
      this.assignProductCoupon=this.couponType;
      this.state=this.couponState;
      this.getListCouponActivity();
    },
    computed: {
      ...mapState('couponInfo',['couponType','couponState']),
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .line {
    width: 1.333rem;
    height: 0.053rem;
    background: #0096FF;
    top: 0.7rem;
    position: absolute;
    bottom: 0;
    left: -0.1rem;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: white;
    padding: 0.39rem 0.1rem;
    font-size: 0.4rem;
    height: 1.17rem;
    border-bottom: 0.01rem solid #EDEDED;
  }

  .titleBox {
    position: relative;
  }
  .msg-btn {
    width: 2.91rem;
    height: 0.75rem;
    font-size: 0.35rem;
    border-radius: 0.05rem;
    background-color: rgba(245, 245, 245, 1);
    border: 0.01rem solid white;
    text-align: center;
    border-radius: 0.05rem;
    line-height: 0.75rem;
    position: relative;
    display flex;
    align-items center;
    justify-content center;
  }

  .msg-btn-active {
    border: 0.02rem solid #099AFF;
    background-color: white;
    color: #099AFF;
    width: 2.91rem;
    height: 0.75rem;
    line-height: 0.75rem;
  }

  .coupon-state {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 1.17rem;
    padding: 0.21rem 0.1rem 0rem;
    line-height: 1.17rem;
    background-color: white;

  }

  .line-box {
    height: 0.32rem;
    width: 100%;
    background-color: #F6F6F6;
  }

  .footer {
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #0096FF;
    height: 1.31rem;
    line-height: 1.31rem;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .footer-span{
    color: white;
    font-size: 0.45rem;
    display: flex;
    align-items: center
  }
  .coupon-box {
    background-color: #F6F6F6;
    flex: 1;
    overflow: hidden;
  }

  .coupon-li {
    margin-left: 0.32rem;
    margin-bottom: 0.32rem;
  }

  .note-name {
    font-size: 0.4rem;
    text-align: left;
    padding: 0.39rem 0.32rem 0 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .note-time {
    font-size: 0.35rem;
    color: rgba(102, 102, 102, 1);
    padding-top: 0.71rem;
    text-align: left;
    padding-left: 0.32rem;
    position: relative;
  }

  .genre {
    width: 1.81rem;
    height: 0.75rem;
    font-size: 0.37rem;
    background-color: rgba(9, 154, 255, 1);
    border-radius: 0.37rem;
    color: white;
    display: inline-block;
    text-align: center;
    line-height: 0.75rem;
    position: absolute;
    right: 0.32rem;
    top: 0.4rem;
  }

  .note-limit {
    font-size: 0.35rem;
    padding-top: 0.21rem;
    text-align: left;
    padding-left: 0.32rem;
  }
  .scroll-wrap {
    overflow: hidden;
    flex: 1;
  }
  .note {
    background-size: 100% 2.35rem
  }
  .note2 {
    background-size: 100% 2.77rem
  }
  .setting {
    width: 7.68rem;
    background: #fff;
    font-size: 0.43rem;
    color: #333;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;

    .popHeader {
      text-align center;
      padding: 0.43rem 0 0.43rem 0;
    }
    .mode {
      display: flex;
      flex-direction: row;
      justify-content space-between;
      line-height 0.48rem
      padding: 0.2rem 0.64rem;
      p {
        display: flex;
        align-items center;
        i {
          margin-right: 0.31rem;
        }
      }
    }
    .selectButton {
      display: flex;
      flex-direction: row;
      border-top 0.01rem solid #EDEDED
      span {
        flex: 1;
        border-right: 1px solid #ededed;
        padding: 0.37rem 0;

      }
    }
  }
</style>
