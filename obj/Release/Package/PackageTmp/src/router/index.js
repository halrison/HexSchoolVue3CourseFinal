import { createRouter, createWebHashHistory } from 'vue-router'
import FrontLayout from '../layouts/FrontLayout.vue'
import RearLayout from '../layouts/RearLayout.vue'
import guard from './guard'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: FrontLayout,
      children: [
        {
          path: '',
          component: () => import('@/views/FrontStage/HomeView.vue')
        },
        {
          path: 'login',
          component: () => import('@/views/FrontStage/LoginView.vue')
        },
        {
          path:'articles',
          component: () => import('@/views/FrontStage/ArticleList.vue')
        },
        {
          path: 'article',
          component: () => import('@/views/FrontStage/ArticleDetail.vue')
        },
        {
          path:'products',
          component: () => import('@/views/FrontStage/ProductList.vue')
        },
        {
          path: 'product',
          component: () => import('@/views/FrontStage/ProductDetail.vue')
        },
        {
          path: 'order',
          component: () => import('@/views/FrontStage/OrderView.vue')
        },
        {
          path:'cart',
          component:() => import('@/views/FrontStage/CartView.vue')
        }
      ]
    },
    {
      path: '/admin',
      component: RearLayout,
      beforeEnter: async () =>  await guard(),
      children: [
        {
          path: 'product',
          component: () => import('@/views/RearStage/ProductManage.vue')
        },
        {
          path: 'order',
          component: () => import('@/views/RearStage/OrderManage.vue')
        },
        {
          path:'coupon',
          component: () => import('@/views/RearStage/CouponManage.vue')
        },
        {
          path:'article',
          component: () => import('@/views/RearStage/ArticleManage.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  linkActiveClass: 'active'
})
