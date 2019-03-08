<template>
  <div id="priceAuditDetail">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>价格审核详情</span>
    </div>
    <div class="blank"></div>
    <!--基本信息-->
    <div class="basic-information">
      <div class="title">
        <span>基本信息</span>
        <span :style="priceAuditInfo.auditState==2?'color:#E53935':''">{{priceAuditInfo.auditState==0?'未处理':priceAuditInfo.auditState==1?'已同意':priceAuditInfo.auditState==2?'已拒绝':''}}</span>
      </div>
      <div class="apply-info">
        <p>申请单号：{{priceAuditInfo.applyNo}}</p>
        <p>申请时间：{{priceAuditInfo.applyTime}}</p>
      </div>
      <div class="shop-info">
        <div class="shop-info-contact">
          <i class="icon icon-ic_dw_zx"></i>
          <div>
            <p>{{priceAuditInfo.applyUserName}} {{priceAuditInfo.applyUserMobileNo}}</p>
            <p>地址：{{priceAuditInfo.address}}</p>
          </div>
        </div>
        <div class="shop-info-shopName">
          <i class="icon icon-jgshxq_ic_dp"></i>
          <div>
            <p>店铺名称 {{priceAuditInfo.companyName}}</p>
            <!--仓库类型-->
            <p>所属仓库：{{priceAuditInfo.warehouseType==0?'易酒批仓库':'经销商仓库'}}</p>
          </div>
        </div>
      </div>
      <div class="remarks">
        <p v-if="priceAuditInfo.auditState==0">备注：{{priceAuditInfo.applyUserRemark}}</p>
        <p v-if="priceAuditInfo.auditState==2">拒绝理由：{{priceAuditInfo.refuseReason}}</p>
      </div>
    </div>
    <!--商品信息-->
    <p class="info-title">商品信息</p>
    <div class="commodity-info">
      <div class="comm-info">
        <img :src="productInfo.imageUrl"/>
        <div style="text-align: left;">
          <div class="ft-40r color-333 two-line" style="line-height: 110%;">{{productInfo.productName}}</div>
          <div class="ft-35r color-666"
               style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center;">
            批价:<span class="color-FA6F31">¥{{productInfo.applyProductPrice}}{{productInfo.applyProductPriceUnit}}</span>
            <span style="margin-left: .36rem;"> 规格：{{productInfo.specName}}</span>
          </div>
        </div>
      </div>
      <div class="info-detailed">
        <span>配送方式：{{productInfo.deliveryMode==0?'易酒批配送':'经销商配送'}}</span>
        <span v-show="priceAuditInfo.auditState==1">剩余天数：{{productInfo.remainingValidDayNum}}</span>
        <span>进货数量：{{productInfo.applyProductNum}}{{productInfo.maxUnit}}</span>
        <span>可销售库存：{{productInfo.sellingInventory}}</span>
      </div>
    </div>
    <div class="blank"></div>
    <div class="audit-button" v-show="priceAuditInfo.auditState==0">
      <div class="button-style" @click="setupSpec('settingSprice')">设置价格</div>
      <div class="button-style" @click="refusalPop('refusal')">拒绝申请</div>
      <div class="button-style" @click="gotoTransPrice(productInfo.productSkuId)">查看成交价</div>
    </div>
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
          <li><p>有效期</p><input type="number" v-model="validDayNum"/>
            <p>天</p></li>
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
              :style="reasonId==item.id?'background:#fff;border:1px solid #ededed;color:#099AFF':''"
              @click="selectReason(item.id)">
            <i class="icon icon-zjps_ic_xz_24_copy" v-show="reasonId==item.id"></i>
            {{item.reason}}
          </li>
          <input type="text" placeholder="请输入" class="refusalText" v-model="refuseReason" v-if="reasonId==2"/>
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
  import {Popup} from 'cube-ui'
  import http from '@/assets/models/shopAPIs'

  export default {

    name: "price-audit-detail",
    data() {
      return {
        unitState: 0,
        refusalList: [{id: 0, reason: '非销售客户'}, {id: 1, reason: '非销售区域'}, {id: 2, reason: '其他'}],//拒绝理由
        reasonId: 0,
        applyNo: '',   //进货申请号
        priceAuditInfo: {},   //价格审核基本信息
        productInfo: {},     //商品信息
        productPrice: null,  //商品价格
        minUnit: '',
        maxUnit: '',
        validDayNum: null,   //有效期
        refuseReason: '',    //拒绝理由
      }
    },
    components: {
      'cube-pop': Popup
    },
    created() {
      this.applyNo = this.$route.query.applyNo
      this.getPriceAuditDetail();
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      getPriceAuditDetail() {
        http.getPriceAuditDetail({param: this.applyNo})
          .then(data => {
            this.priceAuditInfo = data.data
            this.productInfo = data.data.priceAuditProductVO
          })
      },
      gotoTransPrice(skuId) {
        this.$router.push({path: '/transactionPrice', query: {productSkuId: skuId}})
      },
      setupSpec(refId) {    //设置价格
        this.$refs[refId].show();
        this.minUnit = this.productInfo.minUnit;
        this.maxUnit = this.productInfo.maxUnit;
      },
      cancelPop(refId) {
        this.$refs[refId].hide();
      },
      enSure(refId) {
        let {priceAuditInfo, productPrice, validDayNum} = this;
        let applyNo = priceAuditInfo.applyNo;
        let priceUnit = this.unitState == 0 ? this.minUnit : this.maxUnit
        http.setPrice({param: {applyNo, priceUnit, productPrice, validDayNum}})
          .then(data => {
            this.getPriceAuditDetail();
            this.$toast({message: `设置成功`})
          })
          .catch(error => {
            this.$toast({message: error})
          })
        this.$refs[refId].hide();
      },
      selectUnit(unitId) {
        this.unitState = unitId
      },
      refusalPop(refId) {   //拒绝申请
        this.$refs[refId].show();
      },
      selectReason(selectId) {
        this.reasonId = selectId
      },
      enSureReason(refId) {
        let {refuseReason, priceAuditInfo, reasonId} = this
        let applyNo = priceAuditInfo.applyNo;
        http.refusalApply({param: {refuseReason, applyNo, refuseType: reasonId}})
          .then(data => {
            this.getPriceAuditDetail();
            this.$toast({message: `拒绝申请成功`})
          })
          .catch(error => {
            this.$toast({message: error})
          })
        this.$refs[refId].hide();
      },
    }
  }
</script>

<style scoped lang="stylus">
  #priceAuditDetail {
    background #f6f6f6;

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

    .basic-information {
      background: #fff;
      margin-bottom: 0.16rem;

      .title {
        padding: 0.39rem 0.32rem;
        border-bottom: 1px solid #ededed;
        display: flex;
        flex-direction: row;
        justify-content space-between;
        align-items center;

        span {
          &:nth-child(1) {
            color: #333;
            font-size: 0.4rem;
          }

          &:nth-child(2) {
            color: #0096FF;
            font-size: 0.35rem;
          }
        }
      }

      .apply-info {
        text-align: left;
        padding: 0.32rem 0.32rem 0;
        border-bottom: 1px solid #ededed;

        p {
          color: #666;
          font-size: 0.37rem;
          padding-bottom: 0.32rem;
        }
      }

      .shop-info {
        border-bottom: 1px solid #ededed;
        padding: 0.43rem 0.32rem;

        .shop-info-contact, .shop-info-shopName {
          display: flex;
          flex-direction: row;
          justify-content flex-start;

          div {
            padding-left: 0.21rem;

            p {
              text-align left;

              &:nth-child(1) {
                font-size: 0.4rem;
                color: #333;
                padding-bottom: 0.31rem;
              }

              &:nth-child(2) {
                font-size: 0.37rem;
                color: #666;
              }
            }
          }
        }

        .shop-info-contact {
          padding-bottom: 0.53rem;
        }
      }

      .remarks {
        color: #333;
        font-size: 0.37rem;
        padding: 0.4rem 0.32rem 0;
        text-align: left;

        p {
          padding-bottom: 0.32rem;
        }
      }
    }

    .info-title {
      background: #fff;
      padding: 0.39rem 0.32rem;
      color: #333;
      font-size: 0.4rem;
      border-bottom: 1px solid #ededed;
      text-align left;
    }

    .commodity-info {
      background: #fff;
      margin-bottom: 0.19rem;

      .comm-info {
        height 2.56rem;
        border-bottom: 1px solid #ededed;
        padding:.32rem;
        display: flex;
        flex-direction: row;
        align-items: center;

        img {
          width: 1.92rem;
          height: 1.92rem;
          margin-right .16rem;
        }

        > div {
          height 100%;
          display: flex;
          flex-direction: column;
          justify-content space-between;
          align-items: flex-start;
        }
      }

      .info-detailed {
        padding: 0.32rem 0.32rem 0;
        color: #666;
        font-size: 0.35rem;
        text-align left;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        span {
          width: 50%;
          padding-bottom: 0.32rem;
        }
      }
    }

    .audit-button {
      background: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0.28rem 0.32rem;
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
  }
</style>
