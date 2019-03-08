<template>
  <div id="changePassword">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>修改密码</span>
    </div>
    <div class="blank"></div>
    <div class="password">
      <p>原密码</p>
      <input placeholder="请输入原登录密码" type="password" id="oldPwd" v-model="oldPwd" name="oldPwd" ref="oldPwd"
             v-validate="'required|alpha_num'"/>
    </div>
    <div class="password">
      <p>新密码</p>
      <input placeholder="限6-18位字母数字组合" type="password" id="newPwd" name="newPwd" ref="newPwd" v-model="newPwd"
             v-validate="'required|alpha_num'"/>
    </div>
    <div class="password">
      <p>确认密码</p>
      <input placeholder="请在此输入新密码" type="password" id="confirmPwd" name="confirmPwd"
             ref="confirmPwd" v-model="confirmPwd"/>
    </div>
    <div class="ensure" @click="ensurePwd">
      确定
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import http from '@/assets/models/userAPIs'
  import {mapState} from 'vuex';

  export default {
    name: '',
    props: [],
    data() {
      return {
        oldPwd: '',    //原密码
        newPwd: '',    //新密码
        confirmPwd: '',   //确认密码
      }
    },
    components: {},
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      ensurePwd() {
        let errList = []
        if (this.oldPwd !== this.password) {
          errList.push({errMsg: `请输入正确的原密码`})
        }
        if (this.newPwd !== this.confirmPwd) {
          errList.push({errMsg: `两次新密码不一致`})
        }
        if (errList.length) {
          this.$toast({message: errList[0].errMsg})
        } else {
          http.forgetPassword({param: {mobileNo: this.username, password: this.newPwd}})
            .then(() => {
              this.$toast({message: `修改成功`})
              setTimeout(() => {
                this.goBack()
              }, 1500)
            })
            .catch(e => {
              this.$toast({message: e})
            })
        }
      }
    },
    computed: {
      ...mapState(`user`, ['password', 'username'])
    },

  }
</script>


<style lang="stylus" scoped>
  #changePassword {
    background: #f6f6f6;
  }

  .header {
    height: 1.17rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    width: 100%;
    text-align: center;
    line-height: 1.17rem;
    position: fixed;
    top: 0;
    left: 0;
    color: #fff;
    font-size: 0.48rem;
    display: flex;
    flex-direction: row;
    align-items center;
    padding-left: 0.24rem;
    span {
      padding-left: 3rem;
      color: #fff;
      font-size: 0.48rem;
    }
  }

  .blank {
    height: 1.17rem;
  }

  .password {
    padding: 0.43rem 0.32rem;
    height 1.25rem;

    display: flex;
    align-items center;
    border-bottom: 1px solid #ededed;
    color: #333;
    font-size: 0.4rem;
    background: #fff;
    p {
      width: 2.24rem;
      text-align left;
    }
    input {
      outline 0;
      width 80%;
    }
  }

  .ensure {
    background: #0096FF;
    width: 9.36rem;
    height: 1.31rem;
    text-align center;
    line-height 1.31rem;
    color: #fff;
    font-size: 0.45rem;
    margin: 0.96rem 0.32rem;
    -webkit-border-radius: 0.08rem;
    -moz-border-radius: 0.08rem;
    border-radius: 0.08rem;
  }

</style>
