<template>
  <div>
      <el-form :inline="true">
        <el-form-item>
          <el-input  placeholder="门店名"  clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="showAddShopView">
            添加门店
          </el-button>
        </el-form-item>
        <el-tag type="info">你还可以添加9家门店</el-tag>
      </el-form>

      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          align="center"
          prop="name"
          label="门店名">
        </el-table-column>


        <el-table-column
          prop="address"
          label="门店地址"
          align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系电话"
          align="center">
        </el-table-column>

        <el-table-column
          prop="editShop"
          label="编辑店铺"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="managerShop(1)" >店铺管理</el-button>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditShopView(scope.row)" size="small">修改门店</el-button>
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
      <el-form :model="shop"  ref="addShopForm" style="margin: 0px;padding: 0px;">
        <div style="text-align: center">
          <el-dialog
            :title="dialogTitle"
            style="padding: 0px;"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
              <el-form-item label="活动图片:" prop="images">
                <el-upload
                  class="upload-demo"
                  action="http://127.0.0.1:9090/api/upload2"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :onSuccess="uploadSuccess"
                  :beforeUpload="beforeAvatarUpload"
                  :file-list="fileList2"
                  list-type="picture"
                  limit="3">
                  <el-button size="small" type="primary">点击上传</el-button>
                <!--  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
              </el-form-item>
              <el-form-item label="门店名称:" prop="name">
                <el-input v-model="shop.name" style="width: 350px"
                          placeholder="请输入门店名称"></el-input>
              </el-form-item>
              <el-form-item label="门店地址">
                <el-input  v-model="shop.address" style="width: 350px"
                           placeholder="请输入门店地址"></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input  v-model="shop.mobile" style="width: 350px"
                           placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button  @click="cancelEidt">取 消</el-button>
              <el-button  type="primary" @click="addEmp('addShopForm')">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-form>
  </div>
</template>

<script>
  export default {
    methods:{
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      uploadSuccess (response, file, fileList) {
        console.log('上传文件', response)
      },
      // 上传前对文件的大小的判断
      beforeAvatarUpload (file) {
        const extension = file.name.split('.')[1] === 'png'
        const extension2 = file.name.split('.')[1] === 'jpg'
        const extension3 = file.name.split('.')[1] === 'jpeg'
        const extension4 = file.name.split('.')[1] === 'bmp'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!extension && !extension2 && !extension3 && !extension4) {
          this.$message({showClose: true, type: 'warning', message: "上传图片只能是 png、jpg、jpeg、bmp 格式!"});
        }
        if (!isLt2M) {
          console.log('上传图片大小不能超过 2MB!')
        }
        return extension || extension2 || extension3 || extension4 && isLt2M
      },
      showEditShopView(row){
        this.dialogTitle = "修改门店";
        this.shop = row;
        this.shop.name = row.name;
        this.shop.address = row.address;
        this.shop.mobile = row.mobile;
        this.dialogVisible = true
      },
      emptyData(){
        this.shop={
          name: '',
          address:'',
          mobile:''
        }
      },
      managerShop(id){
        this.$router.push({
          path: '/shopManager/'+id
        })
      },
      showAddShopView(){
        this.dialogTitle = "添加门店";
        this.dialogVisible = true;
      },
      cancelEidt(){
        this.dialogVisible = false;
        this.emptyData();
      },
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
        dialogTitle:'',
        dialogVisible: false,
        shop:{
          id:'',
          name:'',
          address:'',
          mobile:''
        },
        fileList2: [],
        tableData: [{
          id:1,
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          mobile: '0512-85687963'
        }]
      }
    }
  };
</script>
