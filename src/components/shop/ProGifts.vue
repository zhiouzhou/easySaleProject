<template>
  <div id="proGifts">
    <div class="header">
      <i class="icon icon-ic_fh" @click="goBack"></i>
      <p>产品满赠<span v-show="giftMode!==null">({{giftMode==0?'倍增':'坎级'}})</span></p>
    </div>
    <div class="blank"></div>
    <div class="proGift-ul" v-for="item in productGiftList">
      <div class="fullOfGift-information">
        <span class="proGift-icon">满赠</span>
        <div class="information-content">
          <p>{{item.giftTag}}</p>
          <p>最大赠送数量：{{item.maxGiftNumTag}}</p>
          <p>活动时间：{{item.giftBeginTime}}-{{item.giftEndTime}}</p>
        </div>
      </div>
      <div class="remove-button">
        <p @click="deleteProGift(item.giftId)">删除</p>
      </div>
    </div>
    <div class="bottom-button" v-if="!productGiftList||!productGiftList.length">
      <div class="addProGift" @click="gotoAddProGift('selectMode')">新增产品满赠</div>
      <!--<div class="settingTime" @click="selctRestrictionsDate">设置活动时间</div>-->
    </div>
    <!--选择模式弹框-->
    <cube-pop position="center" ref="selectMode">
      <div class="setting">
        <p class="popHeader">模式选择</p>
        <div class="mode">
          <p @click="switchModel(0)"><i :class="['icon',mode==0?'icon-ic_xuanzhong':'icon-ic_weixuan']"></i>倍增模式</p>
          <p @click="switchModel(1)"><i :class="['icon',mode==1?'icon-ic_xuanzhong':'icon-ic_weixuan']"></i>坎级模式</p>
        </div>
        <div class="selectButton">
          <span @click="enSure('selectMode')">确定</span>
        </div>
      </div>
    </cube-pop>
    <!--空页面-->
    <div class="empty" v-show="!productGiftList||!productGiftList.length">
      <img src="static/icons/Group 5@2x.png"/>
      <span>暂无相关数据</span>
    </div>
  </div>

</template>

<script>
  import http from "@/assets/models/shopAPIs";
  import {Popup} from 'cube-ui'


  export default {
    name: "pro-gifts",
    data() {
      return {
        productSalePolicyId: '',
        productGiftList: [],
        giftBeginTime: '',   //活动开始时间
        giftEndTime: '',     //活动结束时间
        mode: null,
        giftMode: null,
      }
    },
    components: {
      'cube-pop': Popup
    },
    created() {
      this.productSalePolicyId = this.$route.query.productSalePolicyId
      http.getProductGiftList({param: {productSalePolicyId: this.productSalePolicyId}})
        .then(data => {
          if (!data.data || !data.data.length) {
            return this.giftMode
            console.log(this.giftMode)
          } else {
            this.giftMode = data.data[0].giftMode
          }
          this.productGiftList = data.data;
          console.log(this.giftMode)
        });

    },
    methods: {
      goBack() {
        if (this.giftBeginTime || this.giftEndTime) {

        } else {
          this.$router.go(-1)
        }

      },
      //删除一条满赠规格
      deleteProGift(giftId) {
        let {productSalePolicyId} = this
        //先从原数组中去除删除的元素，得到一个新的数组
        let fitArr = this.productGiftList.filter(item => item.giftId !== giftId)
        //从过滤后的数组中把每个元素的id取出来，用一个新数组装起来
        let idList = [];
        fitArr.forEach(item => {
          idList.push(item.giftId)
        })
        http.deleteProGift({param: {idList, productSalePolicyId}})
          .then(data => {
            this.productGiftList = this.productGiftList.filter(item => item.giftId !== giftId)
            this.$toast({message: `删除成功`})
          })
          .catch(error => {
            this.$toast({message: error})
          })
      },
      gotoAddProGift(refId) {
        if ((!this.productGiftList || !this.productGiftList.length) && this.giftMode == null) {
          this.$refs[refId].show();
        } else {
          let {productSalePolicyId, giftMode} = this;
          this.$router.push({name: `addProGifts`, query: {productSalePolicyId, giftMode}})
        }
      },
      //设置全局时间
      selctRestrictionsDate() {
        this.dateSegmentPicker.show();
      },
      switchModel(mode) {
        this.mode = mode
      },
      enSure(refId) {
        this.giftMode = this.mode;
        this.$refs[refId].hide();
        console.log(this.giftMode)
      },
    }
  }
</script>

<style scoped lang="stylus">
  #proGifts {
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

      p {
        padding-left: 3rem;
        color: #fff;
        font-size: 0.48rem;
      }
    }

    .blank {
      height: 1.17rem;
    }

    .proGift-ul {
      background: #fff;
      margin-bottom: 0.16rem;

      .fullOfGift-information {
        border-bottom: 1px solid #ededed;
        padding: 0.32rem 0.32rem 0;
        display: flex;
        flex-direction: row;
        justify-content flex-start;
        align-items: flex-start;

        span {
          display: block;
          padding: 0.03rem;
          border: 1px solid #E53935;
          color: #E53935;
          font-size: 0.32rem;
          min-width: 1rem;
        }

        div {
          margin-left: 0.16rem;
          text-align: left;

          p {
            color: #666;
            font-size: 0.37rem;
            padding-bottom: 0.32rem;

            &:nth-child(1) {
              color: #333;
              font-size: 0.4rem;
            }
          }
        }
      }

      .remove-button {
        display: flex;
        flex-direction: row;
        justify-content flex-end;
        padding: 0.23rem 0.32rem;

        p {
          width: 1.81rem;
          height: 0.75rem;
          text-align: center;
          line-height: 0.75rem;
          border: 1px solid #666;
          color: #666;
          font-size: 0.37rem;
          -webkit-border-radius: 0.05rem;
          -moz-border-radius: 0.05rem;
          border-radius: 0.05rem;
        }
      }
    }

    .bottom-button {
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      height: 1.31rem;

      div {
        font-size: 0.45rem;
        color: #fff;
        background: #099AFF;
        text-align: center;
        height: 1.31rem;
        width 100%;
        line-height: 1.31rem;
      }
    }

    .setting {
      width: 7.68rem;
      background: #fff;
      font-size: 0.43rem;
      color: #333;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      padding: 0 0.64rem;

      .popHeader {
        text-align center;
        padding: 0.43rem 0 0.43rem 0;
      }

      .mode {
        display: flex;
        flex-direction: row;
        justify-content space-between;

        p {
          display: flex;
          align-items center;

          i {
            margin-right: 0.31rem;
          }
        }
      }

      .selectButton {
        display: flex;
        flex-direction: row;

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

    .empty {
      display: flex;
      flex-direction: column;
      align-items center;
      justify-content center;
      height: 86%;

      img {
        width: 1.6rem;
        height: 1.6rem;
      }

      span {
        font-size: 0.4rem;
        padding-top: 0.43rem;
        color: #666;
      }
    }

  }


</style>
