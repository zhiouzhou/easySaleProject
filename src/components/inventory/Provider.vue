<template>
  <div class="provider_show">
    <div class="header">
      <span class="ft-37r color-666">{{title}}</span>
      <span @click="toAddPage" class="icon-add"><i class="icon icon-ic_tianjia_lan"></i>&nbsp;新增</span>
    </div>
    <div v-for="(provider, id) in providerList" class="card_container" @click="toDetail(provider)">
      <div class="content_left">
        <div class="card_header">
          <span>{{provider.suppilerName}}</span>
        </div>
        <div class="card_detail">
          <span v-show="provider.contactor">联系人：{{provider.contactor}}</span>
          <span v-show="provider.contactNumber">{{provider.contactNumber}}</span>
        </div>
      </div>
      <div class="right_arrow">
        <i class="icon icon-xk_youjiantou_copy"/>
      </div>
    </div>
    <!--拿不到经销商信息时弹框-->
    <message-dialog :messageDialogVisible="messageDialogVisible" @closeDialog="closeDialog"
                    @ensureDialog="ensureDialog" ref="dialog"></message-dialog>
  </div>
</template>

<script>
  import http from '@/assets/models/providerAPIs'
  import {mapState} from 'vuex'
  import MessageDialog from "@/components/common/MessageDialog"

  export default {
    name: "provider",
    data() {
      return {
        id: "",
        providerName: "",
        concatName: "",
        concatPhone: "",
        addr: "",
        providerList: [],
        count: 0,
        messageDialogVisible: false
      }
    },

    computed: {
      ...mapState(`dealerInfo`, [`shopId`]),
      ...mapState(`user`, [`userInfo`]),

      title() {
        return "共有供应商：" + this.count + "个"
      }
    },
    activated() {
      http.getProviderList({currentPage: 1, pageSize: 20, param: this.shopId})
        .then(data => {
          this.providerList = data.data || []
          this.count = this.providerList.length
        })
    },
    components: {
      MessageDialog
    },
    methods: {
      toDetail(provider) {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({path: `/editProvider`, query: {provider}})
        }
      },
      toAddPage() {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({path: "/addProvider"})
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
  }
</script>

<style scoped>
  .icon-add {
    height: 0.4rem;
    font-size: 0.4rem;
    line-height: 0.4rem;
    vertical-align: middle;
    color: rgba(0, 150, 255, 1);
  }

  .provider_show {
    text-align: left;
    flex: 1;
    margin-left: 2.56rem;
  }

  .header {
    height: 1rem;
    padding: 0 .32rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .card_container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.32rem;
    background: #fff;
    align-items: center;
    margin: 0 0.16rem;
    border-bottom: 1px solid #ccc;
  }

  .card_header {
    padding-bottom: 0.21rem;
    font-size: 0.4rem;
    color: #333;
  }

  .card_detail {
    font-size: 0.35rem;
    color: #666666;
  }

  .card_detail span {
    padding-right: 0.43rem;
  }

  .content_left {

  }

  .right_arrow {

  }
</style>
