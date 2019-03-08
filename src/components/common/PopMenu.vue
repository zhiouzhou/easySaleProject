<template>
  <div class="pop-menu-wrap" :style="getWrapStyle(position,edgeMargin)" @click="canDismiss?$emit('on-dismiss'):''">
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>


<script>
  export default {
    data() {
      return {}
    },
    props: {
      // 弹出方向
      position: {
        type: String,
        default: `top`,
        validator(value) {
          // 这个值必须匹配下列字符串中的一个
          return ['top', 'left', 'bottom', 'right'].indexOf(value) !== -1
        }
      },
      //边界距离(rem)
      edgeMargin: {
        type: Number,
        default: 0
      },
      //排列方向
//      orientation: {
//        type: String,
//        default: `vertical`,
//        validator(value) {
//          return ['vertical', 'horizontal'].indexOf(value) !== -1
//        }
//      },
      //能否触摸阴影让弹框消失
      canDismiss: {
        type: Boolean,
        default: true
      }

    },
    methods: {
      getWrapStyle(position, edgeMargin) {
        return position == 'left' ? `margin-left:${edgeMargin}rem;left:0;flex-direction:row;justify-content :flex-start;` :
          position == 'right' ? `margin-right:${edgeMargin}rem;right:0;flex-direction:row;justify-content :flex-end;` :
            position == 'top' ? `margin-top:${edgeMargin}rem;top:0;flex-direction:column;justify-content :flex-start;` :
              position == 'bottom' ? `margin-bottom:${edgeMargin}rem;bottom:0;flex-direction:column;justify-content :flex-end;` : ``
      }
    }
  }
</script>


<style lang="stylus" scoped>

  .pop-menu-wrap {
    height 100%;
    width 100%;
    background-color rgba(0, 0, 0, 0.6);
    position fixed;
    z-index 99;
    display flex;
    align-items stretch;
  }

</style>
