<template>
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <span class="p-2 me-2 d-inline-block badge rounded-pill" :class="`bg-${props.msg.type || 'secondary'}`"></span>
            <strong class="me-auto">{{ props.msg.title }}</strong>
            <small class="text-muted">{{ new Date().toLocaleDateString() }}</small>
        </div>
        <div class="toast-body">{{ displayMessage }}</div>
    </div>
</template>
<script setup>
    import {computed} from "vue"

    const props = defineProps({
        msg: {
            type: Object,
            default: () => ({})
        }
    })

    const displayMessage = computed(() => props.msg?.content ?? props.msg?.message ?? '')
</script>
