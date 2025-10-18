<template>
  <div class="card ">
    <img :src="product.imageUrl" class="card-img-top" :alt="product.title">
    <slot name="header"></slot>
    <slot name="body"></slot>
    <slot name="footer"></slot>
  </div>
</template>
<script setup>
import { ref } from "vue"

const prop=defineProps(['product'])
const product = ref(prop.product)
</script>