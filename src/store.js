import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchQuery: '',
    albums: [],
    bookmarkAlbums: [],
    searchFailed: false,
    recentSearch: [],
    showRecentSearchBox: false,
    isLoading: false,
    language: 'en_us',
    pageType: 'search'
  },
  getters: {
    SEARCH_QUERY (state) {
      return state.searchQuery
    },
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
    },
    PAGE_TYPE (state) {
      return state.pageType
    },
    SHOW_RECENT_SEARCH_BOX (state) {
      return state.showRecentSearchBox
    }
  },
  mutations: {
    SET_SEARCH_QUERY (state, query) {
      state.pageType = 'search'
      state.searchQuery = query
    },
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
      state.searchQuery = ''
    },
    TOGGLE_RECENT_SEARCH (state) {
      state.showRecentSearchBox = !state.showRecentSearchBox
    },
    SET_BOOKMARK_ALBUMS (state, albums) {
      state.bookmarkAlbums = albums
    },
    IS_LOADING (state, action) {
      state.isLoading = action
    },
    SET_PAGE_TYPE (state, type) {
      state.pageType = type
    }

  },
  actions: {
    SEARCH_ALBUMS ({ commit, dispatch }, payload) {
      commit('IS_LOADING', true)
      return axios.get(`${payload.url}`)
        .then((response) => {
          if (response.data.results.length === 0) {
            commit('CLEAR_SEARCH')
            commit('SEARCH_FAILED', true)
            commit('IS_LOADING', false)
          } else {
            commit('IS_LOADING', false)
            commit('SEARCH_FAILED', false)
            commit('SET_ALBUM', response.data.results)
            commit('SET_SEARCH_QUERY', payload.query)
            setTimeout(() => {
              dispatch('SAVE_TO_RECENT_SEARCH', payload.query)
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
          // remove duplicate
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
        console.log(newItems.indexOf(item))
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
      if (typeof window !== 'undefined') {
        const newBookmarkItem = {
          artistName: payload.album.artistName,
          collectionCensoredName: payload.album.collectionCensoredName,
          artworkUrl100: payload.album.artworkUrl100,
          primaryGenreName: payload.album.primaryGenreName,
          collectionViewUrl: payload.album.collectionViewUrl
        }
        let bookmarkAlbums = []
        if (payload.status === 'unbookmarked') {
          bookmarkAlbums = JSON.parse(localStorage.getItem('bookmark_albums'))
          // remove from array
          const oldBookmarkAlbums = bookmarkAlbums.map((e) => { return e.collectionCensoredName }).indexOf(payload.album.collectionCensoredName)
          if (oldBookmarkAlbums !== -1) bookmarkAlbums.splice(oldBookmarkAlbums, 1)
          localStorage.setItem('bookmark_albums', JSON.stringify(bookmarkAlbums))
        } else {
          if (localStorage.getItem('bookmark_albums') === null) {
            bookmarkAlbums.push(newBookmarkItem)
            localStorage.setItem('bookmark_albums', JSON.stringify(bookmarkAlbums))
          } else {
            bookmarkAlbums = JSON.parse(localStorage.getItem('bookmark_albums'))
            bookmarkAlbums.push(newBookmarkItem)
            localStorage.setItem('bookmark_albums', JSON.stringify(bookmarkAlbums))
          }
        }
        commit('SET_BOOKMARK_ALBUMS', bookmarkAlbums)
      } else {
        alert('Your browser is not supported')
      }
    },
    GET_BOOKMARK_ALBUMS ({ commit }) {
      if (typeof window !== 'undefined') {
        const bookmarkAlbums = localStorage.getItem('bookmark_albums')
        if (bookmarkAlbums !== null) {
          commit('SET_BOOKMARK_ALBUMS', JSON.parse(bookmarkAlbums))
        }
      } else {
        alert('Your browser is not supported')
      }
    }
  }
})
