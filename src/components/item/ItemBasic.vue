<template>
  <div style="margin-top: 20px">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="selectItem.name" placeholder="商品名称"  clearable></el-input>
      </el-form-item>

      <el-form-item>
        <!--     <el-button @click="cancelSearch">清空</el-button>-->
        <el-button @click="searchItem">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="showItemView()">
          添加商品
        </el-button>
      </el-form-item>
    </el-form>


    <el-table
      :data="itemData"
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
        label="商品名称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="typeName"
        label="分类名称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="purchasePrice"
        label="进价"
        align="center">
      </el-table-column>

      <el-table-column
        prop="price"
        label="建议售价"
        align="center">
      </el-table-column>

      <el-table-column
        prop="norms"
        label="规格"
        align="center">
      </el-table-column>

      <el-table-column
        prop="description"
        label="商品介绍"
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

    <el-form :model="item" label-width="85px"
             :rules="rules" ref="addItemForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :before-close="cancelView"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="30%">

          <el-row>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="item.name" style="width: 80%"
                        placeholder="请输入商品名称"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="status">
              <el-select v-model="item.itemTypeId" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品进价" prop="purchasePrice">
              <el-input v-model="item.purchasePrice" style="width: 80%"
                        placeholder="输入商品进价(单位：元)" type="number"></el-input>
            </el-form-item>

            <el-form-item label="建议售价" prop="price">
              <el-input v-model="item.price" style="width: 80%"
                        placeholder="输入建议售价(单位：元)" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品规格" prop="norms">
              <el-input v-model="item.norms" style="width: 80%"
                        placeholder="输入商品规格(单位：g/kg/只/袋)"></el-input>
            </el-form-item>

            <el-form-item label="商品介绍" prop="description">
              <el-input type="textarea" v-model="item.description" style="width: 80%"
                        placeholder="输入商品介绍"></el-input>
            </el-form-item>

            <el-form-item label="展示图:" prop="indexImages">
              <el-upload
                class="upload-demo"
                action="http://127.0.0.1:9090/api/upload2"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :beforeUpload="beforeAvatarUpload"
                :file-list="fileList"
                list-type="picture"
                :limit=1>
                <el-button size="small" type="primary">点击上传(最多1张)</el-button>
              </el-upload>
            </el-form-item>

            <el-form-item label="详情图:" prop="images">
              <el-upload
                class="upload-demo"
                action="http://127.0.0.1:9090/api/upload2"
                :on-remove="handle2Remove"
                :on-success="upload2Success"
                :beforeUpload="beforeAvatarUpload"
                :file-list="fileList2"
                list-type="picture"
                :limit=3>
                <el-button size="small" type="primary">点击上传(最多3张)</el-button>
              </el-upload>
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
    //  this.loadItem();
    },
    methods:{
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      uploadSuccess (response, file, fileList) {
        console.log('文件列表：', JSON.stringify(fileList))
        if (response.code && response.code != 200) {
          this.$message.error({message: response.msg});
        }
        console.log('上传文件', response)
      },
      handle2Remove(file, fileList2) {
        console.log(file, fileList2);
      },
      upload2Success (response, file, fileList2) {
        console.log('文件列表2：', JSON.stringify(fileList2))
        if (response.code && response.code != 200) {
          this.$message.error({message: response.msg});
        }
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
          this.$message({showClose: true, type: 'warning', message: "上传图片大小不能超过 2MB!"});
        }
        return extension || extension2 || extension3 || extension4 && isLt2M
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.currentPage = 1
        this.loadItem();
      },
      // 当前页
      currentChangeHandle (val) {
        this.currentPage = val
        this.loadItem();
      },
      showItemView(){
        this.dialogVisible = true;
        this.dialogTitle = "添加商品";
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
      searchItem(){
        this.loadItemType();
      },
      cancelView(){
        this.dialogVisible = false;
        this.emptyItemData();
        this.fileList=[];
        this.fileList2=[];
      },
      emptySelectItemTypeData(){
        this.selectItemType={
          name:'',
        }
      },
      emptyItemData(){
        this.item={
          name:''
        }
      },
      loadItem(){
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
                  this.loadItem();
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
                  this.loadItem();
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
            this.loadItem();
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
        options:[{
          value: 1,
          label: '海鲜'
        },{
          value: 2,
          label: '大闸蟹'
        }],
        selectItem:{
          name:''
        },
        item:{
          id:0,
          name:'',
          itemTypeId:'',
          purchasePrice:'',
          price:'',
          norms:'',
          description:''
        },
        rules: {
          name: [
            { required: true, message: '请输入商品分类名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ]
        },
        fileList: [],
        fileList2:[],
        itemData: []
      }
    }
  }
</script>

<style scoped>

</style>
