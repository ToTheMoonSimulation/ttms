<template>
  <el-container>
    <el-header style="height: 100px">
      <div
        class="logo"
        style="display: flex"
        @click="$router.push({ name: 'Home' })"
      >
        <el-image
          style="width: 50px; height: 50px"
          :src="require('@/assets/AIMC_LOGO.png')"
          fit="fill"
        ></el-image>
        <div class="companyName">
          <h5>AI Music Cookie</h5>
        </div>
      </div>
      <el-menu mode="horizontal">
        <el-menu-item index="1">
          <a href="./#productIntro" style="text-decoration: none">제품 소개</a>
        </el-menu-item>
        <el-menu-item index="2">
          <a href="./#playList" style="text-decoration: none">플레이 리스트</a>
        </el-menu-item>
        <el-menu-item index="3" @click="$router.push({ name: 'community' })">
          <span>커뮤니티</span>
        </el-menu-item>
        <el-menu-item index="4" @click="$router.push({ name: 'contact' })">
          <span>문의하기</span>
        </el-menu-item>
      </el-menu>
      <div class="nickname" @click="$router.push({ name: 'admin' })">
        <i class="el-icon-user"></i>
        <span>닉네임A</span>
      </div>
    </el-header>
    <el-main>
      <div id="productIntro" class="productIntro">
        <p>제품 소개</p>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <el-button type="primary" round @click="$router.push({ name: 'play' })">무료 플레이</el-button>
      </div>
      <div id="playList" class="playList">플레이 리스트</div>
      <div id="teamInfo" class="teamInfo">팀원 소개</div>
    </el-main>
    <el-footer style="height: 100%">
      <div id="opensourceList" class="opensourceList">오픈소스 리스트</div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "Home",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
  padding: 20px 0px 0px 50px;
  display: flex;
  align-items: center;
  text-align: center;
}

.companyName {
  display: flex;
  margin-left: 10px;
}

a {
  display: block;
}

.nickname {
  margin-left: auto;
  margin-right: 50px;
}

.el-menu {
  margin-left: 20px;
}

.el-main {
  height: 100%;
  background-color: gray;
  text-align: center;
}

.productIntro {
  height: 580px;
  background-color: azure;
  text-align: center;
}

.playList {
  height: 400px;
  background-color: blanchedalmond;
  text-align: center;
}

.teamInfo {
  height: 200px;
  background-color: beige;
  text-align: center;
}

.el-footer {
  background-color: yellowgreen;
  text-align: center;
}

.opensourceList {
  height: 200px;
  background-color: beige;
  text-align: center;
}
</style>