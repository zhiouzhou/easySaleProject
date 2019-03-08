<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <div class="blue-bg">
      <img class="img-progress" src="/static/icons/txrzxx_jdt_deb@2x.png"/>
    </div>
    <div class="content-wrap">
      <div class="content-title ft-43r color-099AFF">商贸信息</div>
      <div class="content">
        <!--经销商联系人-->
        <div class="form-item">
          <span class="ft-40r color-333"><span class="color-E53935">*</span>商贸名称</span>
          <input class="input-class ft-40r color-333" placeholder="请输入" v-model.trim="shopDetail.shopName"
                 :disabled="auditState==0"/>
        </div>
        <!--商贸Logo-->
        <div class="ft-40r color-333" style="margin: .32rem 0;"><span class="color-E53935">*</span>商贸logo</div>
        <!--图片控件-->
        <div class="add-img">
          <div>
            <el-upload
              v-if="auditState!=0"
              class="avatar-uploader"
              v-loading="loadingEdit"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :headers="headers"
              :action="`${baseUrl}/file/uploadImg`"
              :show-file-list="false"
              :on-success="fileSuccess"
              :on-error="fileError"
              :on-progress="onProgress"
              :before-upload="beforeAvatarUpload">
              <img v-if="showingImgUri" :src="showingImgUri" class="avatar">
              <i v-else class="icon icon-ic_tjtp"></i>
            </el-upload>
            <img :src="showingImgUri" v-else class="avatar">
          </div>
          <p v-show="!shopDetail.imageUrl">图片大小不能超过1MB</p>
        </div>
        <!--商贸介绍-->
        <div class="ft-40r color-333" style="margin: .32rem 0;">商贸介绍</div>
        <textarea class="text-area-class" placeholder="请填写，500字以内" maxlength="500"
                  v-model.trim="shopDetail.shopIntroduce" :disabled="auditState==0"></textarea>
      </div>
    </div>
    <div class="button ft-43r color-fff" @click="confirmSubmit" v-if="auditState==-1 &&showHide">提交</div>
  </div>
</template>
<script>
  import Navigator from "@/components/common/Navigator"
  import Urls from '@/assets/models/baseUrl'
  import {mapState, mapMutations} from 'vuex'
  import http from "@/assets/models/shopAPIs";

  export default {
    name: 'ApplyShopEntryStepTwo',
    props: [],
    data() {
      return {
        title: '填写入驻信息',
        baseUrl: ``,
        loadingEdit: false,
        showingImgUri: ``,
        auditState: 0,
        documentHeight: document.documentElement.clientHeight,
        showHide: true,
        shopDetail: {
          contacts: ``,
          dealerName: ``,
          contactNumber: ``,
          address: ``,//详细地址
          cityId: 0,//希望开通城市的id
          hopeProvince: ``,//希望开通城市
          id: 0,//经销商id
          shopName: ``,
          imgId: ``,
          shopIntroduce: ``
        }
      }
    },
    components: {
      'title-nav': Navigator
    },
    mounted() {
      this.baseUrl = Urls.easySaleUrl;
      this.auditState = this.userInfo.auditState
      console.log(this.dealerDetail)
      if (this.userInfo.auditState == 0 || this.userInfo.auditState == 1) {
        this.getShopInfo()
      }
      window.onresize = () => {
        return (() => {
          if (this.documentHeight > document.documentElement.clientHeight) {
            this.showHide = false
          } else {
            this.showHide = true
          }
        })()
      }
      console.log(this.dealerDetail)
    },
    methods: {
      getShopInfo() {
        return http.getDealerInfo({}).then(data => {
          this.shopDetail = data.data || {}
          this.showingImgUri = data.data.imageUrl
        })
      },
      confirmSubmit() {
        if (!this.formValid()) return null
        let param = Object.assign({}, this.dealerDetail, this.shopDetail)
        console.log(param)
        http.addShopAndEntry({param})
          .then(() => {
            //申请入驻，保存成功之后，状态变为待审核
            this.changeApplyState(0)
            this.$router.replace({name: `applyShopEntryStepThree`})
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      //图片上传成功时
      fileSuccess(res, file) {
        this.loadingEdit = false;
        this.showingImgUri = URL.createObjectURL(file.raw);
        this.shopDetail.imgId = res.data
      },
      //图片上传失败时
      fileError() {
        this.$toast({message: `上传失败`})
      },
      onProgress() {
        this.loadingEdit = true;
      },
      //上传图片前判断图片大小不能大于1M
      beforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 <= 1;
        if (!isLt1M) {
          this.$toast({message: `上传的图片大小不能超过1MB`})
        }
        return isLt1M
      },
      formValid() {
        let errList = []
        if (!this.shopDetail.shopName) {
          errList.push({errMsg: `请填写商贸名称`})
        }
        if (!this.shopDetail.imgId) {
          errList.push({errMsg: `请上传商贸logo`})
        }
        if (errList.length !== 0) {
          this.$toast({message: errList[0].errMsg})
        }
        return errList.length === 0
      },
      ...mapMutations(`user`, [`changeApplyState`])
    },
    computed: {
      headers() {
        return {
          'token': this.userInfo.token
        }
      },
      ...mapState(`user`, [`userInfo`]),
      ...mapState(`applyShopEntry`, [`dealerDetail`]),
    },
  }
</script>


<style lang="stylus" scoped>
  .page {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    height 100vh;
    background-color #f6f6f6;
  }

  .blue-bg {
    width: 100%;
    height: 3.25rem;
    background: linear-gradient(270deg, rgba(13, 137, 245, 1) 0%, rgba(73, 178, 242, 1) 100%);
  }

  .img-progress {
    width 9rem;
    height 1.23rem;
    margin .35rem auto .43rem auto;
  }

  .content-wrap {
    /*margin 0 .32rem;
    flex 1;
    background-color #fff;
    display: flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
    margin-top -.8rem;*/

    margin: 0 0.32rem;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    /* flex: 1; */
    background-color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    /* display: flex; */
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    /* justify-content: flex-start; */
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    /* margin-top: -0.8rem; */
    position: relative;
    top: -0.8rem;
    padding-bottom: 1rem;
  }

  .content-title {
    height .85rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0.05rem 0.11rem 0 rgba(73, 169, 243, 0.2);
    border-radius: 0.59rem;
    text-align center;
    line-height .85rem;
    font-weight 600;
    margin-top -.43rem;
    padding 0 .55rem;
  }

  .content {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items flex-start;
    padding 0.12rem .37rem;
    width 100%;
    .form-item {
      width 100%;
      min-height 1.28rem;
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      border-bottom .02rem solid #ededed;
    }
    .input-class {
      flex 1;
      margin-left .32rem;
      text-align right;
      outline none;
      background: #fff
    }
  }

  .button {
    margin 0 .64rem;
    height: 1.17rem;
    background: rgba(0, 150, 255, 1);
    box-shadow: 0.11rem 0.13rem 0.16rem 0 rgba(0, 150, 255, 0.2);
    border-radius: 0.59rem;
    text-align center;
    line-height 1.17rem;
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

  .text-area-class {
    outline none;
    padding .21rem;
    width 100%;
    height 2.85rem;
    font-size .40rem;
    color #333;
    background: #fff
  }

</style>
