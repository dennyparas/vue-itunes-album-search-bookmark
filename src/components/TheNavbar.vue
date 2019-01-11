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
                <span class="badge" v-if="recentSearch.length > 0">{{recentSearch.length}}</span>
              </b-tooltip>
            </span>
            <span class="icon is-large">
              <b-tooltip type="is-light" label="Bookmarks" position="is-bottom">
                <i @click="onClickShowBookmarks" class="fas fa-heart fa-2x" :class="{'icon-active': pageType === 'bookmarks'}"></i>
                <span class="badge" v-if="bookmarkAlbums.length > 0">{{bookmarkAlbums.length}}</span>
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
  props: {
    showRecentSearchBox: {
      type: Boolean,
      required: true
    },
    recentSearch: {
      type: Array,
      required: true
    },
    pageType: {
      type: String,
      required: true
    },
    bookmarkAlbums: {
      type: Array,
      required: true
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
.badge {
  position: absolute;
    right: -11px;
    top: -5px;
    display: inline-block;
    min-width: 19px;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: bold;
    color: #FFF;
    line-height: 1.43;
    vertical-align: text-top;
    white-space: nowrap;
    text-align: center;
    text-shadow: none;
    background-clip: padding-box;
    background-color: #EC5252;
    border: none;
    border-radius: 15px;
    z-index: 1;
}
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
