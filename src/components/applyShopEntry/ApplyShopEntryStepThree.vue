<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <div class="blue-bg">
      <img class="img-progress" src="/static/icons/txrzxx_jdt_dsb@2x.png"/>
    </div>
    <div class="content-wrap">
      <div class="content-title ft-43r color-099AFF">完成</div>
      <div class="content">
        <i class="icon icon-txrzxx_ic_dsh i-class"></i>
        <span>感谢您选择易经销，我们已收到您的申请信息，请耐心等待审核</span>
      </div>
    </div>
    <div class="button ft-43r color-fff" @click="returnHomePage">返回首页</div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"

  export default {
    name: 'ApplyShopEntryStepThree',
    props: [],
    data() {
      return {
        title: '填写入驻信息'
      }
    },
    components: {
      'title-nav': Navigator
    },
    methods: {
      returnHomePage() {
        this.$router.replace({path: `/homepage`, query: {selectedView: `home`}})
      },
    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .page {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    height 100vh;
    background-color #f6f6f6;
  }

  .blue-bg {
    width: 100%;
    height: 3.25rem;
    background: linear-gradient(270deg, rgba(13, 137, 245, 1) 0%, rgba(73, 178, 242, 1) 100%);
  }

  .img-progress {
    width 9rem;
    height 1.23rem;
    margin .35rem auto .43rem auto;
  }

  .content-wrap {
    margin 0 .32rem;
    flex 1;
    background-color #fff;
    display: flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
    margin-top -.8rem;
  }

  .content-title {
    height .85rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0.05rem 0.11rem 0 rgba(73, 169, 243, 0.2);
    border-radius: 0.59rem;
    text-align center;
    line-height .85rem;
    font-weight 600;
    margin-top -.43rem;
    padding 0 .55rem;
  }

  .content {
    position relative;
    .i-class {
      position absolute;
      left 50%;
      top 2.13rem;
      transform translateX(-50%);
    }
    span {
      position absolute;
      left 50%;
      width 6rem;
      transform translateX(-50%);
      top: 4.96rem;
      font-size: 0.4rem;
      color: #666;
      text-align center;
      line-height 110%;
    }
  }

  .button {
    margin .64rem;
    height: 1.17rem;
    background: rgba(0, 150, 255, 1);
    box-shadow: 0.11rem 0.13rem 0.16rem 0 rgba(0, 150, 255, 0.2);
    border-radius: 0.59rem;
    text-align center;
    line-height 1.17rem;
  }


</style>
