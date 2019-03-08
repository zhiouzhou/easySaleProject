<template>
  <div class="page">
    <title-nav :title="title"></title-nav>


    <div class="item">
      <span class="color-E53935">*</span>
      <span class="color-333" style="min-width: 2rem;">员工姓名</span>
      <input class="input-class" placeholder="请输入" v-model.trim="deliveryUser.employeeName"/>
    </div>
    <div class="item">
      <span class="color-E53935">*</span>
      <span class="color-333" style="min-width: 2rem;">联系方式</span>
      <input class="input-class" placeholder="请输入" v-model.trim="deliveryUser.mobileNo"/>
    </div>
    <div class="item">
      <span class="color-E53935">*</span>
      <span class="color-333" style="min-width: 2rem;">角色</span>
      <span class="color-333" style="flex: 1;text-align: right;">配送员</span>
    </div>
    <div class="item">
      <span class="color-E53935">*</span>
      <span class="color-333" style="min-width: 2rem;">状态</span>
      <div class="state-wrap">
        <div :class="[`state-item`,deliveryUser.state===1?`actived`:``]" @click="deliveryUser.state=1">
          <i class="icon icon-pop_ic_xz" v-show="deliveryUser.state===1" style="margin-right: .16rem;"></i>
          启用
        </div>
        <div :class="[`state-item`,deliveryUser.state===0?`actived`:``]" @click="deliveryUser.state=0">
          <i class="icon icon-pop_ic_xz" v-show="deliveryUser.state===0" style="margin-right: .16rem;"></i>
          禁用
        </div>
      </div>
    </div>
    <div class="item">
      <span class="color-E53935">*</span>
      <span class="color-333" style="min-width: 2rem;">账户密码</span>
      <input class="input-class" placeholder="请输入" v-model.trim="deliveryUser.password"/>
    </div>
    <div style="height:1.31rem"></div>
    <div class="button ft-45r color-fff" @click="addDeliveryUser">
      新增
    </div>

  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import http from '@/assets/models/shopAPIs'

  export default {
    name: 'AddDeliveryUser',
    props: [],
    data() {
      return {
        title: '新增配送员',
        deliveryUser: {
          state: 1,
          employeeRoleSet: [2]
        }
      }
    },
    components: {
      'title-nav': Navigator
    },
    methods: {
      addDeliveryUser() {
        if (!this.isFormValid()) return null
        else {
          return http.addDeliveryUser({param: this.deliveryUser})
            .then(() => {
              this.$toast({message: `新增成功`, duration: 1500})
              setTimeout(() => {
                this.$router.go(-1)
              }, 1500)
            })
            .catch(e => {
              this.$toast({message: e})
            })
        }
      },
      isFormValid() {
        let errList = []
        if (!this.deliveryUser.employeeName) {
          errList.push({errMsg: `请输入正确的员工姓名`})
        }
        if (!this.deliveryUser.mobileNo) {
          errList.push({errMsg: `请输入正确的联系方式`})
        }
        if (!this.deliveryUser.password) {
          errList.push({errMsg: `请输入正确的账号密码`})
        }
        if (errList.length) {
          this.$toast({message: errList[0].errMsg})
        }
        return errList.length === 0
      }
    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .page {
    background-color #f6f6f6;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
  }

  .item {
    height 1.28rem;
    display flex;
    flex-direction row;
    justify-content flex-start;
    align-items center;
    padding 0 .32rem;
    box-sizing border-box;
    border-bottom .02rem solid #ededed;
    background-color #fff;
    text-align left;
    font-size .40rem;
  }

  .input-class {
    outline none;
    text-align right;
    flex 1;
    margin-left .32rem;
    color #333;
  }

  .state-wrap {
    flex 1;
    display flex;
    flex-direction row;
    justify-content flex-end;
    align-items center;
  }

  .state-item {
    width: 2.08rem;
    height: 0.75rem;
    background: rgba(242, 242, 242, 1);
    border-radius: 0.05rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    color #666;
    margin-left .32rem;
  }

  .actived {
    color #099aff;
    border .01rem solid #099aff;
    background-color #fff;
  }

  .button {
    width: 100%;
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
</style>
