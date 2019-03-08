<template>
  <div>
    <mt-header :title="title" class="header-hight">
      <mt-button icon="back" @click="goback" v-show="canBack" slot="left"></mt-button>
    </mt-header>
  </div>
</template>

<script>
  export default {
    name: "navigator",
    props: ['title'],
    mounted() {

    },
    computed: {
      canBack() {
        return window.history.length > 0 && this.$props.title != '登录';
      }
    },
    methods: {
      goback: function () {
        this.$router.go(-1);
      }
    },
    beforeCreate: function () {
      // console.log(this.$router.history);
    }
  }
</script>

<style scoped>
  .header-hight {
    font-weight: bold;
    height: 1.173333rem;
    font-size: 0.448rem;
    line-height: 110%;
    /*防止出现白线*/
    margin-bottom: -0.01rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
  }
</style>
