<template>
    <el-container>
        <MainSolt width="70px">
            <span slot="title">添加</span>
        </MainSolt>
            <el-aside width="350px">
                <!-- 这里有一个bug 没有图片时怎么知道不存在 -->
                <el-upload
                    action="no"
                    list-type="picture-card"
                    ref="upload"
                    :http-request="upload"
                    :multiple="true"
                    :data="uploaddata"
                    :limit='1'
                    :on-change="ischanged"
                    :on-remove="isremove"
                    accept="image/png,image/jpg,image/jpeg"
                    :before-upload="handleBeforeUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :auto-upload="false">
                    <i class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">上传一张png,jpg,jpeg电子发票图片，大小不超过2M</div>
                </el-upload>

                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-aside>

            <el-main>
                <el-form ref="addFromRef" :model="form" :rules="addRules" label-width="80px">
                    <el-form-item prop="name" label="物品名称">
                        <el-input v-model="form.name" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="kind" label="物品类别">
                        <el-input v-model="form.kind" clearable></el-input>
                    </el-form-item>

                    <el-form-item prop="money" label="花费金额">
                        <el-input 
                        oninput="value=value.replace(/[^\d^\.]/g,'')"
                        v-model="form.money" 
                        clearable></el-input>
                    </el-form-item>

                    <!-- value-format="yyyy-MM-dd" -->
                    <el-form-item prop="time" label="购买时间">
                        <el-col :span="11">
                        <el-date-picker 
                        type="date"
                        placeholder="选择日期" 
                        value-format="yyyy-MM-dd"
                        v-model="form.time" 
                        style="width: 219%;"></el-date-picker>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="uploadphoto()">确定添加</el-button>
                        <el-button @click="backoutbill">返回</el-button>
                    </el-form-item>
            </el-form>
        </el-main>

    </el-container>
</template>
<script>

import MainSolt from '../home_main/main_solt/MainSolt'

export default {
    name: "Add",
    data() {
        return {
          form: {
            name: '',
            kind: '',
            money: '',
            time: '',
          },
           //验证对象
          addRules: {
            //校验物品名称
            name: [
                { required: true, message: '请输入物品名称', trigger: 'blur'},//必填值校验
            ],
            //校验物品类别
            kind: [
                { required: true, message: '请输入物品类别', trigger: 'blur'},//必填值校验
            ],
            //校验花费金额
            money: [
                { required: true, message: '请输入花费金额', trigger: 'blur'},//必填值校验
            ],
            time: [
                { required: true, message: '请输入购买时间', trigger: 'blur'},//必填值校验
            ],
          },
          uploaddata: null,
          //图片上传参数
          dialogImageUrl: '',
          dialogVisible: false,
          //图片是否发生变化的参数
          changeres: false
        }
    },
    methods: {
        backoutbill() {
            this.$router.push({ path: '/home/outbill'})
        },
        // 上传文件之前的钩子 (点击提交上传之前要执行的一个函数)
        handleBeforeUpload(file) {
            if(!(file.type === 'image/png' || file.type === 'image/jpg' 
            || file.type === 'image/jpeg')) {
                this.$notify.warning({
                title: '警告',
                message: '请上传格式为image/png, image/jpg, image/jpeg的图片'
                })
            }
            let size = file.size / 1024 / 1024 / 2
            if(size > 2) {
                this.$notify.warning({
                title: '警告',
                message: '图片大小必须小于2M'
                })
            }
        },
        //使用 http-request 覆盖默认的action请求
        async upload(params) {
            //注意这里的 form-data 就当作一个表单使用
            const user = JSON.parse(window.sessionStorage.getItem("user"))

            let fd = new FormData()
            fd.append('file', params.file)
            fd.append('uid', user.user_id)
            fd.append('user_name', user.user_name)
            fd.append('user_bankid', user.user_bankid)
            fd.append('user_number', user.user_number)

            fd.append('name', this.form.name)
            fd.append('kind', this.form.kind)
            fd.append('money',this.form.money)
            fd.append('time', this.form.time)
            const {data: res} = await this.$http.post(
                '/upLoadPhoto',
                 fd,
                { "Content-Type": "multipart/form-data" }
            )
        },
        // 点击文件列表中已上传的文件时的钩子(像一个点击事件)
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }, 
        //判断图片是否发生改变
        ischanged(file, fileList) {
            //说明图片发生了改变
            if(fileList.length > 0)  this.changeres = true
        },
        //判断图片是否被移除
        isremove(file, fileList) {
            if(fileList.length == 0) this.changeres = false
        },
        // 文件上传成功时的钩子
        handleSuccess(res, file, fileList) {
            this.$notify.success({
                title: '成功',
                message: `文件上传成功`
            });
            //图片上传成功之后进行跳转
            this.$router.push({ path: '/home/outbill'})
        },
        // 文件上传失败时的钩子
        handleError(err, file, fileList) {
            this.$notify.error({
                title: '错误',
                message: `文件上传失败`
            });
            console.log(err)
        },
        // 上传图片
        uploadphoto() {
            //判断表单框之中是否有数据
            this.$refs.addFromRef.validate(valid => {
                if(!valid) {
                    return
                }
                else if(this.changeres == false) {
                    this.$message.error('请添加上传图片！')
                } else {
                    //图片捆绑表单数据一起提交 (这里有 Bug 必须要这个提交之后上面的所有函数才会执行)
                    this.$refs.upload.submit()//上传图片
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
.el-aside {
    margin-top: 10%;
}
.el-form {
  margin-top: 10%;
  width: 60%;
}
.el-alert {
    height: 30px;
}
</style>