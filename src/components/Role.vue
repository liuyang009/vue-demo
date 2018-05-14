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
