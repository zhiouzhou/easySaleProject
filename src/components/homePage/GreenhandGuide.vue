<template>
  <div style="background-color: #f6f6f6;height: 100vh">
    <title-nav :title="title"></title-nav>
    <div class="header-bg"></div>
    <div class="header-info-wrap">
      <div class="header-info-wrap-line1">
        <div class="line-wrap" style="margin-right: .32rem;">
          <div class="line"></div>
          <div class="dot"></div>
        </div>
        <span class="ft-45r color-099AFF bold">{{noticeTxt}}</span>
        <div class="line-wrap" style="margin-left: .32rem;">
          <div class="dot"></div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="content-wrap" v-if="pageType===`main`">
      <div @click="goToDetail(`sale`)">
        <img src="../../../static/icons/hydd_ic_xsz copy@2x.png"/>
        <span>我要卖货</span>
      </div>
      <div @click="goToDetail(`manage`)">
        <img src="../../../static/icons/in_ruku@2x.png"/>
        <span>我要管理</span>
      </div>
      <div @click="goToDetail(`store`)">
        <img src="../../../static/icons/lc_woyaocunhuo@2x.png"/>
        <span>我要存货</span>
      </div>
      <div @click="goToSubMenu">
        <img src="../../../static/icons/cpfw_ic_sqck_wx@2x.png"/>
        <span>我要发货</span>
      </div>
    </div>
    <div class="content-wrap" v-if="pageType===`sub`">
      <div @click="goToDetail(`delivery_self`)">
        <img src="../../../static/icons/hydd_ic_xsz copy@2x.png"/>
        <span>申请出库</span>
      </div>
      <div @click="goToDetail(`delivery_delivery`)">
        <img src="../../../static/icons/in_ruku@2x.png"/>
        <span>委托配送</span>
      </div>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator";

  export default {
    name: 'greenhandGuide',
    data() {
      return {
        title: `新手引导`,
        pageType: ``
      }
    },
    components: {
      'title-nav': Navigator,
    },
    props: [],
    computed: {
      noticeTxt() {
        return this.pageType === `main` ? `希望易经销满足您哪些需要？` : `我要发货引导`
      }
    },
    created() {
      this.pageType = this.$route.params.pageType || `main`
    },
    methods: {
      goToDetail(keyWord) {
        this.$router.push({name: `guideDetail`, params: {detailType: keyWord}})
      },
      goToSubMenu() {
        this.pageType = `sub`
      }
    },
  }
</script>
<style lang="stylus" scoped>
  .content-wrap {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    flex-wrap wrap;
    padding .43rem .32rem 0 .32rem;
    box-sizing border-box;
    > div {
      width: 4.51rem;
      height: 3.28rem;
      background: rgba(255, 255, 255, 1);
      border-radius: 0.11rem;
      margin-bottom .32rem;
      display flex;
      flex-direction column;
      justify-content center;
      align-items center;
      > img {
        width 1.6rem;
        height 1.6rem;
        margin-bottom .44rem;
      }
      > span {
        font-size .4rem;
        color #333;
      }
    }
  }

  .line-wrap {
    flex 1
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
  }

  .line {
    flex 1;
    height .05rem;
    background: rgba(0, 150, 255, 1);
  }

  .dot {
    width: .13rem;
    height: .13rem;
    background: rgba(0, 150, 255, 1);
    border-radius 50%;
  }

  .header-bg {
    width: 100%;
    height: 1.92rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
  }

  .header-info-wrap {
    background-color #fff;
    width: 9.36rem;
    margin 0 auto
    margin-top -1.067rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 14px 0px rgba(153, 153, 153, 0.2);
    display flex;
    flex-direction column;
    align-items stretch;
    padding 0.533rem 0.427rem;
    box-sizing border-box;

  }

  .header-info-wrap-line1 {
    text-align center;
    display flex;
    flex-direction row;
    align-items center;
    justify-content space-between;
  }

</style>
