<template>
  <div class="product-wrap">
    <div class="product-info-wrap">
      <img class="single-product-img"
           :src="product.orderProductVO.imageUrl"/>
      <div class="single-product-info">
        <div class="ft-40r color-333 two-line" style="line-height: 120%;">{{product.orderProductVO.productName}}</div>
        <div class="ft-35r- color-666">
          批价
          <span class="ft-35r color-FA6F31">¥
              <span class="ft-48r color-FA7B43">{{product.orderProductVO.sellingPrice|integerPart}}</span>{{product.orderProductVO.sellingPrice|decimalPart}}{{product.orderProductVO.sellingPriceUnit}}
            </span>
        </div>
      </div>
    </div>
    <div class="product-spec ft-35r color-666">
      <span>规格：{{product.orderProductVO.specName}}</span>
      <span>X{{product.count}}</span>
    </div>
  </div>
</template>


<script>

  export default {
    name: 'orderProduct',
    props: {
      product: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {}
    },
    filters: {
      integerPart(value) {
        let num = parseFloat(value)
        return Math.floor(num / 1)
      },
      decimalPart(value) {
        let num = parseFloat(value)
        return num.toFixed(2).substr(-3)
      }
    },
    components: {},
    methods: {},
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .product-wrap {
    background-color: #fff;
    border-bottom: 1px solid #ededed;
    padding .32rem;
    box-sizing border-box;
  }

  .product-info-wrap {
    height 1.92rem;
    display flex;
    flex-direction: row;
    justify-content space-between;
    align-items center;
  }

  .single-product-img {
    width 1.92rem;
    height 1.92rem;
  }

  .single-product-info {
    text-align left;
    margin-left .32rem;
    flex 1;
    height 1.92rem;
    display flex;
    flex-direction column;
    justify-content space-between;
    align-items flex-start;
  }

  .product-spec {
    margin-left 2.24rem;
    margin-top .32rem;
    display flex;
    flex-direction: row;
    justify-content space-between;
    align-items center;
  }


</style>
