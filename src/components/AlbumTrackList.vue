<template>
<div  class="modal-card" style="width: auto; max-width: 980px; height: auto; max-height: 700px"  >
    <header class="modal-card-head">
      <p class="modal-card-title" v-if="albumInfo"><strong>{{albumInfo.collectionCensoredName}} album</strong></p>
    </header>
  <section class="modal-card-body">
      <div class="columns is-multiline">
        <div v-if="albumInfo" class="column is-12">
          <article class="media media-modal">
            <figure class="media-left">
              <p class="image">
                <img v-if="albumInfo.artworkUrl100" :src="replaceArtworkUrlSize(albumInfo.artworkUrl100, '130x130')">
              </p>
            </figure>
            <div class="media-content">
              <div class="content" v-if="albumInfo">
                  {{ albumInfo.artistName}} <br>
                  {{ albumInfo.primaryGenreName}} <br>
                  {{albumInfo.trackCount}} Songs<br>
                  <span class="has-text-grey-light" v-if="albumInfo.releaseDate">Release: {{albumInfo.releaseDate | moment("dddd, MMMM Do YYYY") }}</span>
              </div>
              <div class="level is-mobile">
                    <div class="level-left">
                      <a  class="level-item" :href="albumInfo.collectionViewUrl" target="_blank">
                        <b-tooltip type="is-light" label="Download on iTunes" position="is-top" :active="!isMobile">
                          <i class="fab fa-itunes-note"></i>
                        </b-tooltip>
                      </a>
                      <a class="level-item">
                        <b-tooltip type="is-light" :label="isInBookmark(albumInfo.collectionCensoredName) ? 'click to unbookmarked' : 'click to bookmark'" position="is-top" :active="!isMobile">
                          <i @click="clickBookmarkAlbum(albumInfo)" class="fas bookmarkIcon" :class="[{'favorite': isInBookmark(albumInfo.collectionCensoredName)}, settings.bookmarkIcon]"></i>
                        </b-tooltip>
                      </a>
                      <a v-if="settings.youtubeLink === 'true'" class="level-item" :href="`https://www.youtube.com/results?search_query=${albumInfo.artistName} - ${albumInfo.collectionCensoredName}`" target="_blank">
                        <b-tooltip type="is-light" label="search on youtube" position="is-top" :active="!isMobile">
                          <i class="fab fa-youtube"></i>
                        </b-tooltip>
                      </a>
                    </div>
                  </div>
            </div>
          </article>
        </div>
        <div class="column is-12"  >
          <b-table :data="albumTrackList"  >
               <template slot-scope="props">
                 <b-table-column field="track_number" label="Number" >
                    {{ props.row.trackNumber }}
                </b-table-column>
                <b-table-column field="track_title" label="Track Title" >
                    {{ props.row.trackName }}
                </b-table-column>
                <b-table-column field="track_duration" label="Duration" centered>
                    {{  millisToMinutesAndSeconds(props.row.trackTimeMillis) }}
                </b-table-column>
                <b-table-column field="itunes_link" label="iTunes Link" centered>
                  <a :href="props.row.trackViewUrl" target="_blank">
                    <b-tooltip type="is-light" label="Download on iTunes" position="is-top" :active="!isMobile">
                      <i class="fab fa-itunes-note"></i>
                    </b-tooltip>
                  </a>
                </b-table-column>
                <b-table-column  v-if="settings.youtubeLink === 'true'"  field="youtube_search" label="Youtube Search" centered>
                  <a v-if="settings.youtubeLink === 'true'"  :href="`https://www.youtube.com/results?search_query=${props.row.artistName} - ${props.row.trackName}`" target="_blank">
                    <b-tooltip type="is-light" label="search on youtube" position="is-top" :active="!isMobile">
                      <i class="fab fa-youtube"></i>
                    </b-tooltip>
                  </a>
                </b-table-column>
               </template>
          </b-table>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'TrackList',
  props: {
    albumTracks: {
      type: Array,
      required: true
    },
    replaceArtworkUrlSize: {
      type: Function,
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    isMobile: {
      type: Boolean,
      required: true
    },
    clickBookmarkAlbum: {
      type: Function,
      required: true
    },
    isInBookmark: {
      type: Function,
      required: true
    }
  },
  mounted () {
    this.showAlbumInfo()
    this.showAlbumTrackList()
  },
  methods: {
    showAlbumTrackList () {
      this.albumTracks.shift()
      this.albumTrackList = this.albumTracks
    },
    showAlbumInfo () {
      this.albumInfo = this.albumTracks[0]
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
      this.showAlbumTrackList()
    },
    millisToMinutesAndSeconds (millis) {
      const minutes = Math.floor(millis / 60000)
      const seconds = ((millis % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  },
  data () {
    return {
      albumInfo: {},
      albumTrackList: []
    }
  }
}
</script>

<style>
.media-wrap .media-left {
  width:130px;
  height:130px;
}
.card-image, .media-left {
  background: url('./../../public/images/200w_s.gif') 50% no-repeat !important;
}
</style>
