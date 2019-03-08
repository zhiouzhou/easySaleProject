<template>
  <div class="page">
    <div style="flex: 1; position: relative;">
      <img class="main-img" :src="imgList[currentIndex]"/>
      <span class="ft-40r color-fff left-txt" v-if="currentIndex!==0" @click="currentIndex--">上一步</span>
      <span class="ft-40r color-fff right-txt" v-if="currentIndex!==imgList.length-1" @click="currentIndex++">下一步</span>
      <span class="ft-40r color-fff right-txt" v-if="currentIndex===imgList.length-1" @click="onFinish">关闭</span>
    </div>
  </div>
</template>


<script>
  import {mapMutations} from 'vuex'

  export default {
    name: 'GuideDetail',
    props: [],
    data() {
      return {
        detailType: `sale`,//sale,manage,store,delivery_delivery,delivery_self
        currentIndex: 0,
        saleImgList: [
          `../../../static/icons/sale (1).png`,
          `../../../static/icons/sale (2).png`,
          `../../../static/icons/sale (3).png`,
          `../../../static/icons/sale (4).png`,
          `../../../static/icons/sale (5).png`
        ],
        manageImgList: [
          `../../../static/icons/manage (1).png`,
          `../../../static/icons/manage (2).png`,
          `../../../static/icons/manage (3).png`,
          `../../../static/icons/manage (4).png`,
          `../../../static/icons/manage (5).png`
        ],
        storeImgList: [
          `../../../static/icons/store (1).png`,
          `../../../static/icons/store (2).png`,
          `../../../static/icons/store (3).png`,
          `../../../static/icons/store (4).png`,
          `../../../static/icons/store (5).png`
        ],
        deliveryDeliveryImgList: [
          `../../../static/icons/delivery_delivery (1).png`,
          `../../../static/icons/delivery_delivery (2).png`,
          `../../../static/icons/delivery_delivery (3).png`,
          `../../../static/icons/delivery_delivery (4).png`,
          `../../../static/icons/delivery_delivery (5).png`,
          `../../../static/icons/delivery_delivery (6).png`,
          `../../../static/icons/delivery_delivery (7).png`
        ],
        deliverySelfImgList: [
          `../../../static/icons/delivery_self (1).png`,
          `../../../static/icons/delivery_self (2).png`,
          `../../../static/icons/delivery_self (3).png`,
          `../../../static/icons/delivery_self (4).png`,
          `../../../static/icons/delivery_self (5).png`,
          `../../../static/icons/delivery_self (6).png`,
          `../../../static/icons/delivery_self (7).png`
        ],
      }
    },
    mounted() {
      this.detailType = this.$route.params.detailType || `sale`
    },
    components: {},
    methods: {
      onFinish() {
        this.$createDialog({
          type: 'confirm',
          title: `温馨提示`,
          content: '是否为该操作创建快捷方式？',
          confirmBtn: {
            text: '好的，谢谢',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '不了，谢谢',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: () => {
            this.makeShortCut()
            this.$createToast({time: 1000, txt: '添加成功'}).show()
            this.$router.go(-1)
          },
          onCancel: () => {
            this.$router.go(-1)
          }
        }).show()
      },
      makeShortCut() {
        let id = this.detailType === `sale` ? `14` :
          this.detailType === `manage` ? `8` :
            this.detailType === `store` ? `10` :
              this.detailType === `delivery_delivery` ? `11` :
                this.detailType === `delivery_self` ? `12` : ``
        this.toggleSingleShortCut(id)
      },
      ...mapMutations(`homePageShortCuts`, [`toggleSingleShortCut`])
    },
    computed: {
      imgList() {
        return this.detailType === `sale` ? this.saleImgList :
          this.detailType === `manage` ? this.manageImgList :
            this.detailType === `store` ? this.storeImgList :
              this.detailType === `delivery_delivery` ? this.deliveryDeliveryImgList :
                this.detailType === `delivery_self` ? this.deliverySelfImgList : []
      },
    },
  }
</script>


<style lang="stylus" scoped>
  .page {
    width 100%;
    height 100%;
    display flex;
    flex-direction column;
    justify-content center;
    align-items stretch;
    > div {
      .main-img {
        position absolute;
        width 100%;
        height 100%;
        top 0;
        left 0;
      }
      .left-txt {
        position absolute;
        left .32rem;
        top 1.17rem;
      }
      .right-txt {
        position absolute;
        right .32rem;
        top 1.17rem;
      }
      .short-cut {
        position absolute;
        width 4.52rem;
        left 50%;
        transform translateX(-50%)
      }
    }
  }

  .cube-popup-content {
    width 80%;
    border-radius 0.21rem;
    height auto;
  }
</style>
