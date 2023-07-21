<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AppButtonContainer, AppIcon } from '@/components/common'
import { useNotifications } from '@/composables'
import { config } from '@/config'
import { ICON_NAMES } from '@/enums'
import { useAccountStore } from '@/store'

const notifications = useNotifications()
const accountStore = useAccountStore()
const { address } = storeToRefs(accountStore)

const link = `${config.DOMAIN}/checkout/${address.value?.substring(2).toLowerCase()}`

const onClick = () => {
  navigator.clipboard.writeText(link).then(
    () => {
      notifications.showToastSuccess('Link copied to clipboard.')
    },
    () => {
      notifications.showToastError('Failed to copy link to clipboard.')
    },
  )
}
</script>

<template>
  <section class="payment-link">
    <h1>Your payment link</h1>
    <app-button-container @click="onClick">
      <a href="{{ link }}" target="_blank">{{ link }}</a>
      <app-icon :name="ICON_NAMES.copy" />
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

  & > button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 72px;
    width: 100%;

    a {
      font-family: 'Inter';
      color: var(--text-text-invert);
      font-weight: 500;
      overflow-wrap: anywhere;
      text-align: left;
      display: flex;
      flex: 1;
    }

    .app-icon {
      min-height: 20px;
      margin-left: 12px;
    }
  }
}
</style>
