export const paddingMixin = {
  data: () => ({
    scrollPadding: ''
  }),
  mounted () {
    this.handleSettingPadding()
    window.onresize = () => {
      this.handleSettingPadding()
    }
  },
  methods: {
    handleSettingPadding () {
      this.$nextTick(() => {
        const common = document.querySelector('div[class=\'common-content\']')
        this.scrollPadding = 'calc(' + common.offsetHeight.toString() + 'px - 9.07vw)'
      })
    }
  }
}
