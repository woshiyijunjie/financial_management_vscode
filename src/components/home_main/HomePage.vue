<template>
<!-- 使用这个插巢 -->
<el-container>
  <MainSolt>
        <span slot="title">首页</span>
  </MainSolt>

  <el-header>
    
  </el-header>

  <el-main>
     
  </el-main> 
</el-container>
    
</template>
<script>

import MainSolt from './main_solt/MainSolt'
export default {
    name: "HomePage",
    created() {
        //这里要加上this
        this.user = this.$store.state.user
        console.log(this.user)
    },
    data() {
        return {
            user: {},
        }
    },
    components: {
        MainSolt,
    },
}
</script>
<style scoped>

</style>