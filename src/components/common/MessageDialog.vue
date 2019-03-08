<template>
  <div>
    <!--<el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="80%"
      top="30vh"
    >
      <span>需完善信息才能使用该功能。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="ensureDialog(`newRegister`)">去完善</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>


<script>
  import store from '@/assets/data/index'

  export default {
    name: '',
    // props: [`messageDialogVisible`],
    data() {
      return {
        // dialogVisible: this.messageDialogVisible
      }
    },
    components: {},
    methods: {
      /*closeDialog() {
        this.$emit(`closeDialog`, false)
      },
      ensureDialog(type) {
        // this.$router.push({name:`myInformation`,params:{type}})
        this.$emit(`ensureDialog`, false, type)
      },
      show() {
        this.dialogVisible = true
      },
      hide() {
        this.dialogVisible = false
      }*/

      showPop() {
        let isAuditState = store.state.user.userInfo.auditState === -1
        let isDealerState = store.state.user.userInfo.dealerState === -1
        let isDealerState_1 = store.state.user.userInfo.dealerState === 0
        return this.$confirm('需完善信息才能使用该功能。', '提示', {
          confirmButtonText: '去完善',
          cancelButtonText: '取消',
        }).then(() => {
          console.log(this)
          if (isDealerState) {
            this.$router.push({name: `myInformation`, params: {type: `newRegister`}})
          }
        }).catch(() => {

        });
      },
    },
    computed: {},
  }
</script>


<style lang="stylus">
  /*.header {
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
  }*/

  .el-message-box {
    display: inline-block;
    width: 80%;
    padding-bottom: 0.133333rem;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 0.24rem;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    text-align: left;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    height: 17%
  }

  .el-message-box__header {
    position: relative;
    padding: 0.5rem 0.2rem 0.133333rem;
  }

  .el-message-box__title {
    padding-left: 0;
    margin-bottom: 0;
    font-size: 0.32rem;
    line-height: 1;
    color: #303133;
    text-align: center;
  }

  .el-message-box__content {
    position: relative;
    padding: 0.133333rem 0.2rem;
    color: #606266;
    font-size: 0.3rem;
    text-align: center;
    top: .08rem;
  }

  .el-message-box__btns {
    padding-top: 0.32rem
    text-align: center;
  }

  .el-button--small {
    font-size: 0.3rem;
    border-radius: 3px;
    padding: 0.2rem 0.24rem;
  }

</style>
