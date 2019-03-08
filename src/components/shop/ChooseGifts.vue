<template>
  <div id="chooseGifts">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>选择商品</span>
    </div>
    <div class="blank"></div>
    <search-bar @onClickSearch="onSearch"></search-bar>
    <div class="product-content" v-for="item in [1,2]">
      <img src="static/icons/defaul_product.png"/>
      <div>
        <p>52°洋河镇蓝色国珍酒柔雅</p>
        <span>规格：6瓶/件</span>
      </div>
    </div>
  </div>
</template>


<script>
  import SearchBar from "@/components/common/SearchBar"

  export default {
    name: '',
    props: [],
    data() {
      return {
        title: ''
      }
    },
    components: {
      'search-bar': SearchBar,
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      onSearch() {

      }
    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  #chooseGifts {
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
      padding-left: 3rem;
      color: #fff;
      font-size: 0.48rem;
    }
  }

  .blank {
    height: 1.17rem;
  }

  .product-content {
    background: #fff;
    padding: 0.32rem;
    display: flex;
    margin-top: 0.16rem;
    img {
      width: 1.92rem;
      height: 1.92rem;
      padding-right: 0.21rem;
    }
    div {
      color: #333;
      font-size: 0.4rem;
      text-align left;
      display: flex;
      flex-direction column;
      justify-content: space-between;
      span {
        color: #666;
        font-size: 0.35rem;
      }
    }

  }
</style>
