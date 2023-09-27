<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AppButtonContainer, AppIcon } from '@/components/common'
import { useNotifications } from '@/composables'
import { ICON_NAME } from '@/enums'
import { useAccountStore } from '@/store'

const notifications = useNotifications()
const accountStore = useAccountStore()
const { address } = storeToRefs(accountStore)

const link = `${window.location.origin}/checkout/${address.value?.substring(2).toLowerCase()}`

const onClickCopy = async () => {
  try {
    await navigator.clipboard.writeText(link)
    notifications.showToastSuccess('Link copied to clipboard.')
  } catch {
    notifications.showToastError('Failed to copy link to clipboard.')
  }
}
</script>

<template>
  <section class="payment-link">
    <h1>Your payment link</h1>
    <app-button-container>
      <a class="payment-link__link" :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
      <app-icon :name="ICON_NAME.copy" @click="onClickCopy" />
    </app-button-container>
  </section>
</template>

<style scoped lang="scss">
.payment-link {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include respond-to(medium) {
    gap: 12px;
  }

  &__link {
    z-index: 1;
    font-family: var(--font-family-primary);
    color: var(--text-text-invert);
    font-weight: 500;
    overflow-wrap: anywhere;
    text-align: left;
    display: flex;
    flex: 1;
    word-break: break-all;
  }

  .app-icon {
    z-index: 1;
    min-height: 20px;
    margin-left: 12px;
  }

  .app-button-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 72px;
    width: 100%;
  }
}
</style>
