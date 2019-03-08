<template>
  <div style="background-color: #F6F6F6;display: flex;flex-direction: column;overflow: hidden">
    <title-nav v-bind:title="title"></title-nav>
    <div class="scroll-wrap" v-if="agentList&&agentList.length">
      <cube-scroll
        ref="scroll"
        :data="agentList"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @scroll="onScrollHandle"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">

      <div class="list-product-wrap" v-for="item in agentList" :key="item.brokerId" @click="chooseAgent(item.brokerId)">
        <div class="middle">
          <p class="ft-40r color-333333 two-line box">
            <span>经纪人：{{item.name}}</span>
            <span style="text-align: right">{{item.mobileNo}}</span>
          </p>
          <span class="ft-35r color-666" style="clear:both;color:#FA7B43">客户数: {{item.bizUserNum}}</span>
        </div>
      </div>

        <div class="box-block"></div>
      </cube-scroll>
    </div>
    <!--空页面-->
    <empty-view v-else></empty-view>
    <div class="footer">
      <router-link :to="{path:'/addStaff/'+bizUserId}">
        <i class="icon icon-ic_tianjia_bai" style="margin-right:0.1rem;margin-top: 0.3rem"></i>
        <span style="color: white;font-size: 0.45rem;">新增经纪人</span>
      </router-link>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import EmptyView from "@/components/common/EmptyView";
  import {createNamespacedHelpers} from 'vuex';
  import http from '@/assets/models/shopAPIs';
  import {Scroll} from 'cube-ui';
  const {mapState, mapGetters} = createNamespacedHelpers('staffInfo');
  export default {
    name: "agentChange",
    data() {
      return {
        title: "选择经纪人",
        currentPage: 1,
        pageSize: 10,
        brokerId: '',//经纪人ID
        bizUserId: '',
        //fromPage: '0',
        show: true,
        agentList: [], //经纪人列表
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-scroll': Scroll,
      'empty-view':EmptyView,
    },
    created() {
      this.bizUserId = this.$route.params.id;
      //  this.brokerId = this.$route.params.agentId;
      this.getListBroker();
    },
    methods: {
      //更改经纪人
      updateBizUserBroker() {
        let {brokerId, bizUserId} = this;
        http.updateBizUserBroker({param: {brokerId: brokerId, bizUserId: bizUserId}}).then(data => {
          this.$toast({message: '变更经纪人成功'});
          this.$router.replace('/memberList')
        }).catch(e => {
          console.log(e)
        })
      },
      //获取经纪人
      getListBroker() {
        let {currentPage, pageSize, brokerId} = this;
        http.getListBroker({currentPage, pageSize, param: brokerId}).then(data => {
          //1.拿第1页，有数据   列表清空，直接把数据填入，页码加1
          //2.拿第1页。没数据    列表清空，显示暂无数据
          //3.拿非第1页，有数据   列表不清空，直接追加，页码加1
          //4.拿非第1页，没数据   列表不清空，页码不加1
          let list = data.data || []
          let hasData = list.length
          if (currentPage === 1 && hasData) {//1
            this.agentList = list
            this.currentPage++
          } else if (currentPage !== 1 && hasData) {//3
            this.agentList = this.agentList.concat(list)
            this.currentPage++
          } else if (currentPage === 1 && !hasData) {//2
            this.agentList = []
          }//4 不做任何处理
        }).catch(e => {
          this.$toast({message: e})
          console.log(e)
        })
      },
      //选择经纪人
      chooseAgent(agentId) {
        this.brokerId = agentId;
        this.updateBizUserBroker();
      },
      onScrollHandle() {
      },
      /*滚动下拉*/
      onPullingDown() {
        console.log('下拉滚动');
        this.currentPage = 1;
        this.getListBroker();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      //滚动上拉
      onPullingUp() {
        console.log('滚动上拉');
        this.getListBroker();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
    },
    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .list-product-wrap {
    display flex;
    flex-direction column;
    align-items stretch;
    margin-top 0.16rem;
  }

  .box {
    line-height: 0.45rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

  }

  .middle {
    background-color white;
    height 1.73rem;
    flex 1;
    display flex;
    flex-direction column;
    justify-content space-around;
    align-items flex-start;
    padding: 0 0.2rem

  }

  .footer {
    position absolute;
    z-index 9999;
    left 0;
    right 0;
    bottom 0;
    background-color #0096FF;
    height 1.31rem;
    line-height 1.31rem;
  }
  .scroll-wrap {
    overflow: hidden;
    flex: 1;
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
  .box-block{
    width 100%;
    background-color #F6F6F6;
    height 0.8rem;
  }
</style>
