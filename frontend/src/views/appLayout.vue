<template>
  <v-app>
    <v-navigation-drawer
    dark
    app
      src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    >
      <v-list>
        <h1 style="text-align:center; padding:100px 0px; " @click="$router.push({ name: 'Home' }).catch(()=>{});">투 더 문</h1>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon >mdi-view-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title @click="$router.push({ name: 'dashboard' }).catch(()=>{});">대시보드</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon >mdi-play</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title @click="$router.push({ name: 'play' }).catch(()=>{});">플레이</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data: () => ({
  })
};
</script>

<style scoped></style>
