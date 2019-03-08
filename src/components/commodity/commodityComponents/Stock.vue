<template>
  <div class="stock">
    <ul class="stock-list">
      <li @click="navigateFun(`/WareHouse`)">
        <i class="icon icon-kc_ic_ckgl"></i>
        <span>仓库管理</span>
      </li>
      <li @click="navigateFun(`/stockQuery`)">
        <i class="icon icon-kc_ic_kccx"></i>
        <span>库存查询</span>
      </li>
      <li @click="navigateFun(`/inOutBound/1`)">
        <i class="icon icon-kc_ic_rk"></i>
        <span>入库</span>
      </li>
      <li @click="navigateFun(`/inOutBound/0`)">
        <i class="icon icon-kc_ic_ck"></i>
        <span>出库</span>
      </li>
      <li @click="navigateFun(`/stockFlow`)">
        <i class="icon icon-kc_ic_kcls"></i>
        <span>库存流水</span>
      </li>
      <li @click="navigateFun(`/stockCheck`)">
        <i class="icon icon-kc_ic_kcpd"></i>
        <span>库存盘点</span>
      </li>
    </ul>
    <!--拿不到经销商信息时弹框-->
    <message-dialog :messageDialogVisible="messageDialogVisible" @closeDialog="closeDialog"
                    @ensureDialog="ensureDialog" ref="dialog"></message-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import MessageDialog from "@/components/common/MessageDialog"

  export default {

    name: "stock",
    data() {
      return {
        messageDialogVisible: false
      }
    },
    methods: {
      navigateFun(keyWord) {
        if (this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({path: keyWord})
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
    components: {
      MessageDialog
    },
    computed: {
      ...mapState(`user`, [`userInfo`]),
      ...mapState(`dealerInfo`, [`shopId`]),
    }
  }
</script>

<style scoped>
  .stock {
    height: 100%;
    /*background: #fff;*/
    margin-left: 2.67rem;
  }

  .stock-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #fff;
    padding-bottom: 0.427rem;
  }

  .stock-list li {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #333;
    font-size: 0.347rem;
    width: 33%;
    padding-top: 0.427rem;
  }

  .stock-list li span {
    font-size: 0.35rem;
    color: #333;
    padding-top: 0.32rem;
  }
</style>
