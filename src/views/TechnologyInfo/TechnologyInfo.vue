<template>
  <div>
    <Snapshot v-if="openSnapshot" @onBack="onBack" :step="snapShotStep" :button="button"/>

    <StepDetail
      v-else-if="openStepDetail"
      :deviceCode="deviceCode"
      :deviceGroup="deviceGroup"
      :batch="batch"
      :onStep="onStep"
      :stepInfo="selectedStepInfo"
      @onBack="onBack"
      @handleOperating="handleOperating"
    />

    <div v-else>
      <Header :background="require('@/assets/image/4.png')">
        <template v-slot:content>
          <div class="common-content">
            <div class="common-header">
              <div
                class="iconfont icon-shexiangji"
                :class="isOnLine=='1'?'gay':''"
                style="font-size: 6vw;"
                @click="direct_recording"
              ></div>
              <div class="curr" @click="currStep"><i class="iconfont icon-arrow-"></i> 当前步骤</div>
            </div>
            <mt-cell title="生产批次:">{{ batch }}</mt-cell>
            <!--<mt-cell title="设备组:">{{ deviceGroup }}</mt-cell>-->
            <mt-cell title="设备单元:">{{ deviceCode }}</mt-cell>
            <mt-cell title="当前步骤/总步骤">{{onStep}}/{{stepsInfo.length}}</mt-cell>
          </div>
        </template>
      </Header>
      <div class="scroll-content" :style="{paddingTop:scrollPadding}">
        <div
          class="scroll-tag"
          v-for="item in stepsInfo"
          :key="item.step"
          @click="goRouter(item)"
        >
          <mt-cell title="步骤:">{{ item.step }}</mt-cell>
          <mt-cell title="步骤描述:">{{ item.des }}</mt-cell>
          <mt-cell title="功能:">{{ item.fun }}</mt-cell>
          <mt-cell title="方式:">{{ item.method }}</mt-cell>
          <mt-cell title="参数:">{{ item.params }}</mt-cell>
          <mt-cell v-if="item.phases" title="相别:">{{ item.phases.join(',') }}</mt-cell>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Snapshot from './components/Snapshot.vue'
import StepDetail from './components/StepDetail.vue'
import { paddingMixin } from '@/assets/js/mixins'

export default {
  name: 'TechnologyInfo',
  mixins: [paddingMixin],
  data: () => ({
    /** Windows open */
    openSnapshot: false,
    openStepDetail: false,
    openMode: '',

    batch: '',
    deviceGroup: '',
    deviceCode: '',

    stepsInfo: [],

    /**
     * deviceFunDetail: {
     *   ${fun}: {
     *     name: ${ functionName },
     *     method: {
     *       name: ${ methodName },
     *       data: {
     *         ${ 代号 }: ${ 文版 }, ...
     *       }
     *     },
     *     params:{ ${ paramName }: ${ unit }, ... }
     *   }, ...
     * }
     * */
    deviceFunDetail: {},

    techInfo: {},
    formulaInfo: {},
    deviceInfo: {},
    funMap: {},
    methodMap: {},
    onStep: -1,

    /** StepDetail */
    selectedStepInfo: {},
    toCurrBatch: false,
    button: '',
    snapShotStep: '',
    isOnLine: '0'
  }),

  created () {
    const batch = this.$store.state.batch
    if (!batch) {
      this.$router.push({ name: 'BatchInfo' })
      return
    }

    this.batch = batch
    this.deviceGroup = this.$store.state.deviceGroup
    this.deviceCode = this.$route.query.deviceCode ? this.$route.query.deviceCode : this.$store.state.deviceCode
    this.toCurrBatch = this.$route.query.deviceCode ? 1 : 0
  },

  mounted () {
    this.init()
  },

  methods: {
    init () {
      this.isOnLine = this.$store.state.isOnline
      this.getTechList()
    },

    getTechList () {
      this.$axios.get(this.$api.Page4.Index, {
        params: {
          token: this.$store.state.userInfo.token,
          deviceCode: this.deviceCode,
          batch: this.toCurrBatch === 1 ? '' : this.batch,
          button: this.toCurrBatch === 1 ? '1' : ''
        }
      })
        .then(res => {
          if (res.data.errno === 0) {
            const techInfo = res.data.data.techList[0]
            const formulaInfo = res.data.data.formulaDict
            const deviceInfo = res.data.data.deviceDict

            let funMap = {}
            let methodMap = {}
            for (const funItem of res.data.data.deviceFunList) funMap[funItem.functionCode] = funItem
            for (const methodItem of res.data.data.methodList) methodMap[methodItem.methodCode] = methodItem

            this.techInfo = techInfo
            this.formulaInfo = formulaInfo
            this.deviceInfo = deviceInfo
            this.funMap = funMap
            this.methodMap = methodMap

            this.onStep = Number(res.data.data.onStep)
            this.generateDeviceFunDetail()
          }
        })
    },

    handleOperating (value) {
      this.openStepDetail = false
      this.openSnapshot = true
      this.openMode = 'detail'
      this.button = value
    },

    direct_recording () {
      if (this.isOnLine) return
      this.openSnapshot = true
      this.button = 'direct_recording'
    },

    // to current step
    currStep () {
      if (!this.onStep || this.isOnLine) return
      this.selectedStepInfo = this.stepsInfo[this.onStep - 1]
      this.openStepDetail = true
      this.snapShotStep = this.stepsInfo[this.onStep - 1].step
    },

    generateDeviceFunDetail () {
      /**
       * deviceFunDetail: {
       *   ${fun}: {
       *     name: ${ functionName },
       *     method: {
       *       name: ${ methodName },
       *       data: {
       *         ${ 代号 }: ${ 文版 }, ...
       *       }
       *     },
       *     params:[ { ${ paramName }, ${ unit } }, ... ]
       *   }, ...
       * }
       * */
      const spacer = '--N--!'
      const techData = this.techInfo.techData.filter(v => v.device_code === this.deviceCode)[0]
      techData.des = techData.des.split(spacer)
      techData.fun = techData.fun.split(spacer)
      techData.par_1 = techData.par_1.split(spacer)
      techData.par_2 = techData.par_2.split(spacer)
      techData.item = techData.item.split(spacer)

      let deviceFunDetail = ((deviceInfo, funMap, methodMap) => {
        let result = {}
        for (const funCode of Object.keys(deviceInfo.deviceFun)) {
          result[funCode] = {
            name: funMap[funCode].functionName,
            params: funMap[funCode].params,
            method: funMap[funCode].methodCode
              ? {
                name: methodMap[funMap[funCode].methodCode].methodName,
                data: methodMap[funMap[funCode].methodCode].methodData
              }
              : null
          }
        }
        return result
      })(this.deviceInfo, this.funMap, this.methodMap)

      const _des = techData.des
      const _fun = techData.fun
      const _method = techData.par_1
      const _params = techData.par_2
      const _phases = techData.item
      let [stepsInfo, flag] = [[], 0]
      while (_fun[flag]) {
        /** Initialization stepInfo and add fun */
        let stepInfo = { step: flag + 1, des: _des[flag], fun: deviceFunDetail[_fun[flag]].name }

        /** Add method */
        if (deviceFunDetail[_fun[flag]].method && deviceFunDetail[_fun[flag]].method.name) {
          stepInfo.method = deviceFunDetail[_fun[flag]].method.data[_method[flag]]
        }

        /** Add params */
        if (deviceFunDetail[_fun[flag]].params) {
          stepInfo.params = ''
          for (const param of deviceFunDetail[_fun[flag]].params) {
            stepInfo.params += `${param.paramName}: ${_params.shift()} ${param.unit}`
          }
        }

        /** Add phase */
        if (_phases[flag]) {
          // stepInfo.phases = ''
          // for (const item of _phases[flag].split(',')) {
          //   stepInfo.phases += `${item}, `
          // }
          // stepInfo.phases = stepInfo.phases.slice(0, -2)
          stepInfo.phases = _phases[flag].split(',')
        }

        stepsInfo.push(stepInfo)
        flag++
      }

      this.stepsInfo = stepsInfo
    },

    goRouter (itemInfo) {
      this.selectedStepInfo = itemInfo
      this.openStepDetail = true
      this.snapShotStep = itemInfo.step
    },

    /** FixMe The code is very lower */
    onBack (value) {
      if (this.openMode === 'detail') {
        this.openSnapshot = false
        this.openStepDetail = true
        this.openMode = ''
      } else {
        this.openSnapshot = false
        this.openStepDetail = false
      }
    }
  },

  components: {
    Header,
    Snapshot,
    StepDetail
  }
}
</script>

<style lang="scss" scoped>
  .common-content {
    // height: 52vw;
    padding: 5vw;

    > .mint-field {
      border-bottom: .5px solid #ececec;
    }
  }

  .common-header {
    display: flex;
    justify-content: space-between;

    .icon-shexiangji{
      color: #fb8c00;
    }
    .gay {
      color: #6b6b6b;
    }
    .curr {
      color: rgb(107, 107, 107);

      .icon-arrow- {
        color: rgb(21, 102, 202)
      }
    }
  }

  .scroll-content {
    padding: calc(62vw - 9.07vw) 5vw 5vw;
    // min-height: calc(100vh - 35.333vw - (52vw - 9.07vw));
  }
</style>
