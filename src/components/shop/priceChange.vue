<template>
  <div style="background-color:#F6F6F6">
    <title-nav v-bind:title="title"></title-nav>
    <div class="box-title">
      <div class="box-title-line1">
        <span>{{memberInfoList.userName}}-{{memberInfoList.companyName}}({{memberInfoList.mobileNo}})</span>
        <span class="ft-35 color-999999">经纪人：{{memberInfoList.brokerName}}</span>
      </div>
      <div class="box-title-line2 ft-35 color-999999">{{memberInfoList.address}}</div>

    </div>
    <div class="list-product-wrap" v-for="item in productList" :key="item.productSkuId">
      <div class="product-info-wrap">
        <img
          class="left"
          :src="item.imageUrl"/>
        <div class="middle">
          <span class="ft-40r color-333 two-line" style="line-height: 0.5rem;font-weight:500;text-align: left">{{item.productName}}</span>
          <span><span class="ft-35r color-666">进货价格</span><span
            style="color:#FA7B43;font-size: 0.48rem;margin-left: 0.2rem"><span style="font-size: 0.35rem">￥</span>{{item.productPrice}} {{item.priceUnit}}</span></span>
          <span>
          <span class="ft-35r color-666">规格：{{item.specName}} </span>
          <button style="width: 2.5rem;visibility:hidden"></button>
          <span>剩余天数：{{item.validDayNum}}</span>
        </span>
        </div>
      </div>
      <div class="btn-info">
        <span class="btnModel" @click="show(item.productSkuId,item.maxUnit,item.minUnit)">修改</span>
      </div>
    </div>
    <!--空页面-->
    <div class="emptyPage" v-show="!productList||productList.length==0">
      <img src="/static/icons/Group7Copy.png">
      <span>暂无数据</span>
    </div>
    <!--中间弹框-->
    <cube-pop position="center" :mask-closable="true" ref="productChange">
      <div class="msgBox">
        <p class="msgbox-header">
          <span>设置价格</span>
        </p>
        <p class="msgBox-line">
          <span>
                  <label style="padding-left: 0.43rem">商品价格</label>
                  <input id="price" name="price" type="text" v-model="productPrice" v-validate="'required|decimal|min_value:0'" ref="price"/>
                  <span>元</span>
          </span>
        </p>
        <p class="msgBox-line" style="display: flex;flex-direction: row">
          <span>
            <label style="padding-left: 0.43rem">单位价格</label>
            <button :class="['msg-btn',selectUnit==1?'msg-btn-active':'']"
                    @click="handleChangeUnit(1)">
              <i class="icon icon-pop_ic_xz" style="position: absolute;left: 0.2rem"
                 v-show="selectUnit==1"></i>{{minUnit}}</button>
            <button :class="['msg-btn',selectUnit==2?'msg-btn-active':'color-666']"
                    @click="handleChangeUnit(2)">
              <i class="icon icon-pop_ic_xz" style="position: absolute;left: 0.2rem"
                 v-show="selectUnit==2"></i>{{maxUnit}}</button>
        </span>
        </p>
        <p class="msgBox-line">
          <label style="width: 2.1rem">有效期</label>
          <input id="days" name="days" type="text" v-validate="'required|numeric|min_value:1'" v-model="validDayNum" ref="days"/>
          <span>天</span>
        </p>

      </div>
      <div class="msgBox-footer">
        <div class="btn-cancel" @click="closePop">取消</div>
        <div class="btn-sure" @click="saveHandle">确定</div>
      </div>
    </cube-pop>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import {Popup} from 'cube-ui';
  import http from '@/assets/models/shopAPIs';
  import {createNamespacedHelpers} from 'vuex';

  const {mapState, mapGetters} = createNamespacedHelpers('memberInfo');
  export default {
    name: "priceChange",
    data() {
      return {
        title: "商品价格",
        memberInfoList: [],//会员信息
        userId: '',
        currentPage: 1,
        pageSize: 10,
        productList: [],//商品信息
        productPrice: '',//产品价格
        minUnit: '',//小单位
        maxUnit: '',//大单位
        priceUnit: '',//价格单位
        validDayNum: '',//有效期
        tog: true,
        tog2: false,
        sendVal: false,
        selectUnit: 1,//选中的单位
        productSkuId: '',//产品ID
        selectedProduct: {},
      }
    },

    components: {
      'title-nav': Navigator,
      'cube-pop': Popup
    },
    created() {
      //通过路由传递过来会员信息
      this.memberInfoList = this.$route.query.list;
      this.userId = this.memberInfoList.userId;
      this.getListBizUserProduct();
    },
    methods: {

      getListBizUserProduct() {
        let {currentPage, pageSize, userId} = this;
        http.getListBizUserProduct({currentPage, pageSize, param: userId}).then(data => {
          //1.拿第1页，有数据   列表清空，直接把数据填入，页码加1
          //2.拿第1页。没数据    列表清空，显示暂无数据
          //3.拿非第1页，有数据   列表不清空，直接追加，页码加1
          //4.拿非第1页，没数据   列表不清空，页码不加1
          let list = data.data || []
          let hasData = list.length
          if (currentPage === 1 && hasData) {//1
            this.productList = list
            this.currentPage++
          } else if (currentPage !== 1 && hasData) {//3
            this.productList = this.productList.concat(list)
            this.currentPage++
          } else if (currentPage === 1 && !hasData) {//2
            this.productList = []
          }//4 不做任何处理
        }).catch(e => {
          console.log(e)
        })
      },
      //设置价格接口
      setProductPriceToUser() {

        let bizUserIdSet = [this.userId];
        let {priceUnit, productPrice, productSkuId, validDayNum} = this;
        productPrice = parseFloat(productPrice)
        validDayNum = parseFloat(validDayNum)
        http.setProductPriceToUser({
          param: {
            bizUserIdSet,
            priceUnit,
            productPrice,
            productSkuId,
            validDayNum
          }
        }).then(data => {
          this.getListBizUserProduct();
          this.$toast({message: '修改成功'})
        }).catch(e => {
          console.log(e)
        })
      },
      //显示中间弹框
      show(productId, maxUnit, minUnit) {
        this.minUnit = minUnit;
        this.maxUnit = maxUnit;
        //默认选择的单位是小单位
        this.priceUnit = this.minUnit;
        this.productSkuId = productId;
        this.$refs.productChange.show();
      },
      //关闭中间弹框
      closePop() {
        this.$refs.productChange.hide();
      },
      //切换单位
      handleChangeUnit(unit) {
        this.selectUnit = unit;
        this.priceUnit = unit === 1 ? this.minUnit : this.maxUnit;
      },
      //点击保存
      saveHandle() {
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
            this.setProductPriceToUser();
            this.$refs.productChange.hide();
            this.currentPage = 1;
            this.productPrice = '';
            this.validDayNum = '';
          }
          })
      }
    },

  }
</script>

<style lang="stylus" scoped>
  .box-title {
    width 100%;
    height 1.6rem;
    background-color white;
    display flex;
    flex-direction column;
    justify-content space-between;
    align-items flex-start;
    padding 0.32rem;
    .box-title-line1 {
      width 100%;
      font-size 0.43rem;
      display flex;
      flex-direction row;
      justify-content space-between;
    }

  }

  .list-product-wrap {
    display flex;
    flex-direction column;
    align-items stretch;
    margin-top 0.16rem;
  }

  .product-info-wrap {
    height 3rem;
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items stretch;
    padding 0.21rem;
    box-sizing border-box;
    border-bottom 0.01rem solid #EDEDED
  }

  .left {
    height 1.92rem;
    width 1.92rem;
  }

  .middle {
    flex 1;
    display flex;
    flex-direction column;
    justify-content space-around;
    align-items flex-start;
    margin-left 0.21rem;
  }

  .right {
    width 0.97rem;
    position relative;
    i {
      position absolute;
      left 50%;
      top 50%;
      transform translate(-50%, -50%);
    }
  }

  .btn-info {
    display flex;
    justify-content flex-end;
    align-items center
    height 1.27rem;
    background-color white;
    .btnModel {
      display block;
      color #666666;
      font-size 0.37rem;
      height 0.75rem;
      background-color white;
      border 0.01rem solid #666666;
      -webkit-border-radius 0.05rem;
      -moz-border-radius 0.05rem;
      border-radius 0.05rem;
      margin-right 0.32rem;
      padding 0.19rem 0.53rem;
    }
  }

  .warehouse-info-wrap {
    background-color #FAFAFA;
    padding 0.32rem;
    box-sizing border-box;
    padding-bottom 0;
    li {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items center;
      margin-bottom 0.32rem;
    }
  }

  .msgBox {
    width 7.68rem;
    height 4.59rem;
    background-color white;
    border-radius 0.43rem 0.43rem 0rem 0rem;
    input {
      outline 0;
      border: 0;
    }
  }

  .msgbox-header {
    font-size 0.43rem;
    padding 0.43rem 2.9rem 0.43rem 3rem;
  }

  .msgBox-line {
    font-size 0.4rem;
    padding-bottom 0.43rem;
    display flex;
    flex-direction row;
    justify-content: flex-start;
    align-items center;
  }

  .msgBox-footer {
    width 7.68rem;
    height 1.17rem;
    background-color white;
    border-radius: 0rem 0rem 0.43rem 0.43rem;
    display flex;
    flex-direction space-around;
    line-height 1.17rem;

  }

  #days {
    width 3.73rem;
    height 0.75rem;
    border solid rgba(0, 0, 0, 0.2) 0.01rem;

  }

  #price {
    width 3.73rem;
    height 0.75rem;
    border solid rgba(0, 0, 0, 0.2) 0.01rem;
  }

  .btn-cancel {
    width 3.84rem;
    font-size 0.43rem;
    text-align center;
    border-right solid 0.01rem rgba(0, 0, 0, 0.2)
  }

  .btn-sure {
    width 3.84rem;
    font-size 0.43rem;
    text-align center;
  }

  .msg-btn {
    width 1.81rem;
    height 0.75rem;
    font-size 0.37rem;
    border-radius 0.05rem;
    border 0.02rem solid white;
    position relative;
    outline 0;
    border: 0;
  }

  .msg-btn-active {
    border 0.02rem solid #099AFF;
    background-color white;
    color #099AFF;
  }

  .emptyPage {
    flex: 1;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 80vh;
    span {
      font-size: 30px;
      color: #333;
      padding-top: 32px;
    }
  }
</style>
