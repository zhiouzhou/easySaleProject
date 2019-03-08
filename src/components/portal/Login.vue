<template>
  <div id="loginArea" v-if="hasRefresh">
    <title-nav v-bind:title="title"></title-nav>
    <div class="cell">
      <div class="weui-cell__bd input-round ft-30">
        <i class="icon icon-ic-shoujihao_copy"></i>
        <input type="text"
               id="username"
               name="username"
               class="weui-input login-input"
               style="width: 82%"
               v-model.trim="account" v-validate="'required|alpha_num'"
               placeholder="请输入用户名/手机号" ref="username"/>
        <img v-if="account.trim()" @click="handleDelete" style="width: 0.48rem;height: 0.48rem;"
             src="/static/icons/ic_quxiao.png"/>
      </div>
    </div>
    <div class="cell ft-30" style="margin-top: 0.5rem">
      <div class="weui-cell__bd input-round">
        <i class="icon icon-ic-mima_copy"></i>
        <input type="password" id="passwordLogin" name="passwordLogin" class="weui-input login-input"
               v-model.lazy="password"
               v-validate="'required|alpha_dash'"
               placeholder="请输入密码" ref="passwordLogin"/>
      </div>
    </div>
    <div class="cell" style="margin-top: 0.8rem;margin-left: 0.15rem">
      <button class="weui-btn weui-btn_primary" @click="login" style="width:90%">登录</button>
    </div>
    <div class="cell-box">
      <div>
        <router-link to="/resetPassword">忘记密码？</router-link>
      </div>
      <div>
        <router-link to="/registerOne">快速注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import http from '@/assets/models/userAPIs';
  import https from "@/assets/models/shopAPIs";
  import {mapActions, mapMutations} from 'vuex'
  import Vue from 'vue'

  export default {
    name: "login",
    data() {
      return {
        hasRefresh: false,//是否已刷新页面
        title: "登录",
        account: ``, //用户名/手机号
        password: ``,
        //设备信息
        appCode: ``,
        appVersion: ``,
        deviceId: ``,
        deviceOS: ``,
        deviceType: ``,
      }
    },
    components: {
      'title-nav': Navigator
    },
    computed: {},
    watch: {},
    created() {

      if (this.$route.params.logOut) {
        //通过reload方法去清除vuex文件缓存
        window.localStorage.clear()
        window.location.reload()
        return null
      } else {
        this.hasRefresh = true

        this.getVersionInfo().then(data => {
          this.appCode = data.appCode;
          this.appVersion = data.appVersion;
          this.deviceId = data.deviceId;
          this.deviceOS = data.deviceOS;
          this.deviceType = data.deviceType;
        })
      }
      //页面在加载的时候，从localStorage中读取出用户名和密码
      for (let i = localStorage.length - 1; i >= 0; i--) {
        if (localStorage.key(i) == 'account') {
          this.account = localStorage.getItem(localStorage.key(i))
        } else if (localStorage.key(i) == 'password') {
          this.password = localStorage.getItem(localStorage.key(i))
        }
      }
    },
    methods: {
      //登录接口
      dealerLogin() {
        let {account, password, appCode, appVersion, deviceId, deviceOS, deviceType} = this;
        http.dealerLogin({
          account: account,
          password: password,
          appCode: appCode,
          appVersion: appVersion,
          deviceId: deviceId,
          deviceOS: deviceOS,
          deviceType: deviceType
        }).then(data => {
          console.log(data.data)
          this.$toast({message: '登录成功', duration: 1500})
          this.setAccountInfo({username: account, password: password})
          this.afterLoginSuccess(data.data)
          this.$router.replace({path: `/homepage`})

          localStorage.setItem("account", this.account);
          localStorage.setItem("password", this.password);
        }).catch(e => {
          this.$toast({message: e, position: 'bottom',})
        })

      },
      login() {
        let _this = this;
        this.$validator.validate().then((rs) => {
          if (!rs) {
            let err = _this.$validator.errors;
            let field = err.items[0].field;
            let el = _this.$refs[field];
            let clsname = 'warn-highlight';
            if (el.classList.contains(clsname)) {
              el.classList.remove(clsname);
            }
            setTimeout(() => el.classList.add(clsname), 0);
            this.$toast({
              message: err.first(field),
              iconClass: 'weui-icon-info', duration: 2000
            });
          } else {
            this.dealerLogin();
          }
        })

      },
      //登陆成功后的一些处理，比如修改user文件里的认证状态，存储登陆的token信息
      afterLoginSuccess(loginInfo) {
        this.setLoginInfo(loginInfo)
        this.setShopId(loginInfo.shopIdStr)
        this.setUserId(loginInfo.userId)
        this.setShopName(loginInfo.shopName)
        this.setUserName(loginInfo.shopName)
        this.changeApplyState(loginInfo.auditState)
        this.changeDealerState(loginInfo.dealerState)

      },
      /*getUserState() {
        return https.getShopState({})
          .then(data => {

          })
      },*/
      //清空用户名
      handleDelete() {
        this.account = '';
      },
      ...mapMutations(`user`, [`setLoginInfo`, `setAccountInfo`, `changeApplyState`,`changeDealerState`]),
      ...mapMutations(`dealerInfo`, [`setShopId`, `setShopName`, `setUserId`, `setUserName`]),
      ...mapActions(`appConfig`, [`getVersionInfo`]),
    },

  }

</script>

<style scoped>

  .weui-btn_primary {
    background-color: #0096ff;
    border-radius: 0.75rem;
  }

  .weui-btn_primary:active {
    background-color: #008EF2;
  }

  .input-round {
    padding-left: 0.3rem;
    border: 1px solid #ebebeb;
    width: 93%;
    height: 1.17rem;
    align-items: center;
    display: flex;
    flex-direction: row;
    line-height: 1.17rem;
    vertical-align: middle;
    border-radius: 0.586667rem;
  }

  .input-round input {
    padding-left: 0.2rem;
  }

  .input-round i, .input-round input {
    vertical-align: middle;
  }

  .weui-btn_primary {
    height: 1.17rem;
    line-height: 1.17rem;
    font-size: 0.45rem;
  }

  a, a:link, a:visited {
    color: #333333;
    font-size: 0.4rem;
  }

  .cell-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem 0.7rem;
  }

  .cell {
    margin-top: 1rem;
    margin-left: 0.65rem;
  }

  /*去除谷歌浏览器打开时input框的黄色*/
  .login-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset;
  }
</style>
