import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settings: { initialSearchQuery: 'eminem', searchQuery: '', panelType: 'card', bookmarkIcon: 'fa-star', perPage: '20', youtubeLink: 'false' },
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
      return state.settings.searchQuery
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
    },
    GET_SETTINGS (state) {
      return state.settings
    }
  },
  mutations: {
    SET_SEARCH_QUERY (state, query) {
      state.pageType = 'search'
      state.settings.searchQuery = query
    },
    SET_ALBUM (state, data) {
      state.albums = data
    },
    SEARCH_FAILED (state, action) {
      state.searchFailed = action
    },
    SET_RECENT_SEARCH (state, data) {
      state.pageType = 'search'
      state.recentSearch = data
    },
    CLEAR_SEARCH (state) {
      state.albums = []
      state.settings.searchQuery = ''
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
      if (type === 'bookmarks') { state.settings.searchQuery = '' }
      state.pageType = type
    },
    SET_SETTINGS (state, settings) {
      state.settings = settings
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
            }, 2000)
          }
        })
        .catch(() => {
          commit('CLEAR_SEARCH')
          commit('SEARCH_FAILED', true)
          commit('IS_LOADING', false)
        })
    },
    SAVE_TO_RECENT_SEARCH ({ commit }, payload) {
      try {
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
      } catch (e) {
        alert(e.message)
      }
    },
    GET_RECENT_SEARCH ({ commit }) {
      try {
        const recentSearch = localStorage.getItem('recent_search')
        if (recentSearch !== null) {
          commit('SET_RECENT_SEARCH', JSON.parse(recentSearch))
        }
      } catch (e) {
        alert(e.message)
      }
    },
    REMOVE_RECENT_SEARCH_ITEM ({ commit }, item) {
      try {
        const newItems = JSON.parse(localStorage.getItem('recent_search'))
        const oldItems = newItems.indexOf(item)
        if (oldItems !== -1) newItems.splice(oldItems, 1)
        localStorage.setItem('recent_search', JSON.stringify(newItems))
        if (newItems.length === 0) {
          commit('TOGGLE_RECENT_SEARCH')
        }
        commit('SET_RECENT_SEARCH', newItems)
      } catch (e) {
        alert(e.message)
      }
    },
    BOOKMARK_ALBUM ({ commit }, payload) {
      try {
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
      } catch (e) {
        alert(e.message)
      }
    },
    GET_BOOKMARK_ALBUMS ({ commit }) {
      try {
        const bookmarkAlbums = localStorage.getItem('bookmark_albums')
        if (bookmarkAlbums !== null) {
          commit('SET_BOOKMARK_ALBUMS', JSON.parse(bookmarkAlbums))
        }
      } catch (e) {
        alert(e.message)
      }
    },
    GET_SETTINGS ({ commit, state }) {
      try {
        const settings = localStorage.getItem('settings')
        if (settings !== null) {
          commit('SET_SETTINGS', JSON.parse(settings))
        } else {
          commit('SET_SETTINGS', state.settings)
          localStorage.setItem('settings', JSON.stringify(state.settings))
        }
      } catch (e) {
        alert(e.message)
      }
    },
    TOGGLE_PANEL_TYPE ({ commit, state }) {
      try {
        const panelType = state.settings.panelType === 'card' ? 'media' : 'card'
        const newSettings = state.settings
        newSettings['panelType'] = panelType
        commit('SET_SETTINGS', newSettings)
        localStorage.setItem('settings', JSON.stringify(newSettings))
      } catch (e) {
        alert(e.message)
      }
    },
    UPDATE_SETTINGS ({ commit, state }, payload) {
      const settingValue = payload.settingValue
      const settingName = payload.settingName
      const newSettings = state.settings
      newSettings[settingName] = settingValue
      commit('SET_SETTINGS', newSettings)
      localStorage.setItem('settings', JSON.stringify(newSettings))
    }
  }
})
