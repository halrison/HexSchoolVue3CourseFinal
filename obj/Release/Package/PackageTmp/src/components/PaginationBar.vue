<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item" v-if="pagination.has_pre">
        <a class="page-link"  aria-label="Previous" @click.prevent="changePage('prev')">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="page in pagination.total_pages" :class="{ 'active': page === pagination.current_page }">
        <a class="page-link"  @click.prevent="changePage(page)">{{ page }}</a>
      </li>
      <li class="page-item" v-if="pagination.has_next">
        <a class="page-link" aria-label="Next" @click.prevent="changePage('next')">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import useProductStore from "@/stores/products"
import useOrderStore from "@/stores/orders"
import useCouponStore from "@/stores/coupons"
import { ref, watch } from "vue"

const prop=defineProps(['pagination'])
const pagination = ref({})
const emit = defineEmits(['paginate'])

watch(
  ()=>prop.pagination,
  function(newValue){ pagination.value = newValue },
  { deep: true }
)

function changePage(page){ 
  switch (page) {
    case 'prev':
      pagination.value.current_page--
      break
    case 'next':
      pagination.value.current_page++
      break
    default: 
      pagination.value.current_page = page
      break
  }
  emit("paginate", pagination.value.current_page) 
}
</script>