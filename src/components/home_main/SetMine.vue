<template>
    <el-container>
        <MainSolt>
            <span slot="title">个人设置</span>
        </MainSolt>
        <el-form label-width="80px" ref="setmineFormRef" :model="mineForm" :rules="rules">
            <el-form-item label="学号">
                <el-input v-model="mineForm.number" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input  v-model="mineForm.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-select v-model="mineForm.sex" placeholder="请选择性别" style="width:100%">
                    <!-- 这里的默认选中 value 要处于绑定状态 -->
                    <el-option label="男" :value="1"></el-option>
                    <el-option label="女" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankid">
                <el-input v-model="mineForm.bankid" clearable></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="mineForm.email" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="changeMessage">修改信息</el-button>
                <el-button type="info" @click="changepass">修改密码</el-button>
            </el-form-item>
        </el-form>

        <el-dialog :visible.sync="dialogFormVisible" width="55%">
            <el-form class="passform" label-width="100px" :model="passForm" ref="passFormRef" :rules="passRules">
                <el-form-item label="原密码" prop="originPass">
                    <el-input v-model="passForm.originPass" clearable></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input type="password" v-model="passForm.newPass" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="newAgainPass">
                    <el-input type="password" v-model="passForm.newAgainPass" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="changePass">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import MainSolt from './main_solt/MainSolt'
import {request} from '../../network/request'
export default {
    name: 'SetMine',
    created() {
       this.getUserMessage()
    },
    data() {
        return {
            dialogFormVisible: false,
            //显示用户信息
            mineForm: {
                number: '',
                name: '',
                sex: 1,
                bankid: '',
                email: '',
            },
            //密码信息
            passForm: {
                originPass: '',
                newPass: '',
                newAgainPass: '',
            },
            //记录的密码信息
            password: '',
            //验证对象
            rules: {
            //校验用户名
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur'},//必填值校验
                   
                ],
                bankid: [
                    { required: true, message: '请输入银行账户', trigger: 'blur'},//必填值校验
                ],
                email: [
                {
                    required: true,
                    message: "请输入邮箱",
                    trigger: "blur"
                },
                {
                    validator: function(rule, value, callback) {
                        if (/^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(value) == false) {
                            callback(new Error("邮箱格式错误"));
                        } else {
                            callback();
                        }
                    },
                    trigger: "blur"
                }
                ],
            },
            passRules: {
            //密码校验
                originPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur'},//必填值校验
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur'},//必填值校验
                ],
                newAgainPass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur'},//必填值校验
                ],
            },
        }
    },
    methods: {
        //信息的初始化
        getUserMessage() {
            request({
                url: '/getUserById',
                params: {
                    id: JSON.parse(window.sessionStorage.getItem("user")).user_id
                }
            }).then(res => {
                this.mineForm.number = res.data.number
                this.mineForm.name = res.data.name
                this.mineForm.sex = res.data.sex
                this.mineForm.bankid = res.data.bankid
                this.mineForm.email = res.data.email
            })
        },
        changepass() {
            this.dialogFormVisible = true
        },
        //修改信息
        changeMessage() {
            this.$refs.setmineFormRef.validate(valid => {
                if(valid == true) {
                    //执行修改操作
                    request({
                        url: '/updateUserById',
                        data: {
                            id: JSON.parse(window.sessionStorage.getItem("user")).user_id,
                            name: this.mineForm.name,
                            sex: this.mineForm.sex ,
                            bankid: this.mineForm.bankid,
                            email: this.mineForm.email,
                        },
                        method: 'put',
                    }).then(res => {
                        if(res.data == 'SUCCESS') this.$message.success('修改成功！')
                        else this.$message.error('修改失败！');
                    })
                }
            })
        },
        //修改密码
        changePass() {
            this.$refs.passFormRef.validate(valid => {
                if(valid) {
                    if(this.passForm.newPass != this.passForm.newAgainPass) this.$message.error('新密码两次输入不同')
                    else {
                        request({
                            url: '/selectPasswordById',
                            params: {
                                id: JSON.parse(window.sessionStorage.getItem("user")).user_id,
                            },
                            method: 'get'
                        }).then(res => {
                            if(this.passForm.originPass == res.data) {
                                //修改密码
                                request({
                                    url: '/updateUserPasswordById',
                                    data: {
                                        id: JSON.parse(window.sessionStorage.getItem("user")).user_id,
                                        password: this.passForm.newPass,
                                    },
                                method: 'put',
                                }).then(res => {
                                    if(res.data > 0) {
                                        this.$message.success('密码修改成功！')
                                        this.dialogFormVisible = false
                                    } else {
                                        this.$message.error('密码修改失败！')
                                    }
                                })
                                
                            }else {
                                this.$message.error('原密码输入错误！')
                            }
                        })
                    }
                } else {
                    
                }
            })
        },
        
    },
    components: {
        MainSolt,
    }
}
</script>
<style scoped>
.el-form {
    position: absolute;
    left: 50%;
    top: 45%;
    width: 30%;
    transform: translate(-50%, -50%);  
}
.passform {
    position: absolute;
    left: 50%;
    top: 45%;
    width: 50%;
    transform: translate(-50%, -50%);  
}
</style>