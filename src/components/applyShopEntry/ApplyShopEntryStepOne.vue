<template>
  <div class="page">
    <title-nav :title="title"></title-nav>
    <div class="blue-bg">
      <img class="img-progress" src="/static/icons/txrzxx_jdt_dyb@2x.png"/>
    </div>
    <div class="content-wrap">
      <div class="content-title ft-43r color-099AFF">经销商信息</div>
      <div class="content">
        <!--经销商详细地址-->
        <div class="form-item">
          <span class="ft-40r color-333"><span class="color-E53935">*</span>详细地址</span>
          <input class="input-class ft-40r color-333" placeholder="请输入" v-model.trim="dealerDetail.address"/>
        </div>
        <!--经销商希望开通的城市-->
        <div class="form-item" @click="showAddressPicker">
          <span class="ft-40r color-333"><span class="color-E53935">*</span>希望开通的城市</span>
          <span v-if="!dealerDetail.hopeProvince" class="ft-40r color-999" style="flex: 1;text-align: right;">请选择</span>
          <span v-else class="ft-40r color-333" style="flex: 1;text-align: right;">{{dealerDetail.hopeProvince}}</span>
          <i class="icon icon-ic_jt_hui_36"></i>
        </div>
      </div>
    </div>
    <div class="button ft-43r color-fff" @click="nextStep">下一步</div>

    <!--选择城市-->
    <cube-popup type="my-popup" position="bottom" :maskClosable="true" ref="showPicker">
      <div class="pickerBox">
        <div class="pickerHeader color-333333 ft-43r">
          所在地区
          <i class="icon icon-pop_ic_close" style="float: right" @click="closePicker"></i>
        </div>
        <section class="title ft-40r">
          <div class="area" @click="provinceSelected()">
            <span :class="(province||!city)?'active':''">{{provinceName?provinceName:'请选择'}}</span>
            <i class="line1" v-show="province||!city"></i>
          </div>

          <div class="area" style="margin-left: 1rem" @click="citySelected()" v-show="provinceName">
            <span :class="city?'active':''">{{cityName?cityName:'请选择'}}</span>
            <i class="line1" style="left: 2.5rem" v-show="city"></i>
          </div>

        </section>
        <ul class="ulBox ft-40r color-333333">
          <li class="addList" v-for="(item,k) in showProvinceList" :key="item.id" :class="item.selected?'active':''"
              @click="getProvinceId(item.province,k)" v-show="showProvince">{{item.province}}
            <i v-show="item.selected" style="margin-left: 0.2rem;padding-top: 0.4rem" class="icon icon-pop_ic_xz"></i>
          </li>
          <li class="addList" v-for="(item,k) in showCityList" :key="item.id" :class="item.selected?'active':''"
              @click="getCityId(item,k)" v-show="showCity">{{item.name}}
            <i v-show="item.selected" style="margin-left: 0.2rem;" class="icon icon-pop_ic_xz"></i>
          </li>
        </ul>
      </div>
    </cube-popup>
  </div>
</template>


<script>
  import Navigator from "@/components/common/Navigator"
  import {mapState, mapMutations} from 'vuex'
  import {Popup} from 'cube-ui';
  import http from '@/assets/models/userAPIs'

  export default {
    name: 'ApplyShopEntryStepOne',
    props: [],
    data() {
      return {
        title: '填写入驻信息',
        //控制选中时的样式变化
        province: false,
        city: false,
        //选中的城市与省的名称
        provinceName: '',
        cityName: '',
        //city和province列表展示
        showProvince: false,
        showCity: false,
        //存放city和province的数组
        showProvinceList: [],
        showCityList: [],
        dealerDetail: {
          address: ``,//详细地址
          cityId: 0,//希望开通城市的id
          hopeProvince: ``,//希望开通城市
          id: 0,//经销商id
        }
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-pop': Popup,
    },
    mounted() {
      this.dealerDetail.id = this.shopId
      this.getListProvinceAndSubCity();
    },
    methods: {
      formValid() {
        let errList = []
        if (!this.dealerDetail.address) {
          errList.push({errMsg: `请填写详细地址`})
        }
        if (!this.dealerDetail.hopeProvince) {
          errList.push({errMsg: `请填写希望开通城市`})
        }
        if (errList.length !== 0) {
          this.$toast({message: errList[0].errMsg})
        }
        return errList.length === 0
      },
      nextStep() {
        if (!this.formValid()) return null
        this.setDealerDetail(this.dealerDetail)
        this.$router.replace({name: `applyShopEntryStepTwo`})
      },

      //选择具体的省
      getProvinceId(name, index) {
        this.provinceName = name;
        //重新选省份之后，清空城市
        this.cityName = false;
        //选择点击当前
        this.showProvinceList.map(a => a.selected = false);
        this.showProvinceList[index].selected = true;

        this.findJiupiCityByProvinceName();
      },
      //选择具体的市
      getCityId(city, index) {
        this.cityName = city.name;
        this.dealerDetail.cityId = city.id;
        this.showCityList.map(a => a.selected = false)
        this.showCityList[index].selected = true;
        //选好后赋值给address
        this.dealerDetail.hopeProvince = this.provinceName + '' + this.cityName;
        this.$refs.showPicker.hide();
      },
      //所有的省的列表
      provinceSelected() {
        //清除市级列表
        this.showCityList = false;
        // 清除市级选项
        this.city = false;
        //this.cityName=false;
        // 选项页面的切换
        this.showProvince = true;
        this.showCity = false;
      },
      //省所对应的所有城市的列表
      citySelected() {
        this.showProvince = false;
        this.showCity = true;
        this.findJiupiCityByProvinceName();
      },
      showAddressPicker() {
        this.$refs.showPicker.show();
        //选择的时候如果已经有城市了，就展示城市列表
        if (this.cityName) {
          this.showCity = true
        } else {
          this.showProvince = true;
        }
      },
      closePicker() {
        this.$refs.showPicker.hide();
      },
      getListProvinceAndSubCity() {
        http.getListProvinceAndSubCity({}).then(data => {
          this.showProvinceList = data.data;
        }).catch(e => {
          console.log(e)
        })
      },
      //根据选择的省获取相应的城市
      findJiupiCityByProvinceName() {
        http.findJiupiCityByProvinceName({param: this.provinceName}).then(data => {
          //将获取的城市值赋给数组showCityList，隐藏省的表，显示城市的表
          this.showCityList = data.data;
          this.showProvince = false;
          this.showCity = true;
          this.city = true;
        }).catch(e => {
          console.log(e)
        })
      },
      ...mapMutations(`applyShopEntry`, [`setDealerDetail`])
    },
    computed: {
      ...mapState(`dealerInfo`, [`cityId`, `shopId`, `userName`])
    },
  }
</script>


<style lang="stylus" scoped>
  .page {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    height 100vh;
    background-color #f6f6f6;
  }

  .blue-bg {
    width: 100%;
    height: 3.25rem;
    background: linear-gradient(270deg, rgba(13, 137, 245, 1) 0%, rgba(73, 178, 242, 1) 100%);
  }

  .img-progress {
    width 9rem;
    height 1.23rem;
    margin .35rem auto .43rem auto;
  }

  .content-wrap {
    margin 0 .32rem;
    flex 1;
    background-color #fff;
    display: flex;
    flex-direction column;
    justify-content flex-start;
    align-items center;
    margin-top -.8rem;
  }

  .content-title {
    height .85rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0.05rem 0.11rem 0 rgba(73, 169, 243, 0.2);
    border-radius: 0.59rem;
    text-align center;
    line-height .85rem;
    font-weight 600;
    margin-top -.43rem;
    padding 0 .55rem;
  }

  .content {
    display flex;
    flex-direction column;
    justify-content flex-start;
    align-items stretch;
    width 100%;
    .form-item {
      margin 0 .37rem;
      min-height 1.28rem;
      display flex;
      flex-direction row;
      justify-content space-between;
      align-items center;
      border-bottom .02rem solid #ededed;
    }
    .input-class {
      flex 1;
      margin-left .32rem;
      text-align right;
      outline none;
    }
  }

  .button {
    margin .64rem;
    height: 1.17rem;
    background: rgba(0, 150, 255, 1);
    box-shadow: 0.11rem 0.13rem 0.16rem 0 rgba(0, 150, 255, 0.2);
    border-radius: 0.59rem;
    text-align center;
    line-height 1.17rem;
  }

  .pickerBox {
    background-color white;
    height 10.67rem;
    display: flex;
    flex-direction: column;
    .pickerHeader {
      padding 0.4rem 0.2rem;
      position fixed;
      top 0;
      text-align center;
      width 100%;
    }
    .title {
      position: fixed;
      top: 1rem;
      width: 100%;
      text-align left;
      padding 0.3rem 0.3rem 0.2rem 0.32rem;
      border-bottom 0.01rem solid #EDEDED;
      display flex;
      flex-direction row;

    }
    .ulBox {
      flex: 1;
      margin-top: 2rem;
      text-align left;
      height 7rem;
      overflow: auto;
      margin-bottom 0.4rem;
      line-height 0.8rem;
    }
  }

  .addList {
    width: 100%;
    padding-left: 0.32rem;
  }

  .line1 {
    width: 1.25rem;
    height: 0.053rem;
    background: #0096FF;
    top: 0.85rem;
    position: absolute;
    bottom: 0;
    left: 0.3rem;
  }

  .active {
    color #099AFF
  }

</style>
