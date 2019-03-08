<template>
  <div id="brandList">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack('title')"></i>
      <span>品牌列表</span>
    </div>
    <div class="blank"></div>
    <div class="edit">
      <p>商品分类><input type="text" :value="thisList(commodityId).commodityName" disabled/></p>
      <input type="button" @click="edit" v-model="editButton"/>
    </div>
    <ul class="brand-ul">
      <li v-for="(item) in currentBrandList" :key="item.brandId" class="brandList">
        <input type="text" v-model="item.brandName" v-bind:disabled="disabled" name="brandName" id="brandName" ref="brandName" v-validate="'required'" />
        <i v-if="cancelShow==true" @click="removeLists(commodityId, item.brandId)"></i>
      </li>
      <li class="addList" v-show="newListShow==true">
        <input type="text" placeholder="请输入品牌名称" v-model="addBrand"/>
        <input type="button" value="取消" @click="cancel"/>
        <input type="button" value="完成" @click="finish(commodityId,addBrand)"/>
      </li>
    </ul>
    <div class="addBrand" @click="addBrands">
      <i></i>
      <span>新增品牌</span>
    </div>
    <!--退出未保存弹框-->
    <cube-pop position="center" ref="title">
      <div class="tips">
        <p class="popHeader">温馨提示</p>
        <p class="popContent">您还没有保存，确定退出？</p>
        <div class="selectButton">
          <span @click="cancelPop('title')">取消</span>
          <span @click="enSure('title')">确定</span>
        </div>
      </div>
    </cube-pop>
  </div>
</template>

<script>
  import {createNamespacedHelpers} from 'vuex'

  const {mapGetters, mapActions} = createNamespacedHelpers('manageBrand')
  import Navigator from "@/components/common/Navigator";
  import {Popup} from 'cube-ui'

  export default {
    name: "brand-list",
    data() {
      return {
        transitionName: "slide-left",
        title: '品牌列表',
        cancelShow: false,
        disabled: true,
        editButton: '编辑',
        newListShow: false,
        addBrand: '',
        commodityId: '',
        newBrand: {},
        currentBrandList:[]   //当前的品牌列表
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-pop': Popup,
    },
    methods: {
      goBack(refId) {
        if(this.editButton=='保存'){
          this.$refs[refId].show()
        }else{
          this.$refs[refId].hide()
          this.$router.go(-1)
        }
      },
      enSure() {
        this.$router.go(-1)
      },
      cancelPop(refId) {
        this.$refs[refId].hide()
      },
      edit() {
        this.cancelShow = !this.cancelShow;
        this.disabled = !this.disabled
        if (this.disabled == true) {
          this.editButton = '编辑'
        } else {
          this.editButton = '保存'
        }
      },
      removeLists(cid, bid) {
        this.$store.dispatch('manageBrand/removeList', {cid, bid})
      },
      addBrands() {
        this.addBrand = ''
        this.newListShow = true;
      },
      cancel() {
        this.newListShow = false;
      },
      finish(cid, addBrand) {
        this.$store.dispatch('manageBrand/finish', {cid, addBrand})
          .then(data => {
            this.newListShow = false
          })
          .catch(e => {

          })
      },

    },
    created() {
      this.commodityId = this.$route.params.id;
      this.currentBrandList = this.thisList(this.commodityId).brandList
    },
    computed: {
      ...mapGetters({thisList: 'getBrandList'})
    }
  }
</script>

<style scoped lang="stylus">
  #brandList {
    background: #f6f6f6;
  }

  .header {
    height: 1.17rem;
    background: linear-gradient(-90deg, rgba(13, 137, 245, 1), rgba(73, 178, 242, 1));
    width: 100%;
    text-align: center;
    line-height: 1.17rem;
    position: fixed;
    top: 0;
    left: 0;
    color: #fff;
    font-size: 0.48rem;
    display: flex;
    flex-direction: row;
    align-items center;
    padding-left: 0.24rem;
    span {
      padding-left: 3rem;
      color: #fff;
      font-size: 0.48rem;
    }
  }

  .blank {
    height: 1.17rem;
  }

  .edit {
    background: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.267rem 0.32rem;
    p {
      font-size: 0.4rem;
      color: #999;
      input {
        font-size: 0.4rem;
        color: #333;
        border: 0;
        outline: 0;
        background: #fff;
      }
    }
    input {
      width: 1.813rem;
      height: 0.747rem;
      border-radius: 0.053rem;
      border: 1px solid rgba(9, 154, 255, 1);
      background: #fff;
      outline: 0;
      color: #099AFF;
      font-size: 0.373rem;
    }
  }

  .brand-ul {
    background: #ffffff;
    margin-top: 0.16rem;
    padding: 0 0.32rem;
    li:nth-last-child(2) {
      border-bottom: 0;
    }
    .brandList {
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items: center;
      padding: 0.44rem 0;
      border-bottom: 1px solid #ededed;
      font-size: 0.4rem;
      color: #333;
      input {
        border: 0;
        outline: 0;
        background: #fff;
        font-size: 0.4rem;
        color: #333;
      }
      i {
        width: 0.48rem;
        height: 0.48rem;
        display: block;
        background-image: url(./../../../static/icons/ic_shanchu@2x.png);
        -webkit-background-size: 0.48rem;
        background-size: 0.48rem;
        background-repeat: no-repeat;
      }
    }
    .addList {
      display: flex;
      flex-direction: row;
      justify-content space-between;
      align-items: center;
      padding: 0.267rem 0;
      border-top: 1px solid #ededed;
      font-size: 0.4rem;
      color: #333;
      input {
        &:nth-child(1) {
          border: 0;
          outline: 0;
          background: #fff;
          font-size: 0.4rem;
          color: #333;
        }
        &:nth-child(2), &:nth-child(3) {
          outline: 0;
          width: 1.813rem;
          height: 0.747rem;
          border-radius: 0.053rem;
          border: 1px solid rgba(153, 153, 153, 1);
          background: #fff;
          color: #666;
          font-size: 0.373rem;
        }

      }
    }
  }

  .addBrand {
    width: 100%;
    background: #0096FF;
    color: #fff;
    height: 1.307rem;
    display: flex;
    flex-direction: row;
    justify-content center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    i {
      display: block;
      width: 0.48rem;
      height: 0.48rem;
      background-image: url(./../../../static/icons/ic_tianjia_bai@2x.png)
      background-repeat: no-repeat;
      -webkit-background-size: 0.48rem;
      background-size: 0.48rem;
    }
    span {
      font-size: 0.453rem;
      padding-left: 0.213rem;
    }
  }

  .tips {
    background: #fff;
    color: #333;
    -webkit-border-radius: 0.43rem;
    -moz-border-radius: 0.43rem;
    border-radius: 0.43rem;
    font-size: 0.4rem;
    width: 7.68rem;
    .popHeader {
      text-align center;
      padding-top: 0.43rem;

    }
    .popContent {
      padding: 0.64rem 0.44rem 0.44rem;
      text-align: left;
      border-bottom: 1px solid #ededed;
    }
    .selectButton {
      display: flex;
      flex-direction: row;
      font-size: 0.43rem;
      span {
        flex: 1;
        border-right: 1px solid #ededed;
        padding: 0.37rem 0;
        &:nth-child(2) {
          color: #099AFF
          border-right: 0;
        }
      }
    }
  }
</style>
