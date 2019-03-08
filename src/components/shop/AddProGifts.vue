<template>
  <div id="addProgifts">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>新增产品满赠</span>
    </div>
    <div class="blank"></div>
    <div class="buyNumber">
      <div>
        <span>*</span>
        <p>购买数量</p>
      </div>
      <div>
        <input type="number" placeholder="请输入" @input="setRequiredNumber($event.target.value)" :value="requiredNumber"
               v-validate="'required|decimal|min_value:1'" name="requiredNumber" id="requiredNumber"
               ref="requiredNumber"/>
        件
      </div>
    </div>
    <div class="giftsName">
      <div>
        <span>*</span>
        <p>赠品名称</p>
      </div>
      <div>
        <input placeholder="请选择" v-model="selectedProduct.productName" readonly class="giftsNameInput"
               v-validate="'required'" name="giftName" id="giftName" ref="giftName"/>
        <i class="icon icon-xk_youjiantou_copy" @click="gotoChooseGifts"></i>
      </div>
    </div>
    <div class="buyNumber">
      <div>
        <span>*</span>
        <p>赠送数量</p>
      </div>
      <div>
        <input type="number" placeholder="请输入" v-model="giftNum" v-validate="'required|decimal|min_value:1'"
               name="giftNum" id="giftNum" ref="giftNum"/>
        {{giftUnit}}
        <i class="icon icon-Rectangle" @click="chooseUnit('selectUnit',type='giftUnit')"></i>
      </div>
    </div>
    <div class="buyNumber">
      <div>
        <span>*</span>
        <p>最大赠送数量</p>
      </div>
      <div>
        <input type="number" placeholder="请输入" v-model="maxGiftNum" v-validate="'required|decimal|min_value:1'"
               ref="maxGiftNum" name="maxGiftNum" id="maxGiftNum"/>
        {{maxGiftUnit}}
        <i class="icon icon-Rectangle" @click="chooseUnit('selectUnit',type='maxGiftUnit')"></i>
      </div>
    </div>
    <div class="giftsName">
      <div>
        <span>*</span>
        <p>设置活动时间</p>
      </div>
      <div>
        <input placeholder="请选择" v-model="giftTime" readonly="readonly" v-validate="'required'" name="giftTime"
               id="giftTime" ref="giftTime"/>
        <i class="icon icon-xk_youjiantou_copy" @click="selectTime"></i>
      </div>
    </div>
    <div class="submit" @click="onsubmit" :style="!changeBtnColor?'background:#BDBDBD':''">提交</div>
    <!--选择单位弹框-->
    <cube-pop position="bottom" ref="selectUnit">
      <ul class="classify-ul">
        <div class="select-header">
          <p slot="header">选择单位</p>
          <i class="icon icon-pop_ic_close" @click="closePop('selectUnit')"></i>
        </div>
        <li v-for="item in unitList" @click="onSelectUnit(item,'selectUnit')">
          <span>{{item}}</span>
          <i class="icon icon-pop_ic_xz" v-show="type=='giftUnit'&&giftUnit==item"></i>
          <i class="icon icon-pop_ic_xz" v-show="type=='maxGiftUnit'&&maxGiftUnit==item"></i>
        </li>
      </ul>
    </cube-pop>
  </div>
</template>


<script>

  import {mapState, mapMutations} from 'vuex'
  import {Popup} from 'cube-ui'
  import httpAPIs from "@/assets/models/shopAPIs";

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
        giftMode: null,  //倍增模式（0） 坎级模式（1）
        giftTime: '',
        giftBeginTime: '',   //活动起始时间
        giftEndTime: '',     //活动结束时间
        giftUnit: '件',    //赠品单位
        maxGiftUnit: '件', //最大赠品单位
        giftNum: null,   //赠送数量
        maxGiftNum: null,  //最大赠品赠送数量
        //requiredNumber: null,  //需要购买数量
        productSalePolicyId: '',//销售策略Id
        unitList: [],
        type: '',
      }
    },
    created() {
      // this.getUnitList();
      this.productSalePolicyId = this.$route.query.productSalePolicyId;
      this.giftMode = this.$route.query.giftMode;
      //设置活动起止时间
      this.dateSegmentPicker = this.$createSegmentPicker({
        data: dateSegmentData,
        onSelect: (seletedDates, selectedVals, selectedTexts) => {
          this.giftTime = `${selectedTexts[0].join('/')}-${selectedTexts[1].join('/')}`
          this.giftBeginTime = `${selectedTexts[0].join('/')}`;
          this.giftEndTime = `${selectedTexts[1].join('/')}`;
        },
        onNext: (i, selectedDate, slectedValue, selectedText) => {

        }
      })
    },
    components: {
      'cube-pop': Popup,
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      switchModel(giftMode) {
        this.giftMode = giftMode;
      },
      gotoChooseGifts() {
        this.$router.push({
          name: 'chooseProduct', params: {
            callBackNameSpace: `productFullGift`, callBackFun: `changeProduct`,
            extraParams: {}
          }
        })
      },
      chooseUnit(refId) {
        this.$refs[refId].show();
        let minUnit = this.selectedProduct.minUnit;
        let maxUnit = this.selectedProduct.maxUnit
        let list = [];
        list.push(minUnit, maxUnit)
        this.unitList = list
      },
      closePop(refId) {
        this.$refs[refId].hide();
      },
      onSelectUnit(item, refId) {
        //如果是type==giftUnit 选择是赠品单位
        //如果type==maxGiftUnit 选择的是最大赠品单位
        if (this.type == 'giftUnit') {
          this.giftUnit = item;
        } else {
          this.maxGiftUnit = item;
        }
        this.$refs[refId].hide();
      },
      //选择起止时间弹框显示
      selectTime() {
        this.dateSegmentPicker.show();
      },
      onsubmit() {
        if(!this.changeBtnColor){
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
            let {giftMode, giftBeginTime, giftEndTime, giftUnit, maxGiftUnit, giftNum, maxGiftNum, requiredNumber, productSalePolicyId} = this
            let giftSkuId = this.selectedProduct.productId
            let giftProductName = this.selectedProduct.productName
            httpAPIs.addProGifts({
              param: [{
                giftProductName,
                giftMode,
                giftBeginTime,
                giftEndTime,
                giftUnit,
                maxGiftUnit,
                giftNum,
                maxGiftNum,
                requiredNumber,
                productSalePolicyId,
                giftSkuId
              }]
            })
              .then(data => {
                this.$toast({message: `新增成功`})
                setTimeout(() => {
                  this.$router.go(-1);
                }, 1000)
              })
              .catch(error => {
                this.$toast({message: error})
              })
          }
        })
      },
      ...mapMutations(`productFullGift`, [`setRequiredNumber`])
    },
    computed: {
      selectedProduct() {
        if (this.product)
          return this.product;
        else return ``
      },
      changeBtnColor() {
        let {requiredNumber, giftNum, maxGiftNum, giftBeginTime, giftEndTime} = this
        let {productName} = this.selectedProduct
        console.log(requiredNumber, giftNum, maxGiftNum, giftBeginTime, giftEndTime, productName)
        if (!requiredNumber || !giftNum || !maxGiftNum || !giftBeginTime || !giftEndTime || !productName) {
          return false
        } else {
          return true
        }
      },
      ...mapState(`productFullGift`, [`product`, `requiredNumber`]),
    },

  }
</script>


<style lang="stylus" scoped>
  #addProgifts {
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

  .model, .buyNumber, .giftsName {
    background: #fff;
    padding: 0.44rem 0.32rem;
    display: flex;
    flex-direction: row;
    justify-content space-between;
    align-items center;
    font-size: 0.4rem;
    color: #333;
    border-bottom: 1px solid #ededed;
    div {
      &:nth-child(1) {
        display: flex;
        span {
          color: #F94343;
        }
      }
    }
    .giftsNameInput {
      width: 100%;
      overflow: hidden;
      -ms-text-overflow: ellipsis
      text-overflow: ellipsis;
      white-space: nowrap
    }
  }

  .model {
    div {
      &:nth-child(2) {
        display: flex;
        flex-direction row;
        align-items center;
        p {
          padding-left: 0.32rem;
          display: flex;
          align-items: center;
          i {
            margin-right: 0.21rem;
          }
        }
      }
    }
  }

  .buyNumber, .giftsName {
    div {
      &:nth-child(2) {
        display flex;
        align-items center;
      }
    }
    input {
      text-align: right;
      font-size: 0.4rem;
      margin-right: 0.21rem;
      outline 0;
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.31rem;
    background: #099Aff;
    text-align: center;
    line-height: 1.31rem;
    color: #fff;
    font-size: 0.45rem;
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
