<template>
  <router-view />
  <!--  <div class="home">-->
  <!--    <Header :background="require('@/assets/image/1.png')">-->
  <!--      <template slot="content">123</template>-->
  <!--    </Header>-->
  <!--    <div v-for="i in 100" style="height: 50px;width: 100vw; background-color: blue" :key="i">{{i}}</div>-->
  <!--  </div>-->
</template>

<script>
export default {
  name: 'home',

  mounted () {
    if (!this.$store.state.userInfo.token) {
      this.$router.push({ name: 'Login' })
    } else {
      this.$router.push({ name: 'DeviceGroupInfo' })
      // this.$router.push({ name: 'TechnologyInfo' })
    }
  }
}
</script>

<style lang="scss">
</style>
