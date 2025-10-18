<template>
  <div ref="DOM" class="carousel carousel-dark slide">
    <div class="carousel-inner ">
      <slot :items="prop.items"></slot>
    </div>
    <button class="carousel-control-prev" type="button" @click="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" @click="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script setup>
  import { onMounted, ref } from "vue"
  import { Carousel } from "bootstrap"

  const DOM = ref(null)
  const prop = defineProps(['items'])
  let carousel

  onMounted(function () {
    carousel = new Carousel(
      DOM.value,
      {
        ride: 'carousel'
      }
    )
  })

  function prev () { 
    carousel.prev()
  }
  function next () {
    carousel.next()
  }
</script>