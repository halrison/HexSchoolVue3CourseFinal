<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top h-100 d-flex flex-lg-column">
        <span class="navbar-brand d-flex align-items-center">
            <img src="@\assets\images\apple-icon.png" width="30" height="30" class="mx-1" />
            後臺管理系統
        </span>
        <button class="navbar-toggler float-end me-1" type="button"
                @click="offcanvas.show()">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end" tabindex="-1" ref="OffcanvasNavbar" aria-labelledby="OffcanvasNavbarLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="OffcanvasNavbarLabel">後台管理系統</h5>
                <button type="button" class="btn-close" @click="offcanvas.hide()"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item mt-1">
                        <router-link to="/admin/products" class="nav-link">
                            <div class="text-center text-muted">
                                <font-awesome-icon icon="fa-brands fa-product-hunt" />
                                商品
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item mt-1">
                        <router-link to="/admin/coupon" class="nav-link">
                            <div class="text-center text-muted">
                                <i class="bi bi-box-arrow-in-right" />
                                優惠券
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item mt-1">
                        <router-link to="/admin/order" class="nav-link">
                            <div class="text-center text-muted">
                                <i class="bi bi-sticky"></i>
                                訂單
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item mt-1">
                        <router-link to="/admin/article" class="nav-link">
                            <div class="text-center text-muted">
                                <i class="bi bi-cart" />
                                文章
                            </div>
                        </router-link>
                    </li>
                    <li class="nav-item mt-1">
                        <button class="btn btn-danger w-100" type="button" @click="logout">
                            <div class="text-center text-muted">
                                <i class="bi bi-box-arrow-right"></i>
                                登出
                            </div>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    import {Offcanvas} from "bootstrap"
    export default {
        name: 'SideBar',
        inject: ['emitter'],
        methods: {
            logout () {
                this.$http(`${process.env.VUE_APP_API}/logout`, {
                    method: 'POST',
                })
                    .then(() => {
                        this.$router.push('/login')
                    })
                    .catch(err => {
                        this.emitter.emit('message', {type: 'danger', title: '登入失敗', content: err.message})
                    })
            }
        },
        watch: {
            $route () {
                if (document.body.offsetWidth < 992) {
                    this.offcanvas?.hide();
                }
            }
        },
        data () {
            return {
                offcanvas: {}
            }
        },
        mounted () {
            this.offcanvas = new Offcanvas(
                this.$refs.OffcanvasNavbar,
                {backdrop: true}
            )
        }
    }
</script>
