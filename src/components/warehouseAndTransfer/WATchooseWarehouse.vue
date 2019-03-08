<template>
  <div class="page">
    <title-nav :title="title"></title-nav>

    <!--下拉菜单-->
    <drop-menu :menuData="dropMenuData" :edgeMargin="2.3033"
               @on-select-menu="onSelectMenuItem"
               ref="dropMenu"
               v-if="dropMenuData&&dropMenuData.length">
    </drop-menu>


    <div class="scroll-wrap">
      <cube-scroll ref="scroll"
                   :data="warehouseList"
                   :options="scrollOptions">
        <div class="list-item" v-for="warehouse in warehouseList" @click="onSelectWarehouse(warehouse)">
          <i
            :class="['icon',currentWarehouse&&warehouse.warehouseId===currentWarehouse.warehouseId?'icon-ic_xuanzhong':'icon-ic_weixuan']"></i>
          <div class="warehouse-info ft-37r color-666">
            <div>
              <span class="ft-43r color-333">{{warehouse.warehouseName}}</span>
              <!--<span class="tag">仓</span>-->
              <!--<span class="tag">配</span>-->
            </div>
            <div>
              <span class="two-line" style="line-height: 110%;">地址：{{warehouse.detailAddress}}</span>
            </div>
            <!--<div>-->
            <!--<span>服务商：{{warehouse.facilitatorName}}</span>-->
            <!--</div>-->
            <!--<div>-->
            <!--<div v-if="warehouse.trusteeshipFee">托管费:-->
            <!--<span class="color-FA6F31">¥{{warehouse.trusteeshipFee|fixedTwo}}</span>/{{warehouse.unit}}-->
            <!--</div>-->
            <!--<div v-if="warehouse.distributionFee">配送费:-->
            <!--<span class="color-FA6F31">¥{{warehouse.distributionFee|fixedTwo}}</span>/{{warehouse.unit}}-->
            <!--</div>-->
            <!--</div>-->
          </div>
        </div>
      </cube-scroll>
    </div>
    <div style="height: 1.31rem;"></div>
    <div class="button ft-45r color-fff" @click="onConfirm">下一步</div>
    <cube-pop position="center" ref="errorDialog">
      <div class="warehouse-dialog">
        <div class="warehouse-header ft-43r color-333">
          该区域暂无可用托管仓库
        </div>
        <div class="warehouse-footer" @click="onCloseError">确定</div>
      </div>
    </cube-pop>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import DropMenu from "@/components/common/DropMenu"
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import {Scroll, Popup} from 'cube-ui'

  export default {
    name: 'WATchooseWarehouse',
    props: [],
    data() {
      return {
        title: '选择仓库',
        pageType: ``,
      }
    },
    components: {
      'title-nav': Navigator,
      DropMenu,
      'cube-scroll': Scroll,
      'cube-pop': Popup,
    },
    mounted() {
      this.pageType = this.$route.params.type
      this.getFacilitatorWarehouseList({param: this.pageType === `applyDelivery` ? `1` : this.pageType === `outBound` ? `3` : this.pageType === `inBound` ? `4` : `1`})
        .then(() => {
          if (!this.warehouseList.length) {
            this.$refs.errorDialog.show()
          }
        })
        .catch(e => {
          this.$toast({message: e})
        })
    },
    methods: {
      onCloseError() {
        this.$router.go(-1)
      },
      onConfirm() {
        if (!this.currentWarehouse) return this.$toast({message: `请选择仓库`})
        this.$router.replace({path: `/WATchooseProduct/${this.$route.params.type}`})
      },
      onSelectMenuItem(keyWord, menuId) {
        if (keyWord === `facilitator`) {
          this.setCurrentFacilitatorId({id: menuId})
        }
      },
      onSelectWarehouse(warehouse) {
        this.setWarehouse({type: this.pageType, warehouse})
      },
      ...mapMutations(`WATorder`, [`setWarehouse`, `setCurrentFacilitatorId`, `setCurrentWarehouseId`]),
      ...mapActions(`WATorder`, [`getFacilitatorWarehouseList`])
    },
    computed: {
      dropMenuData() {
        if (!this.facilitatorList || !this.facilitatorList.length) {
          return ``
        }
        let facilitatorList = this.facilitatorList.map(item => {
          item.menuId = item.facilitatorId
          item.menuName = item.facilitatorName
          return item
        })
        let facilitatorMenu = {keyWord: `facilitator`, facilitatorList}

        return [facilitatorMenu]
      },
      scrollOptions() {
        let options = this.$store.state.scrollOptions.defaultOptions
        options.pullUpLoad = false
        options.pullDownRefresh = false
        return options
      },
      currentWarehouse() {
        return this.pageType === `inBound` ? this.inBound.warehouse :
          this.pageType === `outBound` ? this.outBound.warehouse :
            this.pageType === `applyDelivery` ? this.applyDelivery.warehouse : null
      },
      ...mapState(`WATorder`, [`facilitatorWarehouseList`, `currentFacilitatorId`, `facilitatorList`, `inBound`, `outBound`, `applyDelivery`]),
      ...mapGetters(`WATorder`, [`warehouseList`]),
      ...mapState(`dealerInfo`, [`userId`]),
    },
  }
</script>


<style lang="stylus" scoped>
  .page {
    display flex;
    flex-direction column;
    align-items stretch;
    justify-content flex-start;
  }

  .title {
    width: 100%;
    height: 1.17rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    line-height: 1.17rem;
  }

  .menu-wrap {
    background-color #fff;
    height 1.12rem;
    width 100%;
    display flex;
    flex-direction row;
    justify-content: space-between;
    align-items center;
    border-bottom 2px solid rgba(0, 0, 0, 0.1);
    > div {
      width 50%;
      height 100%;
      display flex;
      flex-direction: row;
      justify-content center;
      align-items center;
    }
    div:nth-of-type(2) {
      width 0.03rem;
      height 0.53rem;
      background-color rgba(0, 0, 0, 0.1);
    }

  }

  .city-menu-wrap {
    background-color #fff;
    max-height 60%;
    overflow-y scroll;
    padding 0 0.32rem;
    box-sizing border-box;
  }

  .city-item-wrap {
    height 1.17rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

  .scroll-wrap {
    flex 1;
    overflow hidden;
  }

  .list-item {
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content flex-start;
    align-items center;
    padding .43rem .32rem;
    border-bottom 2px solid #ededed;
  }

  .warehouse-info {
    flex 1;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items flex-start;
    margin-left .32rem;
    > div {
      display flex;
      flex-direction row;
      justify-content flex-start;
      align-items center;
      text-align left;
      margin-bottom .32rem;
    }
    > div:last-child {
      width 100%;
      margin-bottom 0;
      display: flex;
      flex-direction row;
      justify-content flex-start;
      align-items center;
      > div {
        flex 1;
      }
    }
  }

  .tag {
    width: .43rem;
    height: .43rem;
    background: rgba(250, 111, 49, 0.1);
    border-radius: .21rem;
    border: 1px solid rgba(250, 111, 49, 1);
    font-size: .32rem;
    color: rgba(250, 111, 49, 1);
    line-height: .43rem;
    text-align center;
    margin-left .27rem;
  }

  .button {
    position: fixed;
    bottom 0;
    width 100%;
    height 1.31rem;
    line-height 1.31rem;
    background: rgba(0, 150, 255, 1);
    text-align center;
  }

  .warehouse-dialog {
    background-color #fff;
    width 7.68rem;
    border-radius .43rem;
    padding-top .43rem;
    > ul {
      border-bottom .01rem solid #ededed;
    }
  }

  .warehouse-header {
    text-align center;
    margin-bottom .43rem;
  }

  .warehouse-footer {
    border-top .01rem solid #ededed;
    height: 1.17rem;
    text-align center;
    line-height 1.17rem;
    font-size 0.43rem;
    color #0096FF;
  }

</style>
