<template>
  <div>
    <mt-datetime-picker
      ref="beginDate"
      v-model="beginDate"
      @confirm="getBatchList"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
    />
    <mt-datetime-picker
      ref="endDate"
      v-model="endDate"
      @confirm="getBatchList"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
    />
    <Header :background="require('@/assets/image/3.png')">
      <template v-slot:content>
        <div class="common-content">
          <mt-cell title="设备组:">{{ deviceGroup }}</mt-cell>
          <mt-cell title="设备单元:">{{ deviceCode }}</mt-cell>
          <mt-cell title="未完成/已完成">{{endBatchCount}}/{{allBatchCount}}</mt-cell>
          <mt-field placeholder="生产批次关键字" v-model="batch">
            <i class="iconfont icon-search"></i>
          </mt-field>
          <div style="display: flex; align-items: center; justify-content: center">
            <mt-button @click="openBeginDate">{{renderDate(beginDate)}}</mt-button>
            <div style="width: 5vw; border-bottom: 1px solid black"></div>
            <mt-button @click="openEndDate">{{renderDate(endDate)}}</mt-button>
          </div>
        </div>
      </template>
    </Header>
    <div class="scroll-content" :style="{paddingTop:scrollPadding}">
      <div
        class="scroll-tag"
        v-for="item in batchList"
        :key="item.batch"
        @click="goRouter(item)"
      >
        <mt-cell class="ceshices" title="当前状态:">
          <span :class="'stateColor'+item.state">{{ item.stateText }}</span>
        </mt-cell>
        <mt-cell title="工单编号:">{{ item.wocode }}</mt-cell>
        <mt-cell title="生产批次:">{{ item.batch }}</mt-cell>
        <mt-cell title="产量:">{{ item.iquantity }} kg</mt-cell>
        <mt-cell title="配方编号:">{{ item.fomulaCode }}</mt-cell>
        <mt-cell title="工艺编号:">{{ item.techCode }}</mt-cell>
        <!-- <mt-cell title="状态:">{{ item.state }}</mt-cell> -->
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'BatchInfo',

  data: () => ({
    deviceGroup: '',
    deviceCode: '',
    batch: '',

    beginDate: null,
    endDate: null,

    batchList: [],
    allBatchCount: '',
    endBatchCount: '',
    scrollPadding: ''
  }),

  watch: {
    batch () {
      this.getBatchList()
    }
  },

  computed: {
    renderDate () {
      return date => date.format('yyyy-MM-dd')
    }
  },

  created () {
    const deviceCode = this.$store.state.deviceCode
    if (!deviceCode) {
      this.$router.push({ name: 'DeviceGroupInfo' })
      return
    }

    this.beginDate = new Date(String(Number(this.renderDate(new Date()).slice(0, 4)) - 1))
    this.endDate = new Date(String(Number(this.renderDate(new Date()).slice(0, 4)) + 1))

    this.deviceGroup = this.$store.state.deviceGroup
    this.deviceCode = deviceCode
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
      this.getBatchList()
    },

    handleSettingPadding () {
      this.$nextTick(()=>{
        const common = document.querySelector("div[class='common-content']")
        this.scrollPadding = 'calc('+ common.offsetHeight.toString() + 'px - 9.07vw)'
      })
    },

    getBatchList () {
      this.$axios.get(this.$api.Page3.Index, {
        params: {
          token: this.$store.state.userInfo.token,
          deviceCode: this.deviceCode,
          batch: this.batch,
          beginDate: this.renderDate(this.beginDate),
          endDate: this.renderDate(this.endDate)
        }
      })
        .then(res => {
          if (res.data.errno === 0) {
            res.data.data.batchList.map(v => {
              v.stateText = v.state === '0' ? '未激活' : v.state === '1' ? '待机' : v.state === '2' ? '自动工作' : v.state === '3' ? '手动工作' : v.state === '4' ? '调试工作' : v.state === '5' ? '故障' : v.state === '6' ? '维护' : v.state === '7' ? '暂停' : v.state === '10' ? '报废' : ''
            })
            this.batchList = res.data.data.batchList
            this.allBatchCount = res.data.data.allBatchCount
            this.endBatchCount = res.data.data.endBatchCount
          }
        })
    },

    openBeginDate () {
      this.$refs.beginDate.open()
    },

    openEndDate () {
      this.$refs.endDate.open()
    },

    goRouter (itemInfo) {
      this.$store.commit('setBatch', itemInfo.batch)
      this.$router.push({ name: 'TechnologyInfo' })
    }
  },

  components: {
    Header
  }
}
</script>

<style lang="scss" scoped>
  .common-content {
    overflow: hidden;
    // height: 60vw;
    padding: 2vw;

    > .mint-field {
      border-bottom: .5px solid #ececec;
    }
  }

  .scroll-content {
    padding: calc(70vw - 9.07vw) 5vw 5vw;
    min-height: calc(100vh - 35.333vw - (70vw - 9.07vw));
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
