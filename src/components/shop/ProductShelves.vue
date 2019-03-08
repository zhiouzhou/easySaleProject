<template>
  <div id="productShelves">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>商品上架</span>
    </div>
    <div class="blank"></div>
    <div class="product">
      <img :src="auditInfo.imageUrl"/>
      <div>
        <p>{{auditInfo.productName}}</p>
        <span>包装规格：{{auditInfo.specName}}</span>
      </div>
    </div>
    <div class="product-price">
      <div class="priceType">
        <p><span>*</span>价格模式</p>
        <p>
          <span :class="['priceModel',auditInfo.priceType==1?'selectPriceModel':'']" @click="selectModel(1)"><i
            class="icon icon-zjps_ic_xz_24_copy" v-show="auditInfo.priceType==1"></i>统一售价</span>
          <span :class="['priceModel',auditInfo.priceType==0?'selectPriceModel':'']" @click="selectModel(0)"><i
            class="icon icon-zjps_ic_xz_24_copy" v-show="auditInfo.priceType==0"></i>区间价格</span>
        </p>
      </div>
      <div class="price">
        <p><span>*</span>批发价</p>
        <p v-if="auditInfo.priceType==0">
          <input type="text" id="minSellingPrice" name="minSellingPrice" v-model="auditInfo.minSellingPrice"
                 v-validate="'required|decimal|min_value:0.01'" ref="minSellingPrice"
                 v-on:input="valiteMinValue({value:auditInfo.minSellingPrice,type:`min`})"/>至
          <input type="text" id="maxSellingPrice" name="maxSellingPrice" v-model="auditInfo.maxSellingPrice"
                 v-validate="{required:true,decimal:true,min_value:auditInfo.minSellingPrice}" ref="maxSellingPrice"
                 v-on:input="valiteMinValue({value:auditInfo.maxSellingPrice,type:`max`})"/>
          元 / {{auditInfo.sellingPriceUnit}}
          <i @click="chooseUnit('selectUnit',type='sellingPriceUnit')" class="icon icon-Rectangle"  v-if="auditInfo.productSource !== 0"></i>
        </p>
        <p v-else-if="auditInfo.priceType==1">
          <input type="text" id="sellingPrice" name="sellingPrice" placeholder="请输入"
                 v-validate="'required|decimal|min_value:0.01'" v-model="auditInfo.sellingPrice" ref="sellingPrice"
                 v-on:input="valiteMinValue({value:auditInfo.sellingPrice,type:`sellingPrice`})"/>
          <span>元/ {{auditInfo.sellingPriceUnit}}<i @click="chooseUnit('selectUnit',type='sellingPriceUnit')"
                                                    class="icon icon-Rectangle"  v-if="auditInfo.productSource !== 0"></i></span>
        </p>
      </div>
      <div class="price">
        <p><span>*</span>零售指导价</p>
        <p>
          <input type="text" id="guidePrice" name="guidePrice" v-validate="'required|decimal|min_value:0.01'"
                 placeholder="请输入" v-model="auditInfo.guidePrice"
                 :disabled="auditInfo.productSource==0"
                 ref="guidePrice"
                 v-on:input="valiteMinValue({value:auditInfo.guidePrice,type:`guidePrice`})"
          />
          <span>元/ {{auditInfo.guidePriceUnit}}<i @click="chooseUnit('selectUnit',type='guideMaxUnit')"
                                                  class="icon icon-Rectangle" v-if="auditInfo.productSource !== 0"></i></span>
        </p>
      </div>
      <div class="priceType">
        <p><span>*</span>配送方式</p>
        <p>
          <span :class="['allocationMode',auditInfo.deliveryMode==0?'selectPriceModel':'']" @click="selectMode(0)"><i
            class="icon icon-zjps_ic_xz_24_copy" v-show="auditInfo.deliveryMode==0"></i>易酒批配送</span>
          <span :class="['allocationMode',auditInfo.deliveryMode==1||auditInfo.deliveryMode==-1?'selectPriceModel':'']"
                @click="selectMode(1)"><i
            class="icon icon-zjps_ic_xz_24_copy" v-show="auditInfo.deliveryMode==1"></i>自己配送</span>
        </p>
      </div>
      <div class="price">
        <p>取货仓库</p>
        <p>{{auditInfo.deliveryMode==0?'易酒批仓库':'自己仓库'}}</p>
      </div>
      <div class="date">
        <p>生产日期</p>
        <p @click="selectProduceDate">
          <input type="text" placeholder="请选择" readonly="readonly" v-model="auditInfo.productionDate"/>
          <i class="icon icon-xk_youjiantou_copy"></i>
        </p>
      </div>
    </div>
    <div class="rules">
      <div class="rule-select">
        <p>起购规则</p>
        <p>
          <input type="number" placeholder="请输入" v-model="auditInfo.minPurchaseNum" name="minPurchaseNum"
                 ref="minPurchaseNum" id="minPurchaseNum" v-validate="'required|decimal|min_value:0|integerNo'"/>
          件起
        </p>
      </div>
      <div class="rule-select">
        <p>限购规则</p>
        <p @click="newRulePop('addNewRule')">
          <input type="text" placeholder="新增" v-model="restrictionsRule"/>
          <span v-show="auditInfo.permanent">永久有效</span>
          <i class="icon icon-xk_youjiantou_copy"></i>
        </p>
      </div>
      <div class="rule-select" v-show="!auditInfo.permanent">
        <p>限购时间</p>
        <p @click="selctRestrictionsDate">
          {{auditInfo.ruleBegainTime}}至{{auditInfo.ruleEndTime}}
          <i class="icon icon-xk_youjiantou_copy"></i>
        </p>
      </div>
      <div class="rule-select">
        <p>促销信息</p>
        <p>
          <input type="text" placeholder="请输入" v-model="auditInfo.promotionInfo"/>
        </p>
      </div>
    </div>
    <div style="height: 1.31rem;"></div>
    <div class="shelvesButton" @click="shelves('title')" v-show="showHide"
         :style="changeBtnColor==false?'background:#BDBDBD':''">上架
    </div>
    <!--新增限购规则弹框-->
    <cube-pop position="bottom" ref="addNewRule">
      <div class="addNewRules">
        <div class="rules-header">
          <p slot="header">新增限购规则</p>
          <i class="icon icon-pop_ic_close" @click="closePop('addNewRule')"></i>
        </div>
        <div class="rules-content">
          <span>时间间隔</span>
          <p>
            <!--v-validate="'required|numeric|min_value:1'"-->
            <input type="text"
                   v-model="auditInfo.intervalDay" placeholder="请输入"
                   v-on:input="valiteMinValue({value:auditInfo.intervalDay,type:`time`})"/>
            天
          </p>
        </div>
        <div class="rules-content">
          <span>限购数量</span>
          <p>
            <input type="text"
                   v-model="auditInfo.limitationNum" placeholder="请输入"
                   v-on:input="valiteMinValue({value:auditInfo.limitationNum,type:`num`})"/>
            件
          </p>
        </div>
        <div class="rules-content">
          <span>是否永久有效</span>
          <cube-switch v-model="auditInfo.permanent">
            {{auditInfo.permanent?'是':'否'}}
          </cube-switch>
        </div>
        <div class="ensure" @click="ensure('addNewRule',auditInfo.intervalDay,auditInfo.limitationNum)">确定
        </div>
      </div>
    </cube-pop>
    <!--商品第一次上架弹框提示-->
    <cube-pop position="center" ref="title">
      <div class="upTitle">
        <div style="line-height: 110%;">商品第一次上架销售，需平台进行上架审核，我们会在1个工作日内审核完毕，请耐心等待。</div>
        <p @click="goBack()">我知道了</p>
      </div>
    </cube-pop>
    <!--选择单位弹框-->
    <cube-pop position="bottom" ref="selectUnit">
      <ul class="classify-ul">
        <div class="select-header">
          <p slot="header">选择单位</p>
          <i class="icon icon-pop_ic_close" @click="closePop('selectUnit')"></i>
        </div>
        <li v-for="item in unitList" @click="onSelectUnit(item,'selectUnit')">
          <span>{{item}}</span>
          <i class="icon icon-pop_ic_xz" v-show="type=='sellingPriceUnit'&&auditInfo.sellingPriceUnit==item"></i>
          <i class="icon icon-pop_ic_xz" v-show="type=='guideMaxUnit'&&auditInfo.guidePriceUnit==item"></i>
        </li>
      </ul>
    </cube-pop>
  </div>
</template>

<script>
  import {DatePicker, Popup} from 'cube-ui'
  import http from "@/assets/models/productAPIs";
  import httpAPIs from "@/assets/models/shopAPIs";

  let date = new Date();
  let year = date.getFullYear();
  let yearTwo = year + 10;
  let mouth = date.getMonth();
  let day = date.getDate();
  const dateSegmentData = [
    {
      is: 'cube-date-picker',
      title: '开始时间',
      min: new Date(year, mouth, day),
      max: new Date(yearTwo, 11, 30)
    },
    {
      is: 'cube-date-picker',
      title: '结束时间',
      min: new Date(year, mouth, day),
      max: new Date(yearTwo, 11, 30)
    }
  ]
  export default {
    name: "product-shelves",
    data() {
      return {
        restrictionsRule: '', /*限购规则*/
        auditInfo: {
          applyRemark: '',   //申请备注
          permanent: false,       //限购规则是否永久有效
          intervalDay: null,     //限购规则限购天数
          limitationNum: null,   //限购数量
          limitRuleId: '',   //限购规则ID
          productionDate: '',    //生产日期
          ruleBegainTime: '',    //规则生效日期
          ruleEndTime: '',       //规则失效日期
          priceMode: 0, /*价格模式  0 区间价格  1 统一价格*/
          deliveryMode: 0, /*配送方式 0 自己配送 1 易酒批配送*/
          minSellingPrice: null,   //最小销售价
          maxSellingPrice: null,   //最大销售价
          sellingPrice: null,      //统一销售价
          sellingPriceUnit: '件',    //批价单位  (统一销售价单位)
          guidePrice: null,          //指导价
          guidePriceUnit: '件',      //指导单位
          limitRuleId: null,         //限购规则ID
          minPurchaseNum: null,        //起购数量
          productSkuId: '',        //产品SkuID
          salePolicyId: '',        //销售策略Id
        },
        restrictionsDate: '',     //限购时间
        unitList: [],     //单位列表
        type: '',
        imageUrl: '',            //产品图片
        productName: '',
        specName: '',
        showHide: true,   //按钮显示或者隐藏
        documentHeight: document.documentElement.clientHeight,
      }
    },
    mounted() {
      let addNewRule = document.getElementsByClassName('addNewRules')[0]
      //window.onresize监听页面高度的变化
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
      console.log(this.auditInfo)
      /*生产日期*/
      this.datePicker = this.$createDatePicker({
        title: '生产日期',
        min: new Date(2009, 0, 1),
        max: new Date(),
        value: new Date(),
        format: {
          year: 'YYYY',
          month: 'MM',
          date: 'DD'
        },
        onSelect: (data, selectedVal, selectedText) => {
          this.auditInfo.productionDate = `${selectedVal.join('/')}`
        }
      });
      /*限购时间*/
      this.dateSegmentPicker = this.$createSegmentPicker({
        data: dateSegmentData,
        onSelect: (seletedDates, selectedVals, selectedTexts) => {
          this.auditInfo.ruleBegainTime = `${selectedTexts[0].join('/')}`;
          this.auditInfo.ruleEndTime = `${selectedTexts[1].join('/')}`;
          this.restrictionsDate = `${selectedTexts[0].join('/')}至${selectedTexts[1].join('/')}`
        },
        onNext: (i, selectedDate, slectedValue, selectedText) => {
          dateSegmentData[1].min = selectedDate
          if (i === 0) {
            this.dateSegmentPicker.$updateProps({
              data: dateSegmentData
            })
          }
        }
      });
      this.getUnitList();
      let permanent = this.auditInfo.permanent
      this.auditInfo = this.$route.query.productInfo
      if (!this.auditInfo.ruleBegainTime) {
        this.$set(this.auditInfo, `ruleBegainTime`, ``)
      }
      //初始化的时候ruleEndTime等等字段可能会没有，所以直接赋值会导致数据是变了，但是页面没有变化，原因是后加上的属性不是响应式的
      //原理参考https://cn.vuejs.org/v2/guide/reactivity.html 检测变化的注意事项
      if (!this.auditInfo.ruleEndTime) {
        this.$set(this.auditInfo, `ruleEndTime`, ``)
      }
      if (!this.auditInfo.permanent) {
        this.$set(this.auditInfo, `permanent`, permanent)
        console.log(`没有permanent`, this.auditInfo.permanent)
      } else {
        console.log(`有permanent`, this.auditInfo.permanent)
      }
      this.auditInfo.intervalDay = this.auditInfo.salePolicyRule.intervalDay;   //限购间隔天数
      this.auditInfo.limitationNum = this.auditInfo.salePolicyRule.limitationNum;   //限购数量
      this.restrictionsRule = '每' + this.auditInfo.intervalDay + '天限购' + this.auditInfo.limitationNum + '件'
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      newRulePop(refId) {    //新增限购规则
        this.$refs[refId].show();
      },
      closePop(refId) {
        this.$refs[refId].hide();
      },
      showPop(refId) {
        this.$refs[refId].show();
      },

      //确定限定规则
      ensure(refId, timeInterval, number) {
        if (!this.isFromValid()) return
        this.auditInfo.intervalDay = timeInterval;    //限购天数
        this.auditInfo.limitationNum = number;      //限购数量
        this.restrictionsRule = '每' + timeInterval + '天限购' + number + '件'
        httpAPIs.productLimitationRule({param: {intervalDay: timeInterval, limitationNum: number}})
          .then(data => {
            this.auditInfo.limitRuleId = data.data
          })
          .catch(e => {
            console.log(e)
          })
        this.$refs[refId].hide();

      },
      selectProduceDate() {
        console.log(this.datePicker)
        this.datePicker.show()
      },
      selctRestrictionsDate() {    /*选择限购时间*/
        this.dateSegmentPicker.show();
      },
      selectModel(model) {
        this.auditInfo.priceType = model;
      },
      selectMode(mode) {   //选择配送方式
        this.auditInfo.deliveryMode = mode;
        this.auditInfo.warehouseType = mode;
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
      //选择单位弹框
      chooseUnit(refId) {
        this.$refs[refId].show();
      },
      //选择单位
      onSelectUnit(item, refId) {
        //如果是type==sellingPriceUnit 选择是批发价单位
        //如果type==guidePriceUnit 选择的是指导价单位
        /*if (this.type == 'sellingPriceUnit') {
          this.auditInfo.sellingPriceUnit = item;
        } else {
          this.auditInfo.guidePriceUnit = item;
        }*/
        if(this.auditInfo.productSource==1) {
          this.auditInfo.sellingPriceUnit = item;
          this.auditInfo.guidePriceUnit = item;
        }
        this.$refs[refId].hide();
      },
      shelves(refId) {     //上架
        // this.$refs[refId].show();
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
            let productSkuId = this.auditInfo.productSkuId
            this.auditInfo.guidePrice = parseFloat(this.auditInfo.guidePrice)
            this.auditInfo.sellingPrice = parseFloat(this.auditInfo.sellingPrice)
            this.auditInfo.minSellingPrice = parseFloat(this.auditInfo.minSellingPrice)
            this.auditInfo.maxSellingPrice = parseFloat(this.auditInfo.maxSellingPrice)
            this.auditInfo.priceMode = this.auditInfo.priceType
            httpAPIs.productShelves({param: this.auditInfo})
              .then(data => {
                //没有上架时间表示第一次上架
                if (!this.auditInfo.firstOnlineDate) {
                  this.showPop(`title`)
                } else {
                  this.$toast({message: `上架成功`})
                  setTimeout(() => {
                    this.goBack()
                  }, 1000)
                }
              })
              .catch(error => {
                this.$toast({message: error})
              })
          }
        })

      },
      //限购规则的表单验证
      isFromValid() {
        let errList = []
        const re = /^[0-9]*[1-9][0-9]*$/;

        if (!this.auditInfo.intervalDay) {
          errList.push({errMsg: `请输入时间间隔`})
        }
        if (!re.test(this.auditInfo.intervalDay)) {
          errList.push({errMsg: `时间间隔必须为正整数`})
        }

        if (!this.auditInfo.limitationNum) {
          errList.push({errMsg: `请输入限购数量`})
        }
        if (!re.test(this.auditInfo.limitationNum)) {
          errList.push({errMsg: `限购数量必须为正整数`})
        }

        if (errList.length !== 0) {
          this.$toast({
            message: errList[0].errMsg,
            iconClass: 'weui-icon-info', duration: 2000
          })
          return false
        }else{
          return true
        }

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
          this.auditInfo.minSellingPrice = number
        } else if (dom == `max`) {
          this.auditInfo.maxSellingPrice = number
        } else if (dom == `sellingPrice`) {
          this.auditInfo.sellingPrice = number
        } else if (dom == `time`) {
          this.auditInfo.intervalDay = number
        } else if (dom == `num`) {
          this.auditInfo.limitationNum = number
        } else if (dom == `guidePrice`) {
          this.auditInfo.guidePrice = number
        }
      },
    },
    components: {
      'cube-pop': Popup,
      'cube-button': DatePicker,
    },
    computed: {
      changeBtnColor() {
        let {minSellingPrice, maxSellingPrice, deliveryMode, priceType, sellingPrice, guidePrice} = this.auditInfo
        if (priceType == 1 && (!sellingPrice || !guidePrice)) {
          return false
        } else return !(priceType == 0 && (!minSellingPrice || !maxSellingPrice || !guidePrice));
      }
    }
  }
</script>

<style scoped lang="stylus">
  #productShelves {
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

  .product {
    background: #fff;
    display: flex;
    flex-direction: row;
    align-items flex-start;
    justify-content flex-start;
    padding: 0.32rem;
    margin-bottom: 0.16rem;

    img {
      width: 2.13rem;
      height: 2.13rem;
    }

    div {
      padding-left: 0.21rem;
      text-align left;

      p {
        color: #333;
        font-size: 0.4rem;
        padding-bottom: 0.32rem;
      }

      span {
        color: #666;
        font-size: 0.35rem;
      }
    }
  }

  .product-price {
    background: #fff;
    padding: 0 0.32rem;
    margin-bottom: 0.16rem;

    .priceType, .price, .date {
      border-bottom: 1px solid #ededed;
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items: center;

      p {
        &:nth-child(1) {
          color: #333;
          font-size: 0.4rem;

          span {
            color: #ff4342;
          }
        }
      }
    }

    .priceType {
      padding: 0.27rem 0;

      p {
        &:nth-child(2) {
          display: flex;
          flex-direction: row;
          align-items center;

          .priceModel, .allocationMode {
            display: block;
            color: #666;
            font-size: 0.37rem;
            width: 2.08rem;
            height: 0.75rem;
            background: #f6f6f6;
            -webkit-border-radius: 0.05rem;
            -moz-border-radius: 0.05rem;
            border-radius: 0.05rem;
            margin-left: 0.32rem;
            display: flex;
            align-items center;
            justify-content: center;

            i {
              margin-right: 0.06rem;
            }
          }

          .selectPriceModel {
            background: #fff;
            border: 1px solid #099AFF;
            color: #099AFF;
            border-radius: 0.05rem;
          }

          .allocationMode {
            width: 2.45rem;
          }
        }
      }
    }

    .price {
      padding: 0.43rem 0;

      p {
        font-size: 0.4rem;
        display: flex;
        flex-direction: row;
        align-items center;

        input {
          text-align right;
          outline 0;
          border: 0;
          font-size: 0.4rem;
          margin-right: 0.43rem;
          width: 1.2rem;
          color: #666;
        }

        span {
          color: #333;
          font-size: 0.37rem;

          i {
            margin-left: 0.1rem;
          }
        }
      }
    }

    .date {
      padding: 0.43rem 0;

      p {
        &:nth-child(2) {
          font-size: 0.4rem;
          display: flex;
          flex-direction: row;
          align-items center;

          input {
            background: #fff;
            text-align right;
            outline 0;
            border: 0;
            font-size: 0.4rem;
            width: 3rem;
            color: #666;
          }
        }
      }
    }
  }

  .rules {
    background: #fff;
    padding: 0 0.32rem;
    margin-bottom: 0.32rem;

    .rule-select {
      padding: 0.45rem 0;
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items center;
      border-bottom: 1px solid #ededed;

      p {
        color: #333;
        font-size: 0.4rem;
        display: flex;
        align-items center;

        input {
          background: #fff;
          text-align: right;
          margin-right: 0.21rem;
          outline: 0;
          color: #666;
        }
      }
    }
  }

  .shelvesButton {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.31rem;
    background: #099AFF;
    font-size: 0.45rem;
    color: #fff;
    text-align: center;
    line-height: 1.31rem;
  }

  .addNewRules {
    background: #fff;
    width: 100%;
    height: 8rem;

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

    .addNewRules_new {
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

  .upTitle {
    width: 8rem;
    background: #fff;
    color: #333;
    font-size: 0.4rem;
    -webkit-border-radius: 0.43rem;
    -moz-border-radius: 0.43rem;
    border-radius: 0.43rem;

    div {
      padding: 0.64rem 0.43rem;
      text-align left;
    }

    p {
      color: #099AFF;

      border-top: 1px solid #ededed;
      padding: 0.37rem;
      text-align center;
    }
  }

  .cube-popup-content {
    height: 5.4rem;
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
</style>

