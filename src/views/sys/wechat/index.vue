<template>
  <div class="app-container">
    维修单列表
    <!--查询表单-->
    <!-- <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.repairUserName" placeholder="创建人姓名" @input="inputFunction()"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchObj.repairType" placeholder="维修项目" @input="inputFunction()"/>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getListOrder()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
      
    </el-form> -->

        <!-- 表格 -->
    <el-table
      :cell-style="cellStyle"
      :header-cell-style="rowClass"
      :data="list"
      style=""
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="repair_UserName" label="创建人学生姓名" width="150" />
      <!-- <el-table-column prop="repairUserName" label="维修员姓名" width="150" /> -->
      <el-table-column prop="repair_Doornum" label="房间号" width="150" />
      <el-table-column prop="repair_Type" label="维修项目" width="150" />
      <el-table-column prop="repair_Message" label="损坏原因以及维修建议"  width="200"/>
      <el-table-column label="维修状态" width="150" >
        <template slot-scope="scope">

         <!--  {{ scope.row.userType===1?'管理员':'普通用户' }} -->
          <el-tag type="danger" effect="dark" v-if="scope.row.repair_Status==0">未处理</el-tag>
          <el-tag type="warning" effect="dark" v-if="scope.row.repair_Status==1">处理中</el-tag>
          <el-tag type="success" effect="dark" v-if="scope.row.repair_Status==2">已处理</el-tag>
          
        </template>
      </el-table-column>

      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <router-link :to="'/order/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
          <el-button  @click="dialogVisible = true">添加评论</el-button>

          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <!-- <span>这是一段信息</span> -->
          <div class="block">
            <span class="demonstration">添加评分</span>
            <el-rate
              v-model="evaluatedata.star"
              :colors="colors">
            </el-rate>
          </div>
          <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入评论"
          v-model="evaluatedata.msgText">
        </el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmText()">确 定</el-button>
            </span>
          </el-dialog>
          <el-dropdown>
          <span class="el-dropdown-link">
            完成进度<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item @click="show(scope.row.id)">未开始</el-dropdown-item>
            <el-dropdown-item>进行中</el-dropdown-item>
            <el-dropdown-item>已完成</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </template>
      </el-table-column>

    </el-table>

   <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getListOrder"
    />
  </div>
  
</template>
<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

<script>
import order from '@/api/order'
import store from '../../../store'
import getters from '@/store/getters'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
export default {
   //定义变量和初始值
    data() {
        return {
            listLoading: true, // 是否显示loading信息
            list:null, //每页数据list集合
            total:0, //总记录数
            page:1,//当前页
            pageSize:4,//每页显示记录数
            loginUserName:"",
            loginObj:{
              loginUserName:""
            },
            dialogVisible:true,
            evaluatedata:{
              star: null,
              msgText:"",
            },
             
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
             dialogVisible: false,
             
            searchObj:{
              repairUserName:"",
              repairType:"",

            }//条件封装对象
        }
    },
     //在页面渲染之前调用，调用具体的某个方法
    created () {
        //调用方法
        this.getListOrder()
      
    },
    methods:{
     

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },

    cellStyle({row,column,rowIndex,columnIndex}){
          return "text-align:center";
        },
    rowClass({row,rowIndex}){
          return "text-align:center"
        },

        show(id){
          alert(id);
        },
         //2 删除的方法
      removeDataById(id) {
          this.$confirm('此操作将永久删除该报修单信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              //调用方法进行删除
              //return 表示后面then还会执行
              return order.deleteOrderId(id)
          }).then(() => {
               //刷新整个页面
              this.getListOrder()
              this.$message({
                   type: 'success',
                   message: '删除成功!'
               })
           }).catch(() => {
              //判断点击取消，还是删除失败
              if (response === 'cancel') {
                   this.$message({
                       type: 'info',
                       message: '已取消删除'
                   })
               } else {
                   this.$message({
                       type: 'error',
                       message: '删除失败'
                  })
              }           

            })
        },
      inputFunction(){
         if(this.searchObj.userName==""){
           this.getListOrder()
         }
       },
       getListOrder(page=1) {
         debugger
          this.page = page
            this.listLoading = true
            console.log(getToken);
            const TokenKey = 'TokenValue'
            console.log(Cookies.get(TokenKey));
            console.log(this.$store.getters);
            console.log(this.$store.getters.username);
            this.loginUserName=this.$store.getters.username;
            
            //console.log(getters.username);
            order.getOrderNameList(this.page,this.pageSize,this.loginUserName)
                .then(response => { //如果请求成功，返回状态码20000，执行then里面操作
                    console.log(response)
                   //每页数据
                   //this.list = response.data.data.items.list
                   this.list=response.list;

                   //总记录数
                   //this.total = response.data.data.items.total
                   this.total = response.total;

                   //console.log(response.data.data.items.list)

                   this.listLoading = false
                }) 
                .catch(response => { //如果请求失败，执行catch里面操作
                    console.log(response)
                })
        },

        resetData(){
           this.searchObj.repairName = "";
           this.searchObj.repairType = "";
           this.getListOrder();

        },

         confirmText(){
           //alert(this.evualatedata.value2)

          this.dialogVisible = false;

          order.addEvaluatedata(this.evaluatedata)
                .then(response => { //如果请求成功，返回状态码20000，执行then里面操作
                    console.log(response)
                    this.$message({
                    message: '添加评论成功',
                    type: 'success'
                  });
                }) 
                .catch(response => { //如果请求失败，执行catch里面操作
                    console.log(response)
                })

        }
    },
    
   
    

     
  
}
</script>
