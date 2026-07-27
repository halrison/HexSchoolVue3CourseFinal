<template>
    <router-view />
</template>
<script setup>
    import {provide} from "vue"
    import {http} from './util'
    import useMessageStore from '@/stores/messages'
    const messageStore = useMessageStore()
    provide('http', http)
    provide('message', messageStore)
</script>
<style lang="scss">
    @import './assets/style/all';
</style>