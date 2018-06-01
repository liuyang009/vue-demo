<template>
    <div style="margin-top: 20px">
      <el-form :inline="true">
        <el-form-item >
          <el-select v-model="selectChannel.status" placeholder="请选择状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="selectChannel.name" placeholder="渠道名称"  clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelSearch">清空</el-button>
          <el-button @click="searchChannel">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="showChannelView()">
            添加渠道
          </el-button>
        </el-form-item>
      </el-form>


      <el-table
        :data="channelData"
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
          label="名称"
          align="center">
        </el-table-column>

        <el-table-column
          prop="name"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '1'">启用</span>
            <span v-if="scope.row.status === '0'">禁用</span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showEditView(scope.row)" size="small">修改</el-button>
            <el-button type="text" style="padding: 3px 4px 3px 4px;margin: 2px" size="small" @click="deleteChannel(scope.row)">删除</el-button>
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

      <el-form :model="channel" label-width="85px"
               :rules="rules" ref="addChannelForm" style="margin: 0px;padding: 0px;">
        <div style="text-align: left">
          <el-dialog
            :title="dialogTitle"
            style="padding: 0px;"
            :before-close="cancelView"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            width="30%">

            <el-row>
              <el-form-item label="渠道名称" prop="name">
                <el-input v-model="channel.name" style="width: 80%"
                          placeholder="请输入渠道名称"></el-input>
              </el-form-item>

              <el-form-item label="选择状态" prop="status">
                <el-select v-model="channel.status" placeholder="请选择">
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
              <el-button  @click="cancelView">取 消</el-button>
              <el-button  type="primary" @click="addOrUpdateHandle('addChannelForm')">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </el-form>
    </div>
</template>

<script>
    export default {
      name: "ChannelBasic",
      mounted: function () {
        this.loadChannels();
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
        showChannelView(){
          this.dialogVisible = true;
          this.dialogTitle = "添加渠道";
        },
        showEditView(row){
          this.dialogTitle = "修改渠道";
          this.channel = row;
          this.dialogVisible = true;
        },
        deleteChannel(row){

        },
        cancelSearch(){
          this.emptySelectChannelData();
          this.loadChannels();
        },
        searchChannel(){
          this.loadChannels();
        },
        cancelView(){
          this.dialogVisible = false;
          this.emptyChannelData();
        },
        emptySelectChannelData(){
          this.selectChannel={
            name:'',
            status:''
          }
        },
        emptyChannelData(){
          this.channel={
            id:0,
            name:'',
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
        deleteChannel(row){
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
          totalCount: -1,
          currentPage: 1,
          selectChannel:{
            status:'',
            name:''
          },
          channel:{
            id:0,
            status:'',
            name:''
          },
          options:[{
            value: "0",
            label: '禁用'
          },{
            value: "1",
            label: '启用'
          }],
          rules: {
            name: [
              { required: true, message: '请输入渠道名称', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            status: [
              { required: true, message: '请选择活动区域', trigger: 'change' }
            ]
          },
          channelData: []
        }
      }
    }
</script>

<style scoped>

</style>
