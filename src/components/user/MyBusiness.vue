<template>
  <div id="myBusiness">
    <title-nav :title="title"></title-nav>
    <p class="info-title">经销商信息</p>
    <div class="info-content">
      <div class="dealer">
        <span>经销商名称</span>
        <p>{{shopDetail.name}}</p>
      </div>
      <div class="city">
        <p>
          <span>所在的城市</span>
          <span>{{shopDetail.city}}</span>
        </p>
        <p>
          <span>开通的城市</span>
          <span>{{shopDetail.city}}</span>
        </p>
      </div>
      <div class="address">
        <span>详细地址</span>
        <p>{{shopDetail.address}}</p>
      </div>
      <div class="concat">
        <p>
          <span>联系人</span>
          <span>{{shopDetail.leadUserName}}</span>
        </p>
        <p>
          <span>联系电话</span>
          <span>{{shopDetail.leadUserMobileNo}}</span>
        </p>
      </div>
    </div>
    <p class="info-title">商贸信息</p>
    <div class="introduce">
      <img :src="shopDetail.remark"/>
      <div>
        <div class="ft-43r color-333">{{shopDetail.shopName}}</div>
        <div class="ft-37r color-666" style="margin-top: .32rem;">{{shopDetail.shopIntroduce}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator"
  import {mapState} from 'vuex'


  export default {
    name: '',
    props: [],
    data() {
      return {
        title: '我的商贸',
      }
    },
    components: {
      'title-nav': Navigator
    },
    methods: {},
    computed: {
      ...mapState(`dealerInfo`, [`shopDetail`])
    },
  }
</script>


<style lang="stylus" scoped>
  #myBusiness {
    background: #f6f6f6;
  }

  .info-title {
    padding: 0.33rem 0.32rem;
    color: #333;
    font-size: 0.4rem;
    text-align left;
  }

  .info-content {
    background: #fff;
    margin: 0 0.21rem;
    padding: 0.32rem 0.37rem;
    text-align left;
    .dealer, .address {
      margin-bottom 0.43rem;
      span {
        color: #999;
        font-size: 0.35rem;

      }
      p {
        color: #333;
        font-size: 0.37rem;
        margin-top: 0.27rem;
      }
    }
    .city {
      margin-bottom: 0.43rem;
    }
    .city, .concat {
      display: flex;
      flex-direction: row;
      align-items center;
      p {
        flex: 1;
        display: flex;
        flex-direction: column;
        span {
          &:nth-child(1) {
            color: #999;
            font-size: 0.35rem;
            padding-bottom: 0.27rem;
          }
          &:nth-child(2) {
            color: #333;
            font-size: 0.37rem;
          }
        }
      }
    }
  }

  .introduce {
    background: #fff;
    margin: 0 0.21rem;
    padding .32rem;
    box-sizing border-box;
    display: flex;
    flex-direction row;
    > img {
      width 1.6rem;
      height 1.6rem;
      margin-right .32rem;
    }
    > div {
      text-align left;
      flex 1;
      display flex;
      flex-direction column;
    }
  }

</style>
