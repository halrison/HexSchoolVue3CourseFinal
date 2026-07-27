<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top h-100 d-flex flex-lg-column">
        <span class="navbar-brand me-0">
            <img src="@\assets\images\apple-icon.png" width="30" height="30" />
            後臺管理系統
        </span>
        <button class="navbar-toggler float-end" type="button"
                @click="offcanvas.show()">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end" tabindex="-1" ref="offcanvasRef" aria-labelledby="OffcanvasNavbarLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="OffcanvasNavbarLabel">後台管理系統</h5>
                <button type="button" class="btn-close" @click="offcanvas.hide()"></button>
            </div>
            <div class="offcanvas-body">
                <div class="nav nav-pills d-grid gap-2 pe-3">
                    <div class="nav-item">
                        <router-link to="/admin/products" class="text-center text-dark nav-link">
                            <font-awesome-icon icon="fa-brands fa-product-hunt" />
                            商品
                        </router-link>
                    </div>
                    <div class="nav-item">
                        <router-link to="/admin/coupon" class="text-center text-dark nav-link">
                            <i class="bi bi-box-arrow-in-right" />
                            優惠券
                        </router-link>
                    </div>
                    <div class="nav-item">
                        <router-link to="/admin/order" class="text-center text-dark nav-link">
                            <i class="bi bi-sticky"></i>
                            訂單
                        </router-link>
                    </div>
                    <div class="nav-item">
                        <router-link to="/admin/article" class="text-center text-dark nav-link">
                            <i class="bi bi-cart" />
                            文章
                        </router-link>
                    </div>
                    <div class="nav-item">
                        <button class="btn btn-danger w-100" type="button" @click="logout">
                            <i class="bi bi-box-arrow-right"></i>
                            登出
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
<script setup>
    import {inject,onMounted,reactive, useTemplateRef,watch} from 'vue'
    import {useRoute,useRouter}from'vue-router'
    import {Offcanvas} from "bootstrap"
    import useMessageStore from '@/stores/messages'
    const http=inject('http')
    const offcanvasObject = reactive({})
    const offcanvasRef = useTemplateRef('offcanvasRef')
    const route=useRoute()
    const router = useRouter()
    const messageStore = useMessageStore()
    const logout = () => {
        http({
            url: `${import.meta.env.VITE_API}/logout`,
            method: 'POST'
        })
            .then(() => {
                router.push('/login')
            })
            .catch(err => {
                messageStore.pushMessage('danger', '登入失敗', err.message)
            })
    }
    onMounted(() => {
        Object.assign(
            offcanvasObject,
            new Offcanvas(
                offcanvasRef.value,
                {backdrop: true}
            )
        )
    })
    watch(
        route,
        () => {if (document.body.offsetWidth < 992) offcanvasObject?.hide()}
    )
</script>
