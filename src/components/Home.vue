<template>
  <el-container  class="home-container">
    <el-header class="home-header">
      <span class="home_title">微前端</span>
      <div style="display: flex;align-items: center;margin-right: 7px">
        <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
    @LY
    <i><img src="http://imgsrc.baidu.com/forum/w=580/sign=1588b7c5d739b6004dce0fbfd9503526/7bec54e736d12f2eb97e1a464dc2d56285356898.jpg" style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/></i>
  </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="180px" style="background-color: rgb(238, 241, 246)">
        <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
          <el-menu style="background: #ececec;width: 180px;" unique-opened router>
            <template v-for="(item,index) in this.routes" v-if="!item.hidden">
              <el-submenu :key="index" :index="index+''">
                <template slot="title">
                  <i :class="item.iconCls" style="color: #20a0ff;width: 14px;"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item width="180px"
                              style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left"
                              v-for="child in item.children"
                              :index="child.path"
                              :key="child.path">{{child.name}}
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-aside>


      <el-form label-width="85px"
               :rules="rules" style="margin: 0px;padding: 0px;">
        <div style="text-align: left">
          <el-dialog
            :title="dialogTitle"
            style="padding: 0px;"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            width="30%">
            <el-row>
              <el-form-item label="密码" prop="password">
                <el-input v-model="password" type="password" style="width: 80%"
                          placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input v-model="checkPass" style="width: 80%"
                          type="password" placeholder="确认密码"></el-input>
              </el-form-item>

            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button  @click="cancelEidt">取 消</el-button>
              <el-button  type="primary" @click="addUser('addUserForm')">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-form>

      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb>
          <keep-alive>
            <router-view v-if="this.$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>


<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }
  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }
  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

</style>

<script>
  export default {
    methods:{
      updatePwd(){
        this.dialogTitle = "修改密码";
        this.dialogVisible = true;
      },
      cancelEidt(){
        this.dialogVisible = false;
        this.password ='';
        this.checkPass='';
      },
      handleCommand(cmd){
        var _this = this;
        if (cmd == 'logout') {
          _this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            _this.$store.commit('logout');
            _this.$router.replace({path: '/'});
          }).catch(() => {
          });
        }
        if (cmd == 'updatePwd'){
          _this.updatePwd();
        }
      }
    },
    data() {
      return {
        dialogTitle:'',
        dialogVisible: false,
        password:'',
        checkPass:''
      }
    },
    computed: {
      routes(){
        return this.$store.state.routes
      }
    }
  };
</script>
