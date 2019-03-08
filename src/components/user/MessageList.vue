<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <div class="scroll-wrap" v-if="messageList&&messageList.length">
      <cube-scroll
        ref="scroll"
        :data="messageList"
        :options="scrollOptions"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <ul>
          <li class="message-item"
              v-for="item in messageList"
              @click="onClickItem(item)">
            <div class="content-wrap">
              <div :class="['ft-40r','color-333',item.state===0?'bold':'']" style="margin-bottom: .32rem;">
                <span class="bold" v-if="item.noticeType===1">订单编号：</span>
                {{item.title}}
              </div>
              <div class="ft-37r color-666 two-line" style="line-height: 110%;">{{item.content}}</div>
            </div>
            <div class="bottom-bar">
              <span class="ft-35r color-999"
                    v-if="item.createTimeStamp">{{item.createTimeStamp|messageTimeStamp}}</span>
              <span class="ft-35r color-999" v-if="item.createDate">{{item.createDate|messageTimeStamp}}</span>
              <span class="ft-37r color-999">立即查看</span>
              <i class="icon icon-ic_jt_hui_36"></i>
            </div>
          </li>
        </ul>
      </cube-scroll>
    </div>
    <empty-view img="/static/icons/message_empty.png" txt="暂时没有新消息哦~" v-else></empty-view>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import EmptyView from "@/components/common/EmptyView"
  import {Scroll} from 'cube-ui'
  import http from "@/assets/models/myAPIs"
  import {mapState,mapMutations} from 'vuex'

  export default {
    name: 'MessageList',
    props: [],
    data() {
      return {
        // noticeType: 0,
        messageList: [],
        currentPage: 1,
        pageSize: 20
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-scroll': Scroll,
      EmptyView
    },
    mounted() {
      // this.noticeType = parseInt(this.$route.query.noticeType)
      this.getMessageList()
    },
    methods: {
      getMessageList() {
        let {currentPage, pageSize, noticeType} = this

        return Promise.resolve()
          .then(() => {
            if (noticeType === 6) {
              return http.getStockNoticeList({currentPage, pageSize, param: noticeType})
            } else {
              return http.getMessageList({currentPage, pageSize, param: noticeType})
            }
          })
          .then(data => {
            let dataList = data.data || []
            if (currentPage === 1) {
              this.messageList = dataList
            } else if (dataList.length) {
              this.messageList.concat(dataList)
            } else {
              this.currentPage--
            }
            this.$refs.scroll && this.$refs.scroll.forceUpdate()
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      onPullingDown() {
        this.currentPage = 1
        this.getMessageList()
      },
      onPullingUp() {
        ++this.currentPage
        this.getMessageList()
      },
      onClickItem(message) {
        // 消息类型（库存预警=0，会员订单=1，价格审核=2，商品上下架=3，采购通知=4,备货通知=6）
        if (message.state === 0) {
          http.readMessage({
            param: {
              noticeId: message.noticeId, noticeType: message.noticeType
            }
          }).catch(e => {
            console.log(e)
          })
        }
        if (this.noticeType === 1) {
          this.$router.push({name: 'orderDetail', query: {orderId: message.skipBusinessId}})
        } else if (this.noticeType === 2) {
          this.$router.push({name: 'priceAuditDetail', query: {applyNo: message.skipBusinessId}})
        } else if (this.noticeType === 3) {
          this.$router.push({name: 'shopCommodityDetail', query: {productSkuId: message.skipBusinessId}})
        } else if (this.noticeType === 6) {
          this.$router.push({name: 'batchInfo', params: {id: message.skipBusinessId}});
        }
      }
    },
    computed: {
      // 消息类型（库存预警=0，会员订单=1，价格审核=2，商品上下架=3，采购通知=4，新增产品审核拒绝=5,备货通知=6）
      title() {
        return this.noticeType === 0 ? `库存预警` :
          this.noticeType === 1 ? `会员订单` :
            this.noticeType === 2 ? `价格审核` :
              this.noticeType === 3 ? `商品上下架` :
                this.noticeType === 6 ? `备货通知` : ``
      },
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
      ...mapState(`myMessageNotice`,[`noticeType`])
    },
    watch: {
      $route(to, from) {
        from.meta.keepAlive = to.name === `orderDetail`||to.name === `priceAuditDetail`||to.name === `shopCommodityDetail`||to.name === `batchInfo`
      }
    },
  }
</script>


<style lang="stylus" scoped>
  .page {
    background-color #f6f6f6;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
  }

  .scroll-wrap {
    flex 1;
    overflow-y hidden;
  }

  .message-item {
    background-color #fff;
    margin-top .16rem;
    text-align left;
  }

  .content-wrap {
    padding .32rem .32rem;
    box-sizing border-box;
    border-bottom .01rem solid #ededed;
  }

  .bottom-bar {
    height 1.17rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    padding 0 .32rem;
    > span:first-child {
      flex 1;
    }
  }

  .empty-img {
    width 3rem;
    height 3rem;
    margin 1rem auto;
  }
</style>
