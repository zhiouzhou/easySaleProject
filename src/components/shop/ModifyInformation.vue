<template>
  <div id="modifyInformation">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>修改商品信息</span>
    </div>
    <div class="blank"></div>
    <!--商品信息-->
    <ul class="content-comm">
      <li>
        <p><span>*</span><span>商品</span></p>
        <input type="text" v-model="productInfo.productName " placeholder="请输入" readonly/>
      </li>
      <li>
        <p><span>*</span><span>品牌</span></p>
        <input type="text" v-model="productInfo.productBrand" readonly/>
      </li>
      <li>
        <p><span>*</span><span>包装规格</span></p>
        <input type="text" v-model="productInfo.specName" placeholder="请输入" readonly/>
      </li>
    </ul>
    <!--价格-->
    <ul class="content-price">
      <li class="select-mode">
        <p><span>*</span><span>价格模式</span></p>
        <div class="price-model">
          <p :class="productInfo.priceType==1?'selectPrice':'normalSelect'" style="margin-right: 0.32rem;"
             @click="changePriceState(1)"><i
            class="icon icon-zjps_ic_xz_24_copy" v-show="productInfo.priceType==1"></i>统一售价</p>
          <p :class="productInfo.priceType==0?'selectPrice':'normalSelect'" @click="changePriceState(0)"><i
            class="icon icon-zjps_ic_xz_24_copy"
            v-show="productInfo.priceType==0"></i>区间价格
          </p>
        </div>
      </li>
      <li>
        <p><span>*</span><span>批发价</span></p>
        <p v-if="productInfo.priceType==0">
          <input type="text" id="minSellingPrice" name="minSellingPrice" v-validate="'required|decimal|min_value:1'"
                 ref="minSellingPrice" v-model="productInfo.minSellingPrice"
                 autocomplete="0"
                 v-on:input="valiteMinValue({value:productInfo.minSellingPrice,type:`min`})"/>至
          <input type="text"
                 id="maxSellingPrice"
                 name="maxSellingPrice"
                 v-validate="{required:true,decimal:true,min_value:productInfo.minSellingPrice}"
                 ref="maxSellingPrice"
                 v-model="productInfo.maxSellingPrice"
                 v-on:input="valiteMinValue({value:productInfo.maxSellingPrice,type:`max`})"/>
          元
          / {{productInfo.sellingPriceUnit}}
          <i @click="chooseUnit('selectUnit',type='sellingPriceUnit')" class="icon icon-Rectangle" v-if="productInfo.productSource !== 0"></i>
        </p>
        <p v-else-if="productInfo.priceType==1">
          <input type="text" v-model="productInfo.sellingPrice" id="sellingPrice" name="sellingPrice"
                 ref="sellingPrice" v-validate="'required|decimal|min_value:1'"
                 v-on:input="valiteMinValue({value:productInfo.sellingPrice,type:`sellingPrice`})"/>
          元
          / {{productInfo.guidePriceUnit}}
          <i @click="chooseUnit('selectUnit',type='sellingPriceUnit')" class="icon icon-Rectangle" v-if="productInfo.productSource !== 0"></i>
        </p>
      </li>
      <li>
        <p><span>*</span><span>零售指导价</span></p>
        <p><input type="text" v-model="productInfo.guidePrice" id="guidePrice" name="guidePrice" ref="guidePrice"
                  v-validate="'required|decimal|min_value:1'" :disabled="productInfo.productSource==0"/>
          元
          / {{productInfo.guidePriceUnit}}
          <i class="icon icon-Rectangle" @click="chooseUnit('selectUnit',type='guideMaxUnit')"
             v-if="productInfo.productSource !== 0"></i></p>
      </li>
    </ul>
    <!--选择单位弹框-->
    <cube-pop position="bottom" ref="selectUnit">
      <ul class="classify-ul">
        <div class="select-header">
          <p slot="header">选择单位</p>
          <i class="icon icon-pop_ic_close" @click="closePop('selectUnit')"></i>
        </div>
        <li v-for="item in unitList" @click="onSelectUnit(item,'selectUnit')">
          <span>{{item}}</span>
          <i class="icon icon-pop_ic_xz" v-show="type=='sellingPriceUnit'&&productInfo.sellingPriceUnit==item"></i>
          <i class="icon icon-pop_ic_xz" v-show="type=='guideMaxUnit'&&productInfo.guidePriceUnit==item"></i>
        </li>
      </ul>
    </cube-pop>
    <!--配送-->
    <ul class="distribution">
      <li class="select-mode">
        <p><span>*</span><span>配送方式</span></p>
        <div class="price-model">
          <p :class="['normalSelect',productInfo.deliveryMode==0?'selectPrice':'']" style="margin-right: 0.32rem;"
             @click="changedeliveryMode(0)">
            <i class="icon icon-zjps_ic_xz_24_copy" v-show="productInfo.deliveryMode==0"></i>易酒批配送</p>
          <p :class="['normalSelect',productInfo.deliveryMode==1||productInfo.deliveryMode==-1?'selectPrice':'']"
             @click="changedeliveryMode(1)">
            <i class="icon icon-zjps_ic_xz_24_copy"
               v-show="productInfo.deliveryMode==1||productInfo.deliveryMode==-1"></i>自己配送</p>
        </div>
      </li>
      <li>
        <span>取货仓库</span>
        <input v-model="warehouseName" type="text" readonly/>
      </li>
      <li>
        <p><span>*</span><span>生产日期</span></p>
        <p @click="selectProduceDate">{{productInfo.productionDate}}<i class="icon icon-ic_jt_hui_36"></i></p>
      </li>
    </ul>
    <!--规则-->
    <ul class="rule">
      <li>
        <p>起购规则</p>
        <p><input type="number" v-model="productInfo.minPurchaseNum" name="minPurchaseNum"
                  ref="minPurchaseNum" id="minPurchaseNum" v-validate="'required|min_value:0|integerNo'"
        />件起</p>
      </li>
      <li>
        <p>限购规则</p>
        <p @click="newRulePop('addNewRule')">
          每{{productInfo.salePolicyRule.intervalDay}}天限购{{productInfo.salePolicyRule.limitationNum}}件
          <span v-show="productInfo.permanent==true">，永久有效</span>
          <i class="icon icon-ic_jt_hui_36"></i>
        </p>
      </li>
      <li v-show="productInfo.permanent==false||productInfo.permanent==null">
        <p>限购时间</p>
        <p @click="selctRestrictionsDate">{{productInfo.ruleBegainTime}}至{{productInfo.ruleEndTime}}<i
          class="icon icon-ic_jt_hui_36"></i></p>
      </li>
      <li>
        <p>促销信息</p>
        <input v-model="productInfo.promotionInfo"/>
      </li>
    </ul>
    <!--照片-->
    <div class="commodity-img">
      <div class="commodity-img-title">
        <span>照片</span><span>最多只能上传1张图片</span>
      </div>
      <div class="add-img">
        <div v-if="productInfo.productSource==1">
          <el-upload
            class="avatar-uploader"
            v-loading="loadingEdit"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :headers="headers"
            :action="`${baseUrl}/file/uploadImg`"
            :show-file-list="false"
            :on-success="fileSuccess"
            :on-error="fileError"
            :on-progress="progressEdit"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="icon icon-ic_tjtp"></i>
          </el-upload>
        </div>
        <img :src="imageUrl" v-else class="imageNoChange">
        <p v-if="productInfo.productSource==1">图片大小不能超过1MB</p>
      </div>

    </div>
    <!--保存-->
    <div class="hold" @click="hold" v-show="showHide" :style="changeBtnColor==false?'background:#BDBDBD':''">
      保存
    </div>
    <!--限购规则弹框-->
    <cube-pop position="bottom" ref="addNewRule">
      <div class="addNewRules">
        <div class="rules-header">
          <p slot="header">新增限购规则</p>
          <i class="icon icon-pop_ic_close" @click="closePop('addNewRule')"></i>
        </div>
        <div class="rules-content">
          <span>时间间隔</span>
          <p>
            <input type="text" v-model="productInfo.salePolicyRule.intervalDay" placeholder="请输入"
                   @input.stop="valiteMinValue({value: productInfo.salePolicyRule.intervalDay, type:`time`})"/>
            天
          </p>
        </div>
        <div class="rules-content">
          <span>限购数量</span>
          <p>
            <input type="text" v-model="productInfo.salePolicyRule.limitationNum" placeholder="请输入"
                   @input.stop="valiteMinValue({value:productInfo.salePolicyRule.limitationNum,type:`num`})"/>
            件
          </p>
        </div>
        <div class="rules-content">
          <span>是否永久有效</span>
          <cube-switch v-model="productInfo.permanent">
            {{productInfo.permanent==true?'是':'否'}}
          </cube-switch>
        </div>
        <div class="ensure"
             @click="ensure('addNewRule',productInfo.salePolicyRule.intervalDay,productInfo.salePolicyRule.limitationNum)">
          确定
        </div>
      </div>
    </cube-pop>
  </div>

</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import {Popup, Upload, DatePicker} from 'cube-ui'
  import http from "@/assets/models/productAPIs";
  import httpAPIs from "@/assets/models/shopAPIs";
  import Urls from '@/assets/models/baseUrl'

  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let yearTwo = year + 10
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
    name: "modify-information",
    data() {
      return {
        baseUrl: '',
        unitList: [],
        type: '',
        imageUrl: '',
        loadingEdit: false,   //图片上传时loading
        showHide: true,
        documentHeight: document.documentElement.clientHeight,    //可见区域高度
        productInfo: {
          ruleBegainTime: '',
          ruleEndTime: '',
          permanent: false,
        },
        // value: true,
        warehouseName: '',
        restrictionsDate: '',    //限购时间
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-pop': Popup,
      'cube-upload': Upload,
    },
    mounted() {
      let addNewRule = document.getElementsByClassName('addNewRules')[0]
      window.onresize = () => {
        return (() => {
          if (this.documentHeight > document.documentElement.clientHeight) {
            this.showHide = false;
            addNewRule.style.height = document.documentElement.clientHeight + 'px'
          } else {
            this.showHide = true
          }
        })()
      }
    },
    created() {
      this.getUnitList();
      this.baseUrl = Urls.easySaleUrl
      let permanent = this.productInfo.permanent
      this.productInfo = this.$route.query.productInfo;
      console.log('product', this.productInfo)
      if (!this.productInfo.permanent) {
        this.$set(this.productInfo, `permanent`, permanent)
        console.log(`没有permanent`, this.productInfo.permanent)
      } else {
        this.productInfo.permanent = this.productInfo.permanent
        console.log(`有permanent`, this.productInfo.permanent)
      }
      //如果是从列表进入修改商品信息，销售策略Id为this.productInfo.salePolicyId
      //如果是从商品详情进入修改商品信息，销售策略Id为this.productInfo.productSalePolicyId
      this.productInfo.salePolicyId = this.productInfo.productSalePolicyId || this.productInfo.salePolicyId
      console.log(`salePolicyId`, this.productInfo.salePolicyId)
      this.warehouseName = this.productInfo.deliveryMode == 0 ? '易酒批仓库' : '经销商仓库'
      this.imageUrl = this.productInfo.imageUrl
      /*生产日期*/
      this.datePicker = this.$createDatePicker({
        title: '生产日期',
        min: new Date(2008, 0, 1),
        max: new Date(),
        value: new Date(),
        format: {
          year: 'YYYY',
          month: 'MM',
          date: 'DD'
        },
        onSelect: (data, selectedVal, selectedText) => {
          let produceDate = `${selectedVal.join('/')}`
          this.productInfo.productionDate = produceDate
        }
      });
      /*限购时间*/
      this.dateSegmentPicker = this.$createSegmentPicker({
        data: dateSegmentData,
        onSelect: (seletedDates, selectedVals, selectedTexts) => {
          let buyStartTime = `${selectedTexts[0].join('/')}`;
          let buyEndTime = `${selectedTexts[1].join('/')}`
          this.$set(this.productInfo, `ruleBegainTime`, buyStartTime)
          this.$set(this.productInfo, `ruleEndTime`, buyEndTime)
          let time = `${selectedTexts[0].join('/')}至${selectedTexts[1].join('/')}`
          this.restrictionsDate = time
        },
        onNext: (i, selectedDate, slectedValue, selectedText) => {
          dateSegmentData[1].min = selectedDate
          if (i === 0) {
            this.dateSegmentPicker.$updateProps({
              data: dateSegmentData
            })
          }
        }
      })
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      getUnitList() {   //获取单位列表
        http.getProductUnit({})
          .then(data => {
            this.unitList = data.data
          })
          .catch(e => {
            console.log(e)
          })
      },
      //选择规格单位弹框
      chooseUnit(refId, type) {
        this.$refs[refId].show();
      },
      closePop(refId) {

        this.$refs[refId].hide();
      },
      //选择单位
      onSelectUnit(item, refId) {
        //如果是type==sellingPriceUnit 选择是批发价单位
        //如果type==guidePriceUnit 选择的是指导价单位
        /*if (this.type == 'sellingPriceUnit') {
          this.productInfo.sellingPriceUnit = item;
        } else {
          this.productInfo.guidePriceUnit = item;
        }*/
        if(this.productInfo.productSource==1) {
          this.productInfo.sellingPriceUnit = item;
          this.productInfo.guidePriceUnit = item;
        }
        this.$refs[refId].hide();
      },
      //改变价格模式
      changePriceState(state) {
        this.productInfo.priceType = state
      },
      //改变配送方式
      changedeliveryMode(state) {
        this.productInfo.warehouseType = state
        this.productInfo.deliveryMode = state
      },
      //选择生产日期
      selectProduceDate() {
        this.datePicker.show()
      },
      //新增限购规则弹框显示
      newRulePop(refId) {
        this.$refs[refId].show();
      },
      //确定新增限购规则
      ensure(refId, timeInterval, number) {
        if (!this.isFromValid()) return
        this.productInfo.salePolicyRule.intervalDay = timeInterval;
        this.productInfo.salePolicyRule.limitationNum = number;
        httpAPIs.productLimitationRule({param: {intervalDay: timeInterval, limitationNum: number}})
          .then(data => {
            this.productInfo.limitRuleId = data.data
          })
          .catch(e => {
            console.log(e)
          })
        this.$refs[refId].hide();
      },
      /*选择限购时间弹框显示*/
      selctRestrictionsDate() {
        this.dateSegmentPicker.show();
      },

      //图片上传成功时
      fileSuccess(res, file) {
        console.log(`res`, res)
        console.log(`file`, file)
        //data指文件对象
        //data.response.data  指上传图片Id
        //URL.createObjectURL(file.raw) 取得上传的图片路径
        this.loadingEdit = false;
        this.imageUrl = URL.createObjectURL(file.raw);
        this.productInfo.defaultImageFileId = res.data
      },
      //图片上传失败时
      fileError(err, file) {
        this.$toast({message: `上传失败`})
      },
      //图片上传时
      progressEdit(event, file) {
        console.log(`上传时的event`, event)
        console.log(`上传时的file`, file)
        this.loadingEdit = true;
      },
      //上传图片前判断图片大小不能大于1M
      beforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$toast({message: `上传的图片大小不能超过1MB`})
        }
        return isLt1M
      },
      //保存
      hold() {
        // this.sss()
        if (!this.changeBtnColor) {
          return
        }
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
            let {productInfo} = this
            console.log('productInfo', productInfo);
            this.productInfo.guidePrice = parseFloat(this.productInfo.guidePrice);
            this.productInfo.sellingPrice = parseFloat(this.productInfo.sellingPrice);
            this.productInfo.defalutImg = productInfo.defaultImageFileId
            console.log(this.productInfo)
            httpAPIs.productEdit(productInfo)
              .then(data => {
                setTimeout(() => {
                  this.$router.go(-1)
                })
              }).catch(e => {
              this.$toast({message: e})
            })
          }
        })
      },
      valiteMinValue(event) {
        this.valiteNumber(event.type, event.value)
      },

      valiteNumber(dom, value) {
        let number = ``;
        number = value.replace(/[^\d.]/g, "")
        number = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        number = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        if (number.indexOf(".") < 0 && number != "") {//以上已经过滤， 此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          number = parseFloat(number);
        } else if (value == `.`) {
          number = `0` + value
        }
        if (dom == `min`) {
          this.productInfo.minSellingPrice = number
        } else if (dom == `max`) {
          this.productInfo.maxSellingPrice = number
        } else if (dom == `sellingPrice`) {
          this.productInfo.sellingPrice = number
        } else if (dom == `time`) {
          this.productInfo.salePolicyRule.intervalDay = number
        } else if (dom == `num`) {
          this.productInfo.salePolicyRule.limitationNum = number
        }
      },

      //限购规则的表单验证
      isFromValid() {
        let errList = []
        const re = /^[0-9]*[1-9][0-9]*$/;

        if (this.productInfo.salePolicyRule.intervalDay == null || this.productInfo.salePolicyRule.intervalDay == '') {
          errList.push({errMsg: `请输入时间间隔`})
        }
        if (!re.test(this.productInfo.salePolicyRule.intervalDay)) {
          errList.push({errMsg: `时间间隔必须为正整数`})
        }

        if (this.productInfo.salePolicyRule.intervalDay == null || this.productInfo.salePolicyRule.intervalDay == '') {
          errList.push({errMsg: `请输入限购数量`})
        }
        if (!re.test(this.productInfo.salePolicyRule.limitationNum)) {
          errList.push({errMsg: `限购数量必须为正整数`})
        }

        if (errList.length !== 0) {
          this.$toast({
            message: errList[0].errMsg,
            iconClass: 'weui-icon-info', duration: 2000
          })
        }
        return errList.length === 0
      },
    },
    computed: {
      headers() {
        return {
          'token': this.$store.state.user.userInfo.token
        }
      },
      changeBtnColor() {
        let {minSellingPrice, maxSellingPrice, deliveryMode, priceType, sellingPrice, guidePrice, productionDate} = this.productInfo
        // console.log(minSellingPrice, maxSellingPrice, deliveryMode, priceType, sellingPrice, guidePrice, productionDate)
        if (priceType == 1 && (!sellingPrice || !guidePrice || !deliveryMode || !productionDate)) {
          return false
        } else if (priceType == 0 && (!minSellingPrice || !maxSellingPrice || !deliveryMode || !guidePrice || !productionDate)) {
          return false
        } else {
          return true
        }
      }
    },
    watch: {},
  }
</script>

<style scoped lang="stylus">
  #modifyInformation {
    input {
      outline: 0;
    }
    background: #f6f6f6;
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
    .content-comm, .content-price, .distribution, .rule {
      background: #fff;
      padding: 0 0.32rem;
      display: flex;
      flex-direction: column;
      align-items flex-start;
      margin-bottom: 0.16rem;
    }
    .content-comm li {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items center;
      padding: 0.44rem 0;
      border-bottom: 1px solid #ededed;
      &:last-child {
        border-bottom: 0;
      }
      &:nth-child(1) {
        input {
          width: 90%;
          overflow: hidden;
          -ms-text-overflow: ellipsis
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      p {
        display: flex;
        align-items center;
        min-width: 100px;
        span {
          font-size: 0.4rem;
          color: #333;
          &:nth-child(1) {
            color: #F94342
          }
        }
      }
      input {
        color: #666;
        font-size: 0.4rem;
        text-align right;
        background: #fff;
      }
    }
    .select-mode {
      padding: 0.27rem 0;
      .price-model {
        display: flex;
        flex-direction: row;
        .normalSelect {
          background: #f6f6f6;
          padding: 0.20rem 0.29rem;
          color: #666;
          font-size: 0.37rem;
        }
        .selectPrice {
          font-size: 0.37rem;
          padding: 0.20rem 0.29rem;
          color: #099AFF;
          border: 1px solid #099AFF;
          -webkit-border-radius: 0.05rem;
          -moz-border-radius: 0.05rem;
          border-radius: 0.05rem;
          background: #fff;
        }
      }
    }
    .content-price li {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items center;
      padding: 0.44rem 0;
      border-bottom: 1px solid #ededed;
      p {
        display: flex;
        align-items center;
        span {
          font-size: 0.4rem;
          color: #333;
          &:nth-child(1) {
            color: #F94342
          }
        }
      }

      &:nth-child(2), &:nth-child(3) {
        p {
          color: #333;
          font-size: 0.4rem;
        }
        input {
          text-align: center;
          width: 1.8rem;
          color: #666;
          background: #fff
        }
        i {
          margin-right: 0.32rem;
          margin-left: 0.1rem;
        }
      }
      &:nth-child(3) {
        border-bottom: 0;
      }
    }
    .distribution li {
      input {
        font-size: 0.4rem;
        color: #666;
        text-align: right;
        background: #fff;
      }
      &:last-child {
        border-bottom: 0;
      }
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items center;
      padding: 0.44rem 0;
      border-bottom: 1px solid #ededed;
      span {
        font-size: 0.4rem;
        color: #333;
      }
      p {
        display: flex;
        align-items center;
        font-size: 0.4rem;
        color: #333;
        span {
          font-size: 0.4rem;
          color: #333;
          &:nth-child(1) {
            color: #F94342
          }
        }
      }
    }
    .rule li {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items center;
      padding: 0.44rem 0;
      border-bottom: 1px solid #ededed;
      p {
        color: #333;
        font-size: 0.4rem;
      }
      input {
        text-align right;
        margin-right: 0.32rem;
        font-size: 0.4rem;
        color: #333;
      }
    }
    .commodity-img {
      margin-top: 0.16rem;
      background: #fff;
      padding: 0 0.32rem;
      margin-bottom: 1.547rem;
      .commodity-img-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items center;
        padding: 0.387rem 0;
        span {
          &:nth-child(1) {
            font-size: 0.4rem;
            color: #333;
          }
          &:nth-child(2) {
            font-size: 0.347rem;
            color: #999;
          }
        }
      }
      /*.add-img {
        color: #999;
        font-size: 0.32rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        div {
          !*padding-bottom: 0.32rem;*!
        }
        p {
          padding-bottom: 0.32rem
        }
      }*/
    }
    .hold {
      position: fixed;
      bottom: 0;
      left: 0;
      background: #0096FF;
      color: #fff;
      height: 1.31rem;
      font-size: 0.453rem;
      text-align: center;
      line-height 1.31rem;
      width: 100%;
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
        border-bottom: 0.01rem solid rgba(0, 0, 0, .1);
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
        border-bottom: 0.01rem solid rgba(0, 0, 0, .1);
        span {
          font-size: 0.4rem;
          color: #333;
        }
      }
    }
    .addNewRules {
      background: #fff;
      width: 100%;
      height: 10.24rem;
      .rules-header {
        padding: 0.32rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content flex-end;
        border-bottom: 1px solid #ededed;
        p {
          padding-right: 3rem;
          color: #333;
          font-size: 0.43rem;
        }
      }
      .rules-content {
        display: flex;
        flex-direction: row;
        align-items center;
        padding: 0.44rem 0.32rem;
        border-bottom: 1px solid #ededed;
        justify-content space-between;
        color: #333;
        font-size: 0.4rem;
        p {
          display: flex;
          align-items center;
          input {
            text-align right;
            font-size: 0.4rem;
            margin-right: 0.21rem;
            color: #666;
            outline: 0;
          }
        }
      }
      .ensure {
        position: fixed;
        bottom: 0;
        height: 1.31rem;
        width: 100%;
        background: #099AFF;
        text-align center;
        line-height: 1.31rem;
        font-size: 0.45rem;
        color: #fff;
      }
    }
    .rules-content .cube-switch .cube-switch-label {
      margin-left: 0.32rem;
    }
    .add-img {
      color: #999;
      font-size: 0.32rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      div {
        padding-bottom: 0.12rem;
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

    .imageNoChange {
      width: 178px
      height: 178px
    }
  }
</style>
