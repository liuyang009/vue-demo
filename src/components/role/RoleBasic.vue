<template>
  <div style="margin-top: 20px">
    <div style="text-align: left" v-loading="loading">
      <el-input placeholder="请输入角色英文名称..."
                style="width: 250px"
                v-model="newRole">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
        placeholder="请输入角色中文名称..."
        style="width: 250px"
        v-model="newRoleZh">
      </el-input>
      <el-button type="primary" style="margin-left: 5px" @click="addNewRole">添加角色</el-button>
    </div>
    <div style="margin-top: 10px;text-align: left">
      <el-collapse v-model="activeColItem" accordion style="width: 500px;" @change="collapseChange">
        <el-collapse-item v-for="(item,index) in roles" :title="item.nameZh" :name="item.id" :key="item.name">
          <el-card class="box-card">
            <div slot="header">
              <span>可访问的资源</span>
              <el-button type="text"
                         style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                         icon="el-icon-delete" @click="deleteRole(item.id,item.nameZh)"></el-button>
            </div>
            <div>
              <el-tree :props="props"
                       :key="item.id"
                       :data="treeData"
                       :default-checked-keys="checkedKeys"
                       node-key="id"
                       ref="tree"
                       show-checkbox
                       highlight-current
                       @check-change="handleCheckChange">
              </el-tree>
            </div>
            <div style="display: flex;justify-content: flex-end;margin-right: 10px">
              <el-button size="mini" @click="cancelUpdateRoleMenu">取消修改</el-button>
              <el-button type="primary" size="mini" @click="updateRoleMenu(index)">确认修改</el-button>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
  export default{
    mounted: function () {
     this.loading = true;
     this.initRoles();
    },
    methods: {
      deleteRole(rid, rname){
        var _this = this;
        this.$confirm('删除角色[' + rname + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.loading = true;
          _this.deleteRequest("/system/basic/role/" + rid).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.$message({type: data.status, message: data.msg})
              _this.initRoles();
            } else {
              _this.loading = false;
            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addNewRole(){
        if (isNotNullORBlank(this.newRole, this.newRoleZh)) {
          this.loading = true;
          var _this = this;
          this.postRequest("/system/basic/addRole", {
            role: this.newRole,
            roleZh: this.newRoleZh
          }).then(resp=> {
            if (resp && resp.status == 200) {
              var data = resp.data;
              _this.$message({type: data.status, message: data.msg});
              _this.initRoles();
              _this.newRole = '';
              _this.newRoleZh = '';
            } else {
              _this.loading = false;
            }
          })
        }
      },
      //有五个树，但是五个树用的同一个数据源
      updateRoleMenu(index){
        var checkedKeys = this.$refs.tree[index].getCheckedKeys(true);
        var _this = this;
        this.putRequest("/system/basic/updateMenuRole", {
          rid: this.activeColItem,
          mids: checkedKeys
        }).then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.msg})
            _this.activeColItem = -1;
          }
        })
      },
      collapseChange(activeName){
        if (activeName == '') {
          return;
        }
        var _this = this;
        this.getRequest("/menu").then(resp=> {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.treeData = data.data;
            _this.checkedKeys = data.mids;
          }
        })
      },
      handleCheckChange(data, checked, indeterminate) {
//        console.log(data,checked,indeterminate)
      },
      initRoles(){
        var _this = this;
        this.getRequest("/roles").then(resp=> {
          _this.loading = false;
          if (resp && resp.status == 200) {
            _this.roles = resp.data.data;
            _this.activeColItem=-1
          }
        })
      },
      cancelUpdateRoleMenu(){
        this.activeColItem = -1;
      }
    },
    data(){
      return {
        props: {
          label: 'name',
          children: 'children'
        },
        newRole: '',
        newRoleZh: '',
        roles: [],
        treeData: [],
        checkedKeys: [],
        loading: false,
        activeColItem: -1
      };
    }
  }
</script>



<!--
<template>
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
</template>



<script>
  export default {
    methods:{
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.$alert(currentChange);
      },
      handleClick(row) {
        this.$alert("查看");
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
-->
