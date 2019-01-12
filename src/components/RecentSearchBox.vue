<template>
  <section>
    <div class="container">
      <div class="columns is-centered">
        <div class="column" :class="searchBoxResize">
          <div class="tag-wrap">
            <div class="title block is-6 has-text-grey-light has-text-centered">Search History</div>
            <b-field  grouped group-multiline class="has-text-centered">
            <div class="control" v-for="(item, i) in recentSearch" :key="i">
                  <b-tag type="is-primary"
                  size="is-small"
                      closable
                      @close="onClickRemoveRecentSearchItem(item)">
                      <span @click="onClickSearchItem(item)" style="cursor: pointer;"> {{item}} </span>
                  </b-tag>
              </div>
          </b-field>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RecentSearch',
  props: {
    recentSearch: {
      type: Array,
      required: true
    }
  },
  computed: {
    searchBoxResize () {
      return {
        'is-3': this.recentSearch.length > 0 && this.recentSearch.length <= 3,
        'is-5': this.recentSearch.length >= 4 && this.recentSearch.length <= 8,
        'is-8': this.recentSearch.length >= 9
      }
    }
  },
  methods: {
    onClickRemoveRecentSearchItem (item) {
      this.$emit('clickRemoveRecentSearchItem', item)
    },
    onClickSearchItem (item) {
      if (item !== this.$store.state.settings.searchQuery) {
        this.$emit('clickSearchItem', item)
      }
    }
  }
}
</script>

<style>
.tag-wrap {
  margin-top:20px;
  padding:10px 15px;
  background: #fff;
  border: 1px solid rgb(231, 231, 231);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

</style>
