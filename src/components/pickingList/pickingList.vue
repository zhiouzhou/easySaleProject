<template>
  <div style="background-color: #F6F6F6;display: flex;flex-direction: column;overflow: hidden;">
    <title-nav v-bind:title="title"></title-nav>
    <div class="title ft-37r color-666">
      <span>取货合计：<span class="orange">{{takeBigTotalCount}}大件{{takeSmallTotalCount}}小件</span></span>
      <span style="margin-left: 0.64rem">退货合计：<span
        class="orange">{{backBigTotalCount}}大件{{backSmallTotalCount}}小件</span></span>
    </div>
    <div class="scroll-wrap" v-if="pickingList&&pickingList.length">
      <cube-scroll
        ref="scroll"
        :options="scrollOptions"
        :data="pickingList"
        :scroll-events="['scroll']"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <ul class="ul-box">
          <li class="li-box" v-for=" item in pickingList" :key="item.storeBatchNo"
              @click="gotoBatchInfo(item.storeBatchNo)" v-if="item.takeState==1">
            <div class="li-box-header">
          <span class="li-box-header-batch ft-40r color-333333"><span>备货批次：{{item.storeBatchNo}}</span><i
            class="icon icon-xk_youjiantou_copy"></i></span>
              <span class="ft-35r color-999">创建时间：{{item.createTime|timestamp}}</span>
            </div>
            <div class="li-box-context ft-35r color-666">
              <div>取货员：{{item.takeUser}}</div>
              <span>取货合计：<span class="orange">{{item.salesTakeBigCount}}大件{{item.salesTakeSmallCount}}小件</span></span>
              <div>退货合计：<span class="orange">{{item.salesBackBigCount}}大件{{item.salesBackSmallCount}}小件</span></div>
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
  import Navigator from "@/components/common/Navigator";
  import http from '@/assets/models/shopAPIs';
  import {mapState, mapMutations} from 'vuex';
  import {Scroll} from 'cube-ui';
  import EmptyView from "@/components/common/EmptyView";

  export default {
    name: "pickingList",
    data() {
      return {
        title: '易酒批备货单',
        backBigTotalCount: '',//退货合计大数量
        backSmallTotalCount: '',
        takeBigTotalCount: '',
        takeSmallTotalCount: '',
        totalMin: '2',
        totalMax: '1',
        pageNum: 1,
        pageSize: 10,
        takeState: '1',//备货状态 1=待备货，2=待结算，3=已结算
        pickingList: [],//备货单列表
      }
    },
    components: {
      'title-nav': Navigator,
      'empty-view': EmptyView,
      'cube-scroll': Scroll,
    },
    mounted() {
      this.directMatchOrderList();
      this.getDealerStoreCount()
    },
    methods: {
      //查询备货单接口
      directMatchOrderList() {
        let {pageNum, pageSize, takeState} = this;
        let dealerId = this.shopId;
        http.directMatchOrderList({pageNum, pageSize, takeState, dealerId}).then(data => {

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
      //货物总数量统计接口
      getDealerStoreCount() {
        let dealerId = this.shopId;
        http.getDealerStoreCount(dealerId).then(data => {
          this.backBigTotalCount = data.data.backBigTotalCount;
          this.backSmallTotalCount = data.data.backSmallTotalCount;
          this.takeBigTotalCount = data.data.takeBigTotalCount;
          this.takeSmallTotalCount = data.data.takeSmallTotalCount;
        }).catch(e => {
          console.log(e)
        })
      },
      gotoBatchInfo(id) {
        this.$router.push({name: 'batchInfo', params: {id}});
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
    computed: {
      ...mapState('dealerInfo', ['shopId']),
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
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

</style>
