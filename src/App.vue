<template>
  <div id="app">
    <the-navbar></the-navbar>
    <the-searchbar @clickSearch="searchAlbums" @clickClearSearch="clearSearch"></the-searchbar>
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import TheSearchbar from './components/TheSearchbar'
export default {
  name: 'app',
  components: {
    TheNavbar,
    TheSearchbar
  },
  methods: {
    searchAlbums (query) {
      this.$store.dispatch('SEARCH_ALBUMS', query)
    },
    clearSearch () {
      this.$store.commit('CLEAR_SEARCH')
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
