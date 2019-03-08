<template>
  <div style="background-color: #F6F6F6;display: flex;flex-direction: column;overflow: hidden;">
    <div class="header-hight ft-43r">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <div class="span-box">
        <div :class="takeState==2?'active':''" @click="clickToggle(2)"
             style="border-right: 0.01rem solid white; border-radius:0.1rem 0 0 0.1rem;">待结算
        </div>
        <div :class="takeState==3?'active':''" @click="clickToggle(3)" style=" border-radius:0 0.1rem 0.1rem 0;">已结算
        </div>
      </div>
    </div>
    <div class="title ft-37r color-666" v-if="takeState==2">
      <span>待结算金额：<span class="orange">￥{{settlementAmount?settlementAmount:0}}</span></span>
      <!--<span style="padding-left: 1rem">保证金：<span class="orange">￥{{depositAmount?depositAmount:0}}</span></span>-->
    </div>
    <div v-else>
      <div class="time-box ft-37r color-666">
        <span class="time-span" style="border-right: 0.01rem solid #EDEDED" @click="selectStartDate">
          <img class="timeIcon" src="/static/icons/yingshou_qi.png"/>
         <span v-if="startDate">{{startDate}}</span>
          <span v-else>起始时间</span>
          <i class="icon icon-map_ic_xl_bai"></i>
        </span>
        <span class="time-span" @click="selectEndDate">
          <img class="timeIcon" src="/static/icons/yingshou_zhi.png"/>
         <span v-if="endDate">{{endDate}}</span>
          <span v-else>截止时间</span>
           <i class="icon icon-map_ic_xl_bai"></i>
        </span>
      </div>
      <div class="title ft-37r color-666">
        <span>已结算金额：<span class="orange">￥{{totalAmount?totalAmount:0}}</span></span>
      </div>
    </div>
    <div class="scroll-wrap" v-if="pickingList&&pickingList.length">
      <cube-scroll
        ref="scroll"
        :data="pickingList"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <ul class="ul-box">
          <li class="li-box" v-for=" item in pickingList" :key="item.storeBatchNo">
            <div class="li-box-header" @click="gotoBatchInfo(item.storeBatchNo)">
          <span class="li-box-header-batch ft-40r color-333333"><span>备货批次：{{item.storeBatchNo}}</span><i
            class="icon icon-xk_youjiantou_copy"></i></span>
              <span class="ft-35r color-999">创建时间：{{item.createTime|timestamp}}</span>
            </div>
            <div class="li-box-context ft-35r color-666">
              <div>取货员：{{item.takeUser}}</div>
              <span>取货合计：<span class="orange">{{item.salesTakeBigCount}}大件{{item.salesTakeSmallCount}}小件</span></span>
              <div>退货合计：<span class="orange">{{item.salesBackBigCount}}大件{{item.salesBackSmallCount}}小件</span></div>
              <div>批次应收：<span class="orange">￥{{item.receivaleAmount|fixedTwo}}</span></div>
            </div>
          </li>
        </ul>

      </cube-scroll>
    </div>
    <!--空页面-->
    <empty-view v-else></empty-view>
  </div>
</template>

<script>
  import http from '@/assets/models/shopAPIs';
  import {mapState} from 'vuex';
  import EmptyView from "@/components/common/EmptyView";
  import {Scroll} from 'cube-ui';
  export default {
    name: "accountOrder",
    data() {
      return {
        takeState: 2,//备货状态 1=待备货，2=待结算，3=已结算
        settlementAmount: '',//结算金额
        pageNum: 1,
        pageSize: 10,
        totalAmount:'',
        startDate: null,
        endDate: null,
        pickingList: [],
      }
    },
    components:{
      'cube-scroll': Scroll,
      'empty-view':EmptyView,
    },
    created() {
      this.startDatePicker = this.$createDatePicker({
        title: '起始时间',
        min: new Date(2008, 0, 1),
        max: new Date(2030, 11, 31),
        value: new Date(),
        format: {
          year: 'YYYY',
          month: 'MM',
          date: 'DD'
        },
        onSelect: (data, selectedVal, selectedText) => {
          this.startDate = `${selectedVal.join('-')}`

        }
      });
      this.endDatePicker = this.$createDatePicker({
        title: '起始时间',
        min: new Date(2008, 0, 1),
        max: new Date(2030, 11, 31),
        value: new Date(),
        format: {
          year: 'YYYY',
          month: 'MM',
          date: 'DD'
        },
        onSelect: (data, selectedVal, selectedText) => {
          this.endDate = `${selectedVal.join('-')}`

        }
      });
    },
    methods: {
      //获取待结算金额接口
      totalWaitPayAmount(){
        let dealerId = this.shopId;
        http.totalWaitPayAmount(dealerId).then(data=>{
          this.settlementAmount=data.data.totalAmount;
        }).catch(e=>{
          console.log(e)
        })
      },
      //获取总结算金额接口
      totalPayAmount(){
        let dealerId = this.shopId;
        http.totalPayAmount(dealerId).then(data=>{
      this.totalAmount=data.data;
        }).catch(e=>{
          console.log(e)
        })
      },
      //查询备货单或对账单接口
      directMatchOrderList() {
        let {pageNum, pageSize, takeState} = this;
        let dealerId = this.shopId;
        let beginTime = this.startDate;
        let endTime = this.endDate;
        http.directMatchOrderList({pageNum, pageSize, beginTime, endTime, takeState, dealerId}).then(data => {
          //1.拿第1页，有数据   列表清空，直接把数据填入，页码加1
          //2.拿第1页。没数据    列表清空，显示暂无数据
          //3.拿非第1页，有数据   列表不清空，直接追加，页码加1
          //4.拿非第1页，没数据   列表不清空，页码不加1
          let list = data.data || []
          let hasData = list.length
          if (pageNum === 1 && hasData) {//1
            this.pickingList = list
            this.pageNum++
          } else if (pageNum !== 1 && hasData) {//3
            this.pickingList = this.pickingList.concat(list)
            this.pageNum++
          } else if (pageNum === 1 && !hasData) {//2
            this.pickingList = []
          }//4 不做任何处理

        }).catch(e => {
          console.log(e)
        })
      },
      goBack() {
        this.$router.go(-1);
      },
      clickToggle(type) {
        this.takeState = type;
        this.pageNum=1;
        this.startDate= null;
        this.endDate= null;
        this.directMatchOrderList();
      },
      gotoBatchInfo(id) {
        this.$router.push({name: 'batchInfo', params: {id}});
      },
      selectStartDate() {
        this.startDatePicker.show();
      },
      selectEndDate() {
        this.endDatePicker.show();
      },
      onScrollHandle() {
      },
      /*滚动下拉*/
      onPullingDown() {
        console.log('下拉滚动');
        this.pageNum = 1;
        this.directMatchOrderList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      //滚动上拉
      onPullingUp() {
        console.log('滚动上拉');
        this.directMatchOrderList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
    },
    mounted() {
      this.directMatchOrderList();
      this.totalPayAmount();
      this.totalWaitPayAmount();
    },
    computed: {
      ...mapState('dealerInfo', ['shopId']),
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      }
    },
    watch: {
      startDate: function () {
        this.directMatchOrderList();
      },
      endDate: function () {
        this.directMatchOrderList();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .scroll-wrap {
    overflow: hidden;
    flex: 1;
  }
  .title {
    height 1.04rem;
    width 100%;
    line-height 1.04rem;
    text-align left;
    padding-left 0.4rem;
  }

  .header-hight {
    font-weight: bold;
    height: 1.173333rem;
    line-height: 110%;
    /*防止出现白线*/
    margin-bottom: -0.01rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    display flex;
    align-items center
    padding-left 0.3rem
    text-align center
    .span-box {
      margin-left 1.5rem;
      border-radius: 0.1rem;
      border 0.02rem solid #FFFFFF
      display flex;
      flex-direction row;
      color white
      div {
        padding 0.1rem 0.5rem
      }
    }
    .active {
      background-color white;
      color #42A5F5;
    }
  }

  .orange {
    color #FF703B
  }

  .li-box {
    background-color white;
    margin-bottom 0.3rem;
    .li-box-header {
      display flex;
      flex-direction column
      text-align left;
      line-height 0.6rem;
      padding 0.3rem 0.4rem;
      border-bottom 0.01rem solid #EDEDED;
      .li-box-header-batch {
        display flex;
        flex-direction row;
        justify-content space-between;
        align-items center;
      }
    }
    .li-box-context {
      padding 0.3rem 0.4rem;
      text-align left;
      line-height 0.53rem;
    }
  }

  .time-box {
    background-color white;
    height 1.17rem;
    text-align center;
    display flex;
    flex-direction row;
    align-items center;

    .time-span {
      width 50%;
      display flex;
      align-items center;
      padding-left 1.2rem
      span {
        padding-left 0.3rem;
      }
      i {
        margin-left 0.15rem
      }
      .timeIcon {
        width 0.64rem;
        height 0.64rem;
      }
    }

  }
</style>
