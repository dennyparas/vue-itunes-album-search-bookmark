<template>
  <div class="modal-card" style="width: auto; max-width: 480px;" >
    <header class="modal-card-head">
      <p class="modal-card-title">Settings</p>
    </header>
    <section class="modal-card-body">
      <div class="columns is-multiline">
        <div class="column is-6">
          <label>Initial Search Query</label>
        </div>
        <div class="column is-6">
          <b-input v-model="settings.initialSearchQuery"></b-input>
        </div>
        <div class="column is-6">
          <label>Panel Type</label>
        </div>
        <div class="column is-6">
          <b-field>
                <b-radio-button v-model="settings.panelType"
                    native-value="card"
                    type="is-primary">
                    <b-icon pack="fas" icon="th"></b-icon>
                    <span>Card</span>
                </b-radio-button>
                <b-radio-button v-model="settings.panelType"
                    native-value="media"
                    type="is-primary">
                    <b-icon pack="fas" icon="th-list"></b-icon>
                    <span>Media</span>
                </b-radio-button>
          </b-field>
        </div>
        <div class="column is-6">
          <label>Bookmark Icon</label>
        </div>
        <div class="column is-6">
          <b-field>
                <b-radio-button v-model="settings.bookmarkIcon"
                    native-value="fa-heart"
                    type="is-primary">
                    <b-icon pack="fas" icon="heart"></b-icon>
                    <span>Heart</span>
                </b-radio-button>
                <b-radio-button v-model="settings.bookmarkIcon"
                    native-value="fa-star"
                    type="is-primary">
                    <b-icon pack="fas" icon="star"></b-icon>
                    <span>Star</span>
                </b-radio-button>
          </b-field>
          </div>
        <div class="column is-6">
          <label>Search on youtube icon</label>
        </div>
        <div class="column is-6">
            <b-field>
                  <b-radio-button v-model="settings.youtubeLink"
                      native-value="true"
                      type="is-primary">
                      <b-icon pack="fas" icon="check"></b-icon>
                      <span>Show</span>
                  </b-radio-button>
                  <b-radio-button v-model="settings.youtubeLink"
                      native-value="false"
                      type="is-primary">
                      <b-icon pack="fas" icon="times"></b-icon>
                      <span>Hide</span>
                  </b-radio-button>
            </b-field>
        </div>
        <div class="column is-6">
          <label>Search Results Per Page</label>
        </div>
        <div class="column is-6">
          <b-field>
            <b-radio-button v-model="settings.perPage"
                native-value="20"
                type="is-primary">
                <span>20</span>
            </b-radio-button>
            <b-radio-button v-model="settings.perPage"
                native-value="40"
                type="is-primary">
                <span>40</span>
            </b-radio-button>
            <b-radio-button v-model="settings.perPage"
                native-value="60"
                type="is-primary">
                <span>60</span>
            </b-radio-button>
          </b-field>
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
  name: 'TheSettings',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  watch: {
    'settings.panelType' (settingValue) {
      this.onClickUpdateSettings('panelType', settingValue)
    },
    'settings.bookmarkIcon' (settingValue) {
      this.onClickUpdateSettings('bookmarkIcon', settingValue)
    },
    'settings.youtubeLink' (settingValue) {
      this.onClickUpdateSettings('youtubeLink', settingValue)
    },
    'settings.perPage' (settingValue) {
      this.onClickUpdateSettings('perPage', settingValue)
    },
    'settings.initialSearchQuery' (settingValue) {
      this.onClickUpdateSettings('initialSearchQuery', settingValue)
    }
  },
  methods: {
    onClickUpdateSettings (settingName, settingValue) {
      this.$emit('clickUpdateSettings', settingName, settingValue)
    }
  }
}
</script>

<style>
</style>
