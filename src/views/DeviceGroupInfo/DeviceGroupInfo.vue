<template>
  <div>
    <Header :background="require('@/assets/image/1.png')">
      <template v-slot:content>
        <div class="common-content">
          <mt-field placeholder="设备组关键字" v-model="deviceGroup">
            <i class="iconfont icon-search"></i>
          </mt-field>
          <mt-field placeholder="设备单元关键字" v-model="deviceCode"></mt-field>
        </div>
      </template>
    </Header>

    <div class="scroll-content">
      <div
        class="scroll-tag"
        v-for="item in deviceGroupList"
        :key="item.deviceGroup"
        @click="goRouter(item)"
      >
        <mt-cell class="ceshices" title="当前状态:">
          <span :class="'stateColor'+item.state">{{ item.stateText }}</span>
        </mt-cell>
        <mt-cell title="设备组:">{{ item.deviceGroup }}</mt-cell>
        <mt-cell title="设备组名:">{{ item.deviceGroupName }}</mt-cell>
        <mt-cell title="最大产量:">{{ item.quantityUpLimit }} kg</mt-cell>
        <mt-cell title="最小产量:">{{ item.quantityLowLimit }} kg</mt-cell>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'DeviceGroupInfo',

  data: () => ({
    deviceGroupList: [],
    deviceGroup: '',
    deviceCode: ''
  }),

  watch: {
    deviceGroup (deviceGroup) {
      this.getDeviceGroupList({ deviceGroup })
    },

    deviceCode (deviceCode) {
      this.getDeviceGroupList({ deviceCode })
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.getDeviceGroupList()
    },

    getDeviceGroupList ({ deviceCode, deviceGroup } = {}) {
      this.$axios.get(this.$api.Page1.Index, {
        params: {
          token: this.$store.state.userInfo.token,
          deviceCode,
          deviceGroup
        }
      })
        .then(res => {
          if (res.data.errno === 0) {
            res.data.data.deviceGroupList.map(v => {
              v.stateText = v.state === '0' ? '未激活' : v.state === '1' ? '待机' : v.state === '2' ? '自动工作' : v.state === '3' ? '手动工作' : v.state === '4' ? '调试工作' : v.state === '5' ? '故障' : v.state === '6' ? '维护' : v.state === '7' ? '暂停' : v.state === '10' ? '报废' : ''
            })
            this.deviceGroupList = res.data.data.deviceGroupList
          }
        })
    },

    goRouter (itemInfo) {
      this.$store.commit('setDeviceGroup', itemInfo.deviceGroup)
      this.$router.push({ name: 'DeviceInfo' })
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
  .stateColor0,.stateColor1 {
    color: #fb8c00;
  }
  .stateColor2,.stateColor3{
    color: rgb(17, 203, 119)
  }
  .stateColor4,.stateColor7{
    color: #1867c0
  }
  .stateColor5,.stateColor6{
    color: #ff0000
  }
  .stateColor10{
    color: #6b6b6b
  }
</style>
