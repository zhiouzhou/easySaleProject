<template>
  <div style="background-color: #F6F6F6 ">
    <title-nav v-bind:title="title"></title-nav>
    <div class="box">

      <div>
        <span class="ft-40r color-333" style="width: 1.8rem"><span class="choose-type-sp">*</span>仓库名称</span>
        <div class="ft-40r color-333">
          <input type="text" id="storename" name="storename" class="color-333 box-input"
                 style="text-align: right;width: 7rem"
                 v-model="name" placeholder="请输入"
                 v-validate="'required'" ref="storename"/>
        </div>
      </div>
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>地址</span>
        <div class="ft-40r textDiv" @click="fixPosition">
          <textarea placeholder="请输入" readonly="readonly" class="ft-40r textBox">{{provinceName}}{{cityName}}{{districtName}}{{streetName}}</textarea>
          <i class="icon icon-xk_youjiantou_copy" style="margin-top: -0.1rem;margin-right: -0.2rem"></i>
          <!--<i class="icon icon-ic_dw_dj" style="margin-left: 0.1rem" ></i>-->
        </div>
      </div>
      <div>
        <span class="ft-40r color-333" style="width: 1.8rem"><span class="choose-type-sp">*</span>详细地址</span>
        <div class="ft-40r color-333">
          <input type="text" id="detailAddress" name="detailAddress" class="color-333 box-input"
                 style="text-align: right;width: 7rem"
                 v-model="detailAddress" placeholder="请输入"
                 v-validate="'required'" ref="detailAddress"/>
        </div>
      </div>
    </div>
    <!--选择城市-->
    <cube-popup type="my-popup" position="bottom" :maskClosable="true" ref="showPicker">
      <div class="pickerBox">
        <div class="pickerHeader color-333333 ft-43r">
          所在地区
          <i class="icon icon-pop_ic_close" style="float: right" @click="closePicker"></i>
        </div>
        <section class="title ft-40r">
          <div class="area" @click="provinceSelected()">
            <span :class="province?'active':''">{{provinceName?provinceName:'请选择'}}</span>
            <!--<i class="line1" v-show="province"></i>-->
          </div>

          <div class="area" style="margin-left: 1rem" @click="citySelected()" v-show="provinceName">
            <span :class="city?'active':''">{{cityName?cityName:'请选择'}}</span>
            <!--<i class="line1" style="left: 2.5rem" v-show="city"></i>-->
          </div>

          <div class="area" style="margin-left: 1rem" @click="districtSelected()" v-show="cityName">
            <span :class="district?'active':''">{{districtName?districtName:'请选择'}}</span>
            <!--<i class="line1" style="left: 4.7rem" v-show="district"></i>-->
          </div>
          <div class="area" style="margin-left: 1rem" @click="streetSelected()" v-show="districtName">
            <span :class="street?'active':''">{{streetName?streetName:'请选择'}}</span>
            <!--<i class="line1" style="left: 6.9rem" v-show="street"></i>-->
          </div>
        </section>
        <ul class="ulBox ft-40r color-333333">
          <li class="addList" v-for="(item,k) in addressList" :key="item.id" :class="item.selected?'active':''"
              @click="getNextAddress(item.code,item,k)">{{item.name}}
            <i v-show="item.selected" style="margin-left: 0.2rem;padding-top: 0.4rem" class="icon icon-pop_ic_xz"></i>
          </li>
          <!--<li class="addList" v-for="(item,k) in showProvinceList" :key="item.id" :class="item.selected?'active':''"-->
          <!--@click="getProvinceId(item.province,k)" v-show="showProvince">{{item.province}}-->
          <!--<i v-show="item.selected" style="margin-left: 0.2rem;padding-top: 0.4rem" class="icon icon-pop_ic_xz"></i>-->
          <!--</li>-->
          <!--<li class="addList" v-for="(item,k) in showCityList" :key="item.id" :class="item.selected?'active':''"-->
          <!--@click="getCityId(item,k)" v-show="showCity">{{item.name}}-->
          <!--<i v-show="item.selected" style="margin-left: 0.2rem;" class="icon icon-pop_ic_xz"></i>-->
          <!--</li>-->
          <!--<li class="addList" v-for="(item,k) in showDistrictList" :key="item.id" :class="item.selected?'active':''"-->
          <!--@click="getDistrictId(item,k)" v-show="showDistrict">{{item.name}}-->
          <!--<i v-show="item.selected" style="margin-left: 0.2rem;" class="icon icon-pop_ic_xz"></i>-->
          <!--</li>-->
        </ul>
      </div>
    </cube-popup>
    <div class="footer" @click="handleSave">
      <span style="color: white;font-size: 0.45rem">

        保存</span>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import {createNamespacedHelpers} from 'vuex';
  import http from "../../assets/models/productAPIs";
  import {Popup} from 'cube-ui';

  const {mapState, mapGetters} = createNamespacedHelpers('wareHouseInfo');
  export default {
    name: "addStore",
    data() {
      return {
        title: '新增仓库',
        id: '',
        detailAddress: '',
        name: '',
        code: ``,
        //控制选中时的样式变化
        province: true,
        city: false,
        district: false,
        street: false,
        //选中的城市与省的名称
        provinceName: '',
        cityName: '',
        districtName: ``,
        streetName: ``,
        //city和province列表展示
        // showProvince: false,
        // showCity: false,
        // showDistrict: false,
        // showStreet:false,
        //存放city和province的数组

        // showProvinceList: [],
        // showCityList: [],
        // showDistrictList: [],
        editPage: false,//标记当前页面是否是编辑页面
        provinceCode: ``,
        cityCode: ``,
        districtCode: ``,

        addressList: [],
      }
    },
    components: {
      'title-nav': Navigator,
      'cube-pop': Popup,
    },

    created() {
      if (this.$route.params.id) {
        this.id = this.$route.params.id;
        this.detailAddress = this.$route.params.detailAddress;
        this.cityName = this.$route.params.city;
        this.provinceName = this.$route.params.province;
        this.districtName = this.$route.params.county;
        this.streetName = this.$route.params.street;
        this.name = this.$route.params.name;
        this.title = "编辑仓库";
      }
      this.findDirectChildrenByParentCode(0)
    },
    //进入小程序API中获取地址后返回
    // beforeRouteUpdate(to, from, next) {
    //   console.log('进入路由Update钩子')
    //   if (to.query.address) {
    //     this.detailAddress = to.query.address;
    //     console.log('detailAddress', this.detailAddress);
    //   }
    //   next()
    // },
    methods: {
      //获取省市区街道四级联动接口
      findDirectChildrenByParentCode(codeNum) {
        let code = codeNum;
        http.findDirectChildrenByParentCode({param: code}).then(data => {
          //过滤掉澳门
          this.addressList = data.data.filter(item => item.code != 820000);
          if (data.data.length == 0) {
            this.$refs.showPicker.hide();
            //this.$toast({message: `当前层级没有数据`});
          }
        }).catch(e => {
          console.log(e)
        })
      },
      //修改经销商自有仓库
      updateWarehouse() {
        let {detailAddress, id, name} = this;
        let province = this.provinceName;
        let city = this.cityName;
        let county = this.districtName;
        let street = this.streetName;
        http.updateWarehouse({param: {detailAddress, id, name, province, city, county, street}}).then(data => {
          this.$toast({message: `修改成功`});
          this.$router.replace('/wareHouse');
        }).catch(e => {
          console.log(e);
        })
      },
      //新增仓库接口
      addWarehouse() {
        let province = this.provinceName;
        let city = this.cityName;
        let county = this.districtName;
        let street = this.streetName;
        let {detailAddress, name} = this;
        http.addWarehouse({param: {detailAddress, name, province, city, county, street}}).then(data => {
          this.$toast({message: `新增成功`});
          this.$router.replace('/wareHouse')
        }).catch(e => {
          console.log(e)
          this.$toast({message: `新增失败`});
        })
      },
      handleSave() {
        let _this = this;
        this.$validator.validate().then((rs) => {
          if (!rs) {
            let err = _this.$validator.errors;
            let field = err.items[0].field;
            let el = _this.$refs[field];
            let clsname = 'warn-highlight';
            if (el.classList.contains(clsname)) {
              el.classList.remove(clsname);
            }
            setTimeout(() => el.classList.add(clsname), 0);
            this.$toast({
              message: err.first(field),
              iconClass: 'weui-icon-info', duration: 2000
            });
          } else {
            if (this.id) {
              this.updateWarehouse();
            } else {
              this.addWarehouse();
            }

          }
        })
      },
      //每一级选择后进行操作
      getNextAddress(code, item, index) {
        let currentLevel = item.level;
        //省
        if (currentLevel === 1) {
          if (this.provinceName != item.name) {
            this.cityName = ``;
            this.districtName = ``;
            this.streetName = ``;
            this.provinceName = item.name;
          }
          this.provinceCode = item.code;
          this.province = false;
          this.city = true;
          this.district = false;
          this.street = false;
        } else if (currentLevel === 2) {//市

          if (this.cityName != item.name) {
            this.districtName = ``;
            this.streetName = ``;
            this.cityName = item.name;
          }
          this.cityCode = item.code;
          this.province = false;
          this.city = false;
          this.district = true;
          this.street = false;
        } else if (currentLevel === 3) {//区

          if (this.districtName != item.name) {
            this.streetName = ``;
            this.districtName = item.name;
          }
          this.districtCode = item.code;
          this.province = false;
          this.city = false;
          this.district = false;
          this.street = true;
        } else {//街道
          this.streetName = item.name;
        }
        //选择点击当前
        this.addressList.map(a => a.selected = false);
        this.addressList[index].selected = true;
        this.findDirectChildrenByParentCode(code);
      },
      //所有的省的列表
      provinceSelected() {
        this.findDirectChildrenByParentCode(0);
      },
      //省所对应的所有城市的列表
      citySelected() {
        this.findDirectChildrenByParentCode(this.provinceCode);
      },
      //区的列表
      districtSelected() {
        this.findDirectChildrenByParentCode(this.cityCode);
      },
      //街道
      streetSelected() {
        this.findDirectChildrenByParentCode(this.districtCode);
      },
      closePicker() {
        this.$refs.showPicker.hide();
      },
      fixPosition() {
        this.$refs.showPicker.show();
      },
      //携带参数进入小程序，使用小程序地图定位API
      // fixPosition() {
      //   //将url地址转换成字符串，并且每次截取address前的部分，这样防止带重复的地址信息
      //   let jumpUrl = window.location.href.toString().split(`?`)[0]
      //   //http://197.168.13.36:8080/#/addStore
      //   jumpUrl = encodeURIComponent(jumpUrl)
      //   let path = `/pages/address/address?jumpUrl=${jumpUrl}`
      //   window.wx.miniProgram.navigateTo({
      //     url: path
      //   })
      //
      // }
    },
    // watch: {
    //   districtName: function (newValue) {
    //     this.streetName = ``
    //   },
    //   cityName: function (newValue) {
    //     this.districtName = ``;
    //     this.streetName = ``;
    //   },
    //   provinceName: function (newValue) {
    //     this.cityName = ``;
    //     this.districtName = ``;
    //     this.streetName = ``;
    //   },
    //
    // },
    computed: {
      //...mapGetters(['warehouseList']),
    }
  }
</script>

<style lang="stylus" scoped>
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #0096FF;
    height: 1.31rem;
    line-height: 1.31rem;
  }

  .box-input {
    outline: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .textDiv {
    width 80%;
    display flex;
    flex-direction row;
    justify-content flex-end;
    align-items center
  }

  .textBox {
    width 85%;
    border 0;
    outline none;
    padding-top 0.3rem;
    text-align right;
    height auto;
    line-height 0.45rem;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    resize none /*去掉textarea右下角的小黑点*/
  }

  .box {
    display flex;
    flex-direction column;
    align-items stretch;
    box-sizing border-box;
    margin-bottom 0.27rem;
    background-color #fff;
    margin-top 0.16rem;
    > div {
      height: 1.28rem;
      display flex;
      flex-direction row;
      padding 0 0.32rem;
      box-sizing border-box;
      justify-content space-between;
      align-items center;
      border-bottom 1px solid #ededed;

    }
  }

  .choose-type-sp {
    color red
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
      span {
        width 1rem;
        overflow hidden
      }
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

  .addList {
    width: 100%;
    padding-left: 0.32rem;
  }
</style>
