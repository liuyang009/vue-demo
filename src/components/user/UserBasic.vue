<template>
  <div style="margin-top: 10px">
      <el-form :inline="true">
        <el-form-item>
          <el-input  placeholder="用户名" v-model="user.username" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input  placeholder="手机号"  v-model="user.mobile" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelSearch">清空</el-button>
          <el-button @click="searchUser">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="showAddUserView">
            添加用户
          </el-button>
          <el-button type="danger"  v-if="userData.length>0" :disabled="multipleSelection.length==0"
                     @click="deleteManyUsers">批量删除
          </el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="userData"
        v-loading="tableLoading"
        border
        stripe
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          width="30">
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          prop="username"
          label="用户名">
        </el-table-column>


        <el-table-column
          prop="name"
          label="姓名"
          align="center">
        </el-table-column>

        <el-table-column
          prop="birth"
          label="出生年月"
          align="center">
          <template slot-scope="scope">{{ scope.row.birth | formatDate}}</template>
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          width="160px">
        </el-table-column>

        <el-table-column
          prop="mobile"
          label="手机号"
          align="center">
        </el-table-column>

        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          align="center"
          width="160px">
          <template slot-scope="scope">{{ scope.row.gmtCreate | formatDateTime}}</template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 0">禁用</span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditShopView(scope.row)" size="small">修改用户</el-button>
            <el-button type="text" style="padding: 3px 4px 3px 4px;margin: 2px" size="small" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        <div style="display: flex;justify-content: space-between;margin: 20px 20px 20px 0px">
          <el-pagination
            @size-change="sizeChangeHandle"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="currentChange"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>

      <el-form :model="user" label-width="85px"
               :rules="rules" ref="addUserForm" style="margin: 0px;padding: 0px;">
        <div style="text-align: left">
          <el-dialog
            :title="dialogTitle"
            style="padding: 0px;"
            :before-close="cancelEidt"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            width="30%">
            <el-row>
              <el-form-item label="用户名" prop="username">
                <el-input v-model="user.username" style="width: 80%"
                          placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input  v-model="user.name" style="width: 80%"
                           placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input  v-model="user.email" style="width: 80%"
                           placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input  v-model="user.mobile" style="width: 80%"
                           placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="出生日期:" prop="birth">
                <el-date-picker
                  v-model="user.birth"
                  style="width: 80%"
                  type="date"
                  placeholder="出生日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item label="密码" prop="password"  v-if="showPwd">
                <el-input v-model="user.password" type="password" style="width: 80%"
                          placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass"  v-if="showPwd">
                <el-input v-model="user.checkPass" style="width: 80%"
                          type="password" placeholder="确认密码"></el-input>
              </el-form-item>


              <el-form-item label="选择状态:">
                <el-select v-model="user.status" placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>


              <el-form-item label="选择角色:" prop="roleIds">
                <el-select v-model="user.roleIds" multiple placeholder="请选择" style="width: 80%">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button  @click="cancelEidt">取 消</el-button>
              <el-button  type="primary" @click="addUser('addUserForm')">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-form>
  </div>
</template>

<script>
  export default {
    mounted: function () {
      this.loadUsers();
    },
    methods:{
      showEditShopView(row){
        this.dialogTitle = "修改用户";
        this.user = row;
        this.dialogVisible = true;
        this.showPwd = false;
      },
      cancelSearch(){
        this.emptyUserData();
      },
      searchUser(){
        this.loadUsers();
      },
      loadUsers(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/user/list?page=" + this.currentPage + "&size=10&username="+this.user.username+"&mobile="+this.user.mobile).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.userData = data.data.content;
            _this.totalCount = data.data.totalElements;
            _this.options = data.roles;
          }
        })
      },
      addUser(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.user.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/user/edit", this.user).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  _this.$message({showClose: true, type: 'success', message: "恭喜你，修改用户成功"});
                  _this.dialogVisible = false;
                  _this.emptyUserData();
                  _this.loadUsers();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/user/add", this.user).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  _this.$message({showClose: true, type: 'success', message: "恭喜你，新增用户成功"});
                  _this.dialogVisible = false;
                  _this.emptyUserData();
                  _this.loadUsers();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyUsers(){
        this.$confirm('此操作将删除[' + this.multipleSelection.length + ']条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = '';
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
          }
          this.doDelete(ids);
        }).catch(() => {
        });
      },
      deleteUser(row){
        this.$confirm('此操作将永久删除[' + row.name + '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDelete(row.id);
        }).catch(() => {
        });
      },
      doDelete(ids){
        this.tableLoading = true;
        var _this = this;
        this.deleteRequest("/user/delete/" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            _this.$message({showClose: true, type: 'success', message: "恭喜你，删除用户成功"});
            _this.loadUsers();
          }
        })
      },
      emptyUserData(){
        this.user={
          id: 0,
          name:'',
          username:'',
          mobile:'',
          email:'',
          birth:'',
          status: 1,
          password:'',
          checkPass:'',
          roleIds:[]
        }
      },
      showAddUserView(){
        this.dialogTitle = "添加用户";
        this.dialogVisible = true;
      },
      cancelEidt(){
        this.dialogVisible = false;
        this.emptyUserData();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadUsers();
      },
      sizeChangeHandle (val) {
        this.pageSize = val
        this.currentPage = 1
        this.loadUsers();
      },
    },
    data() {

      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }

      return {
        dialogTitle:'',
        dialogVisible: false,
        tableLoading: false,
        showPwd: true,
        multipleSelection: [],
        pageSize: 10,
        totalCount: 0,
        currentPage: 1,
        user:{
          id: 0,
          name:'',
          username:'',
          status: 1,
          mobile:'',
          email:'',
          birth:'',
          password:'',
          checkPass:'',
          roleIds:[]
        },
        options: [],
        options2:[{
          value: 1,
          label: '正常'
        }, {
          value: 0,
          label: '禁用'
        }],
        rules: {
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          birth: [
            {required: true, message: '请选择日期', trigger: 'change' }
          ],
          roleIds: [
            {required: true, message: '请选择角色', trigger: 'blur' }
          ],
          email: [
            {required: true, message: '请输入电子邮箱', trigger: 'blur'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
          ]
        },
        userData: []
      }
    }
  };
</script>
