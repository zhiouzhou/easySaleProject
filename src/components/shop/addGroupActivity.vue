<template>
  <div id="addGroupActivity">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>新增组合活动</span>
    </div>
    <div class="blank"></div>
    <div class="activity-title">活动信息</div>
    <ul class="activity-info">
      <li>
        <p><span>*</span><span>活动名称</span></p>
        <input type="text" placeholder="请输入活动名称" @input="setActivityName($event.target.value)" :value="activityName"/>
      </li>
      <li>
        <p><span>*</span><span>活动价格</span></p>
        <div><input type="number" placeholder="请输入" @input="setActivityPrice($event.target.value)"
                    :value="activityPrice"/><span>元/套</span></div>
      </li>
      <li>
        <p><span>*</span><span>最大可销售库存</span></p>
        <div><input type="number" placeholder="请输入" @input="setMaxCanSaleInventory($event.target.value)"
                    :value="maxCanSaleInventory"/><span>套</span></div>
      </li>
      <li>
        <p><span>*</span><span>活动日期</span></p>
        <div @click="selectTime">
          <input type="text" placeholder="请选择" disabled :value="activityTime"/>
          <i class="icon icon-xk_youjiantou_copy"></i>
        </div>
      </li>
    </ul>
    <div class="uploadImg">
      <div class="appImg">
        <p><span>*</span><span>APP端活动图片</span></p>
        <p>最多可上传1张照片</p>
      </div>
      <div class="addImg">
        <div>
          <el-upload
            class="avatar-uploader"
            v-loading="loadingApp"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :action="`${baseUrl}/file/uploadImg`"
            :headers="headers"
            :show-file-list="false"
            :on-success="appFileSuccess"
            :on-error="appFileErr"
            :on-progress="appProgressEdit"
            :before-upload="appBeforeAvatarUpload">
            <img v-if="appImageUrl" :src="appImageUrl" class="avatar">
            <i v-else class="icon icon-ic_tjtp"></i>
          </el-upload>
        </div>
        <p class="img-tips" style="margin-bottom: 0.64rem;">图片大小不能超过1MB</p>
      </div>
      <div class="appImg">
        <p><span>*</span><span>PC端展示图片</span></p>
        <p>最多可上传1张照片</p>
      </div>
      <div class="addImg">
        <div>
          <el-upload
            class="avatar-uploader"
            v-loading="loadingPc"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            element-loading-width="180px"
            :headers="headers"
            :action="`${baseUrl}/file/uploadImg`"
            :show-file-list="false"
            :on-success="pcFileSuccess"
            :on-error="pcFileErr"
            :on-progress="pcProgressEdit"
            :before-upload="pcBeforeAvatarUpload">
            <img v-if="pcImageUrl" :src="pcImageUrl" class="avatar">
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <i v-else class="icon icon-ic_tjtp"></i>
          </el-upload>
        </div>
        <p class="img-tips">图片大小不能超过1MB</p>
      </div>
    </div>
    <div class="product-info">
      <p>商品信息</p>
      <span @click="addMessage"><i class="icon icon-ic_tianjia_lan"></i>新增</span>
    </div>
    <div class="product-info-content">
      <ul class="product-info-content-ul" v-for="(item,index) in compositeProductList"
      >
        <!--:key="Math.random()+item.productId"-->
        <li>
          <p><span>*</span><span>商品名称</span></p>
          <div><input type="text" placeholder="请选择" disabled v-model="item.productName"/><i
            class="icon icon-xk_youjiantou_copy" @click="selectProduct(index)"></i></div>
        </li>
        <li>
          <p><span>*</span><span>规格</span></p>
          <div><input type="text" v-model="item.specName" disabled/></div>
        </li>
        <li>
          <p><span>*</span><span>商品数量</span></p>
          <div><input type="number" placeholder="请输入" v-model="item.productCount"/><span>{{item.promotionUnit}}</span><i
            class="icon icon-Rectangle"
            @click="chooseUnit('selectUnit',item,index)"></i>
          </div>
        </li>
        <li>
          <p><span>*</span><span>商品价格</span></p>
          <div><input type="text" placeholder="请输入" v-model="item.productPrice"/></div>
        </li>
        <li class="deleteList" v-show="compositeProductList.length>1"><span @click="deleteList(index)">删除</span></li>
      </ul>
    </div>
    <!--选择单位弹框-->
    <cube-pop position="bottom" ref="selectUnit">
      <ul class="classify-ul">
        <div class="select-header">
          <p slot="header">选择单位</p>
          <i class="icon icon-pop_ic_close" @click="closePop('selectUnit')"></i>
        </div>
        <li v-for="item in unitList" @click="onSelectUnit(item,'selectUnit')">
          <span>{{item}}</span>
          <!--<i class="icon icon-pop_ic_xz" v-show="compositeProductList[selectIndex].promotionUnit==item"></i>-->
        </li>
      </ul>
    </cube-pop>
    <div style="height: 1.31rem;"></div>
    <div class="submit" @click="onSubmit">提交</div>
  </div>
</template>


<script>
  import {Upload, Popup} from 'cube-ui'
  import {mapState, mapMutations} from 'vuex'
  import http from "@/assets/models/productAPIs";
  import httpAPIs from "@/assets/models/shopAPIs";
  import Urls from '@/assets/models/baseUrl'

  let date = new Date();
  let year = date.getFullYear();
  let yearTwo = year + 10;
  let month = date.getMonth();
  let day = date.getDate();
  const dateSegmentData = [
    {
      is: 'cube-date-picker',
      title: '开始时间',
      min: new Date(year, month, day),
      max: new Date(yearTwo, 11, 30)
    },
    {
      is: 'cube-date-picker',
      title: '结束时间',
      min: new Date(year, month, day),
      max: new Date(yearTwo, 11, 30)
    }
  ]

  export default {
    name: '',
    props: [],
    data() {
      return {
        unitList: [],
        baseUrl: '',
        selectIndex: null,
        loadingApp: false,
        loadingPc: false,
      }
    },
    components: {
      'cube-upload': Upload,
      'cube-pop': Popup,
    },
    created() {
      this.baseUrl = Urls.easySaleUrl;
      this.getUnit();
      this.dateSegmentPicker = this.$createSegmentPicker({
        data: dateSegmentData,
        onSelect: (seletedDates, selectedVals, selectedTexts) => {
          let time = `${selectedTexts[0].join('/')}-${selectedTexts[1].join('/')}`
          this.setActivityStartTime(`${selectedTexts[0].join('/')}`);
          this.setActivityEndTime(`${selectedTexts[1].join('/')}`);
          this.setActivityTime(time)
        },
        onNext: (i, selectedDate, slectedValue, selectedText) => {
        }
      })
    },
    methods: {
      goBack() {
        this.$router.go(-1);
        this.setClearContent();
      },
      selectTime() {
        this.dateSegmentPicker.show();
      },
      /*app端上传图片成功时*/
      appFileSuccess(res, file) {
        //data指文件对象
        //data.response.data  指上传图片Id
        this.setAppImageUrl(URL.createObjectURL(file.raw))
        this.setAppImg(res.data)
        this.loadingApp = false
      },
      /*pc端上传图片成功时*/
      pcFileSuccess(res, file) {
        this.setPcImageUrl(URL.createObjectURL(file.raw))
        this.setPcImg(res.data)
        this.loadingPc = false
      },
      /*app端上传失败时*/
      appFileErr(err) {
        this.$toast({message: `上传失败`})
      },
      /*PC端上传失败时*/
      pcFileErr(err) {
        this.$toast({message: `上传失败`})
      },
      /*App图片上传时*/
      appProgressEdit() {
        this.loadingApp = true
      },
      /*PC图片上传时*/
      pcProgressEdit() {
        this.loadingPc = true
      },
      /*app图片上传前判断图片大小不能小于1M*/
      appBeforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$toast({message: `上传的图片大小不能超过1MB`})
        }
        return isLt1M
      },
      //pc上传图片前判断图片大小不能大于1M
      pcBeforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$toast({message: `上传的图片大小不能超过1MB`})
        }
        return isLt1M
      },
      /*新增一条商品信息*/
      addMessage() {
        this.addActivityInfo()
      },
      // 删除一条商品信息
      deleteList(selectIndex) {
        this.compositeProductList.splice(selectIndex, 1)
      },
      selectProduct(selectIndex) {
        this.$router.push({
          name: 'chooseProduct',
          params: {
            callBackNameSpace: `chooseActivityProduct`, callBackFun: `chooseProduct`,
            extraParams: {selectIndex}
          }
        })
      },
      getUnit() {
        http.getProductUnit({})
          .then(data => {
            this.unitList = data.data
          })
      },
      chooseUnit(refId, selectItem, selectIndex) {
        this.selectIndex = selectIndex;
        this.openPop(refId)
      },
      onSelectUnit(selectItem, refId) {
        this.selectUnit({selectItem, selectIndex: this.selectIndex})
        this.closePop(refId)
      },
      closePop(refId) {
        this.$refs[refId].hide()
      },
      openPop(refId) {
        this.$refs[refId].show()
      },
      onSubmit() {
        let {activityStartTime, activityEndTime, activityName, activityPrice, maxCanSaleInventory, appImg, pcImg, compositeProductList} = this;
        console.log(compositeProductList)
        let productList = [];
        let endActivityPrice = "";
        compositeProductList.forEach(item => {
          let productSkuId = item.productId;
          let productCount = item.productCount;
          let promotionUnit = item.promotionUnit;
          let regularPrice = 1;
          let productPrice = item.productPrice
          endActivityPrice = productPrice * productCount + Number(endActivityPrice)
          productList.push({productSkuId, productCount, regularPrice, promotionUnit, productPrice})
        })
        console.log(endActivityPrice)
        if (endActivityPrice != activityPrice) {

          this.$toast({message: `组合产品的总价只能等于组合销售价格才能发布`})
        } else {
          httpAPIs.addGroupActivity({
            param: {
              activityStartTime,
              activityEndTime,
              activityName,
              activityPrice,
              maxCanSaleInventory,
              appImg,
              pcImg,
              compositeProductList: productList
            }
          })
            .then(data => {
              this.setClearContent();
              this.$toast({message: `新增成功`})
              this.$router.go(-1);
            })
            .catch(error => {
              this.$toast({message: error})
            })
        }

      },
      ...mapMutations(`chooseActivityProduct`, [`setAppImg`, `setActivityName`, `setActivityPrice`, `setMaxCanSaleInventory`, `setActivityEndTime`,
        `setActivityTime`, `setPcImg`, `addActivityInfo`, `setActivityStartTime`, `selectUnit`, `setClearContent`, `setAppImageUrl`, `setPcImageUrl`])
    },
    computed: {
      ...mapState(`chooseActivityProduct`, [`appImg`, `activityName`, `activityPrice`, `product`, `maxCanSaleInventory`, `activityStartTime`,
        `activityTime`, `pcImg`, `activityEndTime`, `compositeProductList`, `appImageUrl`, `pcImageUrl`]),
      headers() {
        return {
          'token': this.$store.state.user.userInfo.token
        }
      }
    },

  }
</script>


<style lang="stylus" scoped>
  #addGroupActivity {
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
    z-index: 3;
    span {
      padding-left: 3rem;
      color: #fff;
      font-size: 0.48rem;
    }
  }

  .blank {
    height: 1.17rem;
  }

  .activity-title {
    padding: 0.33rem 0.32rem;
    text-align left;
    color: #333;
    font-size: 0.4rem;
    font-weight: bold;
  }

  .activity-info {
    background: #fff;
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      height 1.25rem;
      justify-content space-between;
      padding: 0.44rem 0.32rem;
      border-bottom: 1px solid #EDEDED;
      font-size: 0.4rem;
      color: #333;
      p {
        span {
          &:nth-child(1) {
            color: #E53935;
          }
        }
      }
      input {
        text-align right;
        outline 0;
        background: #fff;
      }
      div {
        display: flex;
        align-items center;
        span, i {
          padding-left: 0.21rem;
        }
      }
    }
  }

  .uploadImg {
    background: #fff;
    margin-top: 0.27rem;
    padding: 0.43rem 0.32rem 0.32rem;
    text-align left;
    .appImg {
      display: flex;
      flex-direction: row;
      align-items center;
      justify-content space-between;
      padding-bottom: 0.32rem;
      p {
        &:nth-child(1) {
          span {
            color: #333;
            font-size: 0.4rem;
            &:nth-child(1) {
              color: #F94342;
            }
          }
        }
        &:nth-child(2) {
          color: #999;
          font-size: 0.35rem;
        }
      }
    }
    .addImg {
      color: #999;
      font-size: 0.32rem;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-align: start;
      -ms-flex-align: start;
      align-items: flex-start;
    }
    .img-tips {
      padding: 0.32rem 0 0rem;
      color: #999;
      font-size: 0.35rem;
    }
  }

  .product-info {
    padding: 0.33rem 0.32rem;
    font-size: 0.4rem;
    display: flex;
    flex-direction: row;
    align-items center;
    justify-content: space-between;

    p {
      color: #333;
      font-weight: bold;
    }
    span {
      color: #0096FF;
      display: flex;
      flex-direction: row;
      align-items center;
      i {
        margin-right: 0.11rem;
      }
    }

  }

  .product-info-content-ul {
    background: #fff;
    margin-bottom: 0.16rem;
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content space-between;
      padding: 0.44rem 0.32rem;
      border-bottom: 1px solid #EDEDED;
      font-size: 0.4rem;
      color: #333;
      p {
        span {
          &:nth-child(1) {
            color: #E53935;
          }
        }
      }
      input {
        text-align right;
        outline 0;
        background: #fff;
      }
      div {
        display: flex;
        align-items center;
        span, i {
          padding-left: 0.21rem;
        }
      }
    }
    .deleteList {
      display: flex;
      flex-direction: row;
      justify-content flex-end;
      span {
        display: block;
        height: 0.75rem;
        padding: 0 0.53rem;
        border: 1px solid #EDEDED;
        -webkit-border-radius: 0.21rem;
        -moz-border-radius: 0.21rem;
        border-radius: 0.05rem;
        font-size: 0.37rem;
        color: #666;
        line-height: 0.75rem;
      }
    }
  }

  .submit {
    width: 100%;
    height: 1.31rem;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #0096FF;
    color: #fff;
    font-size: 0.45rem;
    text-align center;
    line-height 1.31rem;
  }

  .classify-ul {
    width: 100%;
    height: 10.2rem;
    background: #fff;
    .select-header {
      display: flex;
      flex-direction: row;
      padding: 0.32rem;
      justify-content flex-end;
      align-items: center;
      border-bottom: 0.01rem solid #EDEDED;
      p {
        font-size: 0.43rem;
        color: #333;
        padding-right: 3.55rem;
      }
    }
    li {
      display: flex;
      flex-direction: row;
      justify-content space-between;
      margin: 0 0.32rem;
      padding: 0.44rem 0;
      border-bottom: 0.01rem solid #EDEDED;
      span {
        font-size: 0.4rem;
        color: #333;
      }
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

  .el-loading-mask {
    width: 50%;
  }
</style>
