<template>
  <div>
    <ul class="brand-list-wrap">
      <li :class="selectedBrandName==='allBrand'?'active-brand-wrap':'brand-wrap'" @click="onClickBrand('allBrand')">
        全部品牌
      </li>

      <li :class="selectedBrandName===brand.brandName?'active-brand-wrap':'brand-wrap'"
          v-for="brand in getShowBrandList"
          @click="onClickBrand(brand.brandName)">
        {{brand.brandName}}
      </li>

      <li class="extand" v-show="brandList.length>7">
        <div class="bottom_right">
          <!--更多图标和文字-->
          <div v-if="!extanded&&selectIndex<7" @click="onSwitchExtand">
            <span class="ft-35r color-0096FF">更多</span>
            <i class="icon icon-ic_xiala_lan"></i>
          </div>
          <!--收起图标和文字-->
          <div v-if="extanded&&selectIndex<7" @click="onSwitchExtand">
            <span class="ft-35r color-0096FF">收起</span>
            <i class="icon icon-ic_xiala_lan_copy"></i>
          </div>
        </div>
      </li>
    </ul>

  </div>
</template>


<script>
  export default {
    data() {
      return {
        extanded: false,
        selectedBrandName: 'allBrand',
      }
    },
    props: {
      brandList: {
        type: Array,
        required: true,
      },
      brandName: {
        type: String,
        required: true,
      }
    },
    created() {
      this.selectedBrandName = this.brandName
    },
    methods: {
      updateSelectedId(id) {
        this.selectedBrandName = id
      },
      onSwitchExtand() {
        this.extanded = !this.extanded
      },
      onClickBrand(clickBrandName) {
        this.selectedBrandName = clickBrandName
        this.$emit('select-brand', clickBrandName)
      }
    },

    computed: {
      getShowBrandList() {
        if (this.extanded || this.selectIndex >= 7) {
          return this.brandList
        } else {
          return this.brandList.slice(0, 7)
        }
      },
      selectIndex() {
        return this.brandList.findIndex(item => {
          return item.brandName === this.brandName
        })
      }
    }
  }
</script>


<style lang="stylus" scoped>
  .bottom_right {
    float: right;
  }

  .brand-list-wrap {
    width 7.28rem;
    background-color #fff;
    display flex;
    flex-direction: row;
    justify-content flex-start;
    align-items center;
    flex-wrap wrap;
    padding-left: 0.32rem;
    padding-top 0.32rem;
  }

  .active-brand-wrap {
    min-width: 2rem;
    margin 0 0.32rem 0.32rem 0;
    height: 0.75rem;
    background: rgba(0, 150, 255, 1);
    border-radius: 0.05rem;
    font-size: 0.35rem;
    color: #fff;
    line-height: 0.75rem;
    text-align center;
  }

  .brand-wrap {
    min-width: 2rem;
    margin 0 0.32rem 0.32rem 0;
    height: 0.75rem;
    background: #F2F2F2;
    border-radius: 0.05rem;
    font-size: 0.35rem;
    color: #666;
    line-height: 0.75rem;
    padding 0 .16rem;
    box-sizing border-box;
    text-align center;
  }

  .extand {
    width: 2rem;
    padding-right 0.3rem;
    margin 0 0.32rem 0.32rem 0;
    height: 0.75rem;
    font-size: 0.35rem;
    line-height: 0.75rem;
    text-align center;
    flex: 1;
  }
</style>
