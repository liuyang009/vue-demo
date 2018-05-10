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
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu  default-active="2">
          <el-menu-item index="1" @click="menuRole(1)">
            <i class="el-icon-location-outline"></i>
            <span slot="title">门店管理</span>
          </el-menu-item>
          <el-menu-item index="2" @click="menuRole(2)">
            <i class="el-icon-sort"></i>
            <span slot="title">角色管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-view"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-menu"></i>
            <span slot="title">会员管理</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-goods"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <el-form :inline="true">
            <el-form-item>
              <el-input  placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button>查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus">
                新增角色
              </el-button>
            </el-form-item>
          </el-form>

          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              fixed
              align="center"
              prop="name"
              label="角色名称">
            </el-table-column>


            <el-table-column
              prop="desc"
              label="备注"
              align="center">
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="创建时间"
              align="center">
            </el-table-column>


            <el-table-column
              fixed="right"
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleClick(scope.row)" size="small">修改</el-button>
                <el-button type="text" @click="handleClick(scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 20px 20px 20px -10px;">
            <el-pagination
              background
              :page-size="10"
              :current-page="1"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="1">
            </el-pagination>
          </div>
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
      menuRole(type){
        if(type == 1){
          this.$router.push("/index");
        }else if(type == 2){
          this.$router.push("/role");
        }else {
          this.$router.push("/");
        }
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.$alert(currentChange);
      },
      handleClick(row) {
        this.$alert("查看");
      },
      handleCommand(cmd){
        var _this = this;
        if (cmd == 'logout') {
          _this.$confirm('注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$store.commit('logout');
            _this.$router.replace({path: '/'});
          }).catch(() => {
            _this.$message({
              type: 'info',
              message: '取消'
            });
          });
        }
      }
    },
    data() {
      return {
        tableData: [{
          name: '总管理',
          desc: '胡桃里园区店老板',
          createDate: '2018-05-10 10:27'
        }]
      }
    }
  };
</script>
