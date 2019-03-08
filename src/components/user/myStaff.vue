<template>
  <div class="bigBox">
    <title-nav v-bind:title="title"></title-nav>
    <search-bar @onClickSearch="onClickSearch" searchNoticeText="请输入员工姓名/手机号" v-model="searchWord"></search-bar>
    <div class="scroll-wrap" v-if="employeeList&&employeeList.length">
      <cube-scroll
        ref="scroll"
        :data="employeeList"
        :options="scrollOptions"
        :scroll-events="['scroll']"
        @scroll="onScrollHandle"
        @pulling-down="onPullingDown"
        @pulling-up="onPullingUp">
        <div class="staff-box" v-for="item of employeeList" :key="item.id">
          <div class="staff-box-one">
            <li>
              <span>员工姓名：{{item.employeeName}}</span>
              <div style="display: flex;flex-direction: row;">
                <div class="role-box" style="padding-left: 0.15rem;" v-for="number in item.employeeRoleSet">
                  <span class="staff-role-manager" v-if="number===0">管理员</span>
                  <span class="staff-role-agent" v-if="number===1">经纪人</span>
                  <span class="staff-role-delivery" v-if="number===2">配送员</span>
                </div>
              </div>
            </li>
            <li>联系电话：{{item.mobileNo}}</li>
          </div>
          <div class="btnBox" v-if="!(item.employeeRoleSet.length===1&&item.employeeRoleSet[0]===0)">
            <div class="button-style" v-if="item.state===0" @click="handleChangeState(item.employeeId,item.state)">启用
            </div>
            <div class="button-style" v-else-if="item.state===1" @click="handleChangeState(item.employeeId,item.state)">
              停用
            </div>
          </div>

        </div>

        <div class="box-block"></div>
      </cube-scroll>

    </div>
    <!--空页面-->
    <empty-view v-else></empty-view>

    <div class="button ft-45r color-fff" @click="toAddPage">

      <i class="icon icon-ic_tianjia_bai" style="margin-right: 0.21rem;"></i>
      新增员工

    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import EmptyView from "@/components/common/EmptyView";
  import searchBar from "@/components/common/SearchBar";
  import http from '@/assets/models/myAPIs'
  import {Scroll} from 'cube-ui';

  export default {
    name: "myStaff",
    data() {
      return {
        title: '我的员工',
        //stateType:'',
        fromPage: '1',
        currentPage: 1,
        pageSize: 10,
        employeeList: [],	//0-管理员，1-经纪人，2-配送员
        searchWord: '',
        chooseEmployeeId: '',//选择进行启用/禁用操作的员工号
      }
    },
    components: {
      'title-nav': Navigator,
      'search-bar': searchBar,
      'cube-scroll': Scroll,
      'empty-view': EmptyView,
    },
    methods: {
      //获取员工接口
      getEmployeeList() {
        let {currentPage, pageSize, searchWord} = this;
        http.getEmployeeList({currentPage, pageSize, param: searchWord}).then(data => {
          //1.拿第1页，有数据   列表清空，直接把数据填入，页码加1
          //2.拿第1页。没数据    列表清空，显示暂无数据
          //3.拿非第1页，有数据   列表不清空，直接追加，页码加1
          //4.拿非第1页，没数据   列表不清空，页码不加1
          let list = data.data || []
          let hasData = list.length
          if (currentPage === 1 && hasData) {//1
            this.employeeList = list
            this.currentPage++
          } else if (currentPage !== 1 && hasData) {//3
            this.employeeList = this.employeeList.concat(list)
            this.currentPage++
          } else if (currentPage === 1 && !hasData) {//2
            this.employeeList = []
          }//4 不做任何处理
          console.log('employeeRoleSet', typeof (data.data[0].employeeRoleSet))
          console.log('0', [0])
        }).catch(e => {
          console.log(e)
        })
      },
      //启用员工接口
      enableEmployee() {
        http.enableEmployee({param: this.chooseEmployeeId}).then(data => {
          this.$toast({message: '启用成功'})
        })
      },
      //禁用员工接口
      disableEmployee() {
        http.disableEmployee({param: this.chooseEmployeeId}).then(data => {
          this.$toast({message: '禁用成功'})
        })
      },

      //根据关键字进行查询
      onClickSearch(searchText) {
        this.currentPage = 1;
        this.searchWord = searchText;
        this.getEmployeeList()
      },
      toAddPage() {
        //1表示页面mystaff
        this.$router.push({
          name: 'addStaff',
          params: {fromPage: '1'}
        })
      },
      handleChangeState(id) {
        //从数组中筛选出当前进行启用/禁用操作的员工号
        this.chooseEmployeeId = id;
        let employeeState = this.employeeList.filter(item => item.employeeId === id)[0].state
        console.log('employeeState', employeeState)
        if (employeeState === 0) {
          //调接口，并更改页面上的值 1-启用，0停用
          this.enableEmployee();
          this.employeeList.filter(item => item.employeeId === id)[0].state = 1
        } else {
          this.disableEmployee();
          this.employeeList.filter(item => item.employeeId === id)[0].state = 0
        }
        ;
      },
      onScrollHandle() {
      },
      /*滚动下拉*/
      onPullingDown() {
        console.log('下拉滚动');
        this.currentPage = 1;
        this.getEmployeeList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },
      //滚动上拉
      onPullingUp() {
        console.log('滚动上拉');
        this.getEmployeeList();
        setTimeout(() => {
          this.$refs.scroll.forceUpdate()
        }, 1000)
      },

    },
    created() {
      this.getEmployeeList();
    },
    computed: {
      scrollOptions() {
        return this.$store.state.scrollOptions.defaultOptions
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .bigBox {
    background-color: #F6F6F6;
    display: flex;
    flex-direction column;
    overflow hidden
  }

  .scroll-wrap {
    flex 1;
    overflow hidden;
  }

  .staff-box-one {
    width 100%;
    height 1.76rem
    display flex;
    flex-direction column;
    align-items flex-start;
    font-size 0.4rem;
    padding 0.32rem 0.32rem;
    background-color white;
    margin-top 0.16rem;
    line-height 0.7rem;
    border-bottom 0.01rem solid #EDEDED;
    li {
      &:nth-child(1) {
        display: flex;
        justify-content space-between;
        align-items flex-end;
        width: 100%;
        > span {
          min-width: 2rem;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .staff-role-delivery {
      width 1rem;
      border 0.01rem solid #0096FF;
      background-color rgba(0, 150, 255, 0.1);
      border-radius: 0.24rem;
      padding 0.04rem 0.11rem;
      font-size 0.32rem;
      color #0096FF
    }
    .staff-role-agent {
      width 1rem;
      border 0.01rem solid #FA6F31;
      background-color rgba(250, 111, 49, 0.1);
      border-radius: 0.24rem;
      padding 0.04rem 0.11rem;
      font-size 0.32rem;
      color #FA6F31
    }
    .staff-role-manager {
      width 1rem;
      border 0.01rem solid #E53935;
      background-color rgba(229, 57, 53, 0.1);
      border-radius: 0.24rem;
      padding 0.04rem 0.11rem;
      font-size 0.32rem;
      color #E53935
    }
  }

  .btnBox {
    background-color white;
    display flex;
    flex-direction row;
    justify-content flex-end;
    align-items center;
    height 1.17rem;
    .button-style {
      padding-top 0.19rem;
      border: 1px solid #666666;
      -webkit-border-radius: 0.05rem;
      -moz-border-radius: 0.05rem;
      border-radius: 0.05rem;
      color: #666666;
      font-size: 0.37rem;
      width 1.81rem;
      height 0.75rem;
      margin-right 0.32rem
    }
  }

  .button {
    z-index: 99;
    width: 10rem;
    height: 1.31rem;
    background: rgba(0, 150, 255, 1);
    line-height 1.31rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    position fixed;
    bottom 0;
    color white
  }

  .box-block {
    width 100%;
    background-color #F6F6F6;
    height 0.8rem;
  }

  .role-box {
    min-width: 1.38rem
  }
</style>
