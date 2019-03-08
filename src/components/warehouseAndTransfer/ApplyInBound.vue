<template>
  <div class="content-wrap">
    <div class="item" @click="gotoWATchooseWarehouse(`inBound`)">
      <div class="content">
        <i class="icon icon-cpfw_ic_sqrk"></i>
        <span>申请入库</span>
      </div>
    </div>
    <div class="item" @click="navigateFun(`6`)">
      <div class="content">
        <i class="icon icon-cpfw_ic_dzf"></i>
        <span>待支付</span>
      </div>
      <span class="number" v-if="state6Num">{{state6Num|over99Num}}</span>
    </div>
    <div class="item" @click="navigateFun(`1`)">
      <div class="content">
        <i class="icon icon-cpfw_ic_drk"></i>
        <span>待入库</span>
      </div>
      <span class="number" v-if="state1Num || state0Num ">{{(state0Num+state1Num)|over99Num}}</span>
    </div>

    <div class="item" @click="navigateFun(`4`)">
      <div class="content">
        <i class="icon icon-cpfw_ic_ywc"></i>
        <span>已完成</span>
      </div>
      <span class="number" v-if="state4Num">{{state4Num|over99Num}}</span>
    </div>
    <div class="item" @click="navigateFun(`-1`)">
      <div class="content">
        <i class="icon icon-cpfw_ic_qb"></i>
        <span>全部</span>
      </div>
      <span class="number" v-if="stateAllNum">{{stateAllNum|over99Num}}</span>
    </div>
    <!--拿不到经销商信息时弹框-->
    <message-dialog :messageDialogVisible="messageDialogVisible" @closeDialog="closeDialog"
                    @ensureDialog="ensureDialog" ref="dialog"></message-dialog>
  </div>
</template>


<script>
  import http from '@/assets/models/warehouseAndTransferAPIs'
  import {mapState} from 'vuex'
  import MessageDialog from "@/components/common/MessageDialog"

  export default {
    name: '',
    props: [],
    data() {
      return {
        numbersList: [],
        messageDialogVisible: false
      }
    },
    activated() {
      if (this.userInfo.shopId) {
        http.getOrdersNum({billType: 0})
          .then(data => {
            this.numbersList = data.data.dataList || []
          })
          .catch(e => {
            this.$toast({message: e})
          })
      } else {
        this.numbersList = []
      }

    },
    components: {
      MessageDialog
    },
    methods: {
      gotoWATchooseWarehouse(type) {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: `WATchooseWarehouse`, params: {type}})
        }
      },
      navigateFun(auditState) {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: `InBoundOrder`, params: {auditState}})
        }
      },
      closeDialog(dialogState) {
        this.$refs[`dialog`].hide()
      },
      ensureDialog(dialogState, type) {
        if (this.userInfo.dealerState == -1) {
          this.$router.push({name: `myInformation`, params: {type}})
        } else {
          this.$router.push({name: `applyShopEntryStepTwo`})
        }
        this.$refs[`dialog`].hide()
      },
    },
    computed: {
      // 入库单据状态 (申请入库 = 0,待入库 = 1,部分入库 = 2,拒绝入库 = 3,已入库 = 4,已过期 = 5,待支付=6，已取消=7)；
      state0Num() {
        let target = this.numbersList.find(item => item.state === 0)
        return target ? target.count : 0
      },
      state6Num() {
        let target = this.numbersList.find(item => item.state === 6)
        return target ? target.count : 0
      },
      state1Num() {
        let target = this.numbersList.find(item => item.state === 1)
        return target ? target.count : 0
      },
      state4Num() {
        let target = this.numbersList.find(item => item.state === 4)
        return target ? target.count : 0
      },
      stateAllNum() {
        let num = 0
        this.numbersList.forEach(item => num += item.count)
        return num
      },
      ...mapState(`dealerInfo`, [`userId`, `shopId`]),
      ...mapState(`user`, [`userInfo`])
    },
  }
</script>


<style lang="stylus" scoped>

  .content-wrap {
    display flex;
    flex-direction row;
    justify-content flex-start;
    align-items center;
    flex-wrap wrap;
  }

  .content {
    position absolute;
    width 100%;
    top 50%;
    left: 50%;
    transform translate(-50%, -50%);
    display flex;
    flex-direction column;
    justify-content center;
    align-items center;
    font-size .35rem;
    color: #333;
    > i {
      margin-bottom .32rem;
    }
    > span {
      width 100%;
    }
  }

  .item {
    height 2.48rem;
    width 33.3333%;
    position relative;
    .number {
      height: .43rem;
      position absolute;
      top .32rem;
      left: 50%;
      background: rgba(250, 111, 49, 1);
      border-radius: 1.33rem;
      text-align center;
      line-height .43rem;
      font-size .29rem;
      color: #fff;
      padding 0 .16rem;
    }

  }
</style>
