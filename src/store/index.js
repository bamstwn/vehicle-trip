import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    trips: {
      tripDirection: '',
      startDuration: '',
      endDuration: '',
      totalDistance: 0,
      totalTrips: 0
    }
  },
  mutations: {
    changeStoreTrip (state, value) {
      state.trips[value.key] = value.val
    },
    setLoading (state, value) {
      state.loading = value
    },
  }
})