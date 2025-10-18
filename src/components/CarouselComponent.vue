<template>
  <div ref="DOM" class="carousel carousel-dark slide">
    <div class="carousel-inner ">
      <slot :items="items"></slot>
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
<script>
  import { Carousel } from "bootstrap";
  export default {
    name: "CarouselComponent",
    props: {
      items: {
        type: Array,
        required: true,
      },
    },
    data () {
      return {
        carousel: null,
      };
    },
    mounted () {
      this.carousel = new Carousel( this.$refs.DOM, {
        interval: 3000,
        ride: "carousel",
        pause: "hover",
        wrap: true,
        touch: true,
      } );
    },
    methods: {
      next () {
        this.carousel.next();
      },
      prev () {
        this.carousel.prev();
      },
    },
  };
</script>