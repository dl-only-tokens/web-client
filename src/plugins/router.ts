import { createRouter, createWebHistory, RouteLocationNormalized, useRoute, useRouter } from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

import { isEtherAddress } from './ethers'

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.main,
    component: () => import('@/components/pages/PageWallet.vue'),
  },
  {
    path: '/checkout/:receiver',
    name: ROUTE_NAMES.checkout,
    component: () => import('@/components/pages/Checkout.vue'),
    beforeEnter: (to: RouteLocationNormalized) => {
      if (!isEtherAddress(to.params.receiver as string)) {
        return { name: ROUTE_NAMES.notFound }
      }
    },
  },
  {
    path: '/payment-success',
    name: ROUTE_NAMES.paymentSuccess,
    component: () => import('@/components/pages/PaymentSuccess.vue'),
  },
  {
    path: '/terms-of-use',
    name: ROUTE_NAMES.termsOfUse,
    component: () => import('@/components/pages/TermsOfUse.vue'),
  },
  {
    path: '/privacy-policy',
    name: ROUTE_NAMES.privacyPolicy,
    component: () => import('@/components/pages/PrivacyPolicy.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/components/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router, useRoute, useRouter }
