import '@/styles/index.scss'

import { createApp } from 'vue'

import App from '@/App.vue'
import { formkitConfig, formkitPlugin, pinia, router, Toast } from '@/plugins'

createApp(App).use(Toast).use(formkitPlugin, formkitConfig).use(router).use(pinia).mount('#app')
