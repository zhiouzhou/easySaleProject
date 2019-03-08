<template>
  <div class="page-wrap">
    <!--选择提货人标题-->
    <title-nav :title="title" v-if="pageType===`outBound`"></title-nav>
    <!--选择收货人标题-->
    <div class="title-wrap" v-else>
      <i class="icon icon-ic_fh" @click="$router.go(-1)"></i>
      <div>
        <div :class="[`left-shape`,userType===0?`light`:`dark`]" @click="userType=0">常用联系人</div>
        <div :class="[`right-shape`,userType===1?`light`:`dark`]" @click="userType=1">久批会员</div>
      </div>
    </div>
    <!--搜索栏-->
    <search-bar searchNoticeText="" @onClickSearch="onSearch" v-if="pageType===`applyDelivery`"></search-bar>
    <div class="scroll-wrap">
      <!--收货人列表-->
      <cube-scroll
        ref="scroll" :data="receiverList" :options="scrollOptions"
        @pulling-down="onPullingDown" @pulling-up="onPullingUp" v-if="pageType===`applyDelivery`">
        <ul class="list-wrap">
          <li class="item" v-for="person in receiverList" @click="onSelectPerson(person)">
            <!--<i :class="['icon',person.addressId===selectId?'icon-ic_xuanzhong':'icon-ic_weixuan']"></i>-->
            <div class="content">
              <span class="ft-40r color-333">{{person.contact}} {{person.phone}}</span>
              <span class="ft-37r color-666 two-line" style="line-height: 110%;margin-top: .32rem;">
            {{person.province||``}}{{person.city||``}}{{person.county||``}}{{person.street||``}}{{person.detailAddress||``}}
          </span>
            </div>
            <span class="ft-37r color-099AFF" v-if="userType===0" @click.stop="onEditPerson(person)">编辑</span>
          </li>
        </ul>
      </cube-scroll>
      <!--提货人列表-->
      <ul class="list-wrap" v-if="pageType===`outBound`">
        <li class="item" v-for="person in receiverList" @click="onSelectPerson(person)">
          <div class="content">
            <span class="ft-40r color-333">{{person.consigneerName}} {{person.phone}}</span>
            <span class="ft-37r color-666 two-line" style="line-height: 110%;margin-top: .32rem;">
              身份证：{{person.idNumber}}
          </span>
          </div>
          <span class="ft-37r color-099AFF" v-if="userType===0" @click.stop="onEditPerson(person)">编辑</span>
        </li>
      </ul>
    </div>
    <div style="height: 1.31rem;"></div>
    <div class="bottom-button" v-show="userType!==1" @click="onAddPerson">
      <i class="icon icon-ic_tianjia_bai"></i>
      <span>{{addNoticeTxt}}</span>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import SearchBar from '@/components/common/SearchBar'
  import {Scroll} from 'cube-ui'
  import http from '@/assets/models/warehouseAndTransferAPIs'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'WATchoosePerson',
    props: [],
    data() {
      return {
        pageType: ``,//applyDelivery委托配送选择收货人，outBound出库选择提货人
        keyWord: ``,
        userType: 0,//收货人：常用联系人：0，久批会员：1
        receiverList: [],
        pageSize: 20,
        currentPage: 1
      }
    },
    mounted() {
      this.pageType = this.$route.params.pageType || `applyDelivery`
      this.getPersonList(this.pageType)
    },
    components: {
      'title-nav': Navigator,
      'cube-scroll': Scroll,
      SearchBar
    },
    methods: {
      onAddPerson() {
        this.$router.push({path: `/WATeditPerson/${this.pageType}/add`})
      },
      onEditPerson(person) {
        this.$router.push({path: `/WATeditPerson/${this.pageType}/edit`,query:{person}})
      },
      getPersonList() {
        let {currentPage, pageSize, userType, keyWord} = this
        return Promise.resolve()
          .then(() => {
            if (this.pageType === `applyDelivery`) {
              return http.getReceiverList({currentPage, pageSize, param: {searchKey: keyWord, userType}})
            } else if (this.pageType === `outBound`) {
              return http.getPickerList({param: {}})
            }
          })
          .then(data => {
            if (currentPage === 1) {//拿第一页数据
              this.receiverList = data.data || []
            } else if (currentPage !== 1 && data.data && data.data.length) {//拿非第一页数据且数据不为空
              this.receiverList = this.receiverList.concat(data.data)
            } else {//拿非第一页数据且数据为空
              //页码减一
              --this.currentPage
            }
            this.$refs.scroll && this.$refs.scroll.forceUpdate()
          })
      },
      onSelectPerson(person) {
        console.log(person)
        this.setPerson({type: this.pageType, person})
        this.$router.go(-1)
      },
      onSearch(txt) {
        this.keyWord = txt
        this.currentPage = 1
        this.getPersonList(this.pageType)
      },
      onPullingDown() {
        this.currentPage = 1
        this.getPersonList(this.pageType)
      },
      onPullingUp() {
        ++this.currentPage
        this.getPersonList(this.pageType)
      },
      ...mapMutations(`WATorder`, [`setPerson`])
    },
    computed: {
      selectId() {
        return this.selectPerson ? this.selectPerson.addressId : ``
      },
      selectPerson() {
        //判断store是否存在
        if (!this[this.pageType]) return null
        else return this[this.pageType].person
      },
      title() {
        return this.pageType === `applyDelivery` ? `选择收货人` :
          this.pageType === `outBound` ? `选择提货人` : ``
      },
      addNoticeTxt() {
        return this.pageType === `applyDelivery` ? `新增收货人` :
          this.pageType === `outBound` ? `新增提货人` : ``
      },
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      },
      ...mapState(`WATorder`, [`outBound`, `applyDelivery`])
    },
    watch: {
      userType() {
        this.currentPage = 1
        this.getPersonList()
      }
    }
  }
</script>


<style lang="stylus" scoped>
  .page-wrap {
    height 100%;
    width 100%;
    background-color #f6f6f6;
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
  }

  .title-wrap {
    height: 1.17rem;
    background: linear-gradient(270deg, rgba(13, 137, 245, 1) 0%, rgba(73, 178, 242, 1) 100%);
    position relative;
    > i {
      position absolute;
      left .32rem;
      top 50%;
      transform translateY(-50%);
    }
    > div {
      position: absolute;
      left 50%;
      top 50%;
      transform translate(-50%, -50%);
      display flex;
      flex-direction row;
      align-items center;
      justify-content center;
    }
    .left-shape {
      width: 2.15rem;
      height: 0.75rem;
      background: rgba(255, 255, 255, 1);
      border-radius: 0.05rem 0rem 0rem 0.05rem;
      text-align center;
      line-height .75rem;
      font-size .37rem;
    }
    .right-shape {
      width: 2.15rem;
      height: 0.75rem;
      border-radius: 0rem 0.05rem 0.05rem 0rem;
      text-align center;
      line-height .75rem;
      font-size .37rem;
    }
    .light {
      color: rgba(0, 150, 255, 1);
      background: rgba(255, 255, 255, 1);
    }
    .dark {
      background: rgba(0, 150, 255, 1);
      color: rgba(255, 255, 255, 1);
      border: 0.01rem solid rgba(255, 255, 255, 1);
    }
  }

  .scroll-wrap {
    flex 1;
    overflow hidden;
  }

  .item {
    background-color #fff;
    display flex;
    flex-direction row;
    justify-content space-between;
    align-items center;
    padding .32rem;
    margin-bottom .16rem;
    > i {
      margin-right .32rem;
    }
  }

  .content {
    flex 1;
    display flex;
    flex-direction column;
    align-items flex-start;
  }

  .bottom-button {
    position fixed;
    bottom 0;
    width 100%;
    height 1.31rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    background-color rgba(0, 150, 255, 1);
    > span {
      color #fff;
      font-size .45rem;
      line-height 1.31rem;
      margin-left .16rem;
    }
  }
</style>

