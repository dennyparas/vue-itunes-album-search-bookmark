import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    albums: [],
    bookmarkAlbums: [],
    searchFailed: false,
    recentSearch: [],
    showRecentSearchBox: false,
    isLoading: false,
    language: 'en_us'
  },
  getters: {
    GET_ALBUMS (state) {
      return state.albums
    },
    GET_RECENT_SEARCH (state) {
      return state.recentSearch
    },
    IS_LOADING (state) {
      return state.isLoading
    },
    SEARCH_FAILED (state) {
      return state.searchFailed
    },
    BOOKMARK_ALBUMS (state) {
      return state.bookmarkAlbums
    }
  },
  mutations: {
    SET_ALBUM (state, data) {
      state.albums = data
    },
    SEARCH_FAILED (state, action) {
      state.searchFailed = action
    },
    SET_RECENT_SEARCH (state, data) {
      state.recentSearch = data
    },
    CLEAR_SEARCH (state) {
      state.albums = []
    },
    TOGGLE_RECENT_SEARCH (state) {
      state.showRecentSearchBox = !state.showRecentSearchBox
    },
    SET_BOOKMARK_ALBUMS (state, albums) {
      state.bookmarkAlbums = albums
    },
    IS_LOADING (state, action) {
      state.isLoading = action
    }

  },
  actions: {
    SEARCH_ALBUMS ({ commit, dispatch, state }, payload) {
      commit('IS_LOADING', true)
      return axios.get(`https://itunes.apple.com/search?term=${payload}&entity=album&lang=${state.language}`)
        .then((response) => {
          if (response.data.results.length === 0) {
            commit('CLEAR_SEARCH')
            commit('SEARCH_FAILED', true)
            commit('IS_LOADING', false)
          } else {
            commit('IS_LOADING', false)
            commit('SEARCH_FAILED', false)
            commit('SET_ALBUM', response.data.results)

            setTimeout(() => {
              dispatch('SAVE_TO_RECENT_SEARCH', payload)
            }, 3000)
          }
        })
        .catch(() => {
          commit('CLEAR_SEARCH')
          commit('SEARCH_FAILED', true)
          commit('IS_LOADING', false)
        })
    },
    SAVE_TO_RECENT_SEARCH ({ commit }, payload) {
      if (typeof window !== 'undefined') {
        let recentSearch = []
        if (localStorage.getItem('recent_search') === null) {
          recentSearch.push(payload)
          localStorage.setItem('recent_search', JSON.stringify(recentSearch))
        } else {
          recentSearch = JSON.parse(localStorage.getItem('recent_search'))
          recentSearch.push(payload)
          let newRecentSearch = (recentSearch) = recentSearch.filter((item, i) => recentSearch.indexOf(item) === i)
          localStorage.setItem('recent_search', JSON.stringify(newRecentSearch))
        }
        commit('SET_RECENT_SEARCH', recentSearch)
      } else {
        alert('Your browser is not supported')
      }
    },
    GET_RECENT_SEARCH ({ commit }) {
      if (typeof window !== 'undefined') {
        const recentSearch = localStorage.getItem('recent_search')
        if (recentSearch !== null) {
          commit('SET_RECENT_SEARCH', JSON.parse(recentSearch))
        }
      } else {
        alert('Your browser is not supported')
      }
    },
    REMOVE_RECENT_SEARCH_ITEM ({ commit }, item) {
      if (typeof window !== 'undefined') {
        const newItems = JSON.parse(localStorage.getItem('recent_search'))
        const oldItems = newItems.indexOf(item)
        if (oldItems !== -1) newItems.splice(oldItems, 1)
        localStorage.setItem('recent_search', JSON.stringify(newItems))
        if (newItems.length === 0) {
          commit('TOGGLE_RECENT_SEARCH')
        }
        commit('SET_RECENT_SEARCH', newItems)
      } else {
        alert('Your browser is not supported')
      }
    },
    BOOKMARK_ALBUM ({ commit }, payload) {
      const newBookmarkItem = {
        artistName: payload.artistName,
        collectionCensoredName: payload.collectionCensoredName,
        artworkUrl100: payload.artworkUrl100,
        primaryGenreName: payload.primaryGenreName,
        collectionViewUrl: payload.collectionViewUrl
      }
      if (typeof window !== 'undefined') {
        let bookmarkAlbums = []
        if (localStorage.getItem('bookmark_albums') === null) {
          bookmarkAlbums.push(newBookmarkItem)
          localStorage.setItem('bookmark_albums', JSON.stringify(bookmarkAlbums))
        } else {
          bookmarkAlbums = JSON.parse(localStorage.getItem('bookmark_albums'))
          bookmarkAlbums.push(newBookmarkItem)
          let newBookmarkAlbums = (bookmarkAlbums) = bookmarkAlbums.filter((item, i) => bookmarkAlbums.indexOf(item) === i)
          localStorage.setItem('bookmark_albums', JSON.stringify(newBookmarkAlbums))
        }
        commit('SET_BOOKMARK_ALBUMS', bookmarkAlbums)
      } else {
        alert('Your browser is not supported')
      }
    }
  }
})
