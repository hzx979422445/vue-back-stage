<template>
  <div class="login-wrap">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="username" :rules="filter_rules({required:'请输入用户名'})">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" @keyup.enter.native="submitForm('ruleForm')"
                    autoComplete="off" ></el-input>
        </el-form-item>
        <el-form-item prop="password" :rules="filter_rules({required:'请输入密码'})">
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"
                    @keyup.enter.native="submitForm('ruleForm')" autoComplete="off"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p style="font-size:12px;line-height:30px;color:#999;"></p>
      </el-form>
    </div>
  </div>
</template>

<script>
  import CryptoJS from 'crypto-js'

  export default {
    data: function () {
      return {
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {}
      }
    },
    methods: {
      getResult(str) {
        var key1 = "iqPdPo5efyo3pLBvqFZ0y2lGenzp52Th0XcZaeH03fqizEWKbGJhxXST4s4svaYN";
        var keyHex = CryptoJS.enc.Utf8.parse(key1);
        var encrypted = CryptoJS.DES.encrypt(str, keyHex, {
          iv: CryptoJS.enc.Utf8.parse(key1),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString();
      },
      submitForm(formName) {
        const self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            const param = {
              "username": this.getResult(this.ruleForm.username),
              "password": this.getResult(this.ruleForm.password)
            };
            sessionStorage.setItem('ms_user', '1019103151179046912');
            if (sessionStorage.getItem('ms_user') != null) {
              const user_id = sessionStorage.getItem('ms_user');
              /*self.$axios.post('http://172.16.30.198:9999/login',param ).then((response)=>{
               console.info(response);

               })*/
              //获取菜单
              self.$axios.get('http://172.16.30.45:9999/yt/rest/v1/role/sysall/1019103151179046912', "").then((response) => {
                if (response != undefined) {
                  let listParentMenu = response['listParentMenu'];
                  let listElment = response['listElment'];
                  this.setStorageData("menus", listParentMenu);
                  this.setStorageData("listElment", listElment);
                  let obj = [{
                    title: listParentMenu[0].name,
                    name: listParentMenu[0].url,
                    content: listParentMenu[0].name
                  }];
                  let tabStr = JSON.stringify(obj);
                  sessionStorage.setItem('tabUrl', tabStr);
                  self.$router.push('/' + listParentMenu[0].url);
                }
              })
            }
          } else {
          
            return false;
          }
        });
      },

    }
  }
</script>
<style lang="scss" scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;

  }

  .ms-login {
    @include positionCenter(300px, 160px, 40px);
    background: #fff;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }
</style>
