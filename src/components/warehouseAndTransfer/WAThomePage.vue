<template>
  <div class="page">
    <div class="title">仓配服务</div>
    <div class="content">
      <div class="left">
        <div class="item" @click="selectView='apply-in-bound'">
          <i class="icon icon-sp_ic_kc_wx" v-show="selectView!=='apply-in-bound'"></i>
          <img src="/static/icons/sp_ic_kc_liang@2x.png" v-show="selectView==='apply-in-bound'"/>
          <span class="ft-35r" :class="selectView==='apply-in-bound'?'color-0096FF':'color-666'">申请入库</span>
          <div :class="selectView==='apply-in-bound'?'select-line':'not-select-line'"></div>
        </div>
        <div class="item" @click="selectView='apply-out-bound'">
          <i :class="['icon',selectView==='apply-out-bound'?'icon-cpfw_ic_sqck_xz':'icon-cpfw_ic_sqck_wx']"></i>
          <span class="ft-35r" :class="selectView==='apply-out-bound'?'color-0096FF':'color-666'">申请出库</span>
          <div :class="selectView==='apply-out-bound'?'select-line':'not-select-line'"></div>
        </div>
        <div class="item" @click="selectView='apply-delivery'">
          <i :class="['icon',selectView==='apply-delivery'?'icon-cpfw_ic_wtps_xz':'icon-cpfw_ic_wtps_wx']"></i>
          <span class="ft-35r" :class="selectView==='apply-delivery'?'color-0096FF':'color-666'">委托配送</span>
          <div :class="selectView==='apply-delivery'?'select-line':'not-select-line'"></div>
        </div>
      </div>
      <div class="right">
        <keep-alive>
          <component :is="selectView"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>


<script>
  import applyInBound from "@/components/warehouseAndTransfer/ApplyInBound";
  import applyOutBound from "@/components/warehouseAndTransfer/ApplyOutBound";
  import applyDelivery from "@/components/warehouseAndTransfer/ApplyDelivery";

  export default {
    name: 'WAThomePage',
    props: [],
    data() {
      return {
        selectView: `apply-in-bound`
      }
    },
    components: {
      'apply-in-bound': applyInBound,
      'apply-out-bound': applyOutBound,
      'apply-delivery': applyDelivery
    },
    methods: {},
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .page {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    background-color #f6f6f6;
  }

  .title {
    width: 100%
    height: 1.17rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    font-size: 0.48rem;
    color: #fff;
    line-height: 1.17rem;
  }

  .content {
    flex 1;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items stretch;
  }

  .left {
    width 2.4rem;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
    background-color #fff;
  }

  .item {
    position relative;
    height 2.48rem;
    width 2.4rem;
    > i {
      position absolute;
      top .43rem;
      left 50%;
      transform translateX(-50%);
    }
    > img {
      position absolute;
      top .43rem;
      left 50%;
      transform translateX(-50%);
      width 1.07rem;
      height 1.07rem;
    }
    > span {
      position absolute;
      top 1.71rem;
      left 50%;
      width 100%;
      transform translateX(-50%);
    }
    .not-select-line {
      position absolute;
      bottom 0;
      left 50%;
      transform translateX(-50%);
      width: 1.33rem;
      height: 2px;
      background: #ededed;
    }
    .select-line {
      position absolute;
      bottom 0;
      left 50%;
      transform translateX(-50%);
      width: 1.33rem;
      height: 0.05rem;
      background: rgba(0, 150, 255, 1);
    }
  }

  .right {
    margin .16rem;
    flex 1;
    background-color #fff;

  }
</style>
