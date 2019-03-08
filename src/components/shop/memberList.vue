<template>
  <div class="bigBox">
    <title-nav v-bind:title="title"></title-nav>
    <search-bar @onClickSearch="onClickSearch" searchNoticeText="请输入会员姓名/手机号" v-model="searchWord"></search-bar>
    <div class="scroll-wrap" v-if="memberList&&memberList.length">
      <cube-scroll
        ref="scroll"
        :data="memberList"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @scroll="onScrollHandle"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <div>
          <div v-for="item in memberList "
               :key="item.userId">
            <div class="contect-member">
              <div class="member-info ft-40r" style="justify-content: space-between">
          <span>
            <span>会员姓名：</span>
            <span>{{item.userName}}</span>
          </span>
                <span style="float: right">
            <span>经纪人：</span>
            <span>
                {{item.brokerName}}
            </span>
          </span>
              </div>
              <div class="member-info" style="color:#666666;font-size: 0.4rem">
                <span>联系电话:</span>&nbsp;
                <span>{{item.mobileNo}}</span>
              </div>
              <div class="member-info" style="color:#666666;font-size: 0.4rem">
                <span>店铺名称:</span>&nbsp;
                <span>{{item.companyName}}</span>
              </div>
              <div class="member-info" style="color:rgba(102,102,102,1);font-size: 0.37rem"><i
                class="icon icon-ic_dw_zx"></i>{{item.address}}
              </div>
            </div>
            <div class="btn-info">
              <!--<router-link :to="{path:/priceChange/ + item.id}">-->
              <router-link :to="{name:'priceChange' , query:{list:item}}" class="btnModel" tag="span">一客一价</router-link>
              <router-link :to="{path:/agentChange/ + item.userId}" class="btnModel" tag="span">经纪人变更</router-link>
            </div>
          </div>

        </div>
      </cube-scroll>
    </div>
    <!--空页面-->
    <empty-view v-else></empty-view>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import EmptyView from "@/components/common/EmptyView";
  import searchBar from "@/components/common/SearchBar";
  import http from '@/assets/models/shopAPIs';
  import {Scroll} from 'cube-ui';
  import {mapGetters} from 'vuex'

  export default {
    name: "memberList",
    data() {
      return {
        title: "会员管理",
        currentPage: 1,
        pageSize: 10,
        searchWord: '',//查询关键字
        memberList: [],//会员信息
      }
    },
    components: {
      'title-nav': Navigator,
      'search-bar': searchBar,
      'cube-scroll': Scroll,
      'empty-view':EmptyView,
    },
    created() {
      this.getListBizUser();
    },
    methods: {
      getListBizUser() {
        let {currentPage, pageSize, searchWord} = this;
        http.getListBizUser({currentPage, pageSize, param: searchWord}).then(data => {
          //1.拿第1页，有数据   列表清空，直接把数据填入，页码加1
          //2.拿第1页。没数据    列表清空，显示暂无数据
          //3.拿非第1页，有数据   列表不清空，直接追加，页码加1
          //4.拿非第1页，没数据   列表不清空，页码不加1
          let list = data.data || []
          let hasData = list.length
          if (currentPage === 1 && hasData) {//1
            this.memberList = list
            this.currentPage++
          } else if (currentPage !== 1 && hasData) {//3
            this.memberList = this.memberList.concat(list)
            this.currentPage++
          } else if (currentPage === 1 && !hasData) {//2
            this.memberList = []
          }//4 不做任何处理
        }).catch(e => {
          console.log(e)
        })
      },
      onClickSearch(searchText) {
        this.currentPage = 1;
        this.searchWord = searchText;
        this.getListBizUser();
      },
      onScrollHandle() {
      },
      /*滚动下拉*/
      onPullingDown() {
        console.log('下拉滚动');
        this.currentPage = 1;
        this.getListBizUser();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      //滚动上拉
      onPullingUp() {
        console.log('滚动上拉');
        this.getListBizUser();
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
  body {
    position: relative;
  }

  .bigBox {
    background-color: #F6F6F6;
    display: flex;
    flex-direction column;
    overflow hidden
  }

  .member-info {
    height: 0.4rem;
    line-height: 0.4rem;
    padding: 0.32rem 0.32rem;
    display flex;
    align-items center;
  }

  .contect-member {
    padding: 0.32rem 0;
    height: 3.28rem;
    margin-top: 0.16rem;
    background-color: white;
    border-bottom: 0.01rem #EDEDED solid;
  }

  .btn-info {
    display flex;
    flex-direction row;
    justify-content flex-end;
    padding 0.21rem;
    height 1.17rem;
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
      margin-left 0.27rem;
      display flex;
      align-items center;
      justify-content center;
      padding 0.21rem;
    }
  }

  .scroll-wrap {
    overflow: hidden;
    flex: 1;
  }

</style>
