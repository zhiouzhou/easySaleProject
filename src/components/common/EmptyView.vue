<template>
  <div class="wrap" v-show="!isShowingLoading">
    <img class="img" :src="img"/>
    <span class="ft-37r color-666">{{txt}}</span>
  </div>
</template>


<script>
  import {mapState} from 'vuex'

  export default {
    name: 'EmptyView',
    props: {
      img: {
        type: String,
        default: `/static/icons/Group 7@2x.png`
      },
      txt: {
        type: String,
        default: `暂无相关数据`
      }
    },
    data() {
      return {}
    },
    components: {
      'title-nav': Navigator
    },
    methods: {},
    computed: {
      isShowingLoading() {
        return this.showLoading
      },
      ...mapState(`showLoading`, [`showLoading`])
    },
  }
</script>


<style lang="stylus" scoped>

  .wrap {
    display: flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
    margin-top 4rem;
  }

  .img {
    width 2.4rem;
    height 2.4rem;
    margin-bottom .48rem;
  }

</style>
