<template>
  <div style="background-color: #F6F6F6;display: flex;flex-direction: column">
    <title-nav v-bind:title="title"></title-nav>
    <ul class="delivery-state">
      <li v-for="item in stateList" :key="item.id" @click="selectState(item.id)">
        <span :style="item.id===auditState?'color:#099AFF':''">{{item.state}}</span>
        <i v-if='item.id===auditState'></i>
      </li>
    </ul>
    <div style="flex: 1;overflow: hidden" v-if="orderList.length">
      <cube-scroll
        ref="scroll"
        :data="orderList"
        :options="scrollOptions"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <ul>
          <order-detail :order="order" orderType="outBound" v-for="order in orderList" :key="order.id">
          </order-detail>
        </ul>
      </cube-scroll>
    </div>
    <empty-view v-else></empty-view>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import OrderDetail from "@/components/common/OrderDetail";
  import EmptyView from "@/components/common/EmptyView";
  import {Scroll} from 'cube-ui';
  import http from '@/assets/models/warehouseAndTransferAPIs'
  import {mapState} from "vuex"


  export default {
    name: "OutBoundOrder",
    data() {
      return {
        title: '出库单',
        stateList: [{
          id: '-1',
          state: '全部',
        }, {
          id: '0',
          state: '待支付',
        }, {
          id: '2',
          state: '待出库',
        }, {
          id: '3',
          state: '已完成',
        }],
        orderList: [],
        auditState: `-1`,
        currentPage: 1,
        pageSize: 8,
        pager: {}
      }
    },
    activated() {
      if (this.$route.params.auditState) {
        this.auditState = this.$route.params.auditState
        this.getOrderList()
      }
    },
    components: {
      'title-nav': Navigator,
      'orderDetail': OrderDetail,
      'cube-scroll': Scroll,
      EmptyView
    },
    methods: {
      selectState(id) {
        this.auditState = id;
        this.currentPage = 1
        this.pager = {}
        this.orderList = []
        this.getOrderList()
      },
      onPullingDown() {
        this.currentPage = 1
        this.getOrderList()
      },
      onPullingUp() {
        ++this.currentPage
        this.getOrderList()
      },
      getOrderList() {
        let {currentPage, pageSize, auditState} = this
        if (this.pager && (currentPage > this.pager.totalPage && currentPage > 1)) {
          --this.currentPage
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
          return
        }
        //取全部状态的时候传null
        // 入库单据状态 (申请入库 = 0,待入库 = 1,部分入库 = 2,拒绝入库 = 3,已入库 = 4,已过期 = 5,待支付=6，已取消=7)；
        // 出库单据状态(待支付 = 0,待提货 = 1,待出库 = 2,已出库 = 3,部分出库 = 4,已取消 = 5)；
        // 委托配送状态： 待支付=0 新增=1 待配送=2 配送中=3 已完成=4 已取消=5
        return http.getOrderList({
          billType: 1,
          pageNum: currentPage,
          pageSize: pageSize,
          warehouseType: 2,
          stateList: auditState === `-1` ? null : [parseInt(auditState)]
        }).then(data => {
          if (currentPage === 1) {//拿第一页数据
            this.orderList = data.data.dataList || []
          } else {
            this.orderList = this.orderList.concat(data.data.dataList)
          }
          this.pager = data.data.pager
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
        })
      }
    },
    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
      ...mapState(`dealerInfo`, [`userId`])
    }
  }
</script>

<style lang="stylus" scoped>
  .delivery-state {
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
        left: 0.6rem;
      }
    }
  }
</style>
