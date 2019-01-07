<template>
  <section class="section searchbar">
    <div class="container">
      <b-field>
        <b-autocomplete size="is-medium"
        expanded
          v-model="searchQuery"
          :data="filteredDataArray"
          placeholder="e.g. Eminem"
          icon="magnify"
          @select="option => selected = option"
        ></b-autocomplete>
        <p class="control" v-if="searchQuery">
               <button @click="clearSearchQuery" class="button  is-medium "><i class="fas fa-times"></i></button>
            </p>
      </b-field>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TheSearchbar',
  data () {
    return {
      data: [],
      searchQuery: '',
      selected: null
    }
  },
  computed: {
    filteredDataArray () {
      return this.data.filter(option => {
        return (
          option
            .toString()
            .toLowerCase()
            .indexOf(this.searchQuery.toLowerCase()) >= 0
        )
      })
    }
  },
  methods: {
    clearSearchQuery () {
      this.searchQuery = ''
    }
  }
}
</script>

<style>
.searchbar {
  padding: 1rem 1.5rem!important;
  width: 100%;
  position: absolute;
  box-shadow: 0 0 70px 0 rgba(0, 0, 0, 0.3);
  background: #fff;
  opacity: 0.97;
}
</style>
