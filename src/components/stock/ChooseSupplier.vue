<template>
  <div style="background-color: #f6f6f6;">
    <title-nav :title="title"></title-nav>
    <ul>
      <li class="supplier-item-wrap" v-for="item in supplierList" @click="selectedSupplierId=item.supplierId">
        <div class="left">
          <span class="ft-40r color-333">{{item.supplierName}}</span>
          <div class="ft-37r color-666" style="margin-top: 0.32rem;">
            <span style="margin-right: 0.32rem;">联系人：{{item.contact}}</span>
            <span>{{item.mobileNo}}</span>
          </div>
        </div>
        <i :class="['icon',item.supplierId===selectedSupplierId?'icon-ic_xuanzhong' :'icon-ic_weixuan']"></i>
      </li>
    </ul>
    <div style="height: 1.31rem;"></div>
    <div class="button ft-45r color-fff" @click="confirm">确认</div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"

  export default {
    name: 'chooseSupplier',
    props: [],
    data() {
      return {
        title: '选择供应商',
        source: ``,
        selectedSupplierId: ``,
        supplierList: []
      }
    },
    components: {
      'title-nav': Navigator
    },
    created() {
      this.source = this.$route.params.source;
      this.selectedSupplierId = this.$route.params.selectedSupplierId;
      this.$store.dispatch('supplier/getSupplierList')
        .then(data => {
          this.supplierList = this.$store.state.supplier.supplierList
        })
    },
    methods: {
      confirm() {
        let supplier = this.supplierList.find(item => item.supplierId === this.selectedSupplierId);
        if (this.source === 'inBoundOrder' || this.source === 'outBoundOrder') {
          this.$store.commit(`${this.source}/changeSupplier`, {supplier});
          this.$router.go(-1)
        }
      },
    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .supplier-item-wrap {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    padding 0.32rem;
    margin-top 0.16rem;
    box-sizing border-box;
    background-color #fff;
  }

  .left {
    display flex;
    flex-direction column;
    justify-content flex-start;
    text-align left;
    > div {
      display: flex;
      flex-direction row;
      justify-content flex-start;
      align-items center;
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
</style>
