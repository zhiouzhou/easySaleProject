<template>
  <div class="edit-wrap" :style="{height:wrapHeight+'rem',width:wrapWidth+'rem'}">
    <div class="edit-button-wrap" :style="{height:wrapHeight+'rem',width:wrapHeight+'rem'}" @click.stop="handleReduce">
      <i :class="['icon',currentValue<=min?'icon-srk_ic_jian_bkd':'icon-srk_ic_jian_kd']"></i>
    </div>
    <input class="edit-input" :value="currentValue" @change.stop="handleChange"
           :style="{'height':wrapHeight+'rem','width':wrapHeight+'rem','line-height':wrapHeight+'rem'}"/>
    <div class="edit-button-wrap" :style="{height:wrapHeight+'rem',width:wrapHeight+'rem'}" @click.stop="handleAdd">
      <i :class="['icon',currentValue>=max?'icon-srk_ic_jia_bkd':'icon-srk_ic_jia_kd']"></i>
    </div>
  </div>
</template>


<script>
  function isValueNumber(value) {
    return (/^[0-9]*$/).test(value);
  }

  export default {
    name: `EditNumber`,
    data() {
      let currentValue = 0;
      if (this.num > this.max) {
        currentValue = this.max;
      } else if (this.num < this.min) {
        currentValue = this.min;
      } else {
        currentValue = this.num;
      }
      return {
        currentValue: currentValue
      }
    },
    props: {
      editId: {
        type: String,
        required: true
      },
      num: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 99999
      },
      min: {
        type: Number,
        default: 0
      },
      wrapHeight: {
        type: Number,
        default: 0.75
      },
      wrapWidth: {
        type: Number,
        default: 2.56
      },
      step: {
        type: Number,
        default: 1
      }
    },
    methods: {
      //手动更新值
      updateValue(value) {
        this.currentValue = value
      },
      handleChange(event) {
        let val = event.target.value.trim();
        if (isValueNumber(val)) {
          let max = this.max;
          let min = this.min;
          val = Number(val);
          this.currentValue = val;
          if (val > max) this.currentValue = max;
          if (val < min) this.currentValue = min;
        } else {
          // 如果输入的非数字，则保留之前的数据
          event.target.value = this.currentValue;
        }
      },
      handleAdd() {
        if (this.currentValue >= this.max) {
          return;
        }
        this.currentValue += this.step;
      },
      handleReduce() {
        if (this.currentValue <= this.min) {
          return;
        }
        this.currentValue -= this.step;
      },
    },
    watch: {
      currentValue(value) {
        this.$emit('on-change', value, this.editId);
      },
    }
  }
</script>


<style lang="stylus" scoped>
  .edit-wrap {
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items stretch;
    border-radius: 0.05rem;
    border: 1px solid rgba(189, 189, 189, 1);
    box-sizing content-box;
  }

  .edit-button-wrap {
    display flex;
    flex-direction row;
    align-items center;
    justify-content center;
  }

  .edit-input {
    flex: 1;
    border-left 1px solid rgba(189, 189, 189, 1);
    border-right 1px solid rgba(189, 189, 189, 1);
    text-align center;
    font-size 0.35rem;
  }
</style>
