<template>
  <div id="commodityArea">
    <div class="title">商品</div>
    <div class="blank"></div>
    <div class="commodityShow">
      <ul class="sideBar">
        <li @click="handleChangeView('commodity-show')" :style="selectView=='commodity-show'?'background:#f6f6f6':''">
          <i :class="['icon',selectView=='commodity-show'?'icon-sp_ic_sp_xz':'icon-sp_ic_sp_wei']"></i>
          <span :class="['ft-35r',selectView=='commodity-show'?'color-0096FF':'color-666']">商品</span>
          <i :class="selectView=='commodity-show'?'line':'line-gray'"></i>
          <i></i>
        </li>
        <li @click="handleChangeView('stock')" :style="selectView=='stock'?'background:#f6f6f6':''">
          <i :class="['icon',selectView=='stock'?'icon-sp_ic_kc_liang':'icon-sp_ic_kc_wx']"></i>
          <span :class="['ft-35r',selectView=='stock'?'color-0096FF':'color-666']">库存</span>
          <i :class="selectView=='stock'?'line':'line-gray'"></i>
        </li>
        <li @click="handleChangeView('provider')" :style="selectView=='provider'?'background:#f6f6f6':''">
          <i :class="['icon',selectView=='provider'?'icon-sp_ic_gys_xz':'icon-sp_ic_gys_wx']"></i>
          <span :class="['ft-35r',selectView=='provider'?'color-0096FF':'color-666']">供应商</span>
          <i :class="selectView=='provider'?'line':'line-gray'"></i>
        </li>
      </ul>
      <keep-alive>
        <component v-bind:is="selectView" ></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import commodityshow from "@/components/commodity/commodityComponents/CommodityShow"
  import stock from "@/components/commodity/commodityComponents/Stock"
  import provider from "@/components/inventory/Provider"
  import {mapState} from 'vuex'

  export default {
    name: "commodity",
    data() {
      return {
        transitionName: "",
        title: '商品',
        selectView: 'commodity-show',
        color: '##0096FF',
      }
    },
    activated(){
      console.log(this.selectView)
      console.log(this.userInfo)
    },
    components: {
      'title-nav': Navigator,
      'commodity-show': commodityshow,
      stock,
      provider
    },
    watch: {
      selectView: {
        handler: function (id) {
          console.log(id)
        }
      },
    },
    methods: {
      handleChangeView(component) {
        this.selectView = component
      }
    },
    computed:{
      ...mapState(`user`,[`userInfo`])
    },
  }
</script>

<style lang="stylus" scoped>
  li {
    list-style-type: none;
  }

  #commodityArea {
    background: #f6f6f6;
  }

  .title {
    width: 100%
    height: 1.17rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    font-size: 0.48rem;
    color: #fff;
    line-height: 1.17rem;
    position: fixed;
    left: 0;
    top: 0;
  }

  .blank {
    height: 1.17rem;
  }

  .commodityShow {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .sideBar {
    width: 25%;
    background: #fff;
    position: fixed;
    top: auto;
    left: auto;
    height: 100%;

  }

  .sideBar li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.427rem;
    position: relative;
  }

  .sideBar li span {
    padding-top: 0.21rem;
  }

  .line {
    width: 1.333rem;
    height: 0.053rem;
    background: #0096FF;
    margin-top: 0.373rem;
    position: absolute;
    bottom: 0;
    left: 0.53rem;
  }

  .line-gray {
    width: 1.333rem;
    height: 0.02rem;
    background: rgba(0, 0, 0, .1);
    margin-top: 0.373rem;
    position: absolute;
    bottom: 0;
    left: 0.53rem;
  }

  .position-icon {
    position: absolute;
    top: 50%;
    right: -1px;
    width: 0.32rem;
    height: 0.32rem;
    background-image: url(./../../../static/icons/ic_xuanzhong_copy@2x.png);
    -webkit-background-size: 0.32rem;
    background-size: 0.32rem;
    display: block;

  }

  #routerContainer {
    flex: 1;
  }

  /*库存*/
  .stock {
    height: 100%;
    /*background: #fff;*/
    margin: 0.26rem 0.16rem 0 0.16rem;
  }

  /*供應商*/
  .supplier {
    height: 100%;
    margin: 0 0.16rem;
  }


</style>
