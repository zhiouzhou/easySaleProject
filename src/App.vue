<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive>
        <router-view class="page" v-if="$route.meta.keepAlive"/>
      </keep-alive>
    </transition>
    <transition :name="transitionName">
      <router-view class="page" v-if="!$route.meta.keepAlive"/>
    </transition>
    <Loading v-if="showLoading"></Loading>
  </div>
</template>

<script>
 import {mapState} from 'vuex';
  export default {
    name: 'App',
    data() {
      return {
        transitionName: 'slide-left'
      }
    },
    methods: {},
    // watch: {
    //   '$route'(to, from) {
    //     this.transitionName = to.path == '/login' ? 'slide-left' : 'slide-right';
    //   }
    // },
     computed : {
        ...mapState('showLoading',['showLoading'])
      }
  }
</script>

<style>
  /*@media screen and (min-width: 320px) {*/
  /*html, body { font-size: 12px !important; }*/
  /*}*/
  /*@media screen and (min-width: 360px) {*/
  /*html, body { font-size: 13.5px !important; }*/
  /*}*/
  /*@media screen and (min-width: 375px) {*/
  /*html, body { font-size: 14px !important; }*/
  /*}*/
  /*@media screen and (min-width: 414px) {*/
  /*html, body { font-size: 15.5px !important; }*/
  /*}*/
  /*@media screen and (min-width: 720px) {*/
  /*html, body { font-size: 27px !important; }*/
  /*}*/
  /*@media screen and (min-width: 1024px) {*/
  /*html, body { font-size: 38.4px !important; }*/
  /*}*/
  /*@media screen and (min-width: 1080px) {*/
  /*html, body { font-size: 40.5px !important; }*/
  /*}*/
  /*@media screen and (min-width: 1366px) {*/
  /*html, body { font-size: 51px !important; }*/
  /*}*/
  /*@media screen and (min-width: 1440px) {*/
  /*html, body { font-size: 54px !important; }*/
  /*}*/
  /*@media screen and (min-width: 1600px) {*/
  /*html, body { font-size: 60px !important; }*/
  /*}*/
  /*@media screen and (min-width: 1920px) {*/
  /*html, body { font-size: 72px !important; }*/
  /*}*/
  li {
    list-style-type: none;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin-top: 3rem; */
  }

  .slide-left-enter-active {
    transition: all .3s ease;
  }

  .slide-left-leave-active {
    transition: all .3s ease;
  }

  .slide-left-enter,
  .slide-fade-leave-active {
    transform: translateX(100%);
    opacity: 0;
  }

  .slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-right-enter-active {
    transition: all .3s ease;
  }

  .slide-right-leave-active {
    transition: all .3s ease;
  }

  .slide-right-enter,
  .slide-fade-leave-active {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
</style>
