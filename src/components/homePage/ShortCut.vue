<template>
  <div class="short-cut-item-wrap" @click="isEntry?jumpLink(item.id):toggleSingleShortCut(item.id)"
       v-if="!(!isDirectMatch&&(item.id===`18`||item.id===`19`||item.id===`20`))">
    <i :class="[`icon`,`${item.imgUrl}`]" v-if="item.isSprites"></i>
    <img class="img" :src="item.imgUrl" v-else/>
    <div class="short-cut-content-wrap">
      <span class="ft-30 color-333">{{item.name}}</span>
      <i class="icon icon-ic_jt_hui_36" v-if="isEntry"></i>
      <img class="switcher" :src="item.added?'/static/icons/switcher_open.png' :'/static/icons/switcher_close.png'"
           v-else/>
    </div>
    <div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="80%"
        top="30vh"
      >
        <span>需完善信息才能使用该功能。</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="ensureDialog">去完善</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
  import jumpLink from './homePageJumpLink.js'
  import {mapMutations, mapState} from 'vuex'
  import store from '@/assets/data/index'

  export default {
    data() {
      return {
        dialogVisible: false
      }
    },
    props: ['item', 'isEntry'],
    methods: {
      jumpLink,/*(id) {
        let isOpenShop = store.state.user.userInfo.auditState === 1
        let isDirectMatch = store.state.user.userInfo.dealerType === 1
        let isAuditState = store.state.user.userInfo.auditState === -1
        let isDealerState = store.state.user.userInfo.dealerState === -1
        let isDealerState_1 = store.state.user.userInfo.dealerState === 0

        //在这里判断，先取dealerState和auditState。如果取不到就把跳转的逻辑阻断
        if (!isAuditState || !isDealerState) {
         return  this.dialogVisible = true
        } else if (isDealerState_1) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        }
        if (!isOpenShop && (id === `13` || id === `14` || id === `15` || id === `16` || id === `17`)) {
          return Vue.$toast({message: `该功能需要开启店铺才能使用`})
        }
        if (id === `1`) {//新增商品
          this.$router.push({name: `addCommodity`, query: {comeInType: 'addProduct'}})
        } else if (id === `2`) {//商品列表
          this.$router.push({name: `commodityList`})
        } else if (id === `3`) {//仓库管理
          this.$router.push({name: `warehouse`})
        } else if (id === `4`) {//库存查询
          this.$router.push({name: `stockQuery`})
        } else if (id === `5`) {//入库
          this.$router.push({path: `/inOutBound/1`})
        } else if (id === `6`) {//出库
          this.$router.push({path: `/inOutBound/0`})
        } else if (id === `7`) {//库存流水
          this.$router.push({name: `stockFlow`})
        } else if (id === `8`) {//库存盘点
         this.$router.push({name: `stockCheck`})
        } else if (id === `9`) {//供应商
          this.$router.push({name: `addProvider`})
        } else if (id === `10`) {//申请入库
          this.$router.push({path: `/WATchooseWarehouse/inBound`})
        } else if (id === `11`) {//申请出库
          this.$router.push({path: `/WATchooseWarehouse/outBound`})
        } else if (id === `12`) {//委托配送
          this.$router.push({path: `/WATchooseWarehouse/applyDelivery`})
        } else if (id === `13`) {//会员订单
          this.$router.push({name: `orders`})
        } else if (id === `14`) {//商品上下架
          this.$router.push({name: `productUpAndDown`})
        } else if (id === `15`) {//优惠券
          this.$router.push({name: `coupon`})
        } else if (id === `16`) {//组合活动
          this.$router.push({name: `groupActivity`})
        } else if (id === `17`) {//会员
          this.$router.push({name: `memberList`})
        } else if (id === `18`) {//易久批备货商品
          this.$router.push({name: `commodityList`, query: {pageType: 'directMatch'}})
        } else if (id === `19`) {//易久批备货单
          this.$router.push({name: `pickingList`})
        } else if (id === `20`) {//易久批对账单
          this.$router.push({name: `accountOrder`})
        }
      },*/
      closeDialog() {
        /*console.log(this)
        this.$parent.dialogVisible = false*/
          this.$emit(`closeDialog_2`, false)
      },
      ensureDialog() {
        this.dialogVisible = false
        if (this.userInfo.dealerState == -1) {
          this.$router.push({name: `myInformation`, params: {type}})
        } else {
          this.$router.push({name: `applyShopEntryStepTwo`})
        }

      },
      ...mapMutations(`homePageShortCuts`, [`toggleSingleShortCut`])
    },
    computed: {
      //直配经销商
      isDirectMatch() {
        return this.userInfo.dealerType === 1
      },
      isOpenShop() {
        return this.userInfo.auditState === 1
      },
      ...mapState(`user`, [`userInfo`])
    }
  }
</script>
<style lang="stylus" scoped>
  .img {
    width .75rem;
    height .75rem;
  }

  .switcher {
    width 1.12rem;
    height .72rem;
  }

  .short-cut-item-wrap {
    background-color #fff;
    display: flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    height 1.25rem;
    margin 0 0.32rem;
  }

  .short-cut-item-img {
    height 0.747rem;
    width 0.747rem;
  }

  .short-cut-content-wrap {
    display: flex;
    flex 1;
    margin-left 0.32rem;
    flex-direction: row;
    justify-content space-between;
    align-items center;
    height 100%;
    border-bottom 1px solid rgba(0, 0, 0, 0.1)
  }
</style>
