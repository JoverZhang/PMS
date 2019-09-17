<template>
  <div>
    <Header :background="require('@/assets/image/6.png')" :on-back="() => $emit('onBack')">
      <template v-slot:content>
        <div class="common-content">
          <!--<div @click="() => $emit('onBack','shot')">返回上一级</div>-->
          <!--<mt-cell title="设备组:">{{ deviceGroup }}</mt-cell>-->
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
import { paddingMixin } from '@/assets/js/mixins'

export default {
  name: 'Snapshot',
  mixins: [ paddingMixin ],
  props: {
    step: {
      default: ''
    },
    button: String
  },
  data: () => ({
    deviceGroup: '',
    deviceCode: '',
    batch: '',

    submitForm: []
  }),

  created () {
    const batch = this.$store.state.batch
    if (!batch) {
      this.$router.push({ name: 'DeviceGroupInfo' })
      return
    }
    console.log(this.step, this.button)

    this.batch = batch
    this.deviceGroup = this.$store.state.deviceGroup
    this.deviceCode = this.$store.state.deviceCode
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.getDeviceAttrDict()
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
            // const attrList = window.localStorage.getItem('attrList')
            // console.log(JSON.parse(attrList))
            this.submitForm = Object.keys(deviceAttrDict).map(attrName => ({
              attrName,
              value: '',
              unit: deviceAttrDict[attrName]
            }))
            console.log(this.submitForm)
          }
        })
    },

    postDeviceAttr () {
      window.localStorage.setItem('attrList', JSON.stringify(this.submitForm))
      this.$axios.post(this.$api.Page6.Index, {
        token: this.$store.state.userInfo.token,
        deviceCode: this.deviceCode,
        batch: this.batch,
        step: this.step.toString(),
        button: this.button,
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
    // min-height: calc(100vh - 35.333vw - (45vw - 9.07vw));
  }
</style>
