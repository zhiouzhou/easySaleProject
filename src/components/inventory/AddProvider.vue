<template>
  <div>
    <nav_title :title="title"></nav_title>
    <div class="cell">
      <span class="ft-40r color-333">供应商名称</span>
      <input v-model.trim="provider.suppilerName" placeholder="请输入"/>
    </div>
    <div class="cell">
      <span class="ft-40r color-333">联系人</span>
      <input v-model.trim="provider.contactor" placeholder="请输入"/>
    </div>
    <div class="cell">
      <span class="ft-40r color-333">联系电话</span>
      <input v-model.trim="provider.contactNumber" placeholder="请输入"/>
    </div>
    <div class="cell">
      <span class="ft-40r color-333">地址</span>
      <input v-model.trim="provider.address" placeholder="请输入"/>
    </div>
    <div @click="pageType===`add`?saveProvider():editProvider()" class="fixed_bottom">保存</div>
  </div>
</template>

<script>
  import Navigator from '@/components/common/Navigator'
  import http from '@/assets/models/providerAPIs'
  import {mapState} from 'vuex'

  export default {
    name: "addProvider",
    data() {
      return {
        provider: {},
        pageType: `add`
      }
    },
    components: {
      nav_title: Navigator
    },
    mounted() {
      if (this.$route.query.provider) {
        this.provider = this.$route.query.provider
        this.pageType = `edit`
      }
    },
    methods: {
      checkValid() {
        let myProvider = this.provider
        let errList = []
        if (!myProvider.suppilerName) {
          errList.push({errMsg: `请填写供应商名称`})
        } else if (!myProvider.contactor) {
          errList.push({errMsg: `请填写联系人`})
        } else if (!myProvider.contactNumber) {
          errList.push({errMsg: `请填写联系电话`})
        } else if (!myProvider.address) {
          errList.push({errMsg: `请填写地址`})
        }

        if (errList.length) {
          this.$toast({message: errList[0].errMsg})
          return false
        } else {
          return true
        }
      },
      saveProvider() {
        if (!this.checkValid()) return
        let param = {
          address: this.provider.address,
          contactNumber: this.provider.contactNumber,
          contactor: this.provider.contactor,
          dealerId: this.shopId,
          suppilerName: this.provider.suppilerName,
        }
        http.addProvider({param})
          .then(() => {
            this.$toast({message: `新增成功`, duration: 1500})
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          })
      },
      editProvider() {
        if (!this.checkValid()) return
        let param = {
          address: this.provider.address,
          contactNumber: this.provider.contactNumber,
          contactor: this.provider.contactor,
          dealerId: this.shopId,
          suppilerName: this.provider.suppilerName,
          suppilerId: this.provider.suppilerId
        }
        http.editProvider({param})
          .then(() => {
            this.$toast({message: `修改成功`, duration: 1500})
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
          })
      },

    },
    computed: {
      title() {
        return this.pageType === `add` ? `新增供应商` :
          this.pageType === `edit` ? `编辑供应商` : ``
      },
      ...mapState(`dealerInfo`, [`shopId`])
    }

  }
</script>

<style lang="stylus" scoped>
  .cell {
    font-size .37rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 1.17rem;
    padding: 0 .32rem;
    width 100%;
    border-bottom .01rem solid #EDEDED;
    > span {
      min-width 2rem;
      text-align left;
    }
    > input {
      flex 1;
      margin-left .32rem;
      text-align right;
      outline none;
    }
  }

  .fixed_bottom {
    position: fixed;
    height: 1.307rem;
    border: 0px;
    background: #0096FF;
    bottom: 0;
    width: 100%;
    font-size: 0.453rem;
    line-height: 1.307rem;
    vertical-align: middle;
    color: #fff;
  }

</style>
