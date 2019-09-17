<template>
  <div>
    <Header :background="require('@/assets/image/5.png')" :on-back="() => $emit('onBack')">
      <template v-slot:content>
        <div class="common-content">
          <!--<div class="back" @click="() => $emit('onBack','detail')">返回上一级</div>-->
          <!--<mt-cell title="设备组:">{{ deviceGroup }}</mt-cell>-->
          <mt-cell title="设备单元:">{{ deviceCode }}</mt-cell>
          <mt-cell title="生产批次:">{{ batch }}</mt-cell>
          <mt-field placeholder="扫描物料二维码" v-model="materialCode"></mt-field>
        </div>
      </template>
    </Header>
    <div class="scroll-content" :style="{paddingTop:scrollPadding}">
      <div class="scroll-tag" style="background-color: #ffffff">
        <mt-cell title="步骤:">{{ stepInfo.step }}</mt-cell>
        <mt-cell title="步骤描述:">{{ stepInfo.des }}</mt-cell>
        <mt-cell title="功能:">{{ stepInfo.fun }}</mt-cell>
        <mt-cell title="方式:">{{ stepInfo.method }}</mt-cell>
        <mt-cell title="参数:">{{ stepInfo.params }}</mt-cell>
        <div v-for="(value ,phase) of materialItemInfoMap" :key="phase">
          <div style="margin-top: 3vw">相别: {{phase}}</div>
          <span v-for="(secValue, material) in value" :key="material">
            物料: {{material}}-{{secValue.no_count}}/{{secValue.all_count}}
          </span>
        </div>

      </div>
    </div>
    <div style="position: fixed; bottom: 0; width: 100vw; display: flex">
      <mt-button
        :type="isOnline?'primary':'default'"
        :disabled="isOnline"
        @click="postHandler('production_start')"
      >开始生产
      </mt-button>
      <mt-button
        :type="isOnline?'primary':'default'"
        :disabled="isOnline"
        @click="postHandler('step_complete', {step: onStep})"
      >完成步骤
      </mt-button>
      <mt-button
        :type="isOnline?'primary':'default'"
        :disabled="onStep === stepInfo.step || isOnline"
        @click="postHandler('step_jump', {step: stepInfo.step})"
      >跳转步骤
      </mt-button>
      <mt-button type="primary" @click="postHandler('is_stop')">暂停恢复</mt-button>
      <mt-button
        :type="isOnline?'primary':'default'"
        :disabled="!materialCode || isOnline"
        @click="postHandler('touliao_decision',{qrcode: materialCode})"
      >确认投料
      </mt-button>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { paddingMixin } from '@/assets/js/mixins'

export default {
  name: 'StepDetail',
  mixins: [ paddingMixin ],
  props: {
    deviceGroup: String,
    deviceCode: String,
    batch: String,
    onStep: Number,

    stepInfo: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    materialCode: '',
    materialItemInfoMap: {},
    isOnline: false
  }),

  mounted () {
    this.isOnLine = this.$store.state.isOnline
    this.init()
  },

  methods: {
    init () {
      this.$axios.get(this.$api.Page5.Index, {
        params: {
          token: this.$store.state.userInfo.token,
          materialItemList: JSON.stringify(this.stepInfo.phases)
        }
      })
        .then(res => {
          if (res.data.errno === 0) {
            this.materialItemInfoMap = res.data.data.materialitemInfoList[0]
          }
        })
    },

    postHandler (button) {
      // postHandlerOperating
      if (button === 'touliao_decision') {
        this.postDeviceAttr(button)
        return
      }
      this.$emit('handleOperating', button)
    },

    // postHandler (button, { step, qrcode } = {}) {
    //   this.$axios.post(this.$api.Page5.Index, {
    //     token: this.$store.state.userInfo.token,
    //     deviceCode: this.deviceCode,
    //     batch: this.batch,
    //     button,
    //     step,
    //     qrcode
    //   })
    //     .then(res => {
    //       if (res.data.errno === 0) {
    //         alert(res.data.msg)
    //       } else {
    //         alert(res.data.msg)
    //       }
    //     })
    // }
    postDeviceAttr (button) {
      this.$axios.post(this.$api.Page6.Index, {
        token: this.$store.state.userInfo.token,
        deviceCode: this.deviceCode,
        batch: this.batch,
        step: this.stepInfo.step.toString(),
        button: button,
        materialCode: this.materialCode,
        deviceAttrList: ''
      })
        .then(res => {
          if (res.data.errno === 0) {
            alert(res.data.msg)
            window.localStorage.setItem('attrList', this.submitForm)
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
    // height: 50vw;
    padding: 5vw;

    > .mint-field {
      border-bottom: .5px solid #ececec;
    }
  }

  .scroll-content {
    padding: calc(60vw - 9.07vw) 5vw 0;
    // min-height: calc(100vh - 35.333vw - (60vw - 9.07vw));

    .scroll-tag {
      height: 100vw;
      margin-bottom: 15vw;
    }
  }
</style>
