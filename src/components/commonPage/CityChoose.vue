<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <!--<div class="current">-->
    <!--<span class="ft-40r color-333">当前城市</span>-->
    <!--<div class="current-city">{{currentCity.name}}</div>-->
    <!--</div>-->
    <index-list :data="cityData" :title="listTitle" class="list">
      <cube-index-list-group
        v-for="(group, index) in cityData"
        :key="index"
        :group="group">
        <cube-index-list-item
          v-for="(item, index) in group.items"
          :key="index"
          :item="item"
          @select="selectItem">
          <div :class="[`custom-item`,index===group.items.length-1?`no-bottom-line`:``]">{{item.name}}</div>
        </cube-index-list-item>
      </cube-index-list-group>
    </index-list>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import {IndexList} from "cube-ui"
  import {mapState, mapMutations} from 'vuex'
  import http from '@/assets/models/userAPIs'
  import pinyin from 'pinyin'

  export default {
    name: 'CityChoose',
    props: [],
    data() {
      return {
        title: '选择城市',

        cityData: []
      }
    },
    components: {
      'title-nav': Navigator,
      IndexList
    },
    methods: {
      selectItem(item) {
        this.setCurrentCity(item)
        this.$router.go(-1)
      },
      //把全部城市的列表，按照拼音首字母分组
      sortCity(cityList) {
        let arr = cityList || []
        let resLs = []
        let firstLetter
        for (let city of arr) {
          firstLetter = pinyin(city.name, {style: pinyin.STYLE_NORMAL})[0][0].charAt(0).toUpperCase()
          //pinyin插件有些字识别不了，手动纠正
          firstLetter = firstLetter === `忻` ? `X` :
            firstLetter === `渭` ? `W` :
              firstLetter === `滁` ? `C` :
                firstLetter === `濮` ? `P` :
                  firstLetter === `襄` ? `X` :
                    firstLetter === `赣` ? `G` :
                      firstLetter === `邯` ? `H` :
                        firstLetter === `郴` ? `C` :
                          firstLetter === `淄` ? `Z` :
                            firstLetter === `漳` ? `Z` :
                              firstLetter === `莆` ? `P` :
                                firstLetter === `湛` ? `Z` :
                                  firstLetter === `阿` ? `A` :
                                    firstLetter === `阜` ? `F` : firstLetter
          //先查找是否已有该分组
          let index = resLs.findIndex(item => item.name === firstLetter)
          if (index !== -1) {
            resLs[index].items.push(city)
          } else {
            resLs.push({name: firstLetter, items: [city]})
          }
        }
        return resLs.sort((a, b) => {
          return a.name.charCodeAt(0) - b.name.charCodeAt(0)
        })
      },
      ...mapMutations('currentCity', [`setCurrentCity`])
    },
    mounted() {
      return http.getListProvinceAndSubCity()
        .then(data => {
          let provinceList = data.data || []
          let cityList = []
          //获取全部城市的列表
          provinceList.forEach(province => {
            cityList = cityList.concat(province.jiupiCityList)
          })
          //把全部城市的列表，按照拼音首字母分组
          this.cityData = this.sortCity(cityList)
        })
    },
    computed: {
      listTitle() {
        return `当前城市：${this.currentCity.name}`
      },
      ...mapState(`currentCity`, [`currentCity`])
    },
  }
</script>


<style lang="stylus" scoped>
  .custom-item {
    font-size .4rem;
    height 1.25rem;
    margin 0 .32rem;
    border-bottom 1px solid #ededed;
    text-align left;
    line-height 1.25rem;
  }

  .no-bottom-line {
    border-bottom 0 solid #ededed;
  }

  .page {
    background-color #f6f6f6;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
  }

  .list {
    flex 1;
  }

  .current {
    height 1.25rem;
    background-color #fff;
    padding-left .32rem;
    text-align left;
    margin-bottom -.1rem;
    display flex

    > span {
      line-height 1.25rem;
      text-align left;
    }

    .current-city {
      width: 1.92rem;
      height: 0.8rem;
      border-radius: 0.05rem;
      border: 0.02rem solid;
    }
  }
</style>
