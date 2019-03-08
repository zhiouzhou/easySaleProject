<template>
    <div style="background-color: #F6F6F6">
      <title-nav v-bind:title="title"></title-nav>
      <div style="background-color: white;margin-top: 0.16rem">
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label" for="staffname" ><span style="color: red">*</span>员工姓名</label></div>
          <div class="weui-cell__bd"><input type="text" id="staffname" name="staffname"   v-validate="'required'" class="weui-input" placeholder="请输入" ref="staffname" /> </div>
        </div>
        <div class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label" for="telephone" ><span style="color: red">*</span>联系方式</label></div>
          <div class="weui-cell__bd"><input type="text" id="telephone" name="telephone"  class="weui-input" v-validate="'required'" placeholder="请输入" ref="telephone" /> </div>
        </div>
      </div>
      <div class="footer" @click="handleSave">
        <span style="color: white;font-size: 0.45rem" >保存</span>
      </div>
    </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import { createNamespacedHelpers } from 'vuex';
  const {mapState, mapGetters} = createNamespacedHelpers('memberInfo');
    export default {
        name: "addRole",
      data(){
          return{
            title:"新增员工",

          }
      },
      methods:{
        handleSave(){}
      },
      components: {
        'title-nav' : Navigator,
      },
    }
</script>

<style lang="stylus" scoped>
 .weui-cell{
   height 1.28rem
   font-size 0.4rem
   border-bottom #EDEDED solid 0.01rem;
 }
 .footer{
   position absolute;
   left 0;
   right 0;
   bottom 0;
   background-color #0096FF;
   height 80px;
   line-height 80px;
 }

 .weui-label{
   width 2.13rem;
 }
</style>
