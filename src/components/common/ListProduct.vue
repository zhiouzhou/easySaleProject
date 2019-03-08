<template>
  <div class="list-product-wrap" @click="$emit('onProductSelected',product,type,product.productId)">
    <div class="product-info-wrap">
      <img
        class="left"
        :src="product.imageUrl||`/static/icons/defaul_product.png`"/>
      <div class="middle">
        <span class="ft-37r color-333 two-line"
              style="line-height: 1.1;text-align: left;">{{product.productName}}</span>
        <span class="ft-35r color-666" v-if="isShowStock">库存：{{product.currentInventory|showStock(product.maxUnit,product.minUnit,product.packageCount)}}</span>
        <span class="ft-35r color-666" v-else>规格：{{product.specName}}</span>
      </div>
      <div class="right " v-if="type!=='normal'">
        <i class="icon icon-ic_shouqi_lan2" :style="!selected?'transform:rotate(180deg)':''"
           v-if="type==='extand'"></i>
        <i :class="['icon',selected?'icon-ic_xuanzhong':'icon-ic_weixuan']" v-if="type==='select'"></i>
      </div>
    </div>
    <ul class="warehouse-info-wrap" v-show="selected&&type==='extand'&&stockList.length">
      <li v-for="item in stockList" v-if="stockList.length">
        <span class="ft-35r color-333 one-line" style="margin-right:1.89rem;line-height: 110%;text-align: left;width: 50%;">{{item.warehouseName}}</span>
        <span class="ft-35r color-666" style="text-align:left;width: 50%;">库存 <span class="ft-35r color-FA6F31">{{item.totalcountMinunit|showStock(item.packagename,item.unitName,item.packagequantity)}}</span></span>
      </li>
    </ul>
    <span class="ft-35r color-666" style="padding:.16rem;background-color: #f6f6f6;"
          v-show="selected&&type==='extand'&&!stockList.length">暂无库存</span>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        selected: false,
        stockList: []
      }
    },
    props: {
      type: {
        type: String,
        required: true,
        validator(value) {
          // 这个值必须匹配下列字符串中的一个
          return ['normal', 'extand', 'select'].indexOf(value) !== -1
        }
      },
      product: {
        type: Object,
        required: true
      },
      isShowStock:{
        type: Boolean,
      }
    },
    mounted() {
      this.selected = !!this.product.selected
    },
    methods: {
      updateSelected(selected) {
        this.selected = selected
      },
      updateStockList(stockList) {
        this.stockList = stockList
      }
    },
    watch: {}
  }
</script>


<style lang="stylus" scoped>
  .list-product-wrap {
    background: #fff;
    width 100%;
    display flex;
    flex-direction column;
    align-items stretch;
  }

  .product-info-wrap {
    background-color #fff;
    display: flex;
    flex-direction: row;
    justify-content space-between;
    align-items stretch;
    padding 0.21rem;
    box-sizing border-box;
    border-bottom 0.01rem solid rgba(0, 0, 0, 0.1)
  }

  .left {
    height 1.92rem;
    width 1.92rem;
  }

  .middle {
    height 1.92rem;
    flex 1;
    display flex;
    flex-direction column;
    justify-content space-between;
    align-items flex-start;
    margin-left 0.21rem;
  }

  .right {
    width 0.97rem;
    position relative;
    i {
      position absolute;
      left 50%;
      top 50%;
      transform translate(-50%, -50%);
    }
  }

  .warehouse-info-wrap {
    background-color #FAFAFA;
    padding 0.32rem;
    box-sizing border-box;
    padding-bottom 0;
    li {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items center;
      margin-bottom 0.32rem;
    }
  }
</style>
