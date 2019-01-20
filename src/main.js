import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Buefy from 'buefy'
import vueMoment from 'vue-moment'

Vue.use(Buefy)
Vue.use(vueMoment)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
