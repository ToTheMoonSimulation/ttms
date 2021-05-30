<template>
  <el-container style="height: 100%">
    <el-aside width="300px">
      <div class="logo"  @click="$router.push({ name: 'Home' })">
        <el-image
          style="width: 50px; height: 50px; margin-top: 10px"
          :src="require('@/assets/AIMC_LOGO.png')"
          fit="fill"
        ></el-image>
        <div class="companyName" >
          <h5>AI Music Cookie</h5>
        </div>
      </div>
      <el-menu>
        <el-menu-item index="1" @click="$router.push({ name: 'dashboard' })">
          <span>대시보드</span>
        </el-menu-item>
        <el-menu-item index="2" @click="$router.push({ name: 'play' })">
          <span>플레이</span>
        </el-menu-item>
        <el-menu-item index="3" @click="$router.push({ name: 'community' })">
          <span>커뮤니티</span>
        </el-menu-item>
        <el-menu-item index="4" @click="$router.push({ name: 'contact' })">
          <span>문의하기</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
html,
body {
  height: 100%;
}
.el-aside {
  height: 100%;
  text-align: center;
  overflow: hidden;
}
.el-menu {
  height: 100%;
}
.el-menu-item {
  color: #409eff;
}
.el-main{
  position: relative;
  padding:0;
  overflow: hidden;
}
</style>