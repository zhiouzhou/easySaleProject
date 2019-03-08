<template>
  <div style="background-color: #f6f6f6;">
    <title-nav :title="title"></title-nav>


    <!--下拉菜单-->
    <drop-menu :menuData="dropMenuData" :edgeMargin="2.3033"
               @on-select-menu="onSelectMenuItem" @on-date-pick="onSelectDate"
               ref="dropMenu"
               v-if="dropMenuData&&dropMenuData.length&&warehouseList[0].name">
    </drop-menu>
    <div class="scroll-wrap" v-if="orderList.length">
      <cube-scroll
        ref="scroll" :data="orderList" :options="scrollOptions"
        @pulling-down="onPullingDown" @pulling-up="onPullingUp">
        <ul class="list-wrap">
          <li class="list-item ft-40r color-333" v-for="order in orderList" @click="goToDetail(order.takingNo)">
            <div>盘点时间：{{order.takingTime|timestamp}}</div>
            <div class="item-center">
              <span>盘点商品：{{order.takingCount}}种</span>
              <i class="icon icon-ic_jt_hui_36"></i>
            </div>
            <div>盘点单号：{{order.takingNo}}</div>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <empty-view v-else></empty-view>
    <div style="height:1.31rem"></div>
    <div class="button ft-45r color-fff" @click="onClickNewStockCheck()">
      <i class="icon icon-ic_tianjia_bai" style="margin-right: 0.21rem;"></i>
      新增盘点
    </div>

    <!--选择仓库-->
    <cube-pop maskClosable position="bottom" ref="chooseWarehouse">
      <div class="product-dialog">
        <div class="dialog-header ft-43r color-333">
          选择仓库
          <i class="icon icon-pop_ic_close" @click="hidePop('chooseWarehouse')"></i>
        </div>
        <ul style="overflow-y: scroll">
          <li class="product-item" v-for="warehouse in warehouseList"
              @click="onChooseWarehouse(warehouse)">
            <span class="ft-40r color-333">{{warehouse.name}}</span>
            <i class="icon icon-ic_jt_hui_36"></i>
          </li>
        </ul>
      </div>
    </cube-pop>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import DropMenu from "@/components/common/DropMenu"
  import EmptyView from "@/components/common/EmptyView"
  import {Popup} from 'cube-ui'
  import {mapState, mapMutations, mapActions} from 'vuex'
  import DateUtil from '@/scripts/DateUtils'
  import {Scroll} from "cube-ui"


  export default {
    data() {
      return {
        title: `库存盘点`,
      }
    },
    props: [],
    components: {
      'cube-pop': Popup,
      'title-nav': Navigator,
      'cube-scroll': Scroll,
      DropMenu, EmptyView
    },
    mounted() {
      this.getWarehouseListByDealer({
        pageNum: 1, pageSize: 20, cityId: this.cityId, warehouseChooseType: 2,city:this.city
      })
        .then(() => this.updateOrderList())
        .catch(e => {
          this.$toast({message: e})
        })
    },
    methods: {
      showPop(refId) {
        this.$refs[refId].show()
      },
      hidePop(refId) {
        this.$refs[refId].hide()
      },
      onSelectMenuItem(keyWord, menuId) {
        console.log(`keyWord`, keyWord)
        console.log(`menuId`, menuId)
        if (keyWord == `warehouse`) {
          this.setCurrentWarehouseId({id: menuId})
        } else if (keyWord == `dateType`) {
          this.setCurrentDateTypeId({id: menuId})
        }
        this.updateOrderList()
      },
      onSelectDate(selectedDate) {
        this.setSelectDate({date: selectedDate})
      },
      goToDetail(orderNo) {
        this.$router.push({path: `/stockCheckDetail/${orderNo}`})
      },
      onPullingDown() {
        this.setPageNum({num: 1})
        this.updateOrderList()
      },
      onPullingUp() {
        let originalNum = this.pageNum
        this.setPageNum({num: ++originalNum})
      },
      //刷新数据列表
      updateOrderList() {
        if (!this.currentWarehouseId) return
        let thisMonthStrObj = this.getThisMonthStr()
        let data = {
          beginTime: this.currentDateTypeId === `0` ? thisMonthStrObj.firstDayStr : this.selectDate[0],
          endTime: this.currentDateTypeId === `0` ? thisMonthStrObj.lastDayStr : this.selectDate[1],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          warehouseId: this.currentWarehouseId,
        }
        this.getStockCheckList(data)
          .then(() => {
            if (this.orderList.length) this.$refs.scroll && this.$refs.scroll.forceUpdate()
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
      onChooseWarehouse(warehouse) {
        this.setWarehouse({warehouse})
        this.$router.push({name: `addStockCheck`})
      },
      onClickNewStockCheck() {
        if (!this.warehouseList || !this.warehouseList.length) {
          return this.$toast({message: `请先入库商品再进行盘点`})
        } else {
          return this.showPop(`chooseWarehouse`)
        }
      },
      ...mapActions(`cityAndWarehouse`, [`getWarehouseListByDealer`]),
      ...mapActions(`stockCheck`, [`getStockCheckList`]),
      ...mapMutations(`addStockCheck`, [`setWarehouse`]),
      ...mapMutations(`cityAndWarehouse`, [`setCurrentWarehouseId`]),
      ...mapMutations(`stockCheck`, [`setCurrentDateTypeId`, `setSelectDate`,
        `setOrderList`, `setPageNum`]),
    },
    computed: {
      cityId() {
        if (this.currentCity) {
          return this.currentCity.id
        }
      },
      city() {
        if (this.currentCity) {
          return this.currentCity.city
        }
      },
      dropMenuData() {
        if (!this.warehouseList || !this.warehouseList.length) return
        let warehouseList = this.warehouseList.map(item => {
          item.menuId = item.id
          item.menuName = item.name
          return item
        })
        let warehouseMenu = {keyWord: `warehouse`, warehouseList}
        let dateTypeList = this.dateTypeList.map(item => {
          item.menuId = item.dateTypeId
          item.menuName = item.dateTypeName
          return item
        })
        let dateTypeMenu = {keyWord: `dateType`, dateTypeList}
        return [warehouseMenu, dateTypeMenu]
      },
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
      ...mapState(`currentCity`, [`currentCity`]),
      ...mapState(`stockCheck`,
        [`orderList`, `dateTypeList`, `currentDateTypeId`, `selectDate`, `pageNum`, `pageSize`]),
      ...mapState(`cityAndWarehouse`, [`warehouseList`, `currentWarehouseId`]),
    },
    watch: {
      pageNum() {
        this.updateOrderList()
      },
      selectDate() {
        if (this.pageNum !== 1) {
          this.setPageNum({num: 1})
        } else {
          this.updateOrderList()
        }
      },
      dateTypeList() {
        this.updateOrderList()
      },
    }
  }
</script>


<style lang="stylus" scoped>

  .list-wrap {
    margin-top 0.16rem;
    text-align left;
  }

  .list-item {
    width 100%;
    padding 0.32rem;
    box-sizing border-box;
    background-color #fff;
    margin-bottom 0.16rem;
  }

  .item-center {
    margin 0.29rem 0;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

  .button {
    width: 10rem;
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

  .product-dialog {
    height: 10rem;
    width 100%;
    display flex;
    flex-direction column;
    align-items stretch;
    background-color #fff;
  }

  .dialog-header {
    position relative
    height 1.07rem;
    text-align center;
    line-height 1.07rem;
    border-bottom 1px solid #ededed;
    i {
      position absolute;
      right: 0.4rem;
      top: 50%;
      transform translateY(-50%);
    }
  }

  .product-item {
    width 100%;
    height 1.28rem;
    display flex;
    flex-direction: row;
    justify-content space-between;
    align-items center;
    padding 0 0.32rem;
    box-sizing border-box;
    border-bottom 1px solid #ededed;
  }

</style>
