<template>
  <div class="search-bar-wrap">
    <div class="search-input-wrap">
      <img class="search-icon" src="/static/icons/ic_sousuo@2x.png"/>
      <input v-model="searchText" class="search-input ft-35r color-333" :placeholder="searchNoticeText"/>
    </div>
    <div class="search-button ft-40r color-333" @click="$emit('onClickSearch',searchText)">搜索</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchText: ``
      }
    },
    props: {
      //搜索框提示
      searchNoticeText: {
        type: String,
        default: `搜索商品`
      },
      searchTexts: {
        type: String
      },
    },
    methods: {},
    watch: {
      searchTexts() {
        this.searchText = ''
      }
    }
  }
</script>


<style lang="stylus" scoped>
  .search-bar-wrap {
    background-color #fff;
    width 100%;
    height 1.17rem;
    padding 0.16rem 0 0.16rem 0.32rem;
    box-sizing border-box;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

  .search-input-wrap {
    flex 1;
    height 0.85rem;
    background-color: rgba(242, 242, 242, 1);
    display flex;
    flex-direction row;
    align-items center;
    justify-content flex-start;
    border-radius: 0.11rem;
  }

  .search-icon {
    width .36rem;
    height .36rem;
    margin 0 .16rem;
  }

  .search-button {
    margin 0 0.43rem;
    font-family: PingFangSC-Regular;
  }

  .search-input {
    outline: 0;
    background-color: transparent;
    flex 1;
    text-align left;
    padding 0.25rem 0.16rem;
    box-sizing border-box;
  }
</style>

