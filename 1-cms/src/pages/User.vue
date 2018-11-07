<template>
  <div class="app">
    <!-- {{multipleSelection}} -->
<!--     <div class="tbls">
      <el-button size="mini" type='default'>新增</el-button>
      <el-button size="mini" type='danger' @click='batchDelete'>批量删除</el-button>
    </div> -->
    <!-- 按钮区域 -->
    <div class="btns">
      <el-button size='mini' @click='toAddUser'>新增</el-button>
      <!-- <el-button size='mini' type="danger" @click='batchDeleteUser'>批量删除</el-button> -->
    </div>
    {{params}}

    <!-- 用户 -->
    <el-table :border='true' size="mini" :data="users" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="40">
      </el-table-column>
      <el-table-column
          prop="id"
          label="ID"
          width="100"
          align='center'>
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="真实姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="email"
        label="email"
        width="240">
      </el-table-column>
      <el-table-column
        prop="regTime"
        label="注册时间"
        width="240">
      </el-table-column>
       <el-table-column label="操作" width="100" align='center'>
          <template slot-scope='{row}'>
            <i class="fa fa-trash" @click='deleteUser(row.id)'></i>
          </template>
        </el-table-column>
    </el-table>
    <!-- 用户 -->
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        layout="prev, pager, next"
        :page-size='params.pageSize'
        @current-change='handleCurrentChange'
        :total="total">
      </el-pagination>
    </div>
    <!-- 分页结束 -->
    <!-- 模态框 -->
    <el-dialog :title="cDialog.title" :visible.sync="cDialog.visible">
      {{cDialog.form}}
      <el-form :model="cDialog.form" size="mini" label-position="left" >
        <el-form-item label="姓名" label-width="6em">
          <el-input v-model="cDialog.form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="6em">
          <el-input v-model="cDialog.form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="6em">
          <el-input v-model="cDialog.form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size='mini' @click='closeCDialog'>取 消</el-button>
        <el-button type="primary" size='mini' @click='saveOrUpdateUser'>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框结束 -->
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data(){
      return {
        loading:false,
        users:[],
        multipleSelection:[],
        cDialog:{
          title:'',
          visible:false,
          form:{}
        },
        total:5,
        params:{
          page:0,
          pageSize:5,
        }
      }
    },
    watch:{
      params:{
        handler:function(){
          this.findAllUsers();
        },
        deep:true
      }
    },
    methods:{
      batchDelete(){
        let ids = this.multipleSelection.map((item)=>{
          return item.id;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /* 弹出新增用户模态框 */ 
      toAddUser(){
        this.cDialog.title = '新增用户';
        this.cDialog.visible = true;
      },
      // toUpdateUser(row){
      //   this.cDialog.title='修改用户';
      //   this.cDialog.form=row;
      //   this.cDialog.visible = true;
      // },
      /*提交保存或者更新用户*/
      saveOrUpdateUser(){
        axios.post('/manager/user/saveOrUpdateUser',this.cDialog.form)
        .then(()=>{
          this.$notify.success({
                  title: '成功',
                  message: '提交成功！'
              });
              this.closeCDialog();
              this.findAllUsers();
        })
        .catch(()=>{
          this.$notify.error({
                  title: '错误',
                  message: '提交失败！'
              });
        });
      } ,
      /* 通过id删除用户 */ 
      deleteUser(id){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
              axios.get('/manager/user/deleteUserById?id='+id)
            .then(()=>{
              this.$notify.success({
                    title: '成功',
                    message: '删除成功！'
                });
                this.findAllUsers();
              })
              .catch(()=>{
                this.$notify.error({
                  title: '错误',
                  message: '删除失败！'
                });
          });
            })
      },
      handleCurrentChange(page){
        this.params.page = page -1;
      },
      /* 查询所有用户 */
      findAllUsers(){
        this.loading = true;
        axios.get('/manager/user/findAllUser')
        .then(({data:result})=>{
          this.total = result.data.total;
          this.users = result.data;
        })
        .catch(()=>{
          this.$notify.error({
                title: '错误',
                message: '网络异常！'
              });
        })
        .finally(()=>{
          this.loading=false;
        })
      },
      /*关闭模态了*/ 
      closeCDialog(){
        this.cDialog.form = {};
        this.cDialog.visible = false;
      },
      /* 弹出新增栏目模态框 */ 
      toAddCategory(){
        this.cDialog.title = '新增栏目';
        this.cDialog.visible = true;
      },
    },
    created(){
      this.findAllUsers();
    }
  }
</script>
<style>
  .btns {
    margin-bottom: .5em;
  }
  i.fa {
    margin: 0 .3em;
    cursor: pointer;
  }
  i.fa.fa-trash {
    color: #F56C6C;
  }
</style>