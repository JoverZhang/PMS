import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      username: 'test',
      token: 'test572148'
    },

    deviceGroup: 'DGtest001',
    deviceCode: 'D01',
    batch: 'W1B1'

  },

  mutations: {
    updateUserInfo (state, { token, username }) {
      /**
       token: <String>
       username: <String>
       */
      state.userInfo = { token, username }
    },

    setDeviceGroup (state, deviceGroup) {
      state.deviceGroup = deviceGroup
    },

    setDeviceCode (state, deviceCode) {
      state.deviceCode = deviceCode
    },

    setBatch (state, batch) {
      state.batch = batch
    }
  },

  actions: {}
})
