<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { AppContainer, AppPageLoader } from '@/components/common'
import { Balance, PaymentLink, Payments } from '@/components/pages/PageWallet'
import { useERC20, useNative, useOnlyTokensApi } from '@/composables'
import { config } from '@/config'
import { getChainInfoById } from '@/helpers'
import { formatUnits, zeroAddress } from '@/plugins'
import { useAccountStore } from '@/store'

export type PaymentTransfer = {
  date: string
  time: string
  amount: string
  currency: string
  networkFrom: {
    name: string
    txHash: string
    explorerLink: string
  }
  networkTo: {
    name: string
    txHash: string
    explorerLink: string
  }
  sender: string
}

const isReceiverTokenNative = config.SELLER_TOKEN === zeroAddress
const sellerToken = isReceiverTokenNative ? useNative() : useERC20()
const onlyTokensApi = useOnlyTokensApi()
const accountStore = useAccountStore()

accountStore.initAccount()
const { address } = storeToRefs(accountStore)

const accountBalance = ref<string>()
const paymentsData = ref<PaymentTransfer[] | undefined>()

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

const init = async () => {
  await sellerToken.init(isReceiverTokenNative ? config.SWAP_DEFAULT_TO_CHAIN : config.SELLER_TOKEN)
  await loadAccountBalance()
  await loadPaymentTransactions()
}

const loadAccountBalance = async () => {
  if (!address.value) {
    return
  }

  accountBalance.value = await sellerToken.balanceOf(address.value)
  isLoaded.value.totalBalance = true
  handleComponentsLoaded()
}

const loadPaymentTransactions = async () => {
  if (!address.value || sellerToken.decimals.value === 0) {
    return
  }

  const apiTransfers = await onlyTokensApi.getTransfers(address.value)

  const _payments = []
  for (const apiTransfer of apiTransfers) {
    const fromChainInfo = getChainInfoById(apiTransfer.network_from)
    const toChainInfo = getChainInfoById(apiTransfer.network_to)

    const dateObject = new Date(apiTransfer.timestamp)
    const day = dateObject.getDate().toString().padStart(2, '0')
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObject.getFullYear()
    const hours = dateObject.getHours().toString().padStart(2, '0')
    const minutes = dateObject.getMinutes().toString().padStart(2, '0')

    _payments.push({
      date: `${day}-${month}-${year}`,
      time: `${hours}:${minutes}`,
      amount: formatUnits(apiTransfer.value_to, sellerToken.decimals.value, true, 8),
      currency: sellerToken.symbol.value,
      networkFrom: {
        name: fromChainInfo.name,
        txHash: apiTransfer.tx_hash_from,
        explorerLink: `${fromChainInfo.explorerUrl}/tx/${apiTransfer.tx_hash_from}`,
      },
      networkTo: {
        name: toChainInfo.name,
        txHash: apiTransfer.tx_hash_to,
        explorerLink: `${toChainInfo.explorerUrl}/tx/${apiTransfer.tx_hash_to}`,
      },
      sender: apiTransfer.sender,
    })
  }

  paymentsData.value = _payments

  isLoaded.value.payments = true
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

init()
</script>

<template>
  <app-page-loader v-if="!isRender.paymentLink" :is-hide="!isRender.preloader" />
  <app-container>
    <transition name="payment-link-transition">
      <payment-link v-if="isRender.paymentLink" />
    </transition>
    <transition name="total-balance-transition">
      <balance
        v-if="isRender.totalBalance"
        :seller-token="sellerToken"
        :account-balance="accountBalance"
        :load-account-balance="loadAccountBalance"
      />
    </transition>
    <transition name="payments-transition">
      <payments v-if="isRender.payments" :seller-token="sellerToken" :payments="paymentsData" />
    </transition>
  </app-container>
</template>

<style scoped lang="scss">
// Common transition rules
.payment-link-transition-enter-active,
.payment-link-transition-leave-active,
.total-balance-transition-enter-active,
.total-balance-transition-leave-active,
.payments-transition-enter-active,
.payments-transition-leave-active {
  transition: all 1s ease;
  position: absolute;
  width: calc(100% - 48px);

  @include respond-to(mobile) {
    width: calc(100% - 32px);
  }
}

.payment-link-transition-enter-from,
.payment-link-transition-leave-to,
.total-balance-transition-enter-from,
.total-balance-transition-leave-to,
.payments-transition-enter-from,
.payments-transition-leave-to {
  opacity: 0;
}

// `payment-link` transition rules
.payment-link-transition-enter-active,
.payment-link-transition-leave-active {
  top: 0px;
}

.payment-link-transition-enter-from,
.payment-link-transition-leave-to {
  top: 112px;
}

// `total-balance` transition rules
.total-balance-transition-enter-active,
.total-balance-transition-leave-active {
  top: 120px;

  @include respond-to(mobile) {
    top: 116px;
  }
}

.total-balance-transition-enter-from,
.total-balance-transition-leave-to {
  top: 200px;
}

// `payments-transition` transition rules
.payments-transition-enter-active,
.payments-transition-leave-active {
  top: 292px;

  @include respond-to(mobile) {
    top: 318px;
  }
}

.payments-transition-enter-from,
.payments-transition-leave-to {
  top: 372px;
}

.total-balance,
.payments {
  margin-top: 32px;

  @include respond-to(medium) {
    margin-top: 16px;
  }
}
</style>
