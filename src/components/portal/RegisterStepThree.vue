<template>
  <div style="background-color: #F6F6F6">
    <title-nav v-bind:title="title"></title-nav>
    <div class="logo">
      <div class="logo-picture">
        <img src="../../../static/icons/ic-shangmao@2x.png">
      </div>
      <div class="ft-40r color-333333">经销商信息</div>
      <div class="logo-line">
        <i class="line"></i>
        <i class="line"></i>
        <i class="line-blue"></i>
      </div>
    </div>
    <div class="message">
      <div class="info-verification">
        <p style="width:26%;text-align: left"><i>*</i><span>商贸名称</span></p>
        <input type="text" name="tradeName" style="width: 74%" id="tradeName" v-model="shopName" v-validate="'required'"
               ref="tradeName"/>
      </div>
      <div class="businessLogo">
        <p><i>*</i><span>商贸logo</span></p>
        <div class="add-img">
          <!--<cube-upload
            :action="`${baseUrl}/file/uploadImg`"
            :simultaneous-uploads="1"
            :max="1"
            @file-success="fileSuccess"
            @file-error="fileError"/>-->
          <div>
            <el-upload
              class="avatar-uploader"
              v-loading="loadingEdit"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :action="`${baseUrl}/file/uploadImg`"
              :show-file-list="false"
              :on-success="fileSuccess"
              :on-error="fileError"
              :on-progress="progressEdit"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="icon icon-ic_tjtp_copy"></i>
            </el-upload>
          </div>
          <p style="padding-bottom: 0;">图片大小不能超过1M</p>
        </div>
        <!--<i class="icon icon-ic_tjtp_copy"></i>-->
      </div>
      <div class="introduce">
        <p><i>*</i><span>商贸介绍</span></p>
        <textarea placeholder="请填写，500字以内" maxlength="500" name="introduce" v-model="shopIntroduce"
                  v-validate="'required'" ref="introduce"></textarea>
      </div>
    </div>
    <span :class="['button-save',btnColorChange==true?'button-color-blue':'button-color']" @click="handleSave">完成</span>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import {Upload} from 'cube-ui';
  import Urls from '@/assets/models/baseUrl';
  import {mapActions, mapMutations} from 'vuex'

  export default {
    name: "RegisterStepThree",
    data() {
      return {
        title: '注册',
        shopName: '',
        shopIntroduce: '',
        baseUrl: ``,
        shopLogo: ``,
        loadingEdit: false,    //上传图片时的loading
        imageUrl: ``,    //上传的图片URl
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-upload': Upload,
    },
    methods: {
      handleSave() {

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
          } else {
            this.setShopLogo({logo: this.shopLogo});
            this.setShopName({name: this.shopName});
            this.setShopIntroduce({introduce: this.shopIntroduce});
            this.setUserInfo()
              .then(data => {
                this.$toast({message: '注册成功', duration: 1500});
                setTimeout(() => {
                  this.$router.replace('/login');
                }, 1500)
              })
              .catch(e => {
                this.$toast({message: e});
              })
          }
        })

      },
      //图片上传成功时
      fileSuccess(res, file) {
        //data指文件对象
        //data.response.data  指上传图片Id
        this.loadingEdit = false;
        this.imageUrl = URL.createObjectURL(file.raw);
        this.shopLogo = res.data
        /*this.shopLogo = data.response.data*/
        console.log(this.shopLogo)
      },
      //图片上传失败时
      fileError(err) {
        this.$toast({message: `上传失败`})
      },
      progressEdit() {
        this.loadingEdit = true
      },
      //图片上传之前判断图片的大小不能超过1MB
      beforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$toast({message: `上传的图片大小不能超过1MB`})
        }
        return isLt1M
      },
      ...mapMutations(`userRegister`, [`setShopLogo`, `setShopName`, `setShopIntroduce`]),
      ...mapActions(`userRegister`, [`setUserInfo`]),
    },
    created() {
      this.baseUrl = Urls.easySaleUrl
    },
    computed: {
      btnColorChange() {
        if (this.shopName != '' && this.shopLogo != '' && this.shopIntroduce != '') {
          return true
        } else {
          return false
        }
      },
      /*headers() {
        return {
          'token': this.$store.state.user.userInfo.token
        }
      }*/
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
    margin-top 0.27rem;
    padding 0.32rem 0.32rem;
  }

  .info-verification {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.44rem 0;
    border-bottom: 1px solid #ededed;
    font-size: 0.4rem;
    color: #333;
    p {
      i {
        color: #E53935;
      }
    }
    input {
      text-align: right;
      outline 0;
    }
    .selectCountry {
      display: flex;
      flex-direction: row;
      align-items center;
    }
  }

  .businessLogo {
    display: flex;
    flex-direction: column;
    font-size: 0.4rem;
    color: #333;
    padding: 0.44rem 0;
    p {
      text-align: left;
      padding-bottom: 0.32rem;
      i {
        color: #E53935;
      }
    }
  }

  .add-img {
    color: #999;
    font-size: 0.32rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    div {
      padding-bottom: 0.1rem;
    }
    p {
      padding-bottom: 0.32rem
    }
  }

  .avatar-uploader .el-upload {

    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .introduce {
    font-size: 0.4rem;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items start;
    p {
      text-align: left;
      padding-bottom: 0.32rem;
      i {
        color: #E53935;
      }
    }
    textarea {
      width: 9.36rem;
      height: 2.85rem;
      font-size: 0.4rem;
      padding: 12px;
      outline: 0;
    }
  }

  .button-save {
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
</style>
