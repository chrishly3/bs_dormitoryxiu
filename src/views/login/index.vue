<template>
  <div class="login-container" :style="{ background: 'url('+ bgImageRUL +')',backgroundSize: 'cover' ,backgroundRepeat: 'no-repeat',opacity: 0.75}">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
    <div class="title-container">
          <h3 class="title">
            {{ "寝室报修系统"}}
          </h3>
          <lang-select class="set-language" />
        </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          class="form-input"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="请输入用户名"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="loginForm.password"
          :type="pwdType"
          class="form-input"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item prop="codeText">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              v-model="loginForm.codeText"
              class="code-text"
              name="codeText"
              type="text"
              maxlength="100"
              auto-complete="on"
              placeholder="请输入验证码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-tooltip content="[ 点击 ] 刷新验证码" placement="right" effect="light">
            <el-image :src="codeUrl" style="cursor:pointer;border-radius: 5px;" fit="fit" @click="changeImageCode">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-tooltip>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
          class="btn-login"
        >登录</el-button>
      </el-form-item>

      <div class="tips">
        <span style="margin-right:20px;">用户名:&nbsp;&nbsp;&nbsp; {{ loginForm.username }}</span><br><br>
        <span>密码: &nbsp;&nbsp;&nbsp; {{ loginForm.password }}</span>
      </div>
    </el-form>

    <vue-particles
      color="#fff"
      :particle-opacity="0.7"
      :particles-number="60"
      shape-type="triangle"
      :particle-size="4"
      lines-color="#fff"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
    />
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('用户名不能小于5位'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validateCodeText = (rule, value, callback) => {
      if (value.length !== 4) {
        callback(new Error('验证码只能是4位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'root_admin',
        password: 'root_admin',
        codeKey: '',
        codeText: ''
      },
      bgImageRUL: require('@/views/login/background.jpg'),
      codeUrl: '',
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        codeText: [
          { required: true, trigger: 'blur', validator: validateCodeText }
        ]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.randomCodeKey()
    this.changeImageCode()
  },
  methods: {
    // 显示密码
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 登录
    handleLogin() {
      const _this = this
      _this.$refs.loginForm.validate(valid => {
        if (valid) {
          _this.loading = true
          _this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              _this.loading = false
              _this.$router.push({ path: this.redirect || '/dashboard' })
            })
            .catch((msg) => {
              _this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeImageCode() {
      var arr = [
        process.env.VUE_APP_BASE_API,
        '/auth/verify/code',
        '/',
        this.loginForm.codeKey,
        '?r=',
        Math.ceil(Math.random() * 100)
      ]
      var str = arr.join('')
      this.codeUrl = str
    },
    // 随机 生成 18位 字符串
    randomCodeKey() {
      var s = []
      var hexDigits = '0123456789abcdefghijklmnopqrstuvwxyz'
      for (var i = 0; i < 24; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      var uuid = s.join('')
      this.loginForm.codeKey = uuid
    }
  }
}
</script>

<style  lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #eee;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
   /* background:url(../login/login3.jpg);
    background-size:100% 100%;
    background-repeat:no-repeat; */

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      caret-color: $cursor;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
         -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style  lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 18px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #4cc3b8;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #4cc3b8;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .svg-container {
   padding: 6px 5px 6px 15px;
    color: $light_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  // .title {
  //   font-size: 26px;
  //   font-weight: 400;
  //   color: $light_gray;
  //   margin: 0px auto 40px auto;
  //   text-align: center;
  //   font-weight: bold;
  // }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }
   @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

  .btn-login{
      color: #FFFFFF;
      background-color:#4cc3b8;
      border-color:#4cc3b8;
    }
  el-input__inner::placeholder {
    color: $light_gray;
  }
</style>
