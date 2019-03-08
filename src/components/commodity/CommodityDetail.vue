<template>
  <div id="commodityDetail">
    <nav-title :title="title"></nav-title>
    <div class="page-wrap">
      <div class="commodity-show">
        <img :src="productInfo.imageUrl||`/static/icons/defaul_product.png`" class="commodity-img"/>
        <div class="comm-name">
          <p class="ft-40r">{{productInfo.productName}}</p>
          <p class="color-999 ft-35r">包装规格：{{productInfo.specName}}</p>
          <p class="color-999 ft-35r" v-if="isDirectMatch">
            库存：{{productInfo.inventoryMinUnitCount|showStock(productInfo.maxUnit,productInfo.minUnit,productInfo.specQuantity)}}</p>
          <ul v-if="isDirectMatch">
            <li v-for="price in priceList" class="color-999 ft-35r">
              {{price.areaName}}：{{price.shopPurchasePrice}}元/{{productInfo.maxUnit}}；
            </li>
          </ul>
        </div>
      </div>
      <div class="comm-information">
        <p class="comm">商品信息</p>
        <div>
          <table class="information-table">
            <tr>
              <td>分类：{{productInfo.categoryName}}</td>
              <td>品牌：{{productInfo.productBrand}}</td>
            </tr>
            <tr>
              <td>销售规格：{{productInfo.saleSpecName}}</td>
              <td>条形码：{{productInfo.barCode}}</td>
            </tr>
            <tr>
              <td>长×宽×高(cm)：{{productInfo.length}}/{{productInfo.height}}/{{productInfo.width}}</td>
              <td>重量(kg)：{{productInfo.weight}}</td>
            </tr>
            <tr>
              <td colspan="2">箱码：<span v-for="item in productInfo.boxCodes">{{item.code}}；</span></td>
            </tr>
          </table>
        </div>
        <div class="editInformation">
          <p v-if="productInfo.lastUpdateTime">该商品信息编辑于{{productInfo.lastUpdateTime}}</p>
          <p v-if="productInfo.lastUpdateUserName">由{{productInfo.lastUpdateUserName}}编辑</p>
        </div>
      </div>
    </div>
    <div style="height: 1.31rem;"></div>
    <div class="edit-button" @click="$refs[`editStock`].show()" v-if="isDirectMatch">修改库存</div>
    <div class="edit-button" @click="editProduct()" v-if="!isDirectMatch&&productInfo.productSource==1">编辑</div>

    <!--设置库存弹框-->
    <cube-pop position="center" ref="editStock">
      <div class="setting">
        <p class="popHeader">修改库存</p>
        <div class="content">
          <div>库存</div>
          <input v-model.trim="stockCount" type="number" placeholder="请填写库存数量"/>
          <div>{{productInfo.maxUnit}}</div>
        </div>
        <div class="selectButton">
          <span @click="$refs[`editStock`].hide()">取消</span>
          <span @click="editStock()">确定</span>
        </div>
      </div>
    </cube-pop>
  </div>
</template>

<script>
  import Navigator from '@/components/common/Navigator'
  import http from "@/assets/models/productAPIs";
  import {Popup} from 'cube-ui'

  export default {
    name: "commodity-detail",
    data() {
      return {
        title: '商品详情',
        productSkuId: '',  //产品Id
        productType: 0,  //产品类型
        stockCount: null,
        productInfo: {},
        priceList: [],
        isDirectMatch: false
      }
    },
    components: {
      'nav-title': Navigator,
      'cube-pop': Popup,
    },
    mounted() {
      //取到前一个页面带过来的参数 product 产品信息
      this.productSkuId = this.$route.query.productId
      this.isDirectMatch = this.$route.query.isDirectMatch === `true`
      http.getProductDetail({param: {productSkuId: this.productSkuId, productType: this.productType}})
        .then(data => {
          this.productInfo = data.data || {}
          this.stockCount = Math.floor(this.productInfo.inventoryMinUnitCount / this.productInfo.specQuantity)
        })
        .catch(e => {
          this.$toast({message: e})
        })
      if (this.isDirectMatch) {
        http.getShopDirectProductSkuAreaSellPolicy({param: this.productSkuId})
          .then(data => {
            this.priceList = data.data || []
          })
          .catch(e => {
            this.$toast({message: e})
          })
      }
    },
    methods: {
      editStock() {
        if (isNaN(this.stockCount) || this.stockCount.toString().indexOf(`.`) !== -1 || parseInt(this.stockCount) < 0) return this.$toast({message: `请填写正确的库存数量`})
        http.editDirectMatchProductStock({
          param: {
            productSkuId: this.productSkuId,
            packageCount: parseInt(this.stockCount)
          }
        })
          .then(() => {
            this.$toast({message: `修改成功`})
            this.productInfo.inventoryMinUnitCount = parseInt(this.stockCount) * this.productInfo.specQuantity
            this.$refs[`editStock`].hide()
          })
          .catch(e => {
            this.$toast({message: e})
          })
      }
      ,
      editProduct() {
        this.$router.push({name: 'addCommodity', query: {comeInType: 'editProduct', productInfo: this.productInfo}})
      }
      ,
    }
  }
</script>

<style scoped lang="stylus">
  #commodityDetail {
    background: #f6f6f6;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;

    .page-wrap {
      flex 1;
      overflow-y scroll;
    }

    .commodity-show {
      display: flex;
      flex-direction: row;
      background: #fff;
      padding: 0.32rem 0.32rem;
      margin-bottom 0.27rem;

      .commodity-img {
        width: 2.13rem;
        height: 2.13rem;
        padding: 0.32rem;
      }

      .comm-name {
        flex: 1;
        display flex;
        flex-direction: column;
        align-items flex-start;

        > p {
          text-align left;
          line-height: 0.67rem;
        }

        > ul {
          display flex;
          flex-direction column;
          flex-wrap wrap;
          justify-content flex-start;
          align-items flex-start;
        }

        li {
          text-align left;
          line-height: 0.67rem;
        }
      }
    }

    .comm-information {
      background: #fff;

      .comm {
        text-align left;
        padding: 0.35rem 0.32rem;
        font-size: 0.37rem;
        color: #333;
        font-weight bold;
        border-bottom: 1px solid #ededed;
      }
    }

    .information-table {
      margin: 0.32rem 0 0.43rem 0.32rem;
      width: 9.36rem;
      valign: middle;
      font-size: 0.35rem;
      color: #666;
      border-spacing: 10px;

      tr {
        height: 0.99rem;
        text-align left;
        border: 1px solid #ededed;

        td {
          border: 1px solid #ededed;
          valign: middle;
          vertical-align: middle;
          padding-left: 20px;
          word-break: break-all;
        }
      }
    }

    .editInformation {
      margin-right .32rem;
      padding-bottom: 0.43rem;

      p {
        text-align: right;
        font-size: 0.35rem;
        color: #666;
        line-height 0.54rem;

      }
    }

    .edit-button {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #0096FF;
      color: #fff;
      font-size: 0.45rem;
      height: 1.31rem;
      line-height: 1.31rem;
    }

    .setting {
      background: #fff;
      color: #333;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      width 8rem;

      .popHeader {
        text-align center;
        padding-top: 0.43rem;
        font-size: 0.4rem;
      }

      .content {
        margin: .32rem;
        display flex;
        font-size .40rem;
        color: #333;
        flex-direction row;
        justify-content space-between;
        align-items center;

        > input {
          outline transparent;
          height .75rem;
          line-height .75rem;
          flex 1;
          margin 0 .16rem;
          text-align right;
          border .01rem solid #ededed;
        }
      }

      .selectButton {
        display: flex;
        flex-direction: row;
        font-size: 0.43rem;

        span {
          flex: 1;
          border-right: 1px solid #ededed;
          padding: 0.37rem 0;

          &:nth-child(2) {
            color: #099AFF
            border-right: 0;
          }
        }
      }
    }
  }
</style>
