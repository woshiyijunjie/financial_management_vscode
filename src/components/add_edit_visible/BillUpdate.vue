<template>
    <el-container>
        <MainSolt width="70px">
            <span slot="title">修改</span>
        </MainSolt>
            
         <el-main>
            <el-form ref="UpdateFromRef" :rules="rules" :model="form">
                <el-form-item prop="bankid" label="银行账号" label-width="80px">
                    <el-input v-model="form.bankid" placeholder="请输入银行账号" oninput="value=value.replace(/[^\d^\.]/g,'')" clearable></el-input>
                </el-form-item>
                <el-form-item prop="billtime" label="报账时间" label-width="80px">
                    <el-col :span="11">
                    <el-date-picker 
                    type="date" 
                    placeholder="选择日期" 
                    v-model="form.billtime" 
                    value-format="yyyy-MM-dd"
                    style="width: 219%;"></el-date-picker>
                    </el-col>
                    </el-form-item>
                <el-form-item prop="smoney" label="应到金额" label-width="80px">
                    <el-input v-model="form.smoney" placeholder="请输入应到金额" oninput="value=value.replace(/[^\d^\.]/g,'')" clearable></el-input>
                </el-form-item>
                <el-form-item prop="rmoney" label="实到金额" label-width="80px">
                    <el-input v-model="form.rmoney" placeholder="请输入实到金额" oninput="value=value.replace(/[^\d^\.]/g,'')" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="changebill">确定修改</el-button>
                    <el-button @click="back">返回</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>

import MainSolt from '../home_main/main_solt/MainSolt'
//格式化时间工具
import * as fecha from 'element-ui/lib/utils/date';
import {request} from '../../network/request'

export default {
    name: "BillUpdate",
    //生命周期函数(初始化 data 中的数据)
    //这里不能用 created 因为这个生命周期函数只会执行一次
    created()  {
       //对值进行初始化
       const res = this.$route.query.data
       this.form.bankid = res.billBankid
       var date = new Date(res.billTime);
       var dateTime = date.toLocaleString();
       var t = dateTime.split('/')
       this.form.billtime = t[0] + '-' + t[1] + '-' + t[2]
       this.form.smoney = res.billSmoney
       this.form.rmoney = res.billRmoney
    },
    data() {
        return {
            form: {
                bankid: '',
                billtime: '',
                smoney: '',
                rmoney: '',
            },
            //验证对象
            rules: {
                bankid: [
                    { required: true, message: '请输入银行账户', trigger: 'blur'},//必填值校验
                ],
                billtime: [
                    { required: true, message: '请输入报账时间', trigger: 'blur'},//必填值校验
                ],
                smoney: [
                    { required: true, message: '请输入应到金额', trigger: 'blur'},//必填值校验
                ],
                rmoney: [
                    { required: true, message: '请输入实到金额', trigger: 'blur'},//必填值校验
                ],
            },
        }
    },
    methods: {
        back() {
             this.$router.push({ path: '/home/getbill'})
        },
        changebill() {
            //判断表单框之中是否有数据
            this.$refs.UpdateFromRef.validate(valid => {
                if(!valid) {
                    return
                } else {
                    request({
                        url: '/updateFourBillById',
                        data: {
                            id: this.$route.query.data.id,
                            billBankid: this.form.bankid,
                            billTime: this.form.billtime,
                            billSmoney: this.form.smoney,
                            billRmoney: this.form.rmoney,
                        },
                        method: 'put',
                    }).then(res => {
                        if(res.data == 'SUCCESS') {
                            //返回界面
                            this.$router.push({ path: '/home/getbill'})
                            this.$message.success("修改成功!")
                        } else {
                            this.$message.error();("修改失败!")
                        }
                    })
                }
            })
        },
    },
    components: {
        MainSolt,
    },
    
}
</script>
<style scoped>
.el-form {
  margin-top: 6%;
  margin-left: 15%;
  width: 60%;
}
</style>