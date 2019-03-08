<template>
  <div style="background-color: #F6F6F6">
    <title-nav v-bind:title="title"></title-nav>
    <div class="choose-type">
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>优惠券类型</span>
        <div class="ft-40r radio-box">
          <i :class="['icon',assignProductCoupon==false?'icon-ic_xuanzhong':'icon-ic_weixuan']"
             @click="chooseType(false)"></i>
          <span style="padding-left: 0.16rem">通用券</span>
        </div>
        <div class="ft-40r radio-box">
          <i :class="['icon',assignProductCoupon==true?'icon-ic_xuanzhong':'icon-ic_weixuan']"
             @click="chooseType(true)"></i>
          <span style="padding-left: 0.16rem">定向产品券</span>
        </div>
      </div>
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>活动日期</span>
        <div class="ft-40r" @click="onSelectMenu('activity')">
          <input class="time-input" id="activityDate" name="activityDate"  type="text" placeholder="请选择" v-validate="'required'" readonly="readonly" :value="selectActDate" ref="activityDate"/>
          <i class="icon icon-xk_youjiantou_copy"></i>
        </div>
      </div>
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>优惠券有效日期</span>
        <div class="ft-40r" @click="onSelectMenu('limitation')">
          <input class="time-input" id="limitDate" name="limitDate"  type="text" placeholder="请选择" readonly="readonly" v-validate="'required'" :value="selectLimitDate" ref="limitDate"/>
          <i class="icon icon-xk_youjiantou_copy"></i>
        </div>
      </div>
      <div v-if="assignProductCoupon">
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>产品名称</span>
        <div class="ft-40r" @click="selectProduct">
          <!--如果是编辑界面，带过来的字段中有产品名称就显示，否则显示请选择-->
          <!--<span v-if="productName">{{productName}}</span>-->
          <input type="text" id="productName" class="color-333333 box-input" v-model="productName"  name="productName"
                 style="text-align: right"
                 v-validate="'required'"
                 placeholder="请选择" ref="productName"/>
          <i class="icon icon-ic_jt_hui_36"></i>
        </div>
      </div>

      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>发放数量</span>
        <div class="ft-40r">
          <input type="text" id="couponTotalNum" name="couponTotalNum" class="color-333333 box-input" :value="couponTotalNum" @input="setCouponTotalNum($event.target.value)" style="text-align: right"
                 placeholder="请输入" v-validate="'required|numeric|min_value:1'" ref="couponTotalNum"/>
        </div>
      </div>
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>抵扣金额</span>
        <div class="ft-40r">
          <input type="text" id="discountAmount" name="discountAmount" class="color-333333 box-input" :value="discountAmount" @input="setDiscountAmount($event.target.value)" style="text-align: right"
                 placeholder="请输入" v-validate="'required|decimal|min_value:1'" ref="discountAmount"/>
        </div>
      </div>
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>最低下单金额</span>
        <div class="ft-40r">
          <input type="text" id="requireOrderAmount" name="requireOrderAmount" class="color-333333 box-input" :value="requireOrderAmount" @input="setRequireOrderAmount($event.target.value)" style="text-align: right"
                 placeholder="请输入" v-validate="'required|decimal'" ref="requireOrderAmount"/>
        </div>
      </div>
    </div>
    <div class="footer" @click="handleSave" v-if="showHide">
      <span style="color: white;font-size: 0.45rem">保存</span>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import {Popup} from 'cube-ui';
  import http from '@/assets/models/shopAPIs';
  import {mapState, mapMutations} from 'vuex';
  let date=new Date();
  let year=date.getFullYear();
  let yearTwo=year+10;
  let mouth=date.getMonth();
  let day=date.getDate();
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
    name: "addCoupon",
    data() {
      return {
        dateType: `activity`,
        title: '',
        showHide: true,  //显示或者隐藏button
        documentHeight: document.documentElement.clientHeight,  //默认屏幕高度
        pageMark: '',//a表示编辑页面，b表示新增页面
        dateMenuShow: false,
        assignProductCoupon: ``,//false为通用券，true为定向券
        couponActivityId: '',//优惠券活动id
        productSkuId: '',//使用定向卷的产品SKUID
        productName: '',//使用定向产品的产品名称
        couponEditList: [],//从detailCoupon页面带过来的编辑优惠券内容
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-pop': Popup,
    },
    mounted() {
      // window.onresize监听页面高度的变化
      window.onresize = () => {
        return (() => {
          if (this.documentHeight > document.documentElement.clientHeight) {
            this.showHide = false
          } else {
            this.showHide = true
          }
        })()
      }

      //跳到编辑页面(两种进入方式：一种直接进入编辑页面；二是从选择产品页面回到编辑页面)
      if (this.$route.params.fromPage == 2 || this.$route.params.fromPage != 1 && this.sourcePage === 'editCoupon') {
        this.assignProductCoupon = this.itemType || this.$route.params.couponType;
        this.couponEditList = this.couponDetailList;
        //如果从选择商品界面选中商品带回，则将选中的商品名称和Id赋给当前
        if (this.product) {
          this.productName = this.product.productName;
          this.productSkuId = this.product.productId
        } else {
          this.productName = this.couponEditList.productName;
          this.productSkuId = this.couponEditList.productSkuId
        }

        this.assignValue();
        //新增和编辑界面复用，更改title
        this.title = "编辑优惠券";
        this.pageMark = 'a';
      } else {//跳到新增界面(两种进入方式：一种直接进入新增页面；二是从选择产品页面回到新增页面)
        this.assignProductCoupon = this.itemType||false;
        if (this.product) {
          this.productName = this.product.productName;
          this.productSkuId = this.product.productId
        };
        this.title = "新增优惠券";
        this.pageMark = 'b';
      }

      this.dateSegmentPicker = this.$createSegmentPicker({
        data: dateSegmentData,
        onSelect: (selectedDates, selectedVals, selectedTexts) => {
          let time = `${selectedTexts[0].join('/')}-${selectedTexts[1].join('/')}`
          if (this.dateType === `activity`) {
           this.setCouponActivityBeginTime(`${selectedTexts[0].join('/')}`);
           this.setCouponActivityEndTime(`${selectedTexts[1].join('/')}`);
           this.setSelectActDate(time);
          } else if (this.dateType === `limitation`) {
            this.setCouponBeginTime(`${selectedTexts[0].join('/')}`);
            this.setCouponEndTime(`${selectedTexts[1].join('/')}`);
            this.setSelectLimitDate(time);
          }
        },
        onNext: (i, selectedDate, selectedValue, selectedText) => {
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
      //封装赋值函数
      assignValue() {
        let list = this.couponEditList
        //将上一个页面传过来的值赋给当前页面的变量,当前页面的变量存在vuex中
        this.couponActivityId = list.couponActivityId;
        let selectActDate=list.couponActivityBeginTime+'-'+list.couponActivityEndTime;
        this.setSelectActDate(selectActDate);
        let selectLimitDate=list.couponBeginTime+'-'+list.couponEndTime;
        this.setSelectLimitDate(selectLimitDate);
        this.setCouponActivityBeginTime(list.couponActivityBeginTime);
        this.setCouponActivityEndTime(list.couponActivityEndTime);
        this.setCouponBeginTime(list.couponBeginTime);
        this.setCouponEndTime(list.couponEndTime)
        this.setDiscountAmount(list.discountAmount);
        this.setCouponTotalNum(list.couponTotalNum);
        this.setRequireOrderAmount(list.requireOrderAmount);
      },
      //选择定向产品
      selectProduct() {
        this.$router.push({
          name: 'chooseProduct', params: {
            callBackNameSpace: `productForCoupon`, callBackFun: `changeProduct`,
            extraParams: {sourcePage: this.pageMark === 'b' ? `addCoupon` : `editCoupon`}
          }
        })
      },
      //新增优惠券
      addCouponActivity() {
        let {assignProductCoupon, couponActivityBeginTime, couponActivityId, couponActivityEndTime, couponBeginTime, couponEndTime, couponTotalNum, discountAmount, productSkuId, requireOrderAmount} = this;
        http.addCouponActivity({
          param: {
            assignProductCoupon,
            couponActivityBeginTime,
            couponActivityId,
            couponActivityEndTime,
            couponBeginTime,
            couponEndTime,
            couponTotalNum,
            discountAmount,
            productSkuId,
            requireOrderAmount
          }

        })
          .then(data => {
            this.$router.replace('/coupon')
          }).catch(e => {
          console.log(e)
        })
      },
      //编辑优惠券
      updateCouponActivity() {
        let {assignProductCoupon, couponActivityBeginTime, couponActivityId, couponActivityEndTime, couponBeginTime, couponEndTime, couponTotalNum, discountAmount, productSkuId, requireOrderAmount} = this;
        http.updateCouponActivity({
          param: {
            assignProductCoupon,
            couponActivityBeginTime,
            couponActivityId,
            couponActivityEndTime,
            couponBeginTime,
            couponEndTime,
            couponTotalNum,
            discountAmount,
            productSkuId,
            requireOrderAmount
          }
        })
          .then(data => {
            this.$router.replace('/coupon');
            //this.$router.go(-1);
          }).catch(e => {
          console.log(e)
        })
      },

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
          }else {
            //如果最低下单金额小于抵扣金额，由于vee-validate中的min-value在此处无法绑定一个动态的discountAmount值，故在次增加判断
            console.log('re',typeof (this.requireOrderAmount))
            if(parseFloat(this.requireOrderAmount)<=parseFloat(this.discountAmount)){
              this.$toast({
                message:'最低下单金额必须大于抵扣金额',
                iconClass: 'weui-icon-info', duration: 2000
              });
              return
            }
            //判断如果是新增界面，调接口
            if (this.$route.params.fromPage == 2 || this.$route.params.fromPage != 1 && this.sourcePage === 'editCoupon') {
              this.updateCouponActivity();
            } else {
              this.addCouponActivity();
            }
          }
        })
      },
      chooseType(choosen) {
        if (this.$route.params.fromPage == 2 || this.$route.params.fromPage != 1 && this.sourcePage === 'editCoupon') {
          this.$toast({message: `当前状态不能更改优惠券类型`});
        } else {
          this.setItemType(choosen);
          this.assignProductCoupon = this.itemType;
        }

      },
      onSelectMenu(dateType) {
        this.dateType = dateType;
        this.dateMenuShow = !this.dateMenuShow;
        this.dateSegmentPicker.show();
      },
      ...mapMutations('couponInfo', ['setCouponDetailList', 'setItemType','setSelectActDate','setSelectLimitDate','setCouponActivityBeginTime','setCouponActivityEndTime',
        'setCouponBeginTime','setCouponEndTime','setCouponTotalNum','setDiscountAmount','setRequireOrderAmount'])
    },
    computed: {
      ...mapState('couponInfo', ['couponDetailList', 'itemType','selectActDate','selectLimitDate','couponActivityBeginTime','couponActivityEndTime',
      'couponBeginTime','couponEndTime','couponTotalNum','discountAmount','requireOrderAmount']),
      ...mapState('productForCoupon', ['product', `sourcePage`]),
    },

  }
</script>

<style lang="stylus" scoped>

  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #0096FF;
    height: 1.31rem;
    line-height: 1.31rem;
  }

  .choose-type {
    display flex;
    flex-direction column;
    align-items stretch;
    box-sizing border-box;
    margin-bottom 0.27rem;
    background-color #fff;
    margin-top 0.16rem;
    > div {
      height: 1.28rem;
      display flex;
      flex-direction row;
      padding 0 0.32rem;
      box-sizing border-box;
      justify-content space-between;
      align-items center;
      border-bottom 1px solid #ededed;
    }
  }

  .choose-type-sp {
    color red
  }

  .radio-box {
    display flex;
    align-items center;
  }

  .box-input {
    background: #fff;
    text-align right;
    padding-right: 0.16rem;
    font-size: 0.4rem;
    outline 0;
    border: 0;
    width:90%;
    overflow: hidden;
    -ms-text-overflow: ellipsis
    text-overflow: ellipsis;
    white-space:nowrap;
  }
    .time-input{
      text-align right;
      outline 0;
      background: #fff;
      width 88%;
    }

  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #999;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #999;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #999;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #999;
  }
</style>
