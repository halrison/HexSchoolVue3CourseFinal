<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
            <li class="page-item" v-if="currentPagination.has_pre">
                <a class="page-link" aria-label="Previous" @click.prevent="changePage('prev')">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" v-for="page in currentPagination.total_pages" v-bind:class="{ 'active': page === currentPagination.current_page }" v-bind:key="page">
                <a class="page-link" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" v-if="currentPagination.has_next">
                <a class="page-link" aria-label="Next" @click.prevent="changePage('next')">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>
<script setup>
    import {reactive,watchEffect} from 'vue'
    const emit = defineEmits(['paginate'])
    const props = defineProps(['pagination'])
    const currentPagination = reactive({})
    const changePage = page => {
        let targetPage
        if (page === 'prev') targetPage = currentPagination.current_page - 1
        else if (page === 'next') targetPage = currentPagination.current_page + 1
        else targetPage = page
        emit('paginate', targetPage)
    }
    watchEffect(()=> {Object.assign(currentPagination, props.pagination)}
    )
</script>