import { createRouter, createWebHashHistory } from 'vue-router'
import FrontStage from '@/layouts/FrontStage.vue'
import RearStage from '@/layouts/RearStage.vue'
import guard from './guard'

export default createRouter( {
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'front',
      component: FrontStage,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import( '@/views/front/HomeView.vue' )
        },
        {
          path: 'login',
          name: 'Login',
          component: () => import( '@/views/front/LoginView.vue' )
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import( '@/views/front/CartView.vue' )
        },
        {
          path: 'products',
          name: 'ProductsF',
          component: () => import( '@/views/front/ProductList.vue' )
        },
        {
          path: 'product',
          name: 'Product',
          component: () => import( '@/views/front/ProductDetail.vue' )
        },
        {
          path: 'order',
          name: 'OrderF',
          component: () => import( '@/views/front/OrderView.vue' )
        },
        {
          path: 'articles',
          name: 'ArticleF',
          component: () => import( '@/views/front/ArticleList.vue' )
        },
        {
          path: 'article',
          name: 'Article',
          component: () => import( '@/views/front/ArticleDetail.vue' )
        }
      ]
    },
    {
      path: '/admin',
      name: 'rear',
      component: RearStage,
      beforeEnter: async () => await guard(),
      children: [
        {
          path: 'products',
          name: 'ProductR',
          component: () => import( '@/views/rear/ProductManage.vue' )
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: () => import( '@/views/rear/CouponManage.vue' )
        },
        {
          path: 'order',
          name: 'OrderR',
          component: () => import( '@/views/rear/OrderManage.vue' )
        },
        {
          path: 'article',
          name: 'ArticleR',
          component: () => import( '@/views/rear/ArticleManage.vue' )
        }
      ]
    }
  ],
  linkActiveClass: 'active'
} )
