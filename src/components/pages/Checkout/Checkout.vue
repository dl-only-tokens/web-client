<script setup lang="ts">
import { useRoute } from 'vue-router'

import { AppContainer } from '@/components/common'
import { CheckoutForm, ConnectWallet, ReceiverInfo } from '@/components/pages/Checkout/components'
import { useERC20, useNative } from '@/composables'
import { config } from '@/config'
import { getChainInfoById, zeroAddress } from '@/helpers'

// Configure router and params
const route = useRoute()
const receiver = route.params.receiver as string

// START configure page variables
const isReceiverTokenNative = config.SELLER_TOKEN === zeroAddress
const receiverToken = isReceiverTokenNative ? useNative() : useERC20()
const toDefaultNetwork = getChainInfoById(config.SWAP_DEFAULT_TO_CHAIN)
</script>

<template>
  <app-container>
    <div class="checkout">
      <connect-wallet />
      <receiver-info :receiver-token="receiverToken" :receiver="receiver" :to-default-network="toDefaultNetwork" />
      <checkout-form
        :receiver-token="receiverToken"
        :receiver="receiver"
        :to-default-network="toDefaultNetwork"
        :is-receiver-token-native="isReceiverTokenNative"
      />
    </div>
  </app-container>
</template>

<style scoped lang="scss">
.checkout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 90px;

  @include respond-to(medium) {
    margin-bottom: 0;
  }

  @include respond-to(mobile) {
    gap: 16px;
  }
}
</style>
