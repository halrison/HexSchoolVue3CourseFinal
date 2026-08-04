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
                    <router-link to="/articles" class="text-muted nav-link" @click="toggleShow">
                        <i class="bi bi-newspaper mx-1"></i>
                        文章
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/login" class="text-muted nav-link" @click="toggleShow">
                        <i class="bi bi-box-arrow-in-right mx-1"></i>
                        登入
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/products" class="text-muted nav-link" @click="toggleShow">
                        <font-awesome-icon icon="fa-brands fa-product-hunt" class="mx-1" />
                        商品
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/order" class="text-muted nav-link" @click="toggleShow">
                        <i class="bi bi-sticky mx-1"></i>
                        訂單
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/cart" class="text-muted nav-link position-relative" @click="toggleShow">
                        <i class="bi bi-cart mx-1"></i>
                        <span class="position-absolute top-0 start-10 translate-middle badge rounded-pill bg-danger text-dark" v-show="cartQty>0">{{ cartQty }}</span>
                        購物車
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>
<script>
    import {Collapse} from "bootstrap"
    import CartStore from "@/stores/carts.js";
    export default {
        name: 'HeaderComponent',
        // 現在從 mixin 的 cartList 計算數量，避免父元件傳遞不同步
        mixins: [CartStore],
        inject: ['emitter'],
        computed: {
            cartQty () {
                return this.cartList?.length || 0
            }
        },
        methods: {
            toggleShow () {
                if (!this.isDesktop) this.collapse.toggle()
            },
            handleResize () {
                this.isDesktop = window.innerWidth >= 992
                if (this.isDesktop) this.isActive = false
            }
        },
        data () {
            return {
                isActive: false,
                isDesktop: window.innerWidth >= 992,
                collapse: null
            }
        },
        mounted () {
            this.collapse = new Collapse(
                this.$refs.navbarToggleExternalContent,
                {toggle: false}
            )
            // 先取得一次購物車資料，並監聽 refresh-cart 事件
            this.getCarts()
            this.emitter.on('refresh-cart', this.getCarts)
            window.addEventListener('resize', this.handleResize)
        },
        beforeUnmount () {
            window.removeEventListener('resize', this.handleResize)
            // 移除事件監聽
            if (this.emitter?.off) this.emitter.off('refresh-cart', this.getCarts)
        }
    };
</script>