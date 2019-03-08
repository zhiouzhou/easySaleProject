<template>
  <div class="loadingMask">
    <div class="wrap">
      <div class="outer">
        <img src="./icon-spin-s.png" alt="">
      </div>
      <img src="./loading-logo.png" alt="">
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: "loading",
    data() {
      return {};
    },
    props: {
      loadingText: {
        type: String,
        default: "加载中..."
      }
    }
  };

</script>
<style lang="stylus" scoped>
  .loadingMask{
    background-color: rgba(255,255,255,0.1);
    z-index: 9999;
    position: fixed;
    height : -webkit-fill-available;
    width : -webkit-fill-available;
  }
  .wrap {
    width: 1.85rem;
    height: 1.85rem;
    position: relative;
    margin: 8rem auto;
    z-index: 999;

    >img {
      width: 1.85rem;
      height: 1.85rem;
    }
  }

  .outer {
    position: absolute;
    width: 1.85rem;
    height: 1.85rem;
    animation: spin 800ms infinite linear;

    img {
      width: 1.85rem;
      height: 1.85rem;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(360deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }

</style>
