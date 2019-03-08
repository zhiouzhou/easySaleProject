<template>
  <div class="product-wrap">
    <div class="product-info">
      <img class="product-img" :src="product.imageUrl"/>
      <div class="product-detail">
        <span class="ft-37r color-333 two-line" style="line-height: 110%;">{{product.productName}}</span>
        <span class="ft-35r color-666">规格：{{product.specName}}  当前库存：{{product.currentInventory|showStock(product.maxUnit,product.minUnit,product.packageCount)}}</span>
      </div>
    </div>
    <div class="num-wrap">
      <edit-num editId="bigUnitNum" ref="bigUnitNum" @on-change="onNumChange"></edit-num>
      <span class="ft-35r color-666">{{product.maxUnit}}</span>
      <edit-num editId="smallUnitNum" ref="smallUnitNum" @on-change="onNumChange"></edit-num>
      <span class="ft-35r color-666">{{product.minUnit}}</span>
    </div>
  </div>
</template>


<script>
  import EditNumber from "@/components/common/EditNumber";

  export default {
    name: 'EditNumberListProduct',
    props: {
      product: {
        type: Object,
        required: true
      },
    },

    data() {
      return {}
    },
    components: {
      'edit-num': EditNumber
    },
    methods: {
      updateValue(value, editId) {
        this.$refs[editId].updateValue(value)
      },
      onNumChange(value, editId) {
        this.$emit('on-change', this.product, value, editId)
      }
    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .product-wrap {
    display flex;
    flex-direction column;
    padding .21rem;
    box-sizing border-box;
    border-bottom 2px solid #ededed;
    background-color #fff;
  }

  .product-info {
    display flex;
    flex-direction row;
  }

  .product-img {
    height 1.92rem;
    width 1.92rem;
  }

  .product-detail {
    flex 1;
    margin-left .16rem;
    display flex;
    flex-direction column;
    justify-content space-between;
    align-items flex-start;
  }

  .num-wrap {
    margin-top .32rem;
    display flex;
    flex-direction row;
    justify-content flex-end;
    align-items center;
    > span {
      margin 0 .21rem;
    }
    span:last-child {
      margin-right: 0;
    }
  }
</style>
