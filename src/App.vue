<template>
  <div id="app">
    <the-navbar @clickToggleRecentSearchBox="toggleRecentSearchBox"></the-navbar>
    <the-searchbar @clickSearch="searchAlbums" @clickClearSearch="clearSearch"></the-searchbar>
    <recent-search-box v-if="showRecentSearchBox && recentSearch.length > 0" :recentSearch="recentSearch" @clickSearchItem="searchAlbums" @clickRemoveRecentSearchItem="removeRecentSearchItem"></recent-search-box>
    <album-list @clickBookmarkAlbum="bookmarkAlbum" :albums="albums"></album-list>
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import TheSearchbar from './components/TheSearchbar'
import RecentSearchBox from './components/RecentSearchBox'
import AlbumList from './components/AlbumList'
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  components: {
    TheNavbar,
    TheSearchbar,
    RecentSearchBox,
    AlbumList
  },
  computed: {
    ...mapGetters({
      recentSearch: 'GET_RECENT_SEARCH',
      albums: 'GET_ALBUMS'
    }),
    showRecentSearchBox () {
      return this.$store.state.showRecentSearchBox
    }
  },
  created () {
    this.$store.dispatch('GET_RECENT_SEARCH')
  },
  methods: {
    searchAlbums (query) {
      this.$store.dispatch('SEARCH_ALBUMS', query)
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
    bookmarkAlbum (album) {
      console.log('test', album)
      this.$store.dispatch('BOOKMARK_ALBUM', album)
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
</style>
