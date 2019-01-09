<template>
  <nav class="navbar is-gradient" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand is-inline-flex-mobile is-inline-flex-tablet">
        <a class="navbar-item " href="/">
          <h2 class="is-size-3">Vue iTunes</h2>
        </a>
      </div>
      <div class="navbar-end is-inline-flex-mobile is-inline-flex-tablet">
        <div class="navbar-item">
          <div class="buttons">
            <span class="icon is-large" v-if="recentSearch.length > 0">
              <b-tooltip type="is-light" label="Recent Search" position="is-bottom">
                <i @click="onClickToggleRecentSearchBox" class="fas fa-history fa-2x" :class="{'icon-active': showRecentSearchBox}"></i>
              </b-tooltip>
            </span>
            <span class="icon is-large">
              <b-tooltip type="is-light" label="Bookmarks" position="is-bottom">
                <i @click="onClickShowBookmarks" class="fas fa-heart fa-2x"></i>
              </b-tooltip>
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheNavbar',
  computed: {
    recentSearch () {
      return this.$store.state.recentSearch
    },
    showRecentSearchBox () {
      return this.$store.state.showRecentSearchBox
    }
  },
  methods: {
    onClickToggleRecentSearchBox () {
      this.$emit('clickToggleRecentSearchBox')
    },
    onClickShowBookmarks () {
      this.$emit('clickShowBookmarks')
    }
  }
}
</script>

<style scoped >
.fas {
  color: #ccc;
}
.fas:hover {
  color: #fff;
}
.icon-inactive {
  color: #ccc;
}
.icon-active {
  color: #fff !important;
}
.is-gradient {
  background-color: #008a94 !important;
  background-image: linear-gradient(326deg, #00c8d6, #008a94 94%) !important;
}
.navbar-item {
  color: #fff !important;
}
.navbar-end {
    -webkit-box-pack: end !important;
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
}
</style>
