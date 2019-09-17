<template>
  <div>
    <Header :background="require('@/assets/image/2.png')">
      <template v-slot:content>
        <div class="common-content">
          <!--<div @click="() => $router.back()">返回上一级</div>-->
          <mt-cell title="设备组:">{{ deviceGroup }}</mt-cell>
          <mt-field placeholder="设备单元关键字" v-model="deviceCode">
            <i class="iconfont icon-search"></i>
          </mt-field>
        </div>
      </template>
    </Header>
    <div class="scroll-content" :style="{paddingTop:scrollPadding}">
      <div
        class="scroll-tag"
        v-for="item in deviceList"
        :key="item.deviceCode"
        @click="goRouter(item)"
      >
        <mt-cell class="ceshices" title="当前状态:">
          <span :class="'stateColor'+item.state">{{ item.stateText }}</span>
        </mt-cell>
        <mt-cell title="设备单元编号:">{{ item.deviceCode }}</mt-cell>
        <mt-cell title="设备单元名称:">{{ item.deviceName }}</mt-cell>
        <mt-cell title="最大产量:">{{ item.quantityUpLimit }} kg</mt-cell>
        <mt-cell title="最小产量:">{{ item.quantityLowLimit }} kg</mt-cell>
        <mt-cell title="当前生产批次:">{{ item.onBatch }}</mt-cell>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { paddingMixin } from '@/assets/js/mixins'

export default {
  name: 'DeviceInfo',

  mixins: [ paddingMixin ],
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
            res.data.data.deviceList.map(v => {
              v.stateText = v.state === '0' ? '未激活' : v.state === '1' ? '待机' : v.state === '2' ? '自动工作' : v.state === '3' ? '手动工作' : v.state === '4' ? '调试工作' : v.state === '5' ? '故障' : v.state === '6' ? '维护' : v.state === '7' ? '暂停' : v.state === '10' ? '报废' : ''
            })
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
    /*height: 30vw;*/
    padding: 5vw;

    > .mint-field {
      border-bottom: .5px solid #ececec;
    }
  }

  .scroll-content {
    padding: calc(40vw - 9.07vw) 5vw 5vw;
    // min-height: calc(100vh - 35.333vw - (40vw - 4.07vw));
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
