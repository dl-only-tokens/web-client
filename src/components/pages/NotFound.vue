<script setup lang="ts">
import { AppContainer, AppIcon } from '@/components/common'
import { ICON_NAMES } from '@/enums'
</script>

<template>
  <app-container>
    <div class="not-found">
      <app-icon :name="ICON_NAMES.flag404" />
      <h4>Page not found</h4>
      <span
        >We couldn't find the page you were looking for. It looks like you've popped into a URL that doesn't
        exist.</span
      >
    </div>
  </app-container>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;

  .app-icon {
    width: 168px;
    height: 168px;

    @include respond-to(mobile) {
      width: 128px;
      height: 128px;
    }
  }

  h4 {
    margin-top: 8px;
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;

    @include respond-to(mobile) {
      font-size: 20px;
    }
  }

  span {
    margin-top: 4px;
    text-align: center;
    color: var(--text-secondary);
    font-size: 16px;
    max-width: 424px;

    @include respond-to(mobile) {
      font-size: 14px;
    }
  }
}
</style>
