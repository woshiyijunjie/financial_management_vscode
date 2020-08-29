<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        账务管理系统
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFromRef" :model="loginForm" :rules="loginRules" class="login_form" label-width="0px">
        <!-- 用户名 -->
        <el-form-item prop="number">
          <el-input v-model="loginForm.number" placeholder="请输入学号" prefix-icon="el-icon-user" clearable></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock" clearable></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
        <el-button class="btn" @click="login" type="primary" plain>登陆</el-button>
        </el-form-item>
      </el-form>
   
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    created() {
       //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload",()=>{
        
      })
    },
    data() {
      return {
        //表单数据
        loginForm: {
          number: '',
          password: '',
        },
        //验证对象
        loginRules: {
          //校验用户名
          number: [
            { required: true, message: '请输入用户学号', trigger: 'blur'},//必填值校验
            { min: 1, max: 10, message: '长度在1 个字符到 10个字符之间', trigger: 'blur'},//长度校验
          ],
          //校验密码
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur'},//必填值校验
            { min: 1, max: 10, message: '长度在1 个字符到 10个字符之间', trigger: 'blur'},//长度校验
          ]
        },
        
      }
    },
    methods: {
      login() {
        //这里重置清空的方法
        //this.$refs.loginFromRef.resetFields()
        //拿到是否符合验证的数据，符合验证返回 true, 不符合验证返回 false
        this.$refs.loginFromRef.validate(async valid => {
          if(!valid) return;
          //这里可以规定 get 和 post 请求 (注意这里只有post 请求才能够将 对象数据传过去)
          const {data: res} = await this.$http.post('/LoginGetUserByNumber', this.loginForm)
          
          if(res.code == 200) {
            this.$message.success(res.msg)
            //在浏览器中存储用户的信息
            console.log('请求到的对象数据')
            console.log(res.data) 
            //将数据传入 vuex
            this.$store.commit("updateUserData", res.data)
            //JSON.stringify(res.data) 将数据转化为 Json 数据
            window.sessionStorage.setItem("user", JSON.stringify(res.data))
            //进行跳转
            this.$router.push({
              path: '/home',
              // query: {
              //   user:res.data,
              // }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
  }
</script>

<style scoped>
.login_container {
  height: 100%;
}
.login_box {
  width: 400px;
  height: 240px;
  background-color: #E7EAED;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);  
}
.avatar_box {
  width: 100px;
  height: 50px;
  color: red;
  /* border: 1px solid #eee; */
  /* border-radius: 50%; */
  position: absolute;
  left: 50%;
  transform: translate(-50%);  
}
.login_form {
  position: absolute;
  bottom: 0%;
  width: 100%;
  /* border: solid black; */
  padding: 0px;
}
.btn {
  width: 50%;
  margin-top: 20px;
  margin-left: 50%;
  transform: translate(-50%, -50%);
}
</style>