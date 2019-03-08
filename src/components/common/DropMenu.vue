<template>
  <div>
    <div class="menu-wrap">
      <div class="menu-item" @click="onSelectMenu(menu.keyWord)" v-for="(menu,index) in menuData" :key="index">
        <!--下拉菜单只有一个的时候左右对齐-->
        <div :style="{justifyContent: menuData.length===1?`space-between`:`center`}">
          <div :class="['ft-40r', rootValue[`${menu.keyWord}MenuShow`]?'color-0096FF':'color-333']"
               style="display: flex;flex-direction: column;"
               v-if="menu.keyWord===`dateType`&&rootValue.selecteddateTypeId===`1`">
            <span>{{rootValue.selectDate[0]}}</span>
            <span>{{rootValue.selectDate[1]}}</span>
          </div>
          <!--城市菜单不展示文字，只留占位，并用一个div覆盖在菜单上面实现跳转-->
          <!--<span v-else-if="menu.keyWord===`city`"></span>-->
          <span v-else-if="!menu[`${menu.keyWord}List`].length" style="font-size: .4rem;">暂无数据</span>
          <span :class="['ft-40r','one-line', rootValue[`${menu.keyWord}MenuShow`]?'color-0096FF':'color-333']"
                style="line-height: 110%;"
                v-else>{{rootValue[`selected${menu.keyWord}Name`]}}</span>
          <i :class="['icon', rootValue[`${menu.keyWord}MenuShow`]?'icon-ic_shouqi_lan2':'icon-map_ic_xl_bai']"
             v-if="menu.keyWord!==`city`"></i>
        </div>
        <div class="line" v-if="index!==menuData.length-1"></div>
      </div>
    </div>

    <pop-menu position="top" :edgeMargin="edgeMargin" @on-dismiss="onPopMenuDismiss"
              v-for="menu in menuData" :key="menu.keyWord"
              v-show="rootValue[`${menu.keyWord}MenuShow`]">
      <ul class="list-wrap">
        <li class="item-wrap"
            v-for="listItem in menu[`${menu.keyWord}List`]"
            :style="rootValue[`selected${menu.keyWord}Id`]===listItem.menuId?'border-bottom:1px solid #0096FF;':''"
            @click.stop="onSelectItem(menu.keyWord,listItem.menuId,listItem.menuName)">
          <span :class="['ft-40r',rootValue[`selected${menu.keyWord}Id`]===listItem.menuId?'color-0096FF':'color-333']"
                style="line-height: 110%">
            {{listItem.menuName}}</span>
          <i class="icon icon-pop_ic_xz" v-if="rootValue[`selected${menu.keyWord}Id`]===listItem.menuId"></i>
        </li>
      </ul>
    </pop-menu>
  </div>
</template>


<script>
  import PopMenu from "@/components/common/PopMenu"
  import DateUtil from '@/scripts/DateUtils'

  const dateSegmentData = [
    {
      is: 'cube-date-picker',
      title: '开始时间',
      min: new Date(2010, 0, 1),
      max: new Date(2020, 11, 31)
    },
    {
      is: 'cube-date-picker',
      title: '结束时间',
      min: new Date(2010, 0, 1),
      max: new Date(2020, 11, 31)
    }
  ]
  export default {
    name: '',
    props: {
      //eg: { keyWord:'city',
      //   cityList:[
      //     {menuId:'',menuName:'',...},
      //     {menuId:'',menuName:'',...}
      //   ]
      // }
      menuData: {
        type: Array,
        required: true,
        validator(value) {
          if (!value.length) return false
          let arr = value.slice()
          return arr.every(item => {
            return item.keyWord && item[`${item.keyWord}List`]
          })
        }
      },
      //下拉菜单的边界距离(rem)
      edgeMargin: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        rootValue: {}
      }
    },
    components: {
      PopMenu
    },
    mounted() {
      if (!this.menuData) return
      this.menuData.forEach(item => {
        let keyWord = item.keyWord
        //初始化menuShow
        this.$set(this.rootValue, `${keyWord}MenuShow`, false)
        //初始化选中Id
        if (item.initId) {
          this.$set(this.rootValue, `selected${keyWord}Id`, item.initId)
        } else {
          this.$set(this.rootValue, `selected${keyWord}Id`, (item[`${keyWord}List`].length && (item[`${keyWord}List`][0].menuId) || ``))
        }
        //初始化选中Name
        if (item.initName) {
          this.$set(this.rootValue, `selected${keyWord}Name`, item.initName)
        } else {
          this.$set(this.rootValue, `selected${keyWord}Name`, (item[`${keyWord}List`].length && (item[`${keyWord}List`][0].menuName) || ``))
        }
        //时间选择菜单特殊处理
        if (keyWord === `dateType`) {
          let thisMonthStrObj = this.getThisMonthStr()
          this.$set(this.rootValue, `selectDate`, [thisMonthStrObj.firstDayStr, thisMonthStrObj.lastDayStr])
        }
      })

      this.dateSegmentPicker = this.$createSegmentPicker({
        data: dateSegmentData,
        onSelect: (selectedDates, selectedVals, selectedTexts) => {
          let startDateStr = `${selectedTexts[0][0]}-${selectedTexts[0][1]}-${selectedTexts[0][2]}`
          let endDateStr = `${selectedTexts[1][0]}-${selectedTexts[1][1]}-${selectedTexts[1][2]}`
          this.rootValue.selectDate = [startDateStr, endDateStr]
          this.$emit('on-date-pick', this.rootValue.selectDate)
        },
        onNext: (i, selectedDate, selectedValue, selectedText) => {
          dateSegmentData[1].min = selectedDate
          if (i === 0) {
            this.dateSegmentPicker.$updateProps({
              data: dateSegmentData
            })
          }
        },
        onCancel: () => {
          //选择时间中途取消的话吧日期还原
          this.resetDateToThisMonth()
        }
      })
    },
    methods: {
      //获取本月的第一天和最后一天
      getThisMonthStr() {
        let firstDayOfThisMonth = DateUtil.getCurrentMonthFirst()
        let lastDayOfThisMonth = DateUtil.getCurrentMonthLast()
        let firstDayStr = `${firstDayOfThisMonth.getFullYear()}-${firstDayOfThisMonth.getMonth() + 1}-${firstDayOfThisMonth.getDate()}`
        let lastDayStr = `${lastDayOfThisMonth.getFullYear()}-${lastDayOfThisMonth.getMonth() + 1}-${lastDayOfThisMonth.getDate()}`
        return {firstDayStr, lastDayStr}
      },
      resetDateToThisMonth() {
        let thisMonthStrObj = this.getThisMonthStr()
        this.rootValue.selecteddateTypeId = `0`
        this.rootValue.selecteddateTypeName = `本月`
        this.rootValue.selectDate = [thisMonthStrObj.firstDayStr, thisMonthStrObj.lastDayStr]
        this.$emit('on-select-menu', 'dateType', `0`)
        this.$emit('on-date-pick', this.rootValue.selectDate)
      },
      onSelectItem(keyWord, menuId, menuName) {
        this.rootValue[`selected${keyWord}Id`] = menuId
        this.rootValue[`selected${keyWord}Name`] = menuName
        this.$emit('on-select-menu', keyWord, menuId)
        this.onPopMenuDismiss()
        if (keyWord === `dateType` && menuId === `1`) {
          this.dateSegmentPicker.show()
        } else if (keyWord === `dateType` && menuId === `0`) {
          this.resetDateToThisMonth()
        }
      },
      onSelectMenu(keyWord) {
        this.menuData.forEach(item => {
          if (item.keyWord === keyWord) {
            this.rootValue[`${item.keyWord}MenuShow`] = !this.rootValue[`${item.keyWord}MenuShow`]
          } else {
            this.rootValue[`${item.keyWord}MenuShow`] = false
          }
        })

      },
      onPopMenuDismiss() {
        this.menuData.forEach(item => {
          this.rootValue[`${item.keyWord}MenuShow`] = false
        })
      },
    },
    computed: {},
  }
</script>


<style lang="stylus" scoped>
  .menu-wrap {
    background-color #fff;
    height 1.12rem;
    width 100%;
    display flex;
    flex-direction row;
    justify-content: space-between;
    align-items center;
    border-bottom 1px solid rgba(0, 0, 0, 0.1);
    .menu-item {
      flex 1;
      height 100%;
      position relative;
      > div:first-child {
        width 100%;
        position absolute;
        top 50%;
        left 50%;
        transform translate(-50%, -50%);
        display flex;
        flex-direction row;
        align-items center;
        justify-content center;
        padding 0 .32rem;
        box-sizing border-box;
      }
      .line {
        position absolute;
        top 50%;
        right: 0;
        transform translateY(-50%);
        width 0.03rem;
        height 0.53rem;
        background-color #ededed;
      }
    }
  }

  .list-wrap {
    background-color #fff;
    max-height 60%;
    width 100%;
    overflow-y scroll;
    padding 0 0.32rem;
    box-sizing border-box;
  }

  .item-wrap {
    width 100%;
    height 1.17rem;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
  }

  .one-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .two-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
