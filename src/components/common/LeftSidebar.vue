<template>
  <div class="leftSiderBar">
    <ul class="list-left">
      <li  @click="onCategorySelect(`全部`)" :style="selectedCategoryName===`全部`?'color:#0096FF;':''">
        <i v-if="selectedCategoryName===`全部`"></i>
        全部
      </li>
      <li v-for="item in categoryList" @click="onCategorySelect(item.categoryName)" :style="selectedCategoryName==item.categoryName?'color:#0096FF;':''">
        <i v-if="selectedCategoryName==item.categoryName"></i>
        {{item.categoryName}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "left-sidebar",
    data() {
      return {
        list: [],
        selectedCategoryName: '',
      }
    },
    props: {
      categoryList: {
        type: Array,
        required: true,
      },
      initId: {
        type: String,
        required: true
      }
    },
    created(){
      this.selectedCategoryName = this.initId
    },
    methods: {
      updateSelectedId(id) {
        this.selectedCategoryName = id
      },
      onCategorySelect(name) {
        this.selectedCategoryName = name;
        this.$emit('select-id', this.selectedCategoryName)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .leftSiderBar{
    background: #fff;
    position: fixed;
    height:100%;
  }
  .list-left {
    width: 2.4rem;
    background: #fff;
    li {
      width: 100%;
      padding: 0.37rem;
      border-bottom 1px solid rgba(0, 0, 0, .1)
      color: #333;
      font-size: 0.4rem;
      position: relative;
      i {
        display: block;
        background: #0096FF;
        width: 0.05rem;
        height: 0.53rem;
        position: absolute;
        left: 0;
        top: 0.29rem;
      }
    }
  }
</style>
