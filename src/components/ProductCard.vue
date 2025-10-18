<template>
  <div class="card">
    <slot name="header"></slot>
    <img class="img-fluid" :src="product.imageUrl" :alt="product.title">
    <slot name="body"></slot>
    <slot name="footer"></slot>
  </div>
</template>
<script>
  export default {
    name: 'ProductCard',
    props: ['product']
  }
</script>