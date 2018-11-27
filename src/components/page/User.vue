<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
        <el-breadcrumb-item>基础表格</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="handle-box">
      <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
      <el-button type="primary" icon="add" class="handle-del mr10" @click="addEquipment('ruleForm')"
                 v-isExistButton="1021653911901184000" :buttons="JSON.stringify(menuButton)">新增
      </el-button>
      <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
        <el-option key="1" label="广东省" value="广东省"></el-option>
        <el-option key="2" label="湖南省" value="湖南省"></el-option>
      </el-select>
      <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="search" @click="search">搜索</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange"
              :height='this.$store.state.fullHeight'>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="user.id" label="日期" sortable width="150">
      </el-table-column>
      <el-table-column prop="user.username" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="user.password" label="地址">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope)">编辑
          </el-button>
          <el-button size="small" type="danger"
                     @click="handleDelete(scope)" v-isExistButton="1021653982852030464"
                     :buttons="JSON.stringify(menuButton)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :current-page="this.$store.state.pageNo"
        :total="this.$store.state.pageCount">
      </el-pagination>
    </div>
    <!--新增和编辑-->
    <el-dialog
      :title="titleMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :before-close="closeDialog"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="账号" prop="username" :rules="filter_rules({required:'请输入账号',type:'regexn'})">
          <el-input v-model="ruleForm.username" auto-complete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item  label="密码" prop="password" :rules="filter_rules({required:'请输入密码',type:'regexn'})" v-if="showPassInput">
          <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :rules="filter_rules({required:true})">
          <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
          <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
        </el-form-item>

        <el-form-item label="角色" prop="role">

          <el-select v-model="userRole"  multiple placeholder="请选择">
            <el-option
              v-for="item in userRoles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!--<el-checkbox-group  v-model="userRole">
            <el-checkbox v-for="item in userRoles" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>-->
        </el-form-item>

        <el-form-item label="用户组" prop="usergroup">

          <el-tree style=" float: left;  padding-right: 30px;"
                   :data="usergroups"
                   show-checkbox
                   node-key="id"
                   ref="treea"
                   highlight-current
                   :default-expanded-keys="usergroup"
                   :default-checked-keys="usergroup"
                   :props="defaultProps">
          </el-tree>
         <!-- <el-checkbox-group  v-model="usergroup">
            <el-checkbox v-for="item in usergroups" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="okDialog('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        menuButton: {},//菜单存放的对应的url和按钮权限
        dialogFormVisible: false,
        ruleForm: {},
        showPassInput:true,
        //新增or编辑弹框标题
        titleMap: {
          addButton: '新增用户',
          editButton: "修改用户"
        },
        //判断进入的是新增页面或修改页面的按钮
        dialogStatus: "",
        rules: {},
        usergroups: [],
        usergroup: [],
        userRole:[],
        userRoles:[],
        roleUrl:"",
        groupUrl:"",
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        groupTreeUrl:""
      }
    },
    created: function () {
      const self = this;
      this.$store.dispatch('reset');
      this.menuButton = this.getMenuButton();
      self.getData(this.$store.state.pageNo);
      self.$store.state.fullHeight = this.listTableMinHeight();
      this.$store.state.addUrl = this.getMenuUrl("useradd");
      this.groupUrl = this.getMenuUrl("usergrouplist");
      this.roleUrl = this.getMenuUrl("rolelist");
      this.groupTreeUrl= this.getMenuUrl("grouptree");
    },
    mounted: function () {
      const self = this;
      window.onresize = () => {
        return (() => {
          self.$store.state.fullHeight = this.listTableMinHeight();
        })()
      }
    },
    methods: {
      handleCurrentChange(val) {//分页
        this.$store.state.pageNo = val;
        this.getData(val);
      },
      getData(pageNo) {//获取列表数据
        this.$store.state.listUrl = this.getMenuUrl("userlist");
        let data={"username":this.select_word};
        this.$axios.post(this.$store.state.listUrl, data, {
          "Page-Number": pageNo,
          "Page-Size": 10,
          "OrderBy": "id",
          "Dir": "desc"
        }).then((response) => {
          this.tableData = response;
          this.$store.state.pageCount = Number(sessionStorage.getItem('pageCount')) * 10;
        });
      },
      //获取用户组
      getGroups() {
        this.usergroup = [];
        this.usergroups = [];
        this.$axios.get(this.groupTreeUrl).then((response) => {
          this.usergroups=response;
        });
      },
      //获取角色组
      getRoles(){
        this.userRole=[];
        this.userRoles=[];
        this.$axios.post(this.roleUrl).then((response) => {
          for(let i=0; i<response.length;i++) {
            this.userRoles.push(response[i].role);
          };
        });
      },
      //新增
      addEquipment(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        this.ruleForm = {}//重置输入框
        //显示弹框
        this.showPassInput = true;
        this.dialogFormVisible = true;
        //新增弹框标题
        this.dialogStatus = "addButton";
        this.getGroups();
        this.getRoles();
      },
      //Dialog取消事件
      cancelDialog(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
        this.ruleForm = {}//重置输入框
      },
      //Dialog确定事件
      okDialog(formName) {
        this.usergroup=this.$refs.treea.getCheckedKeys(true);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogStatus == 'addButton') {//新增
              this.ruleForm.roleids=this.userRole;
              this.ruleForm.groupids=this.usergroup;
              this.$axios.post(this.$store.state.addUrl,this.ruleForm).
              then((res) => {
                this.dialogFormVisible = false;
                this.getData(this.$store.state.pageNo);
              });
            } else if (this.dialogStatus == 'editButton') {//修改
              this.ruleForm.roleids=this.userRole;
              this.ruleForm.groupids=this.usergroup;
              this.$axios.put(this.$store.state.editUrl, this.ruleForm).then((response) => {
                this.dialogFormVisible = false;
                this.getData(this.pageNo);
              });

            }
          } else {
            this.$message("验证失败")
            return false;
          }
        });
      },
      //Dialog关闭事件
      closeDialog(done) {
        this.ruleForm = {}//重置输入框
        done();
      },
      search() {
        this.$store.state.pageNo = 1;
        this.getData(this.$store.state.pageNo);
      },
      //编辑按钮事件
      handleEdit(scope) {
        const self = this;
        const links = scope.row.links;
        if (links.length != undefined) {
          self.$store.state.editUrl = self.getMenuUrl('self', links);
        }
        self.$axios.get(self.$store.state.editUrl, "").then((response) => {
          this.ruleForm = response;
          this.getGroups();
          this.getRoles();
          for(let i=0; i<response.groups.length;i++) {
            this.usergroup.push(response.groups[i].id);
          };
          for(let j=0; j<response.roles.length;j++) {
            this.userRole.push(response.roles[j].id);
          };
          this.showPassInput = false;
          this.dialogFormVisible = true;
          //编辑弹框标题
          self.dialogStatus = "editButton";
        });
      },
      handleDelete(scope) {

      },
      delAll() {
        const self = this;
        const deleteArr = [];
        length = self.multipleSelection.length;
        if (length > 0) {
          for (let i = 0; i < length; i++) {
            deleteArr.push(self.multipleSelection[i].user.id);
          }
          //调用删除接口
          self.multipleSelection = [];//重置选择器
        } else {
          self.$message.error('请优先选择要删除内容');
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
  .el-tree {
    cursor: default;
    background: #edf7ff;
    border: 1px solid #d1dbe5;
  }
</style>
