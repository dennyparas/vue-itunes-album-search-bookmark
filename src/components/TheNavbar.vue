<template>
  <nav class="navbar is-gradient" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand is-inline-flex-mobile is-inline-flex-tablet">
        <div class="navbar-item" @click="onClickTitle">
          <h2 class="is-size-3-desktop is-size-4-mobile">Vue iTunes</h2>
        </div>
      </div>
      <div class="navbar-end is-inline-flex-mobile is-inline-flex-tablet">
        <div class="navbar-item">
          <div class="buttons">
            <div class="icon is-large nav-icon" v-if="recentSearch.length > 0">
              <b-tooltip type="is-light" :label="`${recentSearch.length} recent search`" position="is-bottom" :active="!isMobile" >
                <i @click="onClickToggleRecentSearchBox" class="fas fa-history fa-2x" :class="{'icon-active': showRecentSearchBox}"></i>
              </b-tooltip>
              <span class="badge" v-if="recentSearch.length > 0">{{recentSearch.length}}</span>
            </div>
            <span class="icon is-large nav-icon">
              <b-tooltip v-if="pageType === 'bookmarks' || isMobile || bookmarkAlbums.length === 0" type="is-light" :label="`${bookmarkAlbums.length} album bookmarks`" position="is-bottom" :active="!isMobile" >
                <i @click="onClickShowBookmarks" class="fas fa-2x" :class="[{'icon-active': pageType === 'bookmarks'}, settings.bookmarkIcon]"></i>
              </b-tooltip>
              <!-- Dropdown -->
              <b-dropdown v-else hoverable position="is-bottom-left">
                <i slot="trigger" @click="onClickShowBookmarks" class="fas fa-2x" :class="[{'icon-active': pageType === 'bookmarks'}, settings.bookmarkIcon]"></i>
                  <b-dropdown-item  v-for="(album, index) in latestBookmarkAlbums" :key="index" @click="onClickAlbumName(album.collectionId)" >
                    <article class="media">
                      <figure class="media-left">
                         <p class="image is-64x64 ">
                        <img :src="album.artworkUrl100">
                        </p>
                      </figure>
                      <div class="media-content  overflow-content">
                        <div class="content ">
                          <p>
                            <strong>{{album.collectionCensoredName}}</strong>
                            <br>
                            {{album.artistName}}
                          </p>
                        </div>
                      </div>
                    </article>
                  </b-dropdown-item>
                  <b-dropdown-item class="has-text-centered" v-if="bookmarkAlbums.length > 5" @click="onClickShowBookmarks">View All </b-dropdown-item>
              </b-dropdown>
              <span class="badge" v-if="bookmarkAlbums.length > 0">{{bookmarkAlbums.length}}</span>
            </span>
            <span class="icon is-large nav-icon">
              <b-tooltip type="is-light" label="Settings" position="is-bottom" :active="!isMobile">
                <i @click="onClickSettings" class="fas fa-cog fa-2x"></i>
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
    },
    settings: {
      type: Object,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    latestBookmarkAlbums () {
      return this.bookmarkAlbums.slice(0, 5)
    }
  },
  methods: {
    onClickToggleRecentSearchBox () {
      this.$emit('clickToggleRecentSearchBox')
    },
    onClickShowBookmarks () {
      this.$emit('clickShowBookmarks')
    },
    onClickSettings () {
      this.$emit('clickSettings')
    },
    onClickTitle () {
      this.$emit('clickTitle')
    },
    onClickAlbumName (albumId) {
      this.$emit('clickAlbumName', albumId)
    }

  }
}
</script>

<style scoped >
a.dropdown-item {
  padding-right: 1rem ;
  border-bottom: 1px solid #ccc;
}
img {
  max-height: 100px !important;
}
.navbar-item {
  cursor: pointer
}
.badge {
  position: absolute;
    right: -2px;
    top: 4px;
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
.nav-icon {
  position: relative;
  margin-left: 10px
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
