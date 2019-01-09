<template>
    <div class="section">
      <div class="container" style="margin-top:0px;">
        <div class="columns" v-if="isLoading">
          <div class="column loading">
              <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>
          </div>
        </div>
        <div class="columns is-multiline is-mobile" v-if="!isLoading">
             <template v-if="albums.length > 0">
             <div class="column is-6" ><span class="is-size-5 has-text-grey"> Search Results</span></div>
              <div class="column is-6 has-text-right "><span class="has-text-grey-light is-size-6"> {{albums.length}} results </span></div>
            </template>
            <div class="column is-2-widescreen is-3-desktop is-4-tablet " v-for="(album, index) in displayedAlbums" :key="index">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img :src="album.artworkUrl100" :alt="album.collectionCensoredName">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <div class="title is-5 album-name">{{album.collectionCensoredName}}</div>
                      <div class="subtitle is-6">{{album.artistName}} <br>
                      <span class="has-text-grey-light">{{album.primaryGenreName}}</span></div>
                    </div>
                  </div>
                </div>
                 <footer class="card-footer">
                    <a :href="album.collectionViewUrl" target="_blank" class="card-footer-item">
                      <b-tooltip type="is-light" label="visit itunes page" position="is-top">
                      <i class="fas fa-external-link-alt"></i>
                        </b-tooltip>
                    </a>
                    <span class="heart card-footer-item">
                      <b-tooltip type="is-light" label="Bookmark" position="is-top">
                        <i @click="onClickBookmarkAlbum(album)" class="fas fa-heart fa-lg" :class="isInBookmark(album.collectionCensoredName)"></i>
                      </b-tooltip>
                    </span>
                  </footer>
              </div>
            </div>
            <div class="column is-12" v-if="albums.length > 0">
              <hr>
              <b-pagination
                  :total="albums.length"
                  :current.sync="current"
                  :order="order"
                  :size="size"
                  :simple="isSimple"
                  :rounded="isRounded"
                  :per-page="perPage">
              </b-pagination>
            </div>
          </div>
          <div class="columns is-multiline is-mobile is-centered" v-if="searchFailed">
             <div class="column "><h3 class="title is-3 has-text-centered">Nothing found. <br> Please Search Again</h3> </div>
          </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AlbumList',
  data () {
    return {
      current: 1,
      perPage: 15,
      order: 'is-centered',
      size: '',
      isSimple: false,
      isRounded: false
    }
  },
  props: {
    albums: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'IS_LOADING',
      searchFailed: 'SEARCH_FAILED',
      bookmarkAlbums: 'BOOKMARK_ALBUMS'
    }),
    displayedAlbums () {
      return this.paginate(this.albums)
    }
  },
  methods: {
    paginate (albums) {
      let current = this.current
      let perPage = this.perPage
      let from = (current * perPage) - perPage
      let to = (current * perPage)
      return albums.slice(from, to)
    },
    onClickBookmarkAlbum (album) {
      this.$emit('clickBookmarkAlbum', album)
    },
    isInBookmark (albumName) {
      const inBookmark = this.bookmarkAlbums.findIndex(album => album.collectionCensoredName === albumName) > -1
      return inBookmark ? 'favorite' : ''
    }
  }
}
</script>

<style scoped>
.loading {
  padding-top:50px;
  height: 300px;
}
.card-content {
  padding:1rem !important;
}
.media-content {
  width:180px !important;
}
.media-content div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.album-name {
  font-size: 1.05rem !important;
}
.fa-heart {
  cursor: pointer;
  color: rgb(255, 159, 159);
}
.fa-heart:hover {
  color: rgb(255, 21, 21);
}
.favorite {
  color: rgb(255, 21, 21);
}
</style>
