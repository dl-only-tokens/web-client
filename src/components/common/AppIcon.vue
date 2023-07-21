<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import { ICON_NAMES } from '@/enums'

const props = defineProps<{
  name: ICON_NAMES
}>()

const icon = defineAsyncComponent(() => import(`../../assets/icons/${props.name}.svg`))
</script>

<template>
  <component :is="icon" class="app-icon" />
</template>
