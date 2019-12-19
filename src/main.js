import Vue from 'vue'
import App from './App.vue'
import store from './store'
import moment from 'moment-timezone'

moment.tz.setDefault('UTC')

Vue.config.productionTip = false

new Vue({
	store,
  render: h => h(App),
}).$mount('#app')
