<template>
  <div id="groupActivity">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>组合活动</span>
    </div>
    <ul class="activityState">
      <li v-for="item in activityStateList" @click="selectActivity(item.id)">
        <span :style="item.id==activityState?'color:#099AFF':''">{{item.state}}</span>
        <i v-if='item.id==activityState'></i>
      </li>
    </ul>
    <div class="scroll-wrap">
      <cube-scroll
        ref="scroll"
        :data="activityList"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @scroll="onScrollHandle"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <div class="product" v-for="item in activityList">
          <div class="product-info" @click="gotoProductDetail(item)">
            <div class="product-img">
              <img :src="item.appShowImg"/>
              <span>仅剩{{item.inventory}}件</span>
            </div>
            <div class="product-content">
              <p class="productName">{{item.promotionName}}</p>
              <div>
                <p><span>￥</span>{{item.promotionPrice.toFixed(2)}}<span> 套</span></p>
                <p><span>库存：</span>{{item.inventory}}</p>
              </div>
            </div>
          </div>
          <div class="endTime" :style="activityState==3?'padding:0.4rem;':''">
            <p>活动截止时间：{{item.startTime}}-{{item.endTime}}</p>
            <span v-show="activityState==0" @click="publish(item.promotionId)">发布</span>
            <span v-show="activityState==2" @click="lowerFrame(item.promotionId)">下架</span>
          </div>
        </div>
        <!--空页面-->
        <!--<div class="emptyPage" v-show="!initing&&(!activityList||activityList.length==0)">
          <img src="/static/icons/Group7Copy.png">
          <span>暂无数据</span>
        </div>-->
        <empty-view v-show="!initing&&(!activityList||activityList.length==0)"></empty-view>
      </cube-scroll>
    </div>
    <div class="addActivity" @click="gotoAddActivity">
      <i class="icon icon-ic_tianjia_bai"></i>
      新增组合活动
    </div>
  </div>
</template>


<script>
  import {Popup, Scroll} from 'cube-ui'
  import http from "@/assets/models/shopAPIs";
  import EmptyView from "@/components/common/EmptyView";
  import {mapMutations} from 'vuex';

  export default {
    name: '',
    props: [],
    data() {
      return {
        activityStateList: [{id: 0, state: '待发布'}, {id: 2, state: '已发布'}, {id: 3, state: '已下架'}], //待发布（0）  已发布（1）  已下架（2）
        activityState: 0,  //待发布（0）  已发布（2）  已下架（3）
        activityList: [],
        currentPage: 1,
        pageSize: 10,
        initing: false,
      }
    },
    created() {
      this.getGroupActivityList();
    },
    components: {
      'cube-scroll': Scroll,
      'cube-pop': Popup,
      EmptyView,
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      selectActivity(id) {
        this.activityState = id;
        this.currentPage = 1
        this.getGroupActivityList();
      },
      onScrollHandle() {
      },
      onPullingDown() {
        console.log('滚动下拉')
        this.currentPage = 1;
        this.getGroupActivityList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        console.log('滚动上拉')
        this.getGroupActivityList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      /*获取组合活动列表*/
      getGroupActivityList() {
        let {activityState, currentPage, pageSize} = this;
        http.getGroupActivityList({currentPage, pageSize, param: activityState})
          .then(data => {
            if ((!data.data || !data.data.length) && this.currentPage == 1) {
              this.activityList = [];
              this.initing = false;
            } else if ((!data.data || !data.data.length) && this.currentPage != 1) {
              this.$toast({message: `没有更多数据了`})
            } else {
              this.auditList = [];
              let oldAuditList = this.auditList;
              let newAuditList = data.data;
              let finalList = oldAuditList.concat(newAuditList)
              this.activityList = finalList;
              ++this.currentPage
              this.initing = false
            }
            this.initing = false;
          })
          .catch(error => {
            console.log(error)
            this.initing = false
          })
      },
      /*去详情*/
      gotoProductDetail(productInfo) {
        this.$router.push({name: `groupProductDetail`, query: {productInfo}})
        this.setProductInfo(productInfo)
      },
      gotoAddActivity() {
        this.$router.push({name: `addGroupActivity`})
      },
      //发布
      publish(selectId) {
        http.releaseActivity({param: {isPush: false, promotionId: selectId}})
          .then(data => {
            this.activityList = this.activityList.filter(item => item.promotionId !== selectId)
            this.$toast({message: `发布成功`})
          })
          .catch(error => {
            this.$toast({message: error})
          })
      },
      //下架
      lowerFrame(selectId) {
        http.LowerFrameActivity({param: {promotionId: selectId}})
          .then(data => {
            this.activityList = this.activityList.filter(item => item.promotionId !== selectId)
            this.$toast({message: `下架成功`})
          })
          .catch(error => {
            this.$toast({message: error})
          })
      },
      ...mapMutations(`groupActivityInfo`, [`setProductInfo`])
    },
    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
    },
  }
</script>


<style lang="stylus" scoped>
  #groupActivity {
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

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

  .activityState {
    width: 100%;
    display: flex;
    flex-direction: row;
    background: #fff;
    li {
      flex: 1;
      font-size: 0.4rem;
      color: #666;
      position: relative;
      text-align: center;
      padding: 0.39rem 0;
      i {
        display: block;
        width: 1.2rem;
        height: 0.05rem;
        background: rgba(9, 154, 255, 1);
        position: absolute;
        bottom: 0;
        left: 1.07rem;
      }
    }
  }

  .scroll-wrap {
    flex: 1;
    overflow: hidden;
    .product {
      background: #fff;
      margin-top: 0.27rem;
      .product-info {
        padding: 0.32rem;
        border-bottom: 1px solid #ededed;
        display: flex;
        flex-direction: row;
        .product-img {
          width: 2.13rem;
          height: 2.13rem;
          position: relative;
          margin-right: 0.21rem;
          img {
            width: 100%;
            height: 100%
          }
          span {
            position: absolute;
            left: 0;
            bottom: 0;
            display: block;
            width: 1.92rem;
            height: 0.35rem;
            line-height: 0.35rem;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            font-size: 0.27rem;
          }
        }
        .product-content {
          display: flex;
          flex-direction: column;
          justify-content space-between;
          text-align left;
          .productName {
            color: #333;
            font-size: 0.4rem;
          }
          div {
            display: flex;
            align-items flex-end;
            p {
              &:nth-child(1) {
                padding-right: 0.43rem;
                color: #FA6F31;
                font-size: 0.48rem;
                span {
                  font-size: 0.32rem;
                }
              }
              &:nth-child(2) {
                color: #FA6F31;
                font-size: 0.35rem;
                span {
                  color: #666;
                }
              }
            }
          }
        }
      }
      .endTime {
        padding: 0.21rem 0.32rem;
        display: flex;
        flex-direction: row;
        justify-content space-between;
        align-items center;
        p {
          color: #666;
          font-size: 0.35rem;
        }
        span {
          display: block;
          width: 1.81rem;
          height: 0.75rem;
          text-align: center;
          line-height: 0.75rem;
          border: 1px solid #099AFF;
          color: #099AFF;
          font-size: 0.37rem;
          -webkit-border-radius: 0.05rem;
          -moz-border-radius: 0.05rem;
          border-radius: 0.05rem;
        }
      }
    }
  }

  .addActivity {
    display: flex;
    align-items center;
    background: #099AFF;
    height: 1.31rem;
    line-height 1.31rem;
    width: 100%;
    line-height: 1.31rem;
    justify-content center;
    color: #fff;
    font-size: 0.45rem;
    i {
      margin-right: 0.21rem;
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
</style>
