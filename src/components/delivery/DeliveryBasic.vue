<template>
  <div style="margin-top: 20px">
    <el-form :inline="true">

      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="showDeliveryView()">
          添加兑换日期限制
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="showDeliveryView()">
          添加每日兑换次数限制
        </el-button>
      </el-form-item>
    </el-form>


    <el-table
      :data="deliveryData"
      v-loading="tableLoading"
      border
      stripe
      style="width: 100%">
      <el-table-column
        fixed
        align="center"
        prop="startDate"
        label="限制开始日期">
      </el-table-column>


      <el-table-column
        prop="endDate"
        label="限制开始日期"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createUser"
        label="创建人"
        align="center">
      </el-table-column>

      <el-table-column
        prop="name"
        label="启用状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1'">启用</span>
          <span v-if="scope.row.status === '0'">禁用</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        label="备注"
        align="center">
      </el-table-column>

      <el-table-column
        fixed="right"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="showEditView(scope.row)" size="small">修改</el-button>
          <el-button type="text" style="padding: 3px 4px 3px 4px;margin: 2px" size="small" @click="deleteDelivery(scope.row)">删除</el-button>
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

    <el-form :model="delivery" label-width="120px"
             :rules="rules" ref="addDeliveryDataForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :before-close="cancelView"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">

          <el-row>
            <el-form-item label="限制开始时间" prop="startDate">
              <el-date-picker style="width: 80%"
                v-model="delivery.startDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="限制结束时间" prop="endDate">
              <el-date-picker style="width: 80%"
                 v-model="delivery.endDate"
                 type="date"
                 placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="备注" prop="description">
              <el-input type="textarea"
                        maxLength="200"
                        v-model="delivery.description"
                        style="width: 80%"
                        placeholder="备注">
              </el-input>
            </el-form-item>
          </el-row>
          <span slot="footer" class="dialog-footer">
              <el-button  @click="cancelView">取 消</el-button>
              <el-button  type="primary" @click="addOrUpdateHandle('addDeliveryDataForm')">确 定</el-button>
            </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    mounted: function () {
      //this.loadChannels();
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
      showDeliveryView(){
        this.dialogVisible = true;
        this.dialogTitle = "添加兑换日期限制";
      },
      showEditView(row){
        this.dialogTitle = "修改渠道";
        this.channel = row;
        this.dialogVisible = true;
      },
      deleteChannel(row){

      },
      cancelView(){
        this.dialogVisible = false;
        this.emptyDeliveryData();
      },
      emptyDeliveryData(){
        this.delivery={
          id:0,
          startDate:'',
          status:''
        }
      },
      loadChannels(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/channel/list?page=" + this.currentPage + "&size=10&name="+this.selectChannel.name +"&status="+this.selectChannel.status).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.channelData = data.data.content;
            _this.totalCount = data.data.totalElements;
          }
        })
      },
      addOrUpdateHandle(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.channel.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/channel/update", this.channel).then(resp=> {
                this.tableLoading = false;
                if (resp && resp.status == 200) {
                  this.$message({showClose: true, type: 'success', message: "恭喜你，修改渠道成功"});
                  this.dialogVisible = false;
                  this.emptyUserData();
                  this.loadChannels();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/channel/add", this.channel).then(resp=> {
                this.tableLoading = false;
                if (resp && resp.status == 200) {
                  this.$message({showClose: true, type: 'success', message: "恭喜你，新增渠道成功"});
                  this.dialogVisible = false;
                  this.emptyChannelData();
                  this.loadChannels();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      deleteDelivery(row){
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
        this.deleteRequest("/channel/delete/" + ids).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            this.$message({showClose: true, type: 'success', message: "恭喜你，删除渠道成功"});
            this.loadChannels();
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
        delivery:{
          id:0,
          startDate:'',
          endDate:'',
          description:''
        },
        rules: {
          startDate: [
            { type: 'date', required: true, message: '请选择限制开始日期', trigger: 'change' }
          ],
          endDate: [
            { type: 'date', required: true, message: '请选择限制结束日期', trigger: 'change' }
          ]
        },
        deliveryData: []
      }
    }
  }
</script>

<style scoped>

</style>
