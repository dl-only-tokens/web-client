<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { AppContainer, AppPageLoader } from '@/components/common'
import { Balance, PaymentLink, Payments } from '@/components/pages/Wallet/components'
import { useERC20, useNative } from '@/composables'
import { config } from '@/config'
import { getChainInfoById, onlyTokensApiHelper, zeroAddress } from '@/helpers'
import { formatUnits, toBn } from '@/plugins'
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

const isTokenNative = config.SELLER_TOKEN === zeroAddress
const token = isTokenNative ? useNative() : useERC20()
const onlyTokensApi = onlyTokensApiHelper()
const accountStore = useAccountStore()

accountStore.initAccount()
const { address } = storeToRefs(accountStore)

const accountBalance = ref<string>()
const paymentsData = ref<PaymentTransfer[]>([])

const isLoaded = ref({
  payments: false,
  balance: false,
})

const isRender = ref({
  preloader: true,
  pageComponents: false,
  footer: false,
})

const init = async () => {
  await token.init(isTokenNative ? config.SWAP_DEFAULT_TO_CHAIN : config.SELLER_TOKEN)
  await Promise.all([loadAccountBalance(), loadPaymentTransactions()])

  isRender.value.preloader = false
  isRender.value.pageComponents = true

  setTimeout(() => {
    isRender.value.footer = true
  }, 2500)
}

const loadAccountBalance = async () => {
  if (!address.value) {
    return
  }

  accountBalance.value = await token.balanceOf(address.value)

  isLoaded.value.balance = true
}

const loadPaymentTransactions = async () => {
  if (!address.value || token.decimals.value === 0) {
    return
  }

  const apiTransfers = await onlyTokensApi.getTransfers(address.value)
  apiTransfers.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const _payments: PaymentTransfer[] = []
  apiTransfers.map(apiTransfer => {
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
      amount: formatUnits(apiTransfer.value_to, { decimals: token.decimals.value, decimalPlaces: 10 }),
      currency: token.symbol.value,
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
      sender: '0x' + apiTransfer.sender,
    })
  })

  paymentsData.value = _payments

  isLoaded.value.payments = true
}

init()
</script>

<template>
  <app-container :is-footer-visible="isRender.footer">
    <app-page-loader v-if="!isRender.pageComponents" :is-hidden="!isRender.preloader" />
    <transition name="payment-link-transition">
      <payment-link v-if="isRender.pageComponents" />
    </transition>
    <transition name="balance-transition">
      <balance
        v-if="isRender.pageComponents"
        :token="token"
        :account-balance="accountBalance"
        :load-account-balance="loadAccountBalance"
      />
    </transition>
    <transition
      :name="`${toBn(accountBalance).isGreaterThan(0) ? 'payments-transition-withdraw' : 'payments-transition'}`"
    >
      <payments v-if="isRender.pageComponents" :payments="paymentsData" />
    </transition>
  </app-container>
</template>

<style scoped lang="scss">
// Common transition rules
.payment-link-transition-enter-active,
.payment-link-transition-leave-active,
.balance-transition-enter-active,
.balance-transition-leave-active,
.payments-transition-enter-active,
.payments-transition-leave-active,
.payments-transition-withdraw-enter-active,
.payments-transition-withdraw-leave-active {
  transition: all 1s ease;
  position: absolute;
  width: calc(100% - 48px);

  @include respond-to(mobile) {
    width: calc(100% - 32px);
  }
}

.payment-link-transition-enter-active,
.payment-link-transition-leave-active {
  transition-delay: 0.5s;
}

.balance-transition-enter-active,
.balance-transition-leave-active {
  transition-delay: 1s;
}

.payments-transition-enter-active,
.payments-transition-leave-active,
.payments-transition-withdraw-enter-active,
.payments-transition-withdraw-leave-active {
  transition-delay: 1.5s;
}

.payment-link-transition-enter-from,
.payment-link-transition-leave-to,
.balance-transition-enter-from,
.balance-transition-leave-to,
.payments-transition-enter-from,
.payments-transition-leave-to,
.payments-transition-withdraw-enter-from,
.payments-transition-withdraw-leave-to {
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

// `balance` transition rules
.balance-transition-enter-active,
.balance-transition-leave-active {
  top: 120px;

  @include respond-to(mobile) {
    top: 116px;
  }
}

.balance-transition-enter-from,
.balance-transition-leave-to {
  top: 200px;
}

// `payments-transition` transition rules
.payments-transition-enter-active,
.payments-transition-leave-active {
  top: 292px;

  @include respond-to(mobile) {
    top: 258px;
  }
}

.payments-transition-withdraw-enter-active,
.payments-transition-withdraw-leave-active {
  top: 292px;

  @include respond-to(mobile) {
    top: 318px;
  }
}

.payments-transition-enter-from,
.payments-transition-leave-to,
.payments-transition-withdraw-enter-from,
.payments-transition-withdraw-leave-to {
  top: 372px;
}

.balance,
.payments {
  margin-top: 32px;

  @include respond-to(medium) {
    margin-top: 16px;
  }
}
</style>
