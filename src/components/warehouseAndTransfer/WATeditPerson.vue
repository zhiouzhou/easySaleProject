<template>
  <div style="background-color: #f6f6f6;">
    <title-nav :title="title"></title-nav>
    <!--委托配送 收货人-->
    <div class="main-content" v-if="pageType===`applyDelivery`">
      <div>
        <span class="color-E53935">*</span>
        <span class="color-333">姓名</span>
        <input class="color-333" placeholder="请输入" v-model.trim="person.contact"/>
      </div>
      <div>
        <span class="color-E53935">*</span>
        <span class="color-333">电话号码</span>
        <input class="color-333" type="number" placeholder="请输入" v-model.trim="person.phone"/>
      </div>
      <div @click="showLocationPicker">
        <span class="color-E53935">*</span>
        <span class="color-333">所在地区</span>
        <div class="location-wrap" v-if="person.province">{{person.province}} {{person.city}} {{person.county}}</div>
        <div class="location-wrap color-CCC" v-else>请选择</div>
        <i class="icon icon-ic_jt_hui_36"></i>
      </div>
      <div>
        <span class="color-E53935">*</span>
        <span class="color-333">详细地址</span>
        <input class="color-333" placeholder="请输入" v-model.trim="person.detailAddress"/>
      </div>
    </div>
    <!--出库 提货人-->
    <div class="main-content" v-if="pageType===`outBound`">
      <div>
        <span class="color-E53935">*</span>
        <span class="color-333">姓名</span>
        <input class="color-333" placeholder="请输入" v-model.trim="person.consigneerName"
               :disabled="operateType===`edit`"/>
      </div>
      <div>
        <span class="color-E53935">*</span>
        <span class="color-333">电话号码</span>
        <input class="color-333" type="number" placeholder="请输入" v-model.trim="person.phone"/>
      </div>
      <div>
        <span class="color-E53935">*</span>
        <span class="color-333">身份证号码</span>
        <input class="color-333" placeholder="请输入" v-model.trim="person.idNumber" :disabled="operateType===`edit`"/>
      </div>
    </div>
    <!--底部按钮操作-->
    <div style="height: 1.31rem;"></div>
    <div class="bottom-button" v-if="operateType===`add`" @click="pageType===`outBound`?addPicker():addReceiver()">保存
    </div>
    <div class="bottom-button" v-if="operateType===`edit`">
      <div class="button grey" @click="pageType===`outBound`?deletePicker():deleteReceiver()">删除</div>
      <div class="button" @click="pageType===`outBound`?updatePicker():updateReceiver()">保存</div>
    </div>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import http from '@/assets/models/warehouseAndTransferAPIs'

  let locationData = []
  export default {
    name: 'WATeditPerson',
    props: [],
    data() {
      return {
        pageType: ``,
        operateType: ``,
        locationDataList: [],
        person: {}
      }
    },
    components: {
      'title-nav': Navigator
    },
    mounted() {
      this.pageType = this.$route.params.pageType
      this.operateType = this.$route.params.operateType
      this.person = this.$route.query.person || {}
      if (this.pageType === `applyDelivery`) {

        this.locationPicker = this.$createCascadePicker({
          title: '选择地址',
          data: locationData,
          selectedIndex: [0, 0, 0],
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        })
        http.getLocaticonList()
          .then(data => {
            locationData = this.rebuildLocation(data.data)
            this.locationPicker.setData(locationData)
          })
          .catch(e => {
          })
      }
    },
    methods: {
      rebuildLocation(list) {
        list.forEach(province => {
          province.text = province.provinceName
          province.value = province.provinceName
          province.children = province.countyRegions
          province.children.forEach(city => {
            city.text = city.cityName
            city.value = city.cityName
            city.children = city.countyRegions
            city.children.forEach(county => {
              county.text = county.countyName
              county.value = county.countyName
            })
          })
        })
        return list
      },
      showLocationPicker() {
        this.locationPicker.show()
      },
      selectHandle(selectedVal, selectedIndex, selectedText) {
        this.$set(this.person, `province`, selectedText[0])
        this.$set(this.person, `city`, selectedText[1])
        this.$set(this.person, `county`, selectedText[2])
        this.$set(this.person, `street`, ``)
      },
      cancelHandle() {

      },
      addReceiver() {
        if (!this.checkValid()) return
        let {province, city, county, street, detailAddress, contact, phone} = this.person
        http.addReceiver({
          param: {province, city, county, street, detailAddress, contact, phone}
        })
          .then(() => {
            this.operationFinished(`新增成功`)
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      deleteReceiver() {
        http.deleteReceiver({param: this.person.addressId})
          .then(() => {
            this.operationFinished(`删除成功`)
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      updateReceiver() {
        if (!this.checkValid()) return
        let {addressId, province, city, county, street, detailAddress, contact, phone} = this.person
        http.updateReceiver({
          param: {addressId, province, city, county, street, detailAddress, contact, phone}
        })
          .then(() => {
            this.operationFinished(`修改成功`)
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      /*------------------------*/
      addPicker() {
        if (!this.checkValid()) return
        http.addPicker({
          param: {
            idNumber: this.person.idNumber,
            phone: this.person.phone,
            consigneerName: this.person.consigneerName,
          }
        })
          .then(() => {
            this.operationFinished(`新增成功`)
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      deletePicker() {
        http.deletePicker({param: this.person.idNumber})
          .then(() => {
            this.operationFinished(`删除成功`)
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      updatePicker() {
        if (!this.checkValid()) return
        http.updatePicker({param: {idNumber: this.person.idNumber, phone: this.person.phone}})
          .then(() => {
            this.operationFinished(`编辑成功`)
          })
          .catch(e => {
            this.$toast({message: e})
          })
      },
      checkValid() {
        let errorList = []
        let reg = /^1[3|4|5|7|8][0-9]{9}$/;
        let regCord = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])|([1−9]\d5\d2((0[1−9])|(10|11|12))(([0−2][1−9])|10|20|30|31)\d2[0−9Xx])/;
        //校验过程
        if (this.pageType === `applyDelivery`) {
          if (!this.person.contact) errorList.push({errorCode: 0, errMsg: `请填写正确的姓名`})
          if (!this.person.phone) errorList.push({errorCode: 1, errMsg: `请填写正确的电话号码`})
          if (!(reg.test(this.person.phone))) errorList.push({errorCode: 1, errMsg: `手机号格式不正确`})
          if (!this.person.province) errorList.push({errorCode: 2, errMsg: `请选择省份`})
          if (!this.person.city) errorList.push({errorCode: 2, errMsg: `请选择城市`})
          //可能会出现没有区，街道的情况，比如湖北省天门市，所以不做判断
          if (!this.person.detailAddress) errorList.push({errorCode: 3, errMsg: `请填写详细地址`})
        } else if (this.pageType === `outBound`) {
          if (!this.person.consigneerName) errorList.push({errorCode: 0, errMsg: `请填写正确的姓名`})
          if (!this.person.phone) errorList.push({errorCode: 1, errMsg: `请填写正确的电话号码`})
          if (!(reg.test(this.person.phone))) errorList.push({errorCode: 1, errMsg: `手机号格式不正确`})
          if (!this.person.idNumber) errorList.push({errorCode: 3, errMsg: `请填写正确的身份证号码`})
          if (!regCord.test(this.person.idNumber)) errorList.push({errorCode: 3, errMsg: `身份证格式不正确`})
        }
        //校验结果
        if (!errorList.length) {
          return true
        } else {
          this.$toast({message: errorList[0].errMsg})
          return false
        }
      },
      operationFinished(txt) {
        this.$toast({message: txt, duration: 1500})
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }
    },
    computed: {
      title() {
        let preStr = this.operateType === `add` ? `新增` : `编辑`
        let sufStr = this.pageType === `applyDelivery` ? `收货人` : `提货人`
        return `${preStr}${sufStr}`
      },
    },
  }
</script>


<style lang="stylus" scoped>
  .main-content {
    background-color #fff;
    padding 0 .32rem;
    box-sizing border-box;
    > div {
      height 1.28rem;
      display: flex;
      flex-direction row;
      justify-content flex-start;
      align-items center;
      border-bottom .01rem solid #ededed;
      color #333;
      font-size .4rem;
      > input {
        flex 1;
        text-align right;
        outline none;
        background-color transparent;
        margin-left .32rem;
      }
    }
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
    color #fff;
    font-size .45rem;
    line-height 1.31rem;
  }

  .button {
    flex 1;
    height 100%;
  }

  .location-wrap {
    flex 1;
    font-size .40rem;
    text-align right;
  }

  .grey {
    background-color #bdbdbd;
  }
</style>
