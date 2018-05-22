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
