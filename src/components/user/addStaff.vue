<template>
  <div style="background-color: #F6F6F6">
    <title-nav v-bind:title="title"></title-nav>
    <div class="choose-type">
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>员工姓名</span>
        <div class="ft-40r">
          <input type="text" id="staffName" name="staffName" class="color-999 box-input" v-model="employeeName"
                 placeholder="请输入"
                 v-validate="'required'" ref="staffName"/>
        </div>
      </div>
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>联系方式</span>
        <div class="ft-40r">
          <input type="text" id="staffPhone" name="staffPhone" class="color-999 box-input" v-model="mobileNo"
                 placeholder="请输入"
                 v-validate="'required|mobile'" ref="staffPhone"/>
        </div>
      </div>
      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>角色</span>
        <div class="ft-40r choose-role-box" @click="selectRole('selectRole')">
          <input type="text" class="color-999 box-input" id="staffRole" name="staffRole" disabled="disabled" v-model="staffRole"
                 placeholder="请选择" v-validate="'required'" ref="staffRole">
          <i class="icon icon-ic_jt_hui_36"></i>
        </div>
      </div>
      <div>
        <p style="font-size: 0.4rem"><span class="choose-type-sp">*</span>状态</p>
        <p>
          <span :class="['stateModel',state==1?'selectStateModel':'']" @click="selectModel(1)"><i
            class="icon icon-zjps_ic_xz_24_copy" v-show="state==1"></i>启用</span>
          <span :class="['stateModel',state==0?'selectStateModel':'']" @click="selectModel(0)"><i
            class="icon icon-zjps_ic_xz_24_copy" v-show="state==0"></i>禁用</span>
        </p>
      </div>

      <div>
        <span class="ft-40r color-333"><span class="choose-type-sp">*</span>账户密码</span>
        <div class="ft-40r">
          <input type="password" id="staffPsd" name="staffPsd" class="color-999 box-input" v-model="password"
                 placeholder="请输入"
                 v-validate="'required'" ref="staffPsd"/>
        </div>
      </div>
    </div>

    <cube-pop position="bottom" ref="selectRole">
      <ul class="classify-ul">
        <div class="select-header"><p slot="header">请选择角色（可多选）</p><i class="icon icon-pop_ic_close"
                                                                     @click="closePop('selectRole')"></i>
        </div>
        <div class="ft-40r radio-box" v-for="item of roleModel">
          <i :class="['icon',item.add?'icon-ic_xuanzhong':'icon-ic_weixuan']" @click="chooseType(item.id)"></i>
          <span>{{item.role}}</span>
        </div>
      </ul>
      <div class="select-footer" @click="handleClick">确定</div>
    </cube-pop>
    <div class="footer" @click="handleSave">
      <span style="color: white;font-size: 0.45rem">保存</span>
    </div>
  </div>
</template>

<script>
  import Navigator from "@/components/common/Navigator";
  import popMenu from "@/components/common/PopMenu";
  import http from '@/assets/models/myAPIs';
  import {Popup} from 'cube-ui';

  export default {
    name: "addStaff",
    data() {
      return {
        title: '新增员工',
        //fromPages: '',//从哪个页面跳转过来的
        employeeId: '',
        employeeName: '',
        staffRole: '',//员工角色显示
        employeeRoleSet: [],//	员工角色集合 0-管理员，1-经纪人，2-配送员
        mobileNo: '',
        password: '',
        state: 1,//	状态  0-停用，1-启用
        roleModel: [{
          id: 0,
          add: true,
          role: '管理员'
        }, {
          id: 1,
          add: false,
          role: '经纪人'
        }, {
          id: 2,
          add: false,
          role: '配送员'
        }],//角色选择  1管理员 2经纪人 3配送员
      }
    },
    components: {
      'title-nav': Navigator,
      'pop-menu': popMenu,
      'cube-pop': Popup
    },
    // created() {
    //   this.fromPages = this.$route.params.fromPage
    // },
    methods: {
      //新增员工接口
      addEmployee() {
        let {employeeId, employeeName, employeeRoleSet, mobileNo, password, state} = this;
        http.addEmployee({param: {employeeId, employeeName, employeeRoleSet, mobileNo, password, state}}).then(data => {
          this.$toast({message: '新增成功'})
          //判断是从agentchange页面还是mystaff页面跳转来的，再返回那个界面
          if(this.$route.params.id){
            //如果是从agentchange页面跳转过来的，需要将这两个参数再带回去
            let userId=this.$route.params.id;
           // let agentId=this.$route.params.agentId;
            this.$router.replace('/agentChange/'+userId);
          }else {
            this.$router.replace('/myStaff')
          }
          //this.fromPages === '1' ? this.$router.replace('/myStaff') : this.$router.replace('/agentChange/0')
        }).catch(e => {
          this.$toast({message:e})
        })
      },
      //选择启用或是禁用
      selectModel(state) {
        this.state = state;
      },
      //保存信息
      handleSave() {
        let _this = this;
        this.$validator.validate().then((rs) => {
          console.log(rs)
          if (!rs) {
            let err = _this.$validator.errors;
            let field = err.items[0].field;
            let el = _this.$refs[field];
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
            this.addEmployee()
          }
        })
      },
      closePop(refId) {
        this.$refs[refId].hide()
      },
      selectRole(refId) {
        this.$refs[refId].show()
      },
      //选择员工角色后，将该被选中角色的状态更改为add
      chooseType(id) {
        let index = this.roleModel.findIndex(item => item.id == id)
        this.roleModel[index].add = !this.roleModel[index].add;
      },
      //选择员工角色
      handleClick() {
        let countRole = [];
        let count = [];
        for (let i = 0; i < this.roleModel.length; i++) {
          if (this.roleModel[i].add == true) {
            countRole.push(this.roleModel[i].role);
            count.push(this.roleModel[i].id)
          }
          this.staffRole = countRole.join('|');
          this.employeeRoleSet = count
        }
        this.$refs.selectRole.hide();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .choose-type {
    display flex;
    flex-direction column;
    align-items stretch;
    box-sizing border-box;
    margin-bottom 0.27rem;
    background-color #fff;
    margin-top 0.16rem;
    padding 0 0.32rem;
    > div {
      height: 1.25rem;
      display flex;
      flex-direction row;
      box-sizing border-box;
      justify-content space-between;
      align-items center;
      border-bottom 1px solid #ededed;
      .choose-role-box{
        display flex;
        align-items center
      }
    }

  }

  .choose-type-sp {
    color red
  }

  input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #999;
  }

  input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #999;
  }

  input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #999;
  }

  input:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #999;
  }

  p {
    &:nth-child(2) {
      display: flex;
      flex-direction: row;
      align-items center;
      .stateModel {
        display: block;
        color: #666;
        font-size: 0.37rem;
        width: 2.08rem;
        height: 0.75rem;
        background: #f6f6f6;
        -webkit-border-radius: 0.05rem;
        -moz-border-radius: 0.05rem;
        border-radius: 0.05rem;
        margin-left: 0.32rem;
        display: flex;
        align-items center;
        justify-content: center;
        i {
          margin-right: 0.06rem;
        }
      }
      .selectStateModel {
        background: #fff;
        border: 1px solid #099AFF;
        color: #099AFF;
        border-radius: 0.05rem;
      }
    }
  }

  .box-input {
    outline: 0;
    text-align right;
    background: #fff;
    //width:90%;

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
        padding-right: 2rem;
      }
    }
    .radio-box{
      height 1.25rem;
    }
    div {
      display: flex;
      flex-direction: row;
      justify-content flex-start;
      align-items center;
      margin: 0 0.32rem;
      padding: 0.44rem 0;
      border-bottom: 0.01rem solid rgba(0, 0, 0, .1);
      span {
        font-size: 0.4rem;
        color: #333;
        padding-left 0.21rem
      }
    }
  }

  .footer {
    width: 100%;
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

  .select-footer {
    width: 100%;
    height: 1.31rem;
    background: rgba(0, 150, 255, 1);
    line-height 1.31rem;
    display flex;
    flex-direction row;
    justify-content center;
    align-items center;
    position fixed;
    bottom 0;
    color white;
    font-size: 0.45rem;
    text-align center
  }
</style>
