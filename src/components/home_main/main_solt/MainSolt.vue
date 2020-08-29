<template>
    <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/home'}">
            <div>
            ><slot name="title"></slot>
            </div>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    name: 'MainSolt',
}
</script>
<style scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
}

</style>