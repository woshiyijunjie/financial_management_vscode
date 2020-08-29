<template>
  <el-row class="tac">
    <el-col :span="12" class="el_clo">
      <!-- 即使刷新 default-active 也会保存你当前 路径(用于存在下拉菜单)-->
      <el-menu class="el-menu-vertical-demo" :router="true">
        <!-- index 里面放的是字符串的类型 加了:router="true" 之后 后面默认会跟上 :index="item.path" 中的路径 -->
        <el-menu-item v-for="item in menulist" :key="item.id" :index="item.path">
          <i :class="icon[item.id-1]"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "Navmenu",
    data() {
      return {
        //这里可以存到数据库中
        icon: [
          "el-icon-menu",
          "el-icon-suitcase",
          "el-icon-suitcase-1",
          "el-icon-user",
          "el-icon-setting",
          "el-icon-menu",
          "el-icon-suitcase",
          "el-icon-suitcase-1",
          "el-icon-setting",
        ]
      }
    },
    methods: {
      
    },
    props: {
      //从 Home 页面传过来的 Json
      menulist:{
        type: Array,
      }
    }
  }
</script>

<style scoped>
/* 如果出现子菜单栏有突出的部分可以使用 border-right: none; */
.el_clo {
  width: 100%;
}
</style>
