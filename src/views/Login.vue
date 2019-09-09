<template>
  <div class="login-panel">
    <div class="login-content">
      <div class="login-logo">PLANCK</div>
      <div class="login-form">
        <mt-field label="账号:" v-model="submitForm.username"></mt-field>
        <mt-field label="密码:" v-model="submitForm.password" type="password"></mt-field>
        <mt-button type="primary" @click="postLogin">登录</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',

  data: () => ({
    submitForm: {
      username: '',
      password: ''
    }
  }),

  methods: {
    postLogin () {
      this.$axios.post(this.$api.Login.Index, {
        ...this.submitForm
      })
        .then(res => {
          if (res.data.errno === 0) {
            alert(res.data.msg)
            const { token, username } = res.data.data
            this.$store.commit('updateUserInfo', { token, username })
            this.$router.back()
          } else {
            alert(res.data.msg)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;

    .login-content {
      margin-top: -40vw;
      width: 70vw;

      .login-logo {
        color: #000000;
        font-size: 10vw;
        text-align: center;
      }

      .login-form {
        margin-top: 20vw;
        display: flex;
        flex-direction: column;

        /deep/ .mint-cell-title {
          width: 40px;
        }

        > button {
          margin-top: 10vw;
        }
      }
    }
  }
</style>
