<template>
  <div class="l-header">
    <div class="bg" :style="{backgroundImage: (`url(${background})`)}">
      <div class="bg-content">
        <div class="bg-l">
          <img class="logo" :src="require('@/assets/image/logo.png')" alt="" @click="_onBack">
          <div class="local-name">{{localName}}</div>
        </div>

        <div class="j-spacer"></div>

        <div class="bg-r">
          <div class="login-username">你好, {{$store.state.userInfo.username}}</div>
          <div class="now-date">{{nowDate}}</div>
        </div>
      </div>
    </div>
    <div id="l-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',

  props: {
    localName: {
      type: String,
      default: '投料站'
    },
    background: {
      type: String,
      required: true
    },

    onBack: {
      type: Function,
      default: null
    }
  },

  data: () => ({
    nowDate: new Date().format('yyyy年MM月dd日')
  }),

  methods: {
    _onBack () {
      if (this.onBack !== null) {
        this.onBack()
      } else if (this.$route.name !== 'DeviceGroupInfo') {
        this.$router.back()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .l-header {
    z-index: 2;
    position: sticky;
    top: -26.266vw;
    height: 35.333vw;
    width: 100vw;
    
    .bg {
      width: 100vw;
      height: 35.333vw;
      background-size: 100%;

      .bg-content {
        display: flex;
        padding-top: 4vw;

        .bg-l {
          .logo {
            width: 25vw;
          }

          .local-name {
            margin-top: 1vw;
            margin-left: 5vw;
            font-size: 4vw;
            font-weight: bold;
            letter-spacing: 1vw;
            color: #ffffff;
          }
        }

        .bg-r {
          display: flex;
          flex-direction: column;
          padding-right: 5vw;

          @mixin info-font {
            color: #ffffff;
            text-align: right;
            font-weight: bold;
          }

          .login-username {
            @include info-font;
            font-size: 4.5vw;
          }

          .now-date {
            @include info-font;
            margin-top: 2vw;
            font-size: 3.5vw;
          }
        }
      }
    }

    #l-content {
      margin: -9.07vw 5vw 0;
      width: 90vw;
      border-radius: 20px;
      background-color: #ffffff;
      border-bottom: .5px solid #ececec;
      box-shadow: 1px 1px #ececec;
    }
  }
</style>
