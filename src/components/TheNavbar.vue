<template>
  <nav class="navbar is-gradient" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <h2 class="is-size-3">Vue iTunes</h2>
        </a>
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <span class="icon is-large">
              <b-tooltip type="is-light" label="Recent Search" position="is-bottom">
                <i @click="showRecentSearch" class="fas fa-history fa-2x"></i>
              </b-tooltip>
            </span>
            <span class="icon is-large">
              <b-tooltip type="is-light" label="Bookmark" position="is-bottom">
                <i @click="showBookmarks" class="fas fa-heart fa-2x"></i>
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
  methods: {
    showBookmarks () {
      console.log('show bookmarks')
    },
    showRecentSearch () {
      console.log('show recent search')
    }
  }
}
</script>

<style >
.is-gradient {
  background-color: #008a94 !important;
  background-image: linear-gradient(326deg, #00c8d6, #008a94 94%) !important;
}
.navbar-item {
  color: #fff !important;
}
</style>
