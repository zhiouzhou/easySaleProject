<template>
  <div id="user">
    <div class="header">
      <span>我的</span>
    </div>
    <div class="blank"></div>
    <div class="user-info">
      <div class="userName">
        <i class="icon icon-wd_ic_tx" @click="navigatorFun('myBusiness')"></i>
        <div>
          <p>{{shopDetail.name}}</p>
          <span>{{shopDetail.state===0?`未入驻`:shopDetail.state===1?`已入驻`:shopDetail.state===2?`已拒绝`:``}}</span>
        </div>
      </div>
    </div>
    <div class="myMessage">
      <div class="my-message" @click="navigatorFun('myMessage')">
        <i class="icon icon-wd_ic_xiaoxi" style="width: 0.53rem;height: 0.48rem"></i>
        <p><span>我的消息</span><i class="icon icon-xk_youjiantou_copy"></i></p>
      </div>
      <div class="my-staff" @click="navigatorFun('myStaff')">
        <i class="icon icon-wd_ic_wdyg" style="width: 0.53rem;height: 0.48rem"></i>
        <p><span>我的员工</span><i class="icon icon-xk_youjiantou_copy"></i></p>
      </div>
      <div class="my-staff" @click="navigatorFun('myInformation')">
        <i class="icon icon-wd_ic_wdyg" style="width: 0.53rem;height: 0.48rem"></i>
        <p><span>我的信息</span><i class="icon icon-xk_youjiantou_copy"></i></p>
      </div>
    </div>
    <router-link tag="div" class="setting" to="/setting">
      <i class="icon icon-wd_ic_sz" style="width: 0.53rem;height: 0.48rem"></i>
      <p><span>设置</span><i class="icon icon-xk_youjiantou_copy"></i></p>
    </router-link>
    <!--拿不到经销商信息时弹框-->
    <message-dialog :messageDialogVisible="messageDialogVisible" @closeDialog="closeDialog"
                    @ensureDialog="ensureDialog" ref="dialog"></message-dialog>
  </div>
</template>


<script>
  import http from "@/assets/models/shopAPIs"
  import {mapMutations, mapState} from 'vuex'
  import MessageDialog from "@/components/common/MessageDialog"

  export default {
    name: '',
    props: [],
    data() {
      return {
        title: '',
        messageDialogVisible: false
      }
    },
    activated() {
      http.getShopInfo()
        .then(data => {
          let detail = data.data || {}
          this.setShopDetail(detail)
        })
        .catch(e => {
          console.log(e)
        })
    },
    components: {
      MessageDialog
    },
    methods: {
      navigatorFun(url) {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (url === `myBusiness` && this.shopDetail.state === 0) {
          return this.$toast(`暂无店铺`)
        } else if (url === `myInformation`) {
          this.$router.push({name: url, params: {type: `hasDealer`}})
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: url})
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
      ...mapMutations(`dealerInfo`, [`setShopDetail`])
    },
    computed: {
      ...mapState(`dealerInfo`, [`shopDetail`, `shopId`]),
      ...mapState(`user`, [`userInfo`]),
    },
  }
</script>


<style lang="stylus" scoped>
  #user {
    background: #f6f6f6;
  }

  .header {
    height: 1.17rem;
    background: #0096FF;
    width: 100%;
    text-align: center;
    line-height: 1.17rem;
    position: fixed;
    top: 0;
    left: 0;
    color: #fff;
    font-size: 0.48rem;
    padding-left: 0.24rem;
  }

  .blank {
    height: 1.17rem;
  }

  .user-info {
    background: #0096FF;
    padding: 0.33rem 0.48rem 0.44rem 0.44rem;
    display: flex;
    flex-direction: row;
    justify-content space-between;
    align-items center;
    .userName {
      display: flex;
      flex-direction: row;
      align-items center;
      div {
        color: #fff;
        padding-left: 0.32rem;
        p {
          font-size: 0.43rem;
          padding-bottom: 0.21rem;
        }
        span {
          display: block;
          width: 1.07rem;
          height: 0.37rem;
          background: #ffcf51;
          font-size: 0.27rem;
          border-radius 0.21rem;
          text-align center;
          line-height 0.37rem;
        }
      }
    }
  }

  .myMessage {
    background: #fff;
    margin-top: 0.16rem;
    .my-message, .my-staff {
      display: flex;
      align-items center;
      height 1.25rem;
      padding-left: 0.32rem;
      p {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items center;
        justify-content: space-between;
        border-bottom: .02rem solid #ededed;
        padding: 0.48rem;
        padding-left: 0;
        margin-left: 0.21rem;
        font-size: 0.4rem;
        color: #333;
      }
      &:last-child {
        > p {
          border: 0
        }
      }
    }
  }

  .my-loan, .setting {
    display: flex;
    height 1.25rem;
    align-items center;
    padding-left: 0.32rem;
    background: #fff;
    margin-top: 0.27rem;
    p {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items center;
      justify-content: space-between;
      padding: 0.48rem;
      padding-left: 0;
      margin-left: 0.21rem;
      font-size: 0.4rem;
      color: #333;
    }
  }

</style>
