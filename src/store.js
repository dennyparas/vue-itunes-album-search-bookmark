import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Snackbar } from 'buefy/dist/components/snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    settings: { initialSearchQuery: 'eminem', searchQuery: '', panelType: 'card', bookmarkIcon: 'fa-star', perPage: '20', youtubeLink: 'false' },
    albums: [],
    albumTracks: [],
    bookmarkAlbums: [],
    searchFailed: false,
    albumTracksFailed: false,
    recentSearch: [],
    showRecentSearchBox: false,
    isAlbumLoading: false,
    isAlbumTracksLoading: false,
    language: 'en_us',
    pageType: 'search',
    appError: null
  },
  getters: {
    SEARCH_QUERY: (state) => {
      return state.settings.searchQuery
    },
    INITIAL_SEARCH_QUERY: (state) => {
      return state.settings.initialSearchQuery
    },
    GET_ALBUMS: (state) => {
      return state.albums
    },
    GET_ALBUM_TRACKS: (state) => {
      return state.albumTracks
    },
    GET_RECENT_SEARCH: (state) => {
      return state.recentSearch
    },
    IS_ALBUM_LOADING: (state) => {
      return state.isAlbumLoading
    },
    IS_ALBUM_TRACKS_LOADING: (state) => {
      return state.isAlbumTracksLoading
    },
    SEARCH_FAILED: (state) => {
      return state.searchFailed
    },
    ALBUM_TRACKS_FAILED: (state) => {
      return state.albumTracksFailed
    },
    BOOKMARK_ALBUMS: (state) => {
      return state.bookmarkAlbums.reverse()
    },
    PAGE_TYPE: (state) => {
      return state.pageType
    },
    SHOW_RECENT_SEARCH_BOX: (state) => {
      return state.showRecentSearchBox
    },
    GET_SETTINGS: (state) => {
      return state.settings
    }
  },
  mutations: {
    SET_SEARCH_QUERY: (state, query) => {
      state.pageType = 'search'
      state.settings.searchQuery = query
    },
    SET_ALBUM: (state, data) => {
      state.albums = data
    },
    SET_ALBUM_TRACKS: (state, data) => {
      state.albumTracks = data
    },
    SEARCH_FAILED: (state, action) => {
      state.searchFailed = action
    },
    SET_RECENT_SEARCH: (state, data) => {
      state.pageType = 'search'
      state.recentSearch = data
    },
    CLEAR_SEARCH: (state) => {
      state.albums = []
      state.settings.searchQuery = ''
    },
    TOGGLE_RECENT_SEARCH: (state) => {
      state.showRecentSearchBox = !state.showRecentSearchBox
    },
    SET_BOOKMARK_ALBUMS: (state, albums) => {
      state.bookmarkAlbums = albums
    },
    IS_ALBUM_LOADING: (state, action) => {
      state.isAlbumLoading = action
    },
    IS_ALBUM_TRACKS_LOADING: (state, action) => {
      state.isAlbumTracksLoading = action
    },
    SET_PAGE_TYPE: (state, type) => {
      if (type === 'bookmarks') { state.settings.searchQuery = '' }
      state.pageType = type
    },
    SET_SETTINGS: (state, settings) => {
      state.settings = settings
    },
    SET_ALBUM_TRACKS_FAILED: (state, action) => {
      state.albumTracksFailed = action
      state.albumTracks = []
    },
    RESET_ALBUM_TRACKS: (state) => {
      state.albumTracks = []
    },
    APP_ERROR: (state, message) => {
      state.appError = message
      Snackbar.open({
        message: message,
        type: 'is-danger',
        position: 'is-top',
        actionText: 'Reload App',
        indefinite: true,
        onAction: () => {
          window.location.reload()
        }
      })
    }
  },
  actions: {
    SEARCH_ALBUMS: async ({ commit, dispatch }, payload) => {
      try {
        // show loading animation
        commit('IS_ALBUM_LOADING', true)
        const { data } = await axios.get(`${payload.url}`)
        if (data.results.length === 0) {
          // if search response data results is empty commit search failed and clear the search input
          commit('CLEAR_SEARCH')
          commit('SEARCH_FAILED', true)
          commit('IS_ALBUM_LOADING', false)
        } else {
          // assign the search data results to set album state and query to set search query state
          commit('IS_ALBUM_LOADING', false)
          commit('SEARCH_FAILED', false)
          commit('SET_ALBUM', data.results)
          commit('SET_SEARCH_QUERY', payload.query)
          dispatch('SAVE_TO_RECENT_SEARCH', payload.query)
        }
      } catch (err) {
        // if error commit search failed and clear the search input
        commit('CLEAR_SEARCH')
        commit('IS_ALBUM_LOADING', false)
        commit('APP_ERROR', err.message)
      }
    },
    SAVE_TO_RECENT_SEARCH: ({ commit }, payload) => {
      try {
        let recentSearch = []
        // check if localstorage have recent search datas
        if (localStorage.getItem('recent_search') === null) {
          // if localstorage is null push the new recent search to empty array
          recentSearch.push(payload)
          localStorage.setItem('recent_search', JSON.stringify(recentSearch))
        } else {
          // if localstorage is not null append the new recent search to the end of array
          recentSearch = JSON.parse(localStorage.getItem('recent_search'))
          recentSearch.push(payload)
          // check if the new recent search is already in the array then remove duplicate and save to localstorage
          let newRecentSearch = (recentSearch) = recentSearch.filter((item, i) => recentSearch.indexOf(item) === i)
          localStorage.setItem('recent_search', JSON.stringify(newRecentSearch))
        }
        // assign a new array to the set recent search state
        commit('SET_RECENT_SEARCH', recentSearch)
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_RECENT_SEARCH: ({ commit }) => {
      try {
        // assign recent_search localstorage dato to a recentSearch variable
        const recentSearch = localStorage.getItem('recent_search')
        // check if recentSearch variable is not null
        if (recentSearch !== null) {
          // if not null assign a new array to the  recentSearch state
          commit('SET_RECENT_SEARCH', JSON.parse(recentSearch))
        }
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    REMOVE_RECENT_SEARCH_ITEM: ({ commit }, item) => {
      try {
        // assign recent_search localstorage to recentSearchItems variable
        const recentSearchItems = JSON.parse(localStorage.getItem('recent_search'))
        // get the index location of the item in recentSearchItems array
        const recentSearchItemsIndex = recentSearchItems.indexOf(item)
        // remove if item is in the recentSearchItems array
        if (recentSearchItemsIndex !== -1) recentSearchItems.splice(recentSearchItemsIndex, 1)
        // assign the new recentSearchItems array to the recent_search localstorage
        localStorage.setItem('recent_search', JSON.stringify(recentSearchItems))
        // if recentSearchItems is empty remove recent search box
        if (recentSearchItems.length === 0) {
          commit('TOGGLE_RECENT_SEARCH')
        }
        // assign the new recentSearchItems array to the the set recent search state
        commit('SET_RECENT_SEARCH', recentSearchItems)
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    BOOKMARK_ALBUM: ({ commit }, payload) => {
      try {
        // destructure and assign payload album objects to the new variables
        const { artistName, collectionCensoredName, artworkUrl100, primaryGenreName, collectionViewUrl, collectionId } = payload.album
        // assign the new payload album variables as object items to newBookmarkItem variable
        const newBookmarkItem = { artistName, collectionCensoredName, artworkUrl100, primaryGenreName, collectionViewUrl, collectionId }
        let bookmarkAlbums = []
        // check payload status
        if (payload.status === 'unbookmarked') {
          // if status is unbookmarked assign bookmark_albums localstorage to boolmarkAlbums
          bookmarkAlbums = JSON.parse(localStorage.getItem('bookmark_albums'))
          // check if the bookmarkAlbums item is already in the array
          const oldBookmarkAlbums = bookmarkAlbums.map((e) => { return e.collectionCensoredName }).indexOf(collectionCensoredName)
          // if is in the array remove payload item to bookmarkAlbums
          if (oldBookmarkAlbums !== -1) bookmarkAlbums.splice(oldBookmarkAlbums, 1)
          // set the new bookmarkAlbums array to the localstorage
          localStorage.setItem('bookmark_albums', JSON.stringify(bookmarkAlbums))
        } else {
          // if status is bookmark
          // check if bookmark storage is null
          if (localStorage.getItem('bookmark_albums') === null) {
            // push the newBookmarkItem to bookmarkAlbums
            bookmarkAlbums.push(newBookmarkItem)
            // set the new bookmarkAlbums array to the localstorage
            localStorage.setItem('bookmark_albums', JSON.stringify(bookmarkAlbums))
          } else {
            // if bookmark storage have datas
            // assign bookmark_album localstorage data to bookmarkAlbums
            bookmarkAlbums = JSON.parse(localStorage.getItem('bookmark_albums'))
            // push the newBookmarkItem to bookmarkAlbums
            bookmarkAlbums.push(newBookmarkItem)
            // push the newBookmarkItem to bookmarkAlbums
            localStorage.setItem('bookmark_albums', JSON.stringify(bookmarkAlbums))
          }
        }
        commit('SET_BOOKMARK_ALBUMS', bookmarkAlbums)
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_BOOKMARK_ALBUMS: ({ commit }) => {
      try {
        // assign bookmark_albums localstorage to bookmarkAlbums variable
        const bookmarkAlbums = localStorage.getItem('bookmark_albums')
        if (bookmarkAlbums !== null) {
          // if not null assign the new bookmark albums array to the bookmark albums state
          commit('SET_BOOKMARK_ALBUMS', JSON.parse(bookmarkAlbums))
        }
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_SETTINGS: ({ commit, state }) => {
      try {
        // assign settings localstorage to settings variable
        const settings = localStorage.getItem('settings')
        // check if settings variable is not null
        if (settings !== null) {
          // if not null assign the new setting array to the setting state
          commit('SET_SETTINGS', JSON.parse(settings))
        } else {
          // if null set the default state settings to localstorage
          localStorage.setItem('settings', JSON.stringify(state.settings))
        }
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    UPDATE_SETTINGS: ({ commit, state }, payload) => {
      try {
      // destructure and assign payload objects and state to the new variables
        const { settingValue, settingName } = payload
        const { settings } = state
        // update settings by reassigning the settings object name to the payload object name
        settings[settingName] = settingValue
        // assign the new settings array to the settings state
        commit('SET_SETTINGS', settings)
        // assign the new settings array to the settings localstorage
        localStorage.setItem('settings', JSON.stringify(settings))
      } catch (err) {
        commit('APP_ERROR', err.message)
      }
    },
    GET_ALBUM_TRACKS: async ({ commit, state }, payload) => {
      try {
        // show loading animation
        commit('IS_ALBUM_TRACKS_LOADING', true)
        // reset album tracks
        if (state.albumTracks.length > 0) {
          commit('RESET_ALBUM_TRACKS')
        }
        const { data } = await axios.get(`${payload.url}`)
        if (data.results.length === 0) {
          commit('SET_ALBUM_TRACKS_FAILED', true)
          commit('IS_ALBUM_TRACKS_LOADING', false)
        } else {
          commit('SET_ALBUM_TRACKS', data.results)
          commit('IS_ALBUM_TRACKS_LOADING', false)
        }
      } catch (err) {
        commit('IS_ALBUM_TRACKS_LOADING', false)
        commit('APP_ERROR', err.message)
      }
    }
  }
})
