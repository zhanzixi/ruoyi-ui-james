<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">James的后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
            v-model="loginForm.username"
            auto-complete="off"
            placeholder="账号"
            autofocus
            prefix-icon="el-icon-user-solid">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            @keyup.enter.native="handleLogin">
        </el-input>
      </el-form-item>
      <!--<el-form-item prop="code">
        <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>-->
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin">
          登 录
          <!--<span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>-->
        </el-button>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <!--    <div class="el-login-footer">-->
    <!--      <span>Copyright © 2018-2020 www.sjgo365.com All Rights Reserved.</span>-->
    <!--    </div>-->
  </div>
</template>

<script>
  import axios from '@/utils/axios'
  import Cookies from 'js-cookie'

  export default {
    name: "login",
    data: function () {
      return {
        loginForm: {
          username: '',
          password: '',
          rememberMe: false,
          code: '',
          uuid: ''
        },
        loginRules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
          ]
        },
        codeUrl: '',
        loading: false
      }
    },
    props: ['redirect'],
    created() {
      if (Cookies.get('rememberMe')) {
        this.loginForm.username = Cookies.get('username')
        this.loginForm.password = Cookies.get('password')
        this.loginForm.rememberMe = true
      }
    },
    methods: {
      handleLogin() {
        this.$refs['loginForm'].validate(valid => {
          if (valid) {
            this.loading = true
            if (this.loginForm.rememberMe) {
              Cookies.set('username', this.loginForm.username, {expires: 30})
              Cookies.set('password', this.loginForm.password, {expires: 30})
              Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30})
            } else {
              Cookies.remove('username')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }

            // 这里模拟登录ajax
            axios.post('/system/login', this.loginForm).then(res => {
              sessionStorage.setItem('token', res.data.data)
              // this.$store.commit('setUserInfo', res.data.data)
              // sessionStorage.setItem('token', res.data.data)
              this.$router.push(this.redirect ? this.redirect : '/')
            }).finally(() => this.loading = false)

            /*window.setTimeout(() => {
              sessionStorage.setItem('user', this.loginForm.username)
              this.$router.push(this.redirect ? this.redirect : '/')
              this.loading = false
            }, 2000)*/
          }
        })
      },
      getCode() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .login {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url("../assets/images/login-background.jpg");
    background-size: cover;
    text-align: left;

    .login-form {
      .title {
        margin: 0px auto 30px auto;
        text-align: center;
        color: #707070;
      }

      width: 400px;
      padding: 25px 25px 5px 25px;
      border-radius: 6px;
      background-color: #fff;
    }
  }


</style>
