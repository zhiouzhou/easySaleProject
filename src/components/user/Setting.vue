<template>
  <div id="setting">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>设置</span>
    </div>
    <div class="blank"></div>
    <div class="setting-info">
      <!--<p>-->
        <!--<span>关于我们</span>-->
        <!--<span>V1.0.5</span>-->
      <!--</p>-->
      <p>
        <span>隐藏新手引导</span>
        <img class="img" src="/static/icons/switcher_close.png" v-show="!hideGuide" @click="hideGreenHandGuide(true)"/>
        <img class="img" src="/static/icons/switcher_open.png" v-show="hideGuide" @click="hideGreenHandGuide(false)"/>
      </p>
      <p @click="gotoChangPassword">
        <span>修改密码</span>
        <i class="icon icon-xk_youjiantou_copy"></i>
      </p>
    </div>
    <div class="signOut" @click="safelyLogOut">
      安全退出
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import {mapMutations} from 'vuex'

  export default {
    name: '',
    props: [],
    data() {
      return {
        title: '',
        hideGuide: false
      }
    },
    mounted() {
      this.hideGuide = localStorage.getItem('hideGuide') === `true`
    },
    components: {},
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      gotoChangPassword() {
        this.$router.push({name: `changePassword`})
      },
      safelyLogOut() {
        this.$router.replace({name: `login`, params: {logOut: true}})
      },
      hideGreenHandGuide(boo) {
        localStorage.setItem(`hideGuide`, boo)
        this.hideGuide = boo
      }
    },
    computed: {
      // hideGuide() {
      //   return localStorage.getItem('hideGuide')
      // }
    },
  }
</script>


<style lang="stylus" scoped>
  #setting {
    background: #f6f6f6;
  }

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
      padding-left: 3.77rem;
      color: #fff;
      font-size: 0.48rem;
    }
  }

  .blank {
    height: 1.17rem;
  }

  .setting-info {
    background: #fff;
    p {
      display: flex;
      height 1.25rem;
      flex-direction: row;
      align-items center;
      justify-content space-between;
      padding: 0.44rem 0.32rem;
      font-size: 0.4rem;
      color: #333;
      border-bottom: 1px solid #ededed;
    }
  }

  .signOut {
    background: #0096FF;
    width: 9.36rem;
    height: 1.31rem;
    text-align center;
    line-height 1.31rem;
    color: #fff;
    font-size: 0.45rem;
    margin: 0.96rem 0.32rem;
    -webkit-border-radius: 0.08rem;
    -moz-border-radius: 0.08rem;
    border-radius: 0.08rem;
  }

  .img {
    height .72rem;
    width 1.12rem;
  }
</style>
