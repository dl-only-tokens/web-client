<script setup lang="ts">
import { ref } from 'vue'

import { AppContainer, AppPageLoader } from '@/components/common'
import { Balance, PaymentLink, Payments } from '@/components/pages/PageWallet'
import { useAccountStore, useProviderStore } from '@/store'

const address = '19ec1E4b714990620edf41fE28e9a1552953a7F4'

const isLoaded = ref({
  payments: false,
  totalBalance: false,
})

const isRender = ref({
  preloader: true,
  paymentLink: false,
  payments: false,
  totalBalance: false,
})

const accountStore = useAccountStore()
const providerStore = useProviderStore()
accountStore.initAccount()
providerStore.initDefaultProvider()

const handlePaymentsLoaded = () => {
  isLoaded.value.payments = true
  handleComponentsLoaded()
}

const handleTotalBalanceLoaded = () => {
  isLoaded.value.totalBalance = true
  handleComponentsLoaded()
}

const handleComponentsLoaded = () => {
  if (!isLoaded.value.totalBalance || !isLoaded.value.payments) {
    return
  }

  isRender.value.preloader = false
  setTimeout(() => {
    isRender.value.paymentLink = true
  }, 500)
  setTimeout(() => {
    isRender.value.totalBalance = true
  }, 1000)
  setTimeout(() => {
    isRender.value.payments = true
  }, 1500)
}
</script>

<template>
  <app-page-loader v-if="!isRender.paymentLink" :is-hide="!isRender.preloader" />
  <app-container>
    <payment-link :class="{ loaded: isRender.paymentLink }" />
    <balance :class="{ loaded: isRender.totalBalance }" @loaded="handleTotalBalanceLoaded" />
    <payments :address="address" :class="{ loaded: isRender.payments }" @loaded="handlePaymentsLoaded" />
  </app-container>
</template>

<style scoped lang="scss">
.payment-link,
.total-balance,
.payments {
  transition: all 0.75s ease-out;
  opacity: 0;
  margin-top: 96px;
}

.payment-link.loaded,
.total-balance.loaded,
.payments.loaded {
  margin-top: 32px;
  opacity: 1;

  @include respond-to(medium) {
    margin-top: 16px;
  }
}
</style>
