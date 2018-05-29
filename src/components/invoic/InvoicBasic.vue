<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input  placeholder="酒店名称"  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button>查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
          新增进货单
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      border
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        align="center"
        prop="name"
        label="酒店名称">
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        label="进货日期"
        align="center">
        <template slot-scope="scope">{{ scope.row.gmtCreate | formatDateTime}}</template>
      </el-table-column>

      <el-table-column
        prop="itemName"
        label="商品名称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="invoicingNum"
        label="进货数量"
        align="center">
      </el-table-column>

      <el-table-column
        prop=""
        label="出库负责人"
        align="center">
      </el-table-column>

      <el-table-column
        prop=""
        label="酒店签收人"
        align="center">
      </el-table-column>

      <el-table-column
        fixed="right"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between;margin: 20px 20px 20px -10px">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <el-form :model="invoicing" label-width="85px"
             :rules="rules" ref="addInvoicingForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">
          <el-row>
            <el-form-item label="酒店名称" prop="name">
              <el-input v-model="invoicing.name" style="width: 80%"
                        placeholder="请输入酒店名称"></el-input>
            </el-form-item>

            <el-form-item label="进货日期:" prop="gmtCreate">
              <el-date-picker
                v-model="invoicing.gmtCreate"
                style="width: 80%"
                type="date"
                placeholder="进货日期">
              </el-date-picker>
            </el-form-item>

          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button  @click="cancelEidt">取 消</el-button>
              <el-button  type="primary" @click="addUser('addInvoicingForm')">确 定</el-button>
            </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
    export default {
      methods:{
        // 每页数
        sizeChangeHandle (val) {
          this.pageSize = val
          this.pageIndex = 1
        },
        // 当前页
        currentChangeHandle (val) {
          this.pageIndex = val
        },
        addOrUpdateHandle(){
          this.dialogTitle = "新增进货单";
          this.dialogVisible = true;
        },
        cancelEidt(){
          this.dialogVisible = false;
          this.emptyInvoicingData();
        },
        emptyInvoicingData(){
          this.invoicing={
            id: 0,
            name:'',
            gmtCreate:''
          }
        },
      },
      data() {
        return {
          addOrUpdateVisible: false,
          tableLoading: false,
          dialogTitle:'',
          dialogVisible: false,
          tableData: [],
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          invoicing:{
            id: 0,
            name:'',
            gmtCreate:''
          },
          rules: {
            name: [
              { required: true, message: '请输入酒店名称', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            gmtCreate: [
              {required: true, message: '请选择日期', trigger: 'change' }
            ]
          }
        }
      }
    };
</script>

<style scoped>

</style>
