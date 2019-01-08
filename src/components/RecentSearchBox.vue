<template>
  <section>
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="tag-wrap ">
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
  methods: {
    onClickRemoveRecentSearchItem (item) {
      this.$emit('clickRemoveRecentSearchItem', item)
    },
    onClickSearchItem (item) {
      this.$emit('clickSearchItem', item)
    }
  }
}
</script>

<style>
.tag-wrap {
  margin-top:20px;
  padding:20px;
  background: #fff;
      border: 1px solid rgb(231, 231, 231);
    border-radius: 4px;
}

</style>
