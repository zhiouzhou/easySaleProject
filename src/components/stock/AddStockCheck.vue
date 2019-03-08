<template>
  <div class="page">
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
      <div @click="chooseProduct">
        <span class="ft-40r color-333">手动选择</span>
        <div class="ft-40r">
          <span class="color-999">选择商品</span>
          <i class="icon icon-ic_jt_hui_36"></i>
        </div>
      </div>
    </div>
    <div class="list">
      <edit-num-list-product v-for="product of productList"
                             :key="product.productId"
                             :product="product"
                             :ref="product.productId"
                             @on-change="onProductNumChange"
                             style="margin-bottom: .27rem;"
      >
      </edit-num-list-product>
    </div>
    <div style="height: 1.31rem;"></div>
    <div class="button ft-45r color-fff" @click="finish">确认</div>


    <!--弹出菜单-->
    <cube-pop position="bottom" ref="chooseMultiProduct">
      <div class="product-dialog">
        <div class="dialog-header ft-43r color-333">
          选择商品
          <i class="icon icon-pop_ic_close" @click="hideChooseProduct"></i>
        </div>
        <ul style="overflow-y: scroll;">
          <li class="product-item" v-for="product in tempProducts"
              @click="onChooseMultiProduct(product)">
            <span class="ft-40r color-333">{{product.productName}}</span>
            <i class="icon icon-ic_jt_hui_36"></i>
          </li>
        </ul>
      </div>
    </cube-pop>

    <!--确认盘点-->
    <cube-pop maskClosable position="center" ref="finishCheck">
      <div class="dialog-wrap">
        <div class="content">
          <div class="dialog-title">完成盘点</div>
          <div class="dialog-content">是否按此盘点结果调整商品库存数量</div>
        </div>
        <div class="buttons" @click="$refs[`finishCheck`].hide()">
          <div style="border-right: .02rem solid #ededed;">取消</div>
          <div style="color: #0096ff" @click="confirm">确定</div>
        </div>
      </div>
    </cube-pop>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import EditNumListProduct from "@/components/common/EditNumListProduct"
  import {mapState, mapMutations, mapActions} from 'vuex'
  import http from "@/assets/models/productAPIs"
  import {Popup} from 'cube-ui'

  export default {
    name: 'AddStockCheck',
    props: [],
    data() {
      return {
        title: '商品盘点',
        tempProducts: []
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-pop': Popup,
      EditNumListProduct
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
      showPop(refId) {
        this.$refs[refId].show()
      },
      hidePop(refId) {
        this.$refs[refId].hide()
      },
      hideChooseProduct() {
        this.hidePop(`chooseMultiProduct`)
        this.setProductList({products: []})
      },
      onChooseMultiProduct(product) {
        this.hidePop(`chooseMultiProduct`)
        this.setProductList({products: [product]})
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
            type: `4`,//  type	出入库类型	string	3：出库 4：入库
            warehouseId: this.warehouse.id
          }
        })
          .then(data => {
            this.tempProducts = data.data || []
            this.tempProducts.forEach(item => {
              item.productId = item.productSkuId
              item.packageCount = item.specNum || 0
              item.currentInventory = item.totalUnitCount || 0
              return item
            })
            let resultListLen = this.tempProducts.length
            //扫出来一个商品直接填入
            if (resultListLen === 1) {
              this.setProductList({products: this.tempProducts})
            } else if (resultListLen > 1) {
              //扫出来多个商品需要选择
              this.showPop(`chooseMultiProduct`)
            } else {
              this.$toast({message: `没有查到此产品`})
            }
          })
      },
      chooseProduct() {
        this.$router.push({
          name: `chooseProduct`,
          params: {
            isMulti: true, warehouseId: this.warehouse.id,
            callBackNameSpace: `addStockCheck`, callBackFun: `setProductList`
          }
        })
      },
      //编辑产品列表数量
      onProductNumChange(product, value, editId) {
        let index = this.productList.findIndex(item => item.productId === product.productId)
        this.changeProductNum({index, editId, value})
      },
      isProductsValid() {
        if (!this.productList.length) {
          this.$toast({message: `请选择商品`})
        }
        return this.productList.length
        //盘亏情况可以都输入为0
        // this.productList.every(item =>
        //   (item.bigUnitNum !== undefined && item.bigUnitNum !== null && item.bigUnitNum !== 0) ||
        //   (item.smallUnitNum !== undefined && item.smallUnitNum !== null && item.smallUnitNum !== 0)
        // )
      },
      finish() {
        this.showPop(`finishCheck`)
      },
      confirm() {
        if (!this.isProductsValid()) return null
        let list = this.productList.map(item => {
          console.log(item)
          item.bigUnitNum = item.bigUnitNum || 0
          item.smallUnitNum = item.smallUnitNum || 0
          return {
            currentInventory: item.currentInventory,
            packageCount: item.bigUnitNum,
            productSkuId: item.productId,
            productSpecificationId: item.productInfoSpecId,
            productSkuName: item.productName,
            productSkuSpecName: item.specName,
            theUnitCount: item.packageCount,
            unitCount: item.smallUnitNum,
            theBigUnit: item.maxUnit,
            theSmallUnit: item.minUnit,
          }
        })
        let params = {
          productList: list,
          shopName: this.shopName,
          warehouseId: this.warehouse.id,
          warehouseName: this.warehouse.name
        }
        this.addStockCheck(params)
          .then(() => {
            this.$toast({message: `新增盘点单成功`})
            setTimeout(() => this.$router.go(-1), 1500)
          })
          .catch(e => {
            return this.$toast({message: e})
          })
      },
      ...mapMutations(`addStockCheck`, [`changeProductNum`]),
      ...mapMutations(`addStockCheck`, [`setProductList`]),
      ...mapActions(`addStockCheck`, [`addStockCheck`])
    },
    computed: {
      ...mapState(`dealerInfo`, [`userId`, `shopName`]),
      ...mapState(`addStockCheck`, [`warehouse`, `productList`]),
    },
  }
</script>


<style lang="stylus" scoped>
  .page {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    height 100%;
    width 100%;
    background-color #f6f6f6;
    .list {
      flex 1;
      overflow scroll;
    }
  }

  .dialog-wrap {
    width 7.68rem;
    background-color #fff;
    display flex;
    flex-direction column;
    align-items stretch;
    border-radius .43rem;
    .content {
      padding .43rem;
      box-sizing border-box;
      text-align center;
      border-bottom .02rem solid #ededed;
    }
    .dialog-title {
      font-size .43rem;
    }
    .dialog-content {
      font-size .4rem;
      margin-top .32rem;
    }
    .buttons {
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items center;
      font-size .43rem;
      > div {
        text-align center;
        line-height 1.17rem;
        flex 1;
      }
    }
  }

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

  .button {
    position: fixed;
    bottom 0;
    width 100%;
    height 1.31rem;
    line-height 1.31rem;
    background: rgba(0, 150, 255, 1);
    text-align center;
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
</style>
