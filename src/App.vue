<template>
  <div id="app">
    <the-navbar
      @clickToggleRecentSearchBox="toggleRecentSearchBox"
      @clickShowBookmarks="showBookmarks"
      @clickSettings="showSettingsModal"
      @clickTitle="setPageType('search')"
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
    <recent-search-box
      v-if="showRecentSearchBox && recentSearch.length > 0"
      :recentSearch="recentSearch"
      @clickSearchItem="searchAlbums"
      @clickRemoveRecentSearchItem="removeRecentSearchItem">
      </recent-search-box>
      <album-list
        @clickBookmarkAlbum="bookmarkAlbum"
        @clickUpdateSettings="updateSettings"
        :albums="pageType === 'search' ? albums: bookmarkAlbums"
        :pageType="pageType"
        :isLoading="isLoading"
        :searchFailed="searchFailed"
        :bookmarkAlbums="bookmarkAlbums"
        :settings="settings"
        :isMobile="isMobile"
        >
        </album-list>
      <b-modal
        :active.sync="isSettingsModalActive"
        :canCancel=false has-modal-card >
        <the-settings
          :settings="settings"
          @clickUpdateSettings="updateSettings">
        </the-settings>
      </b-modal>
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import TheSearchbar from './components/TheSearchbar'
import RecentSearchBox from './components/RecentSearchBox'
import AlbumList from './components/AlbumList'
import TheSettings from './components/TheSettings'
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      isSettingsModalActive: false,
      isMobile: false,
      windowWidth: window.innerWidth
    }
  },
  components: {
    TheNavbar,
    TheSearchbar,
    RecentSearchBox,
    AlbumList,
    TheSettings
  },
  computed: {
    ...mapGetters({
      recentSearch: 'GET_RECENT_SEARCH',
      albums: 'GET_ALBUMS',
      searchQuery: 'SEARCH_QUERY',
      bookmarkAlbums: 'BOOKMARK_ALBUMS',
      pageType: 'PAGE_TYPE',
      showRecentSearchBox: 'SHOW_RECENT_SEARCH_BOX',
      isLoading: 'IS_LOADING',
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
    if (this.windowWidth <= 768) {
      this.isMobile = true
    }

    window.onresize = () => {
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
        const payload = { 'url': `/api/search?term=${query}&entity=album`, 'query': query }
        this.$store.dispatch('SEARCH_ALBUMS', payload)
      }
      this.$store.commit('SET_PAGE_TYPE', 'search')
    },
    clearSearch () {
      this.$store.commit('CLEAR_SEARCH')
    },
    toggleRecentSearchBox () {
      this.$store.commit('TOGGLE_RECENT_SEARCH')
    },
    removeRecentSearchItem (item) {
      this.$store.dispatch('REMOVE_RECENT_SEARCH_ITEM', item)
    },
    bookmarkAlbum (album, status) {
      const payload = { 'album': album, 'status': status }
      this.$store.dispatch('BOOKMARK_ALBUM', payload)
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
    setPageType (pageType) {
      if (pageType !== this.pageType) {
        this.$store.commit('SET_PAGE_TYPE', pageType)
      }
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

</style>
