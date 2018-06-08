<template>
  <div style="margin-top: 20px">
    <el-form :inline="true">
      <el-form-item>
        <el-select style="width: 120px" v-model="voucher.status" placeholder="请选择状态">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select style="width: 150px" v-model="voucher.channel" placeholder="发放渠道">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-input v-model="voucher.name" placeholder="卡劵名称"  clearable></el-input>
      </el-form-item>


      <el-form-item>
        <el-date-picker
          v-model="voucher.gmtCreate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button>查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">
          兑换券发放
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
        prop="id"
        label="代理商编号"
      width="100px">
      </el-table-column>

      <el-table-column
        prop="name"
        label="名称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="mobile"
        label="联系电话"
        align="center">
      </el-table-column>

      <el-table-column
        prop="email"
        label="邮箱"
        align="center">
      </el-table-column>

      <el-table-column
        prop="agentNum"
        label="旗下代理"
        align="center">
      </el-table-column>

      <el-table-column
        prop="lowerNum"
        label="下级人数"
        align="center">
      </el-table-column>

      <el-table-column
        prop="area"
        label="所在区域"
        align="center">
      </el-table-column>

      <el-table-column
        prop="address"
        label="详细地址"
        align="center">
      </el-table-column>

      <el-table-column
        prop="deviceNum"
        label="设备数"
        align="center">
      </el-table-column>

      <el-table-column
        prop="totalMoney"
        label="总流水"
        align="center">
      </el-table-column>

      <el-table-column
        prop="accountBalance"
        label="账户余额"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createUser"
        label="创建人"
        align="center">
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        label="进货日期"
        align="center">
        <template slot-scope="scope">{{ scope.row.gmtCreate | formatDateTime}}</template>
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
    <div style="display: flex;justify-content: space-between;margin: 20px 20px 20px 0px">
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
        this.agentBusinessman={
          id: "",
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
        voucher:{
          id: '',
          status:'',
          name:'',
          gmtCreate:''
        },
        options2:[{
          value: 0,
          label: '全部'
        },{
          value: 1,
          label: '启用'
        },{
          value: 2,
          label: '禁用'
        }],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
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
