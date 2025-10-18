<template>
  <router-view />
</template>
<script>
  import { emitter } from './util'
  export default {
    name: 'App',
    provide () {
      return { emitter }
    }
  }
</script>
<style lang="scss">
  @import './assets/style/all';
</style>