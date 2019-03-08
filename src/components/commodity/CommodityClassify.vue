<template>
  <div id="classify">
    <title-nav v-bind:title="title"></title-nav>
    <ul class="classify-ul">
      <li v-for="item in categoryList" :key="item.id">
        <p>{{item.commodityName}}</p>
        <router-link :to="{path:'/brandList/' + item.id}" tag="p">管理品牌<i></i></router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';
  const {mapState} = createNamespacedHelpers('manageBrand')
  import Navigator from "@/components/common/Navigator";
    export default {
        name: "commodity-classify",
      data(){
          return{
            transitionName: "slide-left",
            title:'商品分类',

          }
      },
      components:{
          'title-nav':Navigator
      },
      computed:{
        ...mapState(['categoryList'])
      }
    }
</script>

<style scoped lang="stylus">
  #classify{
    background: #fff;
    height:100vh
    .classify-ul{
      height:100%;
      li{
        display: flex;
        flex-direction:row;
        justify-content:space-between;
        padding:0.44rem 0.32rem;
        border-bottom:1px solid rgba(0,0,0,0.1)
        p{
          &:nth-child(1){
            color: #333;
            font-size:0.4rem
          }
          &:nth-child(2){
            color: #999;
            font-size:0.347rem;
            display: flex;
            flex-direction:row;
            align-items center;
            i{
              width:0.48rem;
              height: 0.48rem;
              display: block;
              background-image: url(./../../../static/icons/ic_jt_hui_36@2x.png);
              -webkit-background-size: 0.48rem;
              background-size: 0.48rem;
            }
          }
        }
      }
    }
  }
</style>
