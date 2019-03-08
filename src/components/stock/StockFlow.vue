<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <search-bar searchNoticeText="搜索单号" @onClickSearch="onSearch"></search-bar>
    <!--下拉菜单-->
    <drop-menu :menuData="dropMenuData" :edgeMargin="3.4633"
               @on-select-menu="onSelectMenuItem" @on-date-pick="onSelectDate"
               ref="dropMenu"
               v-if="dropMenuData&&dropMenuData.length&&warehouseList[0].name">
    </drop-menu>

    <div class="sum-line ft-35r" v-if="orderList.length">
      <span class="color-666">入库汇总 <span class="color-2F9B60">+{{inWarehouseNum}}</span></span>
      <span class="color-666">出库汇总<span class="color-E53935">-{{outWarehouseNum}}</span></span>
    </div>
    <div class="scroll-wrap" v-if="orderList.length">
      <cube-scroll
        ref="scroll" :data="orderList" :options="scrollOptions"
        @pulling-down="onPullingDown" @pulling-up="onPullingUp">
        <ul>
          <li class="order-item" :key="order.noteno" v-for="order in orderList"
              @click="goToStockFlowDetail(order.type,order.id)">
            <div class="left ft-40r color-333">
              <span>{{order.type|timeTxt}}{{order.storetime}}</span>
              <span>{{order.type|productTxt}}{{order.productCount}}种</span>
              <span>{{order.type|noteNoTxt}}{{order.noteno}}</span>
            </div>
            <i class="icon icon-ic_jt_hui_36"></i>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <empty-view v-else></empty-view>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import SearchBar from "@/components/common/SearchBar"
  import DropMenu from "@/components/common/DropMenu"
  import EmptyView from "@/components/common/EmptyView"
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import DateUtil from '@/scripts/DateUtils'
  import {Scroll} from "cube-ui"

  export default {
    name: 'stockFlow',
    props: [],
    data() {
      return {
        title: '库存流水',
        keyWord: ``
      }
    },
    filters: {
      timeTxt(value) {
        return value === 1 ? `入库时间：` : value === 2 ? `出库时间：` : ``
      },
      productTxt(value) {
        return value === 1 ? `入库商品：` : value === 2 ? `出库商品：` : ``
      },
      noteNoTxt(value) {
        return value === 1 ? `入库单号：` : value === 2 ? `出库单号：` : ``
      },
    },
    components: {
      'title-nav': Navigator,
      'search-bar': SearchBar,
      'cube-scroll': Scroll,
      DropMenu, EmptyView
    },
    mounted() {
      if (this.$route.params.isInBound === true) {
        this.setCurrentOrderTypeId({id: `1`})
      } else if (this.$route.params.isInBound === false) {
        this.setCurrentOrderTypeId({id: `2`})
      } else {
        this.setCurrentOrderTypeId({id: `0`})
      }
      //如果从上个页面传入了单据类型，初始化
      this.getWarehouseListByCity()
        .then(() => {
          this.refreshList()
        })
    },
    activated() {
    },
    methods: {
      refreshList() {
        this.setPageNum({num: 1})
        this.updateOrderList()
      },
      onSearch(searchTxt) {
        this.keyWord = searchTxt
        this.refreshList()
      },
      onSelectMenuItem(keyWord, menuId) {
        if (keyWord === `warehouse`) {
          this.setCurrentWarehouseId({id: menuId})
          this.refreshList()
        } else if (keyWord === `orderType`) {
          this.setCurrentOrderTypeId({id: menuId})
          this.refreshList()
        } else if (keyWord === `dateType`) {
          this.setCurrentDateTypeId({id: menuId})
          this.refreshList()
        }
      },
      onSelectDate(selectedDate) {
        this.setSelectDate({date: selectedDate})
        this.refreshList()
      },
      goToStockFlowDetail(orderType, orderId) {
        this.$router.push({path: `/stockFlowDetail/${orderType}/${orderId}`})
      },
      onPullingDown() {
        this.refreshList()
      },
      onPullingUp() {
        let originalNum = this.pageNum
        this.setPageNum({num: ++originalNum})
        this.updateOrderList()
      },
      //刷新数据列表
      updateOrderList() {
        let thisMonthStrObj = this.getThisMonthStr()
        let param = {
          billType: this.currentOrderTypeId,
          startTime: this.currentDateTypeId === `0` ? thisMonthStrObj.firstDayStr : this.selectDate[0],
          endTime: this.currentDateTypeId === `0` ? thisMonthStrObj.lastDayStr : this.selectDate[1],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          warehouseId: this.currentWarehouseId,
        }
        this.getStockFlowList(param)
          .then(() => {
            this.$refs.scroll && this.$refs.scroll.forceUpdate()
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      //获取本月的第一天和最后一天
      getThisMonthStr() {
        let firstDayOfThisMonth = DateUtil.getCurrentMonthFirst()
        let lastDayOfThisMonth = DateUtil.getCurrentMonthLast()
        let firstDayStr = `${firstDayOfThisMonth.getFullYear()}-${firstDayOfThisMonth.getMonth() + 1}-${firstDayOfThisMonth.getDate()}`
        let lastDayStr = `${lastDayOfThisMonth.getFullYear()}-${lastDayOfThisMonth.getMonth() + 1}-${lastDayOfThisMonth.getDate()}`
        return {firstDayStr, lastDayStr}
      },
      ...mapActions(`cityAndWarehouse`, [`getWarehouseListByCity`]),
      ...mapActions(`stockFlow`, [`getStockFlowList`]),
      ...mapMutations(`cityAndWarehouse`, [`setCurrentWarehouseId`]),
      ...mapMutations(`stockFlow`, [`setCurrentOrderTypeId`, `setCurrentDateTypeId`, `setSelectDate`,
        `setOrderList`, `setInWarehouseNum`, `setOutWarehouseNum`, `setPageNum`]),
    },
    computed: {
      inWarehouseNum() {
        let num = 0
        this.orderList.forEach(item => {
          if (item.type === 1) {
            num += item.totalUnitCount
          }
        })
        return num
      },
      outWarehouseNum() {
        let num = 0
        this.orderList.forEach(item => {
          if (item.type === 2) {
            num += item.totalUnitCount
          }
        })
        return num
      },
      dropMenuData() {
        if (!this.warehouseList || !this.warehouseList.length) return
        let warehouseList = this.warehouseList.map(item => {
          item.menuId = item.id
          item.menuName = item.name
          return item
        })
        let warehouseMenu = {keyWord: `warehouse`, warehouseList}


        let orderTypeList = this.orderTypeList.map(item => {
          item.menuId = item.orderTypeId
          item.menuName = item.orderTypeName
          return item
        })

        let orderTypeMenu = {keyWord: `orderType`, orderTypeList, initId: ``, initName: ``}
        if (this.$route.params.isInBound === true) {
          orderTypeMenu.initId = `1`
          orderTypeMenu.initName = `入库记录`
        } else if (this.$route.params.isInBound === false) {
          orderTypeMenu.initId = `2`
          orderTypeMenu.initName = `出库记录`
        }

        let dateTypeList = this.dateTypeList.map(item => {
          item.menuId = item.dateTypeId
          item.menuName = item.dateTypeName
          return item
        })
        let dateTypeMenu = {keyWord: `dateType`, dateTypeList}

        return [warehouseMenu, orderTypeMenu, dateTypeMenu]
      },
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
      orderList() {
        if (this.$store.getters)
          return this.$store.getters[`stockFlow/filterOrderList`](this.keyWord)
      },
      ...mapState(`stockFlow`,
        [`orderTypeList`, `currentOrderTypeId`, `dateTypeList`,
          `currentDateTypeId`, `selectDate`, `pageNum`, `pageSize`]),
      ...mapState(`cityAndWarehouse`, [`warehouseList`, `currentWarehouseId`]),
    },
    watch: {
      $route(to, from) {
        from.meta.keepAlive = to.name === `stockFlowDetail`;
      }
    }
  }
</script>


<style lang="stylus" scoped>

  .page {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    background-color #f6f6f6;
  }

  .menu {
    height 1.17rem
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    border-bottom 1px solid #ededed;
    div:nth-of-type(2) {
      width 0.03rem;
      height 0.53rem;
      background-color #ededed;
    }
    div:nth-of-type(4) {
      width 0.03rem;
      height 0.53rem;
      background-color #ededed;
    }
    div {
      width 50%;
      height 100%;
      display flex;
      flex-direction: row;
      justify-content center;
      align-items center;
    }

  }

  .sum-line {
    height: 1.17rem;
    background: #f6f6f6;
    display flex;
    flex-direction: row;
    justify-content flex-start;
    align-items center;
    padding 0 .32rem;
    box-sizing border-box;
    > span {
      margin-right .43rem;
    }
  }

  .scroll-wrap {
    flex 1;
    overflow hidden;
  }

  .order-item {
    background-color #fff;
    padding .32rem;
    box-sizing border-box;
    margin-bottom .16rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    .left {
      display flex;
      flex-direction column;
      align-items flex-start;
      span:last-child {
        margin-bottom 0;
      }
      > span {
        margin-bottom .29rem;
      }
    }
  }

  .button {
    width 100%;
    height: 1.31rem;
    background: rgba(0, 150, 255, 1);
    line-height 1.31rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    position fixed;
    bottom 0;
  }

  .city-menu-wrap {
    background-color #fff;
    max-height 60%;
    overflow-y scroll;
    padding 0 0.32rem;
    box-sizing border-box;
  }

  .city-item-wrap {
    height 1.17rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

</style>
