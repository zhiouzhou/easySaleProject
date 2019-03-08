<template>
  <div id="commodityShow">
    <!--商品分类 商品列表 新增商品入口-->
    <ul class="pageEntry-ul">
      <!--<router-link to="/commodityClassify" tag="li">-->
      <!--<i class="icon icon-sp_ic_spfl"></i>-->
      <!--<span>商品分类</span>-->
      <!--</router-link>-->
      <li class="top-item" @click="gotoList">
        <i class="icon icon-sp_ic_splb"></i>
        <span>商品列表</span>
      </li>
      <li class="top-item" @click="navigateFun({keyWord:`commodityList`,value:{pageType:'directMatch'}})"
          v-if="isDirectMatch" style="width: 40%;">
        <img style="width:.85rem;height: .85rem;" src="/static/icons/sp_ic_spfls@2x.png"/>
        <span class="two-line" style="line-height: 110%;">易久批备货商品</span>
      </li>
      <li @click="navigateFun({keyWord:`addCommodity`,value:{comeInType:'addProduct'}})" class="top-item">
        <i class="icon icon-sp_ic_xzsp"></i>
        <span>新增商品</span>
      </li>

    </ul>
    <!--分类-->
    <div class="wineTypeList" v-for="item in categoryList" :key="item.categoryName"
    >
      <div class="wineType">
        <span>{{item.categoryName}}</span>
        <p @click="checkAll(item.categoryName)">查看全部<i></i></p>
      </div>
      <ul class="type-list" v-if="item.listbrand && item.listbrand.length!==0">
        <li v-for="items in item.listbrand" :key="items.brandName"
            @click="gotoCommodityList(item.categoryName,items.brandName)">
          {{items.brandName}}
        </li>
      </ul>
      <!--空页面-->
    </div>
    <!--拿不到经销商信息时弹框-->
    <message-dialog :messageDialogVisible="messageDialogVisible" @closeDialog="closeDialog"
                    @ensureDialog="ensureDialog" ref="dialog"></message-dialog>
    <div class="empty" v-if="!categoryList||!categoryList.length">
      <span>您还没有商品，</span>
      <span>赶快管理商品信息吧~</span>
    </div>
    <div class="blank"></div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapMutations} from 'vuex';
  import MessageDialog from "@/components/common/MessageDialog"

  export default {
    name: "commodity-show",
    data() {
      return {
        categoryList: [],
        messageDialogVisible: false,
      }
    },
    computed: {
      isDirectMatch() {
        return this.userInfo.dealerType === 1
      },
      ...mapState(`user`, [`userInfo`]),
      ...mapState(`dealerInfo`, [`shopId`]),
    },
    components: {
      MessageDialog
    },
    activated() {
      this.$store.dispatch('category/getCategoryList')
        .then(data => {
          this.categoryList = data
        })
        .catch(e => {
          console.log(e)
        })
    },
    methods: {
      gotoList() {
        //根据auditState和dealerState 来判断是否可以使用功能
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: `commodityList`})
        }
      },
      navigateFun(parameter) {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: parameter.keyWord, query: parameter.value})
        }
      },

      checkAll(name) {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: `commodityList`, params: {categoryName: name, brandFlag: 'all'}})
        }
        this.setDefaultName(name)
      },
      gotoCommodityList(categoryName, brandName) {
        if ( this.userInfo.dealerState == -1) {
          this.$refs[`dialog`].showPop()
        } else if (this.userInfo.dealerState == 0) {
          return this.$toast({message: `您的信息还在审核中，暂无法用此功能`})
        } else {
          this.$router.push({name: `commodityList`, params: {categoryName, brandName}})
        }
        this.setDefaultSelect(brandName)
        this.setDefaultName(categoryName)
      },
      closeDialog(dialogState) {
        this.$refs[`dialog`].hide()
      },
      ensureDialog(dialogState, type) {
        if (this.userInfo.dealerState == -1) {
          this.$router.push({name: `myInformation`, params: {type}})
        } else {
          this.$router.push({name: `applyShopEntryStepTwo`})
        }
        this.$refs[`dialog`].hide()
      },
      ...mapMutations(`category`, [`setDefaultSelect`, `setDefaultName`])
    },
  }
</script>

<style scoped>
  #commodityShow {
    flex: 1;
    margin-left: 2.56rem;
  }

  .pageEntry-ul {
    display: flex;
    flex-direction: row;
    background: #fff;
    justify-content: space-around;
  }

  .pageEntry-ul li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #333;
    font-size: 0.347rem;
  }

  .pageEntry-ul li span {
    font-size: 0.35rem;
    color: #333;
    padding-top: .32rem;
  }

  .top-item {
    width: 30%;
    padding: .43rem 0;
    box-sizing: border-box;
  }

  .wineType {
    display: flex;
    flex-direction: row;
    padding: 0.347rem 0.32rem;
    justify-content: space-between;
  }

  .wineType span {
    color: #333;
    font-size: 0.373rem;
  }

  .wineType p {
    color: #999;
    font-size: 0.347rem;
    display: flex;
    align-items: center;
  }

  .wineType p i {
    width: 0.347rem;
    height: 0.347rem;
    display: inline-block;
    background-image: url(./../../../../static/icons/ic_jt_hui_36@2x.png);
    -webkit-background-size: 0.347rem;
    background-size: 0.347rem;
  }

  .type-list {
    display: flex;
    flex-direction: row;
    background: #fff;
    margin: 0 0.16rem;
    flex-wrap: wrap;
    padding-top: 0.43rem;
  }

  .type-list li {
    width: 33%;
    font-size: 0.373rem;
    color: #333;
    padding-bottom: 0.43rem;
  }

  .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.53rem 0;
    margin-top: 4rem;

  }

  .empty span {
    padding-bottom: 0.21rem;
    color: #999;
    font-size: 0.32rem;
  }

  .blank {
    width: 100%;
    height: 1.37rem;
  }


</style>
