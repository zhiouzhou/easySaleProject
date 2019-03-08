<template>
  <div class="page" style="background-color: #fff">
    <title-nav :title="title"></title-nav>
    <div class="list-wrap">
      <div class="quick-entry-title">商品</div>
      <short-cut
        v-for="item in productShortCut"
        :item="item"
        :key="item.id"
        :isEntry="false"
      ></short-cut>
      <div class="quick-entry-title">仓配</div>
      <short-cut
        v-for="item in wareHouseShortCut"
        :item="item"
        :key="item.id"
        :isEntry="false"
      ></short-cut>
      <div class="quick-entry-title">订单</div>
      <short-cut
        v-for="item in ordersShortCut"
        :item="item"
        :key="item.id"
        :isEntry="false"
      ></short-cut>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator";
  import ShortCut from "./ShortCut.vue"
  import {mapGetters} from 'vuex'

  export default {
    name: `addQuickEntry`,
    data() {
      return {
        title: `添加快捷功能`,
      }
    },
    props: [],
    components: {
      'title-nav': Navigator,
      'short-cut': ShortCut
    },
    methods: {
      returnHomePage() {
        this.$router.go(-1)
      }
    },

    computed: {
      ...mapGetters(`homePageShortCuts`,[`productShortCut`,`wareHouseShortCut`,`ordersShortCut`])
    }
  }
</script>


<style lang="stylus" scoped>
  .page {
    width 100%;
    height 100%;
    background-color #fff;
    display flex;
    flex-direction column;
    align-items stretch;
    .list-wrap {
      flex 1;
      overflow-y scroll;
    }
  }

  .quick-entry-title {
    width 100%;
    height 1.04rem;
    padding 0 0.32rem;
    text-align left;
    line-height 1.07rem;
    font-size 0.37rem;
    color: #333;
    background-color rgba(242, 242, 242, 1)
  }

  .buttom-button {
    position fixed;
    bottom 0;
    width: 100%;
    height: 1.31rem;
    background: rgba(0, 150, 255, 1);
    font-size: 0.45rem;
    color: rgba(255, 255, 255, 1);
    line-height: 1.31rem;
  }

</style>
