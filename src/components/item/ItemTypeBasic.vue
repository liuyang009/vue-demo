<template>
  <div style="margin-top: 20px">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="selectItemType.name" placeholder="分类名称"  clearable></el-input>
      </el-form-item>

      <el-form-item>
   <!--     <el-button @click="cancelSearch">清空</el-button>-->
        <el-button @click="searchItemType">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="showItemTypeView()">
          添加分类
        </el-button>
      </el-form-item>
    </el-form>


    <el-table
      :data="itemTypeData"
      v-loading="tableLoading"
      border
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        align="center"
        prop="id"
        label="编号">
      </el-table-column>


      <el-table-column
        prop="name"
        label="分类名称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createUser"
        label="创建人"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
      </el-table-column>


      <el-table-column
        fixed="right"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="showEditView(scope.row)" size="small">修改</el-button>
          <el-button type="text" style="padding: 3px 4px 3px 4px;margin: 2px" size="small" @click="deleteItemType(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;margin: 20px 20px 20px 0px">
      <el-pagination
        @size-change="sizeChangeHandle"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="currentChangeHandle"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

    <el-form :model="itemType" label-width="85px"
             :rules="rules" ref="addItemTypeForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :before-close="cancelView"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">

          <el-row>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="itemType.name" style="width: 80%"
                        placeholder="请输入商品分类名称"></el-input>
            </el-form-item>

          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button  @click="cancelView">取 消</el-button>
              <el-button  type="primary" @click="addOrUpdateHandle('addItemTypeForm')">确 定</el-button>
            </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    mounted: function () {
      this.loadItemType();
    },
    methods:{
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.currentPage = 1
        this.loadChannels();
      },
      // 当前页
      currentChangeHandle (val) {
        this.currentPage = val
        this.loadChannels();
      },
      showItemTypeView(){
        this.dialogVisible = true;
        this.dialogTitle = "添加商品分类";
      },
      showEditView(row){
        this.dialogTitle = "修改商品分类";
        this.itemType = row;
        this.dialogVisible = true;
      },
      deleteChannel(row){

      },
      cancelSearch(){
        this.emptySelectItemTypeData();
        this.loadItemType()
      },
      searchItemType(){
        this.loadItemType();
      },
      cancelView(){
        this.dialogVisible = false;
        this.emptyItemTypeData();
      },
      emptySelectItemTypeData(){
        this.selectItemType={
          name:'',
        }
      },
      emptyItemTypeData(){
        this.itemType={
          name:''
        }
      },
      loadItemType(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/typeItem/list?page=" + this.currentPage + "&size=10&name="+this.selectItemType.name).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.itemTypeData = data.data.content;
            _this.totalCount = data.data.totalElements;
          }
        })
      },
      addOrUpdateHandle(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.itemType.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/typeItem/update", this.itemType).then(resp=> {
                this.tableLoading = false;
                if (resp && resp.status == 200) {
                  this.$message({showClose: true, type: 'success', message: "恭喜你，修改商品分类成功"});
                  this.dialogVisible = false;
                  this.emptyItemTypeData();
                  this.loadItemType();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/typeItem/add", this.itemType).then(resp=> {
                this.tableLoading = false;
                if (resp && resp.status == 200) {
                  this.$message({showClose: true, type: 'success', message: "恭喜你，新增商品分类成功"});
                  this.dialogVisible = false;
                  this.emptyItemTypeData();
                  this.loadItemType();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      deleteItemType(row){
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
        this.deleteRequest("/typeItem/delete/" + ids).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            this.$message({showClose: true, type: 'success', message: "恭喜你，删除商品分类成功"});
            this.loadItemType();
          }
        })
      }
    },
    data(){
      return{
        dialogTitle:'',
        dialogVisible: false,
        tableLoading: false,
        pageSize: 10,
        totalCount: 0,
        currentPage: 1,
        selectItemType:{
          name:''
        },
        itemType:{
          id:0,
          name:''
        },
        rules: {
          name: [
            { required: true, message: '请输入商品分类名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
        itemTypeData: []
      }
    }
  }
</script>

<style scoped>

</style>
