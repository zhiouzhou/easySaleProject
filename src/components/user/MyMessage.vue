<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <ul>
      <li class="item-wrap"
          v-for="item in messageList"
          v-if="item.noticeType!==0&&item.noticeType!==4"
          @click="goToDetailList(item.noticeType)">
        <div class="img-area">
          <img src="/static/icons/xx_ic_hyddzt@2x.png" v-if="item.noticeType===1"/>
          <img src="/static/icons/xx_ic_jgsh@2x.png" v-else-if="item.noticeType===2"/>
          <img src="/static/icons/xx_ic_spzt@2x.png" v-else-if="item.noticeType===3"/>
          <img src="/static/icons/xx_ic_tz@2x.png" v-else-if="item.noticeType===6"/>
          <div class="tag" v-if="item.unreadCount">{{item.unreadCount|over99Num}}</div>
        </div>
        <div class="content-wrap" v-if="item.lastNotice">
          <div class="title">
            <span class="ft-40r color-333">{{item.columnName}}</span>
            <span class="ft-26 color-999">{{item.lastNotice.createTimeStamp|messageTimeStamp}}</span>
          </div>
          <div class="content ft-35r color-666 one-line" style="line-height: 112%;">{{item.lastNotice.content}}</div>
        </div>
        <div class="content-wrap" v-else>
          <div class="ft-40r color-333">{{item.columnName}}</div>
          <div class="ft-35r color-666" style="margin-top: .21rem;">暂无消息</div>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import http from "@/assets/models/myAPIs"
  import {mapState,mapMutations} from 'vuex'

  export default {
    name: '',
    props: [],
    data() {
      return {
        title: '消息',
        messageList: []
      }
    },
    mounted() {
      http.getSimpleMessage()
        .then(data => {
          this.messageList = data.data || []
        })
        .catch(e => {
          this.$toast({message: e})
        })
    },
    components: {
      'title-nav': Navigator
    },
    methods: {
      goToDetailList(noticeType) {
        this.setNoticeType(noticeType)
        this.$router.push({name: `messageList`, query: {noticeType:this.noticeType}})
      },
      ...mapMutations(`myMessageNotice`,[`setNoticeType`])
    },
    computed:{
      ...mapState(`myMessageNotice`, [`noticeType`])
    }

  }
</script>


<style lang="stylus" scoped>
  .page {
    background-color #f6f6f6;
  }

  .item-wrap {
    display flex;
    flex-direction row;
    justify-content flex-start;
    align-items center;
    padding 0  0.32rem;
    box-sizing border-box;
    background-color #fff;

    .img-area {
      position relative;
      width 1.28rem;
      height 1.28rem;
      margin-right .21rem;
      > img {
        width 1.17rem;
        height 1.17rem;
        position absolute;
        left 50%;
        top 50%;
        transform translate(-50%, -50%);
      }
      .tag {
        position absolute;
        right 0;
        top 0;
        height .43rem;
        min-width .43rem;
        text-align center;
        line-height .43rem;
        padding 0 .08rem;
        border-radius .22rem;
        background-color #e53935;
        color #ffffff;
        font-size .29rem;
      }
    }
    .content-wrap {
      flex 1;
      text-align left;
      padding .43rem 0;
      border-bottom .02rem solid #ededed;
    }
    .title {
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
    }
    .content {
      text-align left;
      margin-top .21rem;
    }
  }
</style>
