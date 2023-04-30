<template>
  <div class="login-container">
    <div id="particles-js">
      <!-- <vue-particles
        v-if="refreshParticles"
        color="#dedede"
        :particle-opacity="0.7"
        :particles-number="80"
        shape-type="circle"
        :particle-size="4"
        lines-color="#dedede"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        hover-mode="grab"
        :click-effect="true"
        click-mode="push"
      /> -->
    </div>

    <div class="login-weaper animated bounceInDown">
      <div class="login-left">
        <div class="login-time" v-text="currentTime" />
        <p class="title" v-text="sysInfo.sys_app_name" />
      </div>
      <div class="login-border">
        <div class="login-main">
          <div class="login-title">用户登录</div>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
          >
            <el-form-item prop="username">
              <span class="svg-container">
                <i class="el-icon-user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>

            <el-tooltip
              v-model="capsTooltip"
              content="Caps lock is On"
              placement="right"
              manual
            >
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  autocomplete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon
                    :icon-class="
                      passwordType === 'password' ? 'eye' : 'eye-open'
                    "
                  />
                </span>
              </el-form-item>
            </el-tooltip>
            <el-form-item prop="code" style="width: 66%; float: left">
              <span class="svg-container">
                <svg-icon icon-class="validCode" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.code"
                placeholder="验证码"
                name="username"
                type="text"
                tabindex="3"
                maxlength="5"
                autocomplete="off"
                style="width: 75%"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <div
              class="login-code"
              style="
                cursor: pointer;
                width: 30%;
                height: 48px;
                float: right;
                background-color: #f0f1f5;
              "
            >
              <img
                style="
                  height: 48px;
                  width: 100%;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  border-radius: 5px;
                "
                :src="codeUrl"
                @click="getCode"
              >
            </div>

            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; padding: 12px 20px; margin-bottom: 30px;margin-left: 0px"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <el-button
              :loading="loading"
              type="primary"
              style="width: 100%; padding: 12px 20px; margin-bottom: 30px;margin-left: 0px"
              @click="handleRegister"
            >
            <span v-if="!loading">注 册</span>
              <span v-else>注 册 中...</span>
            </el-button>
          </el-form>
        </div>
      </div>
      <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false" :append-to-body='true'>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名称" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户性别">
                <el-select v-model="form.sex" placeholder="请选择">
                  <el-option
                    v-for="dict in sexOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.value"
                    :label="dict.value"
                  >{{ dict.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <el-dialog title="Or connect with" :visible.sync="showDialog" :close-on-click-modal="false">
      Can not be simulated on local, so please combine you own business
      simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
    <div
      id="bottom_layer"
      class="s-bottom-layer s-isindex-wrap"
      style="visibility: visible; width: 100%"
    >
      <div class="s-bottom-layer-content">
        <div class="open-content-info">
          <div class="tip-hover-panel" style="top: -18px; right: -12px">
            <div class="rest_info_tip">
              <div class="tip-wrapper">
                <div class="lh tip-item" style="display: none">
                  <a
                    class="text-color"
                    href="https://beian.miit.gov.cn"
                    target="_blank"
                  >
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listUser, addUser, updateUser } from '@/api/admin/sys-user'
import { getCodeImg } from '@/api/login'
import moment from 'moment'
import SocialSign from './components/SocialSignin'

import { listPost } from '@/api/admin/sys-post'
import { listRole } from '@/api/admin/sys-role'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    return {
      codeUrl: '',
      cookiePassword: '',
      refreshParticles: true,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [
          { required: true, trigger: 'change', message: '验证码不能为空' }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      currentTime: null,
      sysInfo: '',
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: [],
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        phone: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        username: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
        nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          { type: 'email', message: "'请输入正确的邮箱地址", trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    // window.addEventListener('storage', this.afterQRScan)
    this.getCurrentTime()
    this.getSystemSetting()
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    window.addEventListener('resize', () => {
      this.refreshParticles = false
      this.$nextTick(() => (this.refreshParticles = true))
    })
  },
  destroyed() {
    clearInterval(this.timer)
    window.removeEventListener('resize', () => {})
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getList() {
      this.loading = false
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    getSystemSetting() {
      this.$store.dispatch('system/settingDetail').then((ret) => {
        this.sysInfo = ret
        document.title = ret.sys_app_name
      })
    },
    getCurrentTime() {
      this.timer = setInterval((_) => {
        this.currentTime = moment().format('YYYY-MM-DD HH时mm分ss秒')
      }, 1000)
    },
    getCode() {
      getCodeImg().then((res) => {
        if (res !== undefined) {
          this.codeUrl = res.data
          this.loginForm.uuid = res.id
        }
      })
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router
                .push({ path: this.redirect || '/', query: this.otherQuery })
                .catch(() => {})
            })
            .catch(() => {
              this.loading = false
              this.getCode()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.open = false
      this.reset()
    },
    reset() {
      this.form = {
        userId: undefined,
        deptId: 14,
        username: undefined,
        nickName: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        status: '2',
        remark: undefined,
        postIds: undefined,
        roleIds: 2
      }
      this.resetForm('form')
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.userId !== undefined) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    // getTreeselect() {
    //   treeselect().then(response => {
    //     this.deptOptions = response.data
    //   })
    // },
    handleRegister() {
      this.reset()
      // this.getTreeselect()
      listPost({ pageSize: 1000 }).then(response => {
        this.postOptions = response.data.list
      })
      listRole({ pageSize: 1000 }).then(response => {
        this.roleOptions = response.data.list
      })
      this.open = true
      this.title = '注册用户'
      this.form.password = this.initPassword
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

#bottom_layer {
  visibility: hidden;
  width: 3000px;
  position: fixed;
  z-index: 302;
  bottom: 0;
  left: 0;
  height: 39px;
  padding-top: 1px;
  zoom: 1;
  margin: 0;
  line-height: 39px;
  // background: #0e6cff;
}
#bottom_layer .lh {
  display: inline-block;
  margin-right: 14px;
}
#bottom_layer .lh .emphasize {
  text-decoration: underline;
  font-weight: 700;
}
#bottom_layer .lh:last-child {
  margin-left: -2px;
  margin-right: 0;
}
#bottom_layer .lh.activity {
  font-weight: 700;
  text-decoration: underline;
}
#bottom_layer a {
  font-size: 12px;
  text-decoration: none;
}
#bottom_layer .text-color {
  color: #bbb;
}
#bottom_layer .aria-img {
  width: 49px;
  height: 20px;
  margin-bottom: -5px;
}
#bottom_layer a:hover {
  color: #fff;
}
#bottom_layer .s-bottom-layer-content {
  margin: 0 17px;
  text-align: center;
}
#bottom_layer .s-bottom-layer-content .auto-transform-line {
  display: inline;
}
#bottom_layer .s-bottom-layer-content .auto-transform-line:first-child {
  margin-right: 14px;
}
.s-bottom-space {
  position: static;
  width: 100%;
  height: 40px;
  margin: 23px auto 12px;
}
#bottom_layer .open-content-info a:hover {
  color: #fff;
}
#bottom_layer .open-content-info .text-color {
  color: #626675;
}
.open-content-info {
  position: relative;
  display: inline-block;
  width: 20px;
}
.open-content-info > span {
  cursor: pointer;
  font-size: 14px;
}
.open-content-info > span:hover {
  color: #fff;
}
.open-content-info .tip-hover-panel {
  position: absolute;
  display: none;
  padding-bottom: 18px;
}
.open-content-info .tip-hover-panel .rest_info_tip {
  max-width: 560px;
  padding: 8px 12px 8px 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  text-align: left;
}
.open-content-info .tip-hover-panel .rest_info_tip .tip-wrapper {
  white-space: nowrap;
  line-height: 20px;
}
.open-content-info .tip-hover-panel .rest_info_tip .tip-wrapper .tip-item {
  height: 20px;
  line-height: 20px;
}
.open-content-info
  .tip-hover-panel
  .rest_info_tip
  .tip-wrapper
  .tip-item:last-child {
  margin-right: 0;
}
@media screen and (max-width: 515px) {
  .open-content-info {
    width: 16px;
  }
  .open-content-info .tip-hover-panel {
    right: -16px !important;
  }
}
.footer {
  background-color: #0e6cff;
  margin-bottom: -20px;
}

.login-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url("../../assets/login.png") no-repeat;
  background-color: #0e6cff;
  position: relative;
  background-size: cover;
  height: 100vh;
  background-position: 50%;
}

#particles-js {
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
}

.login-weaper {
  margin: 0 auto;
  width: 1000px;
  -webkit-box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.login-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: rgba(64, 158, 255, 0);
  color: #fff;
  float: left;
  width: 50%;
  position: relative;
  min-height: 500px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  .login-time {
    position: absolute;
    left: 25px;
    top: 25px;
    width: 100%;
    color: #fff;
    opacity: 0.9;
    font-size: 18px;
    overflow: hidden;
    font-weight: 500;
  }
}

.login-left .img {
  width: 90px;
  height: 90px;
  border-radius: 3px;
}

.login-left .title {
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
  font-size: 16px;
  font-weight: 600;
}

.login-border {
  position: relative;
  min-height: 500px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border-left: none;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: #fff;
  background-color: hsla(0, 0%, 100%, 0.9);
  width: 50%;
  float: left;
}

.login-main {
  margin: 0 auto;
  width: 65%;
}

.login-title {
  color: #333;
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 22px;
  text-align: center;
  letter-spacing: 4px;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  ::v-deep .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      caret-color: #333;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    color: #454545;
  }
}
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
    .login-weaper {
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      box-shadow: none;
    }
    .login-main {
      width: 80%;
    }
    .login-left {
      display: none !important;
    }
    .login-border {
      width: 100%;
    }
  }
}
</style>
