<template>
  <div>
    <div id="homeContainer">
      <transition :name="transitionName">
        <keep-alive>
          <router-view class="page"/>
        </keep-alive>
      </transition>
    </div>
    <mt-tabbar v-model="selected" fixed v-bind:value="selected" ref="footerbar">
      <mt-tab-item id="home">
        <i class="icon icon-sy_ic_sy_wei1" slot="icon" :class="{isSelected : selected === 'home'}"></i>
        首页
      </mt-tab-item>
      <mt-tab-item id="product">
        <i class="icon icon-sy_ic_sp_wei" slot="icon" :class="{isSelected : selected === 'product'}"></i>
        商品
      </mt-tab-item>
      <mt-tab-item id="store">
        <i class="icon icon-sy_ic_dp_wei" slot="icon" :class="{isSelected : selected === 'store'}"></i>
        店铺
      </mt-tab-item>
      <mt-tab-item id="cp">
        <i class="icon icon-sy_ic_cp_wei" slot="icon" :class="{isSelected : selected === 'cp'}"></i>
        仓配
      </mt-tab-item>
      <mt-tab-item id="me">
        <i class="icon icon-sy_ic_wd_wei" slot="icon" :class="{isSelected : selected === 'me'}"></i>
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        transitionName: "slide-left",
        selected: "home",
        routeMap: {
          "product": "/commodity/commodityShow",
          "home": "/homePage",
          "store": "/shop",
          "cp": "/WAThomePage",
          "me": "/user"
        }
      }
    },
    watch: {
      // selected: {
      //   handler: function (id) {
      //     console.log('watch',id);
      //     this.$router.push({'path': this.routeMap[id]});
      //   }
      // }
      selected:function (id) {
        console.log('watch',id);
           this.$router.push({'path': this.routeMap[id]});
      }
    },
    activated(){
      if (this.$route.params && this.$route.params.selectedView) {
        this.selected = this.$route.params.selectedView
      }
    },
    beforeRouteUpdate(to, from, next) {
      let path = to.path;
      let _this = this;
      for (let key in this.routeMap) {
        if (_this.routeMap[key] === path) {
          _this.selected = key;
          break;
        }
      }
      if (path === '/') {
        this.selected = 'home'
      }
      next();
    }

  }
</script>

<style scoped>
  #homeContainer {
    height: auto;
    margin-top: -0.8rem;
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
</style>
