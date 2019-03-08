<template>
  <div style="background-color:#f6f6f6;">
    <title-nav :title="title"></title-nav>
    <!--选择商品-->
    <div class="choose-type">
      <div @click="selectProductByScan">
        <span class="ft-40r color-333">扫码选择</span>
        <div class="ft-40r">
          <span class="color-999">去扫码</span>
          <i class="icon icon-ic_jt_hui_36"></i>
        </div>
      </div>
      <div @click="selectProductByList">
        <span class="ft-40r color-333">手动选择</span>
        <div class="ft-40r">
          <span class="color-999">选择商品</span>
          <i class="icon icon-ic_jt_hui_36"></i>
        </div>
      </div>
    </div>
    <!--商品信息-->
    <!--分为两个来源，选择商品和扫码选择，两种产品的数据结构不同-->
    <div class="main-content">
      <div class="line-wrap">
        <span class="ft-40r color-333" style="min-width: 2rem;text-align: left">商品名称</span>
        <span class="ft-40r color-333 one-line" style="line-height: 110%;" v-if="selectedProduct">{{selectedProduct.productName}}</span>
      </div>
      <div class="line-wrap">
        <span class="ft-40r color-333">商品条形码</span>
        <span class="ft-40r color-333" v-if="selectedProduct">{{selectedProduct.barCode}}</span>
      </div>
      <div class="line-wrap">
        <span class="ft-40r color-333">规格</span>
        <span class="ft-40r color-333" v-if="selectedProduct">{{selectedProduct.specName}}</span>
      </div>
      <div class="line-wrap" v-if="!isInBound">
        <span class="ft-40r color-333">当前库存</span>
        <span class="ft-40r color-333" v-if="selectedProduct">
          {{selectedProduct.currentInventory|showStockBySpec(selectedProduct.specName,selectedProduct.packageCount)}}
        </span>
      </div>
      <div class="line-wrap">
        <span class="ft-40r color-333">仓库</span>
        <div class="ft-40r" @click="reChooseWarehouse">
          <span class="color-333" v-if="selectedWarehouse">{{selectedWarehouse.name}}</span>
          <span class="color-999" v-else>选择仓库</span>
        </div>
      </div>
      <div class="line-wrap">
        <span class="ft-40r color-333">数量</span>
        <div class="edit-num-wrap">
          <edit-number editId="bigUnit" :num="bigUnitNum" @on-change="onChangeNum" ref="bigUnitNum"></edit-number>
          <span class="ft-35r color-666" style="margin: 0 0.21rem;"
                v-if="selectedProduct">{{selectedProduct.maxUnit}}</span>
          <span class="ft-35r color-666" style="margin: 0 0.21rem;" v-else>件</span>
          <edit-number editId="smallUnit" :num="smallUnitNum" @on-change="onChangeNum" ref="smallUnitNum"></edit-number>
          <span class="ft-35r color-666" style="margin-left:0.21rem;"
                v-if="selectedProduct">{{selectedProduct.minUnit}}</span>
          <span class="ft-35r color-666" style="margin-left:0.21rem;" v-else>瓶</span>

        </div>
      </div>
    </div>
    <!--底部按钮-->
    <div class="bottom-button" v-if="showHide">
      <div class="button ft-45r color-fff" @click="goToRecord(isInBound)" :style="!selectedProduct?`background:#bdbdbd`:``">{{isInBound?'入库记录':'出库记录'}}</div>
      <div class="button ft-45r color-fff" @click="confirmAndContinue">确认并继续</div>
    </div>
    <!--弹出菜单-->
    <cube-pop position="bottom" ref="chooseMultiProduct">
      <div class="product-dialog">
        <div class="dialog-header ft-43r color-333">
          选择商品
          <i class="icon icon-pop_ic_close" @click="hideChooseProduct"></i>
        </div>
        <ul style="overflow-y: scroll">
          <li class="product-item" v-for="product in productList"
              @click="onChooseMultiProduct(product)">
            <span class="ft-40r color-333">{{product.productName}}</span>
            <i class="icon icon-ic_jt_hui_36"></i>
          </li>
        </ul>
      </div>
    </cube-pop>

    <!--弹出菜单-->
    <cube-pop position="center" ref="errorDialog">
      <div class="warehouse-dialog">
        <div class="warehouse-header ft-43r color-333">
          请先在当前城市下创建自有仓库
        </div>

        <div class="warehouse-footer" @click="onCloseError">确定</div>
      </div>
    </cube-pop>
    <cube-pop position="center" ref="chooseWarehouse">
      <div class="warehouse-dialog">
        <div class="warehouse-header ft-43r color-333">
          选择仓库
        </div>
        <ul style="overflow-y: scroll" v-bind:class="{heightClass:warehouseList.length>6?true:false}">
          <li class="warehouse-item" v-for="warehouse in warehouseList"
              @click="onSelectWarehouse(warehouse.id)">
            <i :class="[`icon`,currentWarehouseId===warehouse.id?`icon-ic_xuanzhong`:`icon-ic_weixuan`]"></i>
            <span class="ft-40r color-333">{{warehouse.name}}</span>
          </li>
        </ul>
        <div class="warehouse-footer" @click="onChooseWarehouse">确定</div>
      </div>
    </cube-pop>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator"
  import EditNumber from "@/components/common/EditNumber"
  import {Popup} from 'cube-ui'
  import {mapState, mapMutations, mapActions} from 'vuex'
  import http from "@/assets/models/productAPIs"

  export default {
    data() {
      return {
        popHeight:7,
        isInBound: true,
        productList: [],
        documentHeight: document.documentElement.clientHeight,  //默认屏幕高度,
        showHide: true, //显示或者隐藏button
      }
    },
    components: {
      'cube-pop': Popup,
      'title-nav': Navigator,
      'edit-number': EditNumber,
    },
    mounted() {
      // window.onresize监听页面高度的变化
      window.onresize = () => {
        return (() => {
          if (this.documentHeight > document.documentElement.clientHeight) {
            this.showHide = false
          } else {
            this.showHide = true
          }
        })()
      }
      this.isInBound = this.$route.params.isInBound == `1`

      this.getWarehouseListByDealer({
        pageNum: 1,
        pageSize: 60,
        cityId: this.cityId,
        city: this.cityName,
        warehouseChooseType: 2
      })
        .then(data => {
          if (!this.warehouseList.length) {
            this.showPop(`errorDialog`)
          } else if (!this.selectedWarehouse)
            this.showPop(`chooseWarehouse`)
        })
        .catch(e => {
          this.$toast({message: e})
        })
      this.$refs.bigUnitNum.updateValue(this.bigUnitNum)
      this.$refs.smallUnitNum.updateValue(this.smallUnitNum)
    },
    beforeRouteUpdate(to, from, next) {
      //扫描条形码返回scanValue
      if (to.query.scanResult) {
        let queryResultCode = to.query.scanResult
        this.queryProductsByCodeFun(queryResultCode)
      }
      next()
    },
    methods: {
      hideChooseProduct() {
        this.hidePop(`chooseMultiProduct`)
        this.changeProduct({products: [], isInBound: this.isInBound})
      },
      onChooseMultiProduct(product) {
        this.hidePop(`chooseMultiProduct`)
        this.changeProduct({products: [product], isInBound: this.isInBound})
      },
      onCloseError() {
        this.$router.go(-1)
      },
      onChangeNum(value, id) {
        this.changeUnitNum({unitId: `${id}Num`, value, isInBound: this.isInBound})
      },
      /**
       * 手动选择商品
       */
      selectProductByList() {
        this.$router.push({
          name: 'chooseProduct',
          params: {
            //: this.isInBound ? ``
            warehouseId : this.isInBound ? '' : this.currentWarehouseId,
            callBackNameSpace: `inOutBoundOrder`, callBackFun: `changeProduct`,
            extraParams: {isInBound: this.isInBound}
          }
        })
      },
      /**
       * 扫码选择商品
       */
      selectProductByScan() {

        let jumpUrl = window.location.href.toString().split(`?`)[0]
        jumpUrl = encodeURIComponent(jumpUrl)
        let path = `/pages/scon/scon?jumpUrl=${jumpUrl}`
        window.wx.miniProgram.navigateTo({
          url: path,
        })
      },
      /**
       * 根据条形码或者箱码获取商品数据
       * @param code
       */
      queryProductsByCodeFun(code) {
        http.queryProductByCode({
          param: {
            code,
            type: this.isInBound ? `3` : `4`,//  type	出入库类型	string	3：出库 4：入库
            warehouseId: this.currentWarehouseId
          }
        })
          .then(data => {
            this.productList = data.data || []
            this.productList.forEach(item => {
              item.productId = item.productSkuId
              item.packageCount = item.specNum || 0
              item.currentInventory = item.inventoryMinUnitCount || 0
              return item
            })
            let resultListLen = this.productList.length
            //扫出来一个商品直接填入
            if (resultListLen === 1) {
              this.changeProduct({products: this.productList, isInBound: this.isInBound})
            } else if (resultListLen > 1) {
              //扫出来多个商品需要选择
              this.showPop(`chooseMultiProduct`)
            } else {
              this.$toast({message: `没有查到此产品`})
            }
          })
      },
      onSelectWarehouse(warehouseId) {
        this.setCurrentWarehouseId({id: warehouseId})
      },
      onChooseWarehouse() {
        let warehouse = this.warehouseList.find(item => item.id === this.currentWarehouseId)
        this.changeWarehouse({warehouse, isInBound: this.isInBound})
        this.hidePop(`chooseWarehouse`)
      },
      reChooseWarehouse() {
        this.cleanOrder({isInBound: this.isInBound})
        this.showPop(`chooseWarehouse`)
      },
      goToRecord(isInBound) {
        if(!this.selectedProduct){
          return
        }
        // console.log(this.selectedProduct)
        this.$router.push({path: `/stockDetail/${this.selectedWarehouse.id}`, query: {product:this.selectedProduct}})
      },
      confirmAndContinue() {
        if (!this.isFromValid()) return
        let params = {
          // 当前库存和条形码先不传 2018.11.07 by wubowen
          // currentInventory: this.selectedProduct.currentInventory,
          // productBarCode: this.selectedProduct.barCode,
          packageCount: this.bigUnitNum,
          productSpecificationId: this.selectedProduct.productInfoSpecId,
          productSkuId: this.selectedProduct.productId,
          shopName: this.shopName,
          unitCount: this.smallUnitNum,
          warehouseId: this.selectedWarehouse.id,
          warehouseName: this.selectedWarehouse.name,
        }
        this.addInOutBoundOrder({params, isInBound: this.isInBound})
          .then(() => {
            this.$toast({message: this.isInBound ? `新增入库单成功` : `新增出库单成功`})
            this.cleanOrderExceptWarehouse({isInBound: this.isInBound})
            this.$refs.bigUnitNum.updateValue(0)
            this.$refs.smallUnitNum.updateValue(0)
          })
          .catch(e =>
            this.$toast({message: e})
          )
      },
      isFromValid() {
        let bigNum = this.bigUnitNum || 0
        let smallNum = this.smallUnitNum || 0
        let errList = []
        if (!this.selectedProduct) {
          errList.push({errMsg: `请选择产品`})
        }
        if (!this.selectedWarehouse) {
          errList.push({errMsg: `请选择仓库`})
        }
        if (bigNum === 0 && smallNum === 0) {
          errList.push({errMsg: `请选择数量`})
        }
        if (!this.isInBound && ((bigNum * this.selectedProduct.packageCount + smallNum) > this.selectedProduct.currentInventory)) {
          errList.push({errMsg: `出库库存大于实际库存`})
        }
        if (errList.length !== 0) {
          this.$toast({message: errList[0].errMsg})
        }
        return errList.length === 0
      },
      showPop(refId) {
        this.$refs[refId].show()
      },
      hidePop(refId) {
        this.$refs[refId].hide()
      },
      ...mapMutations(`cityAndWarehouse`, [`setCurrentWarehouseId`]),
      ...mapMutations(`inOutBoundOrder`, [`changeUnitNum`, `changeProduct`, `changeWarehouse`, `cleanOrder`, `cleanOrderExceptWarehouse`]),
      ...mapActions(`cityAndWarehouse`, [`getWarehouseListByDealer`]),
      ...mapActions(`inOutBoundOrder`, [`addInOutBoundOrder`])
    },
    computed: {
      cityId() {
        if (this.currentCity) {
          return this.currentCity.id
        }
      },
      cityName() {
        if (this.currentCity) {
          return this.currentCity.name
        }
      },
      title() {
        return this.isInBound ? `入库` : `出库`
      },
      selectedProduct() {
        if (this.inOrder && this.outOrder)
          return this.isInBound ? this.inOrder.product : this.outOrder.product;
      },
      selectedWarehouse() {
        if (this.inOrder && this.outOrder)
          return this.isInBound ? this.inOrder.warehouse : this.outOrder.warehouse;
      },
      bigUnitNum() {
        if (this.inOrder && this.outOrder)
          return this.isInBound ? this.inOrder.bigUnitNum : this.outOrder.bigUnitNum;
      },
      smallUnitNum() {
        if (this.inOrder && this.outOrder)
          return this.isInBound ? this.inOrder.smallUnitNum : this.outOrder.smallUnitNum;
      },
      ...mapState(`dealerInfo`, [`userId`, `shopName`]),
      ...mapState(`currentCity`, [`currentCity`]),
      ...mapState(`cityAndWarehouse`, [`warehouseList`, `currentWarehouseId`]),
      ...mapState(`inOutBoundOrder`, [`inOrder`, `outOrder`]),
    }
  }
</script>


<style lang="stylus" scoped>
  .choose-type {
    display flex;
    flex-direction column;
    align-items stretch;
    box-sizing border-box;
    margin-bottom 0.27rem;
    background-color #fff;
    > div {
      height: 1.28rem;
      display flex;
      flex-direction row;
      padding 0 0.32rem;
      box-sizing border-box;
      justify-content space-between;
      align-items center;
      border-bottom 1px solid #ededed;
    }
  }
.heightClass{
  height 6rem
}
  .main-content {
    display flex;
    flex-direction column;
    align-items stretch;
    padding 0 0.32rem;
    box-sizing border-box;
    background-color #fff;
  }

  .line-wrap {
    height: 1.28rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    border-bottom 1px solid #ededed;
  }

  .edit-num-wrap {
    display flex;
    flex-direction row;
    align-items center;
  }

  .product-dialog {
    height: 10rem;
    width 100%;
    display flex;
    flex-direction column;
    align-items stretch;
    background-color #fff;
  }

  .dialog-header {
    position relative
    height 1.07rem;
    text-align center;
    line-height 1.07rem;
    border-bottom 1px solid #ededed;
    i {
      position absolute;
      right: 0.4rem;
      top: 50%;
      transform translateY(-50%);
    }
  }

  .product-item {
    width 100%;
    height 1.28rem;
    display flex;
    flex-direction: row;
    justify-content space-between;
    align-items center;
    padding 0 0.32rem;
    box-sizing border-box;
    border-bottom 1px solid #ededed;
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

  .warehouse-item {
    display flex;
    flex-direction row;
    justify-content flex-start;
    align-items center;
    padding-left .64rem;
    margin-bottom .53rem;
    > span {
      margin-left .32rem;
    }
  }

  .warehouse-footer {
    border-top .01rem solid #ededed;
    height: 1.17rem;
    text-align center;
    line-height 1.17rem;
    font-size 0.43rem;
    color #0096FF;
  }

  .bottom-button {
    position: fixed;
    bottom 0;
    width 100%;
    height 1.31rem;
    display flex;
    flex-direction: row;
    justify-content space-between;
    align-items stretch;
    .button:first-child {
      border-right .01rem solid #ededed;
    }
  }

  .button {
    width: 50%;
    background: rgba(0, 150, 255, 1);
    text-align center;
    line-height 1.31rem;
  }

</style>
