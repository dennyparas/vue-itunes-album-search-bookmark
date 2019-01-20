<template>
  <div id="app">
    <div  class="nav-search">
      <the-navbar
        @clickToggleRecentSearchBox="toggleRecentSearchBox"
        @clickShowBookmarks="showBookmarks"
        @clickSettings="showSettingsModal"
        @clickTitle="setPageType('search')"
        @clickAlbumName='getAlbumTracks'
        :pageType="pageType"
        :recentSearch="recentSearch"
        :bookmarkAlbums="bookmarkAlbums"
        :settings="settings"
        :isMobile="isMobile"
        :showRecentSearchBox="showRecentSearchBox">
      </the-navbar>
      <the-searchbar
        @clickSearch="searchAlbums"
        @clickClearSearch="clearSearch"
        :recentSearch="recentSearch"
        :newSearchQuery="searchQuery"
        :settings="settings"
        >
      </the-searchbar>
    </div>
    <main>
      <transition name="fade">
        <recent-search-box
          v-if="showRecentSearchBox && recentSearch.length > 0"
          :recentSearch="recentSearch"
          @clickSearchItem="searchAlbums"
          @clickRemoveRecentSearchItem="removeRecentSearchItem">
        </recent-search-box>
      </transition>
      <album-list
        @clickUpdateSettings="updateSettings"
        @clickAlbumName='getAlbumTracks'
        :clickBookmarkAlbum="bookmarkAlbum"
        :replaceArtworkUrlSize="replaceArtworkUrlSize"
        :isInBookmark="isInBookmark"
        :albums="pageType === 'search' ? albums: bookmarkAlbums"
        :pageType="pageType"
        :isAlbumLoading="isAlbumLoading"
        :searchFailed="searchFailed"
        :bookmarkAlbums="bookmarkAlbums"
        :settings="settings"
        :isMobile="isMobile"
        >
      </album-list>
      <b-modal
        :active.sync="isSettingsModalActive"
        :canCancel=true has-modal-card >
        <the-settings
          :settings="settings"
          @clickUpdateSettings="updateSettings">
        </the-settings>
      </b-modal>
      <b-modal
        :active.sync="isAlbumTracksModalActive"
        :canCancel=true has-modal-card
        :onCancel="resetAlbumTracks"
        scroll="clip"
        >
        <div class="columns is-mobile"  v-if="albumTracks.length === 0">
          <div class="column loading">
              <b-loading :is-full-page="false" :active.sync="isAlbumTracksLoading" :can-cancel="false"></b-loading>
          </div>
        </div>
        <album-track-list  v-else
          :albumTracks="albumTracks"
          :clickBookmarkAlbum="bookmarkAlbum"
          :isInBookmark="isInBookmark"
          :replaceArtworkUrlSize="replaceArtworkUrlSize"
          :settings="settings"
          :isMobile="isMobile"
          >
        </album-track-list>
      </b-modal>
    </main>
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import TheSearchbar from './components/TheSearchbar'
import RecentSearchBox from './components/RecentSearchBox'
import AlbumList from './components/AlbumList'
import TheSettings from './components/TheSettings'
import AlbumTrackList from './components/AlbumTrackList'
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      isSettingsModalActive: false,
      isAlbumTracksModalActive: false,
      isMobile: false,
      windowWidth: window.innerWidth
    }
  },
  components: {
    TheNavbar,
    TheSearchbar,
    RecentSearchBox,
    TheSettings,
    AlbumList,
    AlbumTrackList
  },
  computed: {
    ...mapGetters({
      recentSearch: 'GET_RECENT_SEARCH',
      albums: 'GET_ALBUMS',
      albumTracks: 'GET_ALBUM_TRACKS',
      searchQuery: 'SEARCH_QUERY',
      initialSearchQuery: 'INITIAL_SEARCH_QUERY',
      bookmarkAlbums: 'BOOKMARK_ALBUMS',
      pageType: 'PAGE_TYPE',
      showRecentSearchBox: 'SHOW_RECENT_SEARCH_BOX',
      isAlbumLoading: 'IS_ALBUM_LOADING',
      isAlbumTracksLoading: 'IS_ALBUM_TRACKS_LOADING',
      searchFailed: 'SEARCH_FAILED',
      settings: 'GET_SETTINGS'
    }),
    showRecentSearchBox () {
      return this.$store.state.showRecentSearchBox
    }
  },
  created () {
    this.$store.dispatch('GET_SETTINGS')
    this.$store.dispatch('GET_RECENT_SEARCH')
    this.$store.dispatch('GET_BOOKMARK_ALBUMS')
  },
  mounted () {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 768) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    }
  },
  methods: {
    searchAlbums (query) {
      if (query) {
        const payload = { 'url': `/api/search?term=${query}&entity=album&media=music`, 'query': query }
        this.$store.dispatch('SEARCH_ALBUMS', payload)
      }
      this.$store.commit('SET_PAGE_TYPE', 'search')
    },
    clearSearch () {
      this.$store.commit('CLEAR_SEARCH')
    },
    toggleRecentSearchBox () {
      if (!this.showRecentSearchBox) {
        window.scrollTo(0, 0)
      }
      this.$store.commit('TOGGLE_RECENT_SEARCH')
    },
    removeRecentSearchItem (item) {
      this.$store.dispatch('REMOVE_RECENT_SEARCH_ITEM', item)
    },
    bookmarkAlbum (album) {
      if (this.isInBookmark(album.collectionCensoredName)) {
        this.$dialog.confirm({
          message: `Are you sure you want to unbookmark this album? <b>${album.collectionCensoredName} album</b>`,
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
            this.$store.dispatch('BOOKMARK_ALBUM', { 'album': album, 'status': 'unbookmarked' })
            this.$toast.open({
              duration: 3000,
              message: `"${album.collectionCensoredName} album" has been unbookmark!`,
              position: 'is-bottom-right',
              type: 'is-danger'
            })
          }
        })
      } else {
        this.$toast.open({
          duration: 3000,
          message: `"${album.collectionCensoredName} album" bookmarked!`,
          position: 'is-bottom',
          type: 'is-info'
        })
        this.$store.dispatch('BOOKMARK_ALBUM', { 'album': album, 'status': 'bookmark' })
      }
    },
    isInBookmark (albumName) {
      return this.bookmarkAlbums.findIndex(album => album.collectionCensoredName === albumName) > -1
    },
    showBookmarks () {
      this.$store.commit('SET_PAGE_TYPE', 'bookmarks')
    },
    updateSettings (settingName, settingValue) {
      const payload = { 'settingName': settingName, 'settingValue': settingValue }
      this.$store.dispatch('UPDATE_SETTINGS', payload)
    },
    showSettingsModal () {
      this.isSettingsModalActive = true
    },
    getAlbumTracks (albumId) {
      if (albumId) {
        this.isAlbumTracksModalActive = true
        const payload = { 'url': `/api/lookup?id=${albumId}&entity=song` }
        this.$store.dispatch('GET_ALBUM_TRACKS', payload)
      }
    },
    setPageType (pageType) {
      if (pageType !== this.pageType) {
        this.$store.commit('SET_PAGE_TYPE', pageType)
      }

      if (pageType === 'search' && this.initialSearchQuery !== this.searchQuery) {
        this.searchAlbums(this.initialSearchQuery)
      }
    },
    resetAlbumTracks () {
      this.$store.commit('RESET_ALBUM_TRACKS')
    },
    replaceArtworkUrlSize (albumArtwork, newSize) {
      return albumArtwork.replace('100x100', newSize)
    }
  }
}
</script>
<style lang="scss">
  // Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #008a94;
$primary-invert: findColorInvert($primary);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";

// transitions
.list-enter-active,
{
  transition: all .5s;
}
.list-leave-active {
  transition: all .5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
   transform: translateY(20px);
}
.fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .component-fade-leave-to
{
  opacity: 0;
}
</style>
