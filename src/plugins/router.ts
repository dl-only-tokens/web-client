import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'

import { ROUTE_NAME } from '@/enums'
import { isEtherAddress } from '@/helpers'

const routes = [
  {
    path: '/',
    name: ROUTE_NAME.main,
    component: () => import('@/components/pages/Wallet/Wallet.vue'),
  },
  {
    path: '/checkout/:receiver',
    name: ROUTE_NAME.checkout,
    component: () => import('@/components/pages/Checkout/Checkout.vue'),
    beforeEnter: (to: RouteLocationNormalized) => {
      if (!isEtherAddress(to.params.receiver as string)) {
        return { name: ROUTE_NAME.notFound }
      }
    },
  },
  {
    path: '/payment-success',
    name: ROUTE_NAME.paymentSuccess,
    component: () => import('@/components/pages/PaymentSuccess.vue'),
  },
  {
    path: '/terms-of-use',
    name: ROUTE_NAME.termsOfUse,
    component: () => import('@/components/pages/TermsOfUse.vue'),
  },
  {
    path: '/privacy-policy',
    name: ROUTE_NAME.privacyPolicy,
    component: () => import('@/components/pages/PrivacyPolicy.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAME.notFound,
    component: () => import('@/components/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router }
