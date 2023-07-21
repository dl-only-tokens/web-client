import { createRouter, createWebHistory, useRoute, useRouter } from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.main,
    component: () => import('@/components/pages/PageWallet.vue'),
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export { router, useRoute, useRouter }
