import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    albums: [],
    searchFailed: false
  },
  mutations: {
    SET_ALBUM (state, data) {
      state.albums = data
    },
    SEARCH_FAILED (state) {
      state.searchFailed = true
    },
    CLEAR_SEARCH (state) {
      state.albums = []
    }

  },
  actions: {
    SEARCH_ALBUMS ({ commit, dispatch }, payload) {
      return axios.get(`https://itunes.apple.com/search?term=${payload}&entity=album`)
        .then((response) => {
          if (response.data.results.length === 0) {
            commit('CLEAR_SEARCH')
            commit('SEARCH_FAILED')
          } else {
            commit('SET_ALBUM', response.data.results)
          }
        })
        .catch(() => {
          commit('CLEAR_SEARCH')
          commit('SEARCH_FAILED')
        })
    }
  }
})
