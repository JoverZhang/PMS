<template>
  <div>
    <Header :background="require('@/assets/image/6.png')" :on-back="() => $emit('onBack')">
      <template v-slot:content>
        <div class="common-content">
          <mt-cell title="设备组:">{{ deviceGroup }}</mt-cell>
          <mt-cell title="设备单元:">{{ deviceCode }}</mt-cell>
          <mt-cell title="生产批次:">{{ batch }}</mt-cell>
        </div>
      </template>
    </Header>
    <div class="scroll-content" :style="{paddingTop:scrollPadding}">
      <div class="scroll-tag">
        <mt-field
          v-for="item in submitForm"
          :key="item.attrName"
          :label="`${item.attrName} :`"
          v-model="item.value"
        >{{item.unit}}
        </mt-field>
        <mt-button @click="postDeviceAttr" type="primary" size="large">提交</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'Snapshot',

  data: () => ({
    deviceGroup: '',
    deviceCode: '',
    batch: '',

    submitForm: [],
    scrollPadding: ''
  }),

  created () {
    const batch = this.$store.state.batch
    if (!batch) {
      this.$router.push({ name: 'DeviceGroupInfo' })
      return
    }

    this.batch = batch
    this.deviceGroup = this.$store.state.deviceGroup
    this.deviceCode = this.$store.state.deviceCode
  },

  mounted () {
    this.init()
    this.handleSettingPadding()
    window.onresize = () => {
      this.handleSettingPadding()
    }
  },

  methods: {
    init () {
      this.getDeviceAttrDict()
    },

    handleSettingPadding () {
      this.$nextTick(()=>{
        const common = document.querySelector("div[class='common-content']")
        this.scrollPadding = 'calc('+ common.offsetHeight.toString() + 'px - 9.07vw)'
      })
    },

    getDeviceAttrDict () {
      this.$axios.get(this.$api.Page6.Index, {
        params: {
          token: this.$store.state.userInfo.token,
          batch: this.batch,
          deviceGroup: this.deviceGroup,
          deviceCode: this.deviceCode
        }
      })
        .then(res => {
          if (res.data.errno === 0) {
            const deviceAttrDict = res.data.data.deviceAttrDict
            this.submitForm = Object.keys(deviceAttrDict).map(attrName => ({
              attrName,
              value: '',
              unit: deviceAttrDict[attrName]
            }))
          }
        })
    },

    postDeviceAttr () {
      this.$axios.post(this.$api.Page6.Index, {
        token: this.$store.state.userInfo.token,
        deviceCode: this.deviceCode,
        batch: this.batch,
        deviceAttrList: JSON.stringify(this.submitForm)
      })
        .then(res => {
          if (res.data.errno === 0) {
            alert(res.data.msg)
            this.$router.back()
          } else {
            alert(res.data.msg)
          }
        })
    }
  },

  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>
  .common-content {
    // height: 35vw;
    padding: 5vw;

    > .mint-field {
      border-bottom: .5px solid #ececec;
    }
  }

  .scroll-content {
    padding: calc(45vw - 9.07vw) 5vw 0;
    min-height: calc(100vh - 35.333vw - (45vw - 9.07vw));
  }
</style>
