<template>
  <div id="app">
    <the-navbar></the-navbar>
    <the-searchbar></the-searchbar>
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import TheSearchbar from './components/TheSearchbar'
export default {
  name: 'app',
  components: {
    TheNavbar,
    TheSearchbar
  }
}
</script>
