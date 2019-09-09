<template>
  <div>
    <Header :background="require('@/assets/image/2.png')">
      <template v-slot:content>
        <div class="common-content">
          <mt-cell title="设备组:">{{ deviceGroup }}</mt-cell>
          <mt-field placeholder="设备单元关键字" v-model="deviceCode">
            <i class="iconfont icon-search"></i>
          </mt-field>
        </div>
      </template>
    </Header>
    <div class="scroll-content">
      <div
        class="scroll-tag"
        v-for="item in deviceList"
        :key="item.deviceCode"
        @click="goRouter(item)"
      >
        <mt-cell title="设备单元编号:">{{ item.deviceCode }}</mt-cell>
        <mt-cell title="设备单元名称:">{{ item.deviceName }}</mt-cell>
        <mt-cell title="最大产量:">{{ item.quantityUpLimit }} kg</mt-cell>
        <mt-cell title="最小产量:">{{ item.quantityLowLimit }} kg</mt-cell>
        <mt-cell title="当前状态:">{{ item.state }}</mt-cell>
        <mt-cell title="当前生产批次:">{{ item.onBatch }}</mt-cell>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'DeviceInfo',

  data: () => ({
    deviceGroup: '',
    deviceCode: '',
    deviceList: []
  }),

  watch: {
    deviceCode (deviceCode) {
      this.getDeviceList({ deviceCode })
    }
  },

  created () {
    const deviceGroup = this.$store.state.deviceGroup
    if (!deviceGroup) {
      this.$router.push({ name: 'DeviceGroupInfo' })
      return
    }

    this.deviceGroup = deviceGroup
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.getDeviceList()
    },

    getDeviceList ({ deviceCode } = {}) {
      this.$axios.get(this.$api.Page2.Index, {
        params: {
          token: this.$store.state.userInfo.token,
          deviceGroup: this.deviceGroup,
          deviceCode
        }
      })
        .then(res => {
          if (res.data.errno === 0) {
            this.deviceList = res.data.data.deviceList
          }
        })
    },

    goRouter (itemInfo) {
      this.$store.commit('setDeviceCode', itemInfo.deviceCode)
      this.$router.push({ name: 'BatchInfo' })
    }
  },

  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>
  .common-content {
    height: 30vw;
    padding: 5vw;

    > .mint-field {
      border-bottom: .5px solid #ececec;
    }
  }

  .scroll-content {
    padding: calc(40vw - 9.07vw) 5vw 0;
    min-height: calc(100vh - 35.333vw - (40vw - 9.07vw));
  }
</style>
