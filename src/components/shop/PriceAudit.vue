<template>
  <div id="priceAudit">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>价格审核</span>
    </div>
    <div class="search-bar-wrap">
      <div class="search-input-wrap">
        <img class="search-icon" src="/static/icons/ic_sousuo@2x.png"/>
        <input v-model="searchWord" class="search-input ft-35r color-333" placeholder="输入客户姓名/手机号/商品/申请单号"/>
      </div>
      <div class="search-button ft-40r color-333" @click="searchList">搜索</div>
    </div>
    <ul class="audit-state">
      <li v-for="item in auditStateList" @click="selectAudit(item.id)">
        <span :style="item.id==auditState?'color:#099AFF':''">{{item.state}}</span>
        <i v-if='item.id==auditState'></i>
      </li>
    </ul>
    <div class="scroll-wrap" v-if="auditList&&auditList.length">
      <cube-scroll
        ref="scroll"
        :data="auditList"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <div class="commodity-info" v-for="item in auditList">
          <div class="apply-info">
            <p>申请单号：{{item.applyNo}}</p>
            <p>申请时间：{{item.applyTime }}</p>
          </div>
          <div class="commo-info" @click="gotoAuditDetail(item.applyNo)">
            <div class="commo-name">
              <span>商品名称：</span>
              <span>{{item.productName}}</span>
            </div>
            <p v-show="auditState==1">商品价格：<span>{{item.sellingPrice}}</span>元/{{item.sellingPriceUnit}}</p>
            <p>客户姓名：{{item.applyUserName}}</p>
            <p>联系电话：{{item.applyUserMobileNo}}<i class="icon icon-ic_dh_copy"
                                                 @click.stop="makePhone(item.applyUserMobileNo)"></i></p>
            <p>地址：{{item.address}}</p>
          </div>
          <div class="audit-button" v-show="auditState==0">
            <div class="button-style" @click="setupSpec('settingSprice',item.applyNo,item.maxUnit,item.minUnit)">设置价格
            </div>
            <div class="button-style" @click="refusalPop('refusal',item.applyNo)">拒绝申请</div>
            <div class="button-style" @click="gotoTransPrice(item.productSkuId)">查看成交价</div>
          </div>
          <div class="reason" v-show="auditState==2">拒绝理由：{{item.refuseReason}}</div>
        </div>
      </cube-scroll>
    </div>
    <!--空页面-->
    <!--<div class="emptyPage" v-show="!auditList||!auditList.length">
      <img src="/static/icons/Group7Copy.png">
      <span>暂无数据</span>
    </div>-->
    <empty-view v-else></empty-view>
    <!--设置价格弹框-->
    <cube-pop position="center" ref="settingSprice">
      <div class="setting">
        <p class="popHeader">设置价格</p>
        <ul class="setting-ul">
          <li><p>商品价格</p><input type="number" v-model="productPrice"/>
            <p>元</p></li>
          <li>
            <p>价格单位</p>
            <span @click="selectUnit(0)" :style="unitState==0?'border:1px solid #ededed;background:#fff':''">
              <i class="icon icon-zjps_ic_xz_24_copy" v-show="unitState==0"></i>
              {{minUnit}}
            </span>
            <span @click="selectUnit(1)" :style="unitState==1?'border:1px solid #ededed;background:#fff':''">
              <i class="icon icon-zjps_ic_xz_24_copy" v-show="unitState==1"></i>
              {{maxUnit}}
            </span>
          </li>
          <li><p>有效期</p><input type="number" v-model="validDayNum "/>
            <p>天</p>
          </li>
        </ul>
        <div class="selectButton">
          <span @click="cancelPop('settingSprice')">取消</span>
          <span @click="enSure('settingSprice')">确定</span>
        </div>
      </div>
    </cube-pop>
    <!--拒绝申请弹框-->
    <cube-pop position="center" ref="refusal">
      <div class="refusal">
        <div class="popHeader">请选择拒绝理由</div>
        <ul class="reason-ul">
          <li v-for="item in refusalList"
              :style="refuseType==item.id?'background:#fff;border:1px solid #ededed;color:#099AFF':''"
              @click="selectReason(item.id)">
            <i class="icon icon-zjps_ic_xz_24_copy" v-show="refuseType==item.id"></i>
            {{item.reason}}
          </li>
          <input type="text" placeholder="请输入" class="refusalText" v-model="refuseReason" v-if="refuseType==2"/>
        </ul>
        <div class="selectButton">
          <span @click="cancelPop('refusal')">取消</span>
          <span @click="enSureReason('refusal')">确定</span>
        </div>
      </div>
    </cube-pop>
  </div>
</template>


<script>
  import SearchBar from '@/components/common/SearchBar'
  import {Popup, Scroll} from 'cube-ui'
  import http from '@/assets/models/shopAPIs'
  import EmptyView from "@/components/common/EmptyView"

  export default {
    name: "price-audit",
    data() {
      return {
        searchWord: '',
        auditStateList: [{id: 0, state: '未处理'}, {id: 1, state: '已同意'}, {id: 2, state: '已拒绝'}],
        auditState: 0,
        unitState: 0,
        refusalList: [{id: 0, reason: '非销售客户'}, {id: 1, reason: '非销售区域'}, {id: 2, reason: '其他'}],//拒绝理由
        refuseType: 0,    //拒绝理由
        auditList: [],
        currentPage: 1,
        pageSize: 8,
        applyNo: '',
        productPrice: null,
        validDayNum: null,
        minUnit: '',
        maxUnit: '',
        refuseReason: '',
      }
    },
    created() {
      this.getPriceAuditList()
    },
    methods: {
      getPriceAuditList() {
        let {currentPage, pageSize, auditState, searchWord} = this
        http.getPriceAuditList({currentPage, pageSize, param: {auditState, searchWord}})
          .then(data => {
            if ((!data.data || !data.data.length) && this.currentPage == 1) {
              this.auditList = [];
            } else if ((!data.data || !data.data.length) && this.currentPage != 1) {
              this.$toast({message: `没有更多数据了`})
            } else if ((data.data || data.data.length) && this.currentPage == 1) {
              this.auditList = data.data
              this.currentPage++
            } else {
              this.auditList = [];
              let oldAuditList = this.auditList;
              let newAuditList = data.data;
              let finalList = oldAuditList.concat(newAuditList)
              this.auditList = finalList;
              ++this.currentPage
            }
          })
          .catch(e => {
            console.log(e)
          })
      },
      goBack() {
        this.$router.go(-1)
      },
      //搜索列表
      searchList() {
        this.currentPage = 1
        this.getPriceAuditList()
      },
      selectAudit(id) {
        this.auditState = id;
        this.currentPage = 1
        this.auditList = [];
        this.getPriceAuditList()
      },
      setupSpec(refId, applyNo, minUnit, maxUnit) {    //设置价格
        this.applyNo = applyNo;
        this.minUnit = minUnit;
        this.maxUnit = maxUnit;
        this.$refs[refId].show();
      },
      cancelPop(refId) {
        this.$refs[refId].hide();
      },
      enSure(refId) {
        let {applyNo, productPrice, validDayNum} = this
        let priceUnit = this.unitState == 0 ? this.minUnit : this.maxUnit
        http.setPrice({param: {applyNo, priceUnit, productPrice, validDayNum}})
          .then(data => {
            this.auditList = this.auditList.filter(item => item.applyNo !== applyNo)
          })
          .catch(error => {
            this.$toast({message: error})
          })
        this.$refs[refId].hide();
      },
      selectUnit(unitId) {
        this.unitState = unitId
      },
      refusalPop(refId, applyNo) {   //拒绝申请
        this.applyNo = applyNo;
        this.$refs[refId].show();
      },
      selectReason(selectId) {
        this.refuseType = selectId
      },
      enSureReason(refId) {    //确定拒绝理由
        let {refuseReason, applyNo, refuseType} = this
        http.refusalApply({param: {refuseReason, applyNo, refuseType}})
          .then(data => {
            this.auditList = this.auditList.filter(item => item.applyNo !== this.applyNo)
          })
          .catch(error => {
            this.$toast({message: error})
          })
        this.$refs[refId].hide();
      },
      gotoTransPrice(skuId) {
        this.$router.push({path: '/transactionPrice', query: {productSkuId: skuId}})
      },
      gotoAuditDetail(applyNo) {
        this.$router.push({path: '/priceAuditDetail', query: {applyNo}})
      },
      makePhone(phoneNumber) {
        let path = `/pages/makeCall/makeCall?phoneNumber=${phoneNumber}`
        window.wx.miniProgram.navigateTo({
          url: path
        })
      },
      onPullingDown() {
        this.currentPage = 1;
        this.getPriceAuditList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        this.getPriceAuditList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
    },
    components: {
      'search-bar': SearchBar,
      'cube-pop': Popup,
      'cube-scroll': Scroll,
      EmptyView,
    },
    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },

    }
  }
</script>

<style scoped lang="stylus">
  #priceAudit {
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .header {
      height: 1.17rem;
      background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
      width: 100%;
      text-align: center;
      line-height: 1.17rem;
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

    .search-bar-wrap {
      background-color #fff;
      width 100%;
      padding 0.16rem 0 0.16rem 0.32rem;
      box-sizing border-box;
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      border-bottom 0.01rem solid rgba(0, 0, 0, 0.1)
    }
    .scroll-wrap {
      overflow hidden;
      flex: 1;
    }
    .search-icon {
      width .36rem;
      height .36rem;
      margin 0 .16rem;
    }
    .search-input-wrap {
      flex 1;
      background-color: rgba(242, 242, 242, 1);
      display flex;
      flex-direction row;
      align-items center;
      justify-content flex-start;
      border-radius: 0.11rem;
    }
    .search-button {
      margin 0 0.43rem;
      font-family: PingFangSC-Regular;
    }

    .search-input {
      background-color: transparent;
      flex 1;
      line-height 0.85rem;
      height 0.85rem;
      text-align left;
      padding 0 0.16rem;
      box-sizing border-box;
      outline: 0;
    }
    .audit-state {
      width: 100%;
      display: flex;
      flex-direction: row;
      background: #fff;
      margin-top: 0.16rem;
      li {
        flex: 1;
        font-size: 0.4rem;
        color: #666;
        position: relative;
        text-align: center;
        padding: 0.39rem 0;
        i {
          display: block;
          width: 0.8rem;
          height: 0.05rem;
          background: rgba(9, 154, 255, 1);
          position: absolute;
          bottom: 0;
          left: 1.27rem;
        }
      }
    }
    .commodity-info {
      padding: 0.32rem 0.32rem 0;
      background: #fff;
      margin-top: 0.16rem;

      .apply-info {
        border-bottom: 1px solid #ededed;
        p {
          padding-bottom: 0.32rem;
          text-align left;
          color: #666;
          font-size: 0.37rem;
        }
      }
      .commo-info {
        border-bottom: 1px solid #ededed;
        .commo-name {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          color: #333;
          font-size: 0.4rem;
          padding: 0.32rem 0;
          span {
            &:nth-child(1) {
              min-width: 2rem;
            }
            &:nth-child(2) {
              text-align: left;
            }
          }
        }
        p {
          font-size: 0.37rem;
          color: #666;
          text-align: left;
          display: flex;
          align-items center;
          padding-bottom: 0.32rem;
          span {
            color: #FA7B43;
          }
          i {
            margin-left: 0.21rem;
          }
        }
      }
      .audit-button {
        padding: 0.21rem 0;
        display: flex;
        flex-direction: row;
        justify-content flex-end;
        .button-style {
          padding: 0.16rem;
          border: 1px solid #666;
          -webkit-border-radius: 0.05rem;
          -moz-border-radius: 0.05rem;
          border-radius: 0.05rem;
          color: #666;
          font-size: 0.37rem;
          margin-left: 0.27rem;
        }
      }
      .reason {
        padding: 0.4rem 0.32rem;
        text-align: left;
        color: #333;
        font-size: 0.37rem;
      }
    }
    .setting, .refusal {
      background: #fff;
      color: #333;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      .popHeader {
        text-align center;
        padding-top: 0.43rem;
        font-size: 0.4rem;
      }
      .setting-ul {
        padding: 0.43rem 1.01rem 0 0;
        border-bottom: 1px solid #ededed;
        li {
          display: flex;
          flex-direction: row;
          align-items center;
          margin-bottom: 0.32rem;
          p {
            &:nth-child(1) {
              font-size: 0.4rem;
              text-align right;
              width: 2.03rem;
              margin-right: 0.32rem;
            }
            &:nth-child(3) {
              font-size: 0.37rem;
            }
          }
          input {
            width: 3.37rem;
            height: 0.75rem;
            border: 1px solid #ededed;
            -webkit-border-radius: 0.05rem;
            -moz-border-radius: 0.05rem;
            border-radius: 0.05rem;
            outline: 0;
            margin-right: 0.21rem;
            font-size: 0.4rem;
          }
          span {
            width: 1.81rem;
            height: 0.75rem;
            background: #f6f6f6;
            -webkit-border-radius: 0.05rem;
            -moz-border-radius: 0.05rem;
            border-radius: 0.05rem;
            line-height: 0.75rem;
            font-size: 0.37rem;
            color: #666;
            margin-right: 0.27rem;
            i {
              padding-left: 0.22rem;
            }
          }
        }
      }
      .selectButton {
        display: flex;
        flex-direction: row;
        font-size: 0.43rem;
        span {
          flex: 1;
          border-right: 1px solid #ededed;
          padding: 0.37rem 0;
          &:nth-child(2) {
            color: #099AFF
            border-right: 0;
          }
        }
      }
    }
    .refusal {
      width: 7.68rem;
      .reason-ul {
        padding: 0.43rem 0.95rem 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content space-between;
        border-bottom: 1px solid #ededed;
        li {
          width: 2.61rem;
          height: 0.75rem;
          background: #f6f6f6;
          -webkit-border-radius: 0.05rem;
          -moz-border-radius: 0.05rem;
          border-radius: 0.05rem;
          font-size: 0.37rem;
          color: #666;
          line-height: 0.75rem;
          margin-bottom: 0.43rem;
        }
        .refusalText {
          width: 100%;
          border: 1px solid #ededed;
          color: #333;
          font-size: 0.37rem;
          margin-bottom: 0.43rem;
          padding: 0.32rem;
          outline: 0;
        }
      }
    }
    .emptyPage {
      flex: 1;
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      span {
        font-size: 30px;
        color: #333;
        padding-top: 32px;
      }
    }
  }
</style>
