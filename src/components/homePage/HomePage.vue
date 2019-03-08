<template>
  <div style="background-color: #fff;">
    <ul class="page">
      <li>
        <div class="homepage-header">
          <div class="location" @click="goToChooseCity">
            <img src="/static/icons/xk_dingwei@2x.png" class="location-icon"/>
            <span class="ft-40r color-fff">{{currentCity.name}}</span>
            <img src="/static/icons/xk_youjiantou@2x.png" style="width: .32rem; height: .32rem;margin-left: .11rem;"/>
          </div>
          <span style="margin-left: -1.8rem;">易经销</span>
          <img class="notice" src="/static/icons/xiaoxitongzhi.png" @click="goToMessage({path:`myMessage`})"/>
          <ul class="homepage-header-tab">
            <li :class="[selectTab===`today`?'on-select-tab-text':'on-not-select-tab-text']"
                @click="onSelectTab('today')">
              今日
              <div class="indicator" v-show="selectTab===`today`"></div>
            </li>
            <li :class="[selectTab===`yesterday`?'on-select-tab-text':'on-not-select-tab-text']"
                @click="onSelectTab('yesterday')">
              昨日
              <div class="indicator" v-show="selectTab===`yesterday`"></div>
            </li>
            <li :class="[selectTab===`week`?'on-select-tab-text':'on-not-select-tab-text']"
                @click="onSelectTab('week')">
              七天
              <div class="indicator" v-show="selectTab===`week`"></div>
            </li>
            <li :class="[selectTab===`month`?'on-select-tab-text':'on-not-select-tab-text']"
                @click="onSelectTab('month')">
              30天
              <div class="indicator" v-show="selectTab===`month`"></div>
            </li>
          </ul>
        </div>
      </li>
      <li style="margin-top: .27rem;">
        <div class="homepage-sale-info">
          <div class="sale-info-item">
            <span class="ft-26 color-999">销售额（元）</span>
            <span class="ft-40 color-FA6F31" style="margin-top: 0.32rem;" v-if="saleMoney!==null">{{saleMoney}}</span>
          </div>
          <div class="divider"></div>
          <div class="sale-info-item">
            <span class="ft-26 color-999">销售量（单）</span>
            <span class="ft-40 color-0096FF" style="margin-top: 0.32rem;" v-if="saleAmount!==null">{{saleAmount}}</span>
          </div>
        </div>
      </li>
      <li>
        <div class="greenhand-guide" v-if="!hideGreenHandGuide">
          <span class="ft-30 color-333 bold">手把手教你如何使用软件</span>
          <div @click="goToGreenhandGuide({path:`greenhandGuide`,params:{pageType: `main`}})">新手向导</div>
        </div>
      </li>
      <li class="list-wrap">
        <short-cut
          v-for="item in subscribeShortCut"
          :item="item"
          :key="item.id"
          :isEntry="true"
        >
        </short-cut>
      </li>
      <li class="add-short-cut">
        <i class="icon icon-ic_tianjia_lan"></i>
        <a class="ft-26 color-0096FF" style="margin-left: 0.16rem;" @click="addQuickEntry({path:`addQuickEntry`})">添加快捷功能</a>
      </li>
    </ul>
    <!--拿不到经销商信息时弹框-->
    <message-dialog :messageDialogVisible="messageDialogVisible" @closeDialog="closeDialog"
                    @ensureDialog="ensureDialog" ref="dialog"></message-dialog>
  </div>
</template>


<script>
  import ShortCut from './ShortCut.vue'
  import http from "@/assets/models/homePageAPIs";
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import MessageDialog from "@/components/common/MessageDialog"

  export default {
    name: "homePage",
    data() {
      return {
        title: "易经销",
        saleInfo: {},
        selectTab: 'today',
        hideGreenHandGuide: false,
        messageDialogVisible: false
      }
    },
    components: {
      'short-cut': ShortCut,
      MessageDialog
    },
    props: [],
    mounted() {
      this.hideGreenHandGuide = localStorage.getItem('hideGuide') === `true`
      this.initShortCutData()
      this.initCurrentCity()
      http.getHomepageUserState()
        .then(data => {
          this.saleInfo = data.data
        })
        .catch(e => {
          console.log(e)
        })
    },
    activated() {
      this.hideGreenHandGuide = localStorage.getItem('hideGuide') === `true`
    },
    methods: {
      onSelectTab(tabName) {
        if (this.userInfo.dealerState == -1 ) {
          // this.$refs[`dialog`].show()
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.selectTab = tabName
        }
        // this.$refs[`dialog`].showPop()
      },
      goToGreenhandGuide(path) {
        this.controlEvent(path)
      },
      goToChooseCity() {
        /*if (this.userInfo.dealerState == -1 ) {
          this.$refs[`dialog`].show()
        } else {
          this.$router.push({name: `cityChoose`})
        }*/
        this.$router.push({name: `cityChoose`})
      },
      goToMessage(path) {
        this.controlEvent(path)
      },
      addQuickEntry(path) {
        this.controlEvent(path)
      },
      //根据dealerState和auditState来判断是弹框还是toast还是跳转到信息页面的方法
      controlEvent(jumpInfo) {
        if (this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: jumpInfo.path, params: jumpInfo.params})
        }
        /*this.$router.push({name: jumpInfo.path,params:jumpInfo.params})*/
      },

      closeDialog(dialogState) {
        this.$refs[`dialog`].hide()
      },
      ensureDialog(dialogState, type) {
        if (this.userInfo.dealerState == -1) {
          this.$router.push({name: `myInformation`, params: {type}})
        } else {
          this.$router.push({name: `applyShopEntryStepTwo`})
        }
        // this.$router.push({name: `myInformation`})
        this.$refs[`dialog`].hide()
      },
      ...mapMutations(`homePageShortCuts`, [`initShortCutData`]),
      ...mapMutations(`currentCity`, [`initCurrentCity`]),
    }
    ,
    computed: {
      saleAmount() {
        return this.saleInfo[`${this.selectTab}OrderNum`] || 0
      }
      ,
      saleMoney() {
        return this.saleInfo[`${this.selectTab}SalesAmount`] || 0
      }
      ,
      ...
        mapGetters(`homePageShortCuts`, [`subscribeShortCut`]),
      ...
        mapState(`currentCity`, [`currentCity`]),
      ...
        mapState(`user`, [`userInfo`]),
      ...mapState(`dealerInfo`, [`shopId`]),
    }
  }
</script>
<style lang="stylus" scoped>
  .page {
    height 100%;
    width 100%;
    display: flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    overflow-y scroll;
  }

  .location {
    float left;
    margin-left .32rem;
    display flex;
    flex-direction row;
    align-items center;
    .location-icon {
      width .48rem;
      height .48rem;
      margin-right .11rem;
    }
  }

  .notice {
    width .64rem;
    height .64rem;
    margin-right .32rem;
    float right;
  }

  .load-more-container {
    height 5rem;
    width 100%;
    background-color #0bb20c;
  }

  .homepage-header {
    padding-top 0.48rem;
    width: 100%;
    height: 3.627rem;
    background: linear-gradient(180deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    > span {
      font-size: 0.48rem;
      color: #fff;
    }
  }

  .homepage-header-tab {
    margin-top .75rem;
    display flex;
    flex-direction: row;
    justify-content space-around;
    align-items flex-start;
  }

  .on-select-tab-text {
    font-size: 0.4rem;
    color: #fff;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
  }

  .on-not-select-tab-text {
    font-size: 0.4rem;
    color: rgba(255, 255, 255, 0.8);
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
  }

  .indicator {
    width: 0.8rem;
    height: 0.053rem;
    background-color #fff;
    margin-top 0.213rem;
  }

  .homepage-sale-info {
    margin 0 auto;
    margin-top -1.2rem;
    width: 9.36rem;
    height: 2.32rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 14px 0px rgba(153, 153, 153, 0.2);
    background-color #fff;
    display: flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

  .divider {
    width: 1px;
    height: 1.28rem;
    background: rgba(0, 0, 0, 0.1);
  }

  .sale-info-item {
    width 49%;
    display: flex;
    flex-direction: column;
  }

  .greenhand-guide {
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    margin 0.64rem 0.32rem 0 0.32rem;
    padding-bottom 0.32rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    > div {
      background-color #fff;
      color: #0096FF;
      width: 1.813rem;
      height: 0.64rem;
      line-height .64rem;
      border-radius: 0.373rem;
      border: 1px solid rgba(0, 150, 255, 1);
    }
  }

  .shortCut-item {
    width: 100%;
    height: 1.36rem;
    background: rgba(255, 255, 255, 1);
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    padding 0 0.32rem;
    box-sizing border-box;
    > img {
      width 0.747rem;
      height: 0.747rem;
      margin-right 0.32rem;
    }
    > span {
      font-size 0.4rem;
      color: #333;
    }
    > div {
      display: flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      flex 1;
      height 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .add-short-cut {
    width: 4.16rem;
    min-height: .96rem;
    border-radius: 0.48rem;
    border: .02rem solid rgba(0, 150, 255, 1);
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    margin .32rem auto 1.5rem auto;
  }

</style>
