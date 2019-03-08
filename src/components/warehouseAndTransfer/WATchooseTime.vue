<template>
  <div>
    <title-nav :title="title"></title-nav>
    <div class="first-line-wrap" v-if="pageType!==`inBound`" @click="onSelectPerson">
      <div>
        <div>
          <span class="ft-40r color-E53935">*</span>
          <span class="ft-40r color-333">{{personTxt}}</span>
        </div>
        <div class="ft-40r color-999">
          <span v-if="!person">请选择</span>
          <i class="icon icon-xk_youjiantou_copy"></i>
        </div>
      </div>
      <div class="person-wrap color-666" v-if="person">
        <div class="ft-40r">
          <span class="color-333"
                v-if="pageType===`applyDelivery`">{{person.contact}}<span>({{person.phone}})</span>
          </span>
          <span class="color-333" v-if="pageType===`outBound`">{{person.consigneerName}}<span>({{person.phone}})</span></span>
        </div>
        <div class="ft-37r two-line" style="margin-top:.32rem;line-height: 110%;">
          <span v-if="pageType===`applyDelivery`">{{person.province||``}}{{person.city||``}}{{person.county||``}}{{person.street||``}}{{person.detailAddress||``}}</span>
          <span v-if="pageType===`outBound`">身份证信息：{{person.idNumber}}</span>
        </div>
      </div>
    </div>
    <div class="line-wrap" v-if="pageType!==`applyDelivery`">
      <div>
        <span class="ft-40r color-E53935">*</span>
        <span class="ft-40r color-333">{{timeTxt}}</span>
      </div>
      <div class="ft-40r color-999" @click="timePicker.show()">
        <span v-if="!time"> 请选择</span>
        <span v-else>{{time}}</span>
        <i class="icon icon-xk_youjiantou_copy"></i>
      </div>
    </div>
    <div class="line-wrap" style="padding:.16rem .32rem;" v-if="this.pageType!=`applyDelivery`">
      <div class="left">
        <span class="ft-40r color-333">{{serviceTxt}}</span>
        <span class="ft-35r color-666" style="margin-top: .21rem;">{{serviceSubTxt}}：<span
          class="color-FA6F31">约¥{{serviceFee|fixedTwo}}</span></span>
      </div>
      <i :class="[`icon`,useService?`icon-ic_kg_kai`:`icon-ic_kg_guan`]" @click="switchService"></i>
    </div>
    <div class="button ft-45r color-fff" @click="onConfirm">下一步</div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import {mapState, mapMutations} from 'vuex'
  import http from '@/assets/models/warehouseAndTransferAPIs';

  export default {
    name: '',
    props: [],
    data() {
      return {
        pageType: ``,
        serviceFee: 0,//页面显示可选的费用
        allFee: {}//所有费用的集合
      }
    },
    components: {
      'title-nav': Navigator
    },
    mounted() {
      this.pageType = this.$route.params.type

      this.timePicker = this.$createTimePicker({
        format: 'yyyy-MM-dd HH:mm',
        minuteStep: 1,
        showNow: false,
        day: {
          len: 300,
          filter: [],
          format: 'M月dd日'
        },
        onSelect: (selectedTime, selectedText, formatedTime) => this.setTime({type: this.pageType, time: formatedTime}),
        onCancel: () => this.setTime({type: this.pageType, time: ``})
      })
    },
    methods: {
      onSelectPerson() {
        this.$router.push({name: `WATchoosePerson`, params: {pageType: this.pageType}})
      },
      getServiceFee() {
        let productItems = []
        this.productList.forEach(item => {
          let num = (item.bigUnitNum || 0) * item.packageCount + (item.smallUnitNum || 0)
          productItems.push({num, productSpecificationId: item.productInfoSpecId})
        })
        return http.getServiceFee(this.pageType, {
          items: productItems,
          warehouseId: this.warehouseId,
          facilitatorId:this.warehouse.facilitatorId
        })
          .then(data => {
            if (this.pageType === `inBound`) {
              //下货费
              this.serviceFee = data.data.shipGoodsAmount || 0
              this.allFee = data.data || {}
            } else if (this.pageType === `outBound`) {
              //装车费
              this.serviceFee = data.data.loadingCharge || 0
              this.allFee = data.data || {}
            } else if (this.pageType === `applyDelivery`) {
              //卸货费
              this.serviceFee = data.data.landingCharge || 0
              this.allFee = data.data || {}
            }
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      switchService() {
        this.setUseService({type: this.pageType, useService: !this.useService})
      },
      onConfirm() {
        //构造参数
        let products = []
        this.productList.forEach(product => {
          products.push({
            brandName: product.brandName,
            businessCity: this.currentCity.name,
            channel: 0,
            packageCount: product.bigUnitNum || 0,
            productBarCode: product.barCode,
            productName: product.productName,
            productSkuId: product.productId,
            productSpecificationId: product.productInfoSpecId,
            source: 0,
            specificationName: product.specName,
            unitCount: product.smallUnitNum || 0,
            warehouseName: this.warehouse ? this.warehouse.warehouseName : ``,
            //文档没写，最好带上
            packagequantity: product.packageCount,
          })
        })
        if (this.checkValid())
          return this.submitOrder(this.warehouse, products, this.person)
            .then(data => {
              this.cleanWATOrderStorage()
              this.$toast({message: `提交成功`})
              setTimeout(() => {
                this.$router.replace({path: `/WATorderDetail/${this.pageType}`, query: {orderNo: data.data}})
              }, 1500)
            })
            .catch(e => {
              this.$toast({message: e})
            })
      },
      //检查参数合法性
      checkValid() {
        let errList = []
        if (this.pageType === `inBound`) {
          if (!this.time) {
            errList.push({errMsg: `请选择送货时间`})
          }
        } else if (this.pageType === `outBound`) {
          if (!this.person) {
            errList.push({errMsg: `请选择提货人`})
          }
          if (!this.time) {
            errList.push({errMsg: `请选择提货时间`})
          }
        } else if (this.pageType === `applyDelivery`) {
          if (!this.person) {
            errList.push({errMsg: `请选择收货人`})
          }
        }
        if (errList.length) {
          this.$toast({message: errList[0].errMsg})
          return false
        } else return true
      },
      //提交订单
      submitOrder(warehouse = {}, products = [], person = {}) {
        if (this.pageType === `inBound`) {
          return this.addInBoundOrder(warehouse, products)
        } else if (this.pageType === `outBound`) {
          return this.addOutBoundOrder(warehouse, products, person)
        } else if (this.pageType === `applyDelivery`) {
          return this.addApplyDeliveryOrder(warehouse, products, person)
        }
      },
      //新增入库单
      addInBoundOrder(warehouse, products) {
        let sortingFee = 0, shipGoodsAmount = 0;
        if (this.useService) {
          sortingFee = this.allFee.sortingfee
          shipGoodsAmount = this.allFee.shipGoodsAmount
        } else {
          sortingFee = this.allFee.sortingfee
          shipGoodsAmount = 0
        }
        let params = {
          cityId: warehouse.cityId,
          city: warehouse.cityName,
          facilitatorName: warehouse.facilitatorName,
          facilitatorId: warehouse.facilitatorId,
          wareHouseId: warehouse.warehouseId,
          wareHouseName: warehouse.warehouseName,
          warehouseAddress: warehouse.detailAddress,
          shopName: this.shopName,
          inStockTime: this.time + `:00`,
          items: products,
          remark: ``,
          sortingFee,
          shipGoodsAmount,
          mobileNo:this.username
        }
        return http.addInBoundOrder(params)
      },
      //新增出库单
      addOutBoundOrder(warehouse, products, person) {
        let params = {
          applyType: 1, items: products,
          cityId: warehouse.cityId, city: warehouse.cityName,
          facilitatorName: warehouse.facilitatorName,
          facilitatorId: warehouse.facilitatorId,
          wareHouseId: warehouse.warehouseId,
          wareHouseName: warehouse.warehouseName,
          warehouseAddress: warehouse.detailAddress,
          shopName: this.shopName,
          //费用
          deliveryFee: this.allFee.deliveryfee || 0,
          depositFee: this.allFee.depositfee || 0,
          landingCharge: this.allFee.landingCharge || 0,
          loadingCharge: this.useService ? this.allFee.loadingCharge : 0,
          pickupTime: this.time + `:00`, remark: ``,
          toUserName: person.consigneerName, toUserMobileNo: person.phone,
          identityCard: person.idNumber,
        }
        return http.addOutBoundAndApplyDeliveryOrder(params)
      },
      //新增委托配送单
      addApplyDeliveryOrder(warehouse, products, person) {
        console.log(warehouse)
        console.log(person)
        let productItems = []
        products.forEach(item => {
          productItems.push({
            maxCount: item.packageCount,
            minCount: item.unitCount,
            productSkuId: item.productSkuId,
          })
        })
        person.name = person.contact
        person.userAddressType = 0
        console.log(person)
        /*let params = {
          applyType: 2, items: products, remark: ``,
          cityId: warehouse.cityId, city: warehouse.cityName,
          facilitatorName: warehouse.facilitatorName,
          facilitatorId: warehouse.facilitatorId,
          wareHouseId: warehouse.warehouseId,
          wareHouseName: warehouse.warehouseName,
          warehouseAddress: warehouse.detailAddress,
          shopName: this.shopName,
          //费用
          deliveryFee: this.allFee.deliveryfee || 0,
          depositFee: this.allFee.depositfee || 0,
          landingCharge: this.useService ? this.allFee.landingCharge : 0,
          loadingCharge: this.allFee.loadingCharge || 0,
          toUserName: person.contact, toUserMobileNo: person.phone,
          toAddress: person.contact, toCityName: person.city,
        }*/
        let param = {
          payType: 1,
          items: productItems,
          userAddress: person,
          warehouseId:warehouse.warehouseId
        }
        return http.addDeliveryOrder({param})
      },
      ...mapMutations(`WATorder`, [`setPerson`, `setTime`, `setUseService`, `cleanWATOrderStorage`])
    },

    computed: {
      title() {
        return this.pageType === `inBound` ? `预计送货时间` :
          this.pageType === `outBound` ? `预计送货时间` :
            this.pageType === `applyDelivery` ? `选择收货人` : ``
      },
      serviceTxt() {
        return this.pageType === `inBound` ? `使用下货服务` :
          this.pageType === `outBound` ? `使用装车服务` :
            this.pageType === `applyDelivery` ? `使用卸货服务` :
              ``
      },
      serviceSubTxt() {
        return this.pageType === `inBound` ? `下货费` :
          this.pageType === `outBound` ? `装车费` :
            this.pageType === `applyDelivery` ? `卸货费` : ``
      },
      personTxt() {
        return this.pageType === `inBound` ? `` :
          this.pageType === `outBound` ? `提货人` :
            this.pageType === `applyDelivery` ? `收货人` : ``
      },
      timeTxt() {
        return this.pageType === `inBound` ? `预计送货时间` :
          this.pageType === `outBound` ? `预计提货时间` :
            this.pageType === `applyDelivery` ? `` : ``
      },
      person() {
        if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].person
      },
      time() {
        if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].time
      },
      useService() {
        if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].useService
      },
      productList() {
        if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].productList
      },
      warehouseId() {
        if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].warehouse.warehouseId
      },
      warehouse() {
        if (this.$store.state.WATorder && this.$store.state.WATorder[`${this.pageType}`])
          return this.$store.state.WATorder[`${this.pageType}`].warehouse
      },
      ...mapState(`dealerInfo`, [`userId`, `shopName`]),
      ...mapState(`user`, [`username` ]),
      ...mapState(`currentCity`, [`currentCity`]),
    },
    watch: {
      //从选择提货人页面回来的时候，productList的计算属性还是null，不能正确计算费用，所以这里用侦听器属性监听
      productList(newList) {
        if (newList && newList.length)
          this.getServiceFee()
      }
    }
  }
</script>


<style lang="stylus" scoped>
  .first-line-wrap {
    padding .32rem;
    box-sizing border-box;
    display flex;
    flex-direction column;
    border-bottom 1px solid #ededed;
    > div:first-child {
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      > div {
        display flex;
        flex-direction row;
        align-items center;
      }
    }
  }

  .line-wrap {
    padding .32rem;
    box-sizing border-box;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    border-bottom 1px solid #ededed;
    > div {
      display flex;
      flex-direction row;
      align-items center;
    }
    .left {
      display flex;
      flex-direction column;
      justify-content space-between;
      align-items flex-start;
    }
  }

  .person-wrap {
    margin-top .32rem;
    padding .32rem;
    box-sizing border-box;
    background-color #f6f6f6;
    display flex;
    flex-direction column;
    text-align left;
    border-radius: 0.05rem;
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


</style>
