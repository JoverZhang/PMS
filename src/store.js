import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      username: 'test',
      token: 'yazhouyilige'
    },

    deviceGroup: 'DGtest001',
    deviceCode: 'D01',
    batch: 'W1B1',
    isOnline: false
  },

  mutations: {
    updateUserInfo (state, { token, username }) {
      /**
       token: <String>
       username: <String>
       */
      state.userInfo = { token, username }
    },

    setOnLine (state, isOnline) {
      state.isOnline = isOnline
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
