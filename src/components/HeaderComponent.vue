<template>
    <header class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
        <a href="/#/" class="navbar-brand" @click="collapse.hide()">
            <img src="@/assets/images/apple-icon.png" width="30" height="24" class="ms-1" />
        </a>
        <button class="navbar-toggler me-1" type="button" @click="collapse.toggle()">
            <span class="navbar-toggler-icon"></span>
        </button>
        <nav class="collapse  navbar-collapse w-100" ref="navbarToggleExternalContent"
             v-bind:class="isActive || isDesktop ? 'show' : ''">
            <ul class="navbar-nav nav-pills">
                <li class="nav-item">
                    <router-link to="/articles" class="text-opacity-75 nav-link" @click="toggleShow">
                        <i class="bi bi-newspaper mx-1"></i>
                        文章
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/login" class="text-opacity-75 nav-link" @click="toggleShow">
                        <i class="bi bi-box-arrow-in-right mx-1"></i>
                        登入
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/products" class="text-opacity-75 nav-link" @click="toggleShow">
                        <font-awesome-icon icon="fa-brands fa-product-hunt" class="mx-1" />
                        商品
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/order" class="text-opacity-75 nav-link" @click="toggleShow">
                        <i class="bi bi-sticky mx-1"></i>
                        訂單
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/cart" class="text-opacity-75 nav-link position-relative" @click="toggleShow">
                        <i class="bi bi-cart mx-1"></i>
                        <span class="position-absolute top-0 start-10 translate-middle badge rounded-pill bg-danger text-dark" v-show="cartStore.carts?.length">{{ cartStore.carts.length }}</span>
                        購物車
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>
<script setup>
    import {ref,onBeforeMount,onMounted,onBeforeUnmount,useTemplateRef} from "vue"
    import {Collapse} from "bootstrap"
    import useCartStore from'@/stores/carts'
    const cartStore = useCartStore()
    const isActive = ref(false)
    const isDesktop = ref(false)
    const collapse = ref(null)
    const navbarToggleExternalContent=useTemplateRef("navbarToggleExternalContent")
    const handleResize = () => {
        isDesktop.value = window.innerWidth >= 992
        if (isDesktop.value) isActive.value = false
    }
    const toggleShow = () => {if (!isDesktop.value) collapse.value.toggle()}
    const updateCart = () => {
        cartStore.getCarts()
    }
    onBeforeMount(() => {
        updateCart()
        isDesktop.value = window.innerWidth >= 992
    })
    onMounted(() => {
        collapse.value = new Collapse(
            navbarToggleExternalContent.value,
            {toggle: false}
        )
        window.addEventListener('resize', handleResize)
        window.addEventListener('storage', updateCart)
    })
    onBeforeUnmount(() => {
        window.removeEventListener('storage', updateCart)
        window.removeEventListener('resize', handleResize)
    })
</script>