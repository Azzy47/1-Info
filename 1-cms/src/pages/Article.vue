<template>
	<div class="article">
		<!-- 按钮区 -->
		<div class="btns">
			<el-select size='mini' v-model="params.categoryId" clearable placeholder="所有栏目" style="width:120px">
		    <el-option v-for='c in categories' :key='c.id' :value='c.id' :label='c.name'> </el-option>
		  </el-select>
		  <el-input
		  	style='width:120px'
			  placeholder="请输入关键字" size='mini' 
			  v-model="params.keywords"
			  clearable>
			</el-input>
			<el-button size='mini'>新增</el-button>
			<el-button size='mini'>批量删除</el-button>
		</div>
		<!-- 按钮区结束 -->
		<!-- 列表区 -->
		{{params}}
		<div class="article_tbl" v-loading='loading'>
			<el-table 
				:data="articles" 
				style="width: 100%;height: 300px;" size='mini' :border='true'
				@selection-change="handleSelectionChange">
		     	<el-table-column
			      	type="selection"
			      	width="40">
			    </el-table-column>
			    <el-table-column
		        	prop="id"
		        	label="编号"
		        	width="100">
		      	</el-table-column>
		      	<el-table-column
		        	prop="title"
		        	label="文章标题">
		      	</el-table-column>
		      	<el-table-column
		        	prop="category.name"
		        	label="所属栏目"
		        	width="200">
		      	</el-table-column>
		      	<el-table-column
			        prop="author"
			        label="作者"
			        width="200">
		      	</el-table-column>
		     	<el-table-column
			        prop="publishtime"
			        label="发布时间"
			        width="200">
		      	</el-table-column>
		      	<el-table-column
			        prop="readtimes"
			        label="阅读次数"
			        width="120">
		      	</el-table-column>
		      	<el-table-column label="操作" width='100'>
		      		<template slot-scope='{row}'>
			      		<i class="fa fa-trash" @click='deleteArticle(row.id)'></i>
			      		<i class="fa fa-pencil" @click='toUpdateArticle(row)'></i>
			      	</template>
		      	</el-table-column>
	    	</el-table>
		</div>
		<!-- 列表区结束 -->
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

		<!-- 模态框结束 -->
	</div>
</template>
<script>
	import axios from '@/http/axios';
	export default {
		data(){
			return {
				loading:false,
				categories:[],
				articles:[],
				multipleSelection:[],
				total:1,
				params:{
					page:0,
					pageSize:5,
				}
			}
		},
		watch:{
			params:{
				handler:function(){
					this.findAllArticles();
				},
				deep:true
			}
		},
		created(){
			this.findAllCategories();
			this.findAllArticles();
		},
		methods:{
			handleCurrentChange(page){
				this.params.page = page -1;
			},
			/* 查询所有栏目 */
			findAllCategories(){
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					this.categories = result.data;
				})
				.catch(()=>{
					this.$notify.error({
		          		title: '错误',
		          		message: '网络异常！'
	        		});
				})
			},
			/* 查询所有文章 */
			findAllArticles(){
				this.loading=true;
				axios.get('/manager/article/findArticle',{
					params:this.params
				})
				.then(({data:result})=>{
					this.total = result.data.total;
					this.articles = result.data.list;
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
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			deleteArticle(id){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        })
		        .then(()=>{
        			axios.get('/manager/article/deleteArticleById?id='+id)
						.then(()=>{
							this.$notify.success({
				          	title: '成功',
				          	message: '删除成功！'
				        });
				        this.findAllArticles();
							})
							.catch(()=>{
								this.$notify.error({
				          title: '错误',
				          message: '删除失败！'
				        });
					});
		        })
			},
			toUpdateArticle(row){
				alert("修改");
			}
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






