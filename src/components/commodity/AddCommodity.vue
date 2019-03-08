<template>
  <div id="addCommodity" :style="{overflow: canScroll?`scroll`:`hidden`}">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <span>{{comeInType=='addProduct'?'新增商品':'编辑商品'}}</span>
    </div>
    <div class="blank"></div>
    <div>
      <ul class="goodsInformation">
        <li style="display: none"></li>
        <li style="position: relative;">
          <p><i>*</i>商品名称</p>
          <p style="flex: 1;display: flex; justify-content: flex-end;">
            <input type="text" placeholder="输入商品名称" v-model="editProductInfo.productName" v-on:input="searchList"
                   id="productName" name="productName" v-validate="'required'" ref="productName"
                   @blur="productNameBlur" class="productName"/>
          </p>
          <!--模糊搜索列表-->
          <div class="scroll-wrap" v-show="searchListState&&editProductInfo.productName">
            <ul class="search-List">
              <li v-for="item in productList" @click="selectProduct(item)">
                <img :src="item.imageUrl||`/static/icons/defaul_product.png`"/>
                <span>{{item.productName}}</span>
              </li>
            </ul>
          </div>
          <!--遮罩层-->
          <div class="mask" v-show="searchListState&&editProductInfo.productName&&productList" @click="closeMask"></div>
        </li>
        <li @click="selectClassify('selectCategory')">
          <p>
            <i>*</i>分类</p>
          <p>
            <input type="text" placeholder="请选择" readonly="readonly" v-model="editProductInfo.classifyName"/>
            <i class="icon icon-xk_youjiantou_copy"></i>
          </p>
        </li>
        <li>
          <p>
            <i>*</i>品牌</p>
          <p>
            <input type="text" placeholder="请输入" v-model="editProductInfo.productBrand" @focus="brandFocus"/>
            <!--<i class="icon icon-xk_youjiantou_copy"></i>-->
          </p>
        </li>
        <li style="border-bottom: 1px solid #ededed;">
          <p style="min-width: 60px;">
            <i style="margin: 0;">*</i>包装规格</p>
          <p style="flex: 1;display: flex;justify-content: flex-end">
            <input type="number" placeholder="请输入" style="width: 100px;margin-right: 0.16rem;"
                   v-model="editProductInfo.quantity"/>
            <span>
              {{editProductInfo.smallUnit}}
              <i class="icon icon-Rectangle" @click="chooseUnit('selectUnit',type='small')"></i>
              / {{editProductInfo.bigUnit}}
              <i class="icon icon-Rectangle" @click="chooseUnit('selectUnit',type='big')"></i>
            </span>

          </p>
        </li>
      </ul>
      <!--包装规格弹框-->
      <cube-pop position="bottom" ref="selectUnit">
        <ul class="classify-ul">
          <div class="select-header">
            <p slot="header">选择单位</p>
            <i class="icon icon-pop_ic_close" @click="closePop('selectUnit')"></i>
          </div>
          <li v-for="item in unitList" @click="onSelectUnit(item,'selectUnit')">
            <span>{{item}}</span>
            <i class="icon icon-pop_ic_xz" v-show="type=='small'&&editProductInfo.smallUnit==item"></i>
            <i class="icon icon-pop_ic_xz" v-show="type=='big'&&editProductInfo.bigUnit==item"></i>
          </li>
        </ul>
      </cube-pop>
      <!--扫码-->
      <ul class="scavenging">
        <li>
          <p>条形码</p>
          <p>
            <input type="number" placeholder="输入或扫描" v-model="editProductInfo.bottleCode"
                   onkeyup="value=value.replace(/[\W]/g,'')"
                   onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"/>
            <i class="icon icon-xzsp_ic_sm" @click="clickScan(codeType='scavenging')"></i>
          </p>
        </li>
        <li style="border-bottom: 0;">
          <p>箱码</p>
          <span @click="addBoxCode(0)">新增</span>
        </li>
        <li>
          <ul>
            <li v-for="(item,index) in editProductInfo.boxCodes"
                :style="editProductInfo.boxCodes.length>1?'justify-content:space-between':''">
              <i class="icon icon-ic_shanchu" @click="deleteBoxCode(index)"
                 v-if="editProductInfo.boxCodes.length>1"></i>
              <p>
                <input type="number" v-model="item.code" placeholder="输入或扫描"
                       onkeyup="value=value.replace(/[\W]/g,'')"
                       onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))"/>
                <i class="icon icon-xzsp_ic_sm" @click="clickScan(codeType='boxCode',index)"></i>
              </p>
            </li>
          </ul>
        </li>
      </ul>
      <!--商品规格-->
      <ul class="specifications">
        <li>
          <p>长度(cm)</p>
          <input type="number" placeholder="请输入" v-model="editProductInfo.length"/>
        </li>
        <li style="margin: 0 .32rem;">
          <p style="min-width: 2rem;margin: 0">宽度(cm)</p>
          <input type="number" placeholder="请输入" v-model="editProductInfo.width"/>
        </li>
        <li>
          <p>高度(cm)</p>
          <input type="number" placeholder="请输入" v-model="editProductInfo.height"/>
        </li>
        <li>
          <p>重量(kg)</p>
          <input type="number" placeholder="请输入" v-model="editProductInfo.weight"/>
        </li>
      </ul>
      <!--商品图片-->
      <div class="commodity-img">
        <div class="commodity-img-title">
          <span>商品图片</span>
          <span>最多只能上传1张图片</span>
        </div>
        <div class="add-img">
          <div>
            <el-upload
              class="avatar-uploader"
              v-loading="loadingEdit"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :headers="headers"
              :action="`${baseUrl}/file/uploadImg`"
              :show-file-list="false"
              :on-success="fileSuccess"
              :on-error="fileError"
              :on-progress="progressEdit"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="icon icon-ic_tjtp"></i>
            </el-upload>
          </div>
          <p>图片大小不能超过1MB</p>
        </div>
      </div>
    </div>

    <div class="hold" @click="holdProduct" v-if="comeInType=='addProduct'&&showHide"
         :style="changeBtnColor==false?'background:#BDBDBD':''">
      保存
    </div>
    <div class="hold" @click="editHoldProduct" v-if="comeInType=='editProduct'">
      保存
    </div>

  </div>
</template>
<script>

  import Navigator from "@/components/common/Navigator";
  import popMenu from "@/components/common/PopMenu"
  import http from "@/assets/models/productAPIs";
  import {Popup, Upload, Scroll} from 'cube-ui';
  import Urls from '@/assets/models/baseUrl'
  import {mapActions} from 'vuex'


  // const allCategoryList = [];
  export default {
    name: "add-commodity",
    data() {
      return {
        canScroll: true,
        transitionName: "slide-left",
        title: '新增商品',
        imageUrl: '',
        type: '',
        unitList: [],    //单位列表
        allCategoryList: [], //所有一级和二级统计类目
        selectBoxCodesIndex: 0,//点击选中的箱码索引
        baseUrl: '',
        currentPage: 1,
        pageSize: 6,
        productList: [],
        searchListState: false,
        comeInType: '',
        productInfo: {},
        loadingEdit: false,
        name: '',
        productInfoSpecificationId: '',
        showHide: true,  //显示或者隐藏button
        popState: false,
        documentHeight: document.documentElement.clientHeight,  //默认屏幕高度
        editProductInfo: {
          classifyName: '',
          productBrand: '',   //品牌名称
          productInfoId: '',   //产品信息Id
          smallUnit: '瓶',   //小单位
          bigUnit: '件',     //大单位
          quantity: null,   //包装规格系数
          productStatisticsClass: '',    //一级类目Id
          secondStatisticsClass: '',     //二级类目Id
          bottleCode: ``,   //条形码的值
          boxCodes: [{code: ''}],   //箱码
          defaultImageFileId: '',    //	图片Id
          productName: '',   //模糊搜索产品名称
          width: null,
          height: null,
          weight: null,
          length: null,
          productInfoSpecificationId: null,  //产品信息规格Id（编辑商品）
        },
        holdProductInfo: {},
      }
    },
    components: {
      'title-nav': Navigator,
      'pop-menu': popMenu,
      'cube-pop': Popup,
      'cube-upload': Upload,
      'cube-scroll': Scroll,
    },
    mounted() {
      // window.onresize监听页面高度的变化
      window.onresize = () => {
        return (() => {
          if (this.documentHeight > document.documentElement.clientHeight) {
            this.showHide = false
          } else {
            this.showHide = true
          }
        })()
      }
    },
    created() {
      // console.log(this.$store.state.user.userInfo.token)
      this.getUnitList();
      this.getAllCategory();
      this.baseUrl = Urls.easySaleUrl;
      this.comeInType = this.$route.query.comeInType;
      this.productInfo = this.$route.query.productInfo;
      if (this.comeInType == 'editProduct') {
        this.editProductInfo = {
          productName: this.productInfo.productName,
          productInfoId: this.productInfo.productInfoId,
          productBrand: this.productInfo.productBrand,
          bigUnit: this.productInfo.maxUnit,
          smallUnit: this.productInfo.minUnit,
          classifyName: this.productInfo.categoryName,
          boxCodes: this.productInfo.boxCodes,
          searchListState: false,
          quantity: this.productInfo.specQuantity,
          bottleCode: this.productInfo.barCode,
          width: this.productInfo.width,
          height: this.productInfo.height,
          weight: this.productInfo.weight,
          length: this.productInfo.length,
          quantity: this.productInfo.specNum,
          imageUrl: this.productInfo.imageUrl,
          defaultImageFileId: this.productInfo.defaultImageFileId,
          productInfoSpecificationId: this.productInfo.productInfoSpecId,
          productStatisticsClass: this.productInfo.productStatisticsClass,
          secondStatisticsClass: this.productInfo.secondStatisticsClass,
        }
        this.holdProductInfo = {
          productName: this.productInfo.productName,
          productInfoId: this.productInfo.productInfoId,
          productBrand: this.productInfo.productBrand,
          bigUnit: this.productInfo.maxUnit,
          smallUnit: this.productInfo.minUnit,
          classifyName: this.productInfo.categoryName,
          boxCodes: this.productInfo.boxCodes,
          searchListState: false,
          quantity: this.productInfo.specQuantity,
          bottleCode: this.productInfo.barCode,
          width: this.productInfo.width,
          height: this.productInfo.height,
          weight: this.productInfo.weight,
          length: this.productInfo.length,
          quantity: this.productInfo.specNum,
          imageUrl: this.productInfo.imageUrl,
          defaultImageFileId: this.productInfo.defaultImageFileId,
          productInfoSpecificationId: this.productInfo.productInfoSpecId,
          productStatisticsClass: this.productInfo.productStatisticsClass,
          secondStatisticsClass: this.productInfo.secondStatisticsClass,
        }
        this.name = this.productInfo.specName;
        this.imageUrl = this.productInfo.imageUrl
      }
    },
    //将小程序里传过来的值赋给data中的scanValue变量
    beforeRouteUpdate(to, from, next) {
      console.log('进入路由Update钩子')
      console.log('to.query', to.query)
      //扫描条形码返回scanValue
      //url中带了扫码的数据
      if (to.query.scanResult) {
        //取出扫码的结果和附带的额外参数（额外参数用于区分是条形码还是箱码）
        let scanResult = to.query.scanResult
        let extraParams = JSON.parse(decodeURIComponent(to.query.extraParams))
        if (extraParams.codeType === `boxCode`) {
          this.editProductInfo.boxCodes[this.selectBoxCodesIndex].code = scanResult
        } else if (extraParams.codeType === `scavenging`) {
          this.editProductInfo.bottleCode = scanResult
        }
      }
      next()
    },
    methods: {
      closeMask() {
        this.searchListState = false;

        this.move()
      },
      /***滑动限制***/
      stop() {
        this.canScroll = false
      },
      /***取消滑动限制***/
      move() {
        this.canScroll = true
      },

      //点击事件，跳转到小程序中调用扫码API
      clickScan(type, selectBoxCodesIndex) {
        //如果点击的是箱码，需要保存当前点击的index
        if (selectBoxCodesIndex !== undefined && selectBoxCodesIndex !== null) {
          this.selectBoxCodesIndex = selectBoxCodesIndex;
        }
        //页面的原始地址比如   url?comeInType=addProduct
        //因为jumpUrl里面带了？的特殊符号所以必须转码一次才能不影响小程序的跳转，
        //如果不转码则会丢失部分数据
        //传参都需要转码,对象形式的先转成JSON字符串再转码
        //去掉之前扫码附加到url上的数据
        let jumpUrl = window.location.toString().split(`&`)[0]
        jumpUrl = encodeURIComponent(jumpUrl)
        //extraParams为一个对象
        let extraParams = encodeURIComponent(JSON.stringify({codeType: type}))
        //路径中带两个重要参数，jumpUrl：调取扫码的页面完整路径，extraParams：额外参数，区分条形码还是箱码
        let path = `/pages/scon/scon?jumpUrl=${jumpUrl}&extraParams=${extraParams}`
        console.log('跳转到小程序的完整路径', path)
        window.wx.miniProgram.navigateTo({
          url: path,
        })
      },
      //获取包装规格单位
      getUnitList() {
        http.getProductUnit({})
          .then(data => {
            this.unitList = data.data
          })
          .catch(e => {
            console.log(e)
          })
      },
      //获取所有一级和二级统计类目
      getAllCategory() {
        http.getAllCategoryList({})
          .then(data => {
            let finalCategoryList = data.data
            for (let category of finalCategoryList) {
              category.children = category.statisticsCategoryWithChildList
            }
            this.allCategoryList = finalCategoryList
          }).catch(e => {
          console.log(e)
        })
      },
      getProductList() {
        let {currentPage, pageSize, editProductInfo} = this;
        let productName = editProductInfo.productName;
        http.getProductInfo({currentPage, pageSize, param: productName})
          .then(data => {
            this.productList = data.data;
          })
          .catch(error => {
            console.log(error)
          })
      },
      debounce(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
          method.call(context)
        }, 1000)
      },
      searchList(event) {
        this.debounce(this.getProductList, window)
        this.searchListState = true
        if (event.target.value == '') {
          this.move()
        } else {
          this.stop()
        }
      },
      //选择产品
      selectProduct(item) {
        //1.页面上有两个对象，一个是编辑中的，一个是保存的
        //选中的时候，把选中的产品同时赋值给编辑和保存中的对象，两个保持一致
        //然后编辑的时候只管操作编辑对象，保存对象不做任何操作
        //在最后一步比对的时候再去比对编辑和保存对象
        this.editProductInfo = {
          productName: item.productName,
          productInfoId: item.productInfoId,
          productBrand: item.productBrand,
          bigUnit: item.maxUnit,
          smallUnit: item.minUnit,
          classifyName: item.categoryName,
          boxCodes: item.boxCodes,
          quantity: item.quantity,
          bottleCode: item.barCode,
          width: item.weight,
          height: item.height,
          weight: item.weight,
          length: item.length,
          productInfoSpecificationId: item.productInfoSpecificationId,
          defaultImageFileId: item.defaultImageFileId,
          productStatisticsClass: item.productStatisticsClass,
          secondStatisticsClass: item.secondStatisticsClass,
        }
        this.holdProductInfo = {
          productName: item.productName,
          productInfoId: item.productInfoId,
          productBrand: item.productBrand,
          bigUnit: item.maxUnit,
          smallUnit: item.minUnit,
          classifyName: item.categoryName,
          boxCodes: item.boxCodes,
          quantity: item.quantity,
          bottleCode: item.barCode,
          width: item.weight,
          height: item.height,
          weight: item.weight,
          length: item.length,
          productInfoSpecificationId: item.productInfoSpecificationId,
          defaultImageFileId: item.defaultImageFileId,
          productStatisticsClass: item.productStatisticsClass,
          secondStatisticsClass: item.secondStatisticsClass,
        }
        this.imageUrl = item.imageUrl;
        this.searchListState = false;
        this.move();
      },
      closePop(refId) {
        this.$refs[refId].hide()
      },
      selectClassify() { //选择分类菜单
        this.cascadePicker = this.$createCascadePicker({
          title: '选择分类',
          data: this.allCategoryList,
          alias: {
            value: 'id',
            text: 'name',
          },
          selectedIndex: [0, 0],
          onSelect: this.selectHandle,
        })
        if (this.editProductInfo.productName == '') {
          this.productNameValidate()
          this.cascadePicker.hide()
        } else {
          this.cascadePicker.show()
        }
      },
      selectHandle(selectedVal, selectedIndex, selectedText) {
        this.editProductInfo.classifyName = selectedText.join('-');
        this.editProductInfo.productStatisticsClass = selectedVal[0]
        this.editProductInfo.secondStatisticsClass = selectedVal[1]
      },
      brandFocus() {
        if (this.editProductInfo.productName == '') {
          this.productNameValidate()
        }
      },
      addBoxCode() {
        this.editProductInfo.boxCodes.push({code: ''})
      },
      deleteBoxCode(selectIndex) {
        this.editProductInfo.boxCodes.splice(selectIndex, 1)
      },
      goBack() {
        if (this.comeInType == 'editProduct') {
          let {editProductInfo, holdProductInfo} = this
          let isEqual = this.judgeEqual(editProductInfo, holdProductInfo)
          console.log(isEqual)
          if (isEqual) {
            this.$router.go(-1)
          } else {
            this.$createDialog({
              type: 'confirm',
              icon: 'cubeic-alert',
              title: '提示',
              content: '您还没有保存，确定退出？',
              confirmBtn: {
                text: '确定',
                active: true,
                disabled: false,
                href: 'javascript:;'
              },
              cancelBtn: {
                text: '取消',
                active: false,
                disabled: false,
                href: 'javascript:;'
              },
              onConfirm: () => {
                this.$router.go(-1)
              },
              onCancel: () => {

              }
            }).show()
          }
        } else {
          this.$router.go(-1)
        }

      },
      //选择包装规格单位
      chooseUnit(refId, type) {
        this.$refs[refId].show();
      },
      onSelectUnit(selectItem, refId) {
        if (this.type == 'small') {
          this.editProductInfo.smallUnit = selectItem;
          this.$refs[refId].hide();
        } else {
          this.editProductInfo.bigUnit = selectItem;
          this.$refs[refId].hide();
        }
      },
      //验证产品名称是否为空 为空的话提示
      productNameValidate() {
        this.$validator.validate().then((rs) => {
          if (!rs) {
            let err = this.$validator.errors;
            let field = err.items[0].field;
            let el = this.$refs[field];
            let clsname = 'warn-highlight';
            if (el.classList.contains(clsname)) {
              el.classList.remove(clsname);
            }
            setTimeout(() => el.classList.add(clsname), 0);
            this.$toast({
              message: err.first(field),
              iconClass: 'weui-icon-info', duration: 2000
            });
          }
        })
      },
      productNameBlur() {
        // this.productNameValidate()
        this.move()
      },
      //图片上传成功时
      fileSuccess(res, file) {
        this.loadingEdit = false;
        this.imageUrl = URL.createObjectURL(file.raw);
        this.editProductInfo.defaultImageFileId = res.data
      },
      //图片上传失败时
      fileError(err, file, fileList) {
        this.$toast({message: `上传失败`})
      },
      progressEdit() {
        this.loadingEdit = true;
      },
      //上传图片前判断图片大小不能大于1M
      beforeAvatarUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          this.$toast({message: `上传的图片大小不能超过1MB`})
        }
        return isLt1M
      },
      /*判断两个对象是否相等*/
      judgeEqual(x, y) {
        // 如果x和y均为空或未定义且完全相同
        if (x === y) {
          return true;
        }
        // 如果它们不是严格相等的，它们都需要成为对象。
        if (!(x instanceof Object) || !(y instanceof Object)) {
          return false;
        }
        //他们必须有完全相同的原型链，我们能做到的最接近。
        //测试的构造。
        if (x.constructor !== y.constructor) {
          return false;
        }
        for (var p in x) {
          //继承属性使用x.constructor ＝＝y.constructor 进行测试。
          if (x.hasOwnProperty(p)) {
            // 允许在设置为未定义时比较x[p]和y[p]
            if (!y.hasOwnProperty(p)) {
              return false;
            }
            // 如果它们具有相同的严格值或同一性，那么它们是相等的。
            if (x[p] === y[p]) {
              continue;
            }
            // Numbers, Strings, Functions, Booleans 必须严格相等
            if (typeof(x[p]) !== "object") {
              return false;
            }
            // Objects and Arrays 必须递归的进行测试
            if (!Object.equals(x[p], y[p])) {
              return false;
            }
          }
        }
        for (p in y) {
          // 允许x[p]设置为未定义的
          if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
          }
        }
        return true;
      },
      holdProduct() {
        console.log(this.editProductInfo.bottleCode)
        if (!this.changeBtnColor) {
          return
        }
        let _this = this;
        this.$validator.validate().then((rs) => {
          if (!rs) {
            let err = _this.$validator.errors;
            let field = err.items[0].field;
            let el = '';
            if (field == "bottleCode") {
              el = _this.$refs[field];
            } else if (field == "code") {
              el = _this.$refs[field][0];
            }
            let clsname = 'warn-highlight';
            if (el.classList.contains(clsname)) {
              el.classList.remove(clsname);
            }
            setTimeout(() => el.classList.add(clsname), 0);
            _this.$toast({
              message: err.first(field),
              iconClass: 'weui-icon-info', duration: 2000
            });
          } else {
            let {editProductInfo, holdProductInfo, name, productInfoSpecificationId} = this
            name = editProductInfo.quantity + editProductInfo.smallUnit + '/' + editProductInfo.bigUnit
            let isEqual = this.judgeEqual(editProductInfo, holdProductInfo)
            if (isEqual) {
              productInfoSpecificationId = editProductInfo.productInfoSpecificationId
            } else {
              productInfoSpecificationId = ''
            }
            http.addProduct({
              param: {
                bottleCode: editProductInfo.bottleCode,
                defaultImageFileId: editProductInfo.defaultImageFileId,
                productBrand: editProductInfo.productBrand,
                productInfoId: editProductInfo.productInfoId,
                productInfoSpecificationId,
                productInfoSpecificationMultiTenantAddDTO: {
                  boxCodes: editProductInfo.boxCodes,
                  height: editProductInfo.height,
                  length: editProductInfo.length,
                  name,
                  quantity: editProductInfo.quantity,
                  packageName: editProductInfo.bigUnit,
                  unitName: editProductInfo.smallUnit,
                  weight: editProductInfo.weight,
                  width: editProductInfo.width
                },
                productName: editProductInfo.productName,
                productStatisticsClass: editProductInfo.productStatisticsClass,
                secondStatisticsClass: editProductInfo.secondStatisticsClass
              }
            })
              .then(() => {
                this.$toast({message: `新增成功`, duration: 1500})
                this.$router.go(-1)
                // this.getCategoryList()
              })
              .catch(error => {
                this.$toast({message: error})
              })
          }
        })

      },
      /*编辑商品*/
      editHoldProduct() {
        let _this = this;
        this.$validator.validate().then((rs) => {
          if (!rs) {
            let err = _this.$validator.errors;
            let field = err.items[0].field;
            let el = '';
            if (field == "bottleCode") {
              el = _this.$refs[field];
            } else if (field == "code") {
              el = _this.$refs[field][0];
            }
            let clsname = 'warn-highlight';
            if (el.classList.contains(clsname)) {
              el.classList.remove(clsname);
            }
            setTimeout(() => el.classList.add(clsname), 0);
            _this.$toast({
              message: err.first(field),
              iconClass: 'weui-icon-info', duration: 2000
            });
          } else {
            let {
              editProductInfo, name
            } = this
            name = editProductInfo.quantity + editProductInfo.smallUnit + '/' + editProductInfo.bigUnit
            http.editProductInfo({
              param: {
                bottleCode: editProductInfo.bottleCode,
                defaultImageFileId: editProductInfo.defaultImageFileId,
                productBrand: editProductInfo.productBrand,
                productInfoId: editProductInfo.productInfoId,
                productInfoSpecificationId: editProductInfo.productInfoSpecificationId,
                productInfoSpecificationMultiTenantAddDTO: {
                  boxCodes: editProductInfo.boxCodes,
                  height: editProductInfo.height,
                  length: editProductInfo.length,
                  name,
                  quantity: editProductInfo.quantity,
                  packageName: editProductInfo.bigUnit,
                  unitName: editProductInfo.smallUnit,
                  weight: editProductInfo.weight,
                  width: editProductInfo.width,
                },
                productName: editProductInfo.productName,
                productStatisticsClass: editProductInfo.productStatisticsClass,
                secondStatisticsClass: editProductInfo.secondStatisticsClass,
                state: this.productInfo.state,
              }
            })
              .then(data => {
                this.$toast({message: `修改成功`})
                this.$router.go(-1)
              })
              .catch(error => {
                this.$toast({message: error})
              })
          }
        })

      },


      ...mapActions(`category`, [`getCategoryList`])
    },
    computed: {
      changeBtnColor() {
        if (!this.editProductInfo.productName || !this.editProductInfo.productBrand || !this.editProductInfo.classifyName || !this.editProductInfo.quantity || !this.editProductInfo.smallUnit || !this.editProductInfo.bigUnit) {
          return false
        } else {
          return true
        }
      },
      headers() {
        return {
          'token': this.$store.state.user.userInfo.token
        }
      }
    },

  }

</script>

<style scoped lang="stylus">
  li {
    height 1.25rem
  }

  #addCommodity {
    background: #f6f6f6;
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
      z-index: 199;
      span {
        padding-left: 3rem;
        color: #fff;
        font-size: 0.48rem;
      }
    }
    .blank {
      height: 1.17rem;
    }

    .goodsInformation,
    .scavenging,
    .specifications {
      background: #fff;
      /*margin-top: 0.16rem;*/
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      li {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0.44rem 0;
        margin: 0 0.32rem;
        border-bottom: 1px solid #ededed;
        height: 100%;
        &:last-child {
          border: 0;
        }
        &:nth-child(1) {
          font-size: 0.4rem;
          color: #333;
        }
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4) {
          p {
            color: #333;
            font-size: 0.4rem;
            display: flex;
            flex-direction: row;
            align-items center;
            min-width: 100px;
            i {
              color: #E53935;
              font-size: 0.4rem;
            }
            input {
              font-size: 0.4rem;
              border: 0;
              outline: 0;
              text-align right;
              background: #fff
            }
            textarea {
              font-size: 0.4rem;
            }
            span {
              color: #0096FF;
              font-size: 0.4rem;
              padding-left: 0.213rem;
            }
          }
        }
        &:nth-child(2) {
          margin: 0;
          p {
            margin: 0 0.32rem;
          }
          input {
            width: 90%;
            overflow: hidden;
            -ms-text-overflow: ellipsis
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .scroll-wrap {
            position: absolute;
            top: 1.4rem;
            left: 0;
            background: #fff;
            width: 100%;
            z-index: 99;
            ul {
              li {
                padding: 0.11rem 0;
                margin-left: 0.32rem;
                img {
                  width: 1.07rem;
                  height: 1.07rem;
                }
                span {
                  font-size: 0.36rem;
                  color: #333;
                  text-align: left;
                  flex: 1;
                  padding-left: 0.53rem;
                }
              }
            }
          }
        }
        &:nth-child(5) {
          p {
            color: #333;
            font-size: 0.4rem;
            display: flex;
            flex-direction: row;
            align-items center;
            i {
              color: #E53935;
              font-size: 0.4rem;
              margin: 0 0.1rem;
            }
            input {
              font-size: 0.4rem;
              border: 0;
              outline: 0;
              text-align right;
              background: #fff
            }
          }
        }
      }
    }
    .scavenging {
      li {
        &:nth-child(3) {
          p {
            display: flex;
            flex-direction: row;
            justify-content space-between;
            align-items: center;
            i {
              margin: 0;
            }
          }
        }
      }
    }
    /*弹框*/
    .classify-ul {
      width: 100%;
      height: 10.2rem;
      background: #fff;
      .select-header {
        display: flex;
        flex-direction: row;
        padding: 0.32rem;
        justify-content flex-end;
        align-items: center;
        border-bottom: 0.01rem solid rgba(0, 0, 0, .1);
        p {
          font-size: 0.43rem;
          color: #333;
          padding-right: 3.55rem;
        }
      }
      li {
        display: flex;
        flex-direction: row;
        justify-content space-between;
        margin: 0 0.32rem;
        padding: 0.44rem 0;
        border-bottom: 0.01rem solid rgba(0, 0, 0, .1);
        span {
          font-size: 0.4rem;
          color: #333;
        }
      }
    }
    //扫码
    .scavenging,
    .specifications {
      li {
        input {
          background: #fff;
          text-align right;
          padding-right: 0.16rem;
          font-size: 0.4rem;
          outline 0;
          border: 0;
        }
        span {
          color: #0096FF;
          font-size: 0.4rem;
        }
        p {
          display: flex;
          align-items center;
        }
      }
    }
    .scavenging {
      li {
        &:nth-child(2) {
          border-bottom: 0;
          margin-right: 0.32rem;
        }
        &:nth-child(3) {
          margin: 0;
          padding: 0rem 0.32rem;
          background: #f6f6f6;
          border-bottom: 0;
          /*p {
            input {
              background: #f6f6f6;
            }
          }*/
          ul {
            width: 100%;
            li {
              margin: 0;
              border-bottom: 0;
              padding: 0.4rem 0;
              display: flex;
              flex-direction: row;
              justify-content flex-end;
              input {
                background: #f6f6f6;
              }
              p {
                margin: 0;
              }
            }
          }
        }
      }
    }
    .commodity-img {
      margin-top: 0.16rem;
      background: #fff;
      padding: 0 0.32rem;
      margin-bottom: 1.547rem;
      .commodity-img-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items center;
        padding: 0.27rem 0;
        span {
          &:nth-child(1) {
            font-size: 0.4rem;
            color: #333;
          }
          &:nth-child(2) {
            font-size: 0.347rem;
            color: #999;
          }
        }
      }
      .add-img {
        color: #999;
        font-size: 0.32rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        div {
          padding-bottom: 0.1rem;
        }
        p {
          padding-bottom: 0.32rem
        }
      }
    }
    .mask {
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 1.4rem;
      width: 100%;
      height: 100vh;
      z-index: 88;
    }
    .hold {
      position: fixed;
      bottom: 0;
      left: 0;
      background: #0096FF;
      color: #fff;
      height: 1.31rem;
      font-size: 0.453rem;
      text-align: center;
      line-height 1.31rem;
      width: 100%;

    }
    .avatar-uploader .el-upload {

      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
      border: 1px dashed #d9d9d9;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

  .down-icon {
    display block;
    width: 0.36rem;
    height: 0.36rem;
    /*background-image: url(./../static/icons/shang.png)*/
    background-repeat: no-repeat;
    background-size contain;
    margin-left: 0.21rem;
  }

</style>
