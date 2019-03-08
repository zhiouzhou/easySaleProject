<template>
  <div class="page-wrap">
    <title-nav :title="title"></title-nav>
    <search-bar @onClickSearch='seachOrder' searchNoticeText="输入订单号/会员电话号码" :searchTexts='seachText'></search-bar>
    <div class="tab-wrap">
      <div class="tab-item" @click="getOrderList(0,flag={type:`state`})">
        <span :class="['tab-text','ft-40r',orderState==0?'color-0096FF':'color-333']">全部</span>
        <div class="tab-line" v-if="orderState==0"></div>
      </div>
      <div class="tab-item" @click="getOrderList(4,flag={type:`state`})">
        <span :class="['tab-text','ft-40r',orderState==4?'color-0096FF':'color-333']">待审核</span>
        <div class="tab-line" v-if="orderState==4"></div>
      </div>
      <div class="tab-item" @click="getOrderList(1,flag={type:`state`})">
        <span :class="['tab-text','ft-40r',orderState==1?'color-0096FF':'color-333']">待发货</span>
        <div class="tab-line" v-if="orderState==1"></div>
      </div>
      <div class="tab-item" @click="getOrderList(2,flag={type:`state`})">
        <span :class="['tab-text','ft-40r',orderState==2?'color-0096FF':'color-333']">配送中</span>
        <div class="tab-line" v-if="orderState==2"></div>
      </div>
      <div class="tab-item" @click="getOrderList(3,flag={type:`state`})">
        <span :class="['tab-text','ft-40r',orderState==3?'color-0096FF':'color-333']">已完成</span>
        <div class="tab-line" v-if="orderState==3"></div>
      </div>
    </div>
    <div class="time-tab-wrap">
      <div :class="timeState==0?'active-item':'not-active-item'" @click="getOrderList(0,flag={type:`time`})">
        <i class="icon icon-zjps_ic_xz_24_copy" v-if="timeState==0"></i>
        <span>今日</span>
      </div>
      <div :class="timeState==1?'active-item':'not-active-item'" @click="getOrderList(1,flag={type:`time`})">
        <i class="icon icon-zjps_ic_xz_24_copy" v-if="timeState==1"></i>
        <span>近一周</span>
      </div>
      <div :class="timeState==2?'active-item':'not-active-item'" @click="getOrderList(2,flag={type:`time`})">
        <i class="icon icon-zjps_ic_xz_24_copy" v-if="timeState==2"></i>
        <span>近三十天</span>
      </div>
      <div :class="timeState==3?'active-item':'not-active-item'" @click="getOrderList(3,flag={type:`time`})">
        <i class="icon icon-zjps_ic_xz_24_copy" v-if="timeState==3"></i>
        <span>所有</span>
      </div>
    </div>
    <div class="scroll-wrap" v-if="orderList&&orderList.length">
      <cube-scroll
        ref="scroll"
        :data="orderList"
        :options="scrollOptions"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <li v-for="item in orderList" class="order-item" @click="goToOrderDetail(item.orderId)">
          <div class="order-title">
            <div class="title-line">
              <span class="ft-40r color-333">订单编号：{{item.orderNo}}</span>
              <span class="ft-35r color-099AFF">{{item.deliveryMode|deliveryModeTxt}}</span>
            </div>
            <div class="title-line" style="margin-top: 0.21rem;">
              <span class="ft-35r color-999">下单时间：{{item.orderCreateTime}}</span>
              <span class="ft-35r color-099AFF">{{item.orderState|orderStateTxt}}</span>
            </div>
          </div>
          <div class="order-content">
            <span class="ft-37r color-666">收货人：{{item.userName}}</span>
            <div>
              <span class="ft-37r color-666">联系电话：{{item.mobileNo}}</span>
              <i class="icon icon-ic_dh_copy" style="margin-left: 0.16rem;" @click.stop="makePhone(item.mobileNo)"></i>
            </div>
            <span class="ft-37r color-666">订单金额：<span class="ft-37r color-FA6F31">¥ {{item.orderAmount|fixedTwo}}</span></span>
            <span class="ft-37r color-666">支付方式：{{item.payType|payTypeTxt}}</span>
          </div>
          <div class="order-button">
            <div class="button-grey" @click.stop="" v-clipboard:copy="item.orderNo"
                 v-clipboard:success="onCopy">复制订单
            </div>
            <div class="button-grey" v-if="item.orderState==6&&deliveryState==1" @click.stop="completeOrder(item.orderId)">完成</div>
            <div class="button-blue" @click.stop="onAudit(item.orderId)" v-if="item.needAudit">订单审核</div>
          </div>
        </li>
      </cube-scroll>
    </div>
    <!--空页面-->
    <div class="emptyPage" v-else>
      <img src="/static/icons/Group7Copy.png">
      <span>暂无数据</span>
    </div>
    <div style="height: 1.31rem;"></div>
    <div class="bottom-tab">
      <div @click="getOrderList(0,flag={type:`delivery`})">
        <i class="icon icon-sy_ic_cp_wei" :class="{isSelected:deliveryState==0}"></i>
        <span :class="deliveryState==0?'color-0096FF':'color-666'">易久批配送</span>
      </div>
      <div></div>
      <div @click="getOrderList(1,flag={type:`delivery`})">
        <i :class="['icon', deliveryState==1?'icon-dp_ic_zjps_wei_copy':'icon-dp_ic_zjps_wei']"></i>
        <span :class="deliveryState==1?'color-0096FF':'color-666'">自己配送</span>
      </div>
    </div>

    <cube-pop maskClosable position="bottom" ref="auditOrder">
      <div class="audit-dialog">
        <div class="dialog-header ft-43r color-333">
          经销商收款审核
          <i class="icon icon-pop_ic_close" @click="hidePop('auditOrder')"></i>
        </div>
        <div class="audit-option" @click="auditParams.adopt=true">
          <i :class="['icon',auditParams.adopt?`icon-ic_xuanzhong`:`icon-ic_weixuan`]"></i>
          <span class="ft-40r color-333" style="margin-left: .32rem;">同意发货</span>
        </div>
        <div class="audit-option" @click="auditParams.adopt=false">
          <i :class="['icon',!auditParams.adopt?`icon-ic_xuanzhong`:`icon-ic_weixuan`]"></i>
          <span class="ft-40r color-333" style="margin-left: .32rem;">拒绝订单</span>
        </div>
        <textarea maxlength="140" v-show="!auditParams.adopt" v-model.trim="auditParams.remark" placeholder="请填写拒绝原因"
                  class="ft-40r color-333 text-area"></textarea>
        <div class="bottom-bar" v-show="showHide" @click.stop="confirmAudit">确定</div>
      </div>
    </cube-pop>

  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import SearchBar from "@/components/common/SearchBar"
  import {Scroll, Popup} from 'cube-ui'
  import http from '@/assets/models/shopAPIs'
  import VueClipboard from 'vue-clipboard2'
  import Vue from 'vue'

  Vue.use(VueClipboard)

  let flag = {};
  export default {
    name: 'orders',
    props: [],
    data() {
      return {
        title: '会员订单',
        orderList: [],
        orderState: 0,
        timeState: 0, //0,今天 1近一周 2近三十天 3所有
        deliveryState: 0, //1 易久批配送 0自己配送
        seachText: '',
        currentPage: 1,
        pageSize: 10,
        totalPage: 1,
        warehouseTypeSet: [0],
        auditParams: {adopt: true, orderId: ``, remark: ``},
        showHide: true
      }
    },
    filters: {
      deliveryModeTxt(value) {
        // deliveryModeSet	配送方式	array<number>	0-易酒批，1-经销商
        return value == 0 ? `易酒批配送` : value == 1 ? `经销商配送` : ``
      },
      orderStateTxt(value) {
        // 已下单(1),已取消(2),审核通过(3),审核不通过(4),待发货(5),已发货(6),已完成(7),配送失败(8),
        // 已入库(9),待结账(10),待支付(11),成团待确认(12),成团失败(13),延迟配送(14),已收定金(15),已作废(16),已收款(17),
        return value == 1 ? `已下单` : value == 2 ? `已取消` :
          value == 3 ? `审核通过` : value == 4 ? `审核不通过` :
            value == 5 ? `待发货` : value == 6 ? `已发货` :
              value == 7 ? `已完成` : value == 8 ? `配送失败` :
                value == 9 ? `已入库` : value == 10 ? `待结账` :
                  value == 11 ? `待支付` : value == 12 ? `成团待确认` :
                    value == 13 ? `成团失败` : value == 14 ? `延迟配送` :
                      value == 15 ? `已收定金` : value == 16 ? `已作废` :
                        value == 17 ? `已收款` : ``
      },
      payTypeTxt(value) {
        // 货到付款(0),微信支付(1),支付宝支付(2),银联支付(3),连连支付(5),易酒贷(6),线下转账(11),经销商收款(12);
        return value == 0 ? `货到付款` : value == 1 ? `微信支付` :
          value == 2 ? `支付宝支付` : value == 3 ? `银联支付` :
            value == 5 ? `连连支付` : value == 6 ? `易酒贷` :
              value == 11 ? `线下转账` : value == 12 ? `经销商收款` : ``
      }
    },
    components: {
      'title-nav': Navigator,
      'search-bar': SearchBar,
      'cube-scroll': Scroll,
      'cube-pop': Popup
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          if (this.documentHeight > document.documentElement.clientHeight) {
            this.showHide = false
          } else {
            this.showHide = true
          }
        })()
      }
      if (this.$route.query && this.$route.query.orderState) {
        this.orderState = this.$route.query.orderState;
      }
      this.getOrderList(0, flag);
    },
    methods: {
      /*完成订单*/
      completeOrder(orderId) {
        http.completeOrder({param: orderId})
          .then(data => {
            this.orderList = this.orderList.filter(item => item.orderId !== orderId)
          })
      },
      onAudit(orderId) {
        this.auditParams = {
          orderId, remark: ``, adopt: true
        }
        this.showPop(`auditOrder`)
      },
      confirmAudit() {
        if (!this.auditParams.adopt && !this.auditParams.remark) {
          return this.$toast({message: `请填写拒绝原因`})
        }
        let params = {
          adopt: this.auditParams.adopt,
          orderId: this.auditParams.orderId,
          rejectReason: this.auditParams.remark
        }
        http.auditOrder({param: params})
          .then(data => {
            this.changeOrderAuditState(params.orderId, params.adopt)
            this.hidePop(`auditOrder`)
            this.$toast({message: `审核成功`})
          })
          .catch(e => {
            this.$toast({message: e})
          })

      },
      changeOrderAuditState(orderId, adopt) {
        let lastOrderState = adopt ? 3 : 4
        let index = this.orderList.findIndex(item => item.orderId === orderId)
        if (index !== -1) {
          //审核完毕直接移除订单
          this.orderList.splice(index, 1)
          // this.orderList[index][`orderState`] = lastOrderState
        }
      },
      showPop(refId) {
        this.$refs[refId].show()
      },
      hidePop(refId) {
        this.$refs[refId].hide()
      },
      // dateRangeType	查询日期范围类型	number	0-今日,1-近一周,2-近三十天,3-所有
      // deliveryModeSet	配送方式	array<number>	0-易酒批，1-经销商
      // orderState	订单状态	number	0-所有，1-待发货，2-配送中，3-已完成，4-待审核
      // searchWord	搜索关键字	string	订单号或是客户手机号
      // warehouseTypeSet	仓库类型	array<number>	0-易酒批仓库，1-经销商仓库
      getOrderList(state, flag) {//state默认为0，flag来判断当前选择的timeState,orderState,deliveryState以及搜索的关键字
        if (flag.type === `time`) {
          this.timeState = state;
          this.currentPage = 1
        } else if (flag.type === `state`) {
          this.orderState = state;
          this.currentPage = 1
        } else if (flag.type === `delivery`) {
          this.deliveryState = state;
          // 配送方式要和仓库类型对应
          // deliveryModeSet	配送方式	array<number>	0-易酒批，1-经销商
          // warehouseTypeSet	仓库类型	array<number>	0-易酒批仓库，1-经销商仓库
          this.warehouseTypeSet = [state]
          this.currentPage = 1
        } else if (flag.type === `search`) {
          this.seachText = state;
          this.currentPage = 1
        }
        let params = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          param: {
            dateRangeType: this.timeState,
            deliveryModeSet: [this.deliveryState],
            orderState: this.orderState,
            searchWord: this.seachText,
            warehouseTypeSet: this.warehouseTypeSet,
          },
        }
        return http.getOrders(params)
          .then(data => {
            let newArr = data.data || []
            this.totalPage = Math.ceil(data.totalCount / this.pageSize)
            if (this.currentPage === 1) {
              this.orderList = newArr
            } else {
              this.orderList = this.orderList.concat(newArr)
            }
            this.seachText = ''
          })
      },
      makePhone(phoneNumber) {
        let path = `/pages/makeCall/makeCall?phoneNumber=${phoneNumber}`
        window.wx.miniProgram.navigateTo({
          url: path
        })
      },
      onCopy(e) {
        this.$toast({message: `复制成功`})
      },
      seachOrder(seachText) {
        this.getOrderList(seachText, flag = {type: `search`});
      },
      goToOrderDetail(id) {
        this.$router.push({name: 'orderDetail', query: {orderId: id}})
      },
      onPullingDown() {
        this.currentPage = 1
        this.getOrderList(0, flag).then(() => this.$refs.scroll && this.$refs.scroll.forceUpdate())
      },
      onPullingUp() {
        if (this.currentPage < this.totalPage) {
          this.currentPage += 1;
          this.getOrderList(0, flag).then(() => this.$refs.scroll && this.$refs.scroll.forceUpdate())
        } else {
          this.$refs.scroll && this.$refs.scroll.forceUpdate()
        }
      },
    },
    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      }
    },
    beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      if (to.name == `orderDetail`) {
        from.meta.keepAlive = true
      } else {
        from.meta.keepAlive = false
      }
      next();
    }
  }
</script>


<style lang="stylus" scoped>
  .audit-dialog {
    height: 10rem;
    width 100%;
    display flex;
    flex-direction column;
    align-items stretch;
    background-color #fff;
  }

  .dialog-header {
    position relative
    height 1.07rem;
    text-align center;
    line-height 1.07rem;
    border-bottom 1px solid #ededed;
    i {
      position absolute;
      right: 0.4rem;
      top: 50%;
      transform translateY(-50%);
    }
  }

  .audit-option {
    display flex;
    flex-direction row;
    justify-content flex-start;
    align-items center;
    height 1.28rem;
    padding 0 .32rem;
    box-sizing border-box;
  }

  .text-area {
    outline none;
    margin .32rem;
    border .02rem solid #ededed;
    padding .21rem;
  }

  .bottom-bar {
    position fixed;
    bottom 0;
    height: 1.31rem;
    background: rgba(0, 150, 255, 1);
    line-height 1.31rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    width 100%;
    font-size .40rem;
    color: #fff;
  }

  .bottom-tab {
    position fixed;
    bottom 0;
    width 100%;
    background-color #fff;
    display flex;
    flex-direction: row;
    align-items center;
    height 1.31rem;
    font-size 0.29rem;
    justify-content space-between;
    border-top 2px solid #ededed;
    div:nth-of-type(2) {
      flex initial
      width 0.04rem;
      height 0.43rem;
      background-color #ededed;
    }
    > div {
      flex 1;
      display flex;
      flex-direction column;
      align-items center;
      justify-content center;

    }
  }

  .page-wrap {
    display: flex;
    flex-direction column;
    align-items stretch;
    justify-content flex-start;
    background-color: #f6f6f6;
    overflow hidden;
  }

  .scroll-wrap {
    flex 1;
    overflow hidden;
  }

  .time-tab-wrap {
    display flex;
    flex-direction row;
    justify-content space-around;
    align-items center;
    background-color #fff;
    height 1.17rem;
    margin-bottom 0.16rem;
  }

  .active-item {
    width 2.13rem;
    height 0.75rem;
    border 1px solid #099AFF;
    background-color #fff;
    box-sizing box-sizing;
    border-radius 0.05rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    font-size 0.35rem;
    text-align center;
    color: #099AFF;
  }

  .not-active-item {
    width 2.13rem;
    height 0.75rem;
    background-color #f5f5f5;
    border-radius 0.05rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    font-size 0.35rem;
    text-align center;
    color: #666;
  }

  .tab-wrap {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    background-color #fff;
    margin-top 0.27rem;
    height 1.17rem;
    border-bottom 1px solid #ededed;
  }

  .tab-item {
    width 20%;
    height 100%;
    position relative;
  }

  .tab-text {
    position: absolute;
    width 100%;
    top: 50%;
    left: 50%;
    transform translate(-50%, -50%);
  }

  .tab-line {
    height 0.05rem;
    width 0.8rem;
    background-color #099AFF;
    position absolute;
    bottom 0;
    left: 50%;
    transform translateX(-50%);
  }

  .order-item {
    background-color #fff;
    margin-bottom 0.16rem;
  }

  .order-title {
    padding 0.32rem;
    box-sizing border-box;
    border-bottom 1px solid #ededed;
  }

  .title-line {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

  .order-content {
    display flex;
    flex-direction column;
    align-items flex-start;
    padding 0.32rem;
    box-sizing border-box;
    border-bottom 1px solid #ededed;
    > div {
      display: flex;
      flex-direction row;
      align-items center;
      margin-bottom 0.27rem;
    }
    > span {
      margin-bottom 0.27rem;
    }
    span:last-child {
      margin-bottom 0;
    }
  }

  .order-button {
    display flex;
    flex-direction row;
    justify-content flex-end;
    align-items center;
    height 1.17rem;
    padding 0 0.32rem;
    box-sizing border-box;
  }

  .button-grey {
    height: 0.75rem;
    border-radius: 0.05rem;
    /*padding 0 0.16rem;*/
    min-width: 1.81rem;
    line-height 0.75rem;
    font-size 0.37rem;
    color: #666;
    border 1px solid #666;
    margin-left 0.27rem;
  }

  .button-blue {
    height 0.75rem;
    border-radius: 0.05rem;
    /*padding 0 0.16rem;*/
    min-width: 1.81rem;
    line-height 0.75rem;
    font-size 0.37rem;
    color: #099AFF;
    border 1px solid #099AFF;
    margin-left 0.27rem;
  }

  .emptyPage {
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
