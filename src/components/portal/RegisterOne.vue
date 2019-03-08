<template>
  <div style="background-color: #F6F6F6">
    <title-nav v-bind:title="title"></title-nav>
    <!--<div class="logo">-->
    <!--<div class="logo-picture">-->
    <!--<img src="../../../static/icons/ic-shoujihao@2x.png">-->
    <!--</div>-->
    <!--<div class="ft-40r color-333333">账号信息</div>-->
    <!--<div class="logo-line">-->
    <!--<i class="line-blue"></i>-->
    <!--<i class="line"></i>-->
    <!--<i class="line"></i>-->
    <!--</div>-->
    <!--</div>-->
    <div class="message">
      <div class="message-psd">
        <span class="ft-40r color-333333 psd-span">用户名</span>
        <span>
        <input type="text" class="color-333333 ft-40r box-input" id="name" name="name" v-model="dealerName"
               v-validate="'required'" placeholder="请输入"
               ref="name"/>
          </span>
      </div>
      <div class="message-phone">
        <span class="ft-40r color-333333 psd-span">手机号</span>
        <span style="display: flex;justify-content: space-between;flex: 1">
          <span style="width: 2.5rem">
                <input type="text" class="color-333333 ft-40r box-input" maxlength="11" v-model="mobileNo" id="mobileNo"
                       name="mobileNo"
                       placeholder="请输入手机号"
                       v-validate="'required|mobile'"
                       ref="mobileNo"/>
          </span>
          <span v-if="sendAuthCode" class="color-333333 ft-40r" @click="clickGetCode">获取验证码</span>
          <span v-else class="color-999999 ft-40r">获取验证码({{auth_time}}s)</span>
      </span>
      </div>
      <div class="message-num">
        <!--验证码-->
        <label for="confirmCode">
          <ul class="message-ul color-333333 ft-36">
            <li v-for="(item,index) in number" :key="index" :class="{'input-active': validateCode.length === index+1}">
              {{validateCode[index]}}
            </li>
          </ul>
        </label>
        <input ref="confirmCode" class="input-code" style="font-size: 1rem" v-model="validateCode" :maxlength="number"
               id="confirmCode" name="confirmCode" type="number" v-validate="'required|digits:6'">
        <div class="ft-32r color-333333" style="float: right;margin-top: 0.43rem">收不到验证码，使用<span class="color-099AFF"
                                                                                                 @click="toggleType">语音验证码</span>
        </div>
      </div>
      <div class="message-psd">
        <span class="ft-40r color-333333 psd-span">密码</span>
        <span>
              <input type="password" class="color-333333 ft-40r box-input" id="password" name="password"
                     v-model="password"
                     placeholder="限6-18位" v-validate="'required|alpha_dash|min:6|max:18'"
                     ref="password"/>
            </span>
      </div>
      <div class="message-psd">
        <span class="ft-40r color-333333 psd-span">确认密码</span>
        <span>
              <input type="password" class="color-333333 ft-40r box-input" id="confirmPassword" name="confirmPassword"
                     v-model="confirmPassword" placeholder="请再次输入密码" v-validate="{required:true,confirmed:password}"
                     ref="confirmPassword"/>
            </span>
      </div>
    </div>
    <span :class="['button-next',btnColorChange==true?'button-color-blue':'button-color']"
          @click="handleNext">完成</span>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import http from '@/assets/models/userAPIs';
  import {mapActions, mapMutations} from 'vuex'


  export default {
    name: "RegisterOne",
    data() {
      return {
        title: '注册',
        sendAuthCode: true, /*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */
        auth_time: 0, /*倒计时 计数器*/
        number: 6,//验证码个数
        mobileNo: ``,
        dealerName: '',//经销商名称
        validateCode: ``,//验证码
        password: ``,
        confirmPassword: ``,//密码确认
        identifyingCodeId: '',//验证码id
        //设备信息
        appCode: ``,
        appVersion: ``,
        deviceId: ``,
        deviceOS: ``,
        deviceType: ``,
      }
    },
    components: {
      'title-nav': Navigator,
    },
    methods: {

      //将文字验证改为语音验证
      toggleType() {
        //如果手机号不为空
        //发送验证码类型;1：发送文字验证码 2：发送语音验证码
        var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
        if (this.mobileNo == '') {
          this.$toast({
            message: '请输入手机号',
            iconClass: 'weui-icon-info', duration: 2000
          });
        } else if (!reg.test(this.mobileNo)) {
          this.$toast({
            message: '手机号错误',
            iconClass: 'weui-icon-info', duration: 2000
          });
        } else {
          this.getCode(2);
        }
      },
      //点击获取验证码
      clickGetCode() {
        //如果手机号不为空
        var reg = 11 && /^((13|14|15|17|18|19)[0-9]{1}\d{8})$/;
        if (this.mobileNo == '') {
          this.$toast({
            message: '请输入手机号',
            iconClass: 'weui-icon-info', duration: 2000
          });
        } else if (!reg.test(this.mobileNo)) {
          this.$toast({
            message: '手机号错误',
            iconClass: 'weui-icon-info', duration: 2000
          });
        } else {
          this.getCode(1);
        }

      },
      //注册成功接口
      setUserInfo() {
        let {dealerName, mobileNo, password, confirmPassword} = this;
        http.finishRegister({
          param: {
            dealerName,
            mobileNo,
            password,
            confirmPassword
          }
        }).then(data => {
          this.$toast({message: '注册成功', duration: 1500});
          setTimeout(() => {
            this.$router.replace('/login');
          }, 1500)
        }).catch(e => {
          console.log(e)
          this.$toast({message: e});
        })
      },
      //获取验证码接口
      getCode(type) {
        let {appCode, appVersion, deviceId, deviceOS, deviceType, mobileNo} = this;
        http.getIdentifyingCode({
          param: {
            appCode,
            appVersion,
            deviceId,
            deviceOS,
            deviceType,
            mobileNo,
            type
          }
        }).then(data => {
          this.identifyingCodeId = data.data.identifyingCodeId;
          this.$toast({message: '发送验证码成功'})
          //设置验证码60秒倒计时,只有短信验证才需要计时
          if (type === 1) {
            this.sendAuthCode = false;
            this.auth_time = 60;
            let auth_timetimer = setInterval(() => {
              this.auth_time--;
              if (this.auth_time <= 0) {
                this.sendAuthCode = true;
                clearInterval(auth_timetimer);
              }
            }, 1000);
          }
          console.log('Vcode', data.data)
        }).catch(e => {
          this.$toast(e)
        })
      },
      //验证验证码是否正确
      checkValidateCode() {
        let {mobileNo, validateCode, identifyingCodeId} = this;
        http.checkValidateCode({param: {mobileNo, validateCode, identifyingCodeId}}).then(data => {
          // //将页面上的参数值存放到vuex中，第三步时一起提交
          // this.setMobileNo({mobile: this.mobileNo});
          // this.setPassword({passwordInfo: this.password});
          // this.setConfirmPassword({confirm: this.confirmPassword});
          // this.$router.replace('/registerStepTwo')
          this.setUserInfo()
        }).catch(e => {
          this.$toast({message: e})
        })
      },
      handleNext() {
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
            _this.$toast({
              message: err.first(field),
              iconClass: 'weui-icon-info', duration: 2000
            });
          }
          else if (this.identifyingCodeId == "") {  //如果没有点击获取验证码按钮
            this.$toast({message: '请获取验证码'})
          } else {
            this.checkValidateCode();
          }
        })
      },
      ...mapActions(`appConfig`, [`getVersionInfo`]),
      // ...mapMutations(`userRegister`, [`setMobileNo`, `setPassword`, `setConfirmPassword`]),
    },
    created() {
      this.getVersionInfo().then(data => {
        this.appCode = data.appCode;
        this.appVersion = data.appVersion;
        this.deviceId = data.deviceId;
        this.deviceOS = data.deviceOS;
        this.deviceType = data.deviceType;
      })
    },
    computed: {
      btnColorChange() {
        if (this.validateCode.length === 6 && this.password != '' && this.confirmPassword != '' && this.phoneNum != '' && this.dealerName != '') {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .logo {
    height 3.35rem
    display flex
    flex-direction column
    justify-content space-around
    background-color white

    .logo-picture {
      padding-top 0.65rem
    }
    .logo-line {
      .line-blue {
        width: 0.53rem;
        height: 0.05rem;
        background: #0096FF;
        margin-left 0.2rem
        display inline-block
      }
      .line {
        width: 0.53rem;
        height: 0.05rem;
        background: #BDBDBD;
        display inline-block;
        margin-left 0.2rem
      }
    }
  }

  .message {
    background white;
    // margin-top 0.27rem;
    padding 0 0.32rem;
    .psd-span {
      width 2.4rem;
      text-align left;
    }
    .message-phone {
      display flex;
      justify-content flex-start;
      height 1.25rem;
      line-height 1.25rem
      text-align left;
      //  align-items: center;
      border-bottom 0.01rem solid #EDEDED

    }
    .message-psd {
      display flex;
      justify-content flex-start;
      height 1.25rem;
      line-height 1.25rem
      border-bottom 0.01rem solid #EDEDED
      //.psd-span {
      //width 2rem;
      //text-align left
      //}
    }
    .message-num {
      height 3rem
      border-bottom 0.01rem solid #EDEDED
      .message-ul {
        display flex;
        flex-direction row;
        justify-content space-between;
        padding-top 0.64rem
        li {
          width 1.29rem;
          height 1.29rem;
          border 0.01rem solid #E5E5E5
          line-height 1.29rem
        }
        .input-active {
          border 0.01rem solid #099AFF
        }
      }
      .input-code {
        position absolute;
        left -9999px;
        top -99999px;
       // width 0;
       // height 0;
        opacity 0;
        overflow: visible;
        z-index -1;
      }
    }
  }

  .button-next {
    width 9.36rem;
    height 1.17rem;
    line-height 1.17rem;

    border-radius 0.11rem;
    color #FFFFFF;
    font-size 0.45rem;
    margin-top 0.64rem;
    display inline-block
  }

  .button-color {
    background #BDBDBD;
  }

  .button-color-blue {
    background #0096FF;
  }

  .box-input {
    outline 0;
  }
</style>
