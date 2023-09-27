<script setup lang="ts">
import { AppButtonOutline } from '@/components/common'
import { ICON_NAME } from '@/enums'
import { useAccountStore } from '@/store'

const accountStore = useAccountStore()

const onButtonClick = async () => {
  await accountStore.initBrowserWallet()
}
</script>

<template>
  <transition name="fade">
    <div v-if="!accountStore.browserWallet.address" class="connect-wallet">
      <h4>To pay the invoice you need to connect a wallet</h4>
      <app-button-outline name="Connect to Metamask" :icon-name="ICON_NAME.metamask" @click="onButtonClick" />
    </div>
  </transition>
</template>

<style scoped lang="scss">
.connect-wallet {
  border-radius: 16px;
  background: var(--bg-tertiary);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @include respond-to(mobile) {
    padding: 24px;
  }

  h4 {
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;
    text-align: center;

    @include respond-to(mobile) {
      font-size: 20px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    height 0.4s,
    padding 0.4s,
    margin-top 0.4s,
    opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  height: 0;
  padding: 0;
  margin-top: -24px;
}
</style>
