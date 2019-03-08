<template>
  <div class="location">
    <title-nav v-bind:title="title" class="title"></title-nav>
    <!--仓库类型切换-->
    <div class="storeClass">
      <div :class="['msg-btn',warehouseType===1?'msg-btn-active':'']"
           @click="handleSelectState(1)">
        所有
      </div>
      <div :class="['msg-btn',warehouseType===2?'msg-btn-active':'']"
           @click="handleSelectState(2)">
        自有
      </div>
      <div :class="['msg-btn',warehouseType===3?'msg-btn-active':'']"
           @click="handleSelectState(3)">
        托管
      </div>
    </div>

    <div style="flex: 1;margin-top: 2.31rem" v-if="showList&&showList.length">
      <div v-for="item in showList "
           :key="item.id"
           class="contect">

        <div class="location-info" style="font-size: 0.4rem ;" v-if="item.warehouseType===2">
          <router-link class="location-info-flex-box" :to="{path:'/editStore/'+item.id+'/'+item.name+'/'+item.detailAddress+'/'+item.province+'/'+item.city+'/'+item.county+'/'+item.street}"  tag="p">
            <div>
              <span style="line-height: 0.55rem">{{item.name}}</span>
             <span class="genre" style="font-size: 0.32rem;color:#FA6F31">自有</span>
              <div class="local" style="color:#666666;font-size: 0.37rem">
                <i class="icon icon-ic_dw_zx"></i>
                <span style="padding-left: 0.1rem;width: 100%">{{item.province}}{{item.city}}{{item.county}}{{item.street}}{{item.detailAddress}}</span>
              </div>
            </div>
            <div>
            <i class="icon icon-xk_youjiantou_copy skip" v-if="item.warehouseType===2"></i>
            </div>
          </router-link>
        </div>
        <div class="location-info" style="font-size: 0.4rem" v-else-if="item.warehouseType===4">
          <span style="line-height: 0.55rem">{{item.name}}</span>
          <span class="genre" style="font-size: 0.32rem;color:#FA6F31">托管</span>
          <div class="local" style="color:#666666;font-size: 0.37rem">
            <i class="icon icon-ic_dw_zx"></i>
            <span style="padding-left: 0.1rem;width: 100%">{{item.province}}{{item.city}}{{item.county}}{{item.street}}{{item.detailAddress}}</span>
          </div>
        </div>
        <!--<div class="location-info" style="font-size: 0.4rem">-->
        <!--<span style="line-height: 0.55rem">{{item.name}}</span>-->
        <!--<span v-if="item.warehouseType===2" class="genre" style="font-size: 0.32rem;color:#FA6F31">自有</span>-->
        <!--<span v-else-if="item.warehouseType===3" class="genre" style="font-size: 0.32rem;color:#FA6F31">托管</span>-->
        <!--<router-link :to="{path:'/editStore/'+item.id+'/'+item.name+'/'+item.detailAddress}">-->
        <!--<i class="icon icon-xk_youjiantou_copy skip" v-if="item.warehouseType===2"></i>-->
        <!--</router-link>-->
        <!--</div>-->

      </div>
      <div class="block-box"></div>
    </div>
    <!--空页面-->
    <empty-view v-else></empty-view>
    <div class="footer">
      <router-link to="/addStore" tag="p">
        <span class="footer-span">
        <i class="icon icon-ic_tianjia_bai"></i>
          <span style="margin-left: 0.1rem">新增仓库</span>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import EmptyView from "@/components/common/EmptyView";
  import http from "../../assets/models/productAPIs";

  export default {
    name: "WareHouse",
    data() {
      return {
        title: '仓库管理',
        warehouseType: 1,  //全部仓库(1), 经销商自有仓库(2),经销商托管仓库(4)
        showList: [],
      }
    },
    components: {
      'title-nav': Navigator,
      'empty-view': EmptyView,
    },
    methods: {
      //获取仓库信息
      getListDealerWarehouse() {
        //托管仓库，传3，返回warehouseType=4是托管
        http.getListDealerWarehouse({param: this.warehouseType}).then(data => {
          this.showList = data.data;
        }).catch(e => {
          console.log(e)
        })
      },
      //点击事件选择仓库类型
      handleSelectState(stateTypes) {
        this.warehouseType = stateTypes;
        this.getListDealerWarehouse();
      },
    },
    created() {
      this.getListDealerWarehouse();
    },
  }
</script>

<style lang="stylus" scoped>
  .location {
    display: flex;
    flex-direction: column;
    background-color: #F6F6F6;
  }

  .location-info {
    width: 100%;
    text-align: left;
  }

  .contect {
    padding: 0.32rem 0 0.37rem 0.32rem;
    margin-top: 0.27rem;
    background-color: white;
  }

  .connector {
    width: 100%;
    text-align: left;
    padding-top: 0.32rem;

  }

  .local {
    width: 100%;
    text-align: left;
    padding-top: 0.32rem;
    line-height: 0.5rem;
    display flex;
    align-items center
  }

  .block-box {
    height 1.31rem
  }

  .block-top {
    width: 100%;
    height: 2.31rem;
    background-color: #F6F6F6;
  }

  .footer {
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #0096FF;
    height: 1.31rem;
    line-height: 1.31rem;
    position: fixed;
    bottom: 0;
    width: 100%;
  }

  .footer-span {
    color: white;
    font-size: 0.45rem;
    display: flex;
    align-items: center
  }
.location-info-flex-box{
  display: flex;
  flex-direction:row;
  align-items: center;
  justify-content: space-between;
}
  .genre {
    width: 0.96rem;
    display: inline-block;
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 0.2rem;
    border: #FA6F31 solid 0.01rem;
    text-align: center;
    margin-left: 0.32rem;
    padding: 0.045rem;
    height auto;
  }

  .title {
    position: fixed;
    top: 0;
    width: 100%;
  }

  .skip {
    float: right;
    margin-right: 0.49rem;
  }

  .storeClass {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 1.17rem;
    padding: 0.21rem 0.1rem 0rem;
    line-height: 1.17rem;
    background-color: white;
    position: fixed;
    top: 1.15rem;
    width: 100%;

  }

  .msg-btn {
    width: 2.8rem;
    height: 0.8rem;
    font-size: 0.37rem;
    border-radius: 0.08rem;
    background-color: rgba(245, 245, 245, 1);
    border: 0.01rem solid white;
    text-align: center;
    border-radius: 0.05rem;
    line-height: 0.8rem;
    position: relative;
  }

  .msg-btn-active {
    border: 0.02rem solid #FA6F31;
    background-color: white;
    color: #FA6F31;
    width: 2.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
  }


</style>
