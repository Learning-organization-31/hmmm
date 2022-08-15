import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import subject from './modules/subject'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules:{
    subject
  },
  getters
})

export default store
