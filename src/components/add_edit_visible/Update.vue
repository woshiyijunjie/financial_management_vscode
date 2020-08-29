<template>
    <el-container>
        <MainSolt width="70px">
            <span slot="title">修改</span>
        </MainSolt>
            <el-aside width="350px">
                <!-- 这里有一个bug 没有图片时怎么知道不存在 -->
                <el-upload
                    action="no"
                    :http-request="upload"
                    list-type="picture-card"
                    ref="upload"
                    :limit='1'
                    :data="uploaddata"
                    accept="image/png,image/jpg,image/jpeg"
                    :file-list="images"
                    :on-remove="handleRemove"
                    :on-change="ischanged"
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

                    <el-form-item prop="time" label="购买时间">
                        <el-col :span="11">
                        <el-date-picker 
                        type="date" 
                        placeholder="选择日期" 
                        v-model="form.time" 
                        value-format="yyyy-MM-dd"
                        style="width: 219%;"></el-date-picker>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="uploadphoto()">确定修改</el-button>
                        <el-button @click="backoutbill">返回</el-button>
                    </el-form-item>
            </el-form>
        </el-main>

    </el-container>
</template>
<script>

import MainSolt from '../home_main/main_solt/MainSolt'
import {request} from '../../network/request'

export default {
    name: "Update",
    //生命周期函数(初始化 data 中的数据)
    //这里不能用 created 因为这个生命周期函数只会执行一次
    created()  {
       console.log('路由传过来的数据')
       console.log(this.$route.query.data)
       this.form.name = this.$route.query.data.goodsName
       this.form.kind = this.$route.query.data.goodsKind
       this.form.money = this.$route.query.data.goodsMoney
       // 根据毫秒数构建 Date 对象
       var date = new Date(this.$route.query.data.goodsBuyTime);
       // 格式化日期
       var dateTime = date.toLocaleString();
       var t = dateTime.split('/')
       this.form.time = t[0] + '-' + t[1] + '-' + t[2]
       //给绑定的默认图片赋值
       let t1 = this.$route.query.data.goodsUpTime
       this.images[0].url = 'http://localhost:8888/images/'+ t1 +'.jpg'
    },
    data() {
        return {
            form: {
                name: '',
                kind: '',
                money: '',
                time: '',
            },
            //绑定默认图片
            images: [{
                url: '',
            }],
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
            uploaddata:null,
            //图片上传参数
            dialogImageUrl: '',
            dialogVisible: false,
            //判断图片是否更新过
            changeres: 'unchanged',
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
            let fd = new FormData()
            fd.append('file', params.file)
            fd.append('id', this.$route.query.data.id)
            fd.append('bid', this.$route.query.data.bid)
            fd.append('name',this.form.name)
            fd.append('kind',this.form.kind)
            fd.append('money',this.form.money)
            fd.append('time', this.form.time)
            const {data: res} = await this.$http.post(
                '/updateFiveGoodsById',
                 fd, 
                { "Content-Type": "multipart/form-data" }
            )
            //如果修改成功跳转到之前的页面
            if(res == 'SUCCESS') {
                this.$router.push({ path: '/home/outbill'})
                //刷新页面，使其能够看到图片 keep-alive 使用
                //window.location.reload();
            } 
        },
        // 点击文件列表中已上传的文件时的钩子(像一个点击事件)
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }, 
        // 文件上传成功时的钩子
        handleSuccess(res, file, fileList) {
            this.$notify.success({
                title: '成功',
                message: `文件上传成功`
            });
        },
        // 文件上传失败时的钩子
        handleError(err, file, fileList) {
            this.$notify.error({
                title: '错误',
                message: `文件上传失败`
            });
        },
        //判断图片是否发生改变
        ischanged(file, fileList) {
            //说明图片发生了改变
            if(fileList.length > 0) this.changeres = 'ischanged'
        },
         //文件移除时的钩子
        handleRemove(file, fileList) {
            if(fileList.length == 0) this.changeres = 'nophoto'
        },
        // 上传图片
        uploadphoto() {
            //判断表单框之中是否有数据
            this.$refs.addFromRef.validate(valid => {
                //拿到传过来的 id 号
               
                if(!valid) {
                    return
                //如果值不为空
                } else {
                    //如果图片没有发生修改
                    if(this.changeres == 'unchanged') {
                        //开始修改操作(这里换一种方式进行请求)
                        const id = this.$route.query.data.id;
                        request({
                            url: '/updateFourGoodsById',
                            data: {
                                id: id,
                                bid:this.$route.query.data.bid,
                                //需要修改的四个数据
                                name: this.form.name,
                                kind: this.form.kind,
                                money: this.form.money,
                                time: this.form.time,
                                upTime: this.$route.query.data.goodsUpTime,
                            },
                            method: 'post'
                        }).then(res => {
                            //只看后台返回的数据
                            if(res.data == 'SUCCESS') this.$message.success('修改成功！')
                            //修改成功后进行路由跳转
                            this.$router.push({ path: '/home/outbill'})
                        })
                        //如果没有图片
                        } else if(this.changeres == 'nophoto'){
                            this.$message.success("图片不能为空!")
                        } else {
                            this.$refs.upload.submit()
                        }
                   
                }
            })
        },
         //格式化时间的方法
        dateFormat(row, column, cellValue) {
        return cellValue ? fecha.format(new Date(cellValue), 'yyyy-MM-dd') : '';
        },
    },
    components: {
        MainSolt,
    },
    
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