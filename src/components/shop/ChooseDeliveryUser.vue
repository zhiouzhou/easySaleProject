<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <ul class="list-wrap">
      <li class="list-item" v-for="deliveryUser in deliveryUserList" @click="chooseDeliveryUser(deliveryUser)">
        <span class="ft-40r color-333">配送员：{{deliveryUser.deliveryUserName}}</span>
        <span class="ft-35r color-333" style="margin-top: .35rem;">联系电话：{{deliveryUser.deliveryUserMobileNo}}</span>
      </li>
    </ul>
    <div style="height:1.31rem"></div>
    <div class="button ft-45r color-fff" @click="addDeliveryUser">
      <i class="icon icon-ic_tianjia_bai" style="margin-right: 0.21rem;"></i>
      新增配送员
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator"
  import http from '@/assets/models/shopAPIs'
  import {mapMutations} from 'vuex'

  export default {
    name: 'ChooseDeliveryUser',
    props: [],
    data() {
      return {
        title: '选择配送员',
        deliveryUserList: []
      }
    },
    components: {
      'title-nav': Navigator
    },
    mounted() {
      return http.getDeliveryUsers({currentPage: 1, pageSize: 60})
        .then(data => {
          this.deliveryUserList = data.data || []
        })
    },
    methods: {
      addDeliveryUser() {
        this.$router.push({name: `addDeliveryUser`})
      },
      chooseDeliveryUser(deliveryUser) {
        this.setDeliveryUser(deliveryUser)
        this.$router.go(-1)
      },
      ...mapMutations(`deliveryUser`, [`setDeliveryUser`])

    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .page {
    background-color #f6f6f6;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
  }

  .list-wrap {
    flex 1;
    overflow-y scroll;
  }

  .list-item {
    background-color #fff;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items flex-start;
    padding .32rem;
    box-sizing border-box;
    margin-top .27rem;
  }

  .button {
    width: 100%;
    height: 1.31rem;
    background: rgba(0, 150, 255, 1);
    line-height 1.31rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    position fixed;
    bottom 0;
  }

</style>
